// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IWar {
  event BetCreated(uint256 roundId, uint256 option, address from, uint256 value);

  function bet(uint256 roundId, uint256 option, uint256 value, uint256 time, bytes memory signature) external;

  function sendRewards(address[] calldata winners, uint256[] calldata rewards) external;

  function withdraw(address to) external;
}
