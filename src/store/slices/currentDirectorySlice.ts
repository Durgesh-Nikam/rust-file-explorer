import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DirectoryContent } from "../../types";
import { RootState } from "../store";

export interface CurrentDirectoryState {
  contents: DirectoryContent[];
}

const initialState: CurrentDirectoryState = { contents: [] };

export const currentDirectorySlice = createSlice({
  name: "currentDirectory",
  initialState,
  reducers: {
    updateDirectoryContents: (
      state,
      action: PayloadAction<DirectoryContent[]>
    ) => {
      state.contents = action.payload;
    },
    addContent: (state, action: PayloadAction<DirectoryContent>) => {
      state.contents = [action.payload, ...state.contents];
    },
  },
});

export const { updateDirectoryContents, addContent } =
  currentDirectorySlice.actions;
export const selectDirectoryContents = (state: RootState) =>
  state.currentDirectory.contents;
export default currentDirectorySlice.reducer;
