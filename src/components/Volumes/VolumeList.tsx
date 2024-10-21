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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
