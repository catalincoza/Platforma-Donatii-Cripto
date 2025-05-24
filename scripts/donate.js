const hre = require("hardhat");

async function main() {
  const campaignAddress = "0x..."; // adresa contractului deja deployat
  const [donator] = await hre.ethers.getSigners();

  const DonationCampaign = await hre.ethers.getContractFactory(
    "DonationCampaign"
  );
  const campaign = await DonationCampaign.attach(campaignAddress);

  const tx = await campaign
    .connect(donator)
    .donate({ value: hre.ethers.utils.parseEther("0.1") });
  await tx.wait();

  console.log("Donatie trimisa de pe:", donator.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
