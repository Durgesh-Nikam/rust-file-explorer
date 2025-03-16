import { useAppDispatch } from "../store/hooks";
import { EntityContextPayload } from "../types";

export const useFileActions = () => {
  const dispatch = useAppDispatch();

  const handleCreateFile = async (name: string) => {
    try {
      // const path = `${currentPath}/${name}`;
      // await createFile(path);
      // dispatch(addContent({ type: "file", name, path }));
      console.log("Creating file:", name);
    } catch (error) {
      console.error("File creation failed:", error);
    }
  };

  const handleCreateDirectory = async (name: string) => {
    try {
      // const path = `${currentPath}/${name}`;
      // await createDirectory(path);
      // dispatch(addContent({ type: "directory", name, path }));
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

  const handleDelete = async (entity: EntityContextPayload) => {
    const confirmed = await confirm(`Delete ${entity.name}?`);
    if (!confirmed) return;

    try {
      // await deleteFile(entity.path);
      // dispatch(deleteContent(entity.path));
      console.log("Deleting file:", entity.name);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  return {
    handleCreateFile,
    handleCreateDirectory,
    handleRename,
    handleDelete,
  };
};
