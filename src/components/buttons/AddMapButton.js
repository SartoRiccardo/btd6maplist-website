"use client";
import stylesMap from "../maps/Btd6Map.module.css";
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
  icon = icon || <i className={`${stylesMap.success} bi bi-plus`} />;
  title = title || "Add New Map";

  const token = useDiscordToken();

  const component = (
    <div
      className={`shadow ${stylesMap.btd6map} pb-3 ${
        className ? className : ""
      }`}
      onClick={(evt) => onClick && onClick(evt)}
      tabIndex={0}
    >
      <p className={`${stylesMap.map_title} ${btd6Font.className} font-border`}>
        {title}
      </p>

      <div
        className={`${stylesMap.btd6map_image} ${stylesMap.empty} flex-vcenter`}
      >
        <div className={`flex-hcenter ${stylesMap.btd6map_btn}`}>{icon}</div>
      </div>
    </div>
  );

  return href ? (
    <Link
      className={stylesMap.btd6map_clickable}
      href={href}
      prefetch={!!token}
    >
      {component}
    </Link>
  ) : (
    <div className={stylesMap.btd6map_clickable}>{component}</div>
  );
}
