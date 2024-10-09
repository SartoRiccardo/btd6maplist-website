"use client";
import styles from "./ZoomedImage.module.css";
import LazyModal from "../transitions/LazyModal";
import { useState } from "react";

export default function ZoomedImage({ show, onHide, src, startIdx }) {
  const [imgIdx, setImgIdx] = useState(startIdx || 0);

  return (
    <LazyModal show={show} onHide={onHide} centered>
      <div className="modal-body p-0 p-relative">
        <div className={styles.zoomedImageContainer}>
          <div
            onClick={() => setImgIdx((imgIdx + 1) % src.length)}
            className={`shadow font-border ${styles.switch_image} ${styles.left} ${styles.in_modal}`}
          >
            <i className="bi bi-chevron-left" />
          </div>

          <img src={src[imgIdx]} className={styles.zoomedImage} />

          <div
            onClick={() => setImgIdx((imgIdx + 1) % src.length)}
            className={`shadow font-border ${styles.switch_image} ${styles.right} ${styles.in_modal}`}
          >
            <i className="bi bi-chevron-right" />
          </div>
        </div>
      </div>
    </LazyModal>
  );
}
