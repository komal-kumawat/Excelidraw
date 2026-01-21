"use client";

import { useEffect, useRef, useState } from "react";
import { Shape, Tool } from "./types";
import { drawShapes } from "./draw";
import Toolbar from "./Toolbar";

export default function SketchBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [tool, setTool] = useState<Tool>("pen");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // ✅ SSR-safe canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  });

  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const penPoints = useRef<{ x: number; y: number }[]>([]);

  // 🎨 Dark mode constants
  const BACKGROUND_COLOR = "#0f172a"; // slate-900
  const STROKE_COLOR = "#ffffff";     // white

  // ✅ Set canvas size (client only)
  useEffect(() => {
    const setSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  // ✅ Single source of rendering truth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1️⃣ Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2️⃣ Background
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3️⃣ Shapes
    drawShapes(ctx, shapes);
  }, [shapes, canvasSize]);

  const getPos = (e: React.MouseEvent) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    startPoint.current = pos;

    if (tool === "pen") {
      penPoints.current = [pos];
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || tool !== "pen") return;

    penPoints.current.push(getPos(e));

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Live preview
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawShapes(ctx, [
      ...shapes,
      {
        id: "temp",
        type: "pen",
        points: penPoints.current,
        stroke: STROKE_COLOR,
        strokeWidth: 2,
      },
    ]);
  };

 const handleMouseUp = (e: React.MouseEvent) => {
  if (!isDrawing) return;

  // ✅ PEN: commit directly
  if (tool === "pen") {
    if (penPoints.current.length > 1) {
      setShapes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "pen",
          points: penPoints.current,
          stroke: STROKE_COLOR,
          strokeWidth: 2,
        },
      ]);
    }

    setIsDrawing(false);
    penPoints.current = [];
    startPoint.current = null;
    return;
  }

  // ✅ LINE / RECT need startPoint
  const start = startPoint.current;
  if (!start) return;

  const end = getPos(e);

  if (tool === "line") {
    setShapes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "line",
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        stroke: STROKE_COLOR,
        strokeWidth: 2,
      },
    ]);
  }

  if (tool === "rect") {
    setShapes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "rect",
        x: start.x,
        y: start.y,
        width: end.x - start.x,
        height: end.y - start.y,
        stroke: STROKE_COLOR,
        strokeWidth: 2,
      },
    ]);
  }

  setIsDrawing(false);
  startPoint.current = null;
};


  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <Toolbar
        tool={tool}
        setTool={setTool}
        undo={() => setShapes((prev) => prev.slice(0, -1))}
        clear={() => setShapes([])}
      />

      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}

        className="flex-1 cursor-crosshair"
      />
    </div>
  );
}
