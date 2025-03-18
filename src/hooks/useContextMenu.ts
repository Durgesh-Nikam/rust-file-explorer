import { useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import { ContextMenuType, EntityContextPayload } from "../types";
import { updateContextMenu } from "../store/slices/contextMenuSlice";

export const useContextMenu = () => {
  const dispatch = useAppDispatch();

  const showContextMenu = useCallback(
    (
      type: ContextMenuType,
      position: { x: number; y: number },
      payload?: any
    ) => {
      dispatch(
        updateContextMenu({
          type,
          position,
          payload,
        })
      );
    },
    [dispatch]
  );

  const hideContextMenu = useCallback(() => {
    dispatch(
      updateContextMenu({
        type: ContextMenuType.None,
        position: { x: 0, y: 0 },
      })
    );
  }, [dispatch]);

  const handleMainContext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      showContextMenu(ContextMenuType.Main, { x: e.clientX, y: e.clientY });
    },
    [showContextMenu]
  );

  const handleEntityContext = useCallback(
    (e: React.MouseEvent, entity: EntityContextPayload) => {
      e.preventDefault();
      e.stopPropagation();
      showContextMenu(
        entity.type === "File"
          ? ContextMenuType.FileEntity
          : ContextMenuType.DirectoryEntity,
        { x: e.clientX, y: e.clientY },
        entity
      );
    },
    [showContextMenu]
  );

  return {
    showContextMenu,
    hideContextMenu,
    handleMainContext,
    handleEntityContext,
  };
};
