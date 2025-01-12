use rayon::iter::{ ParallelBridge, ParallelIterator };
use serde::{ Deserialize, Serialize };
use tauri::State;
use walkdir::WalkDir;
use std::{ collections::HashMap, path::PathBuf, time::Instant };
use sysinfo::{ Disk, DiskExt, System, SystemExt };

use crate::{ filesystem::bytes_to_gb, state::{ CachedPath, SafeState } };

use super::{ cache::Cache, DIRECTORY, FILE };

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
    pub fn from(disk: &Disk) -> Self {
        let total_gb = bytes_to_gb(disk.total_space());
        let available_gb = bytes_to_gb(disk.available_space());
        let used_bytes = disk.total_space() - disk.available_space();
        let used_gb = bytes_to_gb(used_bytes);
        let name = Self::format_volume_name(disk.name().to_str().unwrap());
        let mountpoint = disk.mount_point().to_path_buf();

        Self {
            name,
            available_gb,
            used_gb,
            total_gb,
            mountpoint,
        }
    }

    fn format_volume_name(volume_name: &str) -> String {
        if volume_name.is_empty() { "Local Volume".to_string() } else { volume_name.to_string() }
    }

    pub fn create_cache(&self, state_mux: &SafeState) {
        println!("Creating cache for volume: {}", self.name);
        let start_time = Instant::now();

        let entries = self.collect_filesystem_entries();
        self.store_entries_in_cache(entries, state_mux);

        let elapsed_time = start_time.elapsed();
        println!("Cache creation for volume {} completed in {:.2?}", self.name, elapsed_time);
    }

    fn collect_filesystem_entries(&self) -> Vec<(String, CachedPath)> {
        WalkDir::new(&self.mountpoint)
            .into_iter()
            .par_bridge()
            .filter_map(Result::ok)
            .map(|entry| self.create_cache_entry(&entry))
            .collect()
    }

    fn store_entries_in_cache(&self, entries: Vec<(String, CachedPath)>, state_mux: &SafeState) {
        let mut state = state_mux.lock().unwrap();
        let volume_cache = state.system_cache
            .entry(self.mountpoint.to_string_lossy().to_string())
            .or_insert_with(HashMap::new);

        for (file_name, cached_path) in entries {
            volume_cache.entry(file_name).or_insert_with(Vec::new).push(cached_path);
        }
    }

    fn create_cache_entry(&self, entry: &walkdir::DirEntry) -> (String, CachedPath) {
        let file_name = entry.file_name().to_string_lossy().to_string();
        let file_path = entry.path().to_string_lossy().to_string();
        let file_type = (if entry.file_type().is_dir() { DIRECTORY } else { FILE }).to_string();

        (file_name, CachedPath { file_path, file_type })
    }
}

pub struct VolumeManager;

impl VolumeManager {
    pub fn get_system_volumes() -> Vec<Volume> {
        let mut sys = System::new_all();
        sys.refresh_all();
        sys.disks().iter().map(Volume::from).collect()
    }

    pub fn process_volumes(volumes: &[Volume], state_mux: &SafeState) {
        if !Cache::initialize(state_mux) {
            Self::create_volumes_cache(volumes, state_mux);
        }
        Cache::save_system_cache(state_mux);
    }

    fn create_volumes_cache(volumes: &[Volume], state_mux: &SafeState) {
        for volume in volumes {
            println!("Processing volume: {:?}", volume);
            volume.create_cache(state_mux);
        }
    }
}

#[tauri::command]
pub async fn get_volumes(state_mux: State<'_, SafeState>) -> Result<Vec<Volume>, ()> {
    let volumes = VolumeManager::get_system_volumes();
    VolumeManager::process_volumes(&volumes, &state_mux);
    Ok(volumes)
}
