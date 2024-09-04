"use client";
import CompletionRow from "@/components/maps/CompletionRow";
import UserEntry_C from "@/components/users/UserEntry.client";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { getOwnMapCompletions } from "@/server/maplistRequests.client";
import { hashCode } from "@/utils/functions";
import { useAuthLevels, useDiscordToken } from "@/utils/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  const equalRuns = {};
  const keyOrder = [];
  if (completions !== null)
    for (const run of completions) {
      const key = hashCode(run.user_ids.reduce((agg, uid) => agg + uid, ""));
      if (!keyOrder.includes(key)) {
        keyOrder.push(key);
        equalRuns[key] = [];
      }
      equalRuns[key].push(run);
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
          completion={equalRuns[key]}
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
  if (!authLevels.loaded || !(authLevels.isExplistMod || authLevels.isListMod))
    return null;

  return (
    <Link href={href} scroll={false}>
      <i className="bi bi-pencil-square ms-3" />
    </Link>
  );
}

export function CheckRunText() {
  const authLevels = useAuthLevels();
  if (!authLevels.loaded || !(authLevels.isExplistMod || authLevels.isListMod))
    return null;

  return (
    <p className="muted text-center">
      To edit/delete a completion, click its medals
    </p>
  );
}
