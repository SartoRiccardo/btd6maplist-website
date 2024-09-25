import { Modal } from "react-bootstrap";
import styles from "./ZoomedImage.module.css";

export default function ModalZoomedImage({ show, src, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="p-0 p-relative">
        <div className={styles.zoomedImageContainer}>
          <img src={src} className={styles.zoomedImage} />
        </div>
      </Modal.Body>
    </Modal>
  );
}
