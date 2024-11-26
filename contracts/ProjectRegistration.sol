// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ProjectRegistration is Ownable {
    struct Project {
        string name;
        string details;
        bool verified;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectSubmitted(uint256 indexed id, string name, string details);
    event ProjectVerified(uint256 indexed id);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function submitProject(string memory _name, string memory _details) public {
        projectCount++;
        projects[projectCount] = Project(_name, _details, false);
        emit ProjectSubmitted(projectCount, _name, _details);
    }

    function verifyProject(uint256 _id) public onlyOwner {
        projects[_id].verified = true;
        emit ProjectVerified(_id);
    }
}
