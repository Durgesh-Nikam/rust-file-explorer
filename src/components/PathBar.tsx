import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { navigateTo } from "../store/slices/navigationSlice";

interface PathBarProps {
  currentPath: string;
}

const PathBar = ({ currentPath }: PathBarProps) => {
  const [pathSegments, setPathSegments] = useState<
    { name: string; path: string }[]
  >([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!currentPath) {
      setPathSegments([]);
      return;
    }

    const segments = currentPath.split(/[/\\]+/).filter(Boolean);
    const segmentsWithPaths: { name: string; path: string }[] = [];

    let currentSegmentPath = "";
    for (let i = 0; i < segments.length; i++) {
      // For Windows paths that start with a drive letter (e.g., C:)
      if (i === 0 && segments[i].endsWith(":")) {
        currentSegmentPath = segments[i] + "\\";
        segmentsWithPaths.push({
          name: segments[i],
          path: currentSegmentPath,
        });
        continue;
      }

      // For other path segments
      currentSegmentPath +=
        (currentSegmentPath.endsWith("/") || currentSegmentPath.endsWith("\\")
          ? ""
          : "\\") + segments[i];
      segmentsWithPaths.push({
        name: segments[i],
        path: currentSegmentPath,
      });
    }

    setPathSegments(segmentsWithPaths);
  }, [currentPath]);

  const handleSegmentClick = (path: string) => {
    dispatch(navigateTo(path));
  };

  if (!currentPath) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2 text-sm flex items-center overflow-x-auto">
      <div className="flex items-center space-x-1 text-gray-300 hover:text-white">
        <button
          onClick={() => dispatch(navigateTo(""))}
          className="hover:text-blue-400 transition-colors"
        >
          Computer
        </button>
      </div>

      {pathSegments.map((segment, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1 text-gray-500" />
          <button
            onClick={() => handleSegmentClick(segment.path)}
            className="hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            {segment.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PathBar;
