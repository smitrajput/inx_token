var InternCoin = artifacts.require("./INX.sol");

module.exports = function (deployer) {
    deployer.deploy(InternCoin(10000, "InternCoin", 18, "INX"));
};
