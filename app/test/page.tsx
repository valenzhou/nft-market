import { ethers } from "ethers";
import Operator from "./components/Operator";
import { revalidatePath } from "next/cache";
export default async function Test() {

    // revalidatePath('/test');
    
    return (
        <div>
            <Operator />
        </div>
    );
}