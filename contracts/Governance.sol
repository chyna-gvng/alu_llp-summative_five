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

        if (voteCounts[_id] > cctToken.totalSupply() / 2) {
            projectReg.verifyProject(_id);
            emit ProjectVerified(_id);
        }
    }
}
