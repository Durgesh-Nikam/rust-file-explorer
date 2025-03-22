// import {
//   createDirectory,
//   createFile,
//   deleteDirectory,
//   deleteFile,
// } from "../ipc";
// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import {
//   addContent,
//   deleteContent,
// } from "../store/slices/currentDirectorySlice";
// import { selectCurrentPath } from "../store/slices/navigationSlice";
// import { EntityContextPayload } from "../types";
// import { createDirectoryContent } from "../utils";

// export const useFileActions = () => {
//   const dispatch = useAppDispatch();
//   const currentPath = useAppSelector(selectCurrentPath);

//   const handleCreateFile = async (name: string) => {
//     try {
//       const path = `${currentPath}/${name}`;
//       await createFile(path);
//       const newFileContent = createDirectoryContent("File", name, path);
//       dispatch(addContent(newFileContent));
//       console.log("Creating file:", name);
//     } catch (error) {
//       console.error("File creation failed:", error);
//     }
//   };

//   const handleCreateDirectory = async (name: string) => {
//     try {
//       const path = `${currentPath}/${name}`;
//       await createDirectory(path);

//       const newDirectoryContent = createDirectoryContent(
//         "Directory",
//         name,
//         path
//       );

//       dispatch(addContent(newDirectoryContent));
//       console.log("Creating directory:", name);
//     } catch (error) {
//       console.error("Directory creation failed:", error);
//     }
//   };

//   const handleDeleteDirectory = async (entity: EntityContextPayload) => {
//     const confirmed = await confirm(`Delete ${entity.name}?`);
//     if (!confirmed) return;

//     try {
//       await deleteDirectory(entity.path);
//       const content = createDirectoryContent(
//         entity.type,
//         entity.name,
//         entity.path
//       );
//       dispatch(deleteContent(content));
//       console.log("Deleting file:", entity.name);
//     } catch (error) {
//       console.error("Deletion failed:", error);
//     }
//   };

//   const handleDeleteFile = async (entity: EntityContextPayload) => {
//     const confirmed = await confirm(`Delete ${entity.name}?`);
//     if (!confirmed) return;

//     try {
//       await deleteFile(entity.path);
//       const content = createDirectoryContent(
//         entity.type,
//         entity.name,
//         entity.path
//       );
//       dispatch(deleteContent(content));
//       console.log("Deleting file:", entity.name);
//     } catch (error) {
//       console.error("Deletion failed:", error);
//     }
//   };

//   return {
//     handleCreateFile,
//     handleCreateDirectory,
//     handleDeleteDirectory,
//     handleDeleteFile,
//   };
// };

import {
  createDirectory,
  createFile,
  deleteDirectory,
  deleteFile,
  copyFile,
  copyDirectory,
  moveFile,
  moveDirectory,
} from "../ipc";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addContent,
  deleteContent,
  updateDirectoryContents,
} from "../store/slices/currentDirectorySlice";
import { selectCurrentPath } from "../store/slices/navigationSlice";
import { EntityContextPayload } from "../types";
import { createDirectoryContent } from "../utils";
import {
  clearClipboard,
  ClipboardOperation,
  copyToClipboard,
  cutToClipboard,
  selectClipboardEntity,
  selectClipboardOperation,
} from "../store/slices/clipboardSlice";
import { openDirectory } from "../ipc";
// import path from "path-browserify";

export const useFileActions = () => {
  const dispatch = useAppDispatch();
  const currentPath = useAppSelector(selectCurrentPath);
  const clipboardEntity = useAppSelector(selectClipboardEntity);
  const clipboardOperation = useAppSelector(selectClipboardOperation);

  const handleCreateFile = async (name: string) => {
    try {
      const path = `${currentPath}/${name}`;
      await createFile(path);
      const newFileContent = createDirectoryContent("File", name, path);
      dispatch(addContent(newFileContent));
      console.log("Creating file:", name);
    } catch (error) {
      console.error("File creation failed:", error);
    }
  };

  const handleCreateDirectory = async (name: string) => {
    try {
      const path = `${currentPath}/${name}`;
      await createDirectory(path);

      const newDirectoryContent = createDirectoryContent(
        "Directory",
        name,
        path
      );

      dispatch(addContent(newDirectoryContent));
      console.log("Creating directory:", name);
    } catch (error) {
      console.error("Directory creation failed:", error);
    }
  };

  const handleDeleteDirectory = async (entity: EntityContextPayload) => {
    const confirmed = await confirm(`Delete ${entity.name}?`);
    if (!confirmed) return;

    try {
      await deleteDirectory(entity.path);
      const content = createDirectoryContent(
        entity.type,
        entity.name,
        entity.path
      );
      dispatch(deleteContent(content));
      console.log("Deleting directory:", entity.name);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const handleDeleteFile = async (entity: EntityContextPayload) => {
    const confirmed = await confirm(`Delete ${entity.name}?`);
    if (!confirmed) return;

    try {
      await deleteFile(entity.path);
      const content = createDirectoryContent(
        entity.type,
        entity.name,
        entity.path
      );
      dispatch(deleteContent(content));
      console.log("Deleting file:", entity.name);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const handleCopyEntity = (entity: EntityContextPayload) => {
    dispatch(copyToClipboard(entity));
    console.log("Copied to clipboard:", entity.name);
  };

  const handleCutEntity = (entity: EntityContextPayload) => {
    dispatch(cutToClipboard(entity));
    console.log("Cut to clipboard:", entity.name);
  };

  const handlePaste = async () => {
    if (!clipboardEntity) {
      console.log("Nothing in clipboard to paste");
      return;
    }

    const fileName = clipboardEntity.name;
    const destinationPath = `${currentPath}/${fileName}`;

    try {
      if (clipboardOperation === ClipboardOperation.COPY) {
        if (clipboardEntity.type === "File") {
          await copyFile(clipboardEntity.path, destinationPath);
        } else {
          await copyDirectory(clipboardEntity.path, destinationPath);
        }
        console.log(`Copied ${clipboardEntity.name} to ${currentPath}`);
      } else if (clipboardOperation === ClipboardOperation.CUT) {
        if (clipboardEntity.type === "File") {
          await moveFile(clipboardEntity.path, destinationPath);
        } else {
          await moveDirectory(clipboardEntity.path, destinationPath);
        }
        console.log(`Moved ${clipboardEntity.name} to ${currentPath}`);

        // Clear clipboard after cut-paste
        dispatch(clearClipboard());
      }

      // Refresh directory contents
      const contents = await openDirectory(currentPath);
      dispatch(updateDirectoryContents(contents));
    } catch (error) {
      console.error("Paste operation failed:", error);
    }
  };

  const handleDelete = async (entity: EntityContextPayload) => {
    if (entity.type === "File") {
      await handleDeleteFile(entity);
    } else {
      await handleDeleteDirectory(entity);
    }
  };

  return {
    handleCreateFile,
    handleCreateDirectory,
    handleDeleteDirectory,
    handleDeleteFile,
    handleCopyEntity,
    handleCutEntity,
    handlePaste,
    handleDelete,
  };
};
