import Input from "../../ui/Input";
import SearchFilter from "./SearchFilter";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="search-container">
      <div className="flex items-center">
        <FaSearch size={23} color="#dcdcdc" style={{ margin: 6 }} />
        <Input />
        <button onClick={() => setShowSearch(!showSearch)} className="advance">
          {"Advance Search"}
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
