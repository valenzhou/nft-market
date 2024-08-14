import hre from "hardhat";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { formatEther, formatGwei, parseEther } from "viem";
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
//

describe('bybynft', function(){
    async function deployBybyNft(){
        const [owner,otherAccount] = await hre.ethers.getSigners();
        const BYBYNft = await hre.ethers.getContractFactory("BYBYNft");
        const bybyNft = await BYBYNft.deploy();
        return {bybyNft,owner,otherAccount}
    }

    describe("deploy",function(){
        it("deploy success", async function(){
            const {bybyNft} =await loadFixture(deployBybyNft);
            expect(await bybyNft.paused()).to.be.false;
        })
    })

    describe("mint", function(){
        it("mint nft",async function(){
            const {bybyNft,otherAccount} = await loadFixture(deployBybyNft);

            await bybyNft.pause(true);

            await expect(bybyNft.mintBYBY(1,{value: parseEther('0.005')})).not.to.be.reverted;
            await expect(bybyNft.connect(otherAccount).mintBYBY(1,{value: parseEther('0.005')})).not.to.be.reverted;
        })
    })
})