import { LedgerSigner } from "@anders-t/ethers-ledger";
import { ethers, network } from "hardhat";
import { logger, appConfig } from "./helpers"

export const getAccount = async () => {
    return getOwner();
}

export const getOwner = async () => {
    const [owner] = await getSigners()
    return owner;
}

export const getSigners =async () => {
    logger(5, `Network Name: ${network.name}`);
    if (!appConfig.ledger.connect || network.name == "hardhat" || network.name == "localhost") {
        const hardhatSigners = await ethers.getSigners();
        logger(5, `Owner account: ${hardhatSigners[0].address}`);
        return hardhatSigners
    } else {
        const ledgerSigner = new LedgerSigner(ethers.provider, `m/44'/60'/${(appConfig.ledger.path)}'/0/0`);
        logger(5, `Ledger account: ${(await ledgerSigner.getAddress())}`);
        return [ledgerSigner];
    }
}

export const getContractFactory = async (contractName: string, _signer?: any) => {
    const signer = (typeof _signer !== 'undefined') ? _signer : await getAccount();
    logger(5, `Using contract: ${contractName}`);
    const myContractFactory = await ethers.getContractFactory(contractName);
    return myContractFactory.connect(signer);
}

export const getContract = async (contractName: string, contractAddress: string, _signer?: any) => {
    const signer = (typeof _signer !== 'undefined') ? _signer : await getAccount();
    logger(5,`Using contract address: ${contractAddress}`);
    let myContract = await getContractFactory(contractName, signer);
    return myContract.attach(contractAddress);
}