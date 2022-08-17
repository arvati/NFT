# NFT 1
Mint de NFT 1

```shell
npx hardhat compile
npx hardhat deploy --network polygonMumbai
npx hardhat run scripts/deploy.js --network polygonMumbai
```

```
Deploying contracts with the account:, 0xff2416aC6D95ee66fa095453531970291a3651a6
Contract deployed to address: 0xF2CFC900D2293c25e37Fad904d21BbF568E424DC
```

```shell
npx hardhat verify --network polygonMumbai 0xF2CFC900D2293c25e37Fad904d21BbF568E424DC --contract contracts/NFT.sol:NFT
```

```
https://mumbai.polygonscan.com/address/0xF2CFC900D2293c25e37Fad904d21BbF568E424DC#code
```

```shell
npx hardhat run scripts/mint-nft.js --network polygonMumbai
```

```
NFT Minted! Check it out at: 
https://mumbai.polygonscan.com/tx/0xa630edcf34e3a8ebf79e5141a9fa7706d1423d18b9d5eb5b6014bc486909f87f
```

OpenSea Mumbai Testnet
https://testnets.opensea.io/assets/mumbai/0xf2cfc900d2293c25e37fad904d21bbf568e424dc/1