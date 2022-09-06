/** @type import('hardhat/config').HardhatUserConfig */

import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import '@typechain/hardhat';
import "hardhat-change-network";
import "@cronos-labs/hardhat-cronoscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";
import * as helpers from "./utils/helpers"
helpers.config();

import "./tasks/accounts";
import "./tasks/balance";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1
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
    timeout: 20000,
    bail: true,
    forbidOnly: true,
    forbidPending: true
  },
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com/",
      chainId: 137,
      gasMultiplier: 10,
      gasPrice: 35000000000,
      accounts: {
        mnemonic: process.env.mnemonic,
        initialIndex: 0,
        path: "m/44'/60'/0'/0",
        count: 10,
      },
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      gasMultiplier: 10,
      gasPrice: 35000000000,
      accounts: {
        mnemonic: process.env.mnemonic,
        initialIndex: 0,
        path: "m/44'/60'/0'/0",
        count: 10,
      },
    },
  }
};

export default config;




