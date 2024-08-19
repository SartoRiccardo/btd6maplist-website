"use client";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import Link from "next/link";

export default function ProtectedLinks() {
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  if (
    !maplistProfile ||
    !(
      maplistProfile.roles.includes(process.env.NEXT_PUBLIC_LISTMOD_ROLE) ||
      maplistProfile.roles.includes(process.env.NEXT_PUBLIC_EXPMOD_ROLE)
    )
  )
    return null;

  return (
    <>
      <li>
        <Link scroll={false} href="/config">
          Admin
        </Link>
      </li>
    </>
  );
}
