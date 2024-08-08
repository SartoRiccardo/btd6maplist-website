import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    discordAccessToken: null,
    discordProfile: null,
    maplistProfile: null,
    btd6Profile: null,
  },
  reducers: {
    setDiscordAccessToken: (state, { payload }) => {
      state.discordAccessToken = {
        ...payload.discordAccessToken,
        expires_at: payload.discordAccessToken.expires_at * 1000,
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
  },
});

export const selectDiscordAccessToken = ({ auth }) => auth.discordAccessToken;
export const selectMaplistProfile = ({ auth }) => ({
  discordAccessToken: auth.discordAccessToken,
  maplistProfile: auth.maplistProfile,
});
export const selectBtd6Profile = ({ auth }) => auth.discordAccessToken;

export const {
  setDiscordAccessToken,
  setDiscordProfile,
  setMaplistProfile,
  setBtd6Profile,
} = authSlice.actions;
export default authSlice.reducer;
