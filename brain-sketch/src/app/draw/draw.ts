// draw/draw.ts
import { Shape } from "./types";

export function drawShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Shape[]
) {
  shapes.forEach((shape) => {
    ctx.strokeStyle = shape.stroke;
    ctx.lineWidth = shape.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    /* ---------------- PEN ---------------- */
    if (shape.type === "pen") {
      ctx.beginPath();
      shape.points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      );
      ctx.stroke();
    }

    /* ---------------- ERASER ---------------- */
    if (shape.type === "eraser") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";

      ctx.beginPath();
      shape.points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      );
      ctx.stroke();

      ctx.restore();
    }

    /* ---------------- LINE ---------------- */
    if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    }

    /* ---------------- RECTANGLE ---------------- */
    if (shape.type === "rect") {
      ctx.strokeRect(
        shape.x,
        shape.y,
        shape.width,
        shape.height
      );
    }

    /* ---------------- CIRCLE ---------------- */
    if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(
        shape.cx,
        shape.cy,
        shape.r,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    /* ---------------- TRIANGLE ---------------- */
    if (shape.type === "triangle") {
      ctx.beginPath();
      ctx.moveTo(shape.p1.x, shape.p1.y);
      ctx.lineTo(shape.p2.x, shape.p2.y);
      ctx.lineTo(shape.p3.x, shape.p3.y);
      ctx.closePath();
      ctx.stroke();
    }

    /* ---------------- ARROW ---------------- */
    if (shape.type === "arrow") {
      const headLength = shape.headLength ?? 10;

      // Main line
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(
        shape.y2 - shape.y1,
        shape.x2 - shape.x1
      );

      ctx.beginPath();
      ctx.moveTo(shape.x2, shape.y2);
      ctx.lineTo(
        shape.x2 - headLength * Math.cos(angle - Math.PI / 6),
        shape.y2 - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        shape.x2 - headLength * Math.cos(angle + Math.PI / 6),
        shape.y2 - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.stroke();
    }
  });
}
