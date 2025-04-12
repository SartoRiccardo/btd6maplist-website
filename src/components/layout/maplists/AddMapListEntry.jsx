"use client";
import stylesMap from "../../maps/Btd6Map.module.css";
import AddMapButton from "@/components/buttons/AddMapButton";
import { useDiscordToken, useHasPerms, useMaplistFormats } from "@/utils/hooks";

export default function AddMapListEntry({ format }) {
  const hasPerms = useHasPerms();
  const accessToken = useDiscordToken();
  const currentFormat = useMaplistFormats().find(({ id }) => id === format);

  return (
    <>
      {hasPerms("create:map", { format }) ? (
        <div className="col-6 col-lg-4">
          <AddMapButton href="/map/add" />
        </div>
      ) : null}

      {currentFormat.map_submission_status !== "closed" &&
      (hasPerms("create:map_submission", { format }) || !accessToken) ? (
        <div className="col-6 col-lg-4">
          <AddMapButton
            href={`/map/submit?on=${format}`}
            title="Submit a map"
            icon={<i className={`${stylesMap.warn} bi bi-pencil-fill`} />}
          />
        </div>
      ) : null}
    </>
  );
}
