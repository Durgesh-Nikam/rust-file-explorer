pub mod explorer;
pub mod volume;
pub mod cache;

pub const DIRECTORY: &str = "directory";
pub const FILE: &str = "file";

pub const fn bytes_to_gb(bytes: u64) -> u16 {
    (bytes / (1e9 as u64)) as u16
}
