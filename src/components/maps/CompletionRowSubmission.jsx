"use client";
import stylesNav from "../layout/header/navbar.module.css";
import stylesComp from "./MaplistCompletions.module.css";
import stylesMapSubmission from "./MapSubmission.module.css";
import CompletionColumn from "./CompletionColumn";
import Link from "next/link";
import { useState } from "react";
import LazyModal from "../transitions/LazyModal";
import ZoomedImage from "../utils/ZoomedImage";
import RowMedals from "./RowMedals";
import { allFormats } from "@/utils/maplistUtils";
import FormatIcon from "../ui/FormatIcon";
import { useDiscordToken } from "@/utils/hooks";
import {
  deleteCompletion,
  editCompletion,
} from "@/server/maplistRequests.client";
import { revalidateCompletion } from "@/server/revalidations";
import ErrorToast from "../forms/ErrorToast";

export default function CompletionRowSubmission({
  completion,
  mapIdxCurver,
  mapIdxAllver,
  userEntry,
  isLast,
  readOnly = false,
}) {
  const [modalOpen, setModalOpen] = useState(null);
  const accessToken = useDiscordToken();
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      <div
        className={`panel rounded-top-0 ${isLast ? "" : "rounded-bottom-0"} ${
          completion.accepted_by ? stylesMapSubmission.accepted : (completion.deleted_on ? stylesMapSubmission.rejected : "")
        } ${disabled ? stylesComp.darkened : ""}`}
      >
        <div className="row">
          <div className="col-12 col-md-5 col-lg-7 align-self-center">
            <div className="display-flex">{userEntry}</div>
          </div>

          <div
            className={`col-12 col-md-7 col-lg-5 align-self-center ${stylesComp.compcol_container}`}
          >
            <CompletionColumn
              completion={[completion]}
              mapIdxCurver={mapIdxCurver}
              mapIdxAllver={mapIdxAllver}
              onlyIcon
              button={readOnly ? <i
                className={`${stylesComp.completion_link} bi bi-search`}
                onClick={() => setModalOpen("proof")}
                tabIndex={0}
                data-cy="btn-view-proof"
              /> : (disabled ? (
                  <></>
                ) : (
                  <div
                    className={`text-center mb-0 ${stylesNav.has_submenu} ${stylesNav.hover_lg}`}
                  >
                    <i
                      className={`${stylesComp.completion_link} bi bi-three-dots-vertical`}
                      tabIndex={0}
                      data-cy="btn-more-actions"
                    />
                    <div className={stylesNav.submenu}>
                      <ul
                        tabIndex={0}
                        className={`font-border ${stylesComp.dropdown}`}
                        data-cy="menu-completion"
                      >
                        <Link
                          href={`/completions/${completion.id}`}
                          className="no-underline"
                        >
                          <li>
                            <i className="bi bi-pencil-fill me-2" /> Edit
                          </li>
                        </Link>
                        <li onClick={() => setModalOpen("reject")}>
                          <i className="bi bi-x-lg me-2" /> Reject
                        </li>
                        <li onClick={() => setModalOpen("accept")}>
                          <i className="bi bi-check-lg me-2" /> Accept
                        </li>
                        <li onClick={() => setModalOpen("proof")}>
                          <i className="bi bi-search me-2" /> View Proof
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
            />
          </div>

          {completion.subm_notes && (
            <div className="col-12 py-1">{completion.subm_notes}</div>
          )}

          {completion.subm_proof_vid.length > 0 && (
            <div className="col-12 py-1">
              <p className="mb-0">
                Video Proof URL{completion.subm_proof_vid.length > 1 && "s"}:{" "}
              </p>
              <ul>
                {completion.subm_proof_vid.map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {accessToken.access_token && (
        <>
          <QuickActionModal
            action="accept"
            status={modalOpen}
            onHide={() => setModalOpen(null)}
            completion={completion}
            userEntry={userEntry}
            onSubmit={async () => {
              setDisabled(true);
              setModalOpen(null);
              const resp = await editCompletion(accessToken.access_token, {
                ...completion,
                accept: true,
                user_ids: completion.users,
              });

              if (resp?.errors) {
                setError(resp.errors[Object.keys(resp.errors)[0]]);
                setDisabled(false);
                return;
              }

              revalidateCompletion(completion.map, completion.users, {
                cid: completion.id,
                refreshUnapproved: true,
              });
            }}
          />

          <QuickActionModal
            action="reject"
            status={modalOpen}
            onHide={() => setModalOpen(null)}
            completion={completion}
            userEntry={userEntry}
            onSubmit={async () => {
              setDisabled(true);
              setModalOpen(null);
              const resp = await deleteCompletion(
                accessToken.access_token,
                completion.id
              );

              if (resp?.errors) {
                setError(resp.errors[Object.keys(resp.errors)[0]]);
                setDisabled(false);
                return;
              }

              revalidateCompletion(completion.map, completion.users, {
                cid: completion.id,
                refreshUnapproved: true,
              });
            }}
          />
        </>
      )}

      <ZoomedImage
        show={modalOpen === "proof"}
        onHide={() => setModalOpen(null)}
        src={completion.subm_proof_img}
      />

      <ErrorToast
        errors={{ "": error }}
        setErrors={(errors) => setError(errors?.[""])}
      />
    </>
  );
}

function QuickActionModal({
  action,
  onHide,
  status,
  completion,
  userEntry,
  onSubmit,
}) {
  const btnStyle = action === "reject" ? "btn-danger" : "btn-success";
  const runFormat = allFormats.find(({ value }) => value === completion.format);

  return (
    <LazyModal
      className="modal-panel text-center"
      centered
      show={status === action}
      onHide={onHide}
    >
      <h2 className="pt-3 text-capitalize">{action} Completion?</h2>
      <div className="px-3 pb-3">
        {userEntry}
        <div className="d-flex justify-content-start">
          <FormatIcon
            name={runFormat?.longName || runFormat.name}
            image={runFormat.image}
            id={completion.format}
            className="pe-4"
          />
          <RowMedals
            black_border={completion.black_border}
            no_geraldo={completion.no_geraldo}
            current_lcc={completion.current_lcc}
          />
        </div>
      </div>
      <div className="mb-3">
        <button
          className="btn btn-primary me-3"
          onClick={onHide}
          data-cy="btn-cancel"
        >
          Cancel
        </button>
        <button
          className={`btn ${btnStyle} text-capitalize`}
          onClick={onSubmit}
          data-cy={`btn-completion-${action}`}
        >
          {action}
        </button>
      </div>
    </LazyModal>
  );
}
