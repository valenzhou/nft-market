"use client";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useChainId,
} from "wagmi";
import { abi } from "@/app/asserts/Market.json";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
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
import useChainChange from "../utils/useChainChange";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

export default function SellButton(props: any) {
  const token = props.token;
  const chainId = useChainId();
  const router = useRouter();
  const { NEXT_PUBLIC_CREATENFTADDR, NEXT_PUBLIC_MARKETADDR } =
    useChainChange();

  const [price, setPrice] = useState("0.00");
  const [spinning, setSpinning] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
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
  useEffect(() => {
    txIsSuccess && toast("approve success");
    txIsSuccess && handleSell();
  }, [txIsSuccess]);
  useEffect(() => {
    setPrice("0.00");
    if(listIsSuccess){
      setSpinning(false);
      toast("listed success");
      props?.getNfts();
      router.push('/market');
    }
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
      setSpinning(true);
      SellNft({
        abi,
        address: NEXT_PUBLIC_MARKETADDR as `0x${string}`,
        functionName: "createValutItem",
        args: [NEXT_PUBLIC_CREATENFTADDR, token, parseEther(sellPrice + "")],
        value: parseEther("0.0025"),
      });
    }
    onClose();
  };

  return (
    <>
      <Toaster />
      <Spin spinning={spinning} percent='auto' fullscreen />
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
