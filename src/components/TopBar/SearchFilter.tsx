import Input from "../../ui/Input";

const SearchFilter = () => {
  return (
    <div className="flex items-center mt-2 gap-3">
      <div className="ml-2">
        <label>Extension</label>
        <Input />
      </div>
      <div>
        <input className="mr-2" type="checkbox" />
        <label>Files</label>
      </div>
      <div>
        <input className="mr-2" type="checkbox" />
        <label>Folders</label>
      </div>
    </div>
  );
};

export default SearchFilter;
