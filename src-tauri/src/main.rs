// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod filesystem;

use filesystem::volume::get_volumes;

#[tokio::main]
async fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![get_volumes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
