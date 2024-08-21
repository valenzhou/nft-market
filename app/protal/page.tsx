import { Chip } from "@nextui-org/react";
import NFTWall from "../components/NFTWall";

export default function Protal() {

    return (
        <div>
           <h2 className="pt-6 pl-5 text-lg">
           <Chip color="warning" variant="shadow">MY NFTS:</Chip>
           </h2>
           <NFTWall filter='protal' />
        </div>
        
    );
}