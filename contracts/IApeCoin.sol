//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IApeCoin is IERC20 {

function balanceOf(address account) external view returns (uint256);

function transfer(address to, uint256 amount) external returns (bool);

function approve(address spender, uint256 amount) external returns (bool);

function mint(uint _amount)external;

 function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

}
