// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IRapidWin {
    event Subscribed(address addr, bytes planId);

    function subscribe(bytes calldata planId) external payable;

    function sendRewards(
        address[] calldata winners,
        uint256[] calldata rewards
    ) external;

    function updatePrice(
        bytes[] calldata planIds,
        uint256[] calldata prices
    ) external;

    function withdraw(address to) external;
}
