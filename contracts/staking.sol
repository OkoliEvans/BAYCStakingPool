// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./APE.sol";
import "./IApeCoin.sol";
//import { ApeCoin } from "./APE.sol";
import { IBAYC } from "./IBAYC.sol";

/// @title BoredApeNFT is an exclusive staking platform for APE NFT holders
/// @author  Okoli Evans
/// @dev onlyHolders modifier endures that only the holders of the NFT can stake
/// @notice Stakers get 15% APY of the reward token

contract BoredApeNFT is Ownable {

    struct Stakers {
        uint256 amountStaked;
        uint256 start_Time;
        uint256 accrued_Reward;
        bool has_Staked;
    }

    // enum Timer {
    //     endStaking,
    //     startStaking
    // }

    //Timer timer;

    mapping (address => Stakers) stakers;

    address public Controller;
    IBAYC private BAYC;
    IApeCoin private ApeCoin;
    uint256 private TotalStake;

    
    event staked(address staker, uint256 amount, string message);
    event claimed(address receiver, uint256 amount, string message);
    event withdrawn(address _to, uint256 amount, string message);
    event Log(string message);

    constructor(address _stakingToken) {
        ApeCoin = IApeCoin(_stakingToken);
        BAYC = IBAYC(0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D);
        Controller = msg.sender;
    }

    modifier onlyHolders() {
        require(BAYC.balanceOf(msg.sender) > 0, "Not a holder of Bored Ape NFT");
        _;
    }


    function stake( uint256 amount) public onlyHolders {
        //require(ApeCoin(_token), "Only APE token is accepted");
        require(ApeCoin.balanceOf(msg.sender) >= amount, "Insufficient APE coin");
        require(!stakers[msg.sender].has_Staked, "Account already in use");
        _stake(amount);
        emit staked(msg.sender, amount, "Staking successful");
    }

    function updateReward() public returns(uint256 accruedReward){
        Stakers memory _staker = stakers[msg.sender];
        accruedReward = _calculateReward();
        _staker.accrued_Reward = accruedReward;
        _staker.start_Time = block.timestamp;

        emit Log("Your reward has been updated!");
    }

    function claimReward(address _to, uint256 amount) public onlyHolders {
        Stakers memory _staker = stakers[msg.sender];
        require(_to != address(0));
        _staker.accrued_Reward = updateReward();
        require(amount <= _staker.accrued_Reward);
        ApeCoin.transferFrom(address(this), _to, amount);
        _staker.accrued_Reward -= amount;

        emit claimed(_to, amount, "Rewards claimed successfully...!");
    }

    function withdrawStake(uint256 amount, address _to) public onlyHolders{
        Stakers memory _staker = stakers[msg.sender];
        require(_staker.amountStaked >= amount, "Insufficient funds");
        require(_to != address(0));
        require(ApeCoin.balanceOf(address(this)) > amount, "Try again shortly");
        if(_staker.amountStaked == amount) {
            _reset();
        }
        TotalStake -= amount;
        ApeCoin.transfer( _to, amount);
       
        emit withdrawn(_to, amount, "Stake withdrawn successfully...!");
    }

    //////////// CORE V2 //////////////
    function _stake(uint256 amount) internal {
        ApeCoin.transferFrom(msg.sender, address(0), amount);
        TotalStake += amount;
        if(stakers[msg.sender].amountStaked == 0 ) {
            stakers[msg.sender].amountStaked = amount;
            stakers[msg.sender].start_Time = block.timestamp;
            stakers[msg.sender].has_Staked = true;
        } else {
            updateReward();
            stakers[msg.sender].amountStaked += amount;
        }        
    }

    function _calculateReward() internal view returns(uint reward) {
        Stakers memory _staker = stakers[msg.sender];
        uint256 duration = block.timestamp - _staker.start_Time;
        uint256 _amountStaked = _staker.amountStaked;
        // (_staker.amountStaked / TotalStake) * (TotalRewards / duration);
        // uint256 perc = 5 / 100;
        uint256 time = 31536000 - duration;
        reward = (_amountStaked * 5 / 100) / time;
    }

    function _reset() internal {
        Stakers storage _staker = stakers[msg.sender];
        _staker.accrued_Reward = 0;
        _staker.amountStaked = 0;
        _staker.has_Staked = false;
        _staker.start_Time = 0;
    }

    //////////  FALLBACKS  ////////////
    receive() external payable {}
    fallback() external {}
}
