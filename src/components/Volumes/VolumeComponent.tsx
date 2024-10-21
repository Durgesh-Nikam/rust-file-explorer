import { MouseEventHandler } from "react";
import { Volume } from "../../types";
import { HardDrive } from "lucide-react";

interface Props {
  volume: Volume;
  onDoubleClick: MouseEventHandler<HTMLButtonElement>;
}

const VolumeComponent = ({ volume, onDoubleClick }: Props) => {
  return (
    <button
      className="disk-component cursor-pointer"
      onDoubleClick={onDoubleClick}
    >
      <div className="disk-details">
        <div className="flex items-center mb-2">
          <HardDrive className="w-8 h-8 mr-2 text-gray-400" />
          <h3 className=" text-white font-bold">
            {volume.name} ({volume.mountpoint})
          </h3>
        </div>
        <progress
          max="100"
          value={(volume.used_gb / volume.total_gb) * 100}
          className="h-2 w-full mt-2"
        />
        <p className="text-sm text-gray-400 mt-1">
          {volume.available_gb} GB free of {volume.total_gb} GB
        </p>
      </div>
    </button>
  );
};

export default VolumeComponent;
