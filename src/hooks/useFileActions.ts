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

  const handleRename = async (
    entity: EntityContextPayload,
    newName: string
  ) => {
    try {
      // const newPath = `${entity.path
      //   .split("/")
      //   .slice(0, -1)
      //   .join("/")}/${newName}`;
      // await renameFile(entity.path, newPath);
      // dispatch(renameContent({ oldPath: entity.path, newPath }));
      console.log("Renaming file:", entity.name, "to", newName);
    } catch (error) {
      console.error("Rename failed:", error);
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
      console.log("Deleting file:", entity.name);
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

  return {
    handleCreateFile,
    handleCreateDirectory,
    handleRename,
    handleDeleteDirectory,
    handleDeleteFile,
  };
};
