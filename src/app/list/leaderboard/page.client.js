"use client";
import { useRouter } from "next/navigation";
import { listVersions } from "@/utils/maplistUtils";
import DifficultySelector from "@/components/maps/DifficultySelector";

const valueToVer = ["current", "all"];

export default function ListLeaderboardDifficulty({ value }) {
  const router = useRouter();
  return (
    <DifficultySelector
      onChange={(diff) =>
        router.push(`/list/leaderboard?version=${valueToVer[diff.value]}`)
      }
      value={value}
      difficulties={listVersions}
    />
  );
}
