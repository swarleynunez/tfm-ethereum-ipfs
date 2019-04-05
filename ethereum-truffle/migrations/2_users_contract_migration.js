const UsersContract = artifacts.require("UsersContract");

module.exports = function(deployer) {
    deployer.deploy(UsersContract);
}
