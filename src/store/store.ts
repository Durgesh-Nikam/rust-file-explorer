import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./slices/navigationSlice";
import volumesReducer from "./slices/volumesSlice";
import currentDirectoryReducer from "./slices/currentDirectorySlice";
import contextMenuReducer from "./slices/contextMenuSlice";
import modalReducer from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    volumes: volumesReducer,
    currentDirectory: currentDirectoryReducer,
    contextMenu: contextMenuReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
