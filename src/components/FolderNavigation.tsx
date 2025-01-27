import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface Props {
  onBack: () => void;
  canGoBack: boolean;
  onForward: () => void;
  canGoForward: boolean;
}

const FolderNavigation = ({
  onBack,
  canGoBack,
  onForward,
  canGoForward,
}: Props) => (
  <div className="flex space-x-2">
    <button
      onClick={onBack}
      disabled={!canGoBack}
      className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
    >
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>

    <button
      onClick={onForward}
      disabled={!canGoForward}
      className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
    >
      <FontAwesomeIcon icon={faArrowRight} />
    </button>
  </div>
);

export default FolderNavigation;
