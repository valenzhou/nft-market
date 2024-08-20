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
import toast, { Toaster } from "react-hot-toast";

export default function BuyButton(props: any) {
  const token = props.token;
  const NEXT_PUBLIC_CREATENFTADDR = process.env.NEXT_PUBLIC_CREATENFTADDR;
  const NEXT_PUBLIC_MARKETADDR = process.env.NEXT_PUBLIC_MARKETADDR;

  const { data, isSuccess } = useReadContract({
    abi,
    address: NEXT_PUBLIC_MARKETADDR as `0x${string}`,
    functionName: "getAvailableNft",
    // args: [NEXT_PUBLIC_CREATENFTADDR,token],
  });

  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { data:buyNftData, isSuccess: txIsSuccess } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    });
  const { data: feeData } = useEstimateFeesPerGas();
  console.log(data);
  const price = useMemo(() => {
       let current = (data && (data as Array<any>).find(v =>{
        return v.nftContract == NEXT_PUBLIC_CREATENFTADDR && v.tokenId == token;
    }))
    return formatEther((current && current.price) || 0);
  }, [data]);

  const itemId = useMemo(() => {
    let current = (data && (data as Array<any>).find(v =>{
        return v.nftContract == NEXT_PUBLIC_CREATENFTADDR && v.tokenId == token;
    }))
    return (current && current.itemId) || 0;
  }, [data]);

  useEffect(() => {
    txIsSuccess && toast("buy success");
    txIsSuccess && props?.getNfts();
  }, [txIsSuccess]);
  const handleBuy = () => {
    writeContractAsync({
        abi,
        address: NEXT_PUBLIC_MARKETADDR as `0x${string}`,
        functionName: "marketSale",
        args: [NEXT_PUBLIC_CREATENFTADDR,itemId],
        value: parseEther(price),
        maxFeePerGas: feeData?.maxFeePerGas,
    })
  };
  return (
    <>
    <Toaster />
      <p className="pb-4">
        <i className="fab fa-ethereum"></i> {price} ETH
      </p>
      <Button onPress={handleBuy} isLoading={isPending}>BUY</Button>
    </>
  );
}
