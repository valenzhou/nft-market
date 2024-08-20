"use client";
import {
  useAccount,
  useEstimateFeesPerGas,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import styles from "./page.module.scss";
import { abi } from "@/app/asserts/MarketStake.json";
import { useEffect, useMemo } from "react";
import { formatEther } from "viem";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
export default function StakeInfo() {
  const NEXT_PUBLIC_CREATENFTADDR = process.env.NEXT_PUBLIC_CREATENFTADDR;
  const NEXT_PUBLIC_MARKETSTAKE = process.env.NEXT_PUBLIC_MARKETSTAKE;
  const { address } = useAccount();
  const { data: stakeData, isSuccess } = useReadContract({
    abi,
    address: NEXT_PUBLIC_MARKETSTAKE as `0x${string}`,
    functionName: "nftOfOwner",
    args: [address],
  });
  const { data: earningData, isSuccess: earnIsSuccess } = useReadContract({
    abi,
    address: NEXT_PUBLIC_MARKETSTAKE as `0x${string}`,
    functionName: "earningInfo",
    args: [stakeData || []],
  });
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isSuccess: txIsSuccess } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
  });
  const { data: feeData } = useEstimateFeesPerGas();
  const handleClaim = () => {
    writeContractAsync({
      abi,
      address: NEXT_PUBLIC_MARKETSTAKE as `0x${string}`,
      functionName: "claim",
      args: [stakeData],
      maxFeePerGas: feeData?.maxFeePerGas,
    });
  };
  useEffect(() => {
    txIsSuccess && toast("claim success");
  }, [txIsSuccess]);
  const stakeNum = useMemo(() => {
    return ((stakeData as Array<any>) || []).length;
  }, [isSuccess]);
  const earningInfo = useMemo(() => {
    let data = (earningData as Array<any>) || [];
    let totalEarning = formatEther(data[0] || 0);
    let earningPerSecond = formatEther(data[1] || 0);
    return [totalEarning, earningPerSecond];
  }, [earnIsSuccess]);
  return (
    <>
      <p className={styles.infoRow}>
        <span className={styles.infoTitle}>TotalStake &nbsp;:</span>
        <span className={styles.infoContent}>{stakeNum}</span>
      </p>

      <p className={styles.infoRow}>
        <span className={styles.infoTitle}>TotalEarning &nbsp;:</span>
        <span className={styles.infoContent}>{earningInfo[0]}</span>
      </p>

      <p className={styles.infoRow}>
        <span className={styles.infoTitle}>EarningPerSecond &nbsp;:</span>
        <span className={styles.infoContent}>
          {(earningInfo[1] as any) * (stakeNum || 0)}
        </span>
      </p>

      <p className={styles.infoRow}>
        <Button onPress={handleClaim} isLoading={isPending}>
          Claim Earning
        </Button>
      </p>
    </>
  );
}
