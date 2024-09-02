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
    getData();
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
    <>
      <h3 className="text-center">Your Runs</h3>
      {completions === null ? (
        <div className="flex-hcenter">
          <div className="loader mb-4" />
        </div>
      ) : completions.length ? (
        <div className="mb-4">
          {keyOrder.map((key) => (
            <CompletionRow
              key={key}
              completion={equalRuns[key]}
              mapIdxCurver={mapData.placement_cur}
              mapIdxAllver={mapData.placement_all}
              userEntry={
                <UserEntry_C profile={maplistProfile} centered lead="sm" />
              }
            />
          ))}
        </div>
      ) : (
        <p className="fs-5 muted text-center">
          You haven't beaten this map yet!
        </p>
      )}
    </>
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
