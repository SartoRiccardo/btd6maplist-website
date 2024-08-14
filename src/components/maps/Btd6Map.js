"use client";
import Link from "next/link";
import styles from "./btd6map.module.css";
import { btd6Font } from "@/lib/fonts";
import { calcMapPoints } from "@/utils/maplistUtils";
import { useAppSelector } from "@/lib/store";
import { selectMaplistConfig } from "@/features/maplistSlice";

export default function Btd6Map({
  name,
  code,
  placement,
  hrefBase,
  playBtn,
  otherCodes,
  verified,
  className,
}) {
  const maplistCfg = useAppSelector(selectMaplistConfig);

  const cmpMap = (
    <div className={`shadow ${styles.btd6map} pb-3 ${className || ""}`}>
      <p className={`${styles.mapTitle} ${btd6Font.className} font-border`}>
        {name && verified && (
          <i
            className={`${styles.verifiedCheck} ${styles.small} bi bi-check-square-fill`}
          />
        )}{" "}
        {name}
      </p>
      {placement !== undefined && Object.keys(maplistCfg).length && (
        <div className={`${styles.points} shadow`}>
          <p className={`my-0 text-center ${btd6Font.className} font-border`}>
            {calcMapPoints(placement, maplistCfg)}
          </p>
        </div>
      )}

      <img src={`https://data.ninjakiwi.com/btd6/maps/map/${code}/preview`} />

      {verified && (!name || name.length === 0) && (
        <i className={`${styles.verifiedCheck} bi bi-check-square-fill`} />
      )}

      {playBtn && (
        <>
          <PlayBtn
            code={code}
            className={`mt-${otherCodes.length > 0 ? "2" : "3"} ${
              otherCodes.length > 0 ? "mb-2" : ""
            }`}
          />
          {otherCodes.length > 0 && (
            <>
              <hr className={`m-0`} />
              <div className="px-4">
                {otherCodes.map(({ code, description }) => (
                  <div className="row mt-2" key={code}>
                    <div className="col d-flex flex-column justify-content-center">
                      <p className="mb-0">{description}</p>
                    </div>
                    <div className="col-auto">
                      <PlayBtn code={code} displayCode />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  return hrefBase ? (
    <Link className={styles.clickable} href={`${hrefBase}/${code}`}>
      {cmpMap}
    </Link>
  ) : (
    cmpMap
  );
}

function PlayBtn({ code, displayCode, className }) {
  return (
    <div className={`${styles.playBtn} ${btd6Font.className} ${className}`}>
      <a
        href={`https://join.btd6.com/Map/${code}`}
        target="_blank"
        className={`shadow font-border`}
      >
        <p>{displayCode ? code : "Play"}</p>
      </a>
    </div>
  );
}
