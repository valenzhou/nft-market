import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";
import MarketTokenModule from "./MarketToken";
import CreateNftModule from "./CreateNft";

const MarketStakeModule = buildModule("MarketStakeModule",(m) => {
    const {marketToken} = m.useModule(MarketTokenModule);
    const {createNft} = m.useModule(CreateNftModule);
    const marketStake = m.contract("MarketStake",[createNft,marketToken]);
    return {marketStake}
});

export default MarketStakeModule;