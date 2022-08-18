# NFT 1
Mint de NFT 1

```shell
npx hardhat compile
npx hardhat deploy --network polygonMumbai
```

```
Network: polygonMumbai
Using Ledger account: 0xff2416aC6D95ee66fa095453531970291a3651a6
Using contract: NFT1a
Contract deployed to address: 0xE5785F167bE001B2c4576b6CE0edE2C21203906F
```

```shell
npx hardhat verify --network polygonMumbai 0xE5785F167bE001B2c4576b6CE0edE2C21203906F --contract contracts/NFT.sol:NFT1a
```

```
https://mumbai.polygonscan.com/address/0xE5785F167bE001B2c4576b6CE0edE2C21203906F#code
```

```shell
npx hardhat mint --network polygonMumbai
//npx hardhat multimint --network polygonMumbai
```

```
Network: polygonMumbai
Using Ledger account: 0xff2416aC6D95ee66fa095453531970291a3651a6
Using contract: NFT1a
Using contract address: 0xE5785F167bE001B2c4576b6CE0edE2C21203906F
Minting to: 0xff2416aC6D95ee66fa095453531970291a3651a6
Transaction Hash: 0x32c0cb3177db5d4109f729b86381ea9f42f79119cfe62ecd8091b7ec8f4f862e
```

https://mumbai.polygonscan.com/tx/0x32c0cb3177db5d4109f729b86381ea9f42f79119cfe62ecd8091b7ec8f4f862e

OpenSea Mumbai Testnet
https://testnets.opensea.io/assets/mumbai/0xE5785F167bE001B2c4576b6CE0edE2C21203906F/0

```shell
npx hardhat token-uri --id 0 --network polygonMumbai
```

```
Network: polygonMumbai
Using Ledger account: 0xff2416aC6D95ee66fa095453531970291a3651a6
Using contract: NFT1
Using contract address: 0x2E6185f3d231a82Db6060B9A5c47F22faf1c5272
Metadata URL: https://arvati.github.io/NFT/metadata/NFT1.json
Metadata fetch response: {
  "description": "NFT 1 publicado na Mumbai Polygon",
  "external_url": "https://arvati.github.io/NFT/page/1.html",
  "image": "https://arvati.github.io/NFT/image/1.png",
  "name": "NFT 1 Mumbai",
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