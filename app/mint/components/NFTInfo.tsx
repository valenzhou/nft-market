"use client";
import styles from "../page.module.scss";
import { abi } from "@/app/asserts/BYBYNft.json";
import { useState } from "react";
import { useEffect } from "react";
import { formatEther, parseEther } from "viem";
import { Button } from "@nextui-org/react";
import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
  useEstimateFeesPerGas,
} from "wagmi";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export default function NFTInfo() {
  const account = useAccount();
  const [totalSupply, setTotalSupply] = useState(0);
  const [price, setPrice] = useState("0");
  const { data: nftResult, isSuccess,status,isRefetching, refetch } = useReadContracts({
    contracts: [
      {
        abi,
        address: contractAddress,
        functionName: "totalSupply",
      },
      {
        abi,
        address: contractAddress,
        functionName: "mintPrice",
      },
    ],
  });
  const NFTADDR = process.env.NEXT_PUBLIC_NFTADDR || "";
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isSuccess: txIsSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { data: feeData } = useEstimateFeesPerGas();

  useEffect(() => {
    if (nftResult && nftResult[0]) {
      setTotalSupply(parseInt(nftResult[0]?.result as any));
    }
    if (nftResult && nftResult[1]) {
      let res = nftResult[1].result;
      setPrice(formatEther(res as bigint));
    }
  }, [isSuccess,isRefetching]);

  useEffect(()=>{
    if(txIsSuccess){
        refetch().then(res => {
            console.log(res);
        })
    }
  },[txIsSuccess])

  const handleMint = () => {
    writeContract({
        abi,
        address: NFTADDR as `0x${string}`,
        functionName: "mintBYBY",
        args: [true],
        value: parseEther(price),
        maxFeePerGas: feeData?.maxFeePerGas,
    })
  };

  return (
    <>
      <div>
        <p className={styles.infoRow}>TotalSupply: 20</p>
        <p className={styles.infoRow}>Minted: {totalSupply || "0"}</p>
        <p className={styles.infoRow}>Mint Price: {price} SepoliaETH</p>
      </div>

      <Button
        color="primary"
        radius="sm"
        onPress={handleMint}
        isLoading={isPending}
      >
        Mint &nbsp;&nbsp;|&nbsp;&nbsp; {price} SepoliaETH
      </Button>
    </>
  );
}
