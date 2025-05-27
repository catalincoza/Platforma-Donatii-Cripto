const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // === Configurații inițiale pentru campanie ===
  const title = "Campanie Umanitara";
  const description = "Ajută-ne să strângem fonduri pentru cauza X";
  const goal = hre.ethers.parseEther("1.0"); // 1 ETH

  // === Deploy contract ===
  console.log("🔧 Deploy contract...");
  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const campaign = await DonationCampaign.deploy(title, description, goal);
  await campaign.deploymentTransaction().wait();

  console.log(`✅ Contractul a fost deployat la: ${campaign.target}`);

  // === Salvare ABI + adresă în frontend ===
  const frontendDir = path.join(__dirname, "../frontend/src/contracts");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const artifact = await hre.artifacts.readArtifact("DonationCampaign");

  fs.writeFileSync(
    path.join(frontendDir, "DonationCampaign.json"),
    JSON.stringify(artifact, null, 2)
  );

  fs.writeFileSync(
    path.join(frontendDir, "contract-address.json"),
    JSON.stringify({ DonationCampaign: campaign.target }, null, 2)
  );

  // === Salvare config backend (pentru scripturi Node) ===
  const backendConfigPath = path.join(__dirname, "config.js");
  fs.writeFileSync(
    backendConfigPath,
    `module.exports = {
  campaignAddress: "${campaign.target}",
  donationAmountETH: "0.1"
};\n`
  );

  console.log("✅ ABI și adresă salvate în frontend + config.js backend.");
}

main().catch((error) => {
  console.error("❌ Eroare la deploy:", error);
  process.exit(1);
});
