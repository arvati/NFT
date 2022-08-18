//Contract based on [https://docs.openzeppelin.com/contracts/4.x/erc721](https://docs.openzeppelin.com/contracts/4.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

/// @custom:security-contact mazinho
contract NFT1a is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    string private _baseTokenURI;
    string private _tokenUriPrefix;
    string private _contractUriPrefix;
    string private _uriSuffix;
    bool private _unique;

    constructor() ERC721("NFT 1a", "NFT1a") 
    {
        _baseTokenURI = "https://corp.eng.br/NFT/";
        _tokenUriPrefix = "metadata/";
        _contractUriPrefix = "collection/";
        _uriSuffix = ".json";
        _unique = false;
    }

    function _baseURI() internal view override returns (string memory) 
    {
        return _baseTokenURI;
    }

    function setBaseTokenURI(string memory baseTokenURI) 
        public onlyOwner
    {
        _baseTokenURI = baseTokenURI;
    }

    function pause() 
        public onlyOwner {
        _pause();
    }

    function unpause() 
        public onlyOwner {
        _unpause();
    }

    function safeMint(address to) 
        public onlyOwner 
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function multiMint(address[] memory tos)
        public onlyOwner 
    {
        uint i=0;
        for(i;i<tos.length;i++)
        {
            safeMint(tos[i]);
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal whenNotPaused override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function setUnique(bool unique)
        public onlyOwner 
    {
        _unique = unique;
    }

    function setUriSuffix(string memory uriSuffix)
        public onlyOwner 
    {
        _uriSuffix = uriSuffix;
    }

    function setContractUriPrefix(string memory contractUriPrefix)
        public onlyOwner 
    {
        _contractUriPrefix = contractUriPrefix;
    }

    function setTokenUriPrefix(string memory tokenUriPrefix)
        public onlyOwner 
    {
        _tokenUriPrefix = tokenUriPrefix;
    }

    function contractURI() 
        public view
        returns (string memory) 
    {
        string memory baseURI = _baseURI();
        string memory symbol = symbol();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, _contractUriPrefix, symbol, _uriSuffix)) : "";
    }

    function tokenURI(uint256 tokenId)
        public view override 
        returns (string memory) 
    {
        _requireMinted(tokenId);
        string memory baseURI = _baseURI();
        string memory symbol = symbol();
        if (_unique) {
            return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, _tokenUriPrefix, tokenId.toString(), _uriSuffix)) : "";
        }
        else {
            return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, _tokenUriPrefix, symbol, _uriSuffix)) : "";
        }       
    }

}
