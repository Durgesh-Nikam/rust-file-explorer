import { invoke } from "@tauri-apps/api/tauri";
import { DirectoryContent } from "./types";

export const openDirectory = async (
  path: string
): Promise<DirectoryContent[]> => {
  return invoke("open_directory", { path });
};
