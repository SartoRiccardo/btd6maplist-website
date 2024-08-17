import MaplistCompletions from "@/components/maps/MaplistCompletions";
import styles from "./mapinfo.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import MapPlacements from "@/components/maps/MapPlacements";
import UserEntry from "@/components/users/UserEntry";
import { getMap } from "@/server/maplistRequests";
import { numberWithCommas } from "@/utils/functions";
import { Suspense } from "react";
import ResourceNotFound from "@/components/layout/ResourceNotFound";
import SelectorButton from "@/components/maps/SelectorButton";
import { listVersions } from "@/utils/maplistUtils";

export default async function MapOverview({ params }) {
  const { code } = params;
  const mapData = await getMap(code);

  if (!mapData) return <ResourceNotFound label="map" />;

  return (
    <>
      <title>{`${mapData.name} | BTD6 Maplist`}</title>

      <h1 className="text-center mb-2">{mapData.name}</h1>
      <p className="text-center lead">
        Code: <u>{mapData.code}</u>
      </p>
      <div className="row justify-content-center">
        <MapPlacements mapData={mapData} />
      </div>

      <div className="row my-4">
        <div className="col-12 col-md-6 col-lg-5">
          <Btd6Map
            code={code}
            playBtn
            otherCodes={mapData.additional_codes}
            verified={mapData.verified}
            className="mt-0 mb-4 mb-md-0"
          />
        </div>

        <div className="col-12 col-md-6 col-lg-7">
          <div className={`${styles.mapInfo} h-100 row shadow`}>
            <div className="col-6 col-md-12 col-lg-6 mb-3">
              <h3>Creator{mapData.creators.length > 1 && "s"}</h3>
              {mapData.creators.map(({ id, role }) => (
                <UserEntry key={id} id={id} label={role} />
              ))}
            </div>
            <div className="col-6 col-md-12 col-lg-6 mb-3">
              <h3>Verifier{mapData.verifications.length > 1 && "s"}</h3>
              {mapData.verifications.map(({ verifier, version }) => (
                <UserEntry
                  key={{ verifier, version }}
                  id={verifier}
                  label={version && "Current version"}
                />
              ))}
            </div>
            {(mapData.map_data ||
              mapData.map_data_compatibility.length > 0) && (
              <div className="col-12 mb-3">
                {mapData.map_data ? (
                  <a href={mapData.map_data} target="_blank">
                    <h3>
                      Map Data{" "}
                      {mapData.map_data_compatibility.length > 0 &&
                        "& Compatibility"}
                      &nbsp;
                      <i className="bi bi-box-arrow-up-right ml-2" />
                    </h3>
                  </a>
                ) : (
                  <h3>
                    Map Data{" "}
                    {mapData.map_data_compatibility.length > 0 &&
                      "& Compatibility"}
                  </h3>
                )}

                {mapData.map_data === "a" && (
                  <p>
                    You must ask permission to the creator to use the map data
                    for this map.
                  </p>
                )}

                <ul className={styles.compatibility}>
                  {mapData.map_data_compatibility.map(
                    ({ status, version }, i) => (
                      <MapCompatibility
                        key={i}
                        status={status}
                        startVer={version}
                        endVer={
                          i + 1 < mapData.map_data_compatibility.length
                            ? mapData.map_data_compatibility[i + 1].version - 1
                            : null
                        }
                      />
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-center">Completions</h2>

      {mapData.lccs.length ? (
        <>
          <h3 className="text-center">
            Current LCC{mapData.lccs.length !== 1 && "s"}
          </h3>

          {mapData.lccs.map((lcc) => (
            <LCC lcc={lcc} key={lcc.id} />
          ))}
        </>
      ) : null}

      {(mapData.placement_cur > -1 || mapData.placement_all > -1) && (
        <>
          <h3 className="text-center mt-3">All Completions</h3>

          <Suspense fallback={null}>
            <MaplistCompletions
              code={code}
              mapIdxCurver={mapData.placement_cur}
              mapIdxAllver={mapData.placement_all}
            />
          </Suspense>
        </>
      )}
    </>
  );
}

const compatcolors = ["#388e3c", "#ff8f00", "#827717", "#b71c1c"];
function MapCompatibility({ status, startVer, endVer }) {
  return (
    <li style={{ backgroundColor: compatcolors[status] }}>
      v{startVer}
      {endVer ? endVer !== startVer && `~${endVer}` : "~Current"}
    </li>
  );
}

function LCC({ lcc }) {
  let format = listVersions.filter(({ value }) => value === lcc.format - 1);
  format = format.length ? format[0] : listVersions[0];

  return (
    <div className="panel my-2">
      <div className="row">
        <div className="col-12 col-md-6">
          {lcc.players.map((id) => (
            <UserEntry key={id} id={id} centered lead="sm" />
          ))}
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
          <SelectorButton text={format.short} active>
            <img src={format.image} width={40} height={40} />
          </SelectorButton>

          <div className="flex-vcenter ps-3">
            {lcc.proof ? (
              <a href={lcc.proof} target="_blank">
                <p className="fs-5 mb-0">
                  Saveup: <b>${numberWithCommas(lcc.leftover)}</b> &nbsp;
                  <i className="bi bi-box-arrow-up-right ml-2" />
                </p>
              </a>
            ) : (
              <p className="fs-5 mb-0">
                Saveup: <b>${numberWithCommas(lcc.leftover)}</b>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
