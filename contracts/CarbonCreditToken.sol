// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("CarbonCreditToken", "CCT") Ownable(initialOwner) {}

    // Function to mint new CCT tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to burn CCT tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
