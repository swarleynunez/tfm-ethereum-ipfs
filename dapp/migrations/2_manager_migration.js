const DAppManager = artifacts.require("DAppManager");

module.exports = function(deployer) {
    deployer.deploy(DAppManager);
};
