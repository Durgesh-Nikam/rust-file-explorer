use std::{
    collections::HashMap,
    fs::{ self, File },
    io::{ BufReader, Write },
    path::Path,
    sync::MutexGuard,
    time::Instant,
};

use lazy_static::lazy_static;

use crate::state::{ AppState, SafeState, VolumeCache };

lazy_static! {
    pub static ref CACHE_FILE_PATH: String = Cache::get_cache_file_path();
}

pub struct Cache;

impl Cache {
    fn get_cache_file_path() -> String {
        let mut cache_path = dirs::cache_dir().expect("Failed to get base cache path");
        cache_path.push(format!("{}.cache.bin", env!("CARGO_PKG_NAME")));
        cache_path.to_string_lossy().to_string()
    }

    pub fn initialize(state_mux: &SafeState) -> bool {
        if !Path::new(&*CACHE_FILE_PATH).exists() {
            File::create(&*CACHE_FILE_PATH).unwrap();
            return false;
        }
        Self::load_system_cache(state_mux)
    }

    pub fn load_system_cache(state_mux: &SafeState) -> bool {
        let start_time = Instant::now();
        let state = &mut state_mux.lock().expect("Mutex lock failed");

        match Self::read_and_decode_cache() {
            Ok(system_cache) => {
                Self::update_state_cache(state, system_cache, start_time);
                true
            }
            Err(()) => {
                println!("Failed to deserialize the cache from disk, recaching...");
                false
            }
        }
    }

    fn read_and_decode_cache() -> Result<HashMap<String, VolumeCache>, ()> {
        let cache_file = File::open(&*CACHE_FILE_PATH).map_err(|_| ())?;
        let reader = BufReader::new(cache_file);
        let decompressed = zstd::decode_all(reader).map_err(|_| ())?;
        serde_bencode::from_bytes(&decompressed).map_err(|_| ())
    }

    fn update_state_cache(
        state: &mut MutexGuard<AppState>,
        system_cache: HashMap<String, VolumeCache>,
        start_time: Instant
    ) {
        println!("Starting Cache deserialization");
        state.system_cache = system_cache;
        let elapsed_time = start_time.elapsed();
        println!("Cache deserialization completed in {:.2?}", elapsed_time);
        println!("Successfully deserialized");
    }

    pub fn save_system_cache(state_mux: &SafeState) {
        let state = &mut state_mux.lock().unwrap();
        Self::save_to_cache(state);
    }

    fn save_to_cache(state: &mut MutexGuard<AppState>) {
        let serialized_cache = Self::serialize_cache(state);
        Self::write_cache_to_file(&serialized_cache);
    }

    fn serialize_cache(state: &AppState) -> String {
        serde_bencode::to_string(&state.system_cache).expect("Failed to serialize cache")
    }

    fn write_cache_to_file(serialized_cache: &str) {
        let compressed = Self::compress_cache(serialized_cache);
        let mut file = Self::open_cache_file();
        file.write_all(&compressed).expect("Failed to write cache to file");
    }

    fn compress_cache(serialized_cache: &str) -> Vec<u8> {
        zstd::encode_all(serialized_cache.as_bytes(), 0).expect("Failed to compress cache contents")
    }

    fn open_cache_file() -> File {
        fs::OpenOptions
            ::new()
            .write(true)
            .truncate(true)
            .open(&*CACHE_FILE_PATH)
            .expect("Failed to open cache file")
    }
}
