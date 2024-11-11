import { createSlice } from "@reduxjs/toolkit";

export const maplistSlice = createSlice({
  name: "maplist",
  initialState: {
    config: {},
    roles: {},
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
  },
});

export const selectMaplistConfig = ({ maplist }) => maplist.config;
export const selectMaplistRoles = ({ maplist }) => maplist.roles;

export const { setConfig, setRoles } = maplistSlice.actions;
export default maplistSlice.reducer;
