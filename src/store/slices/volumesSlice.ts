import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Volume } from "../../types";
import { RootState } from "../store";

export interface VolumesState {
  volumes: Volume[];
  currentVolume: string;
}

const initialState: VolumesState = { volumes: [], currentVolume: "" };

export const volumesSlice = createSlice({
  name: "volumes",
  initialState,
  reducers: {
    setVolumes: (state, action: PayloadAction<Volume[]>) => {
      state.volumes = action.payload;
    },
    setCurrentVolume: (state, action: PayloadAction<string>) => {
      state.currentVolume = action.payload;
    },
  },
});

export const { setVolumes, setCurrentVolume } = volumesSlice.actions;
export const selectVolumes = (state: RootState) => state.volumes.volumes;
export const selectCurrentVolume = (state: RootState) =>
  state.volumes.currentVolume;
export default volumesSlice.reducer;
