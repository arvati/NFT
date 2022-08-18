# NFT N48
Mint de NFT N48

```shell
npx hardhat compile
npx hardhat deploy --network polygonMumbai
```

```
Network: polygonMumbai
Using Ledger account: 0xff2416aC6D95ee66fa095453531970291a3651a6
Using contract: N48
Contract deployed to address: 0x1CE5879C3e4419108A25063E222a12FCA58f828a
```

```shell
npx hardhat verify --network polygonMumbai 0x1CE5879C3e4419108A25063E222a12FCA58f828a --contract contracts/NFT.sol:N48
```

```
https://mumbai.polygonscan.com/address/0x1CE5879C3e4419108A25063E222a12FCA58f828a#code
```

```shell
npx hardhat mint --network polygonMumbai
//npx hardhat multimint --network polygonMumbai
```

```
Network: polygonMumbai
Using Ledger account: 0xff2416aC6D95ee66fa095453531970291a3651a6
Using contract: N48
Using contract address: 0x1CE5879C3e4419108A25063E222a12FCA58f828a
Minting to: 0xff2416aC6D95ee66fa095453531970291a3651a6
Transaction Hash: 0xcb155de9f9ba5e51af173293eb0fbcd5b04901f6901196a9aa3b4fdf2b8586f5
```

https://mumbai.polygonscan.com/tx/0xcb155de9f9ba5e51af173293eb0fbcd5b04901f6901196a9aa3b4fdf2b8586f5

OpenSea Mumbai Testnet
https://testnets.opensea.io/assets/mumbai/0x1CE5879C3e4419108A25063E222a12FCA58f828a/0

```shell
npx hardhat token-uri --id 0 --network polygonMumbai
```

```
Network: polygonMumbai
Using Ledger account: 0xff2416aC6D95ee66fa095453531970291a3651a6
Using contract: N48
Using contract address: 0x1CE5879C3e4419108A25063E222a12FCA58f828a
Metadata URL: https://corp.eng.br/NFT/metadata/N48.json
Metadata fetch response: {
  "description": "Comemoração Aniversário 16/08",
  "external_url": "https://corp.eng.br/NFT/page/N48.html",
  "image": "https://corp.eng.br/NFT/image/N48.png",
  "name": "N48",
  "attributes": [
    {
      "trait_type": "Author",
      "value": "Ademar Arvati Filho"
    },
    {
      "display_type": "boost_percentage",
      "trait_type": "Gratitude",
      "value": 100
    },
    {
      "trait_type": "Personality",
      "value": "Happy"
    },
    {
      "trait_type": "Base",
      "value": "Friend"
    },
    {
      "display_type": "number",
      "trait_type": "Generation",
      "value": 48
    },
    {
      "display_type": "date",
      "trait_type": "birthday",
      "value": 145854000
    }
  ]
}
```