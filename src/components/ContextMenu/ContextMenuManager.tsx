import { useAppSelector } from "../../store/hooks";
import { ContextMenuType } from "../../types";
import MainContextMenu from "./MainContextMenu";
import EntityContextMenu from "./EntityContextMenu";
import { useContextMenu } from "../../hooks/useContextMenu";

const ContextMenuManager = () => {
  const contextMenuState = useAppSelector((state) => state.contextMenu);
  const { hideContextMenu } = useContextMenu();

  if (contextMenuState.type === ContextMenuType.None) {
    return null;
  }

  return (
    <>
      {contextMenuState.type === ContextMenuType.Main && (
        <MainContextMenu
          position={contextMenuState.position}
          onClose={hideContextMenu}
        />
      )}
      {(contextMenuState.type === ContextMenuType.FileEntity ||
        contextMenuState.type === ContextMenuType.DirectoryEntity) &&
        contextMenuState.payload && (
          <EntityContextMenu
            position={contextMenuState.position}
            entity={contextMenuState.payload}
            onClose={hideContextMenu}
          />
        )}
    </>
  );
};

export default ContextMenuManager;
