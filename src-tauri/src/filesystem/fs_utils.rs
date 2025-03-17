use std::path::{Path, PathBuf};

pub fn get_mount_point(path: impl AsRef<Path>) -> Option<String> {
    let path = path.as_ref();
    let root = path.components().next()?;
    let mount_point = root.as_os_str().to_string_lossy().into_owned();

    let mut mount_point_path = PathBuf::new();
    mount_point_path.push(&mount_point);
    mount_point_path.push("\\");
    Some(mount_point_path.to_string_lossy().into_owned())
}
