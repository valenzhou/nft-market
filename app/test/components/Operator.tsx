"use client";
import {ethers} from "ethers"
import {abi} from "./BYBY.json";
export default function Operator() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider)
    const wallet2 = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider)
   
    const handleClick = async ()=>{
        const balance = await provider.getBalance(wallet.getAddress())
        console.log(provider,wallet,wallet2,balance);
        let abiArr = [
            "function name() view returns (string)",
            "function faucet(address,uint256)",
          ]

        let contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, wallet)
        
        let address2 = await wallet2.getAddress()
        console.log(address2)
        const tx1 = await contract.faucet(address2,100000000000)
        console.log(tx1);
        const receipt = await tx1.wait();
        console.log(receipt);
    }
    return (
        <div>
            <button onClick={handleClick}>test</button>
        </div>
    );
}