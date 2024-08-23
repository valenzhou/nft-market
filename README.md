<h1 align="center">Welcome to nft-market 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/nft-market" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/nft-market.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIP-yellow.svg" />
  </a>
</p>

> A web3 dapp project about nft casting, trading, and staking.Front use: Nextjs,Wagmi,rainbowkit,Next-ui.

### 🏠 [Homepage](www.waitslot.com)

## 🚀 Usage

Make sure you have npx installed. (npx is shipped by default since npm 5.2.0)

### Front-end

You may need to configure some variables on your `.env.local`,for example contract address.

```sh
npm install
npm run start
```

## Contract Deploy

```sh
cd my_contract
npm install
npx hardhat compile
# network support Sepolia and BSC Test Net 
npx hardhat ignition deploy ./igniton/modules/MarketStake.ts --network sepolia
# You may need to configure some variables on your hardhat,for example WalletPrivateKey
npx hardhat vars set SEPOLIA_ACCOUNT1_KEY
```

## Author

👤 **valen zhou**

* Website: zhouwenlong.com.cn
* Github: [@valenzhou](https://github.com/valenzhou)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_