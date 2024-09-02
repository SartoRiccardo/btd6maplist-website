import MaplistCompletions from "@/components/maps/MaplistCompletions";
import styles from "./mapinfo.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import MapPlacements from "@/components/maps/MapPlacements";
import UserEntry from "@/components/users/UserEntry";
import { getMap } from "@/server/maplistRequests";
import { hashCode, listEquals, numberWithCommas } from "@/utils/functions";
import { Fragment, Suspense } from "react";
import ResourceNotFound from "@/components/layout/ResourceNotFound";
import SelectorButton from "@/components/buttons/SelectorButton";
import { listVersions } from "@/utils/maplistUtils";
import { EditPencilAdmin, LoggedUserRun } from "./page.client";

export async function generateMetadata({ params }) {
  const mapData = await getMap(params.code);
  return {
    title: `${mapData?.name || "Custom Map"} | BTD6 Maplist`,
    description: "Custom map in the Bloons TD 6 Maplist",
  };
}

export default async function MapOverview({ params }) {
  const { code } = params;
  const mapData = await getMap(code);

  if (!mapData) return <ResourceNotFound label="map" />;

  let equalLccs = {};
  for (const run of mapData.lccs) {
    const key = hashCode(run.lcc.proof + run.lcc.leftover.toString());
    if (!(key in equalLccs)) {
      equalLccs[key] = [];
    }
    equalLccs[key].push(run);
  }

  return (
    <>
      <h1 className="text-center mb-2">
        {mapData.name}
        <EditPencilAdmin href={`/map/${code}/edit`} />
      </h1>
      {mapData.aliases.length > 0 && (
        <p className="text-center muted">
          {mapData.aliases.map((al, i) => (
            <Fragment key={al}>
              {i !== 0 && ", "}
              <span className="mono">{al}</span>
            </Fragment>
          ))}
        </p>
      )}
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
                {mapData.map_data && mapData.map_data !== "a" ? (
                  <h3>
                    <a href={mapData.map_data} target="_blank">
                      Map Data&nbsp;
                      <i className="bi bi-box-arrow-up-right ml-1" />
                    </a>{" "}
                    {mapData.map_data_compatibility.length > 0 &&
                      "& Compatibility"}
                  </h3>
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
            {mapData.optimal_heros.length > 0 && (
              <>
                <div className="col-12 col-sm-4 col-md-6 col-lg-4">
                  <h3 className="mt-0 mt-sm-2">
                    Optimal Hero{mapData.optimal_heros.length > 1 && "s"}
                  </h3>
                </div>
                <div
                  className={`col-12 col-sm-8 col-md-6 col-lg-8 d-flex flex-col-space ${styles.optimalHeroContainer}`}
                >
                  {mapData.optimal_heros.map((hero) => (
                    <img key={hero} src={`/heros/hero_${hero}.webp`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-center">Completions</h2>

      <LoggedUserRun mapData={mapData} />

      {mapData.lccs.length ? (
        <>
          <h3 className="text-center">
            Current LCC{mapData.lccs.length !== 1 && "s"}
          </h3>

          {Object.keys(equalLccs).map((key) => (
            <LCC run={equalLccs[key]} key={key} />
          ))}
        </>
      ) : null}

      {(mapData.placement_cur > -1 || mapData.placement_all > -1) && (
        <>
          <h3 className="text-center mt-3">List Completions</h3>

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

// Assume `run` is an array of identical LCCs, even with different runs.
// Assume `run.user_ids` is identical among all elements.
function LCC({ run }) {
  run = run instanceof Array ? run : [run];
  const lccFormats = run.map(({ format }) => format);
  let formats = listVersions.filter(
    ({ value }) => lccFormats.includes(value) || lccFormats.includes(0)
  );
  const lcc = run[0].lcc;

  return (
    <div className="panel my-2">
      <div className="row">
        <div className="col-12 col-md-6">
          {run[0].user_ids.map((id) => (
            <UserEntry key={id} id={id} centered lead="sm" />
          ))}
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
          {formats.map(({ short, image, value }) => (
            <div className="pe-3" key={value}>
              <SelectorButton key={value} text={short} active>
                <img src={image} width={40} height={40} />
              </SelectorButton>
            </div>
          ))}

          <div className="flex-vcenter">
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
