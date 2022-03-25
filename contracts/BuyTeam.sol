// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BuyTeam is Ownable {
    // enum quality {
    //     batsman,
    //     bolwer,
    //     allrounder
    // }
    struct Batsman {
        uint256 innings;
        uint256 highestscore;
        uint256 halfcentury;
        uint256 century;
        uint256 scoringrate;
    }

    struct Bolwer {
        uint256 overs;
        uint256 wickets;
        uint256 mostwickets;
        uint256 economyrate;
    }
    struct Player {
        uint256 number;
        string name;
        uint256 amount;
        Batsman batsmanstats;
        Bolwer bowlerstats;
    }

    // Player[] private Players;
    uint256[] private jerseynumbers;
    mapping(uint256 => Player) player; //jerseynumber to player

    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function addplayers(Player memory p) public onlyOwner returns (bool) {
        for (uint256 i = 0; i < jerseynumbers.length; i++) {
            string memory s = player[jerseynumbers[i]].name;
            // require(Players[i].number != p.number,"Player already added");
            require(compareStrings(s, p.name) == false, "Player already added");
        }
        // Players.push(p);
        jerseynumbers.push(p.number);
        player[p.number] = p;
        return true;
    }

    function removeplayer(uint256 index) public onlyOwner{
        jerseynumbers[index] = jerseynumbers[jerseynumbers.length - 1];
        jerseynumbers.pop();
        player[index] = Player(0,'',0,Batsman(0,0,0,0,0),Bolwer(0,0,0,0));
    }

    function showplayers(uint256 jerseynumber)
        public
        view
        returns (Player memory)
    {
        string memory s = player[jerseynumber].name;
        require(compareStrings('',s)==false && player[jerseynumber].number!=0,'No such jersey number');
        return player[jerseynumber];
    }

    function changeplayer(Player memory p) public onlyOwner{
        uint256 jerseynumber = p.number;
        string memory s = player[jerseynumber].name;
        require(compareStrings('',s)==false && player[jerseynumber].number!=0,'No such jersey number');
        player[jerseynumber] = p;
    }
}
