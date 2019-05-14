const Airline = artifacts.require("Airline");

module.exports = function(deployer) {
    deployer.deploy(Airline);
};
