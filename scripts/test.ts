import { ethers } from "hardhat";

async function main() {

    const [ owner ] = await ethers.getSigners();
    const RewardToken = await ethers.getContractFactory("");

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });