import { configureStore } from "@reduxjs/toolkit";
import currentDirectory from "./slices/currentDirectorySlice";

export const store = configureStore({
  reducer: { currentDirectory },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
