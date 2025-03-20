import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ContextMenuPosition,
  ContextMenuType,
  EntityContextPayload,
} from "../../types";

type ContextMenuState = {
  type: ContextMenuType;
  position: ContextMenuPosition;
  payload?: EntityContextPayload | null;
};

const initialState: ContextMenuState = {
  type: ContextMenuType.None,
  position: { x: 0, y: 0 },
  payload: null,
};

const contextMenuSlice = createSlice({
  name: "contextMenu",
  initialState,
  reducers: {
    updateContextMenu: (state, action: PayloadAction<ContextMenuState>) => {
      return {
        ...state,
        type: action.payload.type,
        position: action.payload.position,
        payload: action.payload.payload,
      };
    },
  },
});

export const { updateContextMenu } = contextMenuSlice.actions;
export default contextMenuSlice.reducer;
