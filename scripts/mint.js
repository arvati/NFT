
const { getLedgerContract, getLedgerAccount} = require("./helpers");

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));


task("mint", "Mints from the deployed smart contract")
.addOptionalParam("address", "The address to receive a token", undefined ,types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const ledgerAccount = await getLedgerAccount(hre);
    const recipientAddress = (taskArguments.address) ? "0x".concat(taskArguments.address) : await ledgerAccount.getAddress();
    console.log(`Minting to: ${recipientAddress}`);
    const transactionResponse = await contract.safeMint(recipientAddress, {
        gasLimit: 500_000,
    });
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
.addParam("baseUrl", "The base of the tokenURI endpoint to set", "https://arvati.github.io/NFT/", types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    //console.log(`Address: ${hre.config.nftContract.networks[hre.network.name]}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setBaseTokenURI(taskArguments.baseUrl, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-uri-suffix", "Sets the URI Suffix for the deployed smart contract")
.addParam("uriSuffix", "The Suffix of the tokenURI endpoint to set", ".json", types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setUriSuffix(taskArguments.uriSuffix, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-token-uri-prefix", "Sets the token URI Prefix for the deployed smart contract")
.addParam("tokenUriPrefix", "The Prefix of the tokenURI endpoint to set", "metadata/", types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setTokenUriPrefix(taskArguments.tokenUriPrefix, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-contract-uri-prefix", "Sets the contract URI Prefix for the deployed smart contract")
.addParam("contractUriPrefix", "The Prefix of the contractUri endpoint to set", "collection/", types.string)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setContractUriPrefix(taskArguments.contractUriPrefix, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-token-unique", "Sets if the token metadata is unique for the deployed smart contract")
.addParam("tokenUnique", "The boolean unique Token to set", false, types.boolean)
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const transactionResponse = await contract.setUnique(taskArguments.tokenUnique, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("token-uri", "Fetches the token metadata for the given token ID")
.addParam("tokenId", "The tokenID to fetch metadata for")
.setAction(async function (taskArguments, hre) {
    console.log(`Network: ${hre.network.name}`);
    const contract = await getLedgerContract(hre.config.nftContract.name, hre.config.nftContract.networks[hre.network.name], hre);
    const response = await contract.tokenURI(taskArguments.tokenId, {
        gasLimit: 500_000,
    });
    
    const metadata_url = response;
    console.log(`Metadata URL: ${metadata_url}`);

    const metadata = await fetch(metadata_url).then(res => res.json());
    console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
});