const hre = require("hardhat");

async function main() {
  const campaignAddress = "0x..."; // adresa contractului

  const DonationCampaign = await hre.ethers.getContractFactory(
    "DonationCampaign"
  );
  const campaign = await DonationCampaign.attach(campaignAddress);

  const tx = await campaign.withdraw();
  await tx.wait();

  console.log("Fondurile au fost retrase.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
