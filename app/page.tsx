import styles from "./page.module.scss";
import NFTWall from "./components/NFTWall";
export default function Home() {
  //BybyModule#BYBY - 0x5FbDB2315678afecb367f032d93F642f64180aa3
  // BybyNftModule#BYBYNft - 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

  return (
   <main className={styles.mainContainer}>
    <header>
      <h3 className={styles.title}>BAYC NFTS</h3>
      <p className={styles.description}>The BAYC {'(DEMO)'} is a collection of 20 unique  NFTs. unique digital collectibles living on the Sepolia test blockchain. </p>
    </header>

    <article style={{padding: '20px'}}>
      <NFTWall />
    </article>
   </main>
  );
}
