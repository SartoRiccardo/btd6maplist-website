// https://redux.js.org/usage/nextjs
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import authReducer from "../features/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

export const useAppDispatch = useDispatch; //.withTypes();
export const useAppSelector = useSelector; //.withTypes();
export const useAppStore = useStore; //.withTypes();
