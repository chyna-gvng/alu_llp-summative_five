const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");
const Governance = artifacts.require("Governance");

module.exports = function (deployer, network, accounts) {
  const initialOwner = accounts[0]; // Use the first account from Ganache as the initial owner

  deployer.deploy(CarbonCreditToken, initialOwner)
    .then(function () {
      return deployer.deploy(ProjectRegistration, initialOwner);
    })
    .then(function () {
      return deployer.deploy(Governance, initialOwner, CarbonCreditToken.address, ProjectRegistration.address);
    });
};
