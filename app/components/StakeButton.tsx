"use client";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useChainId,
} from "wagmi";
import { abi } from "@/app/asserts/MarketStake.json";
import { abi as nftABI } from "@/app/asserts/CreateNft.json";
import { useEffect, useMemo, useState } from "react";
import { getAddress, isAddressEqual, parseEther } from "viem";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import useChainChange from "../utils/useChainChange";
import { useRouter } from "next/navigation";


export default function StakeButton(props: any) {
  const token = props.token;
  const router = useRouter();
  const chainId = useChainId();
  const {
    NEXT_PUBLIC_CREATENFTADDR,
    NEXT_PUBLIC_MARKETSTAKE,
  } = useChainChange();

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
  useEffect(() => {
    txIsSuccess && toast("approve success");
    txIsSuccess && handleStake();
  }, [txIsSuccess]);
  useEffect(() => {
    stakeIsSuccess && toast("stake success");
    stakeIsSuccess && props?.getNfts();
    stakeIsSuccess && router.push('/stake');
  }, [stakeIsSuccess]);

  const handleApprove = () => {
    if (isZeroAddr) {
      writeContractAsync({
        abi: nftABI,
        address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
        functionName: "approve",
        args: [NEXT_PUBLIC_MARKETSTAKE, token],
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
