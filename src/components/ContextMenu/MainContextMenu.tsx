import { useEffect, useRef } from "react";
import { ContextMenuPosition } from "../../types";
import { useFileActions } from "../../hooks/useFileActions";
import { useClipboard } from "../../hooks/useClipboard";
import { selectClipboardEntity } from "../../store/slices/clipboardSlice";
import { useAppSelector } from "../../store/hooks";

interface MainContextMenuProps {
  position: ContextMenuPosition;
  onClose: () => void;
}

const MainContextMenu = ({ position, onClose }: MainContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { handleCreateFile, handleCreateDirectory, handlePaste } =
    useFileActions();
  const clipboardEntity = useAppSelector(selectClipboardEntity);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const menuStyle = {
    position: "absolute" as const,
    top: `${position.y}px`,
    left: `${position.x}px`,
  };

  const showCreateFileDialog = () => {
    const fileName = prompt("Enter file name:");
    if (fileName) {
      handleCreateFile(fileName);
    }
    onClose();
  };

  const showCreateFolderDialog = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      handleCreateDirectory(folderName);
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700 min-w-[180px] z-50"
      style={menuStyle}
    >
      <button
        className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center"
        onClick={showCreateFileDialog}
      >
        <span className="mr-2">📄</span> New File
      </button>
      <button
        className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center"
        onClick={showCreateFolderDialog}
      >
        <span className="mr-2">📁</span> New Folder
      </button>

      {clipboardEntity && (
        <>
          <div className="border-t border-gray-700 my-1"></div>
          <button
            className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center"
            onClick={() => {
              handlePaste();
              onClose();
            }}
          >
            <span className="mr-2">📋</span> Paste
          </button>
        </>
      )}
    </div>
  );
};

export default MainContextMenu;
