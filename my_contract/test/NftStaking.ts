import hre from "hardhat";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { formatEther, formatGwei, parseEther } from "viem";
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
//0x5FbDB2315678afecb367f032d93F642f64180aa
describe("byby",function(){
    async function deployNftStaking() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const Byby = await hre.ethers.getContractFactory("BYBY");
        const byby = await Byby.deploy();
        const BYBYNft = await hre.ethers.getContractFactory("BYBYNft");
        const bybyNft = await BYBYNft.deploy();
        const NftStaking = await hre.ethers.getContractFactory("NftStaking");
        const nftStaking = await NftStaking.deploy(bybyNft,byby);

        await bybyNft.pause(true);
        await bybyNft.mintBYBY(1,{value: parseEther('0.005')})
        await bybyNft.setApprovalForAll(await nftStaking.getAddress(),true);

        return { nftStaking,byby,bybyNft,owner, otherAccount };
      }

    describe("deploy", function(){
        it("deploy is success",async function(){
            const {nftStaking,owner,otherAccount} = await loadFixture(deployNftStaking);
            expect(await nftStaking.owner()).to.equal(owner.address);
        })
       
    })

    describe("stake", function(){
        it('stake is success', async function(){
            const {nftStaking,owner} = await loadFixture(deployNftStaking);
            await expect(nftStaking.stake([1])).to.emit(nftStaking,"NFTStaked").withArgs(owner.address,1,anyValue);
        })
        it('unstake',async function(){
            const {nftStaking,owner} = await loadFixture(deployNftStaking);
        
            await nftStaking.stake([1]);
            await time.increase(100);
            await expect(nftStaking.unstake([1])).not.to.be.reverted;

        })
        it("claim",async function(){
            const {nftStaking,owner,byby} = await loadFixture(deployNftStaking);

            await nftStaking.stake([1]);

            await time.increase(100);
            await expect(nftStaking.claim([1])).to.changeTokenBalance(byby,owner.address,anyValue);
        })
    })

   
})