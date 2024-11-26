const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");
const Governance = artifacts.require("Governance");

module.exports = async function(callback) {
    const accounts = await web3.eth.getAccounts();

    // Get the deployed instances of the contracts
    const carbonCreditToken = await CarbonCreditToken.deployed();
    const projectRegistration = await ProjectRegistration.deployed();
    const governance = await Governance.deployed();

    // Mint tokens to an address
    await carbonCreditToken.mint(accounts[1], 100, { from: accounts[0] });
    console.log("Minted 100 tokens to account 1");

    // Check the balance of the address
    const balance = await carbonCreditToken.balanceOf(accounts[1]);
    console.log("Balance of account 1:", balance.toString());

    // Submit a project
    await projectRegistration.submitProject("Project 1", "Details 1", { from: accounts[1] });
    console.log("Submitted Project 1");

    // Verify the project
    await projectRegistration.verifyProject(1, { from: accounts[0] });
    console.log("Verified Project 1");

    // Vote for a project
    await governance.voteForProject(1, { from: accounts[1] });
    console.log("Voted for Project 1");

    // Check if the project is verified
    const project = await projectRegistration.projects(1);
    console.log("Project 1 verified:", project.verified);

    callback();
};
