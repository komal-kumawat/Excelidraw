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

    if (shape.type === "pen") {
      ctx.beginPath();
      shape.points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      );
      ctx.stroke();
    }

    if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    }

    if (shape.type === "rect") {
      ctx.strokeRect(
        shape.x,
        shape.y,
        shape.width,
        shape.height
      );
    }
  });
}
