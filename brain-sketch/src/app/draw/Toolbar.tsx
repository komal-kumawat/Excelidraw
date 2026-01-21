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
import { MdChangeHistory } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

interface Props {
  tool: Tool;
  setTool: (t: Tool) => void;
  undo: () => void;
  clear: () => void;
}

const tools: { id: Tool; icon: JSX.Element; label: string }[] = [
  { id: "pen", icon: <Pencil size={18} />, label: "Pen" },
  { id: "line", icon: <span className="font-bold text-lg">／</span>, label: "Line" },
  { id: "rect", icon: <FiSquare size={18} />, label: "Rectangle" },
  { id: "circle", icon: <FiCircle size={18} />, label: "Circle" },
  { id: "triangle", icon: <MdChangeHistory size={18} />, label: "Triangle" },
  { id: "arrow", icon: <FiArrowRight size={18} />, label: "Arrow" },
  { id: "eraser", icon: <Eraser size={18} />, label: "Eraser" },
];

export default function Toolbar({ tool, setTool, undo, clear }: Props) {
  return (
    <div className="fixed top-4  z-50  w-full ">
      <div className="flex items-center justify-between   px-4 py-2 mx-10">

        {/* Logo */}
        <Link href="/landing"  className="border border-gray-800  bg-gray-900 p-2 rounded-3xl">
          <Image src="/logo.svg" alt="logo" width={150} height={40} />
        </Link>

        {/* Tools */}
        <div className="flex items-center gap-1 border border-gray-800  bg-gray-900 rounded-3xl p-2 px-5">
          {tools.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              title={label}
              className={`
                w-10 h-10 flex items-center justify-center rounded-3xl
                transition-all duration-200
                ${
                  tool === id
                    ? "bg-yellow-400 text-black shadow-md scale-105"
                    : " text-white hover:bg-slate-800"
                }
              `}
            >
              {icon}
            </button>
          ))}
        </div>

        

        {/* Actions */}
        <div className="flex items-center gap-2 ">
          <button
            onClick={undo}
            title="Undo"
            className="w-11 h-11 flex items-center justify-center
              bg-gray-900 text-white rounded-3xl
              hover:bg-gray-800 transition p-2"
          >
            <FiRotateCcw size={20} />
          </button>

          <button
            onClick={clear}
            title="Clear Canvas"
            className="w-10 h-10 flex items-center justify-center
              bg-red-600 text-white rounded-3xl
              hover:bg-red-500 transition"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
