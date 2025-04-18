"use client";
import {
  selectPermissions,
  selectDiscordAccessToken,
  selectMaplistProfile,
} from "@/features/authSlice";
import {
  selectMaplistConfig,
  selectTypedMaplistConfig,
  selectMaplistRoles,
  selectMaplistFormats,
} from "@/features/maplistSlice";
import { useAppSelector } from "@/lib/store";
import { useCallback, useEffect, useState } from "react";

export const useMaplistFormats = () => useAppSelector(selectMaplistFormats);
export const useVisibleFormats = (idOnly = true) => {
  const visibleFormats = useMaplistFormats().filter(({ hidden }) => !hidden);
  if (idOnly) return visibleFormats.map(({ id }) => id);
  return visibleFormats;
};

export const useMaplistConfig = () => useAppSelector(selectMaplistConfig);
export const useTypedMaplistConfig = () =>
  useAppSelector(selectTypedMaplistConfig);
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

export const useFormatsWhere = (permWant, { full = false } = {}) => {
  const { loaded, permissions } = useAppSelector(selectPermissions);
  const formats = useMaplistFormats();
  if (!loaded) return [];

  const formatsWhere = permissions
    .filter((permGroup) => permGroup.permissions.includes(permWant))
    .map((permGrup) => permGrup.format);
  if (formatsWhere.includes(null))
    return full ? formats : formats.map(({ id }) => id);
  return full
    ? formats.filter(({ id }) => formatsWhere.includes(id))
    : formatsWhere;
};

export const useIsWindows = () => {
  const [isWindows, setIsWindows] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent) setIsWindows(/Windows/.test(userAgent));
  }, []);
  return isWindows;
};
