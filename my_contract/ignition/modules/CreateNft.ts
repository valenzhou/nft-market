import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";
import MarketModule from "./Market";
const CreateNftModule = buildModule("CreateNftModule",(m) => {
    const {market} = m.useModule(MarketModule);
    const createNft = m.contract("CreateNft",[market]);
    return {createNft}
});

export default CreateNftModule;