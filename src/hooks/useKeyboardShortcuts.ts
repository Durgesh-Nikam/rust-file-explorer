import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectCurrentPath } from "../store/slices/navigationSlice";
import { goBack, goForward } from "../store/slices/navigationSlice";
import { useFileActions } from "./useFileActions";
import { useContextMenu } from "./useContextMenu";
import { ContextMenuType } from "../types";

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();
  const currentPath = useAppSelector(selectCurrentPath);
  const { handleCreateFile, handleCreateDirectory } = useFileActions();
  const { showContextMenu, hideContextMenu } = useContextMenu();
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey // Don't interfere with browser shortcuts (Cmd/Ctrl+S, etc.)
      ) {
        return;
      }

      // Toggle shortcuts help dialog with ? key
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcutsHelp((prev) => !prev);
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
        if (e.ctrlKey && e.key === "n") {
          e.preventDefault();
          const fileName = prompt("Enter file name:");
          if (fileName) handleCreateFile(fileName);
        }

        // New folder (Ctrl+Shift+N)
        if (e.ctrlKey && e.shiftKey && e.key === "N") {
          e.preventDefault();
          const folderName = prompt("Enter folder name:");
          if (folderName) handleCreateDirectory(folderName);
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
  };
};
