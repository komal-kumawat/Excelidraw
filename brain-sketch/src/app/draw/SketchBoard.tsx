"use client";

import { useEffect, useRef, useState } from "react";
import { Shape, Tool, Point } from "./types";
import { drawShapes } from "./draw";
import Toolbar from "./Toolbar";

const BG = "#020617";
const STROKE = "#ffffff";

/* ---------- HIT TEST ---------- */
function hitsShape(p: Point, shape: Shape, t = 8) {
  if (shape.type === "pen") {
    return shape.points.some(
      (pt) => Math.hypot(pt.x - p.x, pt.y - p.y) < t
    );
  }

  if (shape.type === "line" || shape.type === "arrow") {
    const { x1, y1, x2, y2 } = shape;
    const A = p.x - x1;
    const B = p.y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len = C * C + D * D;
    const t0 = Math.max(0, Math.min(1, dot / len));
    const x = x1 + t0 * C;
    const y = y1 + t0 * D;
    return Math.hypot(p.x - x, p.y - y) < t;
  }

  if (shape.type === "rect") {
    return (
      p.x >= shape.x &&
      p.x <= shape.x + shape.width &&
      p.y >= shape.y &&
      p.y <= shape.y + shape.height
    );
  }

  if (shape.type === "circle") {
    return Math.hypot(p.x - shape.cx, p.y - shape.cy) <= shape.r;
  }

  if (shape.type === "triangle") {
    const xs = [shape.p1.x, shape.p2.x, shape.p3.x];
    const ys = [shape.p1.y, shape.p2.y, shape.p3.y];
    return (
      p.x >= Math.min(...xs) &&
      p.x <= Math.max(...xs) &&
      p.y >= Math.min(...ys) &&
      p.y <= Math.max(...ys)
    );
  }

  return false;
}

export default function SketchBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [tool, setTool] = useState<Tool>("pen");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const start = useRef<Point | null>(null);
  const penPoints = useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawShapes(ctx, currentShape ? [...shapes, currentShape] : shapes);
  }, [shapes, currentShape]);

  const pos = (e: React.MouseEvent): Point => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  });

  const down = (e: React.MouseEvent) => {
    setIsDrawing(true);
    start.current = pos(e);
    penPoints.current = [start.current];
  };

  const move = (e: React.MouseEvent) => {
    if (!isDrawing || !start.current) return;
    const p = pos(e);

    if (tool === "eraser") {
      setShapes((prev) =>
        prev.filter((s) => !hitsShape(p, s))
      );
      return;
    }

    if (tool === "pen") {
      penPoints.current.push(p);
      setCurrentShape({
        id: "tmp",
        type: "pen",
        points: [...penPoints.current],
        stroke: STROKE,
        strokeWidth: 2,
      });
    }

    if (tool === "line" || tool === "arrow") {
      setCurrentShape({
        id: "tmp",
        type: tool,
        x1: start.current.x,
        y1: start.current.y,
        x2: p.x,
        y2: p.y,
        stroke: STROKE,
        strokeWidth: 2,
      });
    }

    if (tool === "rect") {
      setCurrentShape({
        id: "tmp",
        type: "rect",
        x: start.current.x,
        y: start.current.y,
        width: p.x - start.current.x,
        height: p.y - start.current.y,
        stroke: STROKE,
        strokeWidth: 2,
      });
    }

    if (tool === "circle") {
      setCurrentShape({
        id: "tmp",
        type: "circle",
        cx: start.current.x,
        cy: start.current.y,
        r: Math.hypot(p.x - start.current.x, p.y - start.current.y),
        stroke: STROKE,
        strokeWidth: 2,
      });
    }

    if (tool === "triangle") {
      setCurrentShape({
        id: "tmp",
        type: "triangle",
        p1: start.current,
        p2: p,
        p3: { x: start.current.x * 2 - p.x, y: p.y },
        stroke: STROKE,
        strokeWidth: 2,
      });
    }
  };

  const up = () => {
    if (currentShape) {
      setShapes((s) => [...s, { ...currentShape, id: crypto.randomUUID() }]);
    }
    setCurrentShape(null);
    setIsDrawing(false);
    start.current = null;
    penPoints.current = [];
  };

  return (
    <div className="bg-slate-950">
      <Toolbar
        tool={tool}
        setTool={setTool}
        undo={() => setShapes((s) => s.slice(0, -1))}
        clear={() => setShapes([])}
      />

      <canvas
        ref={canvasRef}
        onMouseDown={down}
        onMouseMove={move}
        onMouseUp={up}
        onMouseLeave={up}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
}
