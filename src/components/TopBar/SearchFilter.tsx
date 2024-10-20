import Input from "../../ui/Input";

const SearchFilter = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-5 mb-2">
      <div className=" items-center">
        <label>Extension</label>
        <Input />
      </div>
      <div>
        <input className="mr-4" type="checkbox" />
        <label>Files</label>
      </div>
      <div>
        <input className="mr-4" type="checkbox" />
        <label>Folders</label>
      </div>
    </div>
  );
};

export default SearchFilter;
