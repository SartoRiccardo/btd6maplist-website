"use client";
import stylesMap from "./Btd6Map.module.css";
import Link from "next/link";
import { btd6Font } from "@/lib/fonts";
import Image from "../utils/Image";
import { useIsWindows } from "@/utils/hooks";

export default function Btd6MapMissing({ name, previewUrl, mapId }) {
  const isWindows = useIsWindows();

  return (
    <Link
      className={stylesMap.btd6map_clickable}
      href={`/map/submit?on=11&remake_of=${mapId}`}
    >
      <div
        className={`shadow ${stylesMap.btd6map} ${stylesMap.missing} pb-3`}
        data-cy="custom-map"
      >
        <Image
          className={stylesMap.btd6map_image}
          src={previewUrl}
          alt=""
          width={600}
          height={400}
        />

        <p
          className={`${stylesMap.map_title} ${btd6Font.className} font-border`}
        >
          {name}
        </p>

        <p
          className={`${stylesMap.submit_cta} ${btd6Font.className} text-center font-border`}
        >
          Submit Your
          <br />
          Recreation
        </p>

        <div className={`${stylesMap.points} ${stylesMap.warn}`}>
          <p
            className={`my-0 text-center ${btd6Font.className} font-border`}
            style={{ paddingTop: isWindows ? "0" : "0.5rem" }}
          >
            <i className={`bi bi-pencil-fill`} />
          </p>
        </div>
      </div>
    </Link>
  );
}
