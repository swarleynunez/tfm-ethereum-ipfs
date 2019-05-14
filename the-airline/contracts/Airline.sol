pragma solidity ^0.5.8;

contract Airline {

    // Contract owner address
    address private owner;

    struct User {

        //string name;
        //string surname;
        uint flightsCount;
        uint loyaltyPoints;
    }

    struct Flight {

        string origin;
        string destination;
        uint price;
    }

    // Data storage variables
    mapping(address => User) public users;
    Flight[] public flights;
    mapping(address => Flight[]) public usersFlights;

    // Other
    uint etherPerPoint = 0.1 ether;

    // Events
    event onFlightPurchase(address indexed user, string origin, string destination, uint price);

    constructor() public {

        owner = msg.sender;
        flights.push(Flight('Alicante', 'Londres', 2 ether));
        flights.push(Flight('Madrid', 'Tokio', 5 ether));
        flights.push(Flight('Madrid', 'San Francisco', 5 ether));
        flights.push(Flight('Barcelona', 'Roma', 1 ether));
        flights.push(Flight('Valencia', 'Atenas', 2 ether));
    }

    modifier isOwner() {
        if (msg.sender == owner) _;
    }

    function buyFlight(uint flightIndex) public payable {

        // Check the flight
        Flight memory flight = flights[flightIndex];
        require(msg.value == flight.price, 'Wrong ether value provided');

        // Update user data
        User storage user = users[msg.sender];
        user.flightsCount++;
        user.loyaltyPoints += 5;
        usersFlights[msg.sender].push(flight);

        // Send the events
        emit onFlightPurchase(msg.sender, flight.origin, flight.destination, flight.price);
    }

    function redeemLoyaltyPoints() public {

        User storage user = users[msg.sender];
        uint etherToRefund = etherPerPoint * user.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        user.loyaltyPoints = 0;     // Important
    }

    function getRefundableEther() public view returns (uint) {

        return etherPerPoint * users[msg.sender].loyaltyPoints;
    }

    function getAirlineBalance() public isOwner view returns (uint) {

        return address(this).balance;
    }

    function getFlightsCount() public view returns (uint) {

        return flights.length;
    }
}
