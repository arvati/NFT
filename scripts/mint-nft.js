
const hre = require("hardhat");
const { LedgerSigner } = require("@anders-t/ethers-ledger");

async function main() {

  // ledger polygon 1 : `m/44'/60'/0'/0/0`
  // ledger polygon 2 : `m/44'/60'/1'/0/0`
  const ledgerSigner = new LedgerSigner(hre.ethers.provider, `m/44'/60'/1'/0/0`);
  console.log(`Deploying contracts with the account:, ${(await ledgerSigner.getAddress())}`);

// Get contract address
const contractAddress = '0x2E6185f3d231a82Db6060B9A5c47F22faf1c5272'

const myContractFactory = await hre.ethers.getContractFactory("NFT1");
let myContract = await myContractFactory.connect(ledgerSigner);

const contract = myContract.attach(contractAddress);

// Get the NFT Metadata IPFS URL
//const tokenUri = "https://arvati.github.io/NFT/metadata/1.json"
const recipientAddress = await ledgerSigner.getAddress()

let nftTxn = await contract.safeMint(recipientAddress);
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