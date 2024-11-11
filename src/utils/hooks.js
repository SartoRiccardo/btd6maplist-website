"use client";
import {
  selectAuthLevels,
  selectDiscordAccessToken,
  selectMaplistProfile,
} from "@/features/authSlice";
import {
  selectMaplistConfig,
  selectMaplistRoles,
} from "@/features/maplistSlice";
import { useAppSelector } from "@/lib/store";
import { useEffect, useState } from "react";

export const useMaplistConfig = () => useAppSelector(selectMaplistConfig);
export const useDiscordToken = () => useAppSelector(selectDiscordAccessToken);
export const useMaplistProfile = () => useAppSelector(selectMaplistProfile);
export const useMaplistRoles = () => useAppSelector(selectMaplistRoles);
export const useAuthLevels = () => useAppSelector(selectAuthLevels);
export const useIsWindows = () => {
  const [isWindows, setIsWindows] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent) setIsWindows(/Windows/.test(userAgent));
  }, []);
  return isWindows;
};
