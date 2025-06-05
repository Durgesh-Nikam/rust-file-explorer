interface ShortcutHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShortcutsHelpDialog = ({ isOpen, onClose }: ShortcutHelpProps) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: "Alt + ←", description: "Go back" },
    { keys: "Alt + →", description: "Go forward" },
    { keys: "Ctrl + K", description: "Focus search bar" },
    { keys: "Ctrl + N", description: "Create new file" },
    { keys: "Ctrl + Shift + N", description: "Create new folder" },
    { keys: "Delete", description: "Delete selected item" },
    { keys: "Enter", description: "Open file/folder" },
    { keys: "Esc", description: "Close menus and dialogs" },
    { keys: "Shift + F10", description: "Open context menu" },
    { keys: "?", description: "Show/hide keyboard shortcuts" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="divide-y divide-gray-700 max-h-96 overflow-y-scroll px-4 custom-scrollbar">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="py-2 flex justify-between">
              <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm">
                {shortcut.keys}
              </span>
              <span className="text-gray-300">{shortcut.description}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsHelpDialog;
