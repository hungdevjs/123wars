const { ethers } = require("hardhat");

const { verifyContract } = require("../utils/contracts");

const main = async () => {
  try {
    console.log("========== deploying paradox token ==========");
    const signers = await ethers.getSigners();
    const [adminWallet, workerWallet] = signers;

    const Token = await ethers.getContractFactory("Paradox");
    const tokenContract = await Token.deploy(
      adminWallet.address,
      workerWallet.address
    );
    await tokenContract.waitForDeployment();
    const tokenAddress = await tokenContract.getAddress();

    await verifyContract({
      address: tokenAddress,
      constructorArguments: [adminWallet.address, workerWallet.address],
    });
    console.log(
      `========== SUCCESS deployed paradox token, address: ${tokenAddress} ==========`
    );
  } catch (err) {
    console.error(err);
    console.log(
      `========== FAILED deployed paradox token, error: ${err.message} ==========`
    );
  }

  process.exit();
};

main();
