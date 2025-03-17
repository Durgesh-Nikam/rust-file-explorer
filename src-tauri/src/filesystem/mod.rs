pub mod cache;
pub mod explorer;
pub mod fs_event_handlers;
pub mod fs_utils;
pub mod volume;

pub const DIRECTORY: &str = "directory";
pub const FILE: &str = "file";
pub const BYTES_PER_GB: u64 = 1_000_000_000;

pub const fn bytes_to_gb(bytes: u64) -> u16 {
    (bytes / BYTES_PER_GB) as u16
}
