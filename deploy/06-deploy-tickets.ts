import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// @ts-ignore
import { ethers } from "hardhat";

const deploytickets: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying tickets...");
  const teamlineup = await deploy("Tickets", {
    from: deployer,
    args: [],
    log: true,
  });
  const timeLock = await ethers.getContract("TimeLock");
  const teamlineupcontract = await ethers.getContractAt(
    "Tickets",
    teamlineup.address
  );
  const transferOwnerTx = await teamlineupcontract.transferOwnership(
    timeLock.address
  );
  await transferOwnerTx.wait(1);
  log("Done.......");
};

export default deploytickets;
