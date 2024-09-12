"use client";
import CompletionRow from "@/components/maps/CompletionRow";
import UserEntry_C from "@/components/users/UserEntry.client";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { getOwnMapCompletions } from "@/server/maplistRequests.client";
import { groupCompsByUser } from "@/utils/functions";
import { useAuthLevels, useDiscordToken } from "@/utils/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

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
        <div className="loader" />
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
    <Link href={href} scroll={false}>
      <i className="bi bi-pencil-square ms-3" />
    </Link>
  );
}

export function AdminRunOptions({ code }) {
  const authLevels = useAuthLevels();
  if (!authLevels.loaded || !authLevels.hasPerms) return null;

  return (
    <>
      <div className="flex-hcenter">
        <Link href={`/map/${code}/completions/new`}>
          <Button>Insert a Run</Button>
        </Link>
      </div>

      <p className="muted text-center mt-3">
        To edit/delete a completion, click its medals
      </p>
    </>
  );
}

export function SubmitRunButton({ code }) {
  const token = useDiscordToken();

  return (
    <Link href={`/map/${code}/submit`} prefetch={!!token.access_token}>
      <Button className="active">Submit a Run</Button>
    </Link>
  );
}
