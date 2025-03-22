import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntityContextPayload } from "../../types";
import { RootState } from "../store";

export enum ClipboardOperation {
  NONE,
  COPY,
  CUT,
}

interface ClipboardState {
  entity: EntityContextPayload | null;
  operation: ClipboardOperation;
}

const initialState: ClipboardState = {
  entity: null,
  operation: ClipboardOperation.NONE,
};

const clipboardSlice = createSlice({
  name: "clipboard",
  initialState,
  reducers: {
    copyToClipboard: (state, action: PayloadAction<EntityContextPayload>) => {
      state.entity = action.payload;
      state.operation = ClipboardOperation.COPY;
    },
    cutToClipboard: (state, action: PayloadAction<EntityContextPayload>) => {
      state.entity = action.payload;
      state.operation = ClipboardOperation.CUT;
    },
    clearClipboard: (state) => {
      state.entity = null;
      state.operation = ClipboardOperation.NONE;
    },
  },
});

export const { copyToClipboard, cutToClipboard, clearClipboard } =
  clipboardSlice.actions;
export const selectClipboardEntity = (state: RootState) =>
  state.clipboard.entity;
export const selectClipboardOperation = (state: RootState) =>
  state.clipboard.operation;

export default clipboardSlice.reducer;
