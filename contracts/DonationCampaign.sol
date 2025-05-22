// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title DonationCampaign
 * @notice Gestionează o campanie de donații: acceptă donații, rambursări dacă nu se atinge ținta,
 * și permite proprietarului să retragă fondurile.
 */
contract DonationCampaign {
    // Metadate campanie
    string public title;             // Titlul campaniei
    string public description;       // Descrierea campaniei
    address public owner;            // Adresa celui care a creat campania
    uint256 public goal;             // Suma țintă (în wei)
    uint256 public raised;           // Totalul fondurilor strânse
    uint256 public createdAt;        // Timpul la care a fost creată campania
    bool public finalized;           // Dacă a fost finalizată campania
    bool public withdrawn;           // Dacă fondurile au fost deja retrase

    // Mapare între adresele donatorilor și suma donată
    mapping(address => uint256) public contributions;

    // Evenimente pentru transparență (frontend și loguri)
    event DonationReceived(address indexed donor, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event RefundIssued(address indexed donor, uint256 amount);
    event CampaignFinalized(bool successful);

    // Modifier pentru a restricționa accesul doar proprietarului
    modifier onlyOwner() {
        require(msg.sender == owner, "Doar proprietarul poate apela");
        _;
    }

    // Modifier care permite executia doar daca campania e finalizata
    modifier onlyFinalized() {
        require(finalized, "Campania nu este finalizata");
        _;
    }

    /**
     * @dev Constructorul setează metadatele campaniei
     * @param _title Titlul campaniei
     * @param _description Descrierea campaniei
     * @param _goal Suma țintă dorită (în wei)
     */
    constructor(
        string memory _title,
        string memory _description,
        uint256 _goal
    ) {
        require(_goal > 0, "Pragul trebuie sa fie pozitiv");
        title = _title;
        description = _description;
        goal = _goal;
        owner = msg.sender;
        createdAt = block.timestamp;
        finalized = false;
        withdrawn = false;
    }

    /**
     * @dev Permite oricui să trimită o donație în ETH către contract
     */
    function donate() public payable {
        require(!finalized, "Campania a fost finalizata");
        require(msg.value > 0, "Donatia trebuie sa fie mai mare decat zero");
        contributions[msg.sender] += msg.value;
        raised += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    /**
     * @dev Finalizează campania - poate fi apelată o singură dată de către owner
     */
    function finalizeCampaign() external onlyOwner {
        require(!finalized, "Campania este deja finalizata");
        finalized = true;
        bool successful = raised >= goal;
        emit CampaignFinalized(successful);
    }

    /**
     * @dev Retrage fondurile strânse, dacă s-a atins obiectivul. Poate fi apelată o singură dată.
     */
    function withdraw() external onlyOwner onlyFinalized {
        require(raised >= goal, "Target-ul nu a fost atins");
        require(!withdrawn, "Fondurile au fost deja retrase");

        withdrawn = true;
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);

        emit FundsWithdrawn(owner, balance);
    }

    /**
     * @dev Rambursează automat contribuțiile, dacă campania a eșuat (nu a atins goal)
     */
    function refund() external onlyFinalized {
        require(raised < goal, "Target-ul a fost atins, nu se pot face rambursari");

        uint256 contributed = contributions[msg.sender];
        require(contributed > 0, "Nu exista contributii de rambursat");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributed);

        emit RefundIssued(msg.sender, contributed);
    }

    /**
     * @dev Returnează toate detaliile campaniei (pentru interfața frontend)
     */
    function getDetails()
        external
        view
        returns (
            string memory _title,
            string memory _description,
            address _owner,
            uint256 _goal,
            uint256 _raised,
            uint256 _createdAt,
            bool _finalized
        )
    {
        return (title, description, owner, goal, raised, createdAt, finalized);
    }

    /**
     * @dev Permite trimiterea directă de ETH la contract ca donație (fallback)
     */
    receive() external payable {
        donate();
    }

    fallback() external payable {
        donate();
    }
}
