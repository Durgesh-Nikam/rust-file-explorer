import Input from "../../ui/Input";
import SearchFilter from "./SearchFilter";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="search-container">
      <div className="flex items-center">
        <FaSearch size={22} color="#dcdcdc" className="m-1" />
        <Input />
        <button onClick={() => setShowSearch(!showSearch)} className="advance">
          {"Advance"}
        </button>
      </div>
      {showSearch && (
        <>
          <SearchFilter />
        </>
      )}
    </div>
  );
};

export default SearchBar;
