use rayon::iter::{ ParallelBridge, ParallelIterator };
use serde::{ Deserialize, Serialize };
use tauri::State;
use walkdir::WalkDir;
use std::{
    collections::HashMap,
    fs::{ self, File },
    path::PathBuf,
    sync::{ Arc, Mutex },
    time::Instant,
};
use sysinfo::{ Disk, DiskExt, System, SystemExt };

use crate::{ filesystem::bytes_to_gb, CachedPath, SafeState };

use super::{ cache::{ load_system_cache, save_system_cache, CACHE_FILE_PATH }, DIRECTORY, FILE };

#[derive(Serialize, Debug)]
pub struct Volume {
    name: String,
    mountpoint: PathBuf,
    available_gb: u16,
    used_gb: u16,
    total_gb: u16,
}

#[derive(Serialize, Deserialize, Clone)]
pub enum DirectoryChild {
    File(String, String),
    Directory(String, String),
}

impl Volume {
    fn from(disk: &Disk) -> Self {
        let total_gb = bytes_to_gb(disk.total_space());
        let available_gb = bytes_to_gb(disk.available_space());
        let used_bytes = disk.total_space() - disk.available_space();
        let used_gb = bytes_to_gb(used_bytes);

        let name = {
            let volume_name = disk.name().to_str().unwrap();
            (
                match volume_name.is_empty() {
                    true => "Local Volume",
                    false => volume_name,
                }
            ).to_string()
        };

        let mountpoint = disk.mount_point().to_path_buf();

        Self {
            name,
            available_gb,
            used_gb,
            total_gb,
            mountpoint,
        }
    }

    fn create_cache(&self, state_mux: &SafeState) {
        println!("Creating cache...");

        let start_time = Instant::now();

        let state = &mut state_mux.lock().unwrap();

        let volume = state.system_cache
            .entry(self.mountpoint.to_string_lossy().to_string())
            .or_insert_with(HashMap::new);

        let system_cache = Arc::new(Mutex::new(volume));

        WalkDir::new(self.mountpoint.clone())
            .into_iter()
            .par_bridge()
            .filter_map(Result::ok)
            .for_each(|entry| {
                let file_name = entry.file_name().to_string_lossy().to_string();
                let file_path = entry.path().to_string_lossy().to_string();

                let walkdir_filetype = entry.file_type();
                let file_type = (
                    if walkdir_filetype.is_dir() {
                        DIRECTORY
                    } else {
                        FILE
                    }
                ).to_string();

                let cache_guard = &mut system_cache.lock().unwrap();
                cache_guard
                    .entry(file_name)
                    .or_insert_with(Vec::new)
                    .push(CachedPath { file_path, file_type });
            });

        let elapsed_time = start_time.elapsed();
        println!("Cache creation for volume {} completed in {:.2?}", self.name, elapsed_time);
    }
}

#[tauri::command]
pub async fn get_volumes(state_mux: State<'_, SafeState>) -> Result<Vec<Volume>, ()> {
    let mut sys = System::new_all();
    sys.refresh_all();

    let mut cache_exists = fs::metadata(&CACHE_FILE_PATH[..]).is_ok();
    if cache_exists {
        cache_exists = load_system_cache(&state_mux);
    } else {
        File::create(&CACHE_FILE_PATH[..]).unwrap();
    }

    let volumes = sys
        .disks()
        .iter()
        .map(|disk| {
            let volume = Volume::from(disk);
            println!("{:?}", volume);

            if !cache_exists {
                volume.create_cache(&state_mux);
            }

            volume
        })
        .collect();

    save_system_cache(&state_mux);

    Ok(volumes)
}
