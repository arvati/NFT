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
contract Dino is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    string private _baseTokenURI;
    string private _tokenUriPrefix;
    string private _contractUriPrefix;
    string private _uriSuffix;
    uint256 private _unique;

    constructor() ERC721("Dino Game", "Dino") 
    {
        _baseTokenURI = "https://corp.eng.br/NFT/";
        _tokenUriPrefix = "metadata/dino/";
        _contractUriPrefix = "collection/";
        _uriSuffix = ".json";
        _unique = 0;
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

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal whenNotPaused override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }


    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721) {
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

    function safeConcatenate(string memory text1, string memory text2)
        private pure
        returns (string memory)
    {
        if (bytes(text2).length > 0) {
            return bytes(text1).length > 0 ? string(abi.encodePacked(text1, text2)) : text2;
        } else {
            return bytes(text1).length > 0 ? text1 : "";
        }
    }

    function safeContains(string memory what, string memory where) 
        private pure
        returns (bool)
    {
        bytes memory whatBytes = bytes (what);
        bytes memory whereBytes = bytes (where);

        if (whereBytes.length == 0 || whatBytes.length == 0) {
            return false;
        }
        if (whereBytes.length < whatBytes.length) {
            whereBytes = whatBytes;
            whatBytes = bytes (where);
        }
        bool found = false;
        for (uint i = 0; i <= whereBytes.length - whatBytes.length; i++) {
            bool flag = true;
            for (uint j = 0; j < whatBytes.length; j++)
                if (whereBytes [i + j] != whatBytes [j]) {
                    flag = false;
                    break;
                }
            if (flag) {
                found = true;
                break;
            }
        }
        return found;
    }

    function tokenURI(uint256 tokenId)
        public view override(ERC721) 
        returns (string memory) 
    {
        _requireMinted(tokenId);
        string memory tokenURIsaved = _tokenURIs[tokenId];
        string memory tokenURIresult;      
        
        if (safeContains(":",tokenURIsaved)) {
            return tokenURIsaved;
        } else {
            tokenURIresult = safeConcatenate(_baseURI(), _tokenUriPrefix);
            if (bytes(tokenURIsaved).length > 0) {
                tokenURIresult = safeConcatenate(tokenURIresult, tokenURIsaved);
            } else if (tokenId < _unique) {
                tokenURIresult = safeConcatenate(tokenURIresult, tokenId.toString());
            } else {
                tokenURIresult = safeConcatenate(tokenURIresult, symbol());
            }
            return safeConcatenate(tokenURIresult, _uriSuffix);  
        }   
    }

}
