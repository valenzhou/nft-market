"use client";

import { Button } from "@nextui-org/react";
import {
  useEstimateFeesPerGas,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi } from "@/app/asserts/Market.json";
import { useEffect, useMemo } from "react";
import { formatEther, parseEther } from "viem";
import toast from "react-hot-toast";

export default function BuyButton(props: any) {
  const token = props.token;
  const NEXT_PUBLIC_NFTADDR = process.env.NEXT_PUBLIC_NFTADDR;
  const NEXT_PUBLIC_MARKETADDR = process.env.NEXT_PUBLIC_MARKETADDR;

  const { data, isSuccess } = useReadContract({
    abi,
    address: NEXT_PUBLIC_MARKETADDR as `0x${string}`,
    functionName: "vaultItems",
    args: [token],
  });

  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { data:buyNftData, isSuccess: txIsSuccess } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    });
  const { data: feeData } = useEstimateFeesPerGas();
  const price = useMemo(() => {
    let p = (data && (data as Array<any>)[3]) || 0;
    return formatEther(p);
  }, [data]);

  useEffect(() => {
    txIsSuccess && toast("buy success");
    txIsSuccess && props?.getNfts();
  }, [txIsSuccess]);
  const handleBuy = () => {
    writeContractAsync({
        abi,
        address: NEXT_PUBLIC_MARKETADDR as `0x${string}`,
        functionName: "buyNft",
        args: [token],
        value: parseEther(price),
        maxFeePerGas: feeData?.maxFeePerGas,
    })
  };
  return (
    <>
      <p className="pb-4">
        <i className="fab fa-ethereum"></i> {price} ETH
      </p>
      <Button onPress={handleBuy} isLoading={isPending}>BUY</Button>
    </>
  );
}
