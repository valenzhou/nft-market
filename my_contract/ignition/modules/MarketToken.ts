import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const MarketTokenModule = buildModule("MarketTokenModule",(m) => {
    const marketToken = m.contract("MarketToken");
    return {marketToken}
});

export default MarketTokenModule;