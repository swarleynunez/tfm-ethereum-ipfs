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
    });*/

    it('Test 4', async () => {

        let country = await web3.utils.utf8ToHex('ES');

        await instance.registerUser(country, { from: accounts[0] });
        let uContract = await instance.users(accounts[0]);
        console.log(uContract);

        await instance.deployNewBlacklist(country, 1999);
        let blContract = await instance.blacklists(country);
        console.log(blContract);

        let blInstance = await BlacklistContract.at(blContract);
        let managerContract = await blInstance.managerContract();
        let L0_L1 = await blInstance.L0_L1();
        let L1_L2 = await blInstance.L1_L2();
        let L2_L3 = await blInstance.L2_L3();
        console.log(managerContract, L0_L1.toNumber(), L1_L2.toNumber(), L2_L3.toNumber());

        await instance.publishNewResource('swarley.com', '/ipfs/QmbezGequPwcsWo8UL4wDF6a8hYwM1hmbzYv2mnKkEWaUp', country);
        let resource = await instance.resources('swarleey.com');
        console.log(resource['ipnsHash'], resource['country'], resource['isChosen']);
    });
});
