export function drawTrigUnitCircle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Record<string, number>,
  t: number
) {
  const thetaDeg = (p.thetaDeg || 45) % 360;
  const rad = (thetaDeg * Math.PI) / 180;
  const showTangent = (p.showTangent ?? 1) === 1;

  // Layout: Left half Unit Circle, Right half Continuous Wave Plot
  const circleCX = Math.min(w * 0.32, 170);
  const circleCY = h / 2;
  const circleR = Math.min(circleCX - 30, h * 0.36, 110);

  const px = circleCX + circleR * Math.cos(rad);
  const py = circleCY - circleR * Math.sin(rad); // canvas Y is inverted

  // 1. Draw Left Coordinate Axes
  ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(circleCX - circleR - 25, circleCY);
  ctx.lineTo(circleCX + circleR + 25, circleCY);
  ctx.moveTo(circleCX, circleCY - circleR - 25);
  ctx.lineTo(circleCX, circleCY + circleR + 25);
  ctx.stroke();

  // Unit Circle (r = 1)
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(circleCX, circleCY, circleR, 0, Math.PI * 2);
  ctx.stroke();

  // Angle Arc (θ)
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(circleCX, circleCY, 24, 0, -rad, true);
  ctx.stroke();

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 9.5px monospace";
  ctx.fillText(`${thetaDeg.toFixed(0)}°`, circleCX + 32 * Math.cos(rad / 2), circleCY - 16 * Math.sin(rad / 2));

  // 2. Trigonometric Components (Triangle)
  // cos(θ) Horizontal Leg (Blue)
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(circleCX, circleCY);
  ctx.lineTo(px, circleCY);
  ctx.stroke();

  // sin(θ) Vertical Leg (Green)
  ctx.strokeStyle = "#4ade80";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(px, circleCY);
  ctx.lineTo(px, py);
  ctx.stroke();

  // Radius Vector OP (White)
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(circleCX, circleCY);
  ctx.lineTo(px, py);
  ctx.stroke();

  // Tangent Line (Orange)
  if (showTangent && Math.abs(Math.cos(rad)) > 0.05) {
    const tanVal = Math.tan(rad);
    const tanX = circleCX + circleR * Math.sign(Math.cos(rad));
    const tanY = circleCY - circleR * tanVal * Math.sign(Math.cos(rad));

    ctx.strokeStyle = "rgba(251, 146, 60, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(tanX, tanY);
    ctx.stroke();
  }

  // Rotating Point P(cos θ, sin θ)
  ctx.fillStyle = "#ec4899";
  ctx.beginPath();
  ctx.arc(px, py, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Point P Label
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "left";
  ctx.fillText("P(cosθ, sinθ)", px + 8, py - 4);

  // 3. Right Side: Continuous Sinusoidal Wave Plot
  const waveStartX = circleCX + circleR + 40;
  const waveW = Math.max(140, w - waveStartX - 25);
  const waveH = circleR * 2;
  const waveCY = circleCY;

  if (waveW > 100) {
    // Wave Plot Box
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.fillRect(waveStartX, waveCY - circleR, waveW, waveH);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(waveStartX, waveCY - circleR, waveW, waveH);

    // Center Baseline Y = 0
    ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
    ctx.beginPath();
    ctx.moveTo(waveStartX, waveCY);
    ctx.lineTo(waveStartX + waveW, waveCY);
    ctx.stroke();

    // Dotted projection line from P to wave start
    ctx.strokeStyle = "rgba(74, 222, 128, 0.6)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(waveStartX, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Continuous Sine Wave Curve
    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const waveCycles = 2.5;
    for (let wx = 0; wx < waveW; wx += 2) {
      const angleSample = rad - (wx / waveW) * (waveCycles * Math.PI * 2);
      const wy = waveCY - circleR * Math.sin(angleSample);
      if (wx === 0) ctx.moveTo(waveStartX + wx, wy);
      else ctx.lineTo(waveStartX + wx, wy);
    }
    ctx.stroke();

    // Wave point tracker
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.arc(waveStartX, py, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Sine Wave y = sin(θ)", waveStartX + waveW / 2, waveCY - circleR - 6);
  }
}
