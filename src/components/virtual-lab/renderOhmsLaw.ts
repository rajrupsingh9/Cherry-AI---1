export function drawOhmsLawCircuit(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Record<string, number>,
  t: number
) {
  const V = p.voltage || 12;
  const R = p.resistance || 6;
  const isClosed = (p.switchState ?? 1) === 1;

  // Ohm's Law calculation
  const I = isClosed ? V / R : 0; // Current in Amperes
  const powerWatts = isClosed ? V * I : 0; // P = V * I

  // Circuit layout coordinates with safe margins
  const leftX = Math.max(34, w * 0.14);
  const rightX = Math.min(w - 34, w * 0.86);
  const topY = Math.max(50, Math.min(h * 0.25, 75));
  const bottomY = Math.min(h - 38, h * 0.78);

  // 1. Draw Main Conductive Wire Loop
  ctx.strokeStyle = isClosed ? "#64748b" : "#475569";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(leftX, topY);
  ctx.lineTo(rightX, topY);
  ctx.lineTo(rightX, bottomY);
  ctx.lineTo(leftX, bottomY);
  ctx.closePath();
  ctx.stroke();

  // 2. Animated Flowing Electrons (Blue Particles)
  if (isClosed && I > 0) {
    const perimeter = 2 * (rightX - leftX) + 2 * (bottomY - topY);
    const numElectrons = 24;
    const speed = (I * 80) % perimeter; // Drift velocity proportional to current

    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 6;

    for (let k = 0; k < numElectrons; k++) {
      const dist = (k * (perimeter / numElectrons) + t * I * 60) % perimeter;
      let ex = 0;
      let ey = 0;

      // Map perimeter distance to rectangular path
      const topLen = rightX - leftX;
      const rightLen = bottomY - topY;
      const botLen = rightX - leftX;

      if (dist < topLen) {
        // Top edge: Left to Right
        ex = leftX + dist;
        ey = topY;
      } else if (dist < topLen + rightLen) {
        // Right edge: Top to Bottom
        ex = rightX;
        ey = topY + (dist - topLen);
      } else if (dist < topLen + rightLen + botLen) {
        // Bottom edge: Right to Left
        ex = rightX - (dist - topLen - rightLen);
        ey = bottomY;
      } else {
        // Left edge: Bottom to Top
        ex = leftX;
        ey = bottomY - (dist - topLen - rightLen - botLen);
      }

      ctx.beginPath();
      ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0; // reset
  }

  // 3. DC Battery Source on Left Edge
  const batY = (topY + bottomY) / 2;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(leftX - 16, batY - 30, 32, 60);

  // Long positive plate
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(leftX - 14, batY - 14);
  ctx.lineTo(leftX + 14, batY - 14);
  ctx.stroke();

  // Short thick negative plate
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(leftX - 8, batY + 12);
  ctx.lineTo(leftX + 8, batY + 12);
  ctx.stroke();

  // Battery Voltage Text
  ctx.fillStyle = "#f87171";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`+`, leftX - 18, batY - 10);
  ctx.fillStyle = "#60a5fa";
  ctx.fillText(`-`, leftX - 18, batY + 16);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`${V}V Battery`, leftX - 22, batY + 3);

  // 4. Load Resistor (Zigzag / Ceramic Block) on Top Edge
  const resX = (leftX + rightX) / 2;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(resX - 35, topY - 14, 70, 28);
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(resX - 35, topY - 14, 70, 28);

  // Resistor color bands
  const bandColors = ["#ef4444", "#3b82f6", "#10b981", "#eab308"];
  for (let b = 0; b < bandColors.length; b++) {
    ctx.fillStyle = bandColors[b];
    ctx.fillRect(resX - 24 + b * 13, topY - 12, 5, 24);
  }
  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 10.5px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`Resistor R = ${R} Ω`, resX, topY - 20);

  // 5. Voltmeter in Parallel across Resistor
  const voltY = Math.max(16, topY - 30);
  if (topY >= 42) {
    ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(resX - 45, topY);
    ctx.lineTo(resX - 45, voltY);
    ctx.lineTo(resX - 18, voltY);
    ctx.moveTo(resX + 45, topY);
    ctx.lineTo(resX + 45, voltY);
    ctx.lineTo(resX + 18, voltY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Voltmeter Dial (V)
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(resX, voltY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#bae6fd";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("V", resX, voltY + 3.5);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 9px monospace";
    ctx.fillText(`${isClosed ? V.toFixed(1) : "0.0"}V`, resX, voltY - 17);
  }

  // 6. Filament Lamp / Load on Right Edge
  const lampY = (topY + bottomY) / 2;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(rightX - 20, lampY - 20, 40, 40);

  // Lamp Bulb Circle
  ctx.save();
  if (isClosed && powerWatts > 0) {
    // Dynamic radiant glow
    const glowRadius = Math.min(60, 20 + Math.sqrt(powerWatts) * 6);
    const radGlow = ctx.createRadialGradient(rightX, lampY, 8, rightX, lampY, glowRadius);
    radGlow.addColorStop(0, "rgba(250, 204, 21, 0.85)");
    radGlow.addColorStop(0.5, "rgba(251, 191, 36, 0.35)");
    radGlow.addColorStop(1, "rgba(251, 191, 36, 0)");
    ctx.fillStyle = radGlow;
    ctx.beginPath();
    ctx.arc(rightX, lampY, glowRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = isClosed && powerWatts > 0 ? "#fef08a" : "#64748b";
  ctx.lineWidth = 2.5;
  ctx.fillStyle = isClosed && powerWatts > 0 ? "#facc15" : "#1e293b";
  ctx.beginPath();
  ctx.arc(rightX, lampY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Filament Cross (X)
  ctx.strokeStyle = isClosed && powerWatts > 0 ? "#ffffff" : "#94a3b8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rightX - 8, lampY - 8);
  ctx.lineTo(rightX + 8, lampY + 8);
  ctx.moveTo(rightX + 8, lampY - 8);
  ctx.lineTo(rightX - 8, lampY + 8);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 9.5px monospace";
  ctx.textAlign = w < 420 ? "center" : "left";
  if (w < 420) {
    ctx.fillText(`Lamp (${powerWatts.toFixed(1)}W)`, rightX, lampY - 22);
  } else {
    ctx.fillText(`Lamp (${powerWatts.toFixed(1)} W)`, rightX + 22, lampY + 4);
  }

  // 7. Ammeter & Plug Key Switch on Bottom Edge
  // Ammeter (A) in series
  const ammeterX = leftX + (rightX - leftX) * 0.35;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(ammeterX - 18, bottomY - 18, 36, 36);

  ctx.fillStyle = "#059669";
  ctx.beginPath();
  ctx.arc(ammeterX, bottomY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a7f3d0";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("A", ammeterX, bottomY + 4);

  ctx.fillStyle = "#34d399";
  ctx.font = "bold 9px monospace";
  ctx.fillText(`${I.toFixed(2)} A`, ammeterX, bottomY + 22);

  // Plug Key Switch (K)
  const switchX = leftX + (rightX - leftX) * 0.72;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(switchX - 22, bottomY - 14, 44, 28);

  ctx.fillStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.arc(switchX - 12, bottomY, 4, 0, Math.PI * 2);
  ctx.arc(switchX + 12, bottomY, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isClosed ? "#10b981" : "#ef4444";
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (isClosed) {
    ctx.moveTo(switchX - 12, bottomY);
    ctx.lineTo(switchX + 12, bottomY);
  } else {
    ctx.moveTo(switchX - 12, bottomY);
    ctx.lineTo(switchX + 8, bottomY - 14); // open angle
  }
  ctx.stroke();

  ctx.fillStyle = isClosed ? "#34d399" : "#f87171";
  ctx.font = "bold 9px monospace";
  ctx.fillText(`Key (${isClosed ? "CLOSED" : "OPEN"})`, switchX, bottomY + 21);
}
