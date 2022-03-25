// @ts-ignore
import { ethers, network } from "hardhat";
import {
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  MIN_DELAY,
  developmentChains,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import { moveTime } from "../utils/move-time";

export async function queueAndExecute(contractname: string) {
  const args = ["CSK vs MI", 24, 12, 2022, 23,100];
  const functionToCall = "addtickets";
   const teamlineup = await ethers.getContract(contractname);
   const encodedFunctionCall = teamlineup.interface.encodeFunctionData(
     functionToCall,
     args
   );
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("proposal to add tickets")
  );
  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

  const governor = await ethers.getContract("GovernorContract");
  console.log("Queueing...");
  const queueTx = await governor.queue(
    [teamlineup.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("Executing...");
  // this will fail on a testnet because you need to wait for the MIN_DELAY!
  const executeTx = await governor.execute(
    [teamlineup.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);
  // const team = await teamlineup.showplayers();
  // console.log(team);
}

queueAndExecute("Tickets")
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
