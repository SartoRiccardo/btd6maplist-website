"use client";
import Btd6Map from "@/components/maps/Btd6Map";
import Btd6MapMissing from "@/components/maps/Btd6MapMissing";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { Fragment } from "react";

export default function NostalgiaPackList({
  maps,
  completionFormats,
  listFormat,
  // Flags to show/hide extra content
  noMedals,
}) {
  completionFormats = completionFormats || [];
  listFormat = listFormat || 11;

  const { maplistProfile } = useAppSelector(selectMaplistProfile);

  const mapsBySubcategory = {};
  const subcategories = [];
  for (const map of maps) {
    const subcategoryId = map.format_idx.subcategory.id;
    if (!(subcategoryId in mapsBySubcategory)) {
      mapsBySubcategory[subcategoryId] = [];
      subcategories.push(map.format_idx.subcategory);
    }
    mapsBySubcategory[subcategoryId].push(map);
  }

  return subcategories
    .sort((a, b) => a.id - b.id)
    .map(({ id, name }) => (
      <Fragment key={id}>
        {subcategories.length > 1 && (
          <h2 className="text-center mt-3">{name}</h2>
        )}

        <div className="row gx-0 gx-sm-1 gx-md-2">
          {mapsBySubcategory[id]
            .sort((a, b) => a.format_idx.sort_order - b.format_idx.sort_order)
            .map((mapData) => {
              let completions = maplistProfile
                ? maplistProfile.completions.filter(
                    (comp) =>
                      comp.map === mapData.code &&
                      completionFormats.includes(comp.format)
                  )
                : [];
              const completion = completions.reduce(
                (aggr, comp) => ({
                  map: mapData.code,
                  black_border: aggr?.black_border || comp.black_border,
                  no_geraldo: aggr?.no_geraldo || comp.no_geraldo,
                  current_lcc: aggr?.current_lcc || comp.current_lcc,
                  format: 0,
                }),
                null
              );

              return (
                <div
                  key={mapData.format_idx.sort_order}
                  className="col-6 col-lg-4 p-relative"
                >
                  {mapData.code ? (
                    <Btd6Map
                      mapData={mapData}
                      name={mapData.name}
                      hrefBase="/map"
                      verified={mapData.verified}
                      completion={completion}
                      showMedals={maplistProfile !== null && !noMedals}
                      minimap={mapData.format_idx.preview_url}
                    />
                  ) : (
                    <Btd6MapMissing
                      name={mapData.name}
                      previewUrl={mapData.format_idx.preview_url}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </Fragment>
    ));
}
