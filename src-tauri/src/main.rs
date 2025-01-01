// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
//! Removing this line at the moment for logging purpose during development
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod filesystem;
mod errors;
use std::{ collections::HashMap, sync::{ Arc, Mutex } };

use filesystem::{ explorer::{ open_directory, open_file }, volume::get_volumes };
use serde::{ Deserialize, Serialize };

#[derive(Serialize, Deserialize)]
pub struct CachedPath {
    #[serde(rename = "p")]
    file_path: String,
    #[serde(rename = "t")]
    file_type: String,
}

pub type VolumeCache = HashMap<String, Vec<CachedPath>>;

#[derive(Default)]
pub struct AppState {
    system_cache: HashMap<String, VolumeCache>,
}

pub type SafeState = Arc<Mutex<AppState>>;

#[tokio::main]
async fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![get_volumes, open_directory, open_file])
        .manage(Arc::new(Mutex::new(AppState::default())))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
