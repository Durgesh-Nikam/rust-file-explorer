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
      className="flex flex-col rounded-lg bg-gray-800 p-3 transition-colors hover:bg-gray-700/60 text-left"
      onDoubleClick={onDoubleClick}
    >
      <div className="flex items-center mb-2">
        <HardDrive className="mr-3 h-8 w-8 text-blue-400" />
        <div>
          <h3 className="font-medium">
            {volume.name} ({volume.mountpoint})
          </h3>
          <p className="text-xs text-gray-400">{volume.total_gb} GB</p>
        </div>
      </div>
      <div
        className="h-2 w-full rounded-full bg-gray-700"
        role="progressbar"
        aria-valuenow={(volume.used_gb / volume.total_gb) * 100}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-blue-500"
          style={{ width: `${(volume.used_gb / volume.total_gb) * 100}%` }}
        ></div>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {volume.available_gb} GB free of {volume.total_gb} GB
      </p>
    </button>
  );
};
export default VolumeComponent;
