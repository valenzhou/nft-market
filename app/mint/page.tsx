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
            <h3 className={styles.title}>BAYC NFTS</h3>
            <p className={styles.description}>The BAYC {'(DEMO)'} is a collection of 20 unique  NFTs. unique digital collectibles living on the Sepolia test blockchain. </p>
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