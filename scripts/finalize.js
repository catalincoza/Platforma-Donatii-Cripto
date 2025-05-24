const hre = require("hardhat");

async function main() {
  const campaignAddress = "0x..."; // adresa contractului

  const DonationCampaign = await hre.ethers.getContractFactory(
    "DonationCampaign"
  );
  const campaign = await DonationCampaign.attach(campaignAddress);

  const tx = await campaign.finalizeCampaign();
  await tx.wait();

  console.log("Campania a fost finalizata.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
