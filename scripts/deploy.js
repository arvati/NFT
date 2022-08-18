const { getLedgerContractFactory, getLedgerAccount } = require("./helpers");

task("check-balance", "Prints out the balance of your account").setAction(async function (taskArguments, hre) {
	const account = await getLedgerAccount(hre)
	console.log(`Account balance: ${(await account.getBalance()).toString()}`);
});

task("deploy", "Deploys the NFT.sol contract").setAction(async function (taskArguments, hre) {
	console.log(`Network: ${hre.network.name}`);
	const nftContractFactory = await getLedgerContractFactory(hre.config.nftContract.name, hre);
	const nft = await nftContractFactory.deploy({ gasLimit: 10_000_000, gasPrice: ethers.utils.parseUnits('45', 'gwei')});
	await nft.deployed()
	console.log(`Contract deployed to address: ${nft.address}`);
});