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

      {maps.map(({ code, placement, name, verified }) => {
        let completion = null;
        if (maplistProfile) {
          let compIdx = maplistProfile.completions.findIndex(
            ({ formats, map }) =>
              map.code === code &&
              (formats.includes(0) || formats.includes(format))
          );
          if (compIdx > -1) completion = maplistProfile.completions[compIdx];
        }

        return (
          <div key={code} className="col-12 col-sm-6 col-lg-4">
            <Btd6Map
              code={code}
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
