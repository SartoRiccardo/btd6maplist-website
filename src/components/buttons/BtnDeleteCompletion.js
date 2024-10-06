"use client";
import { rejectMapSubmission } from "@/server/maplistRequests.client";
import { revalidateMapSubmissions } from "@/server/revalidations";
import { useDiscordToken } from "@/utils/hooks";
import { useState } from "react";
import { Toast } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

export default function BtnDeleteSubmission({ name, code, className }) {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const accessToken = useDiscordToken();

  const reject = async () => {
    const result = await rejectMapSubmission(accessToken.access_token, code);
    if (result && Object.keys(result.errors).length)
      setError(result[Object.keys(result.errors)[0]]);
    else setSuccess(true);
    revalidateMapSubmissions();
    setShow(false);
  };

  return (
    <>
      <p className={`${className || ""} text-center mb-0`}>
        <span
          className="completion-link align-self-center no-underline"
          onClick={() => setShow(true)}
        >
          <i className="bi bi-trash3" />
        </span>
      </p>

      <Modal show={show} onHide={() => setShow(false)} className="modal-panel">
        <div className="modal-content">
          <div className="modal-body">
            <p>
              Are you sure you want to reject <b>{name}</b> ({code})?
            </p>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-primary"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger big" onClick={reject}>
                Reject
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Toast
        bg="danger"
        className="notification"
        show={error}
        onClose={() => setError(null)}
        delay={4000}
        autohide
      >
        <Toast.Body>{error}</Toast.Body>
      </Toast>

      <Toast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <Toast.Body>Submission rejected!</Toast.Body>
      </Toast>
    </>
  );
}
