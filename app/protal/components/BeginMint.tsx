import { Button } from "@nextui-org/react";
import { abi } from "@/app/asserts/BYBYNft.json";
import {
    useWaitForTransactionReceipt,
    useWriteContract,
    useEstimateFeesPerGas,
  } from "wagmi";
export default function BeginMint() {
    const NFTADDR = process.env.NEXT_PUBLIC_NFTADDR || "";
    const { data: hash, isPending, writeContract } = useWriteContract();
    const { isSuccess: txIsSuccess } = useWaitForTransactionReceipt({
      hash,
    });
    const { data: feeData } = useEstimateFeesPerGas();

    const hadnleBegin = ()=>{
        writeContract({
            abi,
            address: NFTADDR as `0x${string}`,
            functionName: "pause",
            args: [true],
            maxFeePerGas: feeData?.maxFeePerGas,
        })
    }
    return (
        <div>
            <Button onPress={hadnleBegin} isLoading={isPending}>begin Mint</Button>
        </div>
    );
}