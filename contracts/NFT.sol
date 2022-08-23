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
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import "hardhat/console.sol";

import "contracts/helpers.sol";

/// @custom:security-contact mazinho
contract Dino is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    using StringsHelper for string;

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;
    mapping(bytes32 => bool) private _Claims;
    mapping(bytes => bytes32) private _merkleRoots;

    string private _baseTokenURI;
    string private _tokenUriPrefix;
    string private _contractUriPrefix;
    string private _uriSuffix;
    uint256 private _unique;

    uint256 public maxSupply;
    uint256 public claimPrice;
    uint256 public claimVoucherPrice;

    constructor(string memory baseTokenURI, string memory tokenUriPrefix, string memory contractUriPrefix, string memory uriSuffix) 
        ERC721("Dino Game", "Dino") 
    {
        _baseTokenURI = baseTokenURI;
        _tokenUriPrefix = tokenUriPrefix;
        _contractUriPrefix = contractUriPrefix;
        _uriSuffix = uriSuffix;
        _unique = 0;
        maxSupply = 1024;
        claimPrice = 0.1 ether;
        claimVoucherPrice = 0.001 ether;
    }

    function withdraw() 
        public onlyOwner 
    {
        uint256 _amount = address(this).balance;
        require((_amount >= 0), "No balance to withdraw");
        (bool success, ) = owner().call{value: _amount}("");
        require(success, "Withdraw failed");
    }

    function withdraw(address _tokenContract) 
        public onlyOwner 
    {
        IERC20 tokenContract = IERC20(_tokenContract);
        uint256 _amount = tokenContract.balanceOf(address(this));
        require(_amount >= 0, "No Token balance to withdraw");
        bool success = tokenContract.transferFrom(address(this), owner(), _amount);
        require(success, "Token withdraw failed");
    }

    function _baseURI() 
        internal view override 
        returns (string memory) 
    {
        return _baseTokenURI;
    }

    function setMaxSupply(uint256 _maxSupply) 
        public onlyOwner
    {
        maxSupply = _maxSupply;
    }

    function setClaimPrice(uint256 _mintPrice) 
        public onlyOwner
    {
        claimPrice = _mintPrice;
    }

    function setClaimVoucherPrice(uint256 _mintPrice) 
        public onlyOwner
    {
        claimVoucherPrice = _mintPrice;
    }

    function setBaseTokenURI(string memory baseTokenURI) 
        public onlyOwner
    {
        _baseTokenURI = baseTokenURI;
    }

    function setMerkleRoot(bytes32 merkleRoot, string memory voucher) 
        public onlyOwner
    {
        _merkleRoots[abi.encodePacked(voucher)] = merkleRoot;
    }

    function removeMerkleRoot(string memory voucher) 
        public onlyOwner
    {
        delete _merkleRoots[abi.encodePacked(voucher)];
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

    function mint(address to) 
        public onlyOwner 
    {
        require(totalSupply() + 1 <= maxSupply, "Supply is exhausted");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function checkClaim(bytes32[] calldata proof, address to, string memory voucher)
        view public onlyOwner
        returns(bool) 
    {
        bytes32 leaf = keccak256(abi.encode(to, voucher));
        bytes32 root = _merkleRoots[abi.encodePacked(voucher)];
        bool verified = MerkleProof.verify(proof, root, leaf);
        return verified;
    }

    function claim(bytes32[] calldata _merkleProof, string memory voucher) 
        public payable 
    {
        require(totalSupply() + 1 <= maxSupply, "Supply is exhausted");
        require( msg.value >= claimVoucherPrice,"Insufficient value for voucher claim");
        bytes32 leaf = keccak256(abi.encode(msg.sender, voucher));
        require(!_Claims[leaf], "Address has already claimed this voucher.");
        bytes32 root = _merkleRoots[abi.encodePacked(voucher)];
        require(MerkleProof.verify(_merkleProof, root, leaf), "Invalid proof for this root and leaf");
        _Claims[leaf] = true ;
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);        
    }

    function claim() 
        public payable 
    {
        require(totalSupply() + 1 <= maxSupply, "Supply is exhausted");
        require( msg.value >= claimPrice,"Insufficient value for claim");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);        
    }

    function mint(address to, string memory uri) 
        public onlyOwner 
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function mmint(address[] memory tos)
        public onlyOwner 
    {
        uint i=0;
        for(i;i<tos.length;i++)
        {
            mint(tos[i]);
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
        string memory contractURIresult;
        if (!baseURI.isEmpty()) {
            contractURIresult = baseURI.concat(_contractUriPrefix);
            contractURIresult = contractURIresult.concat(symbol());
            return contractURIresult.concat(_uriSuffix);
        } else {
            return "";
        }
    }

    function tokenURI(uint256 tokenId)
        public view override(ERC721) 
        returns (string memory) 
    {
        _requireMinted(tokenId);
        string memory tokenURIsaved = _tokenURIs[tokenId];
        string memory baseURI = _baseURI();
        string memory tokenURIresult;      
        if (tokenURIsaved.includes(":")) {
            return tokenURIsaved;
        } else if (!baseURI.isEmpty()) {
            tokenURIresult = baseURI.concat(_tokenUriPrefix);
            if (!tokenURIsaved.isEmpty()) {
                tokenURIresult = tokenURIresult.concat(tokenURIsaved);
            } else if (tokenId < _unique) {
                tokenURIresult = tokenURIresult.concat(tokenId.toString());
            } else {
                tokenURIresult = tokenURIresult.concat(symbol());
            }
            return tokenURIresult.concat(_uriSuffix);  
        } else {
            return (!tokenURIsaved.isEmpty()) ? tokenURIsaved : "";
        }  
    }

}
