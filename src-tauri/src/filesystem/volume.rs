use serde::{ Deserialize, Serialize };
use std::path::PathBuf;
use sysinfo::{ Disk, DiskExt, System, SystemExt };

use crate::filesystem::bytes_to_gb;

#[derive(Serialize)]
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
}

#[tauri::command]
pub async fn get_volumes() -> Result<Vec<Volume>, ()> {
    let mut sys = System::new_all();
    sys.refresh_all();

    let volumes = sys
        .disks()
        .iter()
        .map(|disk| {
            let volume = Volume::from(disk);
            volume
        })
        .collect();

    Ok(volumes)
}
