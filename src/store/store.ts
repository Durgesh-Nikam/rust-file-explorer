import { configureStore } from "@reduxjs/toolkit";
import currentDirectoryReducer from "./slices/currentDirectorySlice";
import volumesReducer from "./slices/volumesSlice";
import navigationReducer from "./slices/navigationSlice";

export const store = configureStore({
  reducer: {
    currentDirectory: currentDirectoryReducer,
    volumes: volumesReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
