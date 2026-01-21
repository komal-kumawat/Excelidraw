// draw/types.ts

export type Tool =
  | "pen"
  | "line"
  | "rect"
  | "circle"
  | "triangle"
  | "arrow"
  |"eraser"

export interface Point {
  x: number;
  y: number;
}

export interface BaseShape {
  id: string;
  stroke: string;
  strokeWidth: number;
}

/* ---------------- PEN ---------------- */

export interface PenShape extends BaseShape {
  type: "pen";
  points: Point[];
}

/* ---------------- LINE ---------------- */

export interface LineShape extends BaseShape {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/* ---------------- RECTANGLE ---------------- */

export interface RectShape extends BaseShape {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

/* ---------------- CIRCLE ---------------- */

export interface CircleShape extends BaseShape {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
}

/* ---------------- TRIANGLE ---------------- */

export interface TriangleShape extends BaseShape {
  type: "triangle";
  p1: Point;
  p2: Point;
  p3: Point;
}

/* ---------------- ARROW ---------------- */

export interface ArrowShape extends BaseShape {
  type: "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  headLength?: number; // optional customization
}
export type EraserShape = {
  type: "eraser";
  points: Point[];
  strokeWidth: number;
};


/* ---------------- UNION ---------------- */

export type Shape =
  | PenShape
  | LineShape
  | RectShape
  | CircleShape
  | TriangleShape
  | ArrowShape
  |EraserShape;
