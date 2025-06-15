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

    address public creator;
    string public title;
    string public description;
    string public category;
    uint256 public goal;
    uint256 public raised;
    uint256 public createdAt;
    bool public finalized;

    Donation[] public donations;
    mapping(address => uint256) public donorContributions;

    event DonationReceived(address indexed donor, uint256 amount, string donorName, string donorEmail, uint256 timestamp);
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
        string memory _category,
        address _creator,
        uint256 _goal
    ) {
        require(_goal > 0, "Obiectivul trebuie sa fie mai mare decat 0");
        require(bytes(_title).length > 0, "Titlul nu poate fi gol");
        require(_creator != address(0), "Adresa creatorului nu poate fi 0");
        require(bytes(_category).length > 0, "Categoria nu poate fi goala");

        title = _title;
        description = _description;
        category = _category;
        creator = _creator;
        goal = _goal;
        createdAt = block.timestamp;
    }

    function donate(string memory _donorName, string memory _donorEmail) external payable notFinalized {
        require(msg.value > 0, "Suma donatiei trebuie sa fie mai mare decat 0");
        string memory donorName = bytes(_donorName).length > 0 ? _donorName : "Anonim";

        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            donorName: donorName,
            donorEmail: _donorEmail,
            timestamp: block.timestamp
        }));

        donorContributions[msg.sender] += msg.value;
        raised += msg.value;

        emit DonationReceived(msg.sender, msg.value, donorName, _donorEmail, block.timestamp);
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
        string memory,
        address,
        uint256,
        uint256,
        bool
    ) {
        return (title, description, category, creator, goal, raised, finalized);
    }
}
