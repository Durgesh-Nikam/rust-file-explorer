import { DirectoryContent, DirectoryContentType } from "./types";

export function createDirectoryContent(
  type: DirectoryContentType,
  name: string,
  path: string
): DirectoryContent {
  return { [type]: [name, path] };
}
