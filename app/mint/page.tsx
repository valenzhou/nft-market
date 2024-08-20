import Image from "next/image";
import styles from "./page.module.scss"
import NFTInfo from "./components/NFTInfo";
import { revalidatePath } from "next/cache";
export default function Mint() {
    const handleRefresh = ()=>{
        revalidatePath('/mint');
    }
    return (
        <div className={styles.mintContainer}>
            <h3 className={styles.title}>CREATE NFTS</h3>
            <p className={styles.description}>You can upload pictures to Mint the NFT, and after the minting you can sell them and stake your assets. </p>
            <div className={styles.cardContainer}>
                <div className={styles.cardLeft}>
                    <Image src="/BYBYLOGO.png" style={{borderRadius: '16px'}} width={360} height={360} alt="" />
                </div>

                <div className={styles.cardRight}>
                   <NFTInfo />
                </div>
            </div>
        </div>
    );
}