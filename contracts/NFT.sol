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
contract NFT1 is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    string public baseTokenURI;
    string public tokenUriPrefix;
    string public contractUriPrefix;
    string public uriSuffix;
    bool private _unique;

    constructor() ERC721("NFT 1", "NFT1") 
    {
        baseTokenURI = "https://arvati.github.io/NFT/";
        tokenUriPrefix = "metadata/";
        contractUriPrefix = "collection/";
        uriSuffix = ".json";
        _unique = false;
    }

    function _baseURI() internal view override returns (string memory) 
    {
        return baseTokenURI;
    }

    function setBaseTokenURI(string memory _baseTokenURI) 
        public onlyOwner
    {
        baseTokenURI = _baseTokenURI;
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

    function setUriSuffix(string memory _uriSuffix)
        public onlyOwner 
    {
        uriSuffix = _uriSuffix;
    }

    function setContractUriPrefix(string memory _contractUriPrefix)
        public onlyOwner 
    {
        contractUriPrefix = _contractUriPrefix;
    }

    function setTokenUriPrefix(string memory _tokenUriPrefix)
        public onlyOwner 
    {
        tokenUriPrefix = _tokenUriPrefix;
    }

    function contractURI() 
        public view
        returns (string memory) 
    {
        string memory baseURI = _baseURI();
        string memory symbol = symbol();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, contractUriPrefix, symbol, uriSuffix)) : "";
    }

    function tokenURI(uint256 tokenId)
        public view override 
        returns (string memory) 
    {
        _requireMinted(tokenId);
        string memory baseURI = _baseURI();
        string memory symbol = symbol();
        if (_unique) {
            return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenUriPrefix, tokenId.toString(), uriSuffix)) : "";
        }
        else {
            return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenUriPrefix, symbol, uriSuffix)) : "";
        }       
    }

}
