
function contractURI (baseTokenURI, contractUriPrefix, symbol, uriSuffix ) {
    if (baseTokenURI.length > 0) {
        return baseTokenURI + contractUriPrefix + symbol + uriSuffix ;
    } else {
        return "";
    }
}

function tokenURI (baseTokenURI, tokenUriPrefix, symbol, uriSuffix, _unique, tokenId, tokenURIsaved) {
    let tokenURIresult = "";
    if (tokenURIsaved.includes(":")) {
        return tokenURIsaved;
    } else if (baseTokenURI.length > 0) {
        tokenURIresult = baseTokenURI.concat(tokenUriPrefix);
        if (tokenURIsaved.length > 0) {
            tokenURIresult = tokenURIresult.concat(tokenURIsaved);
        } else if (tokenId < _unique) {
            tokenURIresult = tokenURIresult.concat(tokenId.toString());
        } else {
            tokenURIresult = tokenURIresult.concat(symbol);
        }
        return tokenURIresult.concat(uriSuffix);  
    } else {
        return (tokenURIsaved.length > 0) ? tokenURIsaved : "";
    } 
}

module.exports = {
	contractURI,
    tokenURI
}