"use client";
import stylesComp from "../maps/MaplistCompletions.module.css";
import { rejectMapSubmission } from "@/server/maplistRequests.client";
import { revalidateMapSubmissions } from "@/server/revalidations";
import { useDiscordToken } from "@/utils/hooks";
import { useState } from "react";
import LazyToast from "../transitions/LazyToast";
import LazyModal from "../transitions/LazyModal";

export default function BtnDeleteSubmission({
  name,
  code,
  formatId,
  className,
}) {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const accessToken = useDiscordToken();

  const reject = async () => {
    const result = await rejectMapSubmission(
      accessToken.access_token,
      code,
      formatId
    );
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
          className={`${stylesComp.completion_link} align-self-center no-underline`}
          onClick={() => setShow(true)}
          data-cy="btn-delete-submission"
        >
          <i className="bi bi-trash3" />
        </span>
      </p>

      <LazyModal
        show={show}
        onHide={() => setShow(false)}
        className="modal-panel"
      >
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
              <button
                className="btn btn-danger big"
                onClick={reject}
                data-cy="btn-delete-submission-confirm"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </LazyModal>

      <LazyToast
        bg="danger"
        className="notification"
        show={error}
        onClose={() => setError(null)}
        delay={4000}
        autohide
      >
        <div className="toast-body">{error}</div>
      </LazyToast>

      <LazyToast
        bg="success"
        className="notification"
        show={success}
        onClose={() => setSuccess(false)}
        delay={4000}
        autohide
      >
        <div className="toast-body">Submission rejected!</div>
      </LazyToast>
    </>
  );
}
