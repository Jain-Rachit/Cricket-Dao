// @ts-ignore
import {ethers,network} from "hardhat";
import {
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs";

// export async function propose(args: any[], functionToCall: string,value: number, proposalDescription: string) {
//   const governor = await ethers.getContract("GovernorContract")
//   const teamlineup = await ethers.getContract("TeamLineup")
//   const encodedFunctionCall = teamlineup.interface.encodeFunctionData(functionToCall, args)    
//   console.log(`Proposing ${functionToCall} on ${teamlineup.address} with ${args}`)
//   console.log(`Proposal Description:\n  ${proposalDescription}`)
//   const proposeTx = await governor.propose(
//     [teamlineup.address],
//     [value],
//     [encodedFunctionCall],
//     proposalDescription
//   )
//     // If working on a development chain, we will push forward till we get to the voting period.
//   if (developmentChains.includes(network.name)) {
//     await moveBlocks(VOTING_DELAY + 1)
//   }
//   const proposeReceipt = await proposeTx.wait(1)
//   const proposalId = proposeReceipt.events[0].args.proposalId
//  const proposalState = await governor.state(proposalId)
//   const proposalSnapShot = await governor.proposalSnapshot(proposalId)
//   const proposalDeadline = await governor.proposalDeadline(proposalId)
//   // save the proposalId
//   let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
//   proposals[network.config.chainId!.toString()].push(proposalId.toString())
//   fs.writeFileSync(proposalsFile, JSON.stringify(proposals))

//   // The state of the proposal. 1 is not passed. 0 is passed.
//   console.log(`Current Proposal State: ${proposalState}`)
//   // What block # the proposal was snapshot
//   console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
//   // The block number the proposal voting expires
//   console.log(`Current Proposal Deadline: ${proposalDeadline}`)
// }
export async function propose_buytickets(args: any[], functionToCall: string, proposalDescription: string) {
  const governor = await ethers.getContract("GovernorContract")
  const tickets = await ethers.getContract("Tickets")
  const encodedFunctionCall = tickets.interface.encodeFunctionData(functionToCall, args)    
  console.log(`Proposing ${functionToCall} on ${tickets.address} with ${args}`)
  console.log(`Proposal Description:\n  ${proposalDescription}`)
  const proposeTx = await governor.propose(
    [tickets.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  )
    // If working on a development chain, we will push forward till we get to the voting period.
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1)
  }
  const proposeReceipt = await proposeTx.wait(1)
  const proposalId = proposeReceipt.events[0].args.proposalId
  
 const proposalState = await governor.state(proposalId)
  const proposalSnapShot = await governor.proposalSnapshot(proposalId)
  const proposalDeadline = await governor.proposalDeadline(proposalId)
  // save the proposalId
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
  proposals[network.config.chainId!.toString()].push(proposalId.toString())
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals))

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`Current Proposal State: ${proposalState}`)
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}
// propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
//   })

propose_buytickets(["CSK vs MI",24,12,2022,23,100],"addtickets" ,"proposal to add tickets" )
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });