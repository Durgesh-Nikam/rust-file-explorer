import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { ContextMenuType, EntityContextPayload } from "../../types";
import ContextMenu from "./ContextMenu";
import { useFileActions } from "../../hooks/useFileActions";
import InputModal from "../InputModal";
import { useContextMenu } from "../../hooks/useContextMenu";

const ContextMenuManager = () => {
  const { type, position, payload } = useAppSelector(
    (state) => state.contextMenu
  );
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const { hideContextMenu } = useContextMenu();

  const {
    handleCreateFile,
    handleCreateDirectory,
    handleRename,
    handleDeleteDirectory,
    handleDeleteFile,
  } = useFileActions();

  const getMenuItems = () => {
    switch (type) {
      case ContextMenuType.Main:
        return [
          {
            label: "New File",
            action: () => setShowCreateFile(true),
            icon: "📄",
          },
          {
            label: "New Folder",
            action: () => setShowCreateFolder(true),
            icon: "📁",
          },
        ];
      case ContextMenuType.FileEntity:
        const fileEntity = payload as EntityContextPayload;
        return [
          {
            label: "Rename",
            action: () => setShowRename(true),
            icon: "✏️",
          },
          {
            label: "Delete",
            action: () => handleDeleteFile(fileEntity),
            icon: "🗑️",
            danger: true,
          },
        ];
      case ContextMenuType.DirectoryEntity:
        const directoryEntity = payload as EntityContextPayload;
        return [
          {
            label: "Rename",
            action: () => setShowRename(true),
            icon: "✏️",
          },
          {
            label: "Delete",
            action: () => handleDeleteDirectory(directoryEntity),
            icon: "🗑️",
            danger: true,
          },
        ];
      default:
        return [];
    }
  };

  if (type === ContextMenuType.None) return null;

  return (
    <>
      <ContextMenu
        items={getMenuItems()}
        position={position}
        onClose={hideContextMenu}
      />

      <InputModal
        visible={showCreateFile}
        onClose={() => setShowCreateFile(false)}
        onSubmit={(name) => {
          handleCreateFile(name);
          hideContextMenu();
        }}
        title="Create New File"
      />

      <InputModal
        visible={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onSubmit={(name) => {
          handleCreateDirectory(name);
          hideContextMenu();
        }}
        title="Create New Folder"
      />

      <InputModal
        visible={showRename}
        onClose={() => setShowRename(false)}
        onSubmit={(newName: string) => {
          handleRename(payload as EntityContextPayload, newName);
          hideContextMenu();
        }}
        title="Rename"
        initialValue={(payload as EntityContextPayload)?.name || ""}
      />
    </>
  );
};

export default ContextMenuManager;
