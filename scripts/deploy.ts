import { ethers, network } from "hardhat";

async function main() {

  /////////////////////////  DEPLOYER  - STAKING CONTRACT /////////////////////

  const [ owner, staker ] = await ethers.getSigners();
  const rewardTokenAddr = "";
  
  const Staking = await ethers.getContractFactory("BoredApeNFT");
  const staking = await Staking.deploy(rewardTokenAddr);
  await staking.deployed();
  const stakingAddr = staking.address;
  console.log(`BoredApeNFT contract deployed to: ${stakingAddr}`);

  //////////////////////////  CONNECT INTERFACE   /////////////////////////
  const rewardToken = await ethers.getContractAt("IApeCoin", rewardTokenAddr);

  /////////////////////////////  APPROVE  ////////////////////////////
  const amount = 10000;
  const approve = await rewardToken.connect(staker.address).approve(stakingAddr, amount);

  ////////////////////////////  STAKE   //////////////////////////////////

  const stake = await staking.connect(staker.address).stake(amount);
  const holderInfo = await staking.holderInfo(staker.address);
  console.log(`User's feedback ${holderInfo}`);
  
///////////////////////////////  WARP TIME  ///////////////////////////////
 
await ethers.provider.send("evm_mine",[1682550423]);

//////////////////////////////  CALC REWARD  ////////////////////////////
const rewardAfterPeriod = await staking.updateReward();
console.log(`User's feedback after warp: ${holderInfo}`);

//////////////////////////////  CLAIM REWARD  ///////////////////////////
const claimReward = await staking.connect(staker.address).claimReward(staker.address, amount);
console.log(`Feedback after claim reward: ${holderInfo}`);

//////////////////////////////  WITHDRAW STAKE  //////////////////////////
const withdrawStake = await staking.connect(staker.address).withdrawStake(amount, staker.address);
const userBal = await rewardToken.connect(staker.address).balanceOf(staker.address);
console.log(`User's balance: ${userBal}`);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
