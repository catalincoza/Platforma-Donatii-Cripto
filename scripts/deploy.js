const hre = require("hardhat");

async function main() {
  // Parametrii campaniei
  const title = "Campanie Umanitara";
  const description = "Ajută-ne să strângem fonduri pentru cauza X";
  const goal = hre.ethers.utils.parseEther("1"); // 1 ETH

  // Contract factory
  const DonationCampaign = await hre.ethers.getContractFactory(
    "DonationCampaign"
  );
  const campaign = await DonationCampaign.deploy(title, description, goal);

  await campaign.deployed();

  console.log(`Contractul a fost deployat la: ${campaign.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
