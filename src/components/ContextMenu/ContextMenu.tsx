// import { useEffect } from "react";
// import { ContextMenuItem, ContextMenuPosition } from "../../types";

// type ContextMenuProps = {
//   items: ContextMenuItem[];
//   position: ContextMenuPosition;
//   onClose: () => void;
// };

// const ContextMenu = ({ items, position, onClose }: ContextMenuProps) => {
//   useEffect(() => {
//     const handleClick = () => onClose();
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };

//     window.addEventListener("click", handleClick);
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("click", handleClick);
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [onClose]);

//   return (
//     <div
//       className="absolute z-50 min-w-[200px] bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-2"
//       style={{
//         left: Math.min(position.x, window.innerWidth - 250),
//         top: Math.min(position.y, window.innerHeight - 200),
//       }}
//       onClick={(e) => e.stopPropagation()}
//     >
//       {items.map((item, index) => (
//         <button
//           key={index}
//           onClick={(e) => {
//             e.stopPropagation();
//             item.action();
//             onClose();
//           }}
//           className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors flex items-center ${
//             item.danger ? "text-red-400" : "text-gray-200"
//           }`}
//         >
//           {item.icon && <span className="mr-3">{item.icon}</span>}
//           {item.label}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default ContextMenu;
