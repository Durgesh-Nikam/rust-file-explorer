import { invoke } from "@tauri-apps/api/tauri";
import { DirectoryContent, Volume } from "./types";
import { ISearchFilter } from "./components/TopBar/SearchBar";

export const openDirectory = async (
  path: string
): Promise<DirectoryContent[]> => {
  return invoke("open_directory", { path });
};

export const createDirectory = async (path: string): Promise<string> => {
  return invoke<string>("create_directory", { path });
};

export const deleteDirectory = async (path: string): Promise<string> => {
  return invoke<string>("delete_directory", { path });
};

export const openFile = async (path: string): Promise<void> => {
  return invoke<void>("open_file", { path });
};

export const createFile = async (path: string): Promise<void> => {
  return invoke<void>("create_file", { path });
};

export const deleteFile = async (path: string): Promise<void> => {
  return invoke<void>("delete_file", { path });
};

export const getVolumes = async (): Promise<Volume[]> => {
  return invoke("get_volumes");
};

export const searchDirectory = async (
  searchQuery: string,
  currentDirectoryPath: string,
  currentVolume: string,
  searchFilter: ISearchFilter
): Promise<DirectoryContent[]> => {
  return invoke<DirectoryContent[]>("search_directory", {
    query: searchQuery,
    searchDirectory: currentDirectoryPath,
    mountPoint: currentVolume,
    extension: searchFilter.extension,
    acceptFiles: searchFilter.acceptFiles,
    acceptDirectories: searchFilter.acceptDirectories,
  });
};
