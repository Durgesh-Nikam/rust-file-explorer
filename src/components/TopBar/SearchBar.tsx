import { Search, X } from "lucide-react";
import SearchFilter from "./SearchFilter";
import { useState } from "react";

const SearchBar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setShowAdvancedSearch(false);
    }
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
          placeholder="Search files and folders..."
          className="w-full bg-gray-700 px-3 py-2 text-sm focus:outline-none rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
      <div>{showAdvancedSearch && isSearchExpanded && <SearchFilter />}</div>
    </div>
  );
};

export default SearchBar;
