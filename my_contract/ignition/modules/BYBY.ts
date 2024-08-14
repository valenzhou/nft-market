import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const BybyModule = buildModule("BybyModule",(m) => {
    const byby = m.contract("BYBY",[]);
    return {byby}
});

export default BybyModule;