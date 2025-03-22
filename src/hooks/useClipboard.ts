import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  copyToClipboard as copyAction,
  cutToClipboard as cutAction,
  clearClipboard,
  selectClipboardEntity,
  selectClipboardOperation,
} from "../store/slices/clipboardSlice";
import { EntityContextPayload } from "../types";
import { useFileActions } from "./useFileActions";
import { selectCurrentPath } from "../store/slices/navigationSlice";

export const useClipboard = () => {
  const dispatch = useAppDispatch();
  const clipboardItem = useAppSelector(selectClipboardEntity);
  const operation = useAppSelector(selectClipboardOperation);
  const currentPath = useAppSelector(selectCurrentPath);
  const { handlePaste } = useFileActions();

  const copyToClipboard = (entity: EntityContextPayload) => {
    dispatch(copyAction(entity));
  };

  const cutToClipboard = (entity: EntityContextPayload) => {
    dispatch(cutAction(entity));
  };

  const pasteFromClipboard = async () => {
    if (clipboardItem && currentPath) {
      await handlePaste();
    }
  };

  return {
    clipboardItem,
    clipboardOperation: operation,
    copyToClipboard,
    cutToClipboard,
    pasteFromClipboard,
    clearClipboard: () => dispatch(clearClipboard()),
  };
};
