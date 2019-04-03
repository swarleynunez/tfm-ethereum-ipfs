const assert = require('assert');
const AssertionError = require('assert').AssertionError;
const Web3 = require('web3');
//const chalk = require('chalk');

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
const web3 = new Web3(provider);

const output = require('../scripts/compile');
const contractName = 'UsersContract';
//console.log(output.contracts[contractName + '.sol'][contractName].abi);     
//console.log('\n' + chalk.green(output.contracts[contractName + '.sol'][contractName].evm.bytecode.object));

// Application Binary Interface
const abi = output.contracts[contractName + '.sol'][contractName].abi;

// Bytecode
const bytecode = output.contracts[contractName + '.sol'][contractName].evm.bytecode.object;

let accounts;
let usersContract;

// Before each it()
beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    usersContract = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode
        })
        .send({
            from: accounts[0],
            gas: 1000000
        });
});

// Mocha section
describe('+ Testing UsersContract:', async() => {

    // Test 1
    it('Should deploy', () => {

        assert.ok(usersContract.options.address);
    });

    // Test 2
    it('Should register a new user', async() => {

        await usersContract.methods.registerUser('Carlos', 'Núñez')
            .send({
                from: accounts[0],
                gas: 500000
            });
    });

    // Test 3
    it('Should retrieve a user', async() => {

        let name = 'Carlos';
        let surname = 'Núñez';

        await usersContract.methods.registerUser(name, surname)
            .send({
                from: accounts[0],
                gas: 500000
            });

        let user = await usersContract.methods.getUser(accounts[0]).call();
        assert.equal(name, user[0]);
        assert.equal(surname, user[1]);
    });

    // Test 4
    it('Should not allow to register the same account twice', async() => {

        await usersContract.methods.registerUser('Isabel', 'Sanz')
            .send({
                from: accounts[1],  // Same account
                gas: 500000
            });

        try {

            await usersContract.methods.registerUser('Juan', 'Gómez')
                .send({
                    from: accounts[1],  // Same account
                    gas: 500000
                });

            // If this line is reached, test is failed
            assert.fail('Same account cant register twice');
        } 
        catch (e) {

            // This catch is always reached
            if (e instanceof AssertionError) assert.fail(e);
        }
    });

    // Test 5
    it('Should not retrieve a inexistent user', async() => {

        try {
            
            await usersContract.methods.getUser(accounts[0]).call();

            // If this line is reached, test is failed
            assert.fail('User should not be registered');
        }
        catch (e) {

            // This catch is always reached
            if (e instanceof AssertionError) assert.fail(e);
        }
    });

    // Test 6
    it('Should retrieve a user count', async() => {

        await usersContract.methods.registerUser('Carlos', 'Núñez')
            .send({
                from: accounts[0],
                gas: 500000
            });

        let usersCount = await usersContract.methods.getUsersCount().call();
        assert.equal(usersCount, 1);
    });
});
