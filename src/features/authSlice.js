import { createSelector, createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    discordAccessToken: null,
    discordProfile: null,
    maplistProfile: null,
    btd6Profile: {
      avatarURL:
        "https://static-api.nkstatic.com/appdocs/4/assets/opendata/4d406ac8b5d3b1490b813296b824b7ef_ProfileAvatar41.png", // TODO proper default avatar
      bannerURL: "", // TODO proper default banner
    },
  },
  reducers: {
    setDiscordAccessToken: (state, { payload }) => {
      state.discordAccessToken = {
        ...payload.discordAccessToken,
        expires_at: payload.discordAccessToken.expires_at * 1000,
        valid: true,
      };
    },
    setNullDiscordAccessToken: (state, _p) => {
      state.discordAccessToken = { valid: false };
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
  setNullDiscordAccessToken,
  setDiscordAccessToken,
  setDiscordProfile,
  setMaplistProfile,
  setBtd6Profile,
} = authSlice.actions;
export default authSlice.reducer;
