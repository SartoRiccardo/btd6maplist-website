"use client";
import Btd6Map from "@/components/maps/Btd6Map";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import AddMapListEntry from "./AddMapListEntry";

export default function TheList({ maps, format }) {
  const { maplistProfile } = useAppSelector(selectMaplistProfile);

  return (
    <div className="row">
      <AddMapListEntry on="list" />

      {maps.map((mapData) => {
        const { code, placement, name, verified } = mapData;
        let completion = null;
        if (maplistProfile) {
          let compIdx = maplistProfile.completions.findIndex(
            (comp) => comp.map === code && comp.format === format
          );
          if (compIdx > -1) completion = maplistProfile.completions[compIdx];
        }

        return (
          <div key={code} className="col-12 col-sm-6 col-lg-4">
            <Btd6Map
              mapData={mapData}
              name={name}
              hrefBase="/map"
              verified={verified}
              placement={placement}
              completion={completion}
              showMedals={maplistProfile !== null}
            />
          </div>
        );
      })}
    </div>
  );
}
