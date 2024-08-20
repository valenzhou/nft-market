import hre from "hardhat";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { formatEther, formatGwei, parseEther } from "viem";
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
describe("createNft",function(){
    async function deployCreateNft() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const Market = await hre.ethers.getContractFactory("Market");
        const market = await Market.deploy();
        const CreateNft = await hre.ethers.getContractFactory("CreateNft");
        const createNft = await CreateNft.deploy(market);
        return { createNft,market, owner, otherAccount };
      }

    describe("deploy", function(){
        it("deploy is success",async function(){
            const {market,createNft,owner,otherAccount} = await loadFixture(deployCreateNft);
            await expect(createNft.createNFT(anyValue+'')).not.to.be.reverted;
        })
       
    })

    describe("mintNft",function(){
        it('mint',async function(){
            const {createNft,market,owner,otherAccount} = await loadFixture(deployCreateNft);
            await expect(createNft.mintNFT(anyValue+'',{value: parseEther('0.0075')})).to.be.changeEtherBalance(createNft,parseEther('0.0075'));

            const tx = await createNft.mintNFT('test1235',{value: parseEther('0.0075')});
            console.log(await tx.wait());
            // expect(await createNft.ownerOf(tokenId as any)).to.equal(owner.address);
        })
    })
})