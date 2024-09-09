"use client";
import {
  selectAuthLevels,
  selectDiscordAccessToken,
} from "@/features/authSlice";
import { selectMaplistConfig } from "@/features/maplistSlice";
import { useAppSelector } from "@/lib/store";

export const useMaplistConfig = () => useAppSelector(selectMaplistConfig);
export const useDiscordToken = () => useAppSelector(selectDiscordAccessToken);
export const useAuthLevels = () => useAppSelector(selectAuthLevels);
export const useIsWindows = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /Windows/.test(userAgent);
};
