"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../lib/store";
import { initializeAuthSlice } from "@/features/authSlice";
import { setConfig, setRoles } from "@/features/maplistSlice";

export default function StoreProvider({ children, initialState }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    if (initialState) {
      if ("auth" in initialState && initialState.auth !== null) {
        storeRef.current.dispatch(initializeAuthSlice(initialState.auth));
      }
      if ("maplist" in initialState && initialState.maplist !== null) {
        const { config, roles } = initialState.maplist;
        storeRef.current.dispatch(setConfig({ config }));
        storeRef.current.dispatch(setRoles({ roles }));
      }
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
