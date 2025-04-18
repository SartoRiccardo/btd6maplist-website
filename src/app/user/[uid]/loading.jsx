import { emptyImage } from "@/utils/misc";
import styles from "./userpage.module.css";

export default function PageUserLoader() {
  return (
    <div className={`panel ${styles.profileContainer}`}>
      <div
        className={`d-flex py-3 ${styles.profileBannerContainer} ${styles.placeholder}`}
        style={{
          backgroundImage: `url(${emptyImage})`,
        }}
      >
        <img
          src={emptyImage}
          className={`${styles.profilePfp} ${styles.placeholder}`}
        />
      </div>
    </div>
  );
}
