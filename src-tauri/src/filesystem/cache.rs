use std::{ fs::{ self, File }, io::{ BufReader, Write }, sync::MutexGuard, time::Instant };

use lazy_static::lazy_static;

use crate::{ AppState, SafeState };

lazy_static! {
    pub static ref CACHE_FILE_PATH: String = {
        let mut cache_path = dirs::cache_dir().expect("Failed to get base cache path");
        cache_path.push(format!("{}.cache.bin", env!("CARGO_PKG_NAME")));
        cache_path.to_string_lossy().to_string()
    };
}

pub fn load_system_cache(state_mux: &SafeState) -> bool {
    let start_time = Instant::now();

    let state = &mut state_mux.lock().expect("Mutex lock failed");
    let cache_file = File::open(&CACHE_FILE_PATH[..]).expect("Failed to open cache file");
    let reader = BufReader::new(cache_file);

    if let Ok(decompressed) = zstd::decode_all(reader) {
        println!("Deserializing.....");

        let deserialize_result = serde_bencode::from_bytes(&decompressed[..]);

        if let Ok(system_cache) = deserialize_result {
            state.system_cache = system_cache;
            let elapsed_time = start_time.elapsed();
            println!("Cache deserialization completed in {:.2?}", elapsed_time);
            println!("Successfully deserialized");

            return true;
        }
    }

    println!("Failed to deserialize the cache from disk, recaching...");

    false
}

pub fn save_to_cache(state: &mut MutexGuard<AppState>) {
    let serialized_cache = serde_bencode::to_string(&state.system_cache).unwrap();

    let mut file = fs::OpenOptions
        ::new()
        .write(true)
        .truncate(true)
        .open(&CACHE_FILE_PATH[..])
        .unwrap();

    file.write_all(
        &zstd
            ::encode_all(serialized_cache.as_bytes(), 0)
            .expect("Failed to compress cache contents")[..]
    ).unwrap();
}

pub fn save_system_cache(state_mux: &SafeState) {
    let state = &mut state_mux.lock().unwrap();
    save_to_cache(state);
}
