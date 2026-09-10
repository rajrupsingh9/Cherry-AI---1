export function drawCellMicroscope(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Record<string, number>,
  t: number
) {
  const cx = w / 2;
  const cy = h / 2;
  const mag = p.magnification || 100;
  const sampleType = p.sampleType || 1; // 1: Onion Peel (Plant), 2: Human Cheek (Animal), 3: Leaf Stomata
  const focusDial = p.focusDial ?? 50; // 50 is crystal clear
  const stainDye = p.stainDye || 1; // 1: Blue, 2: Safranin, 3: Iodine

  // Focus blur delta (0 is sharp, higher is blurry)
  const blurDist = Math.abs(focusDial - 50);

  // Microscope Circular Viewport
  const radius = Math.min(w, h) * 0.42;

  // 1. Clip circular aperture
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  // Background Slide Light
  const bgColors = [
    "#071a17", // Methylene Blue dark slide
    "#1c0d12", // Safranin pink-dark slide
    "#1a1508", // Iodine golden slide
  ];
  ctx.fillStyle = bgColors[stainDye - 1] || "#071a17";
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  // Color palletes for stains
  const stainConfigs = [
    { wall: "rgba(56, 189, 248, 0.7)", nuc: "rgba(96, 165, 250, 0.9)", cyto: "rgba(14, 116, 144, 0.25)", name: "Methylene Blue" },
    { wall: "rgba(244, 114, 182, 0.7)", nuc: "rgba(236, 72, 153, 0.9)", cyto: "rgba(190, 24, 93, 0.25)", name: "Safranin Red" },
    { wall: "rgba(250, 204, 21, 0.7)", nuc: "rgba(202, 138, 4, 0.9)", cyto: "rgba(161, 98, 7, 0.25)", name: "Iodine Solution" },
  ];
  const stain = stainConfigs[stainDye - 1] || stainConfigs[0];

  // Apply focal blur if focus is not optimal
  if (blurDist > 2) {
    ctx.filter = `blur(${Math.min(10, blurDist * 0.22)}px)`;
  }

  // SAMPLE 1: ONION EPIDERMAL PEEL (Plant Cell - Regular Brick Lattice)
  if (sampleType === 1) {
    const cellW = Math.max(28, (mag / 100) * 44);
    const cellH = cellW * 0.55;
    const cols = Math.ceil((radius * 2) / cellW) + 2;
    const rows = Math.ceil((radius * 2) / cellH) + 2;

    for (let r = -rows; r <= rows; r++) {
      for (let c = -cols; c <= cols; c++) {
        const xStagger = (Math.abs(r) % 2) * (cellW * 0.5);
        const cellX = cx + c * cellW + xStagger;
        const cellY = cy + r * cellH;

        // Rigid Cellulose Cell Wall
        ctx.strokeStyle = stain.wall;
        ctx.lineWidth = Math.max(1.5, cellW * 0.07);
        ctx.fillStyle = stain.cyto;
        ctx.beginPath();
        ctx.roundRect(cellX - cellW * 0.48, cellY - cellH * 0.45, cellW * 0.96, cellH * 0.9, 2);
        ctx.fill();
        ctx.stroke();

        // Large Central Vacuole boundary (if mag >= 100)
        if (mag >= 80) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(cellX, cellY, Math.max(1, cellW * 0.28), Math.max(1, cellH * 0.25), 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Peripheral Nucleus pushed to edge by vacuole
        const nucX = cellX + cellW * 0.28;
        const nucY = cellY - cellH * 0.18;
        const nucR = Math.max(2.5, cellW * 0.11);

        ctx.fillStyle = stain.nuc;
        ctx.beginPath();
        ctx.arc(nucX, nucY, nucR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  // SAMPLE 2: HUMAN CHEEK EPITHELIAL CELLS (Animal Cells - Irregular Squamous Polygonal)
  else if (sampleType === 2) {
    const scale = Math.max(25, (mag / 100) * 40);
    // Draw discrete scattered polygonal cells
    const cellPositions = [
      { x: cx - scale * 1.2, y: cy - scale * 0.8, rot: 0.2 },
      { x: cx + scale * 0.8, y: cy - scale * 1.0, rot: -0.4 },
      { x: cx - scale * 0.2, y: cy + scale * 0.2, rot: 0.1 }, // center cell
      { x: cx + scale * 1.4, y: cy + scale * 0.9, rot: 0.6 },
      { x: cx - scale * 1.5, y: cy + scale * 1.1, rot: -0.3 },
    ];

    cellPositions.forEach((pos) => {
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(pos.rot);

      // Irregular Thin Cell Membrane
      ctx.strokeStyle = stain.wall;
      ctx.lineWidth = 1.8;
      ctx.fillStyle = stain.cyto;

      ctx.beginPath();
      const pts = 8;
      for (let i = 0; i < pts; i++) {
        const ang = (i / pts) * Math.PI * 2;
        const radVar = scale * (0.85 + Math.sin(i * 2 + pos.rot) * 0.15);
        const px = Math.cos(ang) * radVar;
        const py = Math.sin(ang) * radVar * 0.75;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Prominent Centrally Located Nucleus
      ctx.fillStyle = stain.nuc;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(3, scale * 0.18), 0, Math.PI * 2);
      ctx.fill();

      // Cytoplasm Granules (if mag >= 200)
      if (mag >= 200) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        for (let g = 0; g < 6; g++) {
          const gx = Math.sin(g * 2.1) * scale * 0.45;
          const gy = Math.cos(g * 1.7) * scale * 0.35;
          ctx.beginPath();
          ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    });
  }
  // SAMPLE 3: LEAF STOMATA (Guard Cells with Pore & Chloroplasts)
  else {
    const scale = Math.max(25, (mag / 100) * 36);
    const stomataPositions = [
      { x: cx - scale * 1.3, y: cy - scale * 0.8 },
      { x: cx + scale * 1.2, y: cy - scale * 0.9 },
      { x: cx, y: cy }, // Central Stoma
      { x: cx - scale * 1.1, y: cy + scale * 1.2 },
      { x: cx + scale * 1.4, y: cy + scale * 1.0 },
    ];

    stomataPositions.forEach((pos) => {
      // Epidermal cells around stoma
      ctx.strokeStyle = "rgba(74, 222, 128, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, scale * 0.9, 0, Math.PI * 2);
      ctx.stroke();

      // Pair of Kidney/Bean shaped Guard Cells
      ctx.fillStyle = "rgba(34, 197, 94, 0.6)";
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 2;

      // Left Guard Cell
      ctx.beginPath();
      ctx.ellipse(pos.x - scale * 0.22, pos.y, Math.max(1, scale * 0.2), Math.max(1, scale * 0.45), -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Right Guard Cell
      ctx.beginPath();
      ctx.ellipse(pos.x + scale * 0.22, pos.y, Math.max(1, scale * 0.2), Math.max(1, scale * 0.45), 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Central Stomatal Pore (Opening)
      ctx.fillStyle = "#022c22";
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y, Math.max(0.5, scale * 0.08), Math.max(1, scale * 0.32), 0, 0, Math.PI * 2);
      ctx.fill();

      // Chloroplast Dots inside Guard Cells
      ctx.fillStyle = "#86efac";
      for (let k = 0; k < 4; k++) {
        ctx.beginPath();
        ctx.arc(pos.x - scale * 0.22, pos.y - scale * 0.25 + k * scale * 0.16, 2, 0, Math.PI * 2);
        ctx.arc(pos.x + scale * 0.22, pos.y - scale * 0.25 + k * scale * 0.16, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // Reset blur filter
  ctx.filter = "none";
  ctx.restore();

  // 2. Microscope Objective Lens Chassis & Metallic Rim
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Reticle Crosshairs
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - radius, cy);
  ctx.lineTo(cx + radius, cy);
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx, cy + radius);
  ctx.stroke();
}
