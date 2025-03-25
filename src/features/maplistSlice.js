import { createSelector, createSlice } from "@reduxjs/toolkit";

export const maplistSlice = createSlice({
  name: "maplist",
  initialState: {
    config: {},
    roles: [],
    formats: [],
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

export const { setConfig, setRoles, initializeMaplistSlice, patchConfig } =
  maplistSlice.actions;
export default maplistSlice.reducer;
