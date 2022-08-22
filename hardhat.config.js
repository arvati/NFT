/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-ethers")

require('dotenv').config();

// Hardhat custom tasks
require("./scripts/mint.js");
require("./scripts/deploy.js");

const { WALLET_PRIVATE_KEY, POLYGONSCAN_API_KEY, ETHERSCAN_API_KEY, INFURA_KEY, ALCHEMY_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
  defaultNetwork: "polygon",
  networks: {
    hardhat: {
    },
    polygon: {
      //url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
      chainId: 137,
      gasMultiplier: 10,
      gasPrice: 35000000000,
      gasLimit: 300000,
      accounts: [WALLET_PRIVATE_KEY]
    },
    polygonMumbai: {
      //url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
      chainId: 80001,
      gasMultiplier: 10,
      gasPrice: 35000000000,
      gasLimit: 300000,
      accounts: [WALLET_PRIVATE_KEY]
    }
  },
  // npx hardhat verify --list-networks
  etherscan: {
    apiKey: {
        //ethereum
        mainnet: ETHERSCAN_API_KEY,
        ropsten: ETHERSCAN_API_KEY,
        rinkeby: ETHERSCAN_API_KEY,
        goerli: ETHERSCAN_API_KEY,
        kovan: ETHERSCAN_API_KEY,
        //polygon
        polygon: POLYGONSCAN_API_KEY,
        polygonMumbai: POLYGONSCAN_API_KEY
   }
  },
  ledger: {
    path: 1
  },
  nftContract: {
    name: "Dino",
    networks: {
      polygon: "0x",
      polygonMumbai: "0x"
    }
  }
};