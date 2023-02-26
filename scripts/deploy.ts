import { ethers } from "hardhat";

async function main() {

  /////////////////////////  DEPLOYER  - STAKING CONTRACT /////////////////////

  const [ owner, staker ] = await ethers.getSigners();
  const Staking = await ethers.getContractFactory("BoredApeNFT");
  const staking = await Staking.deploy("0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026");
  await staking.deployed();
  console.log(`BoredApeNFT contract deployed to: ${staking.address}`);

  /// deployed to: 0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026 /////
  
  


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
