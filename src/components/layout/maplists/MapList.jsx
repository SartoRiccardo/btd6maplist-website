"use client";
import cssList from "./MapList.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import AddMapListEntry from "./AddMapListEntry";
import SelectorButton from "@/components/buttons/SelectorButton";
import { difficulties } from "@/utils/maplistUtils";
import { useVisibleFormats } from "@/utils/hooks";

const BOTTOM_BTN_SIZE = 50;

export default function MapList({
  maps,
  completionFormats,
  legacy,
  listFormat,
  // Flags to show/hide extra content
  noSubmit,
  noMedals,
  bottomInfo,
  showPlacement,
  extremeDifficulties,
}) {
  completionFormats = completionFormats || [];
  extremeDifficulties = extremeDifficulties || [];
  listFormat = listFormat || 1;

  const visibleFormats = useVisibleFormats();
  const { maplistProfile } = useAppSelector(selectMaplistProfile);

  return (
    <div className="row gx-0 gx-sm-1 gx-md-2">
      {!legacy && !noSubmit && <AddMapListEntry format={listFormat} />}

      {maps.map((mapData) => {
        const { code, format_idx, name, verified } = mapData;
        let completions = maplistProfile
          ? maplistProfile.completions.filter(
              (comp) =>
                comp.map === code && completionFormats.includes(comp.format)
            )
          : [];
        const completion = completions.reduce(
          (aggr, comp) => ({
            map: code,
            black_border: aggr?.black_border || comp.black_border,
            no_geraldo: aggr?.no_geraldo || comp.no_geraldo,
            current_lcc: aggr?.current_lcc || comp.current_lcc,
            format: 0,
          }),
          null
        );

        return (
          <div key={code} className="col-6 col-lg-4 p-relative">
            <Btd6Map
              mapData={mapData}
              name={name}
              hrefBase="/map"
              verified={verified}
              placement={format_idx !== null ? format_idx : undefined}
              completion={completion}
              showMedals={maplistProfile !== null && !legacy && !noMedals}
              showPlacement={showPlacement}
              hidePoints={legacy}
              placementIcon={
                extremeDifficulties.includes(format_idx) && "bi-fire"
              }
            />

            {bottomInfo && (
              <div
                className={`${cssList.difficulties} d-flex justify-content-center`}
              >
                {mapData.placement_curver !== null &&
                  visibleFormats.includes(1) && (
                    <SelectorButton
                      text={`#${mapData.placement_curver}`}
                      active
                      textSize="lg"
                    >
                      <img
                        src="/format_icons/icon_curver.webp"
                        alt=""
                        width={BOTTOM_BTN_SIZE}
                        height={BOTTOM_BTN_SIZE}
                      />
                    </SelectorButton>
                  )}

                {mapData.placement_allver !== null &&
                  visibleFormats.includes(1) && (
                    <SelectorButton
                      text={`#${mapData.placement_allver}`}
                      active
                      textSize="lg"
                    >
                      <img
                        src="/format_icons/icon_allver.webp"
                        alt="All"
                        width={BOTTOM_BTN_SIZE}
                        height={BOTTOM_BTN_SIZE}
                      />
                    </SelectorButton>
                  )}

                {mapData.difficulty !== null && visibleFormats.includes(51) && (
                  <SelectorButton active>
                    <img
                      src={difficulties[mapData.difficulty].image}
                      alt="Diff"
                      width={BOTTOM_BTN_SIZE}
                      height={BOTTOM_BTN_SIZE}
                    />
                  </SelectorButton>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
