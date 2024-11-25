/* eslint-disable jest/valid-expect */
/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
require('chai').use(require('chai-as-promised')).should();
const { parseEther, formatEther, ethers: nativeEthers } = require('ethers');

const plans = [
  { id: '1', priceInEth: 0.001 },
  { id: '2', priceInEth: 0.003 },
  { id: '3', priceInEth: 0.005 },
];

const planIds = plans.map((plan) => nativeEthers.encodeBytes32String(plan.id));
const prices = plans.map((plan) => parseEther(`${plan.priceInEth}`));

describe('rapidwin', function () {
  const deployFixture = async () => {
    const accounts = await ethers.getSigners();
    const [admin, worker] = accounts;

    const RapinWin = await ethers.getContractFactory('RapidWin');
    const gameContract = await RapinWin.deploy(admin.address, worker.address);

    await gameContract.waitForDeployment();
    const gameAddress = await gameContract.getAddress();

    return {
      gameContract,
      gameAddress,
      admin,
      worker,
      accounts,
    };
  };

  describe('deployment', () => {
    it('deploy contract', async () => {
      const { gameAddress } = await loadFixture(deployFixture);
      expect(gameAddress).not.to.be.undefined;
    });
  });

  describe('update', () => {
    it('update price', async () => {
      const { gameContract } = await loadFixture(deployFixture);

      await gameContract.updatePrice(planIds, prices);

      const price0 = await gameContract.planPrices(planIds[0]);
      const price1 = await gameContract.planPrices(planIds[1]);
      const price2 = await gameContract.planPrices(planIds[2]);

      expect(price0).to.equal(prices[0]);
      expect(price1).to.equal(prices[1]);
      expect(price2).to.equal(prices[2]);
    });
  });

  describe('play game', () => {
    it('subscribe', async () => {
      const { gameContract, gameAddress, accounts } = await loadFixture(
        deployFixture
      );

      await gameContract.updatePrice(planIds, prices);

      const player = accounts[3];

      await gameContract
        .connect(player)
        .subscribe(planIds[0], { value: prices[0] });

      const gameBalance = await ethers.provider.getBalance(gameAddress);
      expect(gameBalance).to.equal(prices[0]);
    });

    it('sendRewards', async () => {
      const { gameContract, worker, accounts } = await loadFixture(
        deployFixture
      );

      const player = accounts[3];

      await gameContract
        .connect(player)
        .subscribe(planIds[2], { value: prices[2] });

      const playerBalance = await ethers.provider.getBalance(player.address);

      const reward = 0.002;
      await gameContract
        .connect(worker)
        .sendRewards([player.address], [parseEther(`${reward}`)]);

      const playerBalance1 = await ethers.provider.getBalance(player.address);
      expect(playerBalance1).to.equal(playerBalance + parseEther(`${reward}`));
    });

    it('withdraw', async () => {
      const { gameContract, gameAddress, accounts } = await loadFixture(
        deployFixture
      );

      await gameContract.updatePrice(planIds, prices);

      const player = accounts[3];
      const receiver = accounts[4];

      await gameContract
        .connect(player)
        .subscribe(planIds[0], { value: prices[0] });

      const gameBalance = await ethers.provider.getBalance(gameAddress);
      const receiverBalance = await ethers.provider.getBalance(
        receiver.address
      );

      await gameContract.withdraw(receiver.address);

      const receiverBalance1 = await ethers.provider.getBalance(
        receiver.address
      );

      expect(receiverBalance1).to.equal(gameBalance + receiverBalance);
    });
  });
});
