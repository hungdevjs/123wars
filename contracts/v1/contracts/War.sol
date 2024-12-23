// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

import './Pitcoin.sol';
import '../interfaces/IWar.sol';
import '../libs/SafeTransferLib.sol';
import '../libs/SignerLib.sol';

contract War is AccessControl, ReentrancyGuard, IWar {
  using SafeTransferLib for address payable;
  using SignerLib for address;

  address private signer;
  uint256 public constant vtd = 20;
  bytes32 public constant WORKER_ROLE = keccak256('WORKER_ROLE');
  Pitcoin public immutable token;

  constructor(address _defaultAdmin, address _workerAddress, address _signerAddress, address _pitcoinAddress) {
    _grantRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
    _grantRole(WORKER_ROLE, _workerAddress);
    token = Pitcoin(_pitcoinAddress);
    signer = _signerAddress;
  }

  receive() external payable {}

  fallback() external payable {}

  function bet(uint256 roundId, uint256 option, uint256 value, uint256 time, bytes memory signature) external {
    require(token.allowance(msg.sender, address(this)) >= value, 'Not allowance');
    require(block.timestamp < time + vtd, 'Invalid timestamp');
    bytes32 message = SignerLib.prefixed(keccak256(abi.encodePacked(msg.sender, roundId, option, value, time)));
    require(signer.verifyAddressSigner(message, signature), 'INVALID_SIGNATURE');

    token.burnFrom(msg.sender, value);
    emit BetCreated(roundId, option, msg.sender, value);
  }

  function sendRewards(address[] calldata winners, uint256[] calldata rewards) external onlyRole(WORKER_ROLE) {
    require(winners.length == rewards.length, 'Invalid input array length');
    for (uint256 i = 0; i < winners.length; i++) {
      if (rewards[i] > 0) token.mint(winners[i], rewards[i]);
    }
  }

  function withdraw(address to) external nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    require(address(this).balance > 0, 'Nothing to withdraw');
    address payable receiver = payable(to);
    (bool sent, ) = receiver.call{value: address(this).balance}('');
    require(sent, 'Failed to send Ether');
  }
}
