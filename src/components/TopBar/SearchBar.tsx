import { Search, X } from "lucide-react";
import SearchFilter from "./SearchFilter";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DirectoryContent } from "../../types";
import { invoke } from "@tauri-apps/api";

interface Props {
  currentVolume: string;
  currentDirectoryPath: string;
  setSearchResults: Dispatch<SetStateAction<DirectoryContent[]>>;
}

export interface ISearchFilter {
  extension: string;
  acceptFiles: boolean;
  acceptDirectories: boolean;
}

const SearchBar = ({
  currentVolume,
  currentDirectoryPath,
  setSearchResults,
}: Props) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlace, setCurrentPlace] = useState<string | undefined>();
  const [searchFilter, setSeachFilter] = useState<ISearchFilter>({
    extension: "",
    acceptFiles: true,
    acceptDirectories: true,
  });

  useEffect(() => {
    const split = currentDirectoryPath.split("\\");
    setCurrentPlace(split[split.length - 2]);
  }, [currentDirectoryPath]);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setShowAdvancedSearch(false);
    }
  };

  const handleSearch = async () => {
    if (currentVolume.length === 0) {
      alert("Please select a volume before searching.");
      return;
    }

    const results = await invoke<DirectoryContent[]>("search_directory", {
      query: searchQuery,
      searchDirectory: currentDirectoryPath,
      mountPoint: currentVolume,
      extension: searchFilter.extension,
      acceptFiles: searchFilter.acceptFiles,
      acceptDirectories: searchFilter.acceptDirectories,
    });

    setSearchResults(results);
  };

  return (
    <div className="relative flex items-center">
      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ${
          isSearchExpanded ? "w-72" : "w-0"
        }`}
      >
        <input
          type="text"
          placeholder={`Search ${currentPlace || "PC"}...`}
          className="w-full bg-gray-700 px-3 py-2 text-sm focus:outline-none rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              alert("searching");
              handleSearch();
            }
          }}
        />
        <button
          className="ml-2 rounded bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-700"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        >
          Advanced
        </button>
      </div>
      <button
        onClick={toggleSearch}
        className="ml-2 rounded-full p-2 text-whit hover:bg-gray-700 hover:text-gray-100 bg-blue-600"
        aria-label={isSearchExpanded ? "Close search" : "Open search"}
      >
        {isSearchExpanded ? (
          <X className="h-5 w-5" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </button>
      <div>
        {showAdvancedSearch && isSearchExpanded && (
          <SearchFilter filters={searchFilter} setFilters={setSeachFilter} />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
