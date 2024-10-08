import styles from "./ZoomedImage.module.css";
import dynamic from "next/dynamic";
const LazyModal = dynamic(() => import("../transitions/LazyModal"), {
  ssr: false,
});

export default function ZoomedImage({ show, onHide, src }) {
  return (
    <LazyModal show={show} onHide={onHide} centered>
      <div className="modal-body p-0 p-relative">
        <div className={styles.zoomedImageContainer}>
          <img src={src} className={styles.zoomedImage} />
        </div>
      </div>
    </LazyModal>
  );
}
