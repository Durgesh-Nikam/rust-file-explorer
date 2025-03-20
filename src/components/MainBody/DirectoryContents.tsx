import { openFile } from "../../ipc";
import { DirectoryContent, DirectoryContentType } from "../../types";
import DirectoryEntity from "./DirectoryEntity";

interface DirectoryContentsProps {
  content: DirectoryContent[];
  onDirectoryClick: (filePath: string) => void;
}

const DirectoryContents = ({
  content,
  onDirectoryClick,
}: DirectoryContentsProps) => {
  const onFileClick = async (path: string) => {
    await openFile(path).catch((err) => alert(err));
  };

  if (content.length === 0) {
    return (
      <p className="text-center py-8">There are no files in this directory.</p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {content.map((item, idx) => {
        const [fileType, [fileName, filePath]] = Object.entries(item)[0]; //This converts the content object into an array of key-value pairs. Since it returns an array of arrays, [0] accesses the first key-value pair.

        return (
          <DirectoryEntity
            key={idx}
            name={fileName}
            type={fileType as DirectoryContentType}
            onDoubleClick={() =>
              fileType === "Directory"
                ? onDirectoryClick(filePath)
                : onFileClick(filePath)
            }
            entity={{
              name: fileName,
              type: fileType as DirectoryContentType,
              path: filePath,
            }}
          />
        );
      })}
    </div>
  );
};

export default DirectoryContents;
