export interface OpticsInteractiveState {
  isDraggingObject: boolean;
  objX: number;
  objY: number;
  hoveringObject: boolean;
}

export function drawOpticsLens(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Record<string, number>,
  interactiveState?: OpticsInteractiveState
) {
  const cx = w / 2;
  const cy = h / 2;
  // Adaptive scaling for mobile screens
  const scale = Math.min(1, (w * 0.44) / 180);
  const rawF = p.focalLength || 80;
  const rawU = p.objectDistance || 160;
  const rawHo = p.objectHeight || 50;

  const f = rawF * scale;
  const u = rawU * scale; // distance left of lens
  const ho = rawHo * Math.min(1, (h * 0.35) / 90);
  const isConvex = (p.lensType ?? 1) === 1;

  // Lens formula calculations:
  // Convex: f > 0, u < 0 in Cartesian. 1/v = 1/f + 1/u (u is magnitude)
  // Concave: f < 0, u < 0. 1/v = -1/f - 1/u => v is always virtual and negative
  let v = 0;
  let hi = 0;
  let isVirtual = false;

  if (isConvex) {
    if (Math.abs(u - f) < 1) {
      v = 9999; // At infinity
      hi = 9999;
    } else if (u < f) {
      // Virtual upright magnified on same side
      v = (f * u) / (f - u);
      hi = (v / u) * ho;
      isVirtual = true;
    } else {
      // Real inverted on opposite side
      v = (f * u) / (u - f);
      hi = -(v / u) * ho;
      isVirtual = false;
    }
  } else {
    // Concave lens: always virtual, erect, and diminished
    v = (f * u) / (u + f);
    hi = (v / u) * ho;
    isVirtual = true;
  }

  // 1. Principal Optical Axis
  ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(20, cy);
  ctx.lineTo(w - 20, cy);
  ctx.stroke();

  // 2. Optical Center O and Focal Point Markers
  ctx.font = "10px monospace";
  ctx.textAlign = "center";

  // Left Focus F1 & 2F1
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(cx - f, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText("F₁", cx - f, cy + 16);

  ctx.beginPath();
  ctx.arc(cx - 2 * f, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText("2F₁", cx - 2 * f, cy + 16);

  // Right Focus F2 & 2F2
  ctx.beginPath();
  ctx.arc(cx + f, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText("F₂", cx + f, cy + 16);

  ctx.beginPath();
  ctx.arc(cx + 2 * f, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText("2F₂", cx + 2 * f, cy + 16);

  // Optical Center O
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("O (0,0)", cx, cy + 16);

  // 3. Draw Lens Body
  ctx.save();
  if (isConvex) {
    // Convex Lens (Biconvex curved aperture)
    ctx.strokeStyle = "#38bdf8";
    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    ctx.lineWidth = 2.5;
    const lensH = Math.max(10, Math.min(cy - 20, 120));
    ctx.beginPath();
    ctx.ellipse(cx, cy, 14, lensH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Convex lens symbol arrows at poles
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(cx, cy - lensH - 8);
    ctx.lineTo(cx - 6, cy - lensH);
    ctx.lineTo(cx + 6, cy - lensH);
    ctx.fill();
  } else {
    // Concave Lens (Biconcave hourglass curve)
    ctx.strokeStyle = "#38bdf8";
    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    ctx.lineWidth = 2.5;
    const lensH = Math.min(cy - 20, 120);
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - lensH);
    ctx.lineTo(cx + 12, cy - lensH);
    ctx.quadraticCurveTo(cx + 4, cy, cx + 12, cy + lensH);
    ctx.lineTo(cx - 12, cy + lensH);
    ctx.quadraticCurveTo(cx - 4, cy, cx - 12, cy - lensH);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // 4. Draw Luminous Object Arrow (AB) on Left
  const objX = cx - u;
  const objTopY = cy - ho;

  ctx.save();
  const isHovered = interactiveState?.hoveringObject || interactiveState?.isDraggingObject;
  ctx.strokeStyle = isHovered ? "#ffffff" : "#c4f500";
  ctx.fillStyle = isHovered ? "#ffffff" : "#c4f500";
  ctx.lineWidth = isHovered ? 4 : 3;

  ctx.beginPath();
  ctx.moveTo(objX, cy);
  ctx.lineTo(objX, objTopY);
  ctx.stroke();

  // Arrowhead A
  ctx.beginPath();
  ctx.moveTo(objX - 6, objTopY + 10);
  ctx.lineTo(objX, objTopY);
  ctx.lineTo(objX + 6, objTopY + 10);
  ctx.fill();

  // Object label and drag hint
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Object (AB)", objX, objTopY - 12);
  ctx.font = "9px monospace";
  ctx.fillStyle = "rgba(196, 245, 0, 0.8)";
  ctx.fillText(`u = ${u.toFixed(0)}cm`, objX, objTopY - 2);
  ctx.restore();

  // 5. Ray Tracing Paths
  if (isConvex) {
    if (u !== f) {
      // Ray 1: Parallel to Principal Axis -> Passes through Focus F2
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(cx, objTopY);
      ctx.stroke();

      if (!isVirtual) {
        // Refracted through F2 towards real image
        const imgX = cx + v;
        const imgTopY = cy - hi;
        ctx.beginPath();
        ctx.moveTo(cx, objTopY);
        ctx.lineTo(imgX, imgTopY);
        ctx.stroke();
      } else {
        // Refracted forward and extended backward (dashed)
        const extendX = cx + 250;
        const slope = (cy - objTopY) / f;
        const extendY = objTopY + slope * 250;
        ctx.beginPath();
        ctx.moveTo(cx, objTopY);
        ctx.lineTo(extendX, extendY);
        ctx.stroke();

        // Virtual backward projection
        ctx.strokeStyle = "rgba(250, 204, 21, 0.5)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, objTopY);
        ctx.lineTo(cx - v, cy - hi);
        ctx.stroke();
      }

      // Ray 2: Passes undeviated through Optical Center O
      ctx.strokeStyle = "#38bdf8";
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      if (!isVirtual) {
        const imgX = cx + v;
        const imgTopY = cy - hi;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(imgX, imgTopY);
        ctx.stroke();
      } else {
        const slope2 = (cy - objTopY) / (cx - objX);
        const forwardX = cx + 200;
        const forwardY = cy + slope2 * 200;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(forwardX, forwardY);
        ctx.stroke();

        // Virtual backward projection
        ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - v, cy - hi);
        ctx.stroke();
      }

      // Ray 3: Through Left Focus F1 -> Refracts parallel to principal axis (if real)
      if (!isVirtual && u > f) {
        ctx.strokeStyle = "#ec4899";
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(objX, objTopY);
        // Intersects lens at y
        const slopeF1 = (cy - objTopY) / (cx - f - objX);
        const lensIntersectY = cy + slopeF1 * f;
        ctx.lineTo(cx, lensIntersectY);
        ctx.lineTo(cx + v, cy - hi);
        ctx.stroke();
      }
    }
  } else {
    // Concave Lens Ray Tracing
    const imgX = cx - v;
    const imgTopY = cy - hi;

    // Ray 1: Parallel to axis -> Diverges as if coming from F1
    ctx.strokeStyle = "#facc15";
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(objX, objTopY);
    ctx.lineTo(cx, objTopY);
    // Diverging forward ray
    const slopeDiv = (objTopY - cy) / f;
    ctx.lineTo(cx + 200, objTopY + slopeDiv * 200);
    ctx.stroke();

    // Virtual dashed ray back to F1
    ctx.strokeStyle = "rgba(250, 204, 21, 0.5)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, objTopY);
    ctx.lineTo(cx - f, cy);
    ctx.stroke();

    // Ray 2: Undeviated through O
    ctx.strokeStyle = "#38bdf8";
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(objX, objTopY);
    ctx.lineTo(cx + 200, cy + ((cy - objTopY) / (cx - objX)) * 200);
    ctx.stroke();
  }

  // 6. Draw Formed Image Arrow (A'B')
  ctx.setLineDash([]);
  const realV = v / scale;
  if (v < 9000 && Math.abs(v) > 5) {
    const imgX = isVirtual ? cx - v : cx + v;
    const imgTopY = cy - hi;

    ctx.save();
    if (isVirtual) {
      ctx.strokeStyle = "#38bdf8";
      ctx.fillStyle = "#38bdf8";
      ctx.setLineDash([5, 4]);
    } else {
      ctx.strokeStyle = "#fb923c";
      ctx.fillStyle = "#fb923c";
    }
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(imgX, cy);
    ctx.lineTo(imgX, imgTopY);
    ctx.stroke();

    // Image Arrowhead
    ctx.setLineDash([]);
    const arrowDir = hi > 0 ? -1 : 1; // pointing up or down
    ctx.beginPath();
    ctx.moveTo(imgX - 5, imgTopY - 8 * arrowDir);
    ctx.lineTo(imgX, imgTopY);
    ctx.lineTo(imgX + 5, imgTopY - 8 * arrowDir);
    ctx.fill();

    // Label
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    const labelY = hi > 0 ? Math.max(16, imgTopY - 14) : Math.min(h - 18, imgTopY + 16);
    ctx.fillText(isVirtual ? "Virtual Image (A'B')" : "Real Image (A'B')", imgX, labelY);
    ctx.font = "9px monospace";
    ctx.fillText(`v = ${isVirtual ? "-" : "+"}${realV.toFixed(1)}cm`, imgX, labelY + (hi > 0 ? 11 : 11));
    ctx.restore();
  }
}
