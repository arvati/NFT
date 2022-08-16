// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.

const hre = require("hardhat");
const { LedgerSigner } = require("@anders-t/ethers-ledger");

// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

async function main() {

  // ledger polygon 1 : `m/44'/60'/0'/0/0`
  // ledger polygon 2 : `m/44'/60'/1'/0/0`
  const ledgerSigner = new LedgerSigner(hre.ethers.provider, `m/44'/60'/1'/0/0`);
  console.log(`Deploying contracts with the account:, ${(await ledgerSigner.getAddress())}`);

  const myContractFactory = await hre.ethers.getContractFactory("NFT")
  let myContract = await myContractFactory.connect(ledgerSigner);

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await myContract.deploy()
  await myNFT.deployed()
  console.log("Contract deployed to address:", myNFT.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

main()
  .then(() => process.exitCode = 0)
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
