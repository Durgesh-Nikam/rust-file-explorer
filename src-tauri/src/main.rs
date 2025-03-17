// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
//! Removing this line at the moment for logging purpose during development
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod errors;
mod filesystem;
mod search;
mod state;

use filesystem::{
    explorer::{create_directory, open_directory, open_file},
    volume::get_volumes,
};
use search::search_directory;
use state::AppState;
use std::sync::{Arc, Mutex};

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_volumes,
            open_directory,
            open_file,
            create_directory,
            search_directory
        ])
        .manage(Arc::new(Mutex::new(AppState::default())))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
