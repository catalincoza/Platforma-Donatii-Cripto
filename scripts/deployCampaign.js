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

  // === 4. Propunere campanie nouă
  const title = "Campanie de test rapid";
  const description = "Aceasta este o campanie creată din script";
  const goal = hre.ethers.parseEther("1.0");

  console.log("🚀 Propunem o campanie nouă...");
  const proposeTx = await factory.connect(user).proposeCampaign(title, description, goal);
  await proposeTx.wait();

  // === 5. Obține indexul ultimei propuneri
  const proposals = await factory.getProposals();
  const latestIndex = proposals.length - 1;

  console.log(`📄 Ultima propunere are indexul: ${latestIndex}`);

  // === 6. Acceptare propunere (admin)
  console.log(`✅ Acceptăm propunerea de la indexul ${latestIndex}...`);
  const acceptTx = await factory.connect(admin).acceptProposal(latestIndex);
  const receipt = await acceptTx.wait();

  // === 7. Găsește adresa noului contract din eveniment
  const event = receipt.logs.find(log => log.fragment?.name === "CampaignAccepted");
  if (event) {
    const newAddress = event.args.contractAddress;
    console.log(`🎉 Campania a fost acceptată și creată la adresa: ${newAddress}`);
  } else {
    console.warn("⚠️ Campania a fost creată, dar nu s-a extras adresa din eveniment.");
  }
}

main().catch((error) => {
  console.error("❌ Eroare în deployCampaign:", error);
  process.exitCode = 1;
});
