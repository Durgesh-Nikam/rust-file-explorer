import { useEffect } from "react";
import InputModal from "./InputModal";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useFileActions } from "../hooks/useFileActions";

export const InputModalManager = () => {
  const {
    showCreateFileModal,
    setShowCreateFileModal,
    showCreateFolderModal,
    setShowCreateFolderModal,
  } = useKeyboardShortcuts();

  const { handleCreateFile, handleCreateDirectory } = useFileActions();

  return (
    <>
      <InputModal
        visible={showCreateFileModal}
        onClose={() => setShowCreateFileModal(false)}
        onSubmit={(name) => {
          handleCreateFile(name);
          setShowCreateFileModal(false);
        }}
        title="Create New File"
      />

      <InputModal
        visible={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onSubmit={(name) => {
          handleCreateDirectory(name);
          setShowCreateFolderModal(false);
        }}
        title="Create New Folder"
      />
    </>
  );
};
