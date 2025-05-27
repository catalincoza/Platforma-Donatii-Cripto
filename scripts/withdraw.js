const hre = require("hardhat");
const { campaignAddress } = require("./config");

async function main() {
  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const campaign = await DonationCampaign.attach(campaignAddress);

  console.log("🔁 Retragem fondurile de către owner...");
  const tx = await campaign.withdraw();
  await tx.wait();

  console.log("✅ Fondurile au fost retrase cu succes.");
}

main().catch((error) => {
  console.error("❌ Eroare la retragere:", error);
  process.exitCode = 1;
});
