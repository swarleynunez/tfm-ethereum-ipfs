pragma solidity ^0.5.8;

contract BlacklistContract {

    // DAppManager address
    address public managerContract;

    // List identifiers
    byte private constant L0 = 0x00;
    byte private constant L1 = 0x01;
    byte private constant L2 = 0x02;
    byte private constant L3 = 0x03;

    // Limits between lists
    uint public L0_L1;
    uint public L1_L2;
    uint public L2_L3;

    // Resource votes data structure
    struct Voting {

        address[] voters;
        bool isVotedHere;
    }

    // Data storage mapping
    mapping(string => Voting) private votings;

    // Events
    //

    // Constructor
    constructor(uint votesLimit) public {

        managerContract = msg.sender;
        L2_L3 = votesLimit;                 // 100%
        L1_L2 = votesLimit * 80 / 100;      // 80%
        L0_L1 = votesLimit * 10 / 100;      // 10%
    }

    // Modifiers
    modifier isManager() {

        require(msg.sender == managerContract, 'Unauthorized manager.');
        _;
    }

    // Functions
    function initializeNewResource(string memory domain) public isManager {

        Voting storage voting = votings[domain];
        voting.isVotedHere = true;
    }

    function addVoteToResource(string memory domain, address user) public isManager {

        require(!isAlreadyVoted(domain, user), 'The user has already voted the resource.');

        Voting storage voting = votings[domain];
        voting.voters.push(user);
    }

    function isAlreadyVoted(string memory domain, address user) public view returns (bool) {

        address[] memory voters = votings[domain].voters;

        for (uint i = 0; i < voters.length; i++) {

            if (voters[i] == user) return true;
        }

        return false;
    }

    function getResourceLevel(string memory domain) public view returns (byte) {

        uint totalVotes = votings[domain].voters.length;

        if (totalVotes < L0_L1) return L0;
        else if (totalVotes < L1_L2) return L1;
        else if (totalVotes < L2_L3) return L2;
        else return L3;
    }
}
