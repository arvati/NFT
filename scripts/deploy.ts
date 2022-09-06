import { ethers, network } from "hardhat";

import { contructorArgs, logger, appConfig, setConfig }  from "../utils/helpers";
import { getContractFactory, getAccount }  from "../utils";


async function main() {
  logger(3, `Network: ${network.name}`);
  // Get Owner Account from config
  const account = await getAccount()
	logger(3, `Account balance: ${(await account.getBalance()).toString()}`);

  // Get Factory from config
  const contractName: string = Object.keys(appConfig.contract)[0];
  if (!appConfig.contract[contractName]) appConfig.contract[contractName] = [];
  if (!appConfig.contract[contractName][0]) appConfig.contract[contractName][0] = {args:{}, networks:{}};
  const contractFactory = await getContractFactory(contractName, account);

  // Get Arguments from config
  if (!appConfig.contract[contractName][0]["args"]) appConfig.contract[contractName][0]["args"] = {};

  if (!appConfig.contract[contractName][0].args["unlockTime"]) {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    appConfig.contract[contractName][0].args["unlockTime"] = currentTimestampInSeconds + ONE_YEAR_IN_SECS;
  }
  if (!appConfig.contract[contractName][0].value) {
    appConfig.contract[contractName][0].value = ethers.utils.parseEther("1").toString();
  }

  if (!appConfig.contract[contractName][0].networks[network.name] || network.name == "hardhat" || network.name == "localhost") {
    var args = contructorArgs(appConfig.contract[contractName][0].args); 
    const contract = await contractFactory.deploy( ...args,  
      { value: appConfig.contract[contractName][0].value, 
        gasLimit: 10_000_000, gasPrice: ethers.utils.parseUnits('45', 'gwei')});
    await contract.deployed()
    console.log(`Contract ${contractName} locked with ${appConfig.contract[contractName][0].value} deployed to address: ${contract.address}`);
    if (!appConfig.contract[contractName][0]["networks"]) appConfig.contract[contractName][0]["networks"] = {};
    appConfig.contract[contractName][0].networks[network.name] = contract.address;
  } else {
    const contract  = await contractFactory.attach(appConfig.contract[contractName][0].networks[network.name]);
    console.log(`Contract ${contractName} was already deployed as '${contractName}' to address: ${contract.address}`);
  }
  logger(5, `Configuration of contract: ${contractName}`);
  logger(5, appConfig.contract[contractName]);

  // Save arguments and contract address to config
  setConfig(appConfig);
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
