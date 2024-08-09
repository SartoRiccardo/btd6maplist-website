"use client";
import { getCustomMap } from "@/server/ninjakiwiRequests";
import styles from "./btd6map.module.css";
import { btd6Font } from "@/lib/fonts";
import { useEffect, useState } from "react";

export default function Btd6Map({ name, code, creator, placement }) {
  const [mapData, setMapData] = useState(null);
  useEffect(() => {
    const fetchMapData = async () => {
      const mapData = await getCustomMap(code);
      setMapData(mapData);
    };
    fetchMapData();
  }, [code]);

  return (
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
      {mapData ? (
        <img src={mapData.mapURL} />
      ) : (
        <div className={styles.imgPlaceholder} />
      )}
    </div>
  );
}
