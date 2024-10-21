import { invoke } from "@tauri-apps/api/tauri";
import { DirectoryContent, Volume } from "./types";

export const openDirectory = async (
  path: string
): Promise<DirectoryContent[]> => {
  return invoke("open_directory", { path });
};
export const openFile = async (path: string): Promise<string> => {
  return invoke<string>("open_file", { path });
};

export const getVolumes = async (): Promise<Volume[]> => {
  return invoke("get_volumes");
};
