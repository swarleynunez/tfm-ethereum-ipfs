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
    mapping(string => Resource) private resources;
    mapping(address => address) public users;
    mapping(bytes2 => address) public blacklists;
    bytes2[] public blacklistsDeployed;

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
        require(isBlacklistDeployed(userCountry), 'The user country blacklist is not yet deployed.');

        users[msg.sender] = address(new UserContract(msg.sender, userCountry));
    }

    function deployNewBlacklist(bytes2 country, uint votesLimit) public {

        require(!isBlacklistDeployed(country), 'The blacklist of this country is already deployed.');

        blacklists[country] = address(new BlacklistContract(votesLimit));
        blacklistsDeployed.push(country);
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

    function manageUserFollowings(address anotherUser) public {

        require(msg.sender != anotherUser, 'The user can not follow/unfollow himself.');
        require(isUserRegistered(msg.sender), 'The sender user is not registered.');
        require(isUserRegistered(anotherUser), 'The another user is not registered.');

        UserContract user = UserContract(users[msg.sender]);

        if (user.isAlreadyFollowed(anotherUser)) user.unfollowUser(anotherUser);
        else user.followUser(anotherUser);
    }

    function searchResource(string memory domain) public view returns (string memory, bytes2, byte) {

        byte L3 = 0x03;

        Resource memory resource = resources[domain];

        if (resource.isChosen) {

            BlacklistContract blacklist = BlacklistContract(blacklists[resource.country]);
            byte resourceLevel = blacklist.getResourceLevel(domain);

            if (resourceLevel != L3) return (resource.ipnsHash, resource.country, resourceLevel);
        }

        return ('', 0x0000, 0x00);
    }

    function isDomainChosen(string memory domain) public view returns (bool) {

        Resource memory resource = resources[domain];
        return resource.isChosen;
    }

    function isUserRegistered(address user) public view returns (bool) {

        address userContract = users[user];

        if (userContract != address(0)) return true;
        else return false;
    }

    function isBlacklistDeployed(bytes2 country) public view returns (bool) {

        address blacklistContract = blacklists[country];

        if (blacklistContract != address(0)) return true;
        else return false;
    }

    function getBlacklistsCount() public view returns (uint) {

        return blacklistsDeployed.length;
    }
}
