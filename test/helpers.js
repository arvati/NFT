
function contractURI (baseTokenURI, contractUriPrefix, symbol, uriSuffix ) {
    let contractURIresult = "";
    if (baseTokenURI.length > 0) {
        contractURIresult = baseTokenURI.concat(contractUriPrefix,symbol,uriSuffix) ;
    }
    //console.log("contractURI: " + contractURIresult)
    return contractURIresult;
}

function tokenURI (baseTokenURI, tokenUriPrefix, symbol, uriSuffix, _unique, tokenId, tokenURIsaved) {
    let tokenURIresult = "";
    if (tokenURIsaved.includes(":")) {
        tokenURIresult = tokenURIsaved;
    } else if (baseTokenURI.length > 0) {
        tokenURIresult = baseTokenURI.concat(tokenUriPrefix);
        if (tokenURIsaved.length > 0) {
            tokenURIresult = tokenURIresult.concat(tokenURIsaved);
        } else if (tokenId < _unique) {
            tokenURIresult = tokenURIresult.concat(tokenId.toString());
        } else {
            tokenURIresult = tokenURIresult.concat(symbol);
        }
        tokenURIresult = tokenURIresult.concat(uriSuffix);  
    } else {
        tokenURIresult = (tokenURIsaved.length > 0) ? tokenURIsaved : "";
    } 
    //console.log("tokenURI: " + tokenURIresult);
    return tokenURIresult
}

function encodeLeaf(address, spots) {
    return ethers.utils.defaultAbiCoder.encode(
      ["address", "string"],
      [address, spots]
    );
}

module.exports = {
	contractURI,
    tokenURI,
    encodeLeaf
}