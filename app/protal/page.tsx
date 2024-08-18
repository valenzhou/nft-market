"use client";
import NFTWall from "../components/NFTWall";

export default function Protal() {

    return (
        <div>
           <h2 className="pt-6 pl-5 text-lg">MY NFTS:</h2>
           <NFTWall filter='protal' />
        </div>
        
    );
}