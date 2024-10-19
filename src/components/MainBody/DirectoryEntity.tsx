import { MouseEventHandler, useRef } from "react";
import { DirectoryContentType } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";

interface Props {
  name: string;
  type: DirectoryContentType;
  onDoubleClick: MouseEventHandler<HTMLButtonElement>;
}

const DirectoryEntity = ({ name, type, onDoubleClick }: Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div
      title={name}
      className="overflow-ellipsis whitespace-nowrap overflow-hidden"
    >
      <button
        className="bg-background hover:bg-bright cursor-pointer w-full h-7 flex"
        onDoubleClick={(e) => {
          onDoubleClick(e);
        }}
        ref={buttonRef}
      >
        <div className="mr-1 ml-1">
          <FontAwesomeIcon
            icon={type == "File" ? faFile : faFolder}
            size="lg"
            color={type == "File" ? "gray" : "#FFD54F"}
          />
        </div>
        {name}
      </button>
    </div>
  );
};

export default DirectoryEntity;
