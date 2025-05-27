const hre = require("hardhat");
const { campaignAddress } = require("./config");

async function main() {
  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const campaign = await DonationCampaign.attach(campaignAddress);

  console.log("🔁 Finalizăm campania...");
  const tx = await campaign.finalizeCampaign();
  await tx.wait();

  console.log("✅ Campania a fost finalizată.");
}

main().catch((error) => {
  console.error("❌ Eroare la finalizare:", error);
  process.exitCode = 1;
});
