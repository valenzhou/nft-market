"use client";
import { useAccount, useChainId, useChains, useClient, useReadContract, useReadContracts } from "wagmi";
import NFTCard from "./NFTCard";
import { abi } from "@/app/asserts/CreateNft.json";
import { abi as stakeABI } from "@/app/asserts/MarketStake.json";
import { ethers } from "ethers";
import { useEffect,useState } from "react";
import useChainChange from "../utils/useChainChange";
export default function NFTWall(props: { filter: string }) {
  const chainId = useChainId();
  const { address } = useAccount();
  const client = useClient();

  const {
    NEXT_PUBLIC_CREATENFTADDR,
    NEXT_PUBLIC_MARKETADDR,
    NEXT_PUBLIC_MARKETSTAKE,
  } = useChainChange();
 
  const filterType = props.filter || "";

  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    getNfts();
  }, [setNfts]);

  const {data: nftTotalSupply,isSuccess:getNftTotalSuccess } = useReadContract({
    abi: abi,
    address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
    functionName: "getTotalSupply",
  })
  const [params, setParams] = useState<any>([]);
  const [paramsOwner,setParamsOwner] = useState<any>([]);
  const {data: nftAllData, isSuccess: nftAllDataSuccess} =useReadContracts({
    contracts: params,
  });
  const {data: nftOwnerAllData, isSuccess: nftOwnerDataSuccess} =useReadContracts({
    contracts: paramsOwner,
  });

  useEffect(()=>{
    if(getNftTotalSuccess){
      const list = [];
      const ownerList = [];
      for (let index = 0; index <  parseInt(nftTotalSupply as any); index++) {
        list.push({
          abi,
          address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
          functionName: "tokenURI",
          args: [index+1],
        })
        ownerList.push({
          abi,
          address: NEXT_PUBLIC_CREATENFTADDR as `0x${string}`,
          functionName: "ownerOf",
          args: [index+1],
        })
      }

      setParams(list);
      setParamsOwner(ownerList)
    }
  },[getNftTotalSuccess,chainId])
  useEffect(()=>{
    if(nftAllDataSuccess && nftOwnerDataSuccess){
      getNfts();
    }
  },[nftAllDataSuccess,nftOwnerDataSuccess])
  function getNfts(){
    let data = (nftAllData as any[] || []);
    let ownerData = (nftOwnerAllData as any[] || []);
    let metaData:any[] = data.map((v,i) => {
      let uri = (v.result || '').replace("", "http://gateway.pinata.cloud/ipfs/") +
            "";
      return {
        name: "NFT #" + (i+1),
        img: uri,
        tokenId: (i+1),
        meta: {},
        wallet: ownerData[i].result,
      };
    })


    setNfts(() => 
      [].concat(...metaData)
    );
  }

  const { data: stakeData, isSuccess } = useReadContract({
    abi: stakeABI,
    address: NEXT_PUBLIC_MARKETSTAKE as `0x${string}`,
    functionName: "nftOfOwner",
    args: [address],
  });


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
