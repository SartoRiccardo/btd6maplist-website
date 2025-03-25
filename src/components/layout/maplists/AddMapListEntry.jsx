"use client";
import stylesMap from "../../maps/Btd6Map.module.css";
import AddMapButton from "@/components/buttons/AddMapButton";
import { useDiscordToken, useHasPerms } from "@/utils/hooks";

export default function AddMapListEntry({ format }) {
  const hasPerms = useHasPerms();
  const accessToken = useDiscordToken();

  return (
    <>
      {hasPerms("create:map", { format }) ? (
        <div className="col-6 col-lg-4">
          <AddMapButton href="/map/add" />
        </div>
      ) : null}

      {hasPerms("create:map_submission", { format }) || !accessToken ? (
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
