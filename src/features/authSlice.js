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
    maplistProfile: null,
    btd6Profile: { ...initialBtd6Profile },
  },
  reducers: {
    initializeAuthSlice: (state, { payload }) => {
      state.discordAccessToken = {
        ...payload.discordAccessToken,
      };
      state.maplistProfile = payload.maplistProfile;
      if ("btd6profile" in payload) state.btd6Profile = payload.btd6Profile;
    },
    setDiscordAccessToken: (state, { payload }) => {
      state.discordAccessToken = {
        ...payload.discordAccessToken,
        expires_at: payload.discordAccessToken.expires_at,
      };
    },
    setMaplistProfile: (state, { payload }) => {
      state.maplistProfile = payload.maplistProfile;
    },
    setBtd6Profile: (state, { payload }) => {
      state.btd6Profile = payload.btd6Profile;
    },
    revokeAuth: (state, _p) => {
      state.discordAccessToken = null;
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
  ({ auth }) => auth.maplistProfile,
  ({ auth }) => auth.btd6Profile,
  (maplistProfile, btd6Profile) => ({
    maplistProfile,
    btd6Profile,
  })
);

export const selectAuthLevels = createSelector(
  ({ auth }) => auth.maplistProfile,
  (maplistProfile) => {
    let isExplistMod = false,
      isListMod = false,
      isBanned = false,
      requiresRecording = false;

    const loaded = maplistProfile !== null;
    if (loaded) {
      for (const {
        edit_experts,
        edit_maplist,
        cannot_submit,
        requires_recording,
      } of maplistProfile.roles) {
        isExplistMod = isExplistMod || edit_experts;
        isListMod = isListMod || edit_maplist;
        isBanned = isBanned || cannot_submit;
        requiresRecording = requiresRecording || requires_recording;
      }
    }

    return {
      loaded,
      isExplistMod,
      isListMod,
      hasPerms: isExplistMod || isListMod,
      isAdmin: false,
      requiresRecording,
      isBanned,
    };
  }
);

export const {
  initializeAuthSlice,
  setDiscordAccessToken,
  setMaplistProfile,
  setBtd6Profile,
  revokeAuth,
  setMinMaplistProfile,
} = authSlice.actions;
export default authSlice.reducer;
