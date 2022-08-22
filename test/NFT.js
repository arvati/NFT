const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;
const  contractName = hre.config.nftContract.name;

it("should be hardhat network", async () => {
  expect(hre.network.name).to.equal("hardhat");
});

describe(contractName, function () {

  let contractFactory;
  let contract;
  let owner;
  let alice;
  let bob;
  let ownerAddress;
  let aliceAddress;
  let bobAddress;

  const { name, symbol, baseTokenURI, tokenUriPrefix, contractUriPrefix, uriSuffix } = hre.config.nftContract.constructor;

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    contractFactory = await ethers.getContractFactory(contractName);
    contract = await contractFactory.deploy(baseTokenURI, tokenUriPrefix, contractUriPrefix, uriSuffix);
    await contract.deployed()
    ownerAddress = await owner.getAddress();
    aliceAddress = await alice.getAddress();
    bobAddress = await bob.getAddress();
    //console.log(`Contract deployed to address: ${contract.address}`);
    //console.log(`Contract owner: ${ownerAddress}`);
  });

  describe("setup", () => {
    it("should be corrected symbol " + symbol, async () => {
        expect(await contract.symbol()).to.equal(symbol);
    });
    it("should be corrected name " + name, async () => {
      expect(await contract.name()).to.equal(name);
    });
    it("should be corrected owner", async () => {
      expect(await contract.owner()).to.equal(ownerAddress);
    });
    it("should be corrected contractURI " + baseTokenURI + contractUriPrefix + symbol + uriSuffix, async function () {
      expect(await contract.contractURI()).to.equal(baseTokenURI + contractUriPrefix + symbol + uriSuffix);
    });
  });

  describe("contractURI", () => {

    it("Should return the new contractURI once BaseTokenURI is changed", async function () {
      const newBaseTokenURI = "https://arvati.github.io/NFT/"
      const setBaseTokenURITx = await contract.setBaseTokenURI(newBaseTokenURI);
      await setBaseTokenURITx.wait();
      expect(await contract.contractURI()).to.equal(newBaseTokenURI + contractUriPrefix + symbol + uriSuffix);
    });

  });
});