import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const BybyNftModule = buildModule("BybyNftModule",(m) => {
    const bybyNft = m.contract("BYBYNft",[]);
    return {bybyNft}
});

export default BybyNftModule;