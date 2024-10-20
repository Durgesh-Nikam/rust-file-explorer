import { MouseEventHandler, useRef } from "react";
import { DirectoryContentType } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";

interface DirectoryEntityProps {
  name: string;
  type: DirectoryContentType;
  onDoubleClick: MouseEventHandler<HTMLButtonElement>;
}

const DirectoryEntity = ({
  name,
  type,
  onDoubleClick,
}: DirectoryEntityProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div
      title={name}
      className="overflow-ellipsis whitespace-nowrap overflow-hidden"
    >
      <button
        ref={buttonRef}
        className="bg-background hover:bg-bright cursor-pointer w-full h-7 flex"
        onDoubleClick={onDoubleClick}
      >
        <div className="mr-1 ml-1">
          <FontAwesomeIcon
            icon={type == "File" ? faFile : faFolder}
            size="lg"
            color={type == "File" ? "gray" : "#FFD54F"}
          />
        </div>
        <span>{name}</span>
      </button>
    </div>
  );
};

export default DirectoryEntity;
