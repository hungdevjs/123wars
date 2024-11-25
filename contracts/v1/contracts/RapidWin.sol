// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// import 'hardhat/console.sol';

import "../libs/SafeTransferLib.sol";
import "../interfaces/IRapidWin.sol";

contract RapidWin is AccessControl, ReentrancyGuard, IRapidWin {
    using SafeTransferLib for address payable;

    bytes32 public constant WORKER_ROLE = keccak256("WORKER_ROLE");
    mapping(bytes => uint256) public planPrices;

    constructor(address _defaultAdmin, address _workerAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _grantRole(WORKER_ROLE, _workerAddress);
    }

    receive() external payable {}

    fallback() external payable {}

    function subscribe(bytes calldata planId) external payable {
        require(msg.value >= planPrices[planId], "Insufficient ETH");

        emit Subscribed(msg.sender, planId);
    }

    function sendRewards(
        address[] calldata winners,
        uint256[] calldata rewards
    ) external onlyRole(WORKER_ROLE) {
        require(winners.length == rewards.length, "Invalid input array length");
        for (uint256 i = 0; i < winners.length; i++) {
            if (rewards[i] > 0) {
                address payable receiver = payable(winners[i]);
                (bool sent, ) = receiver.call{value: rewards[i]}("");
                require(sent, "Failed to send Ether");
            }
        }
    }

    function updatePrice(
        bytes[] calldata planIds,
        uint256[] calldata prices
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(planIds.length == prices.length, "Invalid array length");

        for (uint256 i = 0; i < planIds.length; i++) {
            planPrices[planIds[i]] = prices[i];
        }
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
