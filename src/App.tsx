import { useEffect, useState } from "react";
import SearchBar from "./components/TopBar/SearchBar";
import { Volume } from "./types";
import { invoke } from "@tauri-apps/api";
import VolumeList from "./components/Volumes/VolumeList";

function App() {
  const [volumes, setVolumes] = useState<Volume[]>([]);

  const getVolumes = async () => {
    if (volumes.length > 0) {
      return;
    }

    const newVolumes = await invoke<Volume[]>("get_volumes");
    setVolumes(newVolumes);
  };

  let render = 0;

  useEffect(() => {
    if (render === 0) {
      getVolumes().catch(console.error);
    }

    render += 1;
  }, []);
  return (
    <div>
      <div className="pb-5">
        <SearchBar />
        <div className="w-7/12">
          <VolumeList volumes={volumes} />
        </div>
      </div>
    </div>
  );
}

export default App;
