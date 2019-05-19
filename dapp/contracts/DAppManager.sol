pragma solidity ^0.5.8;

import "./UserContract.sol";
import "./BlacklistContract.sol";

contract DAppManager {

    // Contract owner (developer)
    address public owner;

    // Resource data structure
    struct Resource {

        string ipnsHash;
        bytes2 country;
        bool isChosen;
    }

    // Data storage mappings
    mapping(string => Resource) public resources;
    mapping(address => address) public users;
    mapping(bytes2 => address) public blacklists;

    // Events
    //

    // Constructor
    constructor() public {

        owner = msg.sender;
    }

    // Functions
    function publishNewResource(string memory domain, string memory ipnsHash, bytes2 country) public {

        require(isUserRegistered(msg.sender), 'The user is not registered.');
        require(!isDomainChosen(domain), 'The domain is already taken.');
        require(isBlacklistDeployed(country), 'The blacklist is not yet deployed.');

        // Store the new resource
        Resource storage resource = resources[domain];
        resource.ipnsHash = ipnsHash;
        resource.country = country;
        resource.isChosen = true;

        // Assign resource to its owner
        UserContract user = UserContract(users[msg.sender]);
        user.assignNewResource(domain);

        // Register resource in its blacklist
        BlacklistContract blacklist = BlacklistContract(blacklists[country]);
        blacklist.initializeNewResource(domain);
    }

    function registerUser(bytes2 userCountry) public {

        require(!isUserRegistered(msg.sender), 'The user is already registered.');

        users[msg.sender] = address(new UserContract(msg.sender, userCountry));
    }

    function deployNewBlacklist(bytes2 country, uint votesLimit) public {

        require(!isBlacklistDeployed(country), 'The blacklist of this country is already deployed.');

        blacklists[country] = address(new BlacklistContract(votesLimit));
    }

    function voteResource(string memory domain) public {

        require(isUserRegistered(msg.sender), 'The user is not registered.');
        require(isDomainChosen(domain), 'The resource is not published.');

        // Get resource country
        Resource memory resource = resources[domain];

        // Get user country
        UserContract user = UserContract(users[msg.sender]);

        require(resource.country == user.country(), 'The user can not vote the resource.');

        // Search blacklist and vote resource
        BlacklistContract blacklist = BlacklistContract(blacklists[resource.country]);
        blacklist.addVoteToResource(domain, msg.sender);
    }

    function isDomainChosen(string memory domain) public view returns (bool) {

        Resource memory resource = resources[domain];
        return resource.isChosen;
    }

    function isUserRegistered(address userAddress) public view returns (bool) {

        address userContract = users[userAddress];

        if (userContract != address(0)) return true;
        else return false;
    }

    function isBlacklistDeployed(bytes2 country) public view returns (bool) {

        address blacklistContract = blacklists[country];

        if (blacklistContract != address(0)) return true;
        else return false;
    }
}
