import { useState } from "react";
import { useEffect } from "react";
import { useChainId } from "wagmi";

export default function useChainChange() {
  const chainId = useChainId();
  const [NEXT_PUBLIC_MARKETADDR, setNEXT_PUBLIC_MARKETADDR] = useState("");
  const [NEXT_PUBLIC_MARKETSTAKE, setNEXT_PUBLIC_MARKETSTAKE] = useState("");
  const [NEXT_PUBLIC_CREATENFTADDR, setNEXT_PUBLIC_CREATENFTADDR] = useState("");
  const [NEXT_PUBLIC_MARKENTOKEN, setNEXT_PUBLIC_MARKENTOKEN] = useState("");

  useEffect(() => {
    const createAddr =
      (chainId == 11155111
        ? process.env.NEXT_PUBLIC_SEPOLIA_CREATENFTADDR
        : process.env.NEXT_PUBLIC_CREATENFTADDR) || "";
        const marketToken =
      (chainId == 11155111
        ? process.env.NEXT_PUBLIC_SEPOLIA_MARKENTOKEN
        : process.env.NEXT_PUBLIC_MARKENTOKEN) || "";
        const marketAddr =
      (chainId == 11155111
        ? process.env.NEXT_PUBLIC_SEPOLIA_MARKETADDR
        : process.env.NEXT_PUBLIC_MARKETADDR) || "";
        const marketStake =
      (chainId == 11155111
        ? process.env.NEXT_PUBLIC_SEPOLIA_MARKETSTAKE
        : process.env.NEXT_PUBLIC_MARKETSTAKE) || "";

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
