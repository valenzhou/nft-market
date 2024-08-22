"use client";

import { Button } from "@nextui-org/react";
import {
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi } from "@/app/asserts/Market.json";
import { useEffect, useMemo, useState } from "react";
import { formatEther, parseEther } from "viem";
import toast, { Toaster } from "react-hot-toast";
import useChainChange from "../utils/useChainChange";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

export default function BuyButton(props: any) {
  const token = props.token;
  const router = useRouter();
  const chainId = useChainId();
  const [spinning, setSpinning] = useState(false);

  const {
    NEXT_PUBLIC_CREATENFTADDR,
    NEXT_PUBLIC_MARKETADDR,
  } = useChainChange();


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
    if(txIsSuccess){
      setSpinning(()=>false);
      toast("buy success");
      props?.getNfts();
      router.push('/protal');
    }
  
  }, [txIsSuccess]);

  const handleBuy = () => {
    setSpinning(true);
    writeContractAsync({
        abi,
        address: NEXT_PUBLIC_MARKETADDR as `0x${string}`,
        functionName: "marketSale",
        args: [NEXT_PUBLIC_CREATENFTADDR,itemId],
        value: parseEther(price),
    })
  };
  return (
    <>
    <Toaster />
    <Spin spinning={spinning} percent='auto' fullscreen />
      <p className="pb-4">
        <i className="fab fa-ethereum"></i> {price} ETH
      </p>
      <Button onPress={handleBuy} isLoading={isPending}>BUY</Button>
    </>
  );
}
