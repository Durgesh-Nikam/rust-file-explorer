import { Volume } from "../../types";
import VolumeComponent from "./VolumeComponent";

interface Props {
  volumes: Volume[];
  onDoubleClick: (mountpoint: string) => void;
}

const VolumeList = ({ volumes, onDoubleClick }: Props) => {
  if (volumes.length === 0) {
    return <div className="text-center py-8">Loading volumes...</div>;
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-4">
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
