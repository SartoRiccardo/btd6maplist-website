"use client";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";

export default function MustBeInDiscord() {
  const { maplistProfile } = useAppSelector(selectMaplistProfile);

  return !maplistProfile || !maplistProfile.isInServer ? (
    <p className="fs-4 text-center text-underline">
      <u>
        You must be in the{" "}
        <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank">
          Maplist Discord
        </a>{" "}
        to submit anything!
      </u>
    </p>
  ) : null;
}
