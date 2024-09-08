"use client";
import Link from "next/link";
import { btd6Font } from "@/lib/fonts";
import { calcMapPoints } from "@/utils/maplistUtils";
import { useMaplistConfig } from "@/utils/hooks";

const MEDAL_SIZE = 60;

export default function Btd6Map({
  name,
  code,
  placement,
  hrefBase,
  playBtn,
  otherCodes,
  verified,
  className,
  completion,
  showMedals,
}) {
  const maplistCfg = useMaplistConfig();

  const cmpMap = (
    <div className={`shadow btd6map pb-3 ${className ? className : ""}`}>
      <p className={`mapTitle ${btd6Font.className} font-border`}>{name}</p>

      {placement !== undefined && Object.keys(maplistCfg).length && (
        <div className={`points shadow`}>
          <p className={`my-0 text-center ${btd6Font.className} font-border`}>
            {calcMapPoints(placement, maplistCfg)}
          </p>
        </div>
      )}

      <img
        className="btd6mapImage"
        src={`https://data.ninjakiwi.com/btd6/maps/map/${code}/preview`}
      />

      {showMedals && (
        <div className="btd6map-medals d-flex">
          <img
            src={
              completion && completion.black_border
                ? "/medal_bb.webp"
                : "/medal_win.webp"
            }
            width={MEDAL_SIZE}
            height={MEDAL_SIZE}
            className={`${!completion ? "comp-blocked" : ""}`}
          />
          <img
            src="/medal_nogerry.webp"
            width={MEDAL_SIZE}
            height={MEDAL_SIZE}
            className={`${
              !(completion && completion.no_geraldo) ? "comp-blocked" : ""
            } mx-2`}
          />
          <img
            src="/medal_lcc.webp"
            width={MEDAL_SIZE}
            height={MEDAL_SIZE}
            className={!(completion && completion.current_lcc) ? "d-none" : ""}
          />
        </div>
      )}

      {verified && (
        <div
          className={`verifiedCheck ${!name || name.length === 0 ? "up" : ""}`}
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
    <Link
      scroll={false}
      className="btd6map-clickable"
      href={`${hrefBase}/${code}`}
    >
      {cmpMap}
    </Link>
  ) : (
    cmpMap
  );
}

function PlayBtn({ code, displayCode, className }) {
  return (
    <div
      className={`playBtn ${btd6Font.className} ${className ? className : ""}`}
    >
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
