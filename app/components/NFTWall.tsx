"use client";
import { useAccount, useClient, useReadContract } from "wagmi";
import NFTCard from "./NFTCard";
import { abi } from "@/app/asserts/BYBYNft.json";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useState } from "react";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export default function NFTWall() {
  const {address} = useAccount();
  const client = useClient();
  const transport = client?.transport?.url || "";
  const provider = new ethers.JsonRpcProvider(transport);
  const priviteKey = process.env.NEXT_PUBLIC_KEY1 || "";
  const wallet = new ethers.Wallet(priviteKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    getNfts();
  }, [setNfts]);

  async function getNfts() {
    const itemArray: any[] = [];
    contract.totalSupply().then((res) => {
      console.log(res);
      let totalSup = parseInt(res);
      for (let index = 0; index < totalSup; index++) {
        let token = index + 1;
        const owner = contract.ownerOf(token).catch((err) => {
          console.log("owner faild");
        });
        const rawUri = contract.tokenURI(token).catch((err) => {
          console.log("uri faild");
        });

        const Uri = Promise.resolve(rawUri);
        const getUri = Uri.then((value) => {
          let str = value;
          let cleanUri =
            str.replace("ipfs://", "http://gateway.pinata.cloud/ipfs/") +
            ".json";
          let metadata = fetch(cleanUri)
            .then((res) => {
              return res.json();
            })
            .catch((err) => {
              console.log(err);
            });
          return metadata;
        }).then((value) => {
          let rawImg = value?.image;
          let attr = value?.attributes;
          let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");

          Promise.resolve(owner).then((value) => {
            console.log(value);
            let ownerAddr = value;
            let meta = {
              name: "BYAC #" + token,
              img: image,
              tokenId: token,
              meta: attr,
              wallet: ownerAddr,
            };
            itemArray.push(meta);
          });
        });
      }
    });

    await new Promise((r) => setTimeout(r, 3000));
    setNfts(p => (p.concat(...itemArray)))
    console.log(nfts);
  }

  return (
    <div className="flex flex-wrap">
      {nfts.map((v,i) => (
        <NFTCard key={i} {...v}  />
      ))}
    </div>
  );
}
