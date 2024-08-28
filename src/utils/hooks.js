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
