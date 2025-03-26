import { useEffect, useRef } from "react";
import { ContextMenuPosition } from "../../types";
import { useAppDispatch } from "../../store/hooks";

import {
  setShowCreateFileModal,
  setShowCreateFolderModal,
} from "../../store/slices/modalSlice";

interface MainContextMenuProps {
  position: ContextMenuPosition;
  onClose: () => void;
}

const MainContextMenu = ({ position, onClose }: MainContextMenuProps) => {
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

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
    dispatch(setShowCreateFileModal(true));
    onClose();
  };

  const showCreateFolderDialog = () => {
    dispatch(setShowCreateFolderModal(true));
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
    </div>
  );
};

export default MainContextMenu;
