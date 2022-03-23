// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TeamLineup is Ownable {
    uint256[11] private players;

    function changeplayers(uint256[11] memory newplayers) public onlyOwner
    {
        players = newplayers;
    }

    function showplayers() public view returns (uint256[11] memory) 
    {
        return players;
    }
}