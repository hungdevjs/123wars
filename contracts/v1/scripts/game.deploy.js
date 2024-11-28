const { ethers } = require('hardhat');
const { parseEther, ethers: nativeEthers } = require('ethers');

const configs = require('../utils/configs');
const { verifyContract } = require('../utils/contracts');

const plans = [
  { id: '1', priceInEth: 0.001 },
  { id: '2', priceInEth: 0.003 },
  { id: '3', priceInEth: 0.005 },
];

const planIds = plans.map((plan) => nativeEthers.encodeBytes32String(plan.id));
const prices = plans.map((plan) => parseEther(`${plan.priceInEth}`));

const main = async () => {
  try {
    console.log('deploying game...');
    const { wallets } = configs;
    const [admin, worker] = wallets;
    console.log({ admin, worker });

    const Game = await ethers.getContractFactory('RapidWin');
    const gameContract = await Game.deploy(admin, worker);
    await gameContract.waitForDeployment();
    const gameAddress = await gameContract.getAddress();

    await verifyContract({
      address: gameAddress,
      constructorArguments: [admin, worker],
    });

    await gameContract.updatePrice(planIds, prices);

    console.log(`Game is deployed to ${gameAddress}`);
  } catch (err) {
    console.error(err);
  }

  process.exit();
};

main();
