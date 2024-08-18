"use client";
import NFTWall from "../components/NFTWall";

export default function Market() {

    return (
        <div>
           <h2 className="pt-6 pl-5 text-lg">Listed:</h2>
           <NFTWall filter='market' />
        </div>
        
    );
}