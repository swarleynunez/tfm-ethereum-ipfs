pragma solidity ^0.5.8;

contract UserContract {

    // Contract owner (user)
    address public owner;

    // DAppManager address
    address public managerContract;

    // Country chosen by the user
    bytes2 public country;

    // Data storage arrays
    string[] public resources;
    address[] public followings;

    // Events
    //

    // Constructor
    constructor(address origin, bytes2 userCountry) public {

        owner = origin;
        managerContract = msg.sender;
        country = userCountry;
    }

    // Modifiers
    modifier isManager() {

        require(msg.sender == managerContract, 'Unauthorized manager.');
        _;
    }

    // Functions
    function assignNewResource(string memory domain) public isManager {

        resources.push(domain);
    }

    function followUser(address user) public isManager {

        followings.push(user);
    }

    function unfollowUser(address user) public isManager {

        uint totalFollowings = followings.length;

        for (uint i = 0; i < totalFollowings; i++) {

            if (followings[i] == user) {

                if (i != (totalFollowings - 1)) {

                    followings[i] = followings[totalFollowings - 1];
                    break;
                }
            }
        }

        followings.length--;
    }

    function isAlreadyFollowed(address user) public view returns (bool) {

        for (uint i = 0; i < followings.length; i++) {

            if (followings[i] == user) return true;
        }

        return false;
    }

    function getResourcesCount() public view returns (uint) {

        return resources.length;
    }

    function getFollowingsCount() public view returns (uint) {

        return followings.length;
    }
}
