const {addressess} = require("./multimint.js");

const { getLedgerContract, getLedgerAccount, getAccount} = require("./helpers");
//const {ethers} = require("hardhat");

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));


task("mint", "Mints from the deployed smart contract")
.addOptionalParam("address", "The address to receive a token", undefined ,types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const recipientAddress = (taskArguments.address) ? ethers.utils.getAddress(taskArguments.address) : await contract.owner();
    console.log(`Minting to: ${recipientAddress}`);
    const transactionResponse = await contract.safeMint(recipientAddress,
        { gasLimit: 500_000, gasPrice: ethers.utils.parseUnits('40', 'gwei')}
    );
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("burn", "Burn Token from the deployed smart contract")
.addParam("id", "The tokenID to fetch metadata for", undefined, types.integer)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.burn(taskArguments.id);
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("multimint", "Multi Mint from the deployed smart contract")
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    console.log(`Minting to: ${addressess}`);
    const transactionResponse = await contract.multiMint(addressess, 
        { gasLimit: 10_000_000, gasPrice: ethers.utils.parseUnits('35', 'gwei')}
    );
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("pause", "Pauses the deployed smart contract")
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.pause();
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("unpause", "Pauses the deployed smart contract")
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.unpause();
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-base-token-uri", "Sets the base token URI for the deployed smart contract")
.addParam("url", "The base of the tokenURI endpoint to set", "https://arvati.github.io/NFT/", types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setBaseTokenURI(taskArguments.url, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-uri-suffix", "Sets the URI Suffix for the deployed smart contract")
.addParam("suffix", "The Suffix of the tokenURI endpoint to set", ".json", types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setUriSuffix(taskArguments.suffix, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-token-uri-prefix", "Sets the token URI Prefix for the deployed smart contract")
.addParam("prefix", "The Prefix of the tokenURI endpoint to set", "metadata/", types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setTokenUriPrefix(taskArguments.prefix);
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-contract-uri-prefix", "Sets the contract URI Prefix for the deployed smart contract")
.addParam("prefix", "The Prefix of the contractUri endpoint to set", "collection/", types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setContractUriPrefix(taskArguments.prefix);
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-token-unique", "Sets if the token metadata is unique for the deployed smart contract")
.addParam("unique", "The boolean unique Token to set", false, types.boolean)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setUnique(taskArguments.unique);
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("token-uri", "Fetches the token metadata for the given token ID")
.addParam("id", "The tokenID to fetch metadata for", undefined, types.integer)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const response = await contract.tokenURI(taskArguments.id);
    
    const metadata_url = response;
    console.log(`Metadata URL: ${metadata_url}`);

    const metadata = await fetch(metadata_url).then(res => res.json());
    console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
});