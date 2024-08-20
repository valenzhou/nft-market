"use client";
import { useAccount, useClient, useReadContract } from "wagmi";
import NFTCard from "./NFTCard";
import { abi } from "@/app/asserts/CreateNft.json";
import { abi as stakeABI } from "@/app/asserts/MarketStake.json";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useState } from "react";
export default function NFTWall(props: { filter: string }) {
  const NFTADDR = process.env.NEXT_PUBLIC_CREATENFTADDR || "";
  const NEXT_PUBLIC_MARKETADDR = process.env.NEXT_PUBLIC_MARKETADDR || "";
  const NEXT_PUBLIC_MARKETSTAKE = process.env.NEXT_PUBLIC_MARKETSTAKE || "";

  const { address } = useAccount();
  const client = useClient();
  const filterType = props.filter || "";
  const transport = client?.transport?.url || "";
  const provider = new ethers.JsonRpcProvider(transport);
  const priviteKey = process.env.NEXT_PUBLIC_KEY1 || "";
  const wallet = new ethers.Wallet(priviteKey, provider);
  const contract = new ethers.Contract(NFTADDR, abi, wallet);

  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    getNfts();
  }, [setNfts]);

  async function getNfts() {
    const itemArray: any[] = [];
    contract.getTotalSupply().then((res) => {
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
            str.replace("", "http://gateway.pinata.cloud/ipfs/") +
            "";
          // let metadata = fetch(cleanUri)
          //   .then((res) => {
          //     return res.json();
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
          // return metadata;
          return cleanUri;
        }).then((uri) => {
          // let rawImg = value?.image;
          // let attr = value?.attributes;
          // let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");

          Promise.resolve(owner).then((value) => {
            console.log(value);
            let ownerAddr = value;
            let meta = {
              name: "NFT #" + token,
              // img: image,
              img: uri,
              tokenId: token,
              meta: {},
              wallet: ownerAddr,
            };
            itemArray.push(meta);
          });
        });
      }
    });

    await new Promise((r) => setTimeout(r, 3000));
    setNfts(() => 
      [].concat(...itemArray)
    );
    console.log(nfts);
  }

  const { data: stakeData, isSuccess } = useReadContract({
    abi: stakeABI,
    address: NEXT_PUBLIC_MARKETSTAKE as `0x${string}`,
    functionName: "nftOfOwner",
    args: [address],
  });
//   const isZeroAddr = useMemo(() => {
//     return (
//       approveData &&
//       isAddressEqual(
//         approveData as `0x${string}`,
//         "0x0000000000000000000000000000000000000000"
//       )
//     );
//   }, [approveData]);


  return (
    <div className="flex flex-wrap">
      {nfts
        .filter((v) => {
          return filterType
            ? filterType === "market"
              ? v.wallet === NEXT_PUBLIC_MARKETADDR
              : filterType === 'protal' ?
                v.wallet === address
                : filterType === 'stake' ?
                  (v.wallet === NEXT_PUBLIC_MARKETSTAKE && (stakeData as Array<any> || []).includes(BigInt(v.tokenId))) :
                  true
            : true;
        })
        .map((v, i) => (
          <NFTCard key={i} {...v} {...{ filterType,getNfts }} />
        ))}
    </div>
  );
}
