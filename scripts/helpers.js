//const { LedgerSigner } = require("@ethersproject/hardware-wallets");
const { LedgerSigner } = require("@anders-t/ethers-ledger");

// Helper method for fetching environment variables from .env
function getEnvVariable(key, defaultValue) {
	if (process.env[key]) {
		return process.env[key];
	}
	if (!defaultValue) {
		throw `${key} is not defined and no default value was provided`;
	}
	return defaultValue;
}

// Helper method for fetching a wallet account using an environment variable for the PK
async function getAccount() {
    const [hardhatSigner] = await ethers.getSigners();
    console.log(`Using account: ${hardhatSigner.address}`);
	return hardhatSigner
}

async function getLedgerAccount(hre) {
  // ledger polygon 1 : `m/44'/60'/0'/0/0`
  // ledger polygon 2 : `m/44'/60'/1'/0/0`
  const ledgerSigner = new LedgerSigner(await ethers.provider, `m/44'/60'/${(hre.config.ledger.path)}'/0/0`);
  console.log(`Using Ledger account: ${(await ledgerSigner.getAddress())}`);
  return ledgerSigner
}

async function getContractFactory(contractName) {
    console.log(`Using contract: ${contractName}`);
    return await ethers.getContractFactory(contractName, await getAccount());
}

async function getContract(contractName, contractAddress) {
    const myContract = await getContractFactory(contractName, hre);
    console.log(`Using contract address: ${contractAddress}`);
    return myContract.attach(contractAddress);
}

async function getLedgerContractFactory(contractName, hre) {
    const myContractFactory = await ethers.getContractFactory(contractName);
    const ledgerSigner = await getLedgerAccount(hre)
    let myContract = await myContractFactory.connect(ledgerSigner);
    console.log(`Using contract: ${contractName}`);
    return myContract
}

async function getLedgerContract(contractName, contractAddress, hre) {
  let myContract = await getLedgerContractFactory(contractName, hre);
  console.log(`Using contract address: ${contractAddress}`);
  return await myContract.attach(contractAddress);
}

module.exports = {
	getEnvVariable,
	getAccount,
    getContractFactory,
	getContract,
    getLedgerContractFactory,
    getLedgerAccount,
    getLedgerContract
}