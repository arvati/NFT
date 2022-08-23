const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;
const  contractName = hre.config.nftContract.name;
const { contractURI, tokenURI} = require("./helpers");

it("should be hardhat network", async () => {
  expect(hre.network.name).to.equal("hardhat");
});

describe("Basic functions at contract " + contractName, function () {

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
    ownerAddress = await owner.getAddress();
    aliceAddress = await alice.getAddress();
    bobAddress = await bob.getAddress();
    const contractFactory = await ethers.getContractFactory(contractName);
    contract = await contractFactory.deploy(baseTokenURI, tokenUriPrefix, contractUriPrefix, uriSuffix);
    await contract.deployed()
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
    it("should be corrected totalSupply", async function () {
      expect(await contract.totalSupply()).to.equal(0);
    });
  });

  describe("Mint Tokens", () => {
    it("mint 1 token", async function () {
      const tokenId = await contract.totalSupply();
      let safeMintTx = await contract['mint(address)'](ownerAddress);
      await safeMintTx.wait();
      expect(await contract.ownerOf(tokenId)).to.equal(ownerAddress);
      expect(await contract.tokenURI(tokenId)).to.equal(tokenURI(baseTokenURI,tokenUriPrefix,symbol,uriSuffix,0 , tokenId, ""));
      expect(await contract.totalSupply()).to.equal(tokenId+1);
    });

    it("mint Multi token", async function () {
      const tokenId = await contract.totalSupply();
      let multiMintTx = await contract.mmint([ownerAddress,aliceAddress,bobAddress]);
      await multiMintTx.wait();
      expect(await contract.ownerOf(tokenId)).to.equal(ownerAddress);
      expect(await contract.ownerOf(tokenId+1)).to.equal(aliceAddress);
      expect(await contract.ownerOf(tokenId+2)).to.equal(bobAddress);
      expect(await contract.totalSupply()).to.equal(tokenId+3);
    });

    it("mint 1 token with Uri", async function () {
      const tokenURIsaved = "owner"
      const tokenId = await contract.totalSupply();
      let safeMintURITx = await contract['mint(address,string)'](ownerAddress,tokenURIsaved);     
      await safeMintURITx.wait();
      expect(await contract.ownerOf(tokenId)).to.equal(ownerAddress);
      expect(await contract.tokenURI(tokenId)).to.equal(tokenURI(baseTokenURI,tokenUriPrefix,symbol,uriSuffix,0 ,tokenId, tokenURIsaved));
      expect(await contract.totalSupply()).to.equal(tokenId+1);
    });

    it("mint and burn token", async function () {
      const tokenId = await contract.totalSupply();
      let safeMintTx = await contract['mint(address)'](ownerAddress);
      await safeMintTx.wait();
      expect(await contract.ownerOf(tokenId)).to.equal(ownerAddress);
      let burnTx = await contract.burn(tokenId);
      await burnTx.wait();
      await expect(contract.ownerOf(tokenId)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await contract.totalSupply()).to.equal(tokenId);
    });

    it("mint with uri and burn token", async function () {
      const tokenURIsaved = "custom"
      const tokenId = await contract.totalSupply();
      let safeMintURITx = await contract['mint(address,string)'](ownerAddress,tokenURIsaved)
      await safeMintURITx.wait();
      expect(await contract.ownerOf(tokenId)).to.equal(ownerAddress);
      let burnTx = await contract.burn(tokenId);
      await burnTx.wait();
      await expect(contract.ownerOf(tokenId)).to.be.revertedWith("ERC721: invalid token ID");
    });

  });

  describe("contractURI", () => {
    it("Should return the new contractURI once BaseTokenURI is changed", async function () {
      const newBaseTokenURI = "https://arvati.github.io/NFT/"
      const setBaseTokenURITx = await contract.setBaseTokenURI(newBaseTokenURI);
      await setBaseTokenURITx.wait();
      expect(await contract.contractURI()).to.equal(contractURI(newBaseTokenURI, contractUriPrefix, symbol, uriSuffix));
    });

    it("Should return the new contractURI once BaseTokenURI is empty", async function () {
      const newBaseTokenURI = ""
      const setBaseTokenURITx = await contract.setBaseTokenURI(newBaseTokenURI);
      await setBaseTokenURITx.wait();
      expect(await contract.contractURI()).to.equal(contractURI(newBaseTokenURI, contractUriPrefix, symbol, uriSuffix));
    });    

    it("Should return the new contractURI once ContractUriPrefix is changed", async function () {
      const newContractUriPrefix = ""
      const setContractUriPrefixTx = await contract.setContractUriPrefix(newContractUriPrefix);
      await setContractUriPrefixTx.wait();
      expect(await contract.contractURI()).to.equal(contractURI(baseTokenURI, newContractUriPrefix, symbol, uriSuffix));
    });

    it("Should return the new contractURI once UriSuffix is changed", async function () {
      const newUriSuffix = ""
      const setUriSuffixTx = await contract.setUriSuffix(newUriSuffix);
      await setUriSuffixTx.wait();
      expect(await contract.contractURI()).to.equal(contractURI(baseTokenURI, contractUriPrefix, symbol, newUriSuffix));
    });
  });

  describe("tokenURI", async function () {

    let tokenId;

    beforeEach(async () => {
      tokenId = await contract.totalSupply();
      const safeMintTx = await contract['mint(address)'](ownerAddress);
      await safeMintTx.wait()
    });

    it("Should return the new tokenURI once BaseTokenURI is changed", async function () {
      const newBaseTokenURI = "https://arvati.github.io/NFT/"
      const setBaseTokenURITx = await contract.setBaseTokenURI(newBaseTokenURI);
      await setBaseTokenURITx.wait();
      expect(await contract.tokenURI(tokenId)).to.equal(tokenURI(newBaseTokenURI,tokenUriPrefix,symbol,uriSuffix,0 ,tokenId, ""));
    });

    it("Should return the new tokenURI once TokenUriPrefix is changed", async function () {
      const newTokenUriPrefix = ""
      const setTokenUriPrefixTx = await contract.setTokenUriPrefix(newTokenUriPrefix);
      await setTokenUriPrefixTx.wait();
      expect(await contract.tokenURI(tokenId)).to.equal(tokenURI(baseTokenURI,newTokenUriPrefix,symbol,uriSuffix,0 ,tokenId, ""));
    });

    it("Should return the new tokenURI once UriSuffix is changed", async function () {
      const newUriSuffix = ""
      const setUriSuffixTx = await contract.setUriSuffix(newUriSuffix);
      await setUriSuffixTx.wait();
      expect(await contract.tokenURI(tokenId)).to.equal(tokenURI(baseTokenURI,tokenUriPrefix,symbol,newUriSuffix,0 ,tokenId, ""));
    });

    it("Should return the new tokenURI once Unique is changed", async function () {
      const unique = 10
      const setUniqueTx = await contract.setUnique(unique);
      await setUniqueTx.wait();
      expect(await contract.tokenURI(tokenId)).to.equal(tokenURI(baseTokenURI,tokenUriPrefix,symbol,uriSuffix, unique ,tokenId, ""));
    });    

    it("Should return the new tokenURI once tokenURI[tokenId] is changed", async function () {
      const tokenURIsaved = "custom"
      const setTokenURITx = await contract.setTokenURI(0, tokenURIsaved);
      await setTokenURITx.wait();
      expect(await contract.tokenURI(tokenId)).to.equal(tokenURI(baseTokenURI,tokenUriPrefix,symbol,uriSuffix, 0 ,tokenId, tokenURIsaved));
    });  

    it("Should return the new tokenURI once tokenURI[tokenId] is changed but baseTokenURI is empty", async function () {
      const tokenURIsaved = "custom_error"
      const setTokenURITx = await contract.setTokenURI(0, tokenURIsaved);
      await setTokenURITx.wait();
      const newBaseTokenURI = ""
      const setBaseTokenURITx = await contract.setBaseTokenURI(newBaseTokenURI);
      await setBaseTokenURITx.wait();
      expect(await contract.tokenURI(tokenId)).to.equal(tokenURI(newBaseTokenURI,tokenUriPrefix,symbol,uriSuffix, 0 ,tokenId, tokenURIsaved));
    });  

    it("Should return the new tokenURI once tokenURI[0] is forced", async function () {
      const tokenURIsaved = "ipfs://testCID/custom.json"
      const setTokenURITx = await contract.setTokenURI(0, tokenURIsaved);
      await setTokenURITx.wait();
      expect(await contract.tokenURI(tokenId)).to.equal(tokenURI(baseTokenURI,tokenUriPrefix,symbol,uriSuffix, 0 ,tokenId, tokenURIsaved));
    });  
  });

  describe("Pause", () => {
    beforeEach(async () => {
      const safeMintTx = await contract['mint(address)'](ownerAddress);
      await safeMintTx.wait()
    });

    it("Transfer Token Paused", async function () {
      tokenId = await contract.totalSupply();
      expect(await contract['mint(address)'](ownerAddress)).to.emit(contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, ownerAddress, tokenId);

      expect( await contract['safeTransferFrom(address,address,uint256)'](ownerAddress, aliceAddress ,tokenId)).to.be.not.reverted;

      expect(await contract.pause()).to.be.not.reverted;

      await expect(contract.connect(alice)['safeTransferFrom(address,address,uint256)'](aliceAddress, bobAddress ,tokenId)).to.be.revertedWith("Pausable: paused");
      expect(await contract.ownerOf(tokenId)).to.equal(aliceAddress);
    });

    it("Transfer Token unPaused", async function () {
      tokenId = await contract.totalSupply();
      expect(await contract['mint(address)'](ownerAddress)).to.emit(contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, ownerAddress, tokenId);

      await expect(contract['safeTransferFrom(address,address,uint256)'](ownerAddress, aliceAddress ,tokenId)).to.be.not.reverted;

      expect(await contract.ownerOf(tokenId)).to.equal(aliceAddress);

      expect(await contract.pause()).to.be.not.reverted;

      await expect(contract.connect(alice)['safeTransferFrom(address,address,uint256)'](aliceAddress, bobAddress ,tokenId)).to.be.revertedWith("Pausable: paused");
      expect(await contract.ownerOf(tokenId)).to.equal(aliceAddress);

      expect(await contract.unpause()).to.be.not.reverted;

      await expect(contract.connect(alice)['safeTransferFrom(address,address,uint256)'](aliceAddress, bobAddress ,tokenId)).to.emit(contract, "Transfer")
        .withArgs(aliceAddress, bobAddress, tokenId);
      expect(await contract.ownerOf(tokenId)).to.equal(bobAddress);

    });

  });
});