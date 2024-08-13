import { createSelector, createSlice } from "@reduxjs/toolkit";

export const initialBtd6Profile = {
  avatarURL:
    "https://static-api.nkstatic.com/appdocs/4/assets/opendata/db32af61df5646951a18c60fe0013a31_ProfileAvatar01.png",
  bannerURL: "", // TODO proper default banner
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

export const {
  initializeAuthSlice,
  setDiscordAccessToken,
  setDiscordProfile,
  setMaplistProfile,
  setBtd6Profile,
  revokeAuth,
} = authSlice.actions;
export default authSlice.reducer;
