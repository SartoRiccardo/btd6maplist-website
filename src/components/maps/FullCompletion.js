import { btd6Font } from "@/lib/fonts";
import UserEntry from "../users/UserEntry";
import RowMedals from "./RowMedals";
import { fromNow } from "@/utils/dates";

export default function FullCompletionInfoRow({ completion }) {
  return (
    <div className="panel my-2 py-2">
      <div className="row gx-0 gy-2 text-start">
        <div className="col-12 col-md-6">
          <div className="d-flex align-self-center btd6mapRow">
            <img
              className="btd6mapImage"
              src={completion.map.map_preview_url}
            />
            <div className="d-flex flex-column justify-content-center">
              <p className={`mb-0 ps-3 ${btd6Font.className} font-border fs-5`}>
                {completion.map.name}
              </p>
            </div>
          </div>
        </div>

        <div className="col-6 col-sm-8 col-md-3 col-lg-4 d-flex flex-column align-self-center">
          {completion.users.map((id) => (
            <UserEntry
              key={id}
              id={id}
              label={fromNow(completion.created_on)}
            />
          ))}
        </div>

        <div className="col-6 col-sm-4 col-md-3 col-lg-2 align-self-center justify-content-end">
          <RowMedals {...completion} />
        </div>
      </div>
    </div>
  );
}
