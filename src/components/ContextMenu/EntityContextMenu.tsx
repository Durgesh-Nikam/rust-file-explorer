import { useEffect, useRef } from "react";
import { ContextMenuPosition, EntityContextPayload } from "../../types";
import { useFileActions } from "../../hooks/useFileActions";
import { useClipboard } from "../../hooks/useClipboard";

interface EntityContextMenuProps {
  position: ContextMenuPosition;
  entity: EntityContextPayload;
  onClose: () => void;
}

const EntityContextMenu = ({
  position,
  entity,
  onClose,
}: EntityContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { handleDelete } = useFileActions();
  const { copyToClipboard, cutToClipboard } = useClipboard();

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

  return (
    <div
      ref={menuRef}
      className="bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700 min-w-[180px] z-50"
      style={menuStyle}
    >
      <button
        className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center"
        onClick={() => {
          copyToClipboard(entity);
          onClose();
        }}
      >
        <span className="mr-2">📋</span> Copy
      </button>
      <button
        className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center"
        onClick={() => {
          cutToClipboard(entity);
          onClose();
        }}
      >
        <span className="mr-2">✂️</span> Cut
      </button>
      <div className="border-t border-gray-700 my-1"></div>
      <button
        className="px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left flex items-center"
        onClick={() => {
          handleDelete(entity);
          onClose();
        }}
      >
        <span className="mr-2">🗑️</span> Delete
      </button>
    </div>
  );
};

export default EntityContextMenu;
