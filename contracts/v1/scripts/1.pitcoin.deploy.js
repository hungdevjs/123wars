const { ethers } = require('hardhat');
const { parseEther } = require('ethers');
const factoryArtifact = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');

const { verifyContract } = require('../utils/contracts');

// testnet
const uniswap = {
  wethAddress: '0x4200000000000000000000000000000000000006',
  factoryAddress: '0x88429007d4Ae3aE6FE0e641366D025DF2EE3666F',
  routerAddress: '0x9929fACA79699eEDC79e023234D983e614D80f4E',
};

const tokenInPair = 1000000000;
const ethInPair = 0.0001;

// mainnet
// const uniswap = {
//   wethAddress: "0x4200000000000000000000000000000000000006",
//   factoryAddress: "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
//   routerAddress: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"
// }

// const tokenInPair = 1000000000
// const ethInPair = 0.1

// const deployUniswap = async () => {
//   const signers = await ethers.getSigners();
//   const [adminWallet] = signers;

//   const Factory = await ethers.getContractFactory(factoryArtifact.abi, factoryArtifact.bytecode);
//   const factoryContract = await Factory.deploy(adminWallet.address);
//   const factoryContractAddress = await factoryContract.getAddress();

//   const Router = await ethers.getContractFactory(routerArtifact.abi, routerArtifact.bytecode);
//   const router = await Router.deploy(factoryContractAddress, uniswap.wethAddress);
//   const routerAddress = await router.getAddress();

//   console.log({ factoryContractAddress, routerAddress });
// };

const main = async () => {
  try {
    console.log('========== deploying pitcoin token ==========');
    const signers = await ethers.getSigners();
    const [adminWallet, workerWallet] = signers;

    const Token = await ethers.getContractFactory('Pitcoin');
    const tokenContract = await Token.deploy(adminWallet.address, workerWallet.address);
    await tokenContract.waitForDeployment();
    const tokenAddress = await tokenContract.getAddress();

    await verifyContract({
      address: tokenAddress,
      constructorArguments: [adminWallet.address, workerWallet.address],
    });
    console.log(`========== SUCCESS deployed pitcoin token, address: ${tokenAddress} ==========`);

    console.log('========== deploying liquidity pair ==========');
    const Factory = await ethers.getContractFactory(factoryArtifact.abi, factoryArtifact.bytecode);
    const factoryContract = Factory.attach(uniswap.factoryAddress);

    const tx = await factoryContract.createPair(tokenAddress, uniswap.wethAddress);
    await tx.wait();

    const pairAddress = await factoryContract.getPair(tokenAddress, uniswap.wethAddress);
    console.log(`========== SUCCESS deployed liquidity pair, address: ${pairAddress} ==========`);

    console.log('========== adding liquidity ==========');
    await tokenContract.connect(workerWallet).mint(adminWallet.address, parseEther(`${tokenInPair}`));

    const Router = await ethers.getContractFactory(routerArtifact.abi, routerArtifact.bytecode);
    const routerContract = Router.attach(uniswap.routerAddress);
    const tx1 = await tokenContract.approve(uniswap.routerAddress, parseEther(`${tokenInPair}`));
    await tx1.wait();

    const deadline = Math.floor(Date.now() / 1000 + 10 * 60);
    const tx2 = await routerContract.addLiquidityETH(
      tokenAddress,
      parseEther(`${tokenInPair}`),
      0,
      parseEther(`${ethInPair}`),
      adminWallet.address,
      deadline,
      {
        value: parseEther(`${ethInPair}`),
      }
    );
    await tx2.wait();
    console.log('========== SUCCESS added liquidity ==========');
  } catch (err) {
    console.error(err);
    console.log(`========== FAILED deployed pitcoin token, error: ${err.message} ==========`);
  }

  process.exit();
};

main();
