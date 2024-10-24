import cssMap from "./Btd6Map.module.css";
import cssMapSubm from "./MapSubmission.module.css";
import { getCustomMap } from "@/server/ninjakiwiRequests";
import BtnShowCompletion from "../buttons/BtnShowCompletion";
import { btd6Font } from "@/lib/fonts";
import UserEntry from "../users/UserEntry";
import { fromNow } from "@/utils/dates";
import BtnDeleteSubmission from "../buttons/BtnDeleteCompletion";

const proposed = {
  list: ["Top 3", "Top 10", "#11 ~ 20", "#21 ~ 30", "#31 ~ 40", "#41 ~ 50"],
  experts: [
    "Casual Expert",
    "Casual/Medium",
    "Medium Expert",
    "Medium/High",
    "High Expert",
    "High/True",
    "True Expert",
    "True/Extreme",
    "Extreme Expert",
  ],
};

export default async function MapSubmission({
  code,
  rejected_by,
  type,
  proposed_diff,
  subm_notes,
  submitter,
  completion_proof,
  created_on,
}) {
  const btd6Map = await getCustomMap(code);

  return (
    <div
      className={`row panel ${cssMap.btd6map_row} my-3 gy-2 ${
        rejected_by !== null && cssMapSubm.rejected
      }`}
    >
      <div className="col-12 col-md-6">
        <div className="d-flex align-self-center">
          {btd6Map?.mapURL ? (
            <div className={cssMap.btd6map_image}>
              <img className="w-100" loading="lazy" src={btd6Map.mapURL} />
            </div>
          ) : (
            <div className={`${cssMap.btd6map_image} ${cssMap.empty}`} />
          )}

          <div className="d-flex flex-column justify-content-center ps-3">
            <p className={`mb-0 ${btd6Font.className} font-border fs-5`}>
              {btd6Map?.name || <span className="muted">Deleted map?</span>}
            </p>
            <p className="mb-0">
              <b>{code}</b> | {fromNow(created_on)}
              <br />
              Proposed position: <b>{proposed[type][proposed_diff]}</b>
            </p>
          </div>
        </div>
      </div>

      <div className="col-10 col-md-4 col-lg-5 d-flex align-items-center">
        <UserEntry id={submitter} lead />
      </div>

      <div className="col-2 col-lg-1 d-flex align-items-center justify-content-center">
        <BtnShowCompletion src={completion_proof} />
        {rejected_by === null && (
          <BtnDeleteSubmission
            className="ps-3"
            name={btd6Map?.name}
            code={code}
          />
        )}
      </div>

      {subm_notes && (
        <div className="col-12">
          <p>{subm_notes}</p>
        </div>
      )}
    </div>
  );
}
