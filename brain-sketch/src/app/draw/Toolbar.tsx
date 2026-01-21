// draw/Toolbar.tsx
"use client";

import { Tool } from "./types";

interface Props {
  tool: Tool;
  setTool: (t: Tool) => void;
  undo: () => void;
  clear: () => void;
}

export default function Toolbar({
  tool,
  setTool,
  undo,
  clear,
}: Props) {
  return (
    <div className="flex gap-2 p-3 bg-slate-900 border-b border-slate-700">
      {(["pen", "line", "rect" , "arrow" , "circle"] as Tool[]).map((t) => (
        <button
          key={t}
          onClick={() => setTool(t)}
          className={`px-3 py-1 rounded ${
            tool === t
              ? "bg-yellow-400 text-black"
              : "bg-slate-700 text-white"
          }`}
        >
          {t}
        </button>
      ))}

      <button
        onClick={undo}
        className="px-3 py-1 bg-slate-700 text-white rounded"
      >
        Undo
      </button>

      <button
        onClick={clear}
        className="px-3 py-1 bg-red-600 text-white rounded"
      >
        Clear
      </button>
    </div>
  );
}
