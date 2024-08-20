"use client";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useEstimateFeesPerGas,
} from "wagmi";
import { abi } from "@/app/asserts/Market.json";
// import { abi as nftABI } from "@/app/asserts/BYBYNft.json";
import { useEffect, useMemo, useState } from "react";
import { getAddress, isAddressEqual, parseEther } from "viem";
import toast, { Toaster } from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { PressEvent } from "@react-types/shared";

export default function SellButton(props: any) {
  const token = props.token;
  const NEXT_PUBLIC_CREATENFTADDR = process.env.NEXT_PUBLIC_CREATENFTADDR;
  const NEXT_PUBLIC_MARKETADDR = process.env.NEXT_PUBLIC_MARKETADDR;
  const [price, setPrice] = useState("0.00");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
//   const { data: approveData, isSuccess } = useReadContract({
//     abi: nftABI,
//     address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
//     functionName: "getApproved",
//     args: [token],
//   });
//   const isZeroAddr = useMemo(() => {
//     return (
//       approveData &&
//       isAddressEqual(
//         approveData as `0x${string}`,
//         "0x0000000000000000000000000000000000000000"
//       )
//     );
//   }, [approveData]);
//   console.log(approveData, token, isZeroAddr);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { data: apporveData, isSuccess: txIsSuccess } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    });
  const {
    data: SellHash,
    isPending: isSellPending,
    writeContractAsync: SellNft,
  } = useWriteContract();
  const { isSuccess: listIsSuccess, data: listedData } =
    useWaitForTransactionReceipt({
      hash: SellHash,
    });
  const { data: feeData } = useEstimateFeesPerGas();
  useEffect(() => {
    txIsSuccess && toast("approve success");
    console.log(apporveData?.status);
    txIsSuccess && handleSell();
  }, [txIsSuccess]);
  useEffect(() => {
    listIsSuccess && toast("listed success");
    listIsSuccess && props?.getNfts();
    setPrice("0.00");
  }, [listIsSuccess]);
  const handleInputPrice = () => {
    onOpen();
  };
//   const handleApprove = () => {
//     if (isZeroAddr) {
//       writeContractAsync({
//         abi: nftABI,
//         address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
//         functionName: "approve",
//         args: [NEXT_PUBLIC_MARKETADDR, token],
//         maxFeePerGas: feeData?.maxFeePerGas,
//       });
//     } else {
//       handleSell();
//     }
//   };
  const handleSell = () => {
    let sellPrice = Number(price);
    if (!sellPrice) {
      toast.error("Incorrect amount");
    } else {
        
      SellNft({
        abi,
        address: NEXT_PUBLIC_MARKETADDR as `0x${string}`,
        functionName: "createValutItem",
        args: [NEXT_PUBLIC_CREATENFTADDR,token, parseEther(sellPrice + "")],
        value: parseEther("0.0025"),
        maxFeePerGas: feeData?.maxFeePerGas,
      });
    }
    onClose();
  };

  return (
    <>
      <Toaster />
      <Button isLoading={isPending || isSellPending} onPress={handleInputPrice}>
        Sale
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Price
              </ModalHeader>
              <ModalBody>
                <p>please input price.</p>
                <p>
                  <Input
                    label="price"
                    defaultValue="0"
                    value={price}
                    onValueChange={setPrice}
                    placeholder="please input price"
                    labelPlacement="outside"
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">ETH</span>
                      </div>
                    }
                  />
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSell}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
