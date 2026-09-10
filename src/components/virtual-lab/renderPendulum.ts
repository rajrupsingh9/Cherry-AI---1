export function drawPendulumMotion(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Record<string, number>,
  t: number
) {
  const L = p.length || 100; // string length in cm (40 to 200)
  const g = p.gravity || 9.8; // m/s²
  const theta0Deg = p.angle || 20; // initial amplitude in degrees

  const theta0Rad = (theta0Deg * Math.PI) / 180;
  // Angular frequency omega = sqrt(g / (L in meters))
  const omega = Math.sqrt(g / (L / 100));
  const timePeriod = (2 * Math.PI) / omega;
  const frequency = 1 / timePeriod;

  // Instantaneous angle theta(t)
  const currentTheta = theta0Rad * Math.cos(omega * t);
  const currentVelocity = -theta0Rad * omega * Math.sin(omega * t);

  // Energy calculations (relative fraction)
  // Max PE at extremes: PE_max = 1 - cos(theta0)
  const peFraction = (1 - Math.cos(currentTheta)) / Math.max(1e-4, 1 - Math.cos(theta0Rad));
  const keFraction = Math.max(0, 1 - peFraction);

  // Canvas coordinates
  const pivotX = Math.max(60, Math.min(w * 0.32, 160));
  const pivotY = 40;

  // Visual string length scaling
  const visualLength = Math.min(h * 0.52, 60 + (L / 200) * (h * 0.42));
  const bobX = pivotX + visualLength * Math.sin(currentTheta);
  const bobY = pivotY + visualLength * Math.cos(currentTheta);

  // 1. Rigid Ceiling Stand & Pivot Clamp
  ctx.fillStyle = "#334155";
  ctx.fillRect(pivotX - 35, pivotY - 14, 70, 10);
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  ctx.strokeRect(pivotX - 35, pivotY - 14, 70, 10);

  // Pivot bearing
  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Equilibrium reference dashed vertical line
  ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(pivotX, pivotY + visualLength + 20);
  ctx.stroke();

  // Trajectory arc of oscillation
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, visualLength, Math.PI / 2 - theta0Rad, Math.PI / 2 + theta0Rad);
  ctx.stroke();
  ctx.setLineDash([]);

  // 2. Pendulum String
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  // 3. Metallic Bob
  const bobRadius = 14;
  const bobGrad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobRadius);
  bobGrad.addColorStop(0, "#818cf8");
  bobGrad.addColorStop(0.7, "#4f46e5");
  bobGrad.addColorStop(1, "#312e81");

  ctx.fillStyle = bobGrad;
  ctx.beginPath();
  ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#c7d2fe";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. Right Side: Kinetic & Potential Energy Bar Meters
  const energyBoxX = pivotX + 70;
  const energyBoxY = 35;
  const energyBoxW = Math.max(100, w - energyBoxX - 16);
  const energyBoxH = 130;

  if (energyBoxW > 90) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.fillRect(energyBoxX, energyBoxY, energyBoxW, energyBoxH);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(energyBoxX, energyBoxY, energyBoxW, energyBoxH);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "left";
    ctx.fillText("Energy Exchange", energyBoxX + 8, energyBoxY + 18);

    // Kinetic Energy (KE) Bar (Green)
    const barMaxW = Math.max(30, energyBoxW - 48);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "8.5px monospace";
    ctx.fillText("KE:", energyBoxX + 8, energyBoxY + 44);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(energyBoxX + 30, energyBoxY + 34, barMaxW, 11);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(energyBoxX + 30, energyBoxY + 34, barMaxW * keFraction, 11);

    ctx.fillStyle = "#4ade80";
    ctx.textAlign = "right";
    ctx.fillText(`${(keFraction * 100).toFixed(0)}%`, energyBoxX + energyBoxW - 6, energyBoxY + 44);

    // Potential Energy (PE) Bar (Orange)
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "left";
    ctx.fillText("PE:", energyBoxX + 8, energyBoxY + 70);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(energyBoxX + 30, energyBoxY + 60, barMaxW, 11);
    ctx.fillStyle = "#f97316";
    ctx.fillRect(energyBoxX + 30, energyBoxY + 60, barMaxW * peFraction, 11);

    ctx.fillStyle = "#fb923c";
    ctx.textAlign = "right";
    ctx.fillText(`${(peFraction * 100).toFixed(0)}%`, energyBoxX + energyBoxW - 6, energyBoxY + 70);

    // Total Energy Bar (Blue)
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "left";
    ctx.fillText("Tot:", energyBoxX + 8, energyBoxY + 96);

    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(energyBoxX + 30, energyBoxY + 86, barMaxW, 11);

    ctx.fillStyle = "#93c5fd";
    ctx.textAlign = "right";
    ctx.fillText("100%", energyBoxX + energyBoxW - 6, energyBoxY + 96);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("E = KE + PE", energyBoxX + energyBoxW / 2, energyBoxY + 120);
  }
}
