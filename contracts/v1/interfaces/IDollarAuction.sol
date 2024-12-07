// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IDollarAuction {
  event BidCreated(uint256 roundId, address bidder, uint256 amount);
  event Refund(uint256 roundId, address to, uint256 amount);
  event RoundEnded(
    uint256 roundId,
    address winner,
    uint256 amount,
    uint256 prize
  );
  event RoundCreated(uint256 roundId, uint256 roundPrize, uint256 roundEndTime);

  function bid(uint256 value) external;

  function start() external;

  function endRoundAndCreateNewRound() external;

  function updateConfig(
    uint256 _bidStep,
    uint256 _timeStep,
    uint256 _nextRoundPrizePercent,
    uint256 _minRoundPrize,
    uint256 _minRoundDuration
  ) external;

  function withdraw(address to) external;
}
