import MaplistCompletions from "@/components/maps/MaplistCompletions";
import styles from "./mapinfo.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import MapPlacements from "@/components/maps/MapPlacements";
import UserEntry from "@/components/users/UserEntry";
import { getMap } from "@/server/maplistRequests";
import { numberWithCommas } from "@/utils/functions";
import { Fragment, Suspense } from "react";
import SelectorButton from "@/components/buttons/SelectorButton";
import { allFormats } from "@/utils/maplistUtils";
import {
  AdminRunOptions,
  EditPencilAdmin,
  LoggedUserRun,
  Round6Start,
} from "./page.client";
import CopyButton from "@/components/forms/CopyButton";
import BtnShowCompletion from "@/components/buttons/BtnShowCompletion";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const mapData = await getMap(params.code);
  return {
    title: `${mapData?.name || "Custom Map"} | BTD6 Maplist`,
    description: "Custom map in the Bloons TD 6 Maplist",
  };
}

export default async function MapOverview({ params, searchParams }) {
  const { code } = params;
  const mapData = await getMap(code);
  let page = parseInt(searchParams?.comp_page || "1");
  page = isNaN(page) ? 1 : page;

  if (mapData === null) notFound();

  return (
    <>
      <h1 className="text-center mb-2">
        {mapData.name}
        <EditPencilAdmin href={`/map/${code}/edit`} />
      </h1>
      {mapData.aliases.length > 0 && (
        <p className="text-center muted" data-cy="aliases">
          {mapData.aliases.map((al, i) => (
            <Fragment key={al}>
              {i !== 0 && ", "}
              <span className="mono">{al}</span>
            </Fragment>
          ))}
        </p>
      )}
      <p className="text-center lead" data-cy="code">
        Code: <u>{mapData.code}</u> <CopyButton content={mapData.code} />
      </p>
      <div className="row justify-content-center">
        <MapPlacements mapData={mapData} />
      </div>

      <div className="row my-4">
        <div className="col-12 col-md-6 col-lg-5">
          <Btd6Map
            mapData={mapData}
            playBtn
            otherCodes={mapData.additional_codes}
            verified={mapData.verified}
            className="mt-0 mb-4 mb-md-0"
          />
        </div>

        <div className="col-12 col-md-6 col-lg-7">
          <div className={styles.mapInfoContainer}>
            <div className={`${styles.mapInfo} row shadow`}>
              <div className="col-6 col-md-12 col-lg-6 mb-3" data-cy="creators">
                <h3>Creator{mapData.creators.length > 1 && "s"}</h3>
                {mapData.creators.map(({ id, role }) => (
                  <UserEntry key={id} id={id} label={role} />
                ))}
              </div>

              <div
                className="col-6 col-md-12 col-lg-6 mb-3"
                data-cy="verifiers"
              >
                <h3>Verifier{mapData.verifications.length > 1 && "s"}</h3>
                {mapData.verifications.map(({ verifier, version }) => (
                  <UserEntry
                    key={{ verifier, version }}
                    id={verifier}
                    label={version && "Current version"}
                  />
                ))}
              </div>

              {/* {mapData.map_data_compatibility.length > 0 && (
              <div className="col-12 mb-3">
                <h3>Map Version Compatibility</h3>

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
            )} */}

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
            {mapData.r6_start && (
              <div className={`${styles.mapInfo} mt-3 row shadow`}>
                <Round6Start r6Start={mapData.r6_start} />
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-center">Completions</h2>

      <div className="mb-4" data-cy="user-completions">
        <h3 className="text-center">Your Runs</h3>
        <LoggedUserRun mapData={mapData} />
      </div>

      {mapData.lccs.length ? (
        <>
          <h3 className="text-center">
            Current LCC{mapData.lccs.length !== 1 && "s"}
          </h3>

          {mapData.lccs.map((run) => (
            <LCC run={run} key={run.id} />
          ))}
        </>
      ) : null}

      <h3 className="text-center mt-3">List Completions</h3>
      {mapData.deleted_on === null && <AdminRunOptions code={code} />}

      <Suspense fallback={null}>
        <MaplistCompletions
          page={page}
          code={code}
          mapIdxCurver={mapData.placement_cur}
          mapIdxAllver={mapData.placement_all}
        />
      </Suspense>
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

function LCC({ run }) {
  const format = allFormats.find(({ value }) => run.format === value);
  if (!format) return null;

  return (
    <div className="panel my-2" data-cy="lcc">
      <div className="row">
        <div className="col-12 col-md-6">
          {run.users.map(({ id }) => (
            <UserEntry key={id} id={id} centered lead="sm" />
          ))}
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-end">
          <div className="row gx-0 w-100">
            <div className="col-11 d-flex justify-content-start justify-content-md-end">
              <div className="align-self-center">
                <div className="pe-3">
                  <SelectorButton key={format.value} text={format.short} active>
                    <img src={format.image} width={40} height={40} />
                  </SelectorButton>
                </div>
              </div>

              <div className="align-self-center d-flex justify-content-between w-100 w-md-auto">
                <p className="fs-5 mb-0 pe-3">
                  Saveup: <b>${numberWithCommas(run.lcc.leftover)}</b>
                </p>
              </div>
            </div>

            {run.subm_proof_img.length > 0 && (
              <div className="col-1 flex-vcenter">
                <BtnShowCompletion src={run.subm_proof_img} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
