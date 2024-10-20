import { Volume } from "../../types";
import LoadingPlaceholder from "../LoadingPlaceholder";
import VolumeComponent from "./VolumeComponent";

interface Props {
  volumes: Volume[];
  onDoubleClick: (mountpoint: string) => void;
}
const VolumeList = ({ volumes, onDoubleClick }: Props) => {
  if (volumes.length === 0) {
    return <LoadingPlaceholder />;
  }

  return (
    <div className="space-x-4">
      {volumes.map((volume, idx) => (
        <VolumeComponent
          key={`${volume.name}-${idx}`}
          volume={volume}
          onDoubleClick={() => onDoubleClick(volume.mountpoint)}
        />
      ))}
    </div>
  );
};

export default VolumeList;
