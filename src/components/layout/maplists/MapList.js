"use client";
import cssList from "./MapList.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import AddMapListEntry from "./AddMapListEntry";
import SelectorButton from "@/components/buttons/SelectorButton";
import { difficulties } from "@/utils/maplistUtils";

const BOTTOM_BTN_SIZE = 50;

export default function MapList({
  maps,
  format,
  legacy,
  listName,
  // Flags to show/hide extra content
  noSubmit,
  noMedals,
  bottomInfo,
}) {
  listName = listName || "list";

  const { maplistProfile } = useAppSelector(selectMaplistProfile);

  return (
    <div className="row">
      {!legacy && !noSubmit && <AddMapListEntry on={listName} />}

      {maps.map((mapData) => {
        const { code, placement, name, verified } = mapData;
        let completion = maplistProfile
          ? maplistProfile.completions.find(
              (comp) => comp.map === code && comp.format === format
            )
          : null;

        return (
          <div key={code} className="col-12 col-sm-6 col-lg-4 p-relative">
            <Btd6Map
              mapData={mapData}
              name={name}
              hrefBase="/map"
              verified={verified}
              placement={placement > -1 ? placement : undefined}
              completion={completion}
              showMedals={maplistProfile !== null && !legacy && !noMedals}
              hidePoints={legacy}
            />

            {bottomInfo && (
              <div
                className={`${cssList.difficulties} d-flex justify-content-center`}
              >
                {mapData.placement_cur > -1 && (
                  <SelectorButton
                    text={`#${mapData.placement_cur}`}
                    active
                    textSize="lg"
                  >
                    <img
                      src="/format_icons/icon_curver.webp"
                      alt="Cur"
                      width={BOTTOM_BTN_SIZE}
                      height={BOTTOM_BTN_SIZE}
                    />
                  </SelectorButton>
                )}

                {/* ALLVER UCOMMENT */}
                {/* {mapData.placement_all > -1 && (
                  <SelectorButton text={`#${mapData.placement_all}`} active textSize="lg">
                    <img
                      src="/format_icons/icon_allver.webp"
                      alt="All"
                      width={btnSize}
                      height={btnSize}
                    />
                  </SelectorButton>
                )} */}

                {mapData.difficulty > -1 && (
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
