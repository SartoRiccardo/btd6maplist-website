import { UserEntry_Plc } from "@/components/users/UserEntry.client";
import styles from "./mapinfo.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import MapPlacements from "@/components/maps/MapPlacements";

export default function MapLoader() {
  return (
    <>
      <h1 className="text-center mb-2">&nbsp;</h1>
      <p className="text-center lead" data-cy="code">
        &nbsp;
      </p>
      <div className="row justify-content-center">
        <MapPlacements placeholder />
      </div>

      <div className="row my-4">
        <div className="col-12 col-md-6 col-lg-5">
          <Btd6Map playBtn className="mt-0 mb-4 mb-md-0" placeholder />
        </div>

        <div className="col-12 col-md-6 col-lg-7">
          <div className={styles.mapInfoContainer}>
            <div className={`${styles.mapInfo} row shadow`}>
              <div className="col-6 col-md-12 col-lg-6 mb-3" data-cy="creators">
                <h3>Creators</h3>
                <UserEntry_Plc />
                <UserEntry_Plc />
              </div>

              <div
                className="col-6 col-md-12 col-lg-6 mb-3"
                data-cy="verifiers"
              >
                <h3>Verifiers</h3>
                <UserEntry_Plc />
                <UserEntry_Plc />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
