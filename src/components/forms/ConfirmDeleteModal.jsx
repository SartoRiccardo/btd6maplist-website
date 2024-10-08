import dynamic from "next/dynamic";
const LazyModal = dynamic(() => import("../transitions/LazyModal"), {
  ssr: false,
});

export default function ConfirmDeleteModal({
  show,
  onHide,
  entity,
  onDelete,
  disabled,
}) {
  return (
    <LazyModal show={show} onHide={onHide} className="modal-panel text-center">
      <div className="modal-body">
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
      </div>
    </LazyModal>
  );
}
