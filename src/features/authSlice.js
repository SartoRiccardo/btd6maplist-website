import { createSelector, createSlice } from "@reduxjs/toolkit";

export const initialBtd6Profile = {
  avatarURL:
    "https://static-api.nkstatic.com/appdocs/4/assets/opendata/db32af61df5646951a18c60fe0013a31_ProfileAvatar01.png",
  bannerURL:
    "https://static-api.nkstatic.com/appdocs/4/assets/opendata/bbd8e1412f656b91db7df7aabbc1598b_TeamsBannerDeafult.png",
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    discordAccessToken: null,
    discordProfile: null,
    maplistProfile: null,
    btd6Profile: { ...initialBtd6Profile },
  },
  reducers: {
    initializeAuthSlice: (state, { payload }) => {
      state.discordAccessToken = {
        ...payload.discordAccessToken,
      };
      state.discordProfile = payload.discordProfile;
      state.maplistProfile = payload.maplistProfile;
      if ("btd6profile" in payload) state.btd6Profile = payload.btd6Profile;
    },
    setDiscordAccessToken: (state, { payload }) => {
      state.discordAccessToken = {
        ...payload.discordAccessToken,
        expires_at: payload.discordAccessToken.expires_at,
      };
    },
    setDiscordProfile: (state, { payload }) => {
      state.discordProfile = payload.discordProfile;
    },
    setMaplistProfile: (state, { payload }) => {
      state.maplistProfile = payload.maplistProfile;
    },
    setBtd6Profile: (state, { payload }) => {
      state.btd6Profile = payload.btd6Profile;
    },
    revokeAuth: (state, _p) => {
      state.discordAccessToken = null;
      state.discordProfile = null;
      state.maplistProfile = null;
      state.btd6Profile = { ...initialBtd6Profile };
    },
    setMinMaplistProfile: (state, { payload }) => {
      if (state.maplistProfile === null) state.maplistProfile = {};
      state.maplistProfile = {
        ...state.maplistProfile,
        ...payload,
      };
    },
  },
});

export const selectDiscordAccessToken = ({ auth }) => auth.discordAccessToken;
export const selectMaplistProfile = createSelector(
  ({ auth }) => auth.discordProfile,
  ({ auth }) => auth.maplistProfile,
  ({ auth }) => auth.btd6Profile,
  (discordProfile, maplistProfile, btd6Profile) => ({
    discordProfile,
    maplistProfile,
    btd6Profile,
  })
);

const adminRoles = process.env.NEXT_PUBLIC_ADMIN_ROLES.split(",");
const permsRoles = [
  ...adminRoles,
  process.env.NEXT_PUBLIC_EXPMOD_ROLE,
  process.env.NEXT_PUBLIC_LISTMOD_ROLE,
];
export const selectAuthLevels = createSelector(
  ({ auth }) => auth.maplistProfile,
  (maplistProfile) => ({
    loaded: maplistProfile !== null,
    isExplistMod:
      maplistProfile &&
      maplistProfile.roles.includes(process.env.NEXT_PUBLIC_EXPMOD_ROLE),
    isListMod:
      maplistProfile &&
      maplistProfile.roles.includes(process.env.NEXT_PUBLIC_LISTMOD_ROLE),
    hasPerms:
      maplistProfile &&
      maplistProfile.roles.some((roleId) => permsRoles.includes(roleId)),
    isAdmin:
      maplistProfile &&
      maplistProfile.roles.some((roleId) => adminRoles.includes(roleId)),
    requiresRecording:
      maplistProfile &&
      maplistProfile.roles.includes(process.env.NEXT_PUBLIC_NEEDSREC_ROLES),
  })
);

export const {
  initializeAuthSlice,
  setDiscordAccessToken,
  setDiscordProfile,
  setMaplistProfile,
  setBtd6Profile,
  revokeAuth,
  setMinMaplistProfile,
} = authSlice.actions;
export default authSlice.reducer;
