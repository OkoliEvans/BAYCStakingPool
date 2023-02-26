import { ethers } from "hardhat";

async function main() {

    ///////////////////  DEPLOYER - STAKETOKEN  ////////////////

    const [owner] = await ethers.getSigners();

    const StakeToken = await ethers.getContractFactory("ApeToken");
    const stakeToken = await StakeToken.deploy();
    await stakeToken.deployed();

    console.log(`Ape coin deployed to: ${stakeToken.address}`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });