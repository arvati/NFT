# NFT 1
Mint de NFT 1

```shell
npx hardhat compile
npx hardhat deploy --network polygonMumbai
```

```
Network: polygonMumbai
Using Ledger account: 0xff2416aC6D95ee66fa095453531970291a3651a6
Using contract: NFT1
Contract deployed to address: 0x2E6185f3d231a82Db6060B9A5c47F22faf1c5272
```

```shell
npx hardhat verify --network polygonMumbai 0x2E6185f3d231a82Db6060B9A5c47F22faf1c5272 --contract contracts/NFT.sol:NFT1
```

```
https://mumbai.polygonscan.com/address/0x2E6185f3d231a82Db6060B9A5c47F22faf1c5272#code
```

```shell
npx hardhat mint --network polygonMumbai
```

```
Network: polygonMumbai
Using Ledger account: 0xff2416aC6D95ee66fa095453531970291a3651a6
Using contract: NFT1
Using contract address: 0x2E6185f3d231a82Db6060B9A5c47F22faf1c5272
Minting to: 0xff2416aC6D95ee66fa095453531970291a3651a6
Transaction Hash: 0x287540fff5964b15bc1d04997dad1ea7f6f48c2a1fa097e47950e0198c85683e
```

https://mumbai.polygonscan.com/tx/0x287540fff5964b15bc1d04997dad1ea7f6f48c2a1fa097e47950e0198c85683e

OpenSea Mumbai Testnet
https://testnets.opensea.io/assets/mumbai/0x2E6185f3d231a82Db6060B9A5c47F22faf1c5272/0

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