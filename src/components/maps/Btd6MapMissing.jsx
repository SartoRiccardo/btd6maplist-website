"use client";
import stylesMap from "./Btd6Map.module.css";
import Link from "next/link";
import { btd6Font } from "@/lib/fonts";
import Image from "../utils/Image";

export default function Btd6MapMissing({
  name,
  code,
  hrefBase,
  className,
  previewUrl,
}) {
  return (
    <Link className={stylesMap.btd6map_clickable} href={`${hrefBase}/${code}`}>
      <div
        className={`shadow ${stylesMap.btd6map} pb-3 ${
          className ? className : ""
        }`}
        data-cy="custom-map"
      >
        <p
          className={`${stylesMap.map_title} ${btd6Font.className} font-border`}
        >
          {name}
        </p>

        <Image
          className={stylesMap.btd6map_image}
          src={previewUrl}
          alt=""
          width={600}
          height={400}
        />
      </div>
    </Link>
  );
}
