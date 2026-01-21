// draw/Toolbar.tsx
"use client";

import { Eraser, Pencil } from "lucide-react";
import { Tool } from "./types";
import {
  
  FiSquare,
  FiCircle,
  FiArrowRight,
  FiRotateCcw,
  FiTrash2,
} from "react-icons/fi";
import { MdChangeHistory } from "react-icons/md"; // triangle

interface Props {
  tool: Tool;
  setTool: (t: Tool) => void;
  undo: () => void;
  clear: () => void;
}

const tools: { id: Tool; icon: JSX.Element; label: string }[] = [
  { id: "pen", icon: <Pencil size={18} />, label: "Pen" },
  { id: "line", icon: <div className="font-bold">\</div>, label: "Line" },
  { id: "rect", icon: <FiSquare size={18} />, label: "Rectangle" },
  { id: "circle", icon: <FiCircle size={18} />, label: "Circle" },
  { id: "triangle", icon: <MdChangeHistory size={18} />, label: "Triangle" },
  { id: "arrow", icon: <FiArrowRight size={18} />, label: "Arrow" },
  { id: "eraser", icon: <Eraser size={18} />, label: "Eraser" },
];
export default function Toolbar({
  tool,
  setTool,
  undo,
  clear,
}: Props) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-700 top-0 fixed w-[100vw]">
      {tools.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => setTool(id)}
          title={label}
          className={`
            w-10 h-10 flex items-center justify-center rounded
            transition
            ${
              tool === id
                ? "bg-yellow-400 text-black"
                : "bg-slate-700 text-white hover:bg-slate-600"
            }
          `}
        >
          {icon}
        </button>
      ))}

      <div className="w-px h-8 bg-slate-700 mx-2" />

      <button
        onClick={undo}
        title="Undo"
        className="w-10 h-10 flex items-center justify-center bg-slate-700 text-white rounded hover:bg-slate-600"
      >
        <FiRotateCcw size={18} />
      </button>

      <button
        onClick={clear}
        title="Clear Canvas"
        className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded hover:bg-red-500"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}
