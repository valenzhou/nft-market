import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  // defaultNetwork: 'hardhat',
  networks: {
    // hardhat: {
    //   chainId: 5777 //31337
    // },
    // ganache: {
    //   url: "http://127.0.0.1:8545",
    //   accounts: [
    //     "0xf74da46e26e6cb62a6936534385c2547093445feb5bbe54ec5e0333d09d2a040",
    //   ]
    // }
  }
};

export default config;
