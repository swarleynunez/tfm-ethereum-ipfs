pragma solidity ^0.5.7;

contract UsersContract {

    // User object
    struct UserStruct {

        string name;
        string surname;
        bool isRegistered;
    }

    // Users database
    mapping(address => UserStruct) private users;

    // Users count
    uint private usersCount;

    // Events
    event onRegisterUser(address, string);

    // Public functions
    function registerUser(string memory name, string memory surname) public {

        require(!isUserRegistered(msg.sender));
        UserStruct storage user = users[msg.sender];
        user.name = name;
        user.surname = surname;
        user.isRegistered = true;
        usersCount++;

        // Send the event
        emit onRegisterUser(msg.sender, string(abi.encodePacked(name, " ", surname)));
    }

    function getUser(address addr) public view returns (string memory, string memory) {

        require(isUserRegistered(addr));
        UserStruct memory user = users[addr];
        return (user.name, user.surname);
    }

    function getUsersCount() public view returns (uint) {

        return usersCount;
    }

    // Private functions
    function isUserRegistered(address addr) private view returns (bool) {

        return users[addr].isRegistered;
    }
}