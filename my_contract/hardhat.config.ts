import { HardhatUserConfig,vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
console.log(vars.get("SEPOLIA_ACCOUNT1_KEY"));
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: 'ganache',
  networks: {
    // hardhat: {
    //   chainId: 5777 //31337
    // },
    ganache: {
      url: "http://127.0.0.1:8545",
      // chainId: 5777,
      accounts: [
        "0xf74da46e26e6cb62a6936534385c2547093445feb5bbe54ec5e0333d09d2a040",
      ]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${vars.get("INFURAKEY")}`,
      chainId: 11155111,
      accounts: [
        vars.get("SEPOLIA_ACCOUNT1_KEY"),
      ],
    },
    bsc: {
      url: `https://bsc-testnet.infura.io/v3/${vars.get("INFURAKEY")}`,
      chainId: 97,
      accounts: [
        vars.get("SEPOLIA_ACCOUNT1_KEY"),
      ],
    }
  }
};

export default config;
