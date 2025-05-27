const hre = require("hardhat");
const { campaignAddress } = require("./config");

async function main() {
  const DonationCampaign = await hre.ethers.getContractFactory("DonationCampaign");
  const campaign = await DonationCampaign.attach(campaignAddress);

  const goal = await campaign.goal();
  const raised = await campaign.raised();
  const finalized = await campaign.finalized();

  console.log(`📈 Țintă:  ${hre.ethers.formatEther(goal)} ETH`);
  console.log(`📥 Strâns: ${hre.ethers.formatEther(raised)} ETH`);
  console.log(`⏹ Finalizată: ${finalized}`);

  if (!finalized) {
    console.log("🔸 Campania este activă. Se pot primi donații.");
  } else if (raised >= goal) {
    console.log("✅ Campania a reușit. Owner-ul poate retrage fondurile.");
  } else {
    console.log("🔁 Campania a eșuat. Donatorii pot solicita rambursări.");
  }
}

main().catch((error) => {
  console.error("❌ Eroare la verificarea statusului:", error);
  process.exitCode = 1;
});
