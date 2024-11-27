// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CarbonCreditToken.sol";
import "./ProjectRegistration.sol";

contract Governance is Ownable, ReentrancyGuard {
    // Token and Project Registration contracts
    CarbonCreditToken public immutable cctToken;
    ProjectRegistration public immutable projectReg;

    // Voting tracking mappings
    mapping(uint256 => mapping(address => bool)) public votes;
    mapping(uint256 => address[]) public votersList;
    mapping(uint256 => mapping(address => bool)) public isVoterUnique;
    mapping(uint256 => uint256) public voteCounts;

    // Voting configuration (changed from constant to state variable)
    uint256 public voteThresholdPercentage;

    // Events
    event VotedForProject(uint256 indexed projectId, address indexed voter);
    event ProjectVerified(uint256 indexed projectId);
    event VotingDebugInfo(string message, uint256 value);
    event VoteThresholdUpdated(uint256 newThreshold);

    /**
     * @notice Constructor to initialize the Governance contract
     * @param initialOwner Address of the contract owner
     * @param _cctToken Address of the Carbon Credit Token contract
     * @param _projectReg Address of the Project Registration contract
     */
    constructor(
        address initialOwner, 
        CarbonCreditToken _cctToken, 
        ProjectRegistration _projectReg
    ) Ownable(initialOwner) {
        require(initialOwner != address(0), "Invalid owner address");
        require(address(_cctToken) != address(0), "Invalid token address");
        require(address(_projectReg) != address(0), "Invalid project registration address");

        cctToken = _cctToken;
        projectReg = _projectReg;

        // Initialize vote threshold to 66%
        voteThresholdPercentage = 66;
    }

    /**
     * @notice Vote for a project verification
     * @param _projectId Unique identifier of the project
     */
    function voteForProject(uint256 _projectId) public nonReentrant {
        // Validate voter eligibility
        require(cctToken.balanceOf(msg.sender) > 0, "Must hold CCT to vote");
        require(!votes[_projectId][msg.sender], "Already voted for this project");

        // Record the vote
        votes[_projectId][msg.sender] = true;
        voteCounts[_projectId]++;

        // Track unique voters
        if (!isVoterUnique[_projectId][msg.sender]) {
            votersList[_projectId].push(msg.sender);
            isVoterUnique[_projectId][msg.sender] = true;
        }

        // Emit vote event
        emit VotedForProject(_projectId, msg.sender);

        // Calculate unique voters and threshold
        uint256 uniqueVoters = votersList[_projectId].length;
        uint256 threshold = (uniqueVoters * voteThresholdPercentage) / 100;

        // Debug information
        emit VotingDebugInfo("Unique Voters", uniqueVoters);
        emit VotingDebugInfo("Threshold", threshold);
        emit VotingDebugInfo("Current Vote Count", voteCounts[_projectId]);

        // Check if project meets verification threshold
        if (voteCounts[_projectId] >= threshold) {
            projectReg.verifyProject(_projectId);
            emit ProjectVerified(_projectId);
        }
    }

    /**
     * @notice Get the number of unique voters for a specific project
     * @param _projectId Unique identifier of the project
     * @return Number of unique voters
     */
    function getUniqueVotersCount(uint256 _projectId) public view returns (uint256) {
        return votersList[_projectId].length;
    }

    /**
     * @notice Reset votes for a specific project (can only be called by owner)
     * @param _projectId Unique identifier of the project
     */
    function resetProjectVotes(uint256 _projectId) public onlyOwner {
        delete votersList[_projectId];
        delete voteCounts[_projectId];

        // Reset unique voter tracking
        for (uint256 i = 0; i < votersList[_projectId].length; i++) {
            address voter = votersList[_projectId][i];
            delete votes[_projectId][voter];
            delete isVoterUnique[_projectId][voter];
        }
    }

    /**
     * @notice Allows the owner to update the voting threshold percentage
     * @param _newThresholdPercentage New threshold percentage (0-100)
     */
    function updateVoteThreshold(uint256 _newThresholdPercentage) public onlyOwner {
        require(_newThresholdPercentage > 0 && _newThresholdPercentage <= 100, 
                "Invalid threshold percentage");
        voteThresholdPercentage = _newThresholdPercentage;
        emit VoteThresholdUpdated(_newThresholdPercentage);
    }
}
