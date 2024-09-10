"use client";
import AddMapButton from "@/components/buttons/AddMapButton";
import { useAuthLevels, useDiscordToken } from "@/utils/hooks";

export default function AddMapListEntry({ on }) {
  const { loaded, isExplistMod, isListMod, isAdmin } = useAuthLevels();

  return (
    <>
      {loaded &&
      ((on.includes("experts") && (isExplistMod || isAdmin)) ||
        (on.includes("list") && (isListMod || isAdmin))) ? (
        <div className="col-12 col-sm-6 col-lg-4">
          <AddMapButton href="/map/add" />
        </div>
      ) : null}

      <div className="col-12 col-sm-6 col-lg-4">
        <AddMapButton
          href={`/map/submit?on=${on}`}
          title="Submit a map"
          icon={<i className="warn bi bi-pencil-fill" />}
        />
      </div>
    </>
  );
}
