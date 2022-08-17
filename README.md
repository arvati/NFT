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
NFT Minted! Check it out at: 
https://mumbai.polygonscan.com/tx/0xa630edcf34e3a8ebf79e5141a9fa7706d1423d18b9d5eb5b6014bc486909f87f
```

OpenSea Mumbai Testnet
https://testnets.opensea.io/assets/mumbai/0xf2cfc900d2293c25e37fad904d21bbf568e424dc/1