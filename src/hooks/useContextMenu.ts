import { useAppDispatch } from "../store/hooks";
import { updateContextMenu } from "../store/slices/contextMenuSlice";
import {
  ContextMenuPosition,
  ContextMenuType,
  EntityContextPayload,
} from "../types";

export const useContextMenu = () => {
  const dispatch = useAppDispatch();

  const showContextMenu = (
    type: ContextMenuType,
    position: ContextMenuPosition,
    payload?: EntityContextPayload
  ) => {
    dispatch(
      updateContextMenu({
        type,
        position,
        payload,
      })
    );
  };

  const hideContextMenu = () => {
    dispatch(
      updateContextMenu({
        type: ContextMenuType.None,
        position: { x: 0, y: 0 },
        payload: null,
      })
    );
  };

  const handleMainContext = (e: React.MouseEvent) => {
    e.preventDefault();
    showContextMenu(ContextMenuType.Main, { x: e.clientX, y: e.clientY });
  };

  const handleEntityContext = (
    e: React.MouseEvent,
    entity: EntityContextPayload
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const menuType =
      entity.type === "File"
        ? ContextMenuType.FileEntity
        : ContextMenuType.DirectoryEntity;

    showContextMenu(menuType, { x: e.clientX, y: e.clientY }, entity);
  };

  return {
    showContextMenu,
    hideContextMenu,
    handleMainContext,
    handleEntityContext,
  };
};
