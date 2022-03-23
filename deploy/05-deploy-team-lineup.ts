import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const deployteamlineup: DeployFunction =async function (
    hre : HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("----------------------------------------------------")
    log("Deploying team lineup...")
    const teamlineup = await deploy("TeamLineup",{
        from: deployer,
        args: [],
        log: true,
    })
    const timeLock = await ethers.getContract("TimeLock");
    const teamlineupcontract = await ethers.getContractAt("TeamLineup",teamlineup.address)    
    const transferOwnerTx = await teamlineupcontract.transferOwnership(timeLock.address);
    await transferOwnerTx.wait(1);
    log("Done.......");
}

export default deployteamlineup;