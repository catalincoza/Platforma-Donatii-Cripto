const hre = require("hardhat");
const { campaignAddress } = require("./config");

async function main() {
  const [donator] = await hre.ethers.getSigners();

  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const campaign = await DonationCampaign.attach(campaignAddress);

  console.log(`🔁 Donatorul ${donator.address} solicită rambursare...`);
  const tx = await campaign.connect(donator).refund();
  await tx.wait();

  console.log("✅ Rambursarea a fost efectuată cu succes.");
}

main().catch((error) => {
  console.error("❌ Eroare la rambursare:", error);
  process.exitCode = 1;
});
