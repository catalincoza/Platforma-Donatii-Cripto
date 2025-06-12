// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./DonationCampaign.sol";

contract DonationCampaignFactory {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Proposal {
        address proposer;
        string title;
        string description;
        uint256 goal;
        bool approved;
        bool rejected;
    }

    Proposal[] public proposals;
    DonationCampaign[] public campaigns;

    event CampaignProposed(uint indexed proposalId, address proposer);
    event CampaignAccepted(uint indexed proposalId, address contractAddress);
    event CampaignRejected(uint indexed proposalId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Doar adminul poate face asta");
        _;
    }

    function proposeCampaign(string memory _title, string memory _description, uint256 _goal) external {
        require(_goal > 0, "Suma trebuie sa fie pozitiva");

        proposals.push(Proposal({
            proposer: msg.sender,
            title: _title,
            description: _description,
            goal: _goal,
            approved: false,
            rejected: false
        }));

        emit CampaignProposed(proposals.length - 1, msg.sender);
    }

    function acceptProposal(uint _id) external onlyAdmin {
        require(_id < proposals.length, "ID propunere invalid");
        Proposal storage proposal = proposals[_id];
        require(!proposal.approved && !proposal.rejected, "Deja procesat");

        // Creează campania cu toți cei 4 parametri necesari
        DonationCampaign newCampaign = new DonationCampaign(
            proposal.title,
            proposal.description,
            proposal.proposer,  // <- Adăugat parametrul _creator
            proposal.goal
        );

        campaigns.push(newCampaign);
        proposal.approved = true;

        emit CampaignAccepted(_id, address(newCampaign));
    }

    function rejectProposal(uint _id) external onlyAdmin {
        require(_id < proposals.length, "ID propunere invalid");
        Proposal storage proposal = proposals[_id];
        require(!proposal.approved && !proposal.rejected, "Deja procesat");

        proposal.rejected = true;

        emit CampaignRejected(_id);
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    function getCampaigns() external view returns (DonationCampaign[] memory) {
        return campaigns;
    }

    function getCampaignAddress(uint _index) external view returns (address) {
        require(_index < campaigns.length, "Index invalid");
        return address(campaigns[_index]);
    }

    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }

    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    // Funcție utilă pentru a obține detaliile unei propuneri
    function getProposal(uint _id) external view returns (
        address proposer,
        string memory title,
        string memory description,
        uint256 goal,
        bool approved,
        bool rejected
    ) {
        require(_id < proposals.length, "ID propunere invalid");
        Proposal storage proposal = proposals[_id];
        return (
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.goal,
            proposal.approved,
            proposal.rejected
        );
    }
}