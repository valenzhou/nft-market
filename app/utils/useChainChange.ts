import { useState } from "react";
import { useEffect } from "react";
import { useChainId } from "wagmi";

export default function useChainChange() {
  const chainId = useChainId();
  const [NEXT_PUBLIC_MARKETADDR, setNEXT_PUBLIC_MARKETADDR] = useState("");
  const [NEXT_PUBLIC_MARKETSTAKE, setNEXT_PUBLIC_MARKETSTAKE] = useState("");
  const [NEXT_PUBLIC_CREATENFTADDR, setNEXT_PUBLIC_CREATENFTADDR] =
    useState("");
  const [NEXT_PUBLIC_MARKENTOKEN, setNEXT_PUBLIC_MARKENTOKEN] = useState("");

  useEffect(() => {
    let createAddr = "";
    let marketToken = "";
    let marketAddr = "";
    let marketStake = "";

    if (chainId == 11155111) {
      createAddr = process.env.NEXT_PUBLIC_SEPOLIA_CREATENFTADDR || "";
      marketToken = process.env.NEXT_PUBLIC_SEPOLIA_MARKENTOKEN || "";
      marketAddr = process.env.NEXT_PUBLIC_SEPOLIA_MARKETADDR || "";
      marketStake = process.env.NEXT_PUBLIC_SEPOLIA_MARKETSTAKE || "";
    } else if (chainId == 97) {
      createAddr = process.env.NEXT_PUBLIC_BSC_CREATENFTADDR || "";
      marketToken = process.env.NEXT_PUBLIC_BSC_CREATENFTADDR || "";
      marketAddr = process.env.NEXT_PUBLIC_BSC_MARKETADDR || "";
      marketStake = process.env.NEXT_PUBLIC_BSC_MARKETSTAKE || "";
    } else {
      createAddr = process.env.NEXT_PUBLIC_SEPOLIA_CREATENFTADDR || "";
      marketToken = process.env.NEXT_PUBLIC_SEPOLIA_MARKENTOKEN || "";
      marketAddr = process.env.NEXT_PUBLIC_SEPOLIA_MARKETADDR || "";
      marketStake = process.env.NEXT_PUBLIC_SEPOLIA_MARKETSTAKE || "";
    }

    setNEXT_PUBLIC_MARKETADDR(marketAddr);
    setNEXT_PUBLIC_CREATENFTADDR(createAddr);
    setNEXT_PUBLIC_MARKETSTAKE(marketStake);
    setNEXT_PUBLIC_MARKENTOKEN(marketToken);
  }, [chainId]);

  return {
    NEXT_PUBLIC_CREATENFTADDR,
    NEXT_PUBLIC_MARKENTOKEN,
    NEXT_PUBLIC_MARKETADDR,
    NEXT_PUBLIC_MARKETSTAKE,
  };
}
