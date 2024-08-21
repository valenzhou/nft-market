import { Chip } from "@nextui-org/react";
import NFTWall from "../components/NFTWall";

export default function Market() {

    return (
        <div>
           <h2 className="pt-6 pl-5 text-lg">
            <Chip color="warning" variant="shadow">Listed:</Chip>
           </h2>

           <NFTWall filter='market' />
        </div>
        
    );
}