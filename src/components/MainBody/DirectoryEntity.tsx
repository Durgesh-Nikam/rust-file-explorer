import { MouseEventHandler, useRef, useState, useEffect } from "react";
import {
  ContextMenuType,
  DirectoryContentType,
  EntityContextPayload,
} from "../../types";
import { Folder, File } from "lucide-react";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useFileActions } from "../../hooks/useFileActions";

interface DirectoryEntityProps {
  name: string;
  type: DirectoryContentType;
  onDoubleClick: MouseEventHandler<HTMLButtonElement>;
  entity: EntityContextPayload;
}

const DirectoryEntity = ({
  name,
  type,
  onDoubleClick,
  entity,
}: DirectoryEntityProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { handleEntityContext } = useContextMenu();
  const { setSelectedEntity } = useKeyboardShortcuts();
  const { handleDelete } = useFileActions();
  const [isSelected, setIsSelected] = useState(false);

  // Handle selection on click
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsSelected(true);
    setSelectedEntity(entity);
  };

  // Clear selection when clicking elsewhere
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Enter or Space triggers doubleClick action
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onDoubleClick) {
        const event = new MouseEvent(
          "dblclick"
        ) as unknown as React.MouseEvent<HTMLButtonElement>;
        onDoubleClick(event);
      }
    }

    // Delete key for direct deletion
    if (e.key === "Delete") {
      e.preventDefault();
      handleDelete(entity);
    }
  };

  return (
    <div className="text-center" title={name}>
      <button
        ref={buttonRef}
        onDoubleClick={onDoubleClick}
        onClick={handleClick}
        onContextMenu={(e) => handleEntityContext(e, entity)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={`w-full flex items-center rounded-lg ${
          isSelected ? "bg-blue-700" : "bg-gray-800"
        } p-3 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <div className="mr-3">
          {type === "File" ? (
            <File className="h-8 w-8 text-blue-400" />
          ) : (
            <Folder className="h-8 w-8 text-yellow-400" />
          )}
        </div>
        <span className="text-sm truncate text-left flex-grow">{name}</span>
      </button>
    </div>
  );
};
export default DirectoryEntity;
