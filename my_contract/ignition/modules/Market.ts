import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";
import BybyNftModule from "./BYBYNft";

const MarketModule = buildModule("MarketModule",(m) => {
    const {bybyNft} = m.useModule(BybyNftModule);
    const market = m.contract("Market",[bybyNft]);
    return {market}
});

export default MarketModule;