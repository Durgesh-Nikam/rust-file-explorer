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
    return <p>There are no files in this directory.</p>;
  }
  return (
    <>
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
          />
        );
      })}
    </>
  );
};

export default DirectoryContents;
