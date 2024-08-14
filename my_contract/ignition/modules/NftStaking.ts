import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";
import BybyModule from "./BYBY";
import BybyNftModule from "./BYBYNft";
const NftStakingMofule = buildModule("NftStakingMofule",(m) => {
    const { byby } = m.useModule(BybyModule);
    const { bybyNft } = m.useModule(BybyNftModule);
    const NftStaking = m.contract("NftStaking",[bybyNft,byby]);
    return {NftStaking}
});

export default NftStakingMofule;