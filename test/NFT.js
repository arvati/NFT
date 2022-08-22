const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;
const  contractName = hre.config.nftContract.name;
const { contractURI, tokenURI} = require("./helpers");

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
    it("should be corrected symbol " + symbol, async function () {
        expect(await contract.symbol()).to.equal(symbol);
    });
    it("should be corrected name " + name, async function () {
      expect(await contract.name()).to.equal(name);
    });
    it("should be corrected owner", async function () {
      expect(await contract.owner()).to.equal(ownerAddress);
    });
    it(`should be corrected contractURI  ${(contractURI(baseTokenURI, contractUriPrefix, symbol, uriSuffix))}`, async function () {
      expect(await contract.contractURI()).to.equal(contractURI(baseTokenURI, contractUriPrefix, symbol, uriSuffix));
    });
  });

  describe("Mint Tokens", () => {
    
    it("mint 1 token", async function () {
      let safeMintTx = await contract.safeMint(ownerAddress);
      await safeMintTx.wait();
      expect(await contract.ownerOf(0)).to.equal(ownerAddress);
      expect(await contract.tokenURI(0)).to.equal(tokenURI(baseTokenURI,tokenUriPrefix,symbol,uriSuffix,0 ,0, ""));
    });

    it("mint Multi token", async function () {
      let multiMintTx = await contract.multiMint([ownerAddress,aliceAddress,bobAddress]);
      await multiMintTx.wait();
      expect(await contract.ownerOf(0)).to.equal(ownerAddress);
      expect(await contract.ownerOf(1)).to.equal(aliceAddress);
      expect(await contract.ownerOf(2)).to.equal(bobAddress);
    });

    it("mint 1 token with Uri", async function () {
      const tokenURIsaved = "owner"
      let safeMintURITx = await contract.safeMintURI(ownerAddress, tokenURIsaved);
      await safeMintURITx.wait();
      expect(await contract.ownerOf(0)).to.equal(ownerAddress);
      expect(await contract.tokenURI(0)).to.equal(tokenURI(baseTokenURI,tokenUriPrefix,symbol,uriSuffix,0 ,0, tokenURIsaved));
    });

  });

  describe("contractURI", () => {

    it("Should return the new contractURI once BaseTokenURI is changed", async function () {
      const newBaseTokenURI = "https://arvati.github.io/NFT/"
      const setBaseTokenURITx = await contract.setBaseTokenURI(newBaseTokenURI);
      await setBaseTokenURITx.wait();
      expect(await contract.contractURI()).to.equal(newBaseTokenURI + contractUriPrefix + symbol + uriSuffix);
    });

    it("Should return the new contractURI once ContractUriPrefix is changed", async function () {
      const newContractUriPrefix = ""
      const setContractUriPrefixTx = await contract.setContractUriPrefix(newContractUriPrefix);
      await setContractUriPrefixTx.wait();
      expect(await contract.contractURI()).to.equal(baseTokenURI + newContractUriPrefix + symbol + uriSuffix);
    });

    it("Should return the new contractURI once UriSuffix is changed", async function () {
      const newUriSuffix = ""
      const setUriSuffixTx = await contract.setUriSuffix(newUriSuffix);
      await setUriSuffixTx.wait();
      expect(await contract.contractURI()).to.equal(baseTokenURI + contractUriPrefix + symbol + newUriSuffix);
    });

  });
  describe("tokenURI", () => {
    beforeEach(async () => {
      const safeMintTx = await contract.safeMint(ownerAddress);
      await safeMintTx.wait()
    });

    it("Should return the new tokenURI once BaseTokenURI is changed", async function () {
      const newBaseTokenURI = "https://arvati.github.io/NFT/"
      const setBaseTokenURITx = await contract.setBaseTokenURI(newBaseTokenURI);
      await setBaseTokenURITx.wait();
      expect(await contract.tokenURI(0)).to.equal(tokenURI(newBaseTokenURI,tokenUriPrefix,symbol,uriSuffix,0 ,0, ""));
      
    });

    it("Should return the new tokenURI once TokenUriPrefix is changed", async function () {
      const newTokenUriPrefix = ""
      const setTokenUriPrefixTx = await contract.setTokenUriPrefix(newTokenUriPrefix);
      await setTokenUriPrefixTx.wait();
      expect(await contract.tokenURI(0)).to.equal(tokenURI(baseTokenURI,newTokenUriPrefix,symbol,uriSuffix,0 ,0, ""));
      
    });

    it("Should return the new tokenURI once UriSuffix is changed", async function () {
      const newUriSuffix = ""
      const setUriSuffixTx = await contract.setUriSuffix(newUriSuffix);
      await setUriSuffixTx.wait();
      expect(await contract.tokenURI(0)).to.equal(tokenURI(baseTokenURI,tokenUriPrefix,symbol,newUriSuffix,0 ,0, ""));
      
    });

  });
});