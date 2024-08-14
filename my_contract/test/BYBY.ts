import hre from "hardhat";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { formatEther, formatGwei, parseEther } from "viem";
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
//0x5FbDB2315678afecb367f032d93F642f64180aa
describe("byby",function(){
    async function deployByby() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const Byby = await hre.ethers.getContractFactory("BYBY");
        const byby = await Byby.deploy();
        return { byby, owner, otherAccount };
      }

    describe("deploy", function(){
        it("deploy is success",async function(){
            const {byby,owner,otherAccount} = await loadFixture(deployByby);
            expect(await byby.paused()).to.be.false;
        })
       
    })

    describe("mintToken",function(){
        it('mint',async function(){
            const {byby,owner,otherAccount} = await loadFixture(deployByby);
            await expect(byby.faucet(otherAccount.address,parseEther('100'))).to.be.changeTokenBalance(byby,otherAccount.address,parseEther('100'));
            await expect(byby.connect(otherAccount).faucet(owner.address,parseEther('100'))).to.be.reverted;
        })
    })
})