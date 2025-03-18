export interface Volume {
  name: string;
  mountpoint: string;
  available_gb: number;
  used_gb: number;
  total_gb: number;
}

export type DirectoryContentType = "File" | "Directory";

export interface DirectoryContent {
  [key: string]: [string, string]; // Key will be either "Directory" or "File"
}

export enum ContextMenuType {
  None,
  Main,
  FileEntity,
  DirectoryEntity,
}

export type ContextMenuItem = {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
};

export type ContextMenuPosition = {
  x: number;
  y: number;
};

export type EntityContextPayload = {
  path: string;
  name: string;
  type: DirectoryContentType;
};
