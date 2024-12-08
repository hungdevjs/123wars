// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "../libs/SafeTransferLib.sol";
import "../interfaces/IDollarAuction.sol";
import "./Paradox.sol";

contract DollarAuction is AccessControl, ReentrancyGuard, IDollarAuction {
  using SafeTransferLib for address payable;

  bytes32 public constant WORKER_ROLE = keccak256("WORKER_ROLE");
  Paradox public immutable token;
  uint256 public bidStep = 1000 ether;
  uint256 public timeStep = 2 * 60;
  uint256 public nextRoundPrizePercent = 10_00;
  uint256 public minRoundPrize = 50000 ether;
  uint256 public minRoundDuration = 2 * 60 * 60;

  uint256 public roundId;
  uint256 public roundPrize;
  uint256 public roundEndTime;
  uint256 public nextRoundPrize;
  uint256 public numberOfBids;

  uint256 public roundWinnerBid;
  address public roundWinner;
  uint256 public roundSecondBid;
  address public roundSecondPosition;

  constructor(
    address _defaultAdmin,
    address _workerAddress,
    address _paradoxTokenAddress
  ) {
    _grantRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
    _grantRole(WORKER_ROLE, _workerAddress);
    token = Paradox(_paradoxTokenAddress);
  }

  receive() external payable {}

  fallback() external payable {}

  function isActive() public view returns (bool) {
    return block.timestamp <= roundEndTime;
  }

  function bid(uint256 value) external {
    require(isActive(), "Round ended");
    require(msg.sender != roundWinner, "Cannot take over yourself");
    require(
      value >= roundWinnerBid + bidStep,
      "Must bid at least 1 bid step more than max bidding"
    );
    require(
      token.allowance(msg.sender, address(this)) >= value,
      "Not allowance"
    );

    token.burnFrom(msg.sender, value);

    if (roundSecondPosition != address(0)) {
      uint256 refundValue = (roundSecondBid *
        (100_00 - nextRoundPrizePercent)) / 100_00;
      token.mint(roundSecondPosition, refundValue);
      emit Refund(roundId, roundSecondPosition, refundValue);
    }

    numberOfBids++;
    roundSecondPosition = roundWinner;
    roundSecondBid = roundWinnerBid;

    roundWinner = msg.sender;
    roundWinnerBid = value;

    roundEndTime += timeStep;
    nextRoundPrize += (value * nextRoundPrizePercent) / 100_00;

    emit BidCreated(roundId, msg.sender, value);
  }

  function start() external onlyRole(WORKER_ROLE) {
    require(roundId == 0, "Contract is started");

    roundId++;
    roundPrize = minRoundPrize;
    roundEndTime = block.timestamp + minRoundDuration;
    nextRoundPrize = minRoundPrize;

    emit RoundCreated(roundId, roundPrize, roundEndTime);
  }

  function endRoundAndCreateNewRound() external onlyRole(WORKER_ROLE) {
    require(!isActive(), "Round is not ended");
    if (roundWinner != address(0)) {
      token.mint(roundWinner, roundPrize);
    }

    emit RoundEnded(roundId, roundWinner, roundWinnerBid, roundPrize);

    roundId++;
    roundPrize = nextRoundPrize;
    roundEndTime = block.timestamp + minRoundDuration;
    roundWinner = address(0);
    roundWinnerBid = 0;
    roundSecondPosition = address(0);
    roundSecondBid = 0;
    nextRoundPrize = minRoundPrize;
    numberOfBids = 0;

    emit RoundCreated(roundId, roundPrize, roundEndTime);
  }

  function updateConfig(
    uint256 _bidStep,
    uint256 _timeStep,
    uint256 _nextRoundPrizePercent,
    uint256 _minRoundPrize,
    uint256 _minRoundDuration
  ) external onlyRole(WORKER_ROLE) {
    bidStep = _bidStep;
    timeStep = _timeStep;
    nextRoundPrizePercent = _nextRoundPrizePercent;
    minRoundPrize = _minRoundPrize;
    minRoundDuration = _minRoundDuration;
  }

  function withdraw(
    address to
  ) external nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    require(address(this).balance > 0, "Nothing to withdraw");
    address payable receiver = payable(to);
    (bool sent, ) = receiver.call{value: address(this).balance}("");
    require(sent, "Failed to send Ether");
  }
}
