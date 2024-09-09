"use client";
import stylesHeader from "./header.module.css";
import { useIsWindows } from "@/utils/hooks";

export function SiteTitle() {
  const isWindows = useIsWindows();

  return (
    <span
      className={stylesHeader.btd6MaplistTitle}
      // Luckiest Guy for some reason is perfectly centered on Windows but not anywhere else?
      style={{ top: isWindows ? "0" : "0.3rem" }}
    >
      BTD6 Maplist
    </span>
  );
}
