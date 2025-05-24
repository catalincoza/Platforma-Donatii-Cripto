const hre = require("hardhat");

async function main() {
  const campaignAddress = "0x..."; // adresa contractului
  const [donator] = await hre.ethers.getSigners();

  const DonationCampaign = await hre.ethers.getContractFactory(
    "DonationCampaign"
  );
  const campaign = await DonationCampaign.attach(campaignAddress);

  const tx = await campaign.connect(donator).refund();
  await tx.wait();

  console.log("Rambursare solicitata pentru:", donator.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
