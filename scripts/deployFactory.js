const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // 1. Deploy contract factory
  const DonationCampaignFactory = await hre.ethers.getContractFactory("DonationCampaignFactory");
  const factory = await DonationCampaignFactory.deploy();
  await factory.waitForDeployment();

  const address = await factory.getAddress();
  console.log(`✅ Factory deployat la: ${address}`);

  // 2. Creează folderul frontend/src/contracts dacă nu există
  const frontendDir = path.join(__dirname, "../frontend/src/contracts");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  // 3. Salvează ABI pentru DonationCampaignFactory
  const factoryArtifact = await hre.artifacts.readArtifact("DonationCampaignFactory");
  fs.writeFileSync(
    path.join(frontendDir, "DonationCampaignFactory.json"),
    JSON.stringify(factoryArtifact, null, 2)
  );

  // 4. Salvează ABI pentru DonationCampaign
  const campaignArtifact = await hre.artifacts.readArtifact("DonationCampaign");
  fs.writeFileSync(
    path.join(frontendDir, "DonationCampaign.json"),
    JSON.stringify(campaignArtifact, null, 2)
  );

  // 5. Salvează adresa în frontend
  fs.writeFileSync(
    path.join(frontendDir, "factory-address.json"),
    JSON.stringify({ DonationCampaignFactory: address }, null, 2)
  );

  // 6. Salvează și pentru backend (opțional)
  fs.writeFileSync(
    path.join(__dirname, "factory-config.js"),
    `module.exports = {
  factoryAddress: "${address}"
};\n`
  );

  console.log("✅ ABI-urile și adresa factory salvate cu succes în frontend și backend.");
}

main().catch((error) => {
  console.error("❌ Eroare la deploy factory:", error);
  process.exitCode = 1;
});
