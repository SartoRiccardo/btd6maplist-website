"use client";
import LazyFade from "@/components/transitions/LazyFade";
import stylesLoader from "../../../components/utils/Loader.module.css";
import CompletionRow from "@/components/maps/CompletionRow";
import UserEntry_C from "@/components/users/UserEntry.client";
import ZoomedImage from "@/components/utils/ZoomedImage";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { getOwnMapCompletions } from "@/server/maplistRequests.client";
import { imageFormats } from "@/utils/file-formats";
import { groupCompsByUser } from "@/utils/functions";
import { useAuthLevels, useDiscordToken } from "@/utils/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";

// https://stackoverflow.com/a/37704433/13033269
const youtubeRe =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;

export function LoggedUserRun({ mapData }) {
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  const token = useDiscordToken();
  const [completions, setCompletions] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const completions = await getOwnMapCompletions(
        token.access_token,
        mapData.code
      );
      setCompletions(completions);
    };
    if (token) getData();
  }, [mapData.code]);

  let runsBySameUsr = {};
  let keyOrder = [];
  if (completions !== null) {
    const groupedComps = groupCompsByUser(completions);
    runsBySameUsr = groupedComps.runsBySameUsr;
    keyOrder = groupedComps.keyOrder;
  }

  return maplistProfile ? (
    completions === null ? (
      <div className="flex-hcenter mb-4">
        <div className={stylesLoader.loader} />
      </div>
    ) : completions.length ? (
      keyOrder.map((key) => (
        <CompletionRow
          key={key}
          completion={runsBySameUsr[key]}
          mapIdxCurver={mapData.placement_cur}
          mapIdxAllver={mapData.placement_all}
          userEntry={
            <UserEntry_C profile={maplistProfile} centered lead="sm" />
          }
        />
      ))
    ) : (
      <p className="fs-5 muted text-center">You haven't beaten this map yet!</p>
    )
  ) : null;
}

export function EditPencilAdmin({ href }) {
  const authLevels = useAuthLevels();
  if (!authLevels.loaded || !authLevels.hasPerms) return null;

  return (
    <Link href={href}>
      <i className="bi bi-pencil-square ms-3" />
    </Link>
  );
}

export function AdminRunOptions({ code }) {
  const authLevels = useAuthLevels();
  if (!authLevels.loaded || !authLevels.hasPerms) return null;

  return (
    <>
      <div className="flex-hcenter mb-4">
        <Link href={`/map/${code}/completions/new`}>
          <button className="btn btn-primary">Insert a Run</button>
        </Link>
      </div>
    </>
  );
}

export function SubmitRunButton({ code }) {
  const token = useDiscordToken();

  return (
    <Link href={`/map/${code}/submit`} prefetch={!!token}>
      <button className="btn btn-primary active" data-cy="btn-submit-run">
        Submit a Run
      </button>
    </Link>
  );
}

export function Round6Start({ r6Start }) {
  const [open, setOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);

  let dropComponent = null;

  const ytMatch = r6Start.match(youtubeRe);
  if (ytMatch) {
    dropComponent = (
      <div className="px-3 mt-3">
        <div className="yt-embed">
          <iframe src={`https://www.youtube.com/embed/${ytMatch[5]}`} />
        </div>
      </div>
    );
  } else if (imageFormats.some((ext) => r6Start.endsWith(ext))) {
    dropComponent = (
      <>
        <img
          className="zoomable w-100 mt-3"
          onClick={() => setZoomImage(true)}
          src={r6Start}
        />
        <ZoomedImage
          src={r6Start}
          show={zoomImage}
          onHide={() => setZoomImage(false)}
        />
      </>
    );
  }

  return dropComponent ? (
    <div data-cy="r6-start-dropdown">
      <h3
        className="c-pointer mb-1"
        onClick={() => setOpen(!open)}
        tabIndex={0}
        data-cy="btn-r6-start-dropdown"
      >
        <i
          className={`bi ${
            open ? "bi-caret-down-fill" : "bi-caret-right-fill"
          } me-2`}
        />
        Round 6 Start
      </h3>
      <LazyFade in={open} mountOnEnter={true} unmountOnExit={true}>
        <div>{dropComponent}</div>
      </LazyFade>
    </div>
  ) : (
    <a href={r6Start} target="_blank">
      <h3 className="mb-1">
        Round 6 Start&nbsp;
        <i className="bi bi-box-arrow-up-right ms-1" />
      </h3>
    </a>
  );
}
