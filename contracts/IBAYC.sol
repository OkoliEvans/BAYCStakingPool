//SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IBAYC is IERC721 {

    function balanceOf(address owner) external view returns (uint256 balance);

}