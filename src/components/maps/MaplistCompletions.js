import styles from "./maplistcompletions.module.css";
import { getMapCompletions } from "@/server/maplistRequests";
import UserEntry from "../users/UserEntry";
import MaplistPoints from "./MaplistPoints";
import SelectorButton from "./SelectorButton";
import Image from "next/image";

export default async function MaplistCompletions({
  code,
  mapIdxCurver,
  mapIdxAllver,
}) {
  const completions = await getMapCompletions(code);

  return (
    <div>
      {completions.map((completion) => (
        <div key={completion.user_id} className="panel my-2">
          <div className="row">
            <div className="col-6 col-lg-5">
              <UserEntry id={completion.user_id} />
            </div>

            {/* TODO Placeholders - will add medals */}
            <div className="col-6 col-lg-3">
              <div className="d-flex justify-content-end justify-content-lg-start">
                <SelectorButton active>
                  <Image
                    src="/icon_true.png"
                    width={35}
                    height={35}
                    className={!completion.black_border && styles.blocked}
                  />
                </SelectorButton>
                <SelectorButton className="mx-1 mx-md-3" active>
                  <Image
                    src="/icon_true.png"
                    width={35}
                    height={35}
                    className={!completion.no_geraldo && styles.blocked}
                  />
                </SelectorButton>
                <SelectorButton active>
                  <Image
                    src="/icon_true.png"
                    width={35}
                    height={35}
                    className={!completion.current_lcc && styles.blocked}
                  />
                </SelectorButton>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div
                className={`${styles.pointsGainedContanier} d-flex justify-content-center`}
              >
                {mapIdxCurver > -1 && (
                  <div className="d-flex">
                    <SelectorButton text="cur" active>
                      <Image src="/icon_curver.png" width={40} height={40} />
                    </SelectorButton>

                    <div className={styles.pointsLabelContainer}>
                      <p className="fs-5">
                        +
                        <MaplistPoints
                          completion={completion}
                          idx={mapIdxCurver}
                        />
                        pt
                      </p>
                    </div>
                  </div>
                )}

                {mapIdxAllver > -1 && (
                  <div className={`${styles.marginLeft} d-flex`}>
                    <SelectorButton text="all" active>
                      <Image src="/icon_allver.png" width={40} height={40} />
                    </SelectorButton>

                    <div className={styles.pointsLabelContainer}>
                      <p className="fs-5">
                        +
                        <MaplistPoints
                          completion={completion}
                          idx={mapIdxAllver}
                        />
                        pt
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
