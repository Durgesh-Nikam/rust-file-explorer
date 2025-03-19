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
import {
  goBack,
  goForward,
  navigateTo,
  selectCanGoBack,
  selectCanGoForward,
  selectCurrentPath,
} from "./store/slices/navigationSlice";
import FolderNavigation from "./components/FolderNavigation";
import { useContextMenu } from "./hooks/useContextMenu";
import ContextMenuManager from "./components/ContextMenu/ContextMenuManager";
import PathBar from "./components/PathBar";

const App = () => {
  const dispatch = useAppDispatch();
  const { hideContextMenu, handleMainContext } = useContextMenu();

  const directoryContents = useAppSelector(selectDirectoryContents);
  const volumes = useAppSelector(selectVolumes);
  const currentVolume = useAppSelector(selectCurrentVolume);

  const currentPath = useAppSelector(selectCurrentPath);
  const canGoBack = useAppSelector(selectCanGoBack);
  const canGoForward = useAppSelector(selectCanGoForward);

  const [searchResults, setSearchResults] = useState<DirectoryContent[]>([]);

  useEffect(() => {
    const fetchVolumes = async () => {
      try {
        const newVolumes = await getVolumes();
        dispatch(setVolumes(newVolumes));
      } catch (error) {
        console.error("Failed to fetch volumes:", error);
      }
    };

    if (volumes.length === 0) fetchVolumes();
  }, [dispatch, volumes.length]);

  useEffect(() => {
    const updateContents = async () => {
      try {
        const contents = await openDirectory(currentPath);
        dispatch(updateDirectoryContents(contents));
      } catch (error) {
        console.error("Failed to load directory contents: ", error);
      }
    };

    if (currentPath !== "") updateContents();
  }, [currentPath, dispatch]);

  const handleVolumeClick = (mountpoint: string) => {
    try {
      dispatch(setCurrentVolume(mountpoint));
      dispatch(navigateTo(mountpoint));
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to open volume: ", error);
    }
  };

  const handleDirectoryClick = (filePath: string) => {
    try {
      dispatch(navigateTo(filePath));
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to open directory: ", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-gray-100"
      onClick={hideContextMenu}
      onContextMenu={handleMainContext}
    >
      <ContextMenuManager />
      <header className="bg-gray-800 p-4 px-8">
        <div className="flex items-center justify-between">
          <FolderNavigation
            onBack={() => dispatch(goBack())}
            onForward={() => dispatch(goForward())}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
          ></FolderNavigation>
          <SearchBar
            currentVolume={currentVolume}
            currentDirectoryPath={currentPath}
            setSearchResults={setSearchResults}
          />
        </div>
      </header>
      <main className="p-6">
        {currentPath === "" ? (
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
      <PathBar currentPath={currentPath} />
    </div>
  );
};

export default App;
