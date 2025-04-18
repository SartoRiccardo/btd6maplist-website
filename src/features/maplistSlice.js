import { createSelector, createSlice } from "@reduxjs/toolkit";

export const maplistSlice = createSlice({
  name: "maplist",
  initialState: {
    config: {},
    roles: [],
    formats: [],
    retroMaps: null,
  },
  reducers: {
    setConfig: (state, { payload }) => {
      state.config = {
        ...state.config,
        ...payload.config,
      };
    },
    patchConfig: (state, { payload }) => {
      for (const vname of Object.keys(payload.config)) {
        if (vname in state.config) {
          state.config[vname].value = payload.config[vname];
        }
      }
    },
    setRoles: (state, { payload }) => {
      state.roles = payload.roles;
    },
    initializeMaplistSlice: (state, { payload }) => {
      state.roles = payload.roles;
      state.config = {
        ...state.config,
        ...payload.config,
      };
      state.formats = payload.formats;
    },
    setFormat: (state, { payload }) => {
      state.formats = state.formats.map((format) =>
        format.id === payload.format.id
          ? { ...payload.format, ...format }
          : format
      );
    },
    setRetroMaps: (state, { payload }) => {
      state.retroMaps = payload.retroMaps;
    },
  },
});

export const selectTypedMaplistConfig = ({ maplist }) => maplist.config;
export const selectMaplistConfig = createSelector(
  ({ maplist }) => maplist.config,
  (config) => {
    const minConfig = {};
    for (const key of Object.keys(config)) {
      minConfig[key] = config[key].value;
    }
    return minConfig;
  }
);
export const selectMaplistRoles = ({ maplist }) => maplist.roles;
export const selectMaplistFormats = ({ maplist }) => maplist.formats;
export const selectRetroMaps = ({ maplist }) => maplist.retroMaps;
export const selectRetroMapsObj = createSelector(
  ({ maplist }) => maplist.retroMaps,
  (retroMaps) => {
    const maps = {};

    if (retroMaps) {
      for (const game of Object.keys(retroMaps)) {
        for (const category of Object.keys(retroMaps[game])) {
          for (const { id, name } of retroMaps[game][category]) maps[id] = name;
        }
      }
    }

    return maps;
  }
);

export const {
  setConfig,
  setRoles,
  setRetroMaps,
  initializeMaplistSlice,
  patchConfig,
  setFormat,
} = maplistSlice.actions;
export default maplistSlice.reducer;
