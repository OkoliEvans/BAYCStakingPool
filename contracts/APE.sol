//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ApeToken is ERC20 {
    constructor() ERC20("ApeCoin","Ape") {
        Owner = msg.sender;
    }

    address internal Owner;
    function mint(uint _amount) internal {
        require(Owner == msg.sender);
        _mint(address(this), _amount);
    }
}
