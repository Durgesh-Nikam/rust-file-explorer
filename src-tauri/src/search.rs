use std::{ path::Path, time::Instant };

use fuzzy_matcher::{ skim::SkimMatcherV2, FuzzyMatcher };
use tauri::State;

use crate::{
    filesystem::{ volume::DirectoryChild, DIRECTORY, FILE },
    state::{ SafeState, VolumeCache },
};

const MINIMUM_SCORE: i16 = 20;
const EXACT_MATCH_SCORE: i16 = 1000;
struct SearchResult {
    item: DirectoryChild,
    score: i16,
}

struct SearchConfig {
    query: String,
    search_directory: String,
    extension: String,
    accept_files: bool,
    accept_directories: bool,
}

struct SearchEngine {
    matcher: SkimMatcherV2,
    config: SearchConfig,
    results: Vec<SearchResult>,
}

impl SearchEngine {
    fn new(config: SearchConfig) -> Self {
        Self {
            matcher: SkimMatcherV2::default().smart_case(),
            config,
            results: Vec::new(),
        }
    }

    fn score_filename(&self, filename: &str) -> i16 {
        if filename == self.config.query {
            return EXACT_MATCH_SCORE;
        }
        self.matcher.fuzzy_match(filename, &self.config.query).unwrap_or(0) as i16
    }

    fn check_extension(&self, filename: &str) -> bool {
        if self.config.extension.is_empty() {
            return true;
        }
        filename.ends_with(self.config.extension.as_str())
    }

    fn process_file(&mut self, filename: &str, file_path: &str) {
        if !self.config.accept_files || !self.check_extension(filename) {
            return;
        }

        let filename_path = Path::new(filename);
        let cleaned_filename = filename_path
            .file_stem()
            .and_then(|stem| stem.to_str())
            .unwrap_or("");

        let score = self.score_filename(cleaned_filename);
        if score < MINIMUM_SCORE {
            return;
        }

        self.results.push(SearchResult {
            item: DirectoryChild::File(filename.to_string(), file_path.to_string()),
            score,
        });
    }

    fn process_directory(&mut self, filename: &str, file_path: &str) {
        if !self.config.accept_directories {
            return;
        }

        let score = self.score_filename(filename);
        if score < MINIMUM_SCORE {
            return;
        }

        self.results.push(SearchResult {
            item: DirectoryChild::Directory(filename.to_string(), file_path.to_string()),
            score,
        });
    }

    fn search_cache(&mut self, system_cache: &VolumeCache) {
        for (filename, paths) in system_cache {
            for path in paths {
                if !path.file_path.starts_with(&self.config.search_directory) {
                    continue;
                }

                if path.file_type == FILE {
                    self.process_file(filename, &path.file_path);
                } else if path.file_type == DIRECTORY {
                    self.process_directory(filename, &path.file_path);
                }
            }
        }
    }

    fn get_sorted_results(mut self) -> Vec<DirectoryChild> {
        self.results.sort_by(|a, b| b.score.cmp(&a.score));
        self.results
            .into_iter()
            .map(|r| r.item)
            .collect()
    }
}

#[tauri::command]
pub async fn search_directory(
    state_mux: State<'_, SafeState>,
    query: String,
    search_directory: String,
    mount_point: String,
    extension: String,
    accept_files: bool,
    accept_directories: bool
) -> Result<Vec<DirectoryChild>, ()> {
    let start_time = Instant::now();

    let config = SearchConfig {
        query: query.to_lowercase(),
        search_directory,
        extension,
        accept_files,
        accept_directories,
    };

    println!("Starting the Search for {} in {}", config.query, config.search_directory);
    let mut search_engine = SearchEngine::new(config);

    {
        let state = state_mux.lock().unwrap();
        let system_cache = state.system_cache.get(&mount_point).ok_or(())?;
        search_engine.search_cache(system_cache);
    }

    let results = search_engine.get_sorted_results();

    let elapsed_time = start_time.elapsed();
    println!("Search completed in {:.2?}", elapsed_time);

    Ok(results)
}
