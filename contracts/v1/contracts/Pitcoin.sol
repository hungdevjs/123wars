// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';

contract Pitcoin is ERC20, ERC20Burnable, AccessControl, ERC20Permit {
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

  constructor(address defaultAdmin, address minter) ERC20('Pitcoin', 'PTC') ERC20Permit('Pitcoin') {
    _mint(msg.sender, 1000000000 * 10 ** decimals());
    _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    _grantRole(MINTER_ROLE, minter);
  }

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }
}
