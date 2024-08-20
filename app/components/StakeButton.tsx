"use client";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useEstimateFeesPerGas,
} from "wagmi";
import { abi } from "@/app/asserts/MarketStake.json";
import { abi as nftABI } from "@/app/asserts/CreateNft.json";
import { useEffect, useMemo, useState } from "react";
import { getAddress, isAddressEqual, parseEther } from "viem";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/react";


export default function StakeButton(props: any) {
  const token = props.token;
  const NEXT_PUBLIC_CREATENFTADDR = process.env.NEXT_PUBLIC_CREATENFTADDR;
  const NEXT_PUBLIC_MARKETSTAKE = process.env.NEXT_PUBLIC_MARKETSTAKE;

  const { data: approveData, isSuccess } = useReadContract({
    abi: nftABI,
    address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
    functionName: "getApproved",
    args: [token],
  });
  const isZeroAddr = useMemo(() => {
    return (
      approveData &&
      isAddressEqual(
        approveData as `0x${string}`,
        "0x0000000000000000000000000000000000000000"
      )
    );
  }, [approveData]);
  console.log(approveData, token, isZeroAddr);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isSuccess: txIsSuccess } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    });
  const {
    data: StakeHash,
    isPending: isStakePending,
    writeContractAsync: StakeNft,
  } = useWriteContract();
  const { isSuccess: stakeIsSuccess, data: stakeData } =
    useWaitForTransactionReceipt({
      hash: StakeHash,
    });
  const { data: feeData } = useEstimateFeesPerGas();
  useEffect(() => {
    txIsSuccess && toast("approve success");
    txIsSuccess && handleStake();
  }, [txIsSuccess]);
  useEffect(() => {
    stakeIsSuccess && toast("stake success");
    stakeIsSuccess && props?.getNfts();
  }, [stakeIsSuccess]);

  const handleApprove = () => {
    if (isZeroAddr) {
      writeContractAsync({
        abi: nftABI,
        address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
        functionName: "approve",
        args: [NEXT_PUBLIC_MARKETSTAKE, token],
        maxFeePerGas: feeData?.maxFeePerGas,
      });
    } else {
        handleStake();
    }
  };
  const handleStake = () => {
    StakeNft({
        abi,
        address: NEXT_PUBLIC_MARKETSTAKE as `0x${string}`,
        functionName: "stake",
        args: [[token]],
        maxFeePerGas: feeData?.maxFeePerGas,
      });
  };

  return (
    <>
      <Toaster />
      <Button isLoading={isPending || isStakePending} onPress={handleApprove}>
        Stake
      </Button>
    </>
  );
}
