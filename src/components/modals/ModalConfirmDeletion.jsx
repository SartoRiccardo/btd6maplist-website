"use client";
import { Modal } from "react-bootstrap";

export default function ModalConfirmDeletion({
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={onHide}
            disabled={disabled}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger big"
            onClick={onDelete}
            disabled={disabled}
          >
            Yes, Delete
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
