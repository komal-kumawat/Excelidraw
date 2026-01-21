"use client";

import { useEffect, useRef, useState } from "react";
import { Shape, Tool, Point } from "./types";
import { drawShapes } from "./draw";
import Toolbar from "./Toolbar";

const BG = "#020617";
const STROKE = "#ffffff";

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

        if (tool === "pen" || tool === "eraser") {
            penPoints.current = [start.current];
        }
    };


    const move = (e: React.MouseEvent) => {
        if (!isDrawing || !start.current) return;
        const p = pos(e);

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
            const r = Math.hypot(p.x - start.current.x, p.y - start.current.y);
            setCurrentShape({
                id: "tmp",
                type: "circle",
                cx: start.current.x,
                cy: start.current.y,
                r,
                stroke: STROKE,
                strokeWidth: 2,
            });
        }

        if (tool === "triangle") {
            setCurrentShape({
                id: "tmp",
                type: "triangle",
                p1: start.current,
                p2: { x: p.x, y: p.y },
                p3: { x: start.current.x * 2 - p.x, y: p.y },
                stroke: STROKE,
                strokeWidth: 2,
            });
        }
        if (tool === "eraser") {
            penPoints.current.push(p);

            setCurrentShape({
                id: "tmp",
                type: "eraser",
                points: [...penPoints.current],
                strokeWidth: 20, // eraser size
            });
        }



    };

    const up = () => {
        if (currentShape) {
            setShapes((s) => [...s, { ...currentShape, id: crypto.randomUUID() }]);
        }
        setCurrentShape(null);
        setIsDrawing(false);
        penPoints.current = [];
        start.current = null;
    };

    return (
        <div className=" bg-slate-950">
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
