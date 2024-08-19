import { createSlice } from "@reduxjs/toolkit";

export const maplistSlice = createSlice({
  name: "maplist",
  initialState: {
    config: {},
  },
  reducers: {
    setConfig: (state, { payload }) => {
      state.config = {
        ...state.config,
        ...payload.config,
      };
    },
  },
});

export const selectMaplistConfig = ({ maplist }) => maplist.config;

export const { setConfig } = maplistSlice.actions;
export default maplistSlice.reducer;
