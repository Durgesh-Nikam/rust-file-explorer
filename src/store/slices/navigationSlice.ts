import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface NavigationState {
  pathHistory: string[];
  currentIndex: number;
}

const initialState: NavigationState = {
  pathHistory: [""],
  currentIndex: 0,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    navigateTo: (state, action: PayloadAction<string>) => {
      state.pathHistory = [
        ...state.pathHistory.slice(0, state.currentIndex + 1),
        action.payload,
      ];
      state.currentIndex += 1;
    },
    goBack: (state) => {
      state.currentIndex = Math.max(0, state.currentIndex - 1);
    },
    goForward: (state) => {
      state.currentIndex = Math.min(
        state.pathHistory.length - 1,
        state.currentIndex + 1
      );
    },
    resetNavigation: () => initialState,
  },
});

export const { navigateTo, goBack, goForward, resetNavigation } =
  navigationSlice.actions;

export const selectNavigation = (state: RootState) => state.navigation;
export const selectCurrentPath = (state: RootState) =>
  state.navigation.pathHistory[state.navigation.currentIndex];
export const selectCanGoBack = (state: RootState) =>
  state.navigation.currentIndex > 0;
export const selectCanGoForward = (state: RootState) =>
  state.navigation.currentIndex < state.navigation.pathHistory.length - 1;

export default navigationSlice.reducer;
