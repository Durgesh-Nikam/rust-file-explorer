import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectCurrentPath } from "../store/slices/navigationSlice";
import { goBack, goForward } from "../store/slices/navigationSlice";
import { useFileActions } from "./useFileActions";
import { useContextMenu } from "./useContextMenu";
import { ContextMenuType } from "../types";

import {
  setShowCreateFileModal,
  setShowCreateFolderModal,
} from "../store/slices/modalSlice";

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();
  const currentPath = useAppSelector(selectCurrentPath);
  const { showContextMenu, hideContextMenu } = useContextMenu();

  // Reference to fileActions to avoid circular dependency
  const fileActions = useFileActions();

  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Toggle shortcuts help dialog with ? key
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcutsHelp((prev) => !prev);
        return;
      }

      // Toggle search with Ctrl+K
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setShowSearchBar((prev) => !prev);
        return;
      }

      // Navigation shortcuts
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        dispatch(goBack());
      }

      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        dispatch(goForward());
      }

      // File operation shortcuts (only when in a directory)
      if (currentPath) {
        // New file (Ctrl+N)
        if (e.ctrlKey && e.key === "n" && !e.shiftKey) {
          e.preventDefault();
          dispatch(setShowCreateFileModal(true));
        }

        // New folder (Ctrl+Shift+N)
        if (e.ctrlKey && e.shiftKey && e.key === "N") {
          e.preventDefault();
          dispatch(setShowCreateFolderModal(true));
        }

        // Context menu (Shift+F10 or context menu key)
        if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
          e.preventDefault();
          // Position in the middle of the screen as a fallback
          showContextMenu(ContextMenuType.Main, {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          });
        }

        // Escape to close context menu and dialogs
        if (e.key === "Escape") {
          hideContextMenu();
          setShowShortcutsHelp(false);
          dispatch(setShowCreateFileModal(false));
          dispatch(setShowCreateFolderModal(false));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPath, dispatch, showShortcutsHelp]);

  return {
    showShortcutsHelp,
    setShowShortcutsHelp,
    showSearchBar,
    setShowSearchBar,
  };
};
