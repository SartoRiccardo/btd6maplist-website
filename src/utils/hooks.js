"use client";
import {
  selectPermissions,
  selectDiscordAccessToken,
  selectMaplistProfile,
} from "@/features/authSlice";
import {
  selectMaplistConfig,
  selectMaplistRoles,
} from "@/features/maplistSlice";
import { useAppSelector } from "@/lib/store";
import { useCallback, useEffect, useState } from "react";

export const useMaplistConfig = () => useAppSelector(selectMaplistConfig);
export const useDiscordToken = () => useAppSelector(selectDiscordAccessToken);
export const useMaplistProfile = () => useAppSelector(selectMaplistProfile);
export const useMaplistRoles = () => useAppSelector(selectMaplistRoles);
export const useHasPerms = () => {
  const { loaded, permissions } = useAppSelector(selectPermissions);
  return useCallback(
    (requested, { format = undefined } = {}) => {
      if (!loaded) return false;
      if (typeof requested === "string") requested = [requested];

      return requested.some((permWant) =>
        permissions.some(
          (permGroup) =>
            (format === undefined ||
              permGroup.format === null ||
              permGroup.format === format) &&
            permGroup.permissions.includes(permWant)
        )
      );
    },
    [loaded, permissions]
  );
};
export const useIsWindows = () => {
  const [isWindows, setIsWindows] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent) setIsWindows(/Windows/.test(userAgent));
  }, []);
  return isWindows;
};
