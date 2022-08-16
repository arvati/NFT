
const hre = require("hardhat");
const { LedgerSigner } = require("@anders-t/ethers-ledger");

async function main() {

  // ledger polygon 1 : `m/44'/60'/0'/0/0`
  // ledger polygon 2 : `m/44'/60'/1'/0/0`
  const ledgerSigner = new LedgerSigner(hre.ethers.provider, `m/44'/60'/1'/0/0`);
  console.log(`Deploying contracts with the account:, ${(await ledgerSigner.getAddress())}`);

// Get contract address
const contractAddress = '0xF2CFC900D2293c25e37Fad904d21BbF568E424DC'

const myContractFactory = await hre.ethers.getContractFactory("NFT");
let myContract = await myContractFactory.connect(ledgerSigner);

const contract = myContract.attach(contractAddress);

// Get the NFT Metadata IPFS URL
const tokenUri = "https://arvati.github.io/NFT/metadata/1.json"
const recipientAddress = await ledgerSigner.getAddress()

let nftTxn = await contract.mintNFT(recipientAddress, tokenUri);
await nftTxn.wait()
console.log(`NFT Minted! Check it out at: https://polygonscan.com/tx/${nftTxn.hash}`)
//console.log("NFT minted:", contract);

}

main()
    .then(() => process.exitCode = 0)
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })