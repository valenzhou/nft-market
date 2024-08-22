"use client";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useChainId,
} from "wagmi";
import { abi } from "@/app/asserts/MarketStake.json";
// import { abi as tokenABI } from "@/app/asserts/MarketToken.json";
import { useEffect, useState} from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import useChainChange from "../utils/useChainChange";
import { useRouter } from "next/navigation";
import { Spin } from "antd";


export default function UnStake(props: any) {
  const token = props.token;
  const chainId = useChainId();
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  const {
    NEXT_PUBLIC_MARKETSTAKE,
    // NEXT_PUBLIC_MARKENTOKEN
  } = useChainChange();

  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isSuccess: txIsSuccess } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

  useEffect(() => {
    if(txIsSuccess){
      setSpinning(()=> false);
      toast("UnStake success");
      props?.getNfts();
      router.push('/protal');
    }
    
  }, [txIsSuccess]);


  const handleUnStake = () => {
    setSpinning(true);
    writeContractAsync({
        // abi: tokenABI,
        // address: NEXT_PUBLIC_MARKENTOKEN as `0x${string}`,
        // functionName: "addController",
        // args: [NEXT_PUBLIC_MARKETSTAKE],

        abi,
        address: NEXT_PUBLIC_MARKETSTAKE as `0x${string}`,
        functionName: "unstake",
        args: [[token]],
      });
  };

  return (
    <>
      <Toaster />
      <Spin spinning={spinning} percent='auto' fullscreen />
      <Button isLoading={isPending} onPress={handleUnStake}>
        UnStake
      </Button>
    </>
  );
}
