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

import "contracts/helpers.sol";

/// @custom:security-contact mazinho
contract Dino is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    using StringsHelper for string;

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    string private _baseTokenURI;
    string private _tokenUriPrefix;
    string private _contractUriPrefix;
    string private _uriSuffix;
    uint256 private _unique;

    constructor(string memory baseTokenURI, string memory tokenUriPrefix, string memory contractUriPrefix, string memory uriSuffix) 
        ERC721("Dino Game", "Dino") 
    {
        _baseTokenURI = baseTokenURI;
        _tokenUriPrefix = tokenUriPrefix;
        _contractUriPrefix = contractUriPrefix;
        _uriSuffix = uriSuffix;
        _unique = 0;
    }

    function _baseURI() 
        internal view override 
        returns (string memory) 
    {
        return _baseTokenURI;
    }

    function setBaseTokenURI(string memory baseTokenURI) 
        public onlyOwner
    {
        _baseTokenURI = baseTokenURI;
    }

    function pause() 
        public onlyOwner 
    {
        _pause();
    }

    function unpause() 
        public onlyOwner 
    {
        _unpause();
    }

    function safeMint(address to) 
        public onlyOwner 
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function safeMint(address to, string memory uri) 
        public onlyOwner 
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
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

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) 
        internal 
    {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function setTokenURI(uint256 tokenId, string memory uri) 
        public onlyOwner 
    {
        _setTokenURI(tokenId, uri);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal whenNotPaused override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }


    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) 
        internal override(ERC721) 
    {
        super._burn(tokenId);
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function setUnique(uint256 unique)
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
        public view override(ERC721) 
        returns (string memory) 
    {
        _requireMinted(tokenId);
        string memory tokenURIsaved = _tokenURIs[tokenId];
        string memory baseURI = _baseURI();
        string memory tokenURIresult;      
        
        if (tokenURIsaved.contains(":")) {
            return tokenURIsaved;
        } else {
            tokenURIresult = baseURI.concatenate(_tokenUriPrefix);
            if (bytes(tokenURIsaved).length > 0) {
                tokenURIresult = tokenURIresult.concatenate(tokenURIsaved);
            } else if (tokenId < _unique) {
                tokenURIresult = tokenURIresult.concatenate(tokenId.toString());
            } else {
                tokenURIresult = tokenURIresult.concatenate(symbol());
            }
            return tokenURIresult.concatenate(_uriSuffix);  
        }   
    }

}
