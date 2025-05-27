const hre = require("hardhat");
const { campaignAddress } = require("./config");

async function main() {
  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const campaign = await DonationCampaign.attach(campaignAddress);

  const [title, description, owner, goal, raised, createdAt, finalized] = await campaign.getDetails();

  console.log("Detalii campanie:");
  console.log(`Titlu       : ${title}`);
  console.log(`Descriere   : ${description}`);
  console.log(`Proprietar  : ${owner}`);
  console.log(`Țintă       : ${hre.ethers.formatEther(goal)} ETH`);
  console.log(`Strâns      : ${hre.ethers.formatEther(raised)} ETH`);
  console.log(`Finalizată  : ${finalized}`);
  console.log(`Creată la   : ${new Date(Number(createdAt) * 1000).toLocaleString()}`);
}

main().catch((error) => {
  console.error("❌ Eroare la afișarea detaliilor:", error);
  process.exitCode = 1;
});
