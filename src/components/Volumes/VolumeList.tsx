import { Volume } from "../../types";
import LoadingPlaceholder from "../LoadingPlaceholder";
import VolumeComponent from "./VolumeComponent";

interface Props {
  volumes: Volume[];
  onClick: (mountpoint: string) => void;
}
const VolumeList = ({ volumes, onClick }: Props) => {
  if (volumes.length === 0) {
    return <LoadingPlaceholder />;
  }

  return (
    <div className="space-x-4">
      {volumes.map((volume, idx) => (
        <VolumeComponent
          key={`${volume.name}-${idx}`}
          volume={volume}
          onClick={() => onClick(volume.mountpoint)}
        />
      ))}
    </div>
  );
};

export default VolumeList;
