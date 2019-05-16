pragma solidity ^0.5.8;

contract BlacklistContract {

    // DAppManager address
    address public managerContract;

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

    function addVoteToResource(string memory domain, address userAddress) public isManager {

        //require(!isAlreadyVotedByUser(domain, userAddress), 'The user has already voted the resource.');

        Voting storage voting = votings[domain];
        voting.voters.push(userAddress);
    }

    // TODO
    function isAlreadyVotedByUser(string memory domain, address userAddress) public isManager view returns (bool) {

        
    }
}
