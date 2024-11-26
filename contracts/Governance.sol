// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CarbonCreditToken.sol";
import "./ProjectRegistration.sol";

contract Governance is Ownable, ReentrancyGuard {
    CarbonCreditToken public cctToken;
    ProjectRegistration public projectReg;

    mapping(uint256 => mapping(address => bool)) public votes;
    mapping(uint256 => uint256) public voteCounts;

    event VotedForProject(uint256 indexed id, address indexed voter);
    event ProjectVerified(uint256 indexed id);
    event DebugInfo(string message, uint256 value);

    constructor(address initialOwner, CarbonCreditToken _cctToken, ProjectRegistration _projectReg) Ownable(initialOwner) {
        cctToken = _cctToken;
        projectReg = _projectReg;
    }

    function voteForProject(uint256 _id) public nonReentrant {
        require(cctToken.balanceOf(msg.sender) > 0, "Must hold CCT to vote");
        require(!votes[_id][msg.sender], "Already voted for this project");

        votes[_id][msg.sender] = true;
        voteCounts[_id]++;

        emit VotedForProject(_id, msg.sender);

        // Debugging events
        uint256 totalSupply = cctToken.totalSupply();
        uint256 threshold = totalSupply / 2;
        emit DebugInfo("Total Supply", totalSupply);
        emit DebugInfo("Threshold", threshold);
        emit DebugInfo("Vote Counts for Project", voteCounts[_id]);

        if (voteCounts[_id] > threshold) {
            projectReg.verifyProject(_id);
            emit ProjectVerified(_id);
        }
    }
}
