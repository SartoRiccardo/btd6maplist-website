"use client";
import { setBtd6Profile } from "@/features/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default async function C_Btd6ProfileLoader({ btd6Profile }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (btd6Profile) dispatch(setBtd6Profile({ btd6Profile }));
  }, [btd6Profile]);

  return null;
}
