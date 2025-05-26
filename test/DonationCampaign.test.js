const { expect } = require("chai");

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
      ethers.parseEther("1") // target = 1 ETH
    );
    await campaign.waitForDeployment();
  });

  it("inițializează campania corect", async () => {
    expect(await campaign.title()).to.equal("Test Campanie");
    expect(await campaign.owner()).to.equal(owner.address);
  });

  it("permite donații și actualizează suma strânsă", async () => {
    const donatie = ethers.parseEther("0.5");
    await campaign.connect(donor1).donate({ value: donatie });

    const raised = await campaign.raised();
    const contributie = await campaign.contributions(donor1.address);

    expect(raised).to.equal(donatie);
    expect(contributie).to.equal(donatie);
  });

  it("nu permite retragere înainte de finalizare sau fără să se atingă targetul", async () => {
    await expect(campaign.withdraw()).to.be.revertedWith("Campania nu este finalizata");

    await campaign.connect(donor1).donate({ value: ethers.parseEther("1") });
    await campaign.finalizeCampaign();

    await expect(campaign.connect(donor1).withdraw()).to.be.revertedWith("Doar proprietarul poate apela");
  });

  it("permite retragerea de către owner după finalizare și atingerea targetului", async () => {
    const donatie = ethers.parseEther("1");
    await campaign.connect(donor1).donate({ value: donatie });
    await campaign.finalizeCampaign();

    // Check contract balance before withdrawal
    const contractBalance = await ethers.provider.getBalance(await campaign.getAddress());
    expect(contractBalance).to.equal(donatie);

    // Check that withdraw function executes successfully
    await expect(campaign.withdraw()).to.not.be.reverted;

    // Check that withdrawn flag is set
    expect(await campaign.withdrawn()).to.equal(true);

    // Check that contract balance is now zero
    const finalContractBalance = await ethers.provider.getBalance(await campaign.getAddress());
    expect(finalContractBalance).to.equal(0);
  });

  it("permite rambursarea dacă targetul nu a fost atins", async () => {
    const donatie = ethers.parseEther("0.1");

    await campaign.connect(donor2).donate({ value: donatie });
    await campaign.finalizeCampaign();

    // Check that the contract has the donated amount
    const contractBalance = await ethers.provider.getBalance(await campaign.getAddress());
    expect(contractBalance).to.equal(donatie);

    // Check that refund function executes successfully
    await expect(campaign.connect(donor2).refund()).to.not.be.reverted;

    // Check that the donor's contribution is reset to 0
    const contribution = await campaign.contributions(donor2.address);
    expect(contribution).to.equal(0);

    // Check that contract balance is now zero (funds were refunded)
    const finalContractBalance = await ethers.provider.getBalance(await campaign.getAddress());
    expect(finalContractBalance).to.equal(0);
  });

  // Additional tests for better coverage
  it("nu permite donații după finalizare", async () => {
    await campaign.finalizeCampaign();
    
    await expect(
      campaign.connect(donor1).donate({ value: ethers.parseEther("0.1") })
    ).to.be.revertedWith("Campania a fost finalizata");
  });

  it("nu permite rambursarea dacă targetul a fost atins", async () => {
    await campaign.connect(donor1).donate({ value: ethers.parseEther("1") });
    await campaign.finalizeCampaign();

    await expect(
      campaign.connect(donor1).refund()
    ).to.be.revertedWith("Target-ul a fost atins, nu se pot face rambursari");
  });

  it("nu permite retragerea dublă", async () => {
    await campaign.connect(donor1).donate({ value: ethers.parseEther("1") });
    await campaign.finalizeCampaign();
    
    await campaign.withdraw();
    
    await expect(campaign.withdraw()).to.be.revertedWith("Fondurile au fost deja retrase");
  });

  it("acceptă donații prin receive function", async () => {
    const donatie = ethers.parseEther("0.3");
    
    // Send ETH directly to contract address
    await donor1.sendTransaction({
      to: await campaign.getAddress(),
      value: donatie
    });

    const raised = await campaign.raised();
    const contributie = await campaign.contributions(donor1.address);

    expect(raised).to.equal(donatie);
    expect(contributie).to.equal(donatie);
  });

  it("returnează detaliile campaniei corect", async () => {
    const details = await campaign.getDetails();
    
    expect(details[0]).to.equal("Test Campanie"); // title
    expect(details[1]).to.equal("Descriere test"); // description
    expect(details[2]).to.equal(owner.address); // owner
    expect(details[3]).to.equal(ethers.parseEther("1")); // goal
    expect(details[4]).to.equal(0); // raised (initial)
    expect(details[6]).to.equal(false); // finalized (initial)
  });
});