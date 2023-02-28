import { ethers, network } from "hardhat";
import { impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";

async function main() {

  /////////////////////////  DEPLOYER  - STAKING CONTRACT /////////////////////

  const [ owner, staker ] = await ethers.getSigners();
  const rewardTokenAddr = "0xF85895D097B2C25946BB95C4d11E2F3c035F8f0C";
  
  const Staking = await ethers.getContractFactory("BoredApeNFT");
  const staking = await Staking.deploy(rewardTokenAddr);
  await staking.deployed();
  const stakingAddr = staking.address;
  console.log(`BoredApeNFT contract deployed to: ${stakingAddr}`);

  //////////////////////////  CONNECT INTERFACE   /////////////////////////
  const rewardToken = await ethers.getContractAt("IApeCoin", rewardTokenAddr);

  //////////////////////////  MINT TOKEN TO APEHolder  //////////////////////
  await rewardToken.mint(1000000);

  /////////////////////////  IMPERSONATE APE NFT HOLDER  //////////////////////
  const APEHolder = "0xDBfD76AF2157Dc15eE4e57F3f942bB45Ba84aF24";
  await impersonateAccount(APEHolder);
  const impersonatedSigner = await ethers.getSigner(APEHolder);

  /////////////////////// TRANSFER APECOIN TO APE HOLDER  ////////////////////
  await rewardToken.transferFrom(stakingAddr, APEHolder, 10000);

  /////////////////////////////  APPROVE  ////////////////////////////
  const amount = 10000;
  const approve = await rewardToken.connect(APEHolder).approve(stakingAddr, amount);

  ////////////////////////////  STAKE   //////////////////////////////////

  const stake = await staking.connect(impersonatedSigner).stake(amount);
  const holderInfo = await staking.holderInfo(APEHolder);
  console.log(`User's feedback ${holderInfo}`);
  
///////////////////////////////  WARP TIME  ///////////////////////////////
 
await ethers.provider.send("evm_mine",[1682550423]);

//////////////////////////////  CALC REWARD  ////////////////////////////
const rewardAfterPeriod = await staking.updateReward();
console.log(`User's feedback after warp: ${holderInfo}`);

//////////////////////////////  CLAIM REWARD  ///////////////////////////
const claimReward = await staking.connect(impersonatedSigner).claimReward(APEHolder, amount);
console.log(`Feedback after claim reward: ${holderInfo}`);

//////////////////////////////  WITHDRAW STAKE  //////////////////////////
const withdrawStake = await staking.connect(impersonatedSigner).withdrawStake(amount, APEHolder);
const userBal = await rewardToken.connect(impersonatedSigner).balanceOf(APEHolder);
console.log(`User's balance: ${userBal}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
