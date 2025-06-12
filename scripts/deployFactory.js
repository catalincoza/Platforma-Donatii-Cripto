const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const DonationCampaignFactory = await hre.ethers.getContractFactory("DonationCampaignFactory");
  const factory = await DonationCampaignFactory.deploy();
  await factory.waitForDeployment();

  const address = await factory.getAddress();
  console.log(`✅ Factory deployat la: ${address}`);

  // === Salvare în frontend ===
  const frontendDir = path.join(__dirname, "../frontend/src/contracts");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  // === ABI Factory
  const factoryArtifact = await hre.artifacts.readArtifact("DonationCampaignFactory");
  fs.writeFileSync(
    path.join(frontendDir, "DonationCampaignFactory.json"),
    JSON.stringify(factoryArtifact, null, 2)
  );

  // === ABI DonationCampaign
  const campaignArtifact = await hre.artifacts.readArtifact("DonationCampaign");
  fs.writeFileSync(
    path.join(frontendDir, "DonationCampaign.json"),
    JSON.stringify(campaignArtifact, null, 2)
  );

  // === Adresă Factory
  fs.writeFileSync(
    path.join(frontendDir, "factory-address.json"),
    JSON.stringify({ DonationCampaignFactory: address }, null, 2)
  );

  // === Opțional: config backend
  fs.writeFileSync(
    path.join(__dirname, "factory-config.js"),
    `module.exports = {
  factoryAddress: "${address}"
};\n`
  );

  console.log("✅ ABI-urile și adresa factory salvate în frontend.");
}

main().catch((error) => {
  console.error("❌ Eroare la deploy factory:", error);
  process.exitCode = 1;
});
