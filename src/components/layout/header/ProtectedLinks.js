"use client";
import { useAuthLevels } from "@/utils/hooks";
import Link from "next/link";

export default function ProtectedLinks({ onNavigate }) {
  const { loaded, hasPerms } = useAuthLevels();
  if (!loaded || !hasPerms) return null;

  return (
    <>
      <li>
        <Link
          scroll={false}
          href="/config"
          onClick={(e) => onNavigate && onNavigate(e)}
        >
          Admin
        </Link>
      </li>
    </>
  );
}
