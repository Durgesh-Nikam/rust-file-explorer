// import { MouseEventHandler, useRef } from "react";
// import { DirectoryContentType, EntityContextPayload } from "../../types";
// import { Folder, File } from "lucide-react";
// import { useContextMenu } from "../../hooks/useContextMenu";

// interface DirectoryEntityProps {
//   name: string;
//   type: DirectoryContentType;
//   onDoubleClick: MouseEventHandler<HTMLButtonElement>;
//   entity: EntityContextPayload;
// }

// const DirectoryEntity = ({
//   name,
//   type,
//   onDoubleClick,
//   entity,
// }: DirectoryEntityProps) => {
//   const buttonRef = useRef<HTMLButtonElement | null>(null);
//   const { handleEntityContext } = useContextMenu();

//   return (
//     <div className="text-center" title={name}>
//       <button
//         ref={buttonRef}
//         onDoubleClick={onDoubleClick}
//         onContextMenu={(e) => handleEntityContext(e, entity)}
//         className="w-full flex items-center rounded-lg bg-gray-800 p-3 transition-colors hover:bg-gray-700"
//       >
//         <div className="mr-3">
//           {type === "File" ? (
//             <File className="h-8 w-8 text-blue-400" />
//           ) : (
//             <Folder className="h-8 w-8 text-yellow-400" />
//           )}
//         </div>
//         <span className="text-sm truncate text-left flex-grow">{name}</span>
//       </button>
//     </div>
//   );
// };
// export default DirectoryEntity;

import { MouseEventHandler, useRef, KeyboardEvent } from "react";
import {
  ContextMenuType,
  DirectoryContentType,
  EntityContextPayload,
} from "../../types";
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

    // Delete key for delete action
    if (e.key === "Delete") {
      e.preventDefault();
      const entityType =
        entity.type === "File"
          ? ContextMenuType.FileEntity
          : ContextMenuType.DirectoryEntity;

      // Show context menu at entity position
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        handleEntityContext(
          {
            preventDefault: () => {},
            stopPropagation: () => {},
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
          } as React.MouseEvent,
          entity
        );
      }
    }
  };

  return (
    <div className="text-center" title={name}>
      <button
        ref={buttonRef}
        onDoubleClick={onDoubleClick}
        onContextMenu={(e) => handleEntityContext(e, entity)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="w-full flex items-center rounded-lg bg-gray-800 p-3 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
