const { expect } = require("chai");
const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const { ethers } = hre;
const  contractName = hre.config.nftContract.name;
const { encodeLeaf } = require("./helpers");

it("should be hardhat network", async () => {
    expect(hre.network.name).to.equal("hardhat");
});

describe("Claim functions at contract " + contractName, function () {
    let contract;
    let owner;
    let alice;
    let bob;
    let ownerAddress;
    let aliceAddress;
    let bobAddress;

    beforeEach(async () => {
      [owner, alice, bob] = await ethers.getSigners();
      ownerAddress = await owner.getAddress();
      aliceAddress = await alice.getAddress();
      bobAddress = await bob.getAddress();
      const contractFactory = await ethers.getContractFactory(contractName);
      const { baseTokenURI, tokenUriPrefix, contractUriPrefix, uriSuffix } = hre.config.nftContract.constructor;
      contract = await contractFactory.deploy(baseTokenURI, tokenUriPrefix, contractUriPrefix, uriSuffix);
      await contract.deployed()
    });

    it("Claim token", async function () {
        const voucher = "LIFT"
        const list = [
            encodeLeaf(ownerAddress,voucher),
            encodeLeaf(aliceAddress,voucher),
            encodeLeaf(bobAddress,voucher)
        ];
        const merkleTree = new MerkleTree(list, keccak256, {hashLeaves: true, sortPairs: true});
        const root = merkleTree.getHexRoot();
        const setMerkleRootTx = await contract.setMerkleRoot(root, voucher);
        await setMerkleRootTx.wait();

        const leaf = keccak256(list[1]);
        const proof = merkleTree.getHexProof(leaf);

        expect(await contract.checkClaim(proof, aliceAddress, voucher)).to.equal(true);

        const tokenId = await contract.totalSupply();
        const mintPrice = await contract.mintVoucherPrice();

        let claimTx = await contract.connect(alice)['claim(bytes32[],string)'](proof, voucher, { value: mintPrice });
        
        await claimTx.wait();
        expect(await contract.ownerOf(tokenId)).to.equal(aliceAddress);

        await expect(contract.connect(alice)['claim(bytes32[],string)'](proof, voucher, { value: mintPrice })).to.be.revertedWith("Address has already claimed this voucher.");
      });
});
