const CarbonCreditToken = artifacts.require("CarbonCreditToken");
const ProjectRegistration = artifacts.require("ProjectRegistration");
const Governance = artifacts.require("Governance");

contract("AfriCO-X", (accounts) => {
    const [owner, user1, user2, user3] = accounts;

    let carbonCreditToken;
    let projectRegistration;
    let governance;

    beforeEach(async () => {
        // Deploy CarbonCreditToken
        carbonCreditToken = await CarbonCreditToken.new(owner);
        // Deploy ProjectRegistration
        projectRegistration = await ProjectRegistration.new(owner);
        // Deploy Governance
        governance = await Governance.new(owner, carbonCreditToken.address, projectRegistration.address);
    });

    describe("Contract Deployments", () => {
        it("should deploy CarbonCreditToken", async () => {
            assert.notEqual(carbonCreditToken.address, 0x0, "CarbonCreditToken deployment failed");
        });

        it("should deploy ProjectRegistration", async () => {
            assert.notEqual(projectRegistration.address, 0x0, "ProjectRegistration deployment failed");
        });

        it("should deploy Governance", async () => {
            assert.notEqual(governance.address, 0x0, "Governance deployment failed");
        });

        it("should verify contract connections", async () => {
            const tokenAddress = await governance.cctToken();
            const projectRegAddress = await governance.projectReg();

            assert.equal(tokenAddress, carbonCreditToken.address, "Wrong token address in Governance");
            assert.equal(projectRegAddress, projectRegistration.address, "Wrong project registration address in Governance");
        });
    });

    describe("CarbonCreditToken", () => {
        it("should mint tokens", async () => {
            await carbonCreditToken.mint(user1, 100, { from: owner });
            const balance = await carbonCreditToken.balanceOf(user1);
            assert.equal(balance.toString(), "100", "Minting failed");
        });

        it("should burn tokens", async () => {
            await carbonCreditToken.mint(user1, 100, { from: owner });
            await carbonCreditToken.burn(50, { from: user1 });
            const balance = await carbonCreditToken.balanceOf(user1);
            assert.equal(balance.toString(), "50", "Burning failed");
        });
    });

    describe("ProjectRegistration", () => {
        it("should submit a project", async () => {
            await projectRegistration.submitProject("Project 1", "Details 1", { from: user1 });
            const project = await projectRegistration.projects(1);
            assert.equal(project.name, "Project 1", "Project submission failed");
            assert.equal(project.details, "Details 1", "Project submission failed");
            assert.equal(project.verified, false, "Project should not be verified initially");
        });

        it("should verify a project", async () => {
            await projectRegistration.submitProject("Project 2", "Details 2", { from: user1 });
            await projectRegistration.verifyProject(2, { from: owner });
            const project = await projectRegistration.projects(2);
            assert.equal(project.verified, true, "Project verification failed");
        });
    });

    describe("Governance", () => {
        it("should vote for a project", async () => {
            await projectRegistration.submitProject("Project 3", "Details 3", { from: user1 });
            await carbonCreditToken.mint(user1, 100, { from: owner });
            await carbonCreditToken.mint(user2, 100, { from: owner });
            await carbonCreditToken.mint(user3, 100, { from: owner }); // Mint tokens to user3 as well
            await governance.voteForProject(1, { from: user1 });
            await governance.voteForProject(1, { from: user2 }); // user2 votes as well
            await governance.voteForProject(1, { from: user3 }); // user3 votes as well
            const project = await projectRegistration.projects(1);
            assert.equal(project.verified, true, "Project should be verified after voting");
        });

        it("should prevent multiple votes from the same user", async () => {
            await projectRegistration.submitProject("Project 4", "Details 4", { from: user1 });
            await carbonCreditToken.mint(user1, 100, { from: owner });
            await governance.voteForProject(2, { from: user1 });

            try {
                await governance.voteForProject(2, { from: user1 });
                assert.fail("Expected revert not received");
            } catch (error) {
                assert(error.message.includes("Already voted for this project"), "Expected revert message not received");
            }
        });
    });
});
