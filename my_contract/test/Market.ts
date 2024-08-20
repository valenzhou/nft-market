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

        const Market = await hre.ethers.getContractFactory("Market");
        const market = await Market.deploy();

        await bybyNft.pause(true);
        await bybyNft.mintBYBY(2,{value: parseEther('0.01')});
        await bybyNft.setApprovalForAll(await market.getAddress(), true);
        return {market,owner,otherAccount,bybyNft};
    }

    describe('deploy',function(){
        it('deploy is success',async function(){
            const {market,bybyNft,owner} = await loadFixture(deployMarket);
            expect(await market.owner()).to.equal(owner.address);
            expect(await market.getListFee()).to.equal(parseEther('0.0025'));
            expect(await bybyNft.balanceOf(owner.address)).to.equal(2);
        })
    })

    describe('listing',function(){
        it("listing",async function(){
            const {market,bybyNft,owner} = await loadFixture(deployMarket);
            const nftAddr = await bybyNft.getAddress();
            await expect(market.createValutItem(nftAddr,1,parseEther('0.5'),{value: parseEther('0.0025')})).not.to.be.reverted;
            const nftList = await market.getMyMarketNfts(owner.address);
            expect(nftList).to.have.lengthOf(1);
        })
        it("buy",async function(){
            const {market,bybyNft, owner,otherAccount} = await loadFixture(deployMarket);
            const nftAddr = await bybyNft.getAddress();
            await market.createValutItem(nftAddr,1,parseEther('0.5'),{value: parseEther('0.0025')});
            await market.createValutItem(nftAddr,2,parseEther('0.5'),{value: parseEther('0.0025')})
            time.increase(100);
            await expect(market.connect(otherAccount).marketSale(nftAddr,1,{value: parseEther('0.5')})).not.to.be.reverted;

            expect(await market.getMyNfts(otherAccount.address)).to.have.lengthOf(1);
            expect(await market.getAvailableNft()).to.have.lengthOf(1);
            expect(await market.getMyMarketNfts(owner.address)).to.have.lengthOf(1);
        })
    })

    describe('withDraw', function (){
        it("withDraw", async function(){
            const {market,bybyNft,owner,otherAccount} = await loadFixture(deployMarket);
            const nftAddr = await bybyNft.getAddress();

            await market.createValutItem(nftAddr,1,parseEther('0.5'),{value: parseEther('0.0025')});
            time.increase(100);

            await expect(market.withDraw()).to.changeEtherBalance(owner.address,parseEther('0.0025'));
        })
    })
})