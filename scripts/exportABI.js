// scripts/exportABI.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const artifact = await hre.artifacts.readArtifact("DonationCampaign");

  const frontendDir = path.join(__dirname, "../frontend/src/contracts");
  fs.writeFileSync(
    path.join(frontendDir, "DonationCampaign.json"),
    JSON.stringify(artifact, null, 2)
  );

  console.log("✅ DonationCampaign.json salvat.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
