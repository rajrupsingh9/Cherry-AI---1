export function calculateTitrationPH(vAddedMl: number): number {
  const vAcidMl = 25.0; // 25 mL of 0.1M HCl
  const mAcid = 0.1;
  const mBase = 0.1;

  const nAcid = mAcid * (vAcidMl / 1000);
  const nBase = mBase * (vAddedMl / 1000);
  const totalVolL = (vAcidMl + vAddedMl) / 1000;

  if (Math.abs(nAcid - nBase) < 1e-7) {
    return 7.0; // Neutral Equivalence Point
  } else if (nAcid > nBase) {
    const concH = (nAcid - nBase) / totalVolL;
    const ph = -Math.log10(concH);
    return Math.max(1.0, Math.min(6.99, ph));
  } else {
    const concOH = (nBase - nAcid) / totalVolL;
    const poh = -Math.log10(concOH);
    const ph = 14.0 - poh;
    return Math.max(7.01, Math.min(13.5, ph));
  }
}

export function getIndicatorColor(ph: number, indicatorType: number): { color: string; rgb: string; name: string } {
  // 1: Phenolphthalein
  if (indicatorType === 1) {
    if (ph < 8.2) {
      return { color: "rgba(226, 232, 240, 0.4)", rgb: "226, 232, 240", name: "Colorless (Acidic/Neutral)" };
    } else if (ph <= 10.0) {
      const alpha = 0.3 + ((ph - 8.2) / 1.8) * 0.5;
      return { color: `rgba(244, 114, 182, ${alpha})`, rgb: "244, 114, 182", name: "Light Pink (Endpoint Range)" };
    } else {
      return { color: "rgba(236, 72, 153, 0.85)", rgb: "236, 72, 153", name: "Deep Pink / Magenta (Alkaline)" };
    }
  }

  // 2: Methyl Orange
  if (indicatorType === 2) {
    if (ph < 3.1) {
      return { color: "rgba(239, 68, 68, 0.8)", rgb: "239, 68, 68", name: "Red (Strong Acid)" };
    } else if (ph <= 4.4) {
      return { color: "rgba(249, 115, 22, 0.8)", rgb: "249, 115, 22", name: "Orange (Transition Range)" };
    } else {
      return { color: "rgba(234, 179, 8, 0.8)", rgb: "234, 179, 8", name: "Yellow (Neutral/Basic)" };
    }
  }

  // 3: Universal Indicator (Full spectrum pH 1-14)
  if (ph < 3) return { color: "rgba(239, 68, 68, 0.85)", rgb: "239, 68, 68", name: "Red (Strong Acid, pH 1-2)" };
  if (ph < 6) return { color: "rgba(249, 115, 22, 0.85)", rgb: "249, 115, 22", name: "Orange/Yellow (Weak Acid, pH 3-5)" };
  if (ph <= 7.5) return { color: "rgba(34, 197, 94, 0.85)", rgb: "34, 197, 94", name: "Emerald Green (Neutral, pH 7)" };
  if (ph < 11) return { color: "rgba(59, 130, 246, 0.85)", rgb: "59, 130, 246", name: "Blue (Alkaline, pH 8-10)" };
  return { color: "rgba(168, 85, 247, 0.85)", rgb: "168, 85, 247", name: "Violet/Purple (Strong Base, pH 11-14)" };
}

export function drawAcidBaseTitration(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Record<string, number>,
  t: number
) {
  const vAdded = p.titrantVolume || 0; // mL of NaOH
  const indicatorType = p.indicatorType || 1;
  const dripRate = p.dripRate || 0;

  // Calculate live pH
  const ph = calculateTitrationPH(vAdded);
  const indInfo = getIndicatorColor(ph, indicatorType);

  // Left apparatus layout (Burette + Conical Flask)
  const apparatusX = Math.max(50, Math.min(w * 0.26, 120));
  const buretteTopY = 25;
  const buretteH = Math.max(45, Math.min(130, h * 0.38));
  const buretteBottomY = buretteTopY + buretteH;
  const flaskTopY = buretteBottomY + Math.max(16, Math.min(26, h * 0.08));
  const flaskH = Math.max(42, Math.min(95, h - flaskTopY - 18));
  const flaskBottomY = flaskTopY + flaskH;

  // 1. Burette Glass Column with Graduations
  ctx.strokeStyle = "#94a3b8";
  ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
  ctx.lineWidth = 2;
  const buretteW = 20;

  // Burette tube
  ctx.strokeRect(apparatusX - buretteW / 2, buretteTopY, buretteW, buretteBottomY - buretteTopY);

  // Titrant (0.1M NaOH) liquid inside burette
  const fillFraction = Math.max(0, 1 - vAdded / 50); // empty as volume dispensed
  const liquidHeight = (buretteBottomY - buretteTopY) * fillFraction;
  const liquidTopY = buretteBottomY - liquidHeight;

  ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
  ctx.fillRect(apparatusX - buretteW / 2 + 1, liquidTopY, buretteW - 2, liquidHeight);

  // Burette Calibration Ticks (0 to 50 mL)
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  for (let ml = 0; ml <= 50; ml += 10) {
    const tickY = buretteTopY + ((buretteBottomY - buretteTopY) * ml) / 50;
    ctx.beginPath();
    ctx.moveTo(apparatusX + buretteW / 2 - 6, tickY);
    ctx.lineTo(apparatusX + buretteW / 2, tickY);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "8px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${ml}`, apparatusX + buretteW / 2 + 3, tickY + 3);
  }

  // Burette Nozzle Tip & Stopcock
  ctx.beginPath();
  ctx.moveTo(apparatusX - buretteW / 2, buretteBottomY);
  ctx.lineTo(apparatusX, buretteBottomY + 16);
  ctx.lineTo(apparatusX + buretteW / 2, buretteBottomY);
  ctx.stroke();

  // Stopcock Valve Handle
  ctx.fillStyle = dripRate > 0 ? "#10b981" : "#ef4444";
  ctx.fillRect(apparatusX - 10, buretteBottomY + 4, 20, 6);

  // 2. Animated Dripping Drops from Burette Tip
  if (dripRate > 0 || (vAdded > 0 && vAdded < 50)) {
    const dropProgress = (t * 3) % 1;
    const dropY = buretteBottomY + 16 + dropProgress * Math.max(8, flaskTopY - buretteBottomY);

    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(apparatusX, dropY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Conical Flask (Erlenmeyer) with Analyte Liquid
  const flaskNeckH = Math.max(8, Math.min(16, flaskH * 0.22));
  const flaskBodyH = Math.max(20, flaskH - flaskNeckH);
  const flaskNeckW = Math.max(18, Math.min(26, flaskH * 0.32));
  const flaskBaseW = Math.max(46, Math.min(80, flaskH * 0.95));

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(apparatusX - flaskNeckW / 2, flaskTopY);
  ctx.lineTo(apparatusX - flaskNeckW / 2, flaskTopY + flaskNeckH);
  ctx.lineTo(apparatusX - flaskBaseW / 2, flaskBottomY);
  ctx.lineTo(apparatusX + flaskBaseW / 2, flaskBottomY);
  ctx.lineTo(apparatusX + flaskNeckW / 2, flaskTopY + flaskNeckH);
  ctx.lineTo(apparatusX + flaskNeckW / 2, flaskTopY);
  ctx.stroke();

  // Liquid inside Flask
  const flaskLiquidH = Math.max(10, Math.min(flaskBodyH * 0.72, 38));
  const flaskLiquidTopY = flaskBottomY - flaskLiquidH;
  const liquidFraction = Math.max(0.1, Math.min(0.85, flaskLiquidH / flaskBodyH));
  const liquidWAtTop = Math.max(flaskNeckW + 4, flaskBaseW - liquidFraction * (flaskBaseW - flaskNeckW));

  ctx.save();
  ctx.fillStyle = indInfo.color;
  ctx.beginPath();
  ctx.moveTo(apparatusX - liquidWAtTop / 2, flaskLiquidTopY);
  ctx.lineTo(apparatusX - flaskBaseW / 2 + 2, flaskBottomY - 2);
  ctx.lineTo(apparatusX + flaskBaseW / 2 - 2, flaskBottomY - 2);
  ctx.lineTo(apparatusX + liquidWAtTop / 2, flaskLiquidTopY);
  ctx.closePath();
  ctx.fill();

  // Ripple effect at liquid surface - strictly guarded against negative major/minor radius
  const rx = Math.max(4, liquidWAtTop / 2 - 2);
  const ry = Math.max(1.5, Math.abs(2.5 + Math.sin(t * 8) * 1.5));
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(apparatusX, flaskLiquidTopY, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4. White Tile Base
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(apparatusX - flaskBaseW / 2 - 8, flaskBottomY, flaskBaseW + 16, 6);

  // 5. Right Side: Real-Time pH Titration S-Curve Plot
  const graphX = apparatusX + flaskBaseW / 2 + 18;
  const graphY = 35;
  const graphW = Math.max(90, w - graphX - 16);
  const graphH = Math.min(180, h - 60);

  if (graphW > 80 && graphH > 90) {
    // Graph Box Background
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.fillRect(graphX, graphY, graphW, graphH);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(graphX, graphY, graphW, graphH);

    // Neutral line (pH = 7)
    const neutralY = graphY + graphH * (1 - 7 / 14);
    ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(graphX, neutralY);
    ctx.lineTo(graphX + graphW, neutralY);
    ctx.stroke();

    // Equivalence line (V = 25 mL)
    const eqX = graphX + (graphW * 25) / 50;
    ctx.strokeStyle = "rgba(236, 72, 153, 0.4)";
    ctx.beginPath();
    ctx.moveTo(eqX, graphY);
    ctx.lineTo(eqX, graphY + graphH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot Full Theoretical S-Curve
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let vSample = 0; vSample <= 50; vSample += 0.5) {
      const samplePH = calculateTitrationPH(vSample);
      const px = graphX + (graphW * vSample) / 50;
      const py = graphY + graphH * (1 - samplePH / 14);
      if (vSample === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Current Operating Point on S-Curve
    const currentPX = graphX + (graphW * vAdded) / 50;
    const currentPY = graphY + graphH * (1 - ph / 14);

    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.arc(currentPX, currentPY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Graph Title & Axes Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "8.5px monospace";
    ctx.textAlign = "center";
    ctx.fillText("pH vs V(NaOH)", graphX + graphW / 2, graphY - 8);
    ctx.fillText("0", graphX + 8, graphY + graphH + 10);
    ctx.fillText("25", eqX, graphY + graphH + 10);
    ctx.fillText("50", graphX + graphW - 8, graphY + graphH + 10);

    ctx.textAlign = "right";
    ctx.fillText("14", graphX - 2, graphY + 8);
    ctx.fillText("7", graphX - 2, neutralY + 3);
    ctx.fillText("0", graphX - 2, graphY + graphH);
  }
}
