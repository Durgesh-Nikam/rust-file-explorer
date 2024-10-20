import { configureStore } from "@reduxjs/toolkit";
import currentDirectoryReducer from "./slices/currentDirectorySlice";
import volumesReducer from "./slices/volumesSlice";

export const store = configureStore({
  reducer: {
    currentDirectory: currentDirectoryReducer,
    volumes: volumesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
