use notify::event::CreateKind;
use tauri::State;

use crate::{errors::Error, state::SafeState};
use std::{
    fs::{self, read_dir},
    ops::Deref,
    path::Path,
};

use super::{fs_event_handlers::FsEventHandler, fs_utils, volume::DirectoryChild};

// Opens the directory at the given path and returns a list of its contents (files or subdirectories) as either `DirectoryChild::File` or `DirectoryChild::Directory`.
// If the directory can't be opened (e.g., it doesn't exist), it returns an empty list.
#[tauri::command]
pub async fn open_directory(path: String) -> Result<Vec<DirectoryChild>, ()> {
    let Ok(directory) = read_dir(path) else {
        return Ok(Vec::new());
    };
    Ok(directory
        .map(|entry| {
            let entry = entry.unwrap();
            let file_name = entry.file_name().to_string_lossy().to_string();
            let entry_is_file = entry.file_type().unwrap().is_file();
            let entry = entry.path().to_string_lossy().to_string();

            if entry_is_file {
                return DirectoryChild::File(file_name, entry);
            }

            DirectoryChild::Directory(file_name, entry)
        })
        .collect())
}

#[tauri::command]
pub async fn create_directory(state_mux: State<'_, SafeState>, path: String) -> Result<(), Error> {
    let mount_point_str = fs_utils::get_mount_point(&path).unwrap_or_default();

    let fs_event_manager = FsEventHandler::new(state_mux.deref().clone(), mount_point_str.into());
    fs_event_manager.handle_create(CreateKind::Folder, Path::new(&path));

    match fs::create_dir(&path) {
        Ok(_) => Ok(()),
        Err(err) => Err(Error::Custom(err.to_string())),
    }
}

#[tauri::command]
pub async fn delete_directory(state_mux: State<'_, SafeState>, path: String) -> Result<(), Error> {
    let mount_point_str = fs_utils::get_mount_point(&path).unwrap_or_default();

    let fs_event_manager = FsEventHandler::new(state_mux.deref().clone(), mount_point_str.into());
    fs_event_manager.handle_delete(Path::new(&path));

    match fs::remove_dir_all(&path) {
        Ok(_) => Ok(()),
        Err(err) => Err(Error::Custom(err.to_string())),
    }
}

#[tauri::command]
pub async fn open_file(path: String) -> Result<(), Error> {
    let output_res = open::commands(path)[0].output();
    let output = match output_res {
        Ok(output) => output,
        Err(err) => {
            let err_msg = format!("Failed to get open command output: {}", err);
            return Err(Error::Custom(err_msg));
        }
    };

    if output.status.success() {
        return Ok(());
    }

    let err_msg = String::from_utf8(output.stderr)
        .unwrap_or(String::from("Failed to open file and deserialize stderr."));
    Err(Error::Custom(err_msg))
}

#[tauri::command]
pub async fn create_file(state_mux: State<'_, SafeState>, path: String) -> Result<(), Error> {
    let mount_point_str = fs_utils::get_mount_point(&path).unwrap_or_default();

    let fs_event_manager = FsEventHandler::new(state_mux.deref().clone(), mount_point_str.into());
    fs_event_manager.handle_create(CreateKind::File, Path::new(&path));

    match fs::File::create(&path) {
        Ok(_) => Ok(()),
        Err(err) => Err(Error::Custom(err.to_string())),
    }
}

#[tauri::command]
pub async fn delete_file(state_mux: State<'_, SafeState>, path: String) -> Result<(), Error> {
    let mount_point_str = fs_utils::get_mount_point(&path).unwrap_or_default();

    let fs_event_manager = FsEventHandler::new(state_mux.deref().clone(), mount_point_str.into());
    fs_event_manager.handle_delete(Path::new(&path));

    match fs::remove_file(&path) {
        Ok(_) => Ok(()),
        Err(err) => Err(Error::Custom(err.to_string())),
    }
}
