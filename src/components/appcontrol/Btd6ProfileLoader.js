"use client";
import { getBtd6User } from "@/server/ninjakiwiRequests";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBtd6Profile } from "@/features/authSlice";

export default function Btd6ProfileLoader({ oak }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchBtd6Profile = async () => {
      if (oak) {
        const btd6Profile = await getBtd6User(oak);
        dispatch(setBtd6Profile({ btd6Profile }));
      }
    };
    fetchBtd6Profile();
  }, [oak]);

  return null;
}
