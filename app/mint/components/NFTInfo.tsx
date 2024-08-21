"use client";
import styles from "../page.module.scss";
import { abi } from "@/app/asserts/CreateNft.json";
import { useState } from "react";
import { useEffect } from "react";
import { formatEther, parseEther } from "viem";
import { Button, Input } from "@nextui-org/react";
import {

  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
  useChainId,
} from "wagmi";
import UploadFile from "@/app/components/UploadFile";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useChainChange from "@/app/utils/useChainChange";

export default function NFTInfo() {
  const chainId = useChainId();
  const {
    NEXT_PUBLIC_CREATENFTADDR,
  } = useChainChange();
  const router = useRouter();
  const [nftName, setNFTName] = useState(0);
  const [price, setPrice] = useState("0");

  const [uri, setUri] = useState("");
  const {
    data: nftResult,
    isSuccess,
    status,
    isRefetching,
  } = useReadContracts({
    contracts: [
      {
        abi,
        address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
        functionName: "owner",
      },
      {
        abi,
        address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
        functionName: "cost",
      },
    ],
  });
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isSuccess: txIsSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  // const { data: feeData } = useEstimateFeesPerGas({
  //   chainId: chainId
  // });

  useEffect(() => {
    if (nftResult && nftResult[0]) {
      setNFTName(parseInt(nftResult[0]?.result as any));
    }
    if (nftResult && nftResult[1]) {
      let res = nftResult[1].result || 0;
      setPrice(formatEther(res as bigint));
    }
  }, [isSuccess, isRefetching]);

  useEffect(()=>{
    if(txIsSuccess){
      router.push('/protal')
    }
  },[txIsSuccess])

  const handleMint = () => {
    if(!uri){
      return toast.error("please upload NFT image");
    }
    writeContract({
      abi,
      address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
      functionName: "mintNFT",
      args: [uri],
      value: parseEther(price),
      // maxFeePerGas: feeData?.maxFeePerGas,
    });
  };
  const handleUpload = (res: any) => {
    console.log(res, res?.IpfsHash);
    setUri(res?.IpfsHash);
  };
  const handleDownlaod = (res: any) => {
    console.log(res);
  };

  return (
    <>
    <Toaster />

      <UploadFile upload={handleUpload} download={handleDownlaod} />

      <Button
        color="primary"
        radius="sm"
        onPress={handleMint}
        isLoading={isPending}
      >
        Mint &nbsp;&nbsp;|&nbsp;&nbsp; {price}
      </Button>
    </>
  );
}
