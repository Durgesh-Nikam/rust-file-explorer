import Input from "../../ui/Input";

const SearchFilter = () => {
  return (
    <div className="space-x-2 flex justify-center bg-darker p-4 rounded-bl-lg rounded-br-lg w-62">
      <div className="flex flex-col space-y-2">
        <label>Extension</label>
        <label>Files</label>
        <label>Folders</label>
      </div>

      <div className="flex flex-col space-y-2 relative">
        <Input />
        <input className="absolute left-2 top-8" type="checkbox" />
        <input className="absolute left-2 top-16" type="checkbox" />
      </div>
    </div>
  );
};

export default SearchFilter;
