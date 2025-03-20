import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DirectoryContent } from "../../types";
import { RootState } from "../store";
import _ from "lodash";

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
    deleteContent: (state, action: PayloadAction<DirectoryContent>) => {
      state.contents = state.contents.filter(
        (c) => !_.isEqual(c, action.payload)
      );
    },
  },
});

export const { updateDirectoryContents, addContent, deleteContent } =
  currentDirectorySlice.actions;
export const selectDirectoryContents = (state: RootState) =>
  state.currentDirectory.contents;
export default currentDirectorySlice.reducer;
