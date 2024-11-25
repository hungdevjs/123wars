require('dotenv').config();

require('@nomicfoundation/hardhat-toolbox');
require('hardhat-gas-reporter');
require('hardhat-contract-sizer');
require('@openzeppelin/hardhat-upgrades');
require('solidity-coverage');

const secrets = require('./secrets.json');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.27',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  networks: {
    defaultNetwork: {
      url: 'hardhat',
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    base_sepolia: {
      url: secrets.baseSepolia.url || ``,
      accounts: secrets.baseSepolia.keys,
      gasPrice: 1000000000,
      verify: {
        etherscan: {
          apiUrl: secrets.baseSepolia.apiUrl,
          apiKey: secrets.baseSepolia.ethScan,
        },
      },
    },
    base_mainnet: {
      url: secrets.base.url || ``,
      accounts: secrets.base.keys,
      gasPrice: 1000000000,
      verify: {
        etherscan: {
          apiUrl: secrets.base.apiUrl,
          apiKey: secrets.base.ethScan,
        },
      },
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    token: 'ETH',
    gasPriceApi:
      'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    coinmarketcap: '1bdef299-9f72-465d-a680-35fdb0b59db0',
  },
  etherscan: {
    apiKey: {
      base_mainnet: secrets.base.ethScan,
      base_sepolia: secrets.baseSepolia.ethScan,
    },
    customChains: [
      {
        network: 'base_mainnet',
        chainId: secrets.base.networkId,
        urls: {
          apiURL: secrets.base.apiUrl,
          browserURL: secrets.base.browserUrl,
        },
      },
      {
        network: 'base_sepolia',
        chainId: secrets.baseSepolia.networkId,
        urls: {
          apiURL: secrets.baseSepolia.apiUrl,
          browserURL: secrets.baseSepolia.browserUrl,
        },
      },
    ],
  },
  mocha: {
    timeout: 100000,
  },
};
