import { useAppSelector, useAppDispatch } from "../store/hooks";
import InputModal from "./InputModal";
import { useFileActions } from "../hooks/useFileActions";
import {
  selectShowCreateFileModal,
  selectShowCreateFolderModal,
  setShowCreateFileModal,
  setShowCreateFolderModal,
} from "../store/slices/modalSlice";

export const InputModalManager = () => {
  const dispatch = useAppDispatch();
  const { handleCreateFile, handleCreateDirectory } = useFileActions();

  const showCreateFileModal = useAppSelector(selectShowCreateFileModal);
  const showCreateFolderModal = useAppSelector(selectShowCreateFolderModal);

  return (
    <>
      <InputModal
        visible={showCreateFileModal}
        onClose={() => dispatch(setShowCreateFileModal(false))}
        onSubmit={(name) => {
          handleCreateFile(name);
          dispatch(setShowCreateFileModal(false));
        }}
        title="Create New File"
      />

      <InputModal
        visible={showCreateFolderModal}
        onClose={() => dispatch(setShowCreateFolderModal(false))}
        onSubmit={(name) => {
          handleCreateDirectory(name);
          dispatch(setShowCreateFolderModal(false));
        }}
        title="Create New Folder"
      />
    </>
  );
};
