const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const frontendDir = path.join(__dirname, "../frontend/src/contracts");

  // === 1. Citește adresa factory din JSON
  const factoryAddressJson = JSON.parse(
    fs.readFileSync(path.join(frontendDir, "factory-address.json"))
  );
  const factoryAddress = factoryAddressJson.DonationCampaignFactory;

  // === 2. Conectare la contractul factory
  const DonationCampaignFactory = await hre.ethers.getContractFactory("DonationCampaignFactory");
  const factory = DonationCampaignFactory.attach(factoryAddress);

  // === 3. Obține conturile (admin + user)
  const [admin, user] = await hre.ethers.getSigners();

  // === 4. Campanii demo pentru fiecare categorie
  const demoCampaigns = [
    {
      title: "Ajutor pentru educație în zone rurale",
      description: "Campanie pentru rechizite și transport elevi",
      category: "educatie",
      goalEth: "2.0",
    },
    {
      title: "Intervenție chirurgicală urgentă",
      description: "Ajutor medical pentru copil diagnosticat recent",
      category: "medical",
      goalEth: "5.0",
    },
    {
      title: "Adăpost pentru animale abandonate",
      description: "Hrănire și îngrijire pentru 30 de câini",
      category: "animale",
      goalEth: "3.5",
    },
    {
      title: "Startup de tehnologie verde",
      description: "Soluții eco pentru orașe inteligente",
      category: "business",
      goalEth: "4.0",
    },
    {
      title: "Ajutor pentru victimele inundațiilor",
      description: "Refacerea caselor și bunurilor distruse",
      category: "emergenta",
      goalEth: "6.0",
    },
  ];

  for (const [index, c] of demoCampaigns.entries()) {
    console.log(`\n📦 (${index + 1}/${demoCampaigns.length}) Propunem campania: ${c.title} [${c.category}]`);

    const proposeTx = await factory.connect(user).proposeCampaign(
      c.title,
      c.description,
      c.category,
      hre.ethers.parseEther(c.goalEth)
    );
    await proposeTx.wait();

    const proposals = await factory.getProposals();
    const latestIndex = proposals.length - 1;
    console.log(`📝 Propunere înregistrată cu indexul: ${latestIndex}`);

    const acceptTx = await factory.connect(admin).acceptProposal(latestIndex);
    const receipt = await acceptTx.wait();

    const event = receipt.logs.find(log => log.fragment?.name === "CampaignAccepted");
    if (event) {
      const newAddress = event.args.contractAddress;
      console.log(`✅ Campanie acceptată la adresa: ${newAddress}`);
    } else {
      console.warn("⚠️ Nu s-a putut extrage adresa din log.");
    }
  }

  console.log("\n🎉 Toate campaniile demo au fost create!");
}

main().catch((error) => {
  console.error("❌ Eroare în deployCampaign:", error);
  process.exitCode = 1;
});
