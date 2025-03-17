use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CachedPath {
    #[serde(rename = "p")]
    pub(crate) file_path: String,
    #[serde(rename = "t")]
    pub(crate) file_type: String,
}

pub type VolumeCache = HashMap<String, Vec<CachedPath>>;

#[derive(Default)]
pub struct AppState {
    pub system_cache: HashMap<String, VolumeCache>,
}

pub type SafeState = Arc<Mutex<AppState>>;
