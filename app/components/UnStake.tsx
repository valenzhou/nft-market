"use client";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useEstimateFeesPerGas,
} from "wagmi";
import { abi } from "@/app/asserts/MarketStake.json";
import { abi as tokenABI } from "@/app/asserts/MarketToken.json";
import { useEffect, useMemo, useState } from "react";
import { getAddress, isAddressEqual, parseEther } from "viem";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/react";


export default function UnStake(props: any) {
  const token = props.token;
  const NEXT_PUBLIC_MARKENTOKEN = process.env.NEXT_PUBLIC_MARKENTOKEN;
  const NEXT_PUBLIC_MARKETSTAKE = process.env.NEXT_PUBLIC_MARKETSTAKE;

  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isSuccess: txIsSuccess } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    });
  const { data: feeData } = useEstimateFeesPerGas();

  useEffect(() => {
    txIsSuccess && toast("UnStake success");
    txIsSuccess && props?.getNfts();
  }, [txIsSuccess]);


  const handleUnStake = () => {
    writeContractAsync({
        // abi: tokenABI,
        // address: NEXT_PUBLIC_MARKENTOKEN as `0x${string}`,
        // functionName: "addController",
        // args: [NEXT_PUBLIC_MARKETSTAKE],
        // maxFeePerGas: feeData?.maxFeePerGas,

        abi,
        address: NEXT_PUBLIC_MARKETSTAKE as `0x${string}`,
        functionName: "unstake",
        args: [[token]],
        maxFeePerGas: feeData?.maxFeePerGas,
      });
  };

  return (
    <>
      <Toaster />
      <Button isLoading={isPending} onPress={handleUnStake}>
        UnStake
      </Button>
    </>
  );
}
