import { MouseEventHandler } from "react";
import { Volume } from "../../types";

interface Props {
  volume: Volume;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const VolumeComponent = ({ volume, onClick }: Props) => {
  return (
    <button
      className="p-5 w-56 bg-darker radius rounded cursor-pointer"
      onClick={onClick}
    >
      <h3>
        {volume.name} ({volume.mountpoint})
      </h3>
      <progress max="100" value={(volume.used_gb / volume.total_gb) * 100} />
      <br />
      {volume.available_gb} GB free of {volume.total_gb} GB
    </button>
  );
};

export default VolumeComponent;
