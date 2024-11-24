require('dotenv').config();
const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");
const Governance = artifacts.require("Governance");

module.exports = function (deployer) {
    deployer.deploy(CarbonCreditToken, process.env.INITIAL_OWNER_ADDRESS).then(function () {
        return deployer.deploy(ProjectRegistration, process.env.INITIAL_OWNER_ADDRESS).then(function () {
            return deployer.deploy(Governance, process.env.INITIAL_OWNER_ADDRESS, CarbonCreditToken.address, ProjectRegistration.address);
        });
    });
};
