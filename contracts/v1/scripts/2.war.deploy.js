const { ethers } = require('hardhat');

const { verifyContract } = require('../utils/contracts');

const tokenAddress = '0x48Ec00BD086D0e1C128070Cd7cE223681F9F3920';

const main = async () => {
  try {
    console.log('========== deploying war ==========');
    const signers = await ethers.getSigners();
    const [adminWallet, workerWallet, signerWallet] = signers;

    const Game = await ethers.getContractFactory('War');
    const gameContract = await Game.deploy(
      adminWallet.address,
      workerWallet.address,
      signerWallet.address,
      tokenAddress
    );
    await gameContract.waitForDeployment();
    const gameAddress = await gameContract.getAddress();

    await verifyContract({
      address: gameAddress,
      constructorArguments: [adminWallet.address, workerWallet.address, signerWallet.address, tokenAddress],
    });
    console.log(`========== SUCCESS deployed war, address: ${gameAddress} ==========`);

    console.log(`========== grant minter role ==========`);
    const Token = await ethers.getContractFactory('Pitcoin');
    const tokenContract = Token.attach(tokenAddress);

    const MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6';
    await tokenContract.grantRole(MINTER_ROLE, gameAddress);
  } catch (err) {
    console.error(err);
    console.log(`========== FAILED deployed war, error: ${err.message} ==========`);
  }

  process.exit();
};

main();
