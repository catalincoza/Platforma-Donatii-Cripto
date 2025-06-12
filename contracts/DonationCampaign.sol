// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DonationCampaign {
    struct Donation {
        address donor;
        uint256 amount;
        string donorName;
        string donorEmail;
        uint256 timestamp;
    }

    struct CampaignDetails {
        string title;
        string description;
        address creator;
        uint256 goal;
        uint256 raised;
        uint256 createdAt;
        bool finalized;
    }

    address public creator;
    string public title;
    string public description;
    uint256 public goal;
    uint256 public raised;
    uint256 public createdAt;
    bool public finalized;

    Donation[] public donations;
    mapping(address => uint256) public donorContributions;

    event DonationReceived(
        address indexed donor,
        uint256 amount,
        string donorName,
        string donorEmail,
        uint256 timestamp
    );
    
    event CampaignFinalized(uint256 totalRaised);

    modifier onlyCreator() {
        require(msg.sender == creator, "Doar creatorul poate executa aceasta actiune");
        _;
    }

    modifier notFinalized() {
        require(!finalized, "Campania este deja finalizata");
        _;
    }

    constructor(
        string memory _title,
        string memory _description,
        address _creator,
        uint256 _goal
    ) {
        require(_goal > 0, "Obiectivul trebuie sa fie mai mare decat 0");
        require(bytes(_title).length > 0, "Titlul nu poate fi gol");
        require(_creator != address(0), "Adresa creatorului nu poate fi 0");

        title = _title;
        description = _description;
        creator = _creator;
        goal = _goal;
        raised = 0;
        createdAt = block.timestamp;
        finalized = false;
    }

    function donate(string memory _donorName, string memory _donorEmail) 
        external 
        payable 
        notFinalized 
    {
        require(msg.value > 0, "Suma donatiei trebuie sa fie mai mare decat 0");
        
        _processDonation(_donorName, _donorEmail);
    }

    function _processDonation(string memory _donorName, string memory _donorEmail) 
        internal 
    {
        // Default name if empty
        string memory donorName = bytes(_donorName).length > 0 ? _donorName : "Anonim";
        
        // Create donation record
        Donation memory newDonation = Donation({
            donor: msg.sender,
            amount: msg.value,
            donorName: donorName,
            donorEmail: _donorEmail,
            timestamp: block.timestamp
        });

        donations.push(newDonation);
        donorContributions[msg.sender] += msg.value;
        raised += msg.value;

        emit DonationReceived(
            msg.sender,
            msg.value,
            donorName,
            _donorEmail,
            block.timestamp
        );
    }

    function finalizeCampaign() public onlyCreator notFinalized {
        require(raised > 0, "Nu exista fonduri de retras");
        
        finalized = true;
        uint256 amount = address(this).balance;
        
        (bool success, ) = payable(creator).call{value: amount}("");
        require(success, "Transferul a esuat");
        
        emit CampaignFinalized(raised);
    }

    function getDetails() external view returns (
        string memory,
        string memory,
        address,
        uint256,
        uint256,
        uint256,
        bool
    ) {
        return (
            title,
            description,
            creator,
            goal,
            raised,
            createdAt,
            finalized
        );
    }

    function getDonationsCount() external view returns (uint256) {
        return donations.length;
    }

    function getDonation(uint256 index) external view returns (
        address donor,
        uint256 amount,
        string memory donorName,
        string memory donorEmail,
        uint256 timestamp
    ) {
        require(index < donations.length, "Index invalid");
        Donation memory donation = donations[index];
        return (
            donation.donor,
            donation.amount,
            donation.donorName,
            donation.donorEmail,
            donation.timestamp
        );
    }

    function getAllDonations() external view returns (
        address[] memory donors,
        uint256[] memory amounts,
        string[] memory names,
        string[] memory emails,
        uint256[] memory timestamps
    ) {
        uint256 length = donations.length;
        
        donors = new address[](length);
        amounts = new uint256[](length);
        names = new string[](length);
        emails = new string[](length);
        timestamps = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            donors[i] = donations[i].donor;
            amounts[i] = donations[i].amount;
            names[i] = donations[i].donorName;
            emails[i] = donations[i].donorEmail;
            timestamps[i] = donations[i].timestamp;
        }
    }

    function getProgressPercentage() external view returns (uint256) {
        if (goal == 0) return 0;
        return (raised * 100) / goal;
    }

    function canFinalize() external view returns (bool) {
        return !finalized && raised >= goal && msg.sender == creator;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Emergency function - doar pentru situații extreme
    function emergencyWithdraw() external onlyCreator {
        require(block.timestamp > createdAt + 365 days, "Campania este prea recenta");
        
        finalized = true;
        uint256 amount = address(this).balance;
        
        (bool success, ) = payable(creator).call{value: amount}("");
        require(success, "Transferul a esuat");
        
        emit CampaignFinalized(raised);
    }

    // Fallback function pentru a primi ETH direct
    receive() external payable notFinalized {
        require(msg.value > 0, "Suma donatiei trebuie sa fie mai mare decat 0");
        _processDonation("Anonim", "");
    }
}