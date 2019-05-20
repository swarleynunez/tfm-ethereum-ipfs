const DAppManager = artifacts.require('DAppManager');
const UserContract = artifacts.require('UserContract');
const BlacklistContract = artifacts.require('BlacklistContract');

let instance;

beforeEach(async () => {
    instance = await DAppManager.new();
});

contract('DAppManager', accounts => {

    /*it('Test 1', async () => {

        let bool = await instance.isUserRegistered(accounts[0]);
        console.log(bool);
    });

    it('Test 2', async () => {

        //await instance.publishNewResource('swarley.com', '/ipfs/QmbezGequPwcsWo8UL4wDF6a8hYwM1hmbzYv2mnKkEWaUp', 'ES');

        let bool = await instance.isDomainChosen('swarley.com', { from: accounts[0] });
        console.log(bool);
    });

    it('Test 3', async () => {

        let utf8 = await web3.utils.utf8ToHex('ES');

        await instance.registerUser(utf8);

        let uContract = await instance.users(accounts[0]);
        console.log(uContract);

        let userInstance = await UserContract.at(uContract);
        let owner = await userInstance.owner();
        let managerContract = await userInstance.managerContract();
        let country = await userInstance.country();
        console.log(owner, managerContract, web3.utils.hexToUtf8(country));
    });

    it('Test 4', async () => {

        let country = await web3.utils.utf8ToHex('ES');

        await instance.registerUser(country, { from: accounts[0] });
        await instance.registerUser(country, { from: accounts[1] });

        await instance.deployNewBlacklist(country, 0);
        let blContract = await instance.blacklists(country);

        let blInstance = await BlacklistContract.at(blContract);
        let managerContract = await blInstance.managerContract();
        let L0_L1 = await blInstance.L0_L1();
        let L1_L2 = await blInstance.L1_L2();
        let L2_L3 = await blInstance.L2_L3();
        console.log(managerContract, L0_L1.toNumber(), L1_L2.toNumber(), L2_L3.toNumber());

        await instance.publishNewResource('swarley.com', '/ipfs/QmbezGequPwcsWo8UL4wDF6a8hYwM1hmbzYv2mnKkEWaUp', country);
        let resource = await instance.searchResource('swarley.com');
        console.log(resource);
        
        await instance.voteResource('swarley.com', { from: accounts[0] });
        await instance.voteResource('swarley.com', { from: accounts[1] });

        let voted = await blInstance.isAlreadyVoted('swarley.com', accounts[0]);
        console.log(voted);

        let level = await blInstance.getResourceLevel('swarley.com');
        console.log(level);
    });

    it('Test 4', async () => {

        let country = await web3.utils.utf8ToHex('ES');

        await instance.registerUser(country, { from: accounts[0] });
        await instance.registerUser(country, { from: accounts[1] });
        await instance.registerUser(country, { from: accounts[2] });
        await instance.registerUser(country, { from: accounts[3] });

        await instance.manageUserFollowings(accounts[1], { from: accounts[0] });
        await instance.manageUserFollowings(accounts[2], { from: accounts[0] });
        await instance.manageUserFollowings(accounts[3], { from: accounts[0] });
        await instance.manageUserFollowings(accounts[3], { from: accounts[0] });
    });*/
});
