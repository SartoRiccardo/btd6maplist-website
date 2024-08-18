"use client";
import CompletionRow from "@/components/maps/CompletionRow";
import UserEntry from "@/components/users/UserEntry.client";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";

export function LoggedUserRun({ mapData }) {
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  let completions = maplistProfile
    ? maplistProfile.completions.filter(({ map }) => map.code === mapData.code)
    : [];

  return maplistProfile ? (
    <>
      <h3 className="text-center">Your Runs</h3>
      {completions.length ? (
        <div className="mb-4">
          {completions.map((completion, i) => (
            <CompletionRow
              key={i}
              completion={completion}
              mapIdxCurver={mapData.placement_cur}
              mapIdxAllver={mapData.placement_all}
              userEntry={
                <UserEntry profile={maplistProfile} centered lead="sm" />
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
