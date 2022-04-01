// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Tickets is Ownable 
{
    uint256 private numberOfgames;    
    struct Ticket
    {
        string gamename;
        uint256 seatNumber;
        uint256 ticketPrice;
        uint256 day;
        uint256 month;
        uint256 year;
        bool sold;
    }
    
    struct Game
    {
        string gamename;
        uint256 numberOfTickets;
        uint256 date;
        uint256 month;
        uint256 year;
        mapping(uint => uint) tickets; //seatnumber to ticketprice
    }
    // Ticket[] private tickets;
    // mapping(Game => uint) public gameticket;
    // mapping(uint => Game) public gameticket;
    // mapping(Game => tickets) public gametickets;
    // Game[] private games;
    
    struct time
    {
        uint256 date;
        uint256 month;
        uint256 year;
    }
    mapping(uint256 => mapping(uint256 => mapping(uint256 =>mapping(string => Game) ))) private games;
    //year->month->date->gamename
    mapping(uint256 => mapping(uint256 => mapping(uint256 =>Ticket[]))) private ticketsoftheday;
    function buytickets(string memory gamename,time memory t,uint256 seatnumber) public payable returns(Ticket memory)
    {
        Game storage g = games[t.year][t.month][t.date][gamename];
        require(g.numberOfTickets>0,'No tickets left');
        require(g.tickets[seatnumber] >0,'This seat is not for sale');
        require(msg.value == g.tickets[seatnumber],'Amount is not equal to ticket price');
        g.tickets[seatnumber] = 0;
        g.numberOfTickets--;
        Ticket memory tt = Ticket(g.gamename,seatnumber,g.tickets[seatnumber],g.date,g.month,g.year,true);
        // ticketsoftheday[t.year][t.month][t.date].push(tt);
        return tt;
    }
    
    // function showtickets(string memory gamename,uint256 date,uint256 month, uint256 year) public view returns(Ticket[] memory)
    // {
    //     Game storage g = games[year][month][date][gamename];
    //     Ticket[] memory t;

    // }
    
    function addtickets(string memory gamename,uint256 date,uint256 month, uint256 year,uint256 seatnumber, uint256 ticketprice) public onlyOwner
    {
        Game storage g = games[year][month][date][gamename];
        require(g.tickets[seatnumber] == 0,"Ticket already present");
        // if(g.tickets[seatnumber] == 0){
            g.numberOfTickets++;
            Ticket memory tt = Ticket(gamename,seatnumber,ticketprice,date,month,year,false);
            ticketsoftheday[year][month][date].push(tt); 
        // }

        g.tickets[seatnumber]=ticketprice;
        // tickets ticket = gametickets[g];
        // for(int i=0;i<ticket.length;i++)
        // {
        //     require(ticket[i] != t,"Ticket already exists");            
        // }
        // ticket.push(t);
        // gametickets[g] = ticket;
        // return true;
    }

    function showallticketsoftheday(uint256 date,uint256 month, uint256 year) public view returns(Ticket[] memory)
    {
        uint256 count=0;
        uint256 j=0;
        for(uint i=0;i<ticketsoftheday[year][month][date].length;i++){
            if(ticketsoftheday[year][month][date][i].sold==false){
                count++;
            }
        }
        Ticket[] memory t = new Ticket[](count);
        for(uint i=0;i<ticketsoftheday[year][month][date].length;i++){
            if(ticketsoftheday[year][month][date][i].sold==false){                
                t[j] = ticketsoftheday[year][month][date][i];
                j++;
            }
        }
        return t;
    }
}