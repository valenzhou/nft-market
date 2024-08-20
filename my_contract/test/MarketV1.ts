import hre from "hardhat";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { formatEther, formatGwei, parseEther } from "viem";
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("market",function(){
    async function deployMarket(){
        const [owner,otherAccount] = await hre.ethers.getSigners();
        const BYBYNft = await hre.ethers.getContractFactory("BYBYNft");
        const bybyNft = await BYBYNft.deploy();

        const Market = await hre.ethers.getContractFactory("MarketV1");
        const market = await Market.deploy(bybyNft);

        await bybyNft.pause(true);
        await bybyNft.mintBYBY(1,{value: parseEther('0.005')});
        await bybyNft.setApprovalForAll(await market.getAddress(), true);
        return {market,owner,otherAccount,bybyNft};
    }

    describe('deploy',function(){
        it('deploy is success',async function(){
            const {market,owner} = await loadFixture(deployMarket);
            expect(await market.owner()).to.equal(owner.address);
            expect(await market.getListingFee()).to.equal(parseEther('0.00025'));
        })
    })

    describe('listing',function(){
        it("listing",async function(){
            const {market,owner} = await loadFixture(deployMarket);
            await expect(market.listSale(1,parseEther('0.05'),{value: parseEther('0.00025')})).not.to.be.reverted;
        })
        it("cancel listing",async function(){
            const {market,owner} = await loadFixture(deployMarket);
            await market.listSale(1,parseEther('0.05'),{value: parseEther('0.00025')});
            time.increase(100);
            await expect(market.cancelSale(1)).not.to.be.reverted;
        })
    })

    describe('buy and sale',function(){
        it('buy nft and sale',async function(){
            const {market,bybyNft,owner,otherAccount} = await loadFixture(deployMarket);
          
            await market.listSale(1,parseEther('0.05'),{value: parseEther('0.00025')});

            time.increase(100);
            const balance = await hre.ethers.provider.getBalance(owner.address);
            await expect(market.connect(otherAccount).buyNft(1,{value: parseEther('0.05')})).not.to.be.reverted;
            expect(await bybyNft.ownerOf(1)).to.equal(otherAccount.address);

            expect(await hre.ethers.provider.getBalance(owner.address)).to.equal(balance + parseEther('0.05'));
        })
    })
})