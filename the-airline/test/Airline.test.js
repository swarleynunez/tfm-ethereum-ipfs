const Airline = artifacts.require('Airline');

let instance;

beforeEach(async() => {
    instance = await Airline.new();
});

contract('Airline', accounts => {

    // Test 1
    it('Should exist available flights', async() => {

        let totalFlightsCount = await instance.getFlightsCount();
        assert.equal(totalFlightsCount, 5);     // Be careful with BN format
    });

    // Test 2
    it('Should allow users to buy a flight providing ether', async() => {

        let flight = await instance.flights(0);
        let flightOrigin = flight[0];
        let flightDestination = flight[1];
        let flightPrice = flight[2];

        await instance.buyFlight(0, { from: accounts[0], value: flightPrice });
        let newUserFlight = await instance.usersFlights(accounts[0], 0);

        let user = await instance.users(accounts[0]);
        let userFlightsCount = user[0].toNumber();

        assert.equal(newUserFlight[0], flightOrigin);
        assert.equal(newUserFlight[1], flightDestination);
        assert.equal(web3.utils.fromWei(newUserFlight[2], 'ether'), web3.utils.fromWei(flightPrice, 'ether'));
        assert.equal(userFlightsCount, 1);
    });

    // Test 3
    it('Should not allow to buy a flight without required ether', async() => {

        let flight = await instance.flights(0);
        let flightPrice = flight[2] - 3000;

        try {

            await instance.buyFlight(0, { from: accounts[0], value: flightPrice });
        }
        catch (e) { return; }

        assert.fail('Enough ether...');
    });

    // Test 4
    it('Should get the correct contract balance', async() => {

        let flight1 = await instance.flights(0);
        let flightPrice1 = flight1[2];
        let flight2 = await instance.flights(1);
        let flightPrice2 = flight2[2];

        await instance.buyFlight(0, { from: accounts[0], value: flightPrice1 });
        await instance.buyFlight(1, { from: accounts[0], value: flightPrice2 });

        let auxBalance = await instance.getAirlineBalance();
        let airlineBalance = Number(web3.utils.fromWei(auxBalance));   // By default to ether
        let spentEther = Number(web3.utils.fromWei(flightPrice1)) + Number(web3.utils.fromWei(flightPrice2));

        assert.equal(airlineBalance, spentEther);
    });

    it('Should allow users to redeem loyalty points', async() => {

        let flight = await instance.flights(0);
        let flightPrice = flight[2];
        await instance.buyFlight(0, { from: accounts[0], value: flightPrice });

        // Check user loyalty points (before)
        let user1 = await instance.users(accounts[0]);
        let initUserLoyaltyPoints = user1[1];

        // Check user balances
        let initUserBalance = await web3.eth.getBalance(accounts[0]);
        await instance.redeemLoyaltyPoints({ from: accounts[0] });
        let finalUserBalance = await web3.eth.getBalance(accounts[0]);

        // Check user loyalty points (after)
        let user2 = await instance.users(accounts[0]);
        let finalUserLoyaltyPoints = user2[1];

        assert.equal(initUserLoyaltyPoints, 5);
        assert(initUserBalance < finalUserBalance);     // Alias of assert.ok()
        assert.equal(finalUserLoyaltyPoints, 0);
    });
});
