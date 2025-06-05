import {
  createDirectory,
  createFile,
  deleteDirectory,
  deleteFile,
} from "../ipc";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addContent,
  deleteContent,
} from "../store/slices/currentDirectorySlice";
import { selectCurrentPath } from "../store/slices/navigationSlice";
import { EntityContextPayload } from "../types";
import { createDirectoryContent } from "../utils";

export const useFileActions = () => {
  const dispatch = useAppDispatch();
  const currentPath = useAppSelector(selectCurrentPath);

  // const handleCreateFile = async (name: string) => {
  //   try {
  //     const path = `${currentPath}/${name}`;
  //     await createFile(path);
  //     const newFileContent = createDirectoryContent("File", name, path);
  //     dispatch(addContent(newFileContent));
  //     console.log("Creating file:", name);
  //   } catch (error) {
  //     console.error("File creation failed:", error);
  //   }
  // };

  // const handleCreateDirectory = async (name: string) => {
  //   try {
  //     const path = `${currentPath}/${name}`;
  //     await createDirectory(path);

  //     const newDirectoryContent = createDirectoryContent(
  //       "Directory",
  //       name,
  //       path
  //     );

  //     dispatch(addContent(newDirectoryContent));
  //     console.log("Creating directory:", name);
  //   } catch (error) {
  //     console.error("Directory creation failed:", error);
  //   }
  // };

  const handleCreateFile = async (name: string) => {
    console.log("Attempting to create file:", name);
    console.log("Current path:", currentPath);
    try {
      const path = `${currentPath}/${name}`;
      console.log("Full file path:", path);

      await createFile(path);
      console.log("File creation IPC call successful");

      const newFileContent = createDirectoryContent("File", name, path);
      console.log("New file content:", newFileContent);

      dispatch(addContent(newFileContent));
      console.log("File creation dispatch successful");
    } catch (error) {
      console.error("File creation failed:", error);
    }
  };

  const handleCreateDirectory = async (name: string) => {
    console.log("Attempting to create directory:", name);
    console.log("Current path:", currentPath);
    try {
      const path = `${currentPath}/${name}`;
      console.log("Full directory path:", path);

      await createDirectory(path);
      console.log("Directory creation IPC call successful");

      const newDirectoryContent = createDirectoryContent(
        "Directory",
        name,
        path
      );
      console.log("New directory content:", newDirectoryContent);

      dispatch(addContent(newDirectoryContent));
      console.log("Directory creation dispatch successful");
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
    handleDelete,
  };
};
