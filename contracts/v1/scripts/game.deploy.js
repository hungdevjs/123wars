const { ethers } = require('hardhat');

const configs = require('../utils/configs');
const { verifyContract } = require('../utils/contracts');

const main = async () => {
  try {
    console.log('deploying game...');
    const { wallets } = configs;
    const [admin, worker, dev] = wallets;
    console.log({ admin, worker, dev });

    const Game = await ethers.getContractFactory('MarbleGame');
    const gameContract = await Game.deploy(admin, worker, dev);
    await gameContract.waitForDeployment();
    const gameAddress = await gameContract.getAddress();

    await verifyContract({ address: gameAddress, constructorArguments: [admin, worker, dev] });

    console.log(`Game is deployed to ${gameAddress}`);
  } catch (err) {
    console.error(err);
  }

  process.exit();
};

main();
