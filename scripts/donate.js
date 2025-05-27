const hre = require("hardhat");
const { campaignAddress, donationAmountETH } = require("./config");

async function main() {
  const [donator] = await hre.ethers.getSigners();

  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const campaign = await DonationCampaign.attach(campaignAddress);

  const value = hre.ethers.parseEther(donationAmountETH);

  console.log(`🔁 ${donator.address} donează ${donationAmountETH} ETH...`);
  const tx = await campaign.connect(donator).donate({ value });
  await tx.wait();

  console.log("✅ Donația a fost procesată cu succes.");
}

main().catch((error) => {
  console.error("❌ Eroare la donație:", error);
  process.exitCode = 1;
});
