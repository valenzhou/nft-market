import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { localhost, hardhat, mainnet, sepolia,bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'my App',
    projectId: 'b562bb8e2d143db0ce4904b5ea85d5df',
    chains: [
      localhost, sepolia, bscTestnet
    //   ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ],
    transports: {
        [localhost.id]: http('http://127.0.0.1:8545'),
        // [mainnet.id]: http(),
        [sepolia.id]: http(),
        [bscTestnet.id]: http(),
    },
    ssr: true,
  });