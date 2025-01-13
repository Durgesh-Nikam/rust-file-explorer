import { ISearchFilter } from "./SearchBar";

interface Props {
  filters: ISearchFilter;
  setFilters: React.Dispatch<React.SetStateAction<ISearchFilter>>;
}

const SearchFilter = ({ filters, setFilters }: Props) => {
  return (
    <div className="absolute right-0 top-full mt-2 mr-11 w-72 rounded-lg bg-gray-700 p-4 shadow-lg">
      <div className="mb-2">
        <label
          htmlFor="extension"
          className="block text-sm mb-2 font-medium text-gray-400"
        >
          Extension
        </label>
        <input
          id="extension"
          type="text"
          className="w-full rounded bg-gray-600 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder=".pdf, .txt, etc."
          value={filters.extension}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, extension: e.target.value }))
          }
        />
      </div>
      <div className="flex items-center mb-2">
        <input
          id="files"
          type="checkbox"
          className="mr-2"
          checked={filters.acceptFiles}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, acceptFiles: e.target.checked }))
          }
        />
        <label htmlFor="files" className="text-sm">
          Files
        </label>
      </div>
      <div className="flex items-center">
        <input
          id="folders"
          type="checkbox"
          className="mr-2"
          checked={filters.acceptDirectories}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              acceptDirectories: e.target.checked,
            }))
          }
        />
        <label htmlFor="folders" className="text-sm">
          Folders
        </label>
      </div>
    </div>
  );
};

export default SearchFilter;
