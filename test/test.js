const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");
const Governance = artifacts.require("Governance");

contract("AfriCO-X", (accounts) => {
    const [owner, user1, user2] = accounts;

    describe("Contract Deployments", () => {
        let carbonCreditToken;
        let projectRegistration;
        let governance;

        it("should deploy CarbonCreditToken", async () => {
            console.log("Attempting to deploy CarbonCreditToken with owner:", owner);
            try {
                carbonCreditToken = await CarbonCreditToken.new(owner);
                console.log("CarbonCreditToken deployed at:", carbonCreditToken.address);
                assert(carbonCreditToken.address, "CarbonCreditToken deployment failed");
            } catch (error) {
                console.error("CarbonCreditToken deployment error:", error);
                throw error;
            }
        });

        it("should deploy ProjectRegistration", async () => {
            console.log("Attempting to deploy ProjectRegistration with owner:", owner);
            try {
                projectRegistration = await ProjectRegistration.new(owner);
                console.log("ProjectRegistration deployed at:", projectRegistration.address);
                assert(projectRegistration.address, "ProjectRegistration deployment failed");
            } catch (error) {
                console.error("ProjectRegistration deployment error:", error);
                throw error;
            }
        });

        it("should deploy Governance", async () => {
            console.log("Attempting to deploy Governance");
            try {
                // Make sure we have the required addresses
                assert(carbonCreditToken.address, "CarbonCreditToken not deployed");
                assert(projectRegistration.address, "ProjectRegistration not deployed");

                governance = await Governance.new(
                    owner,
                    carbonCreditToken.address,
                    projectRegistration.address
                );
                console.log("Governance deployed at:", governance.address);
                assert(governance.address, "Governance deployment failed");
            } catch (error) {
                console.error("Governance deployment error:", error);
                throw error;
            }
        });

        // Basic functionality test
        it("should verify contract connections", async () => {
            try {
                const tokenAddress = await governance.cctToken();
                const projectRegAddress = await governance.projectReg();
                
                assert.equal(tokenAddress, carbonCreditToken.address, "Wrong token address in Governance");
                assert.equal(projectRegAddress, projectRegistration.address, "Wrong project registration address in Governance");
            } catch (error) {
                console.error("Verification error:", error);
                throw error;
            }
        });

        it("should submit and verify a project", async () => {
            try {
                await projectRegistration.submitProject("Project 1", "Details 1", { from: user1 });
                const projectId = 1;

                await carbonCreditToken.mint(user1, 100, { from: owner });
                await governance.voteForProject(projectId, { from: user1 });

                const project = await projectRegistration.projects(projectId);
                assert(project.verified, "Project was not verified");
            } catch (error) {
                console.error("Project submission and verification error:", error);
                throw error;
            }
        });

        it("should prevent multiple votes from the same user", async () => {
            try {
                await projectRegistration.submitProject("Project 2", "Details 2", { from: user1 });
                const projectId = 2;

                await carbonCreditToken.mint(user1, 100, { from: owner });
                await governance.voteForProject(projectId, { from: user1 });

                try {
                    await governance.voteForProject(projectId, { from: user1 });
                    assert.fail("Expected revert not received");
                } catch (error) {
                    assert(error.message.includes("Already voted for this project"), "Expected revert message not received");
                }
            } catch (error) {
                console.error("Multiple votes prevention error:", error);
                throw error;
            }
        });
    });
});
