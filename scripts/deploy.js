const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const title = "Campanie Umanitara";
  const description = "Ajută-ne să strângem fonduri pentru cauza X";
  const goal = hre.ethers.parseEther("1");

  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const campaign = await DonationCampaign.deploy(title, description, goal);

  const receipt = await campaign.deploymentTransaction().wait();
  console.log(`✅ Contractul a fost deployat la: ${campaign.target}`);

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

  fs.writeFileSync(
    path.join(__dirname, "config.js"),
    `module.exports = {
  campaignAddress: "${campaign.target}",
  donationAmountETH: "0.1"
};\n`
  );

  console.log("✅ Adresa și ABI-ul au fost salvate în frontend și config.js");
}

main().catch((error) => {
  console.error("❌ Eroare la deploy:", error);
  process.exitCode = 1;
});
