const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationCampaign", function () {
  let DonationCampaign;
  let campaign;
  let owner, donor1, donor2;

  beforeEach(async () => {
    [owner, donor1, donor2] = await ethers.getSigners();
    DonationCampaign = await ethers.getContractFactory("DonationCampaign");
    campaign = await DonationCampaign.deploy(
      "Test Campanie",
      "Descriere test",
      ethers.utils.parseEther("1") // Goal = 1 ETH
    );
    await campaign.deployed();
  });

  it("inițializează campania corect", async () => {
    expect(await campaign.title()).to.equal("Test Campanie");
    expect(await campaign.owner()).to.equal(owner.address);
  });

  it("permite donații și actualizează suma strânsă", async () => {
    await campaign.connect(donor1).donate({ value: ethers.utils.parseEther("0.5") });
    expect(await campaign.raised()).to.equal(ethers.utils.parseEther("0.5"));
    expect(await campaign.contributions(donor1.address)).to.equal(ethers.utils.parseEther("0.5"));
  });

  it("nu permite retragere înainte de finalizare sau fără să se atingă targetul", async () => {
    await expect(campaign.withdraw()).to.be.revertedWith("Campania nu este finalizata");

    await campaign.connect(donor1).donate({ value: ethers.utils.parseEther("1") });
    await campaign.finalizeCampaign();

    await expect(campaign.connect(donor1).withdraw()).to.be.revertedWith("Doar proprietarul poate apela");
  });

  it("permite retragerea de către owner după finalizare și atingerea targetului", async () => {
    await campaign.connect(donor1).donate({ value: ethers.utils.parseEther("1") });
    await campaign.finalizeCampaign();

    const initialBalance = await ethers.provider.getBalance(owner.address);
    const tx = await campaign.withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    const finalBalance = await ethers.provider.getBalance(owner.address);
    expect(finalBalance).to.be.above(initialBalance.sub(gasUsed));
  });

  it("permite rambursarea dacă targetul nu a fost atins", async () => {
    await campaign.connect(donor2).donate({ value: ethers.utils.parseEther("0.1") });
    await campaign.finalizeCampaign();

    const initialBalance = await ethers.provider.getBalance(donor2.address);

    const tx = await campaign.connect(donor2).refund();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    const finalBalance = await ethers.provider.getBalance(donor2.address);
    expect(finalBalance).to.be.closeTo(initialBalance, gasUsed.add(ethers.utils.parseEther("0.001")));
  });
});
