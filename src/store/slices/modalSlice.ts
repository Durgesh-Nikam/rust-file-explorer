import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ModalState {
  showCreateFileModal: boolean;
  showCreateFolderModal: boolean;
}

const initialState: ModalState = {
  showCreateFileModal: false,
  showCreateFolderModal: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setShowCreateFileModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateFileModal = action.payload;
    },
    setShowCreateFolderModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateFolderModal = action.payload;
    },
  },
});

export const { setShowCreateFileModal, setShowCreateFolderModal } =
  modalSlice.actions;

export const selectShowCreateFileModal = (state: RootState) =>
  state.modal.showCreateFileModal;
export const selectShowCreateFolderModal = (state: RootState) =>
  state.modal.showCreateFolderModal;

export default modalSlice.reducer;
