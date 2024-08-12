"use client";
import Link from "next/link";
import styles from "./btd6map.module.css";
import { btd6Font } from "@/lib/fonts";
import { calcMapPoints } from "@/utils/maplistUtils";
import { useAppSelector } from "@/lib/store";
import { selectMaplistConfig } from "@/features/maplistSlice";

export default function Btd6Map({ name, code, _creator, placement, hrefBase }) {
  const maplistCfg = useAppSelector(selectMaplistConfig);

  const cmpMap = (
    <div className={`shadow ${styles.btd6map}`}>
      <p className={`${styles.mapTitle} ${btd6Font.className} font-border`}>
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
