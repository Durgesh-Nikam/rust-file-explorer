import { MouseEventHandler, useRef } from "react";
import { DirectoryContentType, EntityContextPayload } from "../../types";
import { Folder, File } from "lucide-react";
import { useContextMenu } from "../../hooks/useContextMenu";

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

  return (
    <div
      className="text-center"
      title={name}
      onContextMenu={(e) => handleEntityContext(e, entity)}
    >
      <button
        ref={buttonRef}
        onDoubleClick={onDoubleClick}
        className="w-full flex items-center rounded-lg bg-gray-800 p-3 transition-colors hover:bg-gray-700"
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
