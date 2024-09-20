import Input from "../../ui/Input";
import SearchFilter from "./SearchFilter";

const SearchBar = () => {
  return (
    <div className="absolute right-4 top-4">
      <Input />
      <SearchFilter />
    </div>
  );
};

export default SearchBar;
