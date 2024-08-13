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
            className="mt-0"
          />
        </div>

        <div className="col-6 col-lg-7">
          <div className={`${styles.mapInfo} row`}>
            <div className="col-12 col-lg-6 mb-3">
              <h3>Creator{mapData.creators.length > 1 && "s"}</h3>
              {mapData.creators.map(({ id, role }) => (
                <UserEntry key={id} id={id} label={role} />
              ))}
            </div>
            <div className="col-12 col-lg-6 mb-3">
              <h3>Verifier{mapData.verifications.length > 1 && "s"}</h3>
              {mapData.verifications.map(({ verifier, version }) => (
                <UserEntry
                  key={{ verifier, version }}
                  id={verifier}
                  label={version && "Current version"}
                />
              ))}
            </div>
            <div className="col-12 mb-3">
              <h3>Map Data</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
