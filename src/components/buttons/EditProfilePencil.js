"use client";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import Link from "next/link";

export default function EditProfilePencil({ userId }) {
  const { maplistProfile } = useAppSelector(selectMaplistProfile);
  if (!maplistProfile || maplistProfile.id !== userId) return null;

  return (
    <Link href="/user/edit">
      <i className="bi bi-pencil-square" />
    </Link>
  );
}
