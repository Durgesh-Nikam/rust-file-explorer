import { useEffect, useState } from "react";
import SearchBar from "./components/TopBar/SearchBar";
import VolumeList from "./components/Volumes/VolumeList";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  selectDirectoryContents,
  updateDirectoryContents,
} from "./store/slices/currentDirectorySlice";
import DirectoryContents from "./components/MainBody/DirectoryContents";
import {
  selectCurrentVolume,
  selectVolumes,
  setCurrentVolume,
  setVolumes,
} from "./store/slices/volumesSlice";
import { getVolumes, openDirectory } from "./ipc";
import { DirectoryContent } from "./types";

const App = () => {
  const dispatch = useAppDispatch();
  const directoryContents = useAppSelector(selectDirectoryContents);
  const volumes = useAppSelector(selectVolumes);
  const currentVolume = useAppSelector(selectCurrentVolume);
  const [searchResults, setSearchResults] = useState<DirectoryContent[]>([]);
  const [currentDirectoryPath, setCurrentDirectoryPath] = useState("");

  useEffect(() => {
    if (volumes.length > 0) {
      return;
    }
    const fetchVolumes = async () => {
      try {
        const newVolumes = await getVolumes();
        dispatch(setVolumes(newVolumes));
      } catch (error) {
        console.error("Failed to fetch volumes:", error);
      }
    };

    fetchVolumes();
  }, []);

  const handleVolumeClick = async (mountpoint: string) => {
    try {
      dispatch(setCurrentVolume(mountpoint));
      const contents = await openDirectory(mountpoint);
      dispatch(updateDirectoryContents(contents));
      setCurrentDirectoryPath(mountpoint);
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to open volume: ", error);
    }
  };

  const handleDirectoryClick = async (filePath: string) => {
    try {
      const contents = await openDirectory(filePath);
      dispatch(updateDirectoryContents(contents));
      setCurrentDirectoryPath(filePath);
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to open directory: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4">
        <div className="flex items-center">
          <SearchBar
            currentVolume={currentVolume}
            currentDirectoryPath={currentDirectoryPath}
            setSearchResults={setSearchResults}
          />
        </div>
      </header>
      <main className="p-6">
        {currentVolume === "" ? (
          <VolumeList volumes={volumes} onDoubleClick={handleVolumeClick} />
        ) : (
          <DirectoryContents
            content={
              searchResults.length > 0 ? searchResults : directoryContents
            }
            onDirectoryClick={handleDirectoryClick}
          />
        )}
      </main>
    </div>
  );
};

export default App;
