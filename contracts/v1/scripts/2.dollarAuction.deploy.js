const { ethers } = require("hardhat");

const { verifyContract } = require("../utils/contracts");

const tokenAddress = "0x9D6aB093065f9514664B6000e5e3344a1230F202";

const main = async () => {
  try {
    console.log("========== deploying dollar auction ==========");
    const signers = await ethers.getSigners();
    const [adminWallet, workerWallet] = signers;

    const Game = await ethers.getContractFactory("DollarAuction");
    const gameContract = await Game.deploy(
      adminWallet.address,
      workerWallet.address,
      tokenAddress
    );
    await gameContract.waitForDeployment();
    const gameAddress = await gameContract.getAddress();

    await verifyContract({
      address: gameAddress,
      constructorArguments: [
        adminWallet.address,
        workerWallet.address,
        tokenAddress,
      ],
    });
    console.log(
      `========== SUCCESS deployed dollar auction, address: ${gameAddress} ==========`
    );

    console.log(`========== starting game ==========`);
    const Token = await ethers.getContractFactory("Paradox");
    const tokenContract = Token.attach(tokenAddress);

    const MINTER_ROLE =
      "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    await tokenContract.grantRole(MINTER_ROLE, gameAddress);

    await gameContract.connect(workerWallet).start();

    console.log(`========== SUCCESS started game ==========`);
  } catch (err) {
    console.error(err);
    console.log(
      `========== FAILED deployed dollar auction, error: ${err.message} ==========`
    );
  }

  process.exit();
};

main();
