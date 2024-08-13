import styles from "./mapinfo.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import MapPlacements from "@/components/maps/MapPlacements";
import UserEntry from "@/components/users/UserEntry";
import { getMap } from "@/server/maplistRequests";

export default async function MapOverview({ params }) {
  const { code } = params;
  const mapData = await getMap(code);

  return (
    <>
      <h1 className="text-center mb-2">{mapData.name}</h1>
      <p className="text-center lead">
        Code: <u>{mapData.code}</u>
      </p>
      <div className="row justify-content-center">
        <MapPlacements mapData={mapData} />
      </div>

      <div className="row mt-4">
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

                {mapData.map_data !== "ask" && (
                  <p className="mb-0">
                    You must ask permission to the creator to use the map data
                    for this map.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
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
