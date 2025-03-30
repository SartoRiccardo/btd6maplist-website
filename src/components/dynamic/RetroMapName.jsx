"use client";
import { selectRetroMapsObj, setRetroMaps } from "@/features/maplistSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useEffect } from "react";
import { getRetroMaps } from "@/server/maplistRequests.client";

let fetching = false;

export default function RetroMapName({ mapId }) {
  const retroMaps = useAppSelector(selectRetroMapsObj);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchRetroMaps = async () => {
      if (Object.keys(retroMaps).length === 0 && !fetching) {
        fetching = true;
        dispatch(setRetroMaps({ retroMaps: await getRetroMaps() }));
        fetching = false;
      }
    };
    fetchRetroMaps();
  }, [retroMaps]);

  return retroMaps?.[mapId];
}
