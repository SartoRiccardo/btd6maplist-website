"use client";
import Link from "next/link";
import { btd6Font } from "@/lib/fonts";
import { useDiscordToken } from "@/utils/hooks";

export default function AddMapButton({
  onClick,
  href,
  className,
  icon,
  title,
}) {
  icon = icon || <i className="success bi bi-plus" />;
  title = title || "Add New Map";

  const token = useDiscordToken();

  const component = (
    <div
      className={`shadow btd6map pb-3 ${className ? className : ""}`}
      onClick={(evt) => onClick && onClick(evt)}
      tabIndex={0}
    >
      <p className={`mapTitle ${btd6Font.className} font-border`}>{title}</p>

      <div className="btd6mapImage empty flex-vcenter">
        <div className="flex-hcenter btd6map-btn">{icon}</div>
      </div>
    </div>
  );

  return href ? (
    <Link
      className="btd6map-clickable"
      href={href}
      scroll={false}
      prefetch={!!token.access_token}
    >
      {component}
    </Link>
  ) : (
    <div className="btd6map-clickable">{component}</div>
  );
}
