import Link from "next/link";
import styles from "./btd6map.module.css";
import { btd6Font } from "@/lib/fonts";

export default function Btd6Map({ name, code, _creator, placement, hrefBase }) {
  const cmpMap = (
    <div className={`shadow ${styles.btd6map}`}>
      <p className={`${styles.mapTitle} ${btd6Font.className} font-border`}>
        {name}
      </p>
      {placement !== undefined && (
        <div className={`${styles.points} shadow`}>
          <p className={`my-0 text-center ${btd6Font.className} font-border`}>
            TBA {/* Formula from the maplist */}
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
