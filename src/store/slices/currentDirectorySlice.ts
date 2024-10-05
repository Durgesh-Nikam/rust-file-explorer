import { createSlice } from "@reduxjs/toolkit";
import { DirectoryContent } from "../../types";

export interface CurrentDirectoryState {
  contents: DirectoryContent[];
}

const initialState: CurrentDirectoryState = { contents: [] };

export const currentDirectorySlice = createSlice({
  name: "currentDirectory",
  initialState,
  reducers: {},
});

export default currentDirectorySlice.reducer;
