import { useEffect, useState } from "react";
import SearchBar from "./components/TopBar/SearchBar";
import { Volume } from "./types";
import { invoke } from "@tauri-apps/api";
import VolumeList from "./components/Volumes/VolumeList";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  selectDirectoryContents,
  updateDirectoryContents,
} from "./store/slices/currentDirectorySlice";
import { openDirectory } from "./ipc";
import DirectoryContents from "./components/MainBody/DirectoryContents";

function App() {
  const dispatch = useAppDispatch();
  const directoryContents = useAppSelector(selectDirectoryContents);

  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [currentVolume, setCurrentVolume] = useState("");

  const getNewDirectoryContents = async (mountpoint: string) => {
    const contents = await openDirectory(mountpoint);
    dispatch(updateDirectoryContents(contents));
  };

  const onVolumeClick = async (mountpoint: string) => {
    setCurrentVolume(mountpoint);
    await getNewDirectoryContents(mountpoint);
  };

  async function onDirectoryClick(filePath: string) {
    await getNewDirectoryContents(filePath);
  }

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
          {currentVolume === "" ? (
            <VolumeList volumes={volumes} onClick={onVolumeClick} />
          ) : (
            <DirectoryContents
              content={directoryContents}
              onDirectoryClick={onDirectoryClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
