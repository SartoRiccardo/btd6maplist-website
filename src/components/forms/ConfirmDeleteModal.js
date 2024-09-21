"use client";
import { Button, Modal } from "react-bootstrap";

export default function ConfirmDeleteModal({
  show,
  onHide,
  entity,
  onDelete,
  disabled,
}) {
  return (
    <Modal show={show} onHide={onHide} className="modal-panel text-center">
      <Modal.Body>
        <h2 className="text-center">Confirm Deletion</h2>
        <p>Are you sure you wanna delete this {entity}?</p>
        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={onHide} disabled={disabled}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="big"
            onClick={onDelete}
            disabled={disabled}
          >
            Yes, Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
