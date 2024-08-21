import styles from "./page.module.scss";
import NFTWall from "../components/NFTWall";
import StakeInfo from "./StakeInfo";
import { Chip } from "@nextui-org/react";
export default function Stake() {
  return (
    <>
      <div>
        <div className={styles.coin}>
          <div
            className={`${styles.front} ${styles.frontBefore}  ${styles.jump}`}
          >
            <div className={styles.star}> </div>
            <span className={styles.currency}>$</span>
            <div className={styles.shapes}>
              <div
                className={`${styles.shape_l} ${styles.shapesAfter} ${styles.shapesBefore}`}
              ></div>
              <div
                className={`${styles.shape_r} ${styles.shapesAfter}  ${styles.shapesBefore}`}
              ></div>
              <span className={styles.top}>عظمى</span>
              <span className={styles.bottom}>عملة</span>
            </div>
          </div>
          <div className={styles.shadow}></div>
        </div>

        <div className={styles.infoArea}>
            <StakeInfo />
        </div>
      </div>

      <div className={styles.cardArea}>
        <p className="pl-4">
        <Chip color="warning" variant="shadow">My Stake:</Chip>
        </p>
        <NFTWall filter="stake" />
      </div>
    </>
  );
}
