pragma solidity ^0.5.8;

contract UserContract {

    // Contract owner (user)
    address private owner;

    // DAppManager address
    address public managerContract;

    // Country chosen by the user
    bytes2 public country;

    // Data storage arrays
    string[] public userResources;
    address[] private userFollowings;

    // Events
    //

    // Constructor
    constructor(address origin, bytes2 userCountry) public {

        owner = origin;
        managerContract = msg.sender;
        country = userCountry;
    }

    // Modifiers
    modifier isOwner() {

        require(msg.sender == owner, 'Unauthorized user.');
        _;
    }

    modifier isManager() {

        require(msg.sender == managerContract, 'Unauthorized manager.');
        _;
    }

    // Functions
    function assignNewResource(string memory domain) public isManager {

        userResources.push(domain);
    }
}
