"use client";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { useHasPerms, useMaplistRoles } from "@/utils/hooks";
import Link from "next/link";

export default function BtnBanUser({ userId, roles }) {
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  const hasPerms = useHasPerms();
  const maplistRoles = useMaplistRoles();
  const hasRoleIds = maplistProfile.roles.map(({ id }) => id);

  let assignableRoles = [];
  for (const { id, can_grant } of maplistRoles) {
    if (hasRoleIds.includes(id)) {
      assignableRoles = assignableRoles.concat(can_grant);
    }
  }

  if (
    !maplistProfile ||
    maplistProfile.id === userId ||
    !hasPerms("ban:user") ||
    !roles.every(({ id }) => assignableRoles.includes(id))
  )
    return null;

  return <i className="bi bi-ban c-pointer a" />;
}
