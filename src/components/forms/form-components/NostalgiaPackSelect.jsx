"use client";
import { selectRetroMaps, setRetroMaps } from "@/features/maplistSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Fragment, useEffect } from "react";
import Select from "../bootstrap/Select";
import { getRetroMaps } from "@/server/maplistRequests.client";

let fetching = false;

export default function NostalgiaPackSelect(props) {
  const retroMaps = useAppSelector(selectRetroMaps);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchRetroMaps = async () => {
      if (retroMaps === null && !fetching) {
        fetching = true;
        dispatch(setRetroMaps({ retroMaps: await getRetroMaps() }));
        fetching = false;
      }
    };
    fetchRetroMaps();
  }, [retroMaps]);

  return retroMaps === null ? null : (
    <Select {...props}>
      {props.allowNull && <option value="-1">N/A</option>}

      {Object.keys(retroMaps).map((gameName) => (
        <Fragment key={gameName}>
          <option disabled value="">
            ---- {gameName} ----
          </option>

          {Object.keys(retroMaps[gameName]).map((categoryName) => (
            <Fragment key={categoryName}>
              <option value="" disabled>
                {categoryName}
              </option>

              {retroMaps[gameName][categoryName].map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </Select>
  );
}
