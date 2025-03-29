"use client";
import stylesMedals from "./Medals.module.css";
import stylesMap from "./Btd6Map.module.css";
import Link from "next/link";
import { btd6Font } from "@/lib/fonts";
import { calcMapPoints } from "@/utils/maplistUtils";
import { useIsWindows, useMaplistConfig } from "@/utils/hooks";
import Image from "../utils/Image";
import { emptyImage } from "@/utils/misc";

const MEDAL_SIZE = 60;

export default function Btd6Map({
  name,
  code,
  mapData,
  placement,
  hrefBase,
  playBtn,
  otherCodes,
  verified,
  className,
  completion,
  showMedals,
  placeholder,
  // Circle props
  showPlacement,
  placementIcon,
  placementColor,
  hidePoints,
}) {
  code = code || mapData?.code || "";
  otherCodes = otherCodes || [];
  placementColor = placementColor || "#ef5350";

  const isWindows = useIsWindows();
  const maplistCfg = useMaplistConfig();
  const previewUrl = placeholder
    ? emptyImage
    : mapData?.map_preview_url ||
      `https://data.ninjakiwi.com/btd6/maps/map/${code}/preview`;

  let borderClass = "";
  if (showMedals && completion?.no_geraldo) {
    borderClass = stylesMap.gold_border;
    if (completion.black_border) borderClass = stylesMap.black_border;
  }

  const cmpMap = (
    <div
      className={`shadow ${stylesMap.btd6map} ${borderClass} pb-3 ${
        className ? className : ""
      }`}
      data-cy="custom-map"
    >
      <p className={`${stylesMap.map_title} ${btd6Font.className} font-border`}>
        {name}
      </p>

      {showPlacement ? (
        placement !== undefined &&
        Object.keys(maplistCfg).length && (
          <div className={stylesMap.points}>
            <p
              className={`my-0 text-center ${btd6Font.className} font-border`}
              // Luckiest Guy for some reason is perfectly centered on Windows but not anywhere else?
              style={{ paddingTop: isWindows ? "0" : "0.5rem" }}
            >
              #{placement}
              {!hidePoints && (
                <span className={stylesMap.points_value}>
                  {calcMapPoints(placement, maplistCfg)}
                  <span>pt</span>
                </span>
              )}
            </p>
          </div>
        )
      ) : placementIcon ? (
        <div
          className={stylesMap.points}
          style={{ backgroundColor: placementColor }}
        >
          <p
            className={`my-0 text-center ${btd6Font.className} font-border`}
            style={{ paddingTop: isWindows ? "0" : "0.5rem" }}
          >
            <i className={`bi ${placementIcon}`} />
          </p>
        </div>
      ) : null}

      <Image
        className={stylesMap.btd6map_image}
        src={previewUrl}
        alt=""
        width={600}
        height={400}
      />

      {showMedals && (
        <div className={`${stylesMap.btd6map_medals} d-flex`} data-cy="medals">
          <img
            src={
              completion && completion.black_border
                ? "/medals/medal_bb.webp"
                : "/medals/medal_win.webp"
            }
            width={MEDAL_SIZE}
            height={MEDAL_SIZE}
            className={!completion ? stylesMedals.comp_blocked : ""}
          />
          <img
            src="/medals/medal_nogerry.webp"
            width={MEDAL_SIZE}
            height={MEDAL_SIZE}
            className={`${
              !(completion && completion.no_geraldo)
                ? stylesMedals.comp_blocked
                : ""
            } mx-2`}
          />
          <img
            src="/medals/medal_lcc.webp"
            width={MEDAL_SIZE}
            height={MEDAL_SIZE}
            className={!(completion && completion.current_lcc) ? "d-none" : ""}
          />
        </div>
      )}

      {verified && (
        <div
          className={`${stylesMap.verified_check} ${
            !name || name.length === 0 ? stylesMap.up : ""
          }`}
        >
          <i className="bi bi-check" />v{maplistCfg.current_btd6_ver / 10}
        </div>
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
    <Link className={stylesMap.btd6map_clickable} href={`${hrefBase}/${code}`}>
      {cmpMap}
    </Link>
  ) : (
    cmpMap
  );
}

function PlayBtn({ code, displayCode, className }) {
  return (
    <div
      className={`${stylesMap.play_btn} ${btd6Font.className} ${
        className ? className : ""
      }`}
    >
      <a
        href={code ? `https://join.btd6.com/Map/${code}` : "#"}
        target="_blank"
        className={`shadow font-border`}
        data-cy="btn-custom-map-play"
      >
        <p>{displayCode ? code : "Play"}</p>
      </a>
    </div>
  );
}
