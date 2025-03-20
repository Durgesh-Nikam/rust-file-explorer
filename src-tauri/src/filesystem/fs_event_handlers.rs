use std::path::{Path, PathBuf};

use notify::{
    event::{CreateKind, ModifyKind, RenameMode},
    Event,
};

use crate::state::{AppState, CachedPath, SafeState};

use super::{DIRECTORY, FILE};

pub struct FsEventHandler {
    state_mux: SafeState,
    mountpoint: PathBuf,
}

impl FsEventHandler {
    pub fn new(state_mux: SafeState, mountpoint: PathBuf) -> Self {
        Self {
            state_mux,
            mountpoint,
        }
    }

    fn get_from_cache<'a>(&self, state: &'a mut AppState) -> &'a mut crate::state::VolumeCache {
        let mountpoint_str = self.mountpoint.to_string_lossy().to_string();

        state
            .system_cache
            .get_mut(&mountpoint_str)
            .unwrap_or_else(|| {
                panic!(
                    "Failed to find mountpoint '{:?}' in cache.",
                    self.mountpoint
                )
            })
    }

    pub fn handle_create(&self, kind: CreateKind, path: &Path) {
        let state = &mut self.state_mux.lock().unwrap();
        let current_volume = self.get_from_cache(state);

        let filename = path.file_name().unwrap().to_string_lossy().to_string();
        let file_type = (match kind {
            CreateKind::File => FILE,
            CreateKind::Folder => DIRECTORY,
            _ => {
                return;
            } // Ignore other types of files
        })
        .to_string();

        let file_path = path.to_string_lossy().to_string();
        current_volume.entry(filename).or_insert_with(|| {
            vec![CachedPath {
                file_path,
                file_type,
            }]
        });
    }

    pub fn handle_delete(&self, path: &Path) {
        let state = &mut self.state_mux.lock().unwrap();
        let current_volume = self.get_from_cache(state);

        let filename = path.file_name().unwrap().to_string_lossy().to_string();
        current_volume.remove(&filename);
    }

    /// Removes file from cache, when `handle_rename_to` is called a new file is added to the cache in place.
    pub fn handle_rename_from(&mut self, old_path: &Path) {
        let state = &mut self.state_mux.lock().unwrap();
        let current_volume = self.get_from_cache(state);

        let old_path_string = old_path.to_string_lossy().to_string();
        let old_filename = old_path.file_name().unwrap().to_string_lossy().to_string();

        let empty_vec = &mut Vec::new();
        let cached_paths = current_volume.get_mut(&old_filename).unwrap_or(empty_vec);

        // If there is only one item in the cached paths, remove it from the hashmap
        if cached_paths.len() <= 1 {
            current_volume.remove(&old_filename);
            return;
        }

        cached_paths.retain(|path| path.file_path != old_path_string);
    }

    /// Adds new file name & path to cache.
    pub fn handle_rename_to(&self, new_path: &Path) {
        let state = &mut self.state_mux.lock().unwrap();
        let current_volume = self.get_from_cache(state);

        let filename = new_path.file_name().unwrap().to_string_lossy().to_string();
        let file_type = if new_path.is_dir() { DIRECTORY } else { FILE };

        let path_string = new_path.to_string_lossy().to_string();
        current_volume.entry(filename).or_insert_with(|| {
            vec![CachedPath {
                file_path: path_string,
                file_type: String::from(file_type),
            }]
        });
    }

    pub fn handle_event(&mut self, event: Event) {
        let paths = event.paths;

        match event.kind {
            notify::EventKind::Modify(modify_kind) => {
                if modify_kind == ModifyKind::Name(RenameMode::From) {
                    self.handle_rename_from(&paths[0]);
                } else if modify_kind == ModifyKind::Name(RenameMode::To) {
                    self.handle_rename_to(&paths[0]);
                }
            }
            notify::EventKind::Create(kind) => self.handle_create(kind, &paths[0]),
            notify::EventKind::Remove(_) => self.handle_delete(&paths[0]),
            _ => (),
        }
    }
}
