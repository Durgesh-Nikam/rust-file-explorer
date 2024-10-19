import { DirectoryContent, DirectoryContentType } from "../../types";
import DirectoryEntity from "./DirectoryEntity";

interface Props {
  content: DirectoryContent[];
  onDirectoryClick: (filePath: string) => any;
}

const DirectoryContents = ({ content, onDirectoryClick }: Props) => {
  return (
    <>
      {content.length === 0 ? "There are no files in this directory." : ""}
      {content.map((content, idx) => {
        const [fileType, [fileName, filePath]] = Object.entries(content)[0]; //This converts the content object into an array of key-value pairs. Since it returns an array of arrays, [0] accesses the first key-value pair.

        return (
          <DirectoryEntity
            type={fileType as DirectoryContentType}
            onDoubleClick={() =>
              fileType === "Directory"
                ? onDirectoryClick(filePath)
                : console.log(`You clicked on: ${fileName}`)
            }
            key={idx}
            name={fileName}
          />
        );
      })}
    </>
  );
};

export default DirectoryContents;
