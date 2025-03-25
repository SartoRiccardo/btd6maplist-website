import { createSlice } from "@reduxjs/toolkit";

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

export const selectMaplistConfig = ({ maplist }) => maplist.config;
export const selectMaplistRoles = ({ maplist }) => maplist.roles;

export const { setConfig, setRoles, initializeMaplistSlice } =
  maplistSlice.actions;
export default maplistSlice.reducer;
