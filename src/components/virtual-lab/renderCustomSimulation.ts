import { AISimulationSpec } from "./labTypes";

// Helper: Convert wavelength (nm) to RGB color
export function wavelengthToRGB(wavelength: number): { r: number; g: number; b: number; hex: string } {
  let r = 0, g = 0, b = 0;
  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 750) {
    r = 1;
    g = 0;
    b = 0;
  } else {
    r = 0.2; g = 0.8; b = 1; // Default cyan
  }

  // Intensity factor near vision limits
  let factor = 1.0;
  if (wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength > 700) {
    factor = 0.3 + 0.7 * (750 - wavelength) / (750 - 700);
  }

  const red = Math.round(r * factor * 255);
  const green = Math.round(g * factor * 255);
  const blue = Math.round(b * factor * 255);
  const hex = `rgb(${red}, ${green}, ${blue})`;

  return { r: red, g: green, b: blue, hex };
}

export function renderCustomAISimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: AISimulationSpec,
  params: Record<string, number>,
  simTime: number
) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (spec.visualTheme?.bgTheme === "slate") {
    bgGrad.addColorStop(0, "#090d16");
    bgGrad.addColorStop(1, "#020617");
  } else if (spec.visualTheme?.bgTheme === "navy") {
    bgGrad.addColorStop(0, "#081226");
    bgGrad.addColorStop(1, "#030712");
  } else if (spec.visualTheme?.bgTheme === "lab") {
    bgGrad.addColorStop(0, "#061814");
    bgGrad.addColorStop(1, "#020b08");
  } else {
    bgGrad.addColorStop(0, "#0a0f1d");
    bgGrad.addColorStop(1, "#02040a");
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle coordinate grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Branch by simulation type (with smart keyword normalization if generic)
  let simType = spec.simulationType || "custom_interactive";
  const topicText = `${spec.topic || ""} ${spec.title || ""} ${spec.id || ""}`.toLowerCase();

  if (simType === "custom_interactive" || !simType) {
    if (topicText.includes("vector") || topicText.includes("head-to-tail") || topicText.includes("parallelogram")) {
      simType = "vector_addition";
    } else if (topicText.includes("bernoulli") || topicText.includes("venturi") || topicText.includes("fluid")) {
      simType = "bernoulli_fluid";
    } else if (topicText.includes("dna") || topicText.includes("replication") || topicText.includes("polymerase") || topicText.includes("helix")) {
      simType = "dna_replication";
    } else if (topicText.includes("pendulum") || topicText.includes("shm") || topicText.includes("oscillation")) {
      simType = "pendulum_shm";
    } else if (topicText.includes("refraction") || topicText.includes("snell") || topicText.includes("tir") || topicText.includes("lens")) {
      simType = "optics_refraction";
    } else if (topicText.includes("kepler") || topicText.includes("orbit") || topicText.includes("planet") || topicText.includes("gravity")) {
      simType = "orbital_gravity";
    } else if (topicText.includes("gas") || topicText.includes("piston") || topicText.includes("boyle") || topicText.includes("carnot")) {
      simType = "thermodynamics_gas";
    } else if (topicText.includes("magnet") || topicText.includes("field")) {
      simType = "magnetism_field";
    } else if (topicText.includes("electrolysis") || topicText.includes("hofmann")) {
      simType = "water_electrolysis";
    } else if (topicText.includes("photoelectric")) {
      simType = "photoelectric_effect";
    } else if (topicText.includes("double slit") || topicText.includes("interference")) {
      simType = "wave_interference";
    } else if (topicText.includes("cradle") || topicText.includes("collision")) {
      simType = "particle_collision";
    } else if (topicText.includes("circuit") || topicText.includes("capacitor") || topicText.includes("ohm") || topicText.includes("wheatstone") || topicText.includes("bridge") || topicText.includes("galvanometer")) {
      simType = "circuits_charging";
    } else if (topicText.includes("hall") || topicText.includes("lorentz")) {
      simType = "magnetism_field";
    } else if (topicText.includes("enzyme") || topicText.includes("michaelis") || topicText.includes("catalys")) {
      simType = "chemical_kinetics";
    }
  }

  switch (simType) {
    case "vector_addition":
      renderVectorAdditionSimulation(ctx, width, height, params, simTime);
      break;

    case "bernoulli_fluid":
      renderBernoulliFluidSimulation(ctx, width, height, params, simTime);
      break;

    case "dna_replication":
      renderDNAReplicationSimulation(ctx, width, height, params, simTime);
      break;

    case "optics_refraction":
      renderOpticsRefractionSimulation(ctx, width, height, params, simTime);
      break;

    case "orbital_gravity":
    case "kepler_orbit":
      renderKeplerOrbitSimulation(ctx, width, height, params, simTime);
      break;

    case "pendulum_shm":
      renderPendulumSHMSimulation(ctx, width, height, params, simTime);
      break;
    case "wave_interference":
      if (spec.id.includes("doppler")) {
        renderDopplerSimulation(ctx, width, height, params, simTime);
      } else {
        renderDoubleSlitSimulation(ctx, width, height, params, simTime);
      }
      break;

    case "particle_collision":
      if (spec.id.includes("rutherford")) {
        renderRutherfordSimulation(ctx, width, height, params, simTime);
      } else {
        renderNewtonsCradleSimulation(ctx, width, height, params, simTime);
      }
      break;

    case "circuits_charging":
      renderCapacitorChargingSimulation(ctx, width, height, params, simTime);
      break;

    case "cellular_flow":
      renderPhotosynthesisSimulation(ctx, width, height, params, simTime);
      break;

    case "thermodynamics_gas":
    case "carnot_cycle":
      renderIdealGasPistonSimulation(ctx, width, height, params, simTime);
      break;

    case "projectile_kinetics":
      renderProjectileSimulation(ctx, width, height, params, simTime);
      break;

    case "magnetism_field":
      renderBarMagnetSimulation(ctx, width, height, params, simTime);
      break;

    case "electromagnet":
      renderElectromagnetSimulation(ctx, width, height, params, simTime);
      break;

    case "optics_prism":
      renderPrismDispersionSimulation(ctx, width, height, params, simTime);
      break;

    case "friction_mechanics":
      renderFrictionSimulation(ctx, width, height, params, simTime);
      break;

    case "buoyancy_archimedes":
      renderArchimedesSimulation(ctx, width, height, params, simTime);
      break;

    case "number_line":
      renderNumberLineSimulation(ctx, width, height, params, simTime);
      break;

    case "bohr_atomic_shells":
      renderBohrAtomicSimulation(ctx, width, height, params, simTime);
      break;

    case "chemical_kinetics":
      renderChemicalKineticsSimulation(ctx, width, height, params, simTime);
      break;

    case "heart_circulation":
      renderHeartCirculationSimulation(ctx, width, height, params, simTime);
      break;

    case "osmosis_cells":
      renderOsmosisCellsSimulation(ctx, width, height, params, simTime);
      break;

    case "quadratic_parabola":
      renderQuadraticParabolaSimulation(ctx, width, height, params, simTime);
      break;

    case "pythagoras_geometry":
      renderPythagorasSimulation(ctx, width, height, params, simTime);
      break;

    case "normal_distribution":
      renderNormalDistributionSimulation(ctx, width, height, params, simTime);
      break;

    case "faraday_induction":
      renderFaradayInductionSimulation(ctx, width, height, params, simTime);
      break;

    case "photoelectric_effect":
      renderPhotoelectricSimulation(ctx, width, height, params, simTime);
      break;

    case "water_electrolysis":
      renderWaterElectrolysisSimulation(ctx, width, height, params, simTime);
      break;

    default:
      renderGenericDynamicSimulation(ctx, width, height, spec, params, simTime);
      break;
  }
}

// =========================================================================
// 1. Double Slit Wave Interference Renderer
// =========================================================================
function renderDoubleSlitSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const lambda = params.wavelength || 532; // nm
  const d_mm = params.slitDistance || 0.25; // mm
  const D_m = params.screenDistance || 1.2; // m
  const laserColor = wavelengthToRGB(lambda);

  const centerY = height / 2;
  const laserSourceX = 50;
  const slitPlaneX = width * 0.32;
  const screenX = width * 0.78;
  const slitSeparationPx = Math.min(height * 0.45, Math.max(25, d_mm * 180));
  const s1Y = centerY - slitSeparationPx / 2;
  const s2Y = centerY + slitSeparationPx / 2;

  // 1. Incident Laser Beam
  ctx.save();
  const beamGrad = ctx.createLinearGradient(laserSourceX, 0, slitPlaneX, 0);
  beamGrad.addColorStop(0, `rgba(${laserColor.r}, ${laserColor.g}, ${laserColor.b}, 0.9)`);
  beamGrad.addColorStop(1, `rgba(${laserColor.r}, ${laserColor.g}, ${laserColor.b}, 0.5)`);

  ctx.fillStyle = beamGrad;
  ctx.fillRect(laserSourceX, centerY - 14, slitPlaneX - laserSourceX, 28);

  // Laser Source Box
  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(laserSourceX - 35, centerY - 25, 35, 50, 6);
  ctx.fill();
  ctx.stroke();

  // Laser Emitting Aperture
  ctx.fillStyle = laserColor.hex;
  ctx.shadowColor = laserColor.hex;
  ctx.shadowBlur = 12;
  ctx.fillRect(laserSourceX - 4, centerY - 12, 5, 24);
  ctx.shadowBlur = 0;

  // Source Label
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("LASER", laserSourceX - 18, centerY - 32);
  ctx.fillText(`${lambda} nm`, laserSourceX - 18, centerY + 38);

  // 2. Double Slit Barrier
  ctx.fillStyle = "#334155";
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  const barrierW = 12;

  // Top barrier
  ctx.fillRect(slitPlaneX - barrierW / 2, 0, barrierW, s1Y - 4);
  // Middle barrier between S1 and S2
  ctx.fillRect(slitPlaneX - barrierW / 2, s1Y + 4, barrierW, s2Y - s1Y - 8);
  // Bottom barrier
  ctx.fillRect(slitPlaneX - barrierW / 2, s2Y + 4, barrierW, height - (s2Y + 4));

  // Slit markers S1 and S2
  ctx.fillStyle = laserColor.hex;
  ctx.shadowColor = laserColor.hex;
  ctx.shadowBlur = 10;
  ctx.fillRect(slitPlaneX - 2, s1Y - 4, 4, 8);
  ctx.fillRect(slitPlaneX - 2, s2Y - 4, 4, 8);
  ctx.shadowBlur = 0;

  // Slit Labels
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("S₁", slitPlaneX - 12, s1Y + 4);
  ctx.fillText("S₂", slitPlaneX - 12, s2Y + 4);

  // 3. Expanding Huygens Wavefronts from S1 & S2
  const numRings = 16;
  const maxRadius = screenX - slitPlaneX + 50;
  const ringSpeed = 45; // px/sec
  const wavelengthPx = 22; // visual scale

  ctx.lineWidth = 1.5;
  for (let i = 0; i < numRings; i++) {
    const r = ((simTime * ringSpeed + i * wavelengthPx) % maxRadius);
    const alpha = Math.max(0, 0.45 * (1 - r / maxRadius));
    ctx.strokeStyle = `rgba(${laserColor.r}, ${laserColor.g}, ${laserColor.b}, ${alpha})`;

    // S1 Wavefront arc
    ctx.beginPath();
    ctx.arc(slitPlaneX, s1Y, r, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();

    // S2 Wavefront arc
    ctx.beginPath();
    ctx.arc(slitPlaneX, s2Y, r, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
  }

  // 4. Interference Rays (Constructive & Destructive Nodal Lines)
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;
  // Central axis
  ctx.beginPath();
  ctx.moveTo(slitPlaneX, centerY);
  ctx.lineTo(screenX, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 5. Observation Screen & Fringe Pattern
  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  const screenW = 34;
  ctx.fillRect(screenX, 20, screenW, height - 40);
  ctx.strokeRect(screenX, 20, screenW, height - 40);

  // Calculate physical fringe width β = (λ * D) / d in mm
  // Visual scale mapping for screen fringes
  const fringeSeparationPx = Math.max(12, (lambda * 0.001 * D_m) / (d_mm * 0.05) * 4);

  for (let y = 25; y < height - 25; y += 2) {
    const deltaY = y - centerY;
    // Phase difference delta = (2*pi*d*y) / (lambda * D)
    const phase = (deltaY / fringeSeparationPx) * Math.PI;
    const intensity = Math.pow(Math.cos(phase), 2); // I = I_0 * cos^2(delta/2)

    if (intensity > 0.02) {
      ctx.fillStyle = `rgba(${laserColor.r}, ${laserColor.g}, ${laserColor.b}, ${intensity * 0.95})`;
      ctx.fillRect(screenX + 2, y, screenW - 4, 2);
    }
  }

  // Central Bright Fringe label
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("y=0 (Central Max)", screenX + screenW + 8, centerY + 3);

  // 6. Intensity Curve Graph (Rightmost Panel)
  const graphX = screenX + screenW + 8;
  const graphMaxW = Math.max(40, width - graphX - 20);

  ctx.strokeStyle = `rgba(${laserColor.r}, ${laserColor.g}, ${laserColor.b}, 0.9)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let y = 30; y < height - 30; y += 2) {
    const deltaY = y - centerY;
    const phase = (deltaY / fringeSeparationPx) * Math.PI;
    const intensity = Math.pow(Math.cos(phase), 2);
    const px = graphX + intensity * (graphMaxW - 10);
    if (y === 30) ctx.moveTo(px, y);
    else ctx.lineTo(px, y);
  }
  ctx.stroke();

  // Graph Intensity Label
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText("Intensity I(y)", graphX + 5, 20);

  // Slit Distance Dimension Bracket
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(slitPlaneX - 20, s1Y);
  ctx.lineTo(slitPlaneX - 25, s1Y);
  ctx.lineTo(slitPlaneX - 25, s2Y);
  ctx.lineTo(slitPlaneX - 20, s2Y);
  ctx.stroke();
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`d = ${d_mm} mm`, slitPlaneX - 30, centerY + 4);

  // Screen Distance Dimension Arrow
  ctx.strokeStyle = "#f59e0b";
  ctx.beginPath();
  ctx.moveTo(slitPlaneX, height - 35);
  ctx.lineTo(screenX, height - 35);
  ctx.stroke();
  ctx.fillStyle = "#f59e0b";
  ctx.textAlign = "center";
  ctx.fillText(`D = ${D_m} m`, (slitPlaneX + screenX) / 2, height - 20);

  ctx.restore();
}

// =========================================================================
// 2. Newton's Cradle & Momentum Simulation
// =========================================================================
function renderNewtonsCradleSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const N_lifted = Math.min(3, Math.max(1, Math.round(params.liftedBalls || 1)));
  const thetaDeg = params.releaseAngle || 35;
  const elasticity = params.elasticity || 0.98;
  const mass_g = params.ballMass || 100;

  const totalBalls = 5;
  const radius = Math.min(32, width / 20);
  const stringLength = height * 0.48;
  const topBarY = height * 0.22;
  const centerX = width / 2;

  // Frame Top Bar
  ctx.save();
  ctx.fillStyle = "#334155";
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(centerX - (totalBalls * radius * 1.6), topBarY - 12, totalBalls * radius * 3.2, 14, 4);
  ctx.fill();
  ctx.stroke();

  // Simple harmonic oscillation model for cradle
  const period = 1.4; // seconds
  const omega = (2 * Math.PI) / period;
  const phase = (simTime * omega) % (2 * Math.PI);
  const maxAngleRad = (thetaDeg * Math.PI) / 180;

  // Determine active swinging balls based on half cycle
  let currentAngleLeft = 0;
  let currentAngleRight = 0;

  if (phase < Math.PI) {
    // Left balls swinging
    currentAngleLeft = maxAngleRad * Math.sin(phase);
    currentAngleRight = 0;
  } else {
    // Right balls swinging
    currentAngleLeft = 0;
    currentAngleRight = -maxAngleRad * Math.sin(phase - Math.PI) * elasticity;
  }

  // Draw 5 balls
  for (let i = 0; i < totalBalls; i++) {
    const anchorX = centerX + (i - (totalBalls - 1) / 2) * (radius * 2);
    let ballAngle = 0;

    if (i < N_lifted) {
      ballAngle = currentAngleLeft;
    } else if (i >= totalBalls - N_lifted) {
      ballAngle = currentAngleRight;
    }

    const ballX = anchorX + stringLength * Math.sin(ballAngle);
    const ballY = topBarY + stringLength * Math.cos(ballAngle);

    // Strings (dual V-suspension)
    ctx.strokeStyle = "rgba(226, 232, 240, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(anchorX - 10, topBarY);
    ctx.lineTo(ballX, ballY);
    ctx.moveTo(anchorX + 10, topBarY);
    ctx.lineTo(ballX, ballY);
    ctx.stroke();

    // Steel Ball (Chrome Radial Gradient)
    const ballGrad = ctx.createRadialGradient(
      ballX - radius * 0.35,
      ballY - radius * 0.35,
      radius * 0.1,
      ballX,
      ballY,
      radius
    );
    ballGrad.addColorStop(0, "#ffffff");
    ballGrad.addColorStop(0.3, "#cbd5e1");
    ballGrad.addColorStop(0.7, "#64748b");
    ballGrad.addColorStop(1, "#1e293b");

    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Mass badge
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${mass_g}g`, ballX, ballY + 3);

    // Impulse Transfer Flash at collision bottom
    if (Math.abs(phase - Math.PI) < 0.15 || Math.abs(phase) < 0.15) {
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.beginPath();
      ctx.arc(ballX, ballY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Kinetic Energy and Momentum Meters at bottom
  const meterY = height - 45;
  const currentSpeed = Math.abs(Math.cos(phase)) * Math.sqrt(2 * 9.8 * (stringLength * 0.01) * (1 - Math.cos(maxAngleRad)));
  const totalMomentum = N_lifted * (mass_g / 1000) * currentSpeed;

  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(width * 0.15, meterY - 15, width * 0.7, 34, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`⚡ Conservation Status: Perfect Elastic Transfer (e = ${elasticity.toFixed(2)})`, width * 0.18, meterY + 6);
  ctx.textAlign = "right";
  ctx.fillText(`P_total = ${totalMomentum.toFixed(3)} kg·m/s`, width * 0.82, meterY + 6);

  ctx.restore();
}

// =========================================================================
// 3. RC Circuit & Capacitor Charging Simulation
// =========================================================================
function renderCapacitorChargingSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const V0 = params.supplyVoltage || 12;
  const R_k = params.resistance || 5;
  const C_u = params.capacitance || 100;
  const tau_sec = (R_k * C_u) / 1000; // Tau in seconds
  const isCharging = (params.switchMode ?? 1) === 1;

  // Time normalized to circuit charging cycle (0 to 5 tau)
  const cycleTime = simTime % 6.0;
  const fraction = isCharging ? (1 - Math.exp(-cycleTime / tau_sec)) : Math.exp(-cycleTime / tau_sec);
  const instantVoltage = V0 * fraction;
  const instantCurrent = (V0 / (R_k * 1000)) * Math.exp(-cycleTime / tau_sec) * 1000; // mA

  const circuitLeft = width * 0.08;
  const circuitRight = width * 0.52;
  const circuitTop = height * 0.22;
  const circuitBottom = height * 0.78;

  ctx.save();

  // 1. Circuit Wires
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";

  ctx.beginPath();
  // Top wire
  ctx.moveTo(circuitLeft, circuitTop);
  ctx.lineTo(circuitRight, circuitTop);
  // Right wire down to capacitor
  ctx.lineTo(circuitRight, circuitBottom);
  // Bottom wire to battery
  ctx.lineTo(circuitLeft, circuitBottom);
  // Left wire up
  ctx.lineTo(circuitLeft, circuitTop);
  ctx.stroke();

  // Moving electron particles on wire
  const electronCount = 20;
  const speed = instantCurrent * 0.8;
  ctx.fillStyle = "#38bdf8";
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 6;

  for (let i = 0; i < electronCount; i++) {
    const progress = (simTime * speed * 0.3 + i / electronCount) % 1.0;
    let ex = circuitLeft, ey = circuitTop;
    if (progress < 0.25) {
      ex = circuitLeft + (progress / 0.25) * (circuitRight - circuitLeft);
      ey = circuitTop;
    } else if (progress < 0.5) {
      ex = circuitRight;
      ey = circuitTop + ((progress - 0.25) / 0.25) * (circuitBottom - circuitTop);
    } else if (progress < 0.75) {
      ex = circuitRight - ((progress - 0.5) / 0.25) * (circuitRight - circuitLeft);
      ey = circuitBottom;
    } else {
      ex = circuitLeft;
      ey = circuitBottom - ((progress - 0.75) / 0.25) * (circuitBottom - circuitTop);
    }
    ctx.beginPath();
    ctx.arc(ex, ey, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  // 2. Battery Source (Left)
  const batteryY = (circuitTop + circuitBottom) / 2;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(circuitLeft - 10, batteryY - 24, 20, 48);

  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 4;
  // Long plate (+)
  ctx.beginPath();
  ctx.moveTo(circuitLeft - 16, batteryY - 14);
  ctx.lineTo(circuitLeft + 16, batteryY - 14);
  ctx.stroke();
  // Short plate (-)
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(circuitLeft - 10, batteryY + 14);
  ctx.lineTo(circuitLeft + 10, batteryY + 14);
  ctx.stroke();

  ctx.fillStyle = "#f59e0b";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`+`, circuitLeft - 22, batteryY - 10);
  ctx.fillText(`-`, circuitLeft - 22, batteryY + 18);
  ctx.fillText(`${V0}V DC`, circuitLeft - 24, batteryY + 4);

  // 3. Series Resistor (Top)
  const resistorX = (circuitLeft + circuitRight) / 2;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(resistorX - 35, circuitTop - 12, 70, 24);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.strokeRect(resistorX - 35, circuitTop - 12, 70, 24);

  // Resistor bands
  ctx.fillStyle = "#ef4444"; ctx.fillRect(resistorX - 22, circuitTop - 10, 5, 20);
  ctx.fillStyle = "#f59e0b"; ctx.fillRect(resistorX - 8, circuitTop - 10, 5, 20);
  ctx.fillStyle = "#10b981"; ctx.fillRect(resistorX + 6, circuitTop - 10, 5, 20);
  ctx.fillStyle = "#eab308"; ctx.fillRect(resistorX + 20, circuitTop - 10, 5, 20);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`R = ${R_k} kΩ`, resistorX, circuitTop - 18);

  // 4. Capacitor Plates (Right)
  const capY = (circuitTop + circuitBottom) / 2;
  const plateW = 44;
  const plateGap = 20;

  // Clear wire behind plates
  ctx.fillStyle = "#020617";
  ctx.fillRect(circuitRight - 25, capY - plateGap - 4, 50, plateGap * 2 + 8);

  // Top plate (+)
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(circuitRight - plateW / 2, capY - plateGap / 2 - 4, plateW, 4);
  // Bottom plate (-)
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(circuitRight - plateW / 2, capY + plateGap / 2, plateW, 4);

  // Electric Field Lines inside capacitor
  const fieldDensity = Math.min(7, Math.max(1, Math.round(fraction * 7)));
  ctx.strokeStyle = `rgba(245, 158, 11, ${fraction * 0.9})`;
  ctx.lineWidth = 1.5;
  for (let f = 0; f < fieldDensity; f++) {
    const fx = circuitRight - plateW / 2 + 6 + (f * (plateW - 12)) / Math.max(1, fieldDensity - 1);
    ctx.beginPath();
    ctx.moveTo(fx, capY - plateGap / 2);
    ctx.lineTo(fx, capY + plateGap / 2);
    ctx.stroke();
  }

  // Capacitor Label
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`C = ${C_u} μF`, circuitRight + 30, capY - 4);
  ctx.fillStyle = "#f59e0b";
  ctx.fillText(`V_c = ${instantVoltage.toFixed(2)} V`, circuitRight + 30, capY + 14);

  // 5. Live Oscilloscope Charging Graph (Right Panel)
  const scopeX = width * 0.62;
  const scopeY = height * 0.22;
  const scopeW = width * 0.34;
  const scopeH = height * 0.56;

  ctx.fillStyle = "#090d16";
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(scopeX, scopeY, scopeW, scopeH, 8);
  ctx.fill();
  ctx.stroke();

  // Grid inside oscilloscope
  ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
  ctx.lineWidth = 1;
  for (let gx = scopeX + 20; gx < scopeX + scopeW; gx += 30) {
    ctx.beginPath(); ctx.moveTo(gx, scopeY); ctx.lineTo(gx, scopeY + scopeH); ctx.stroke();
  }
  for (let gy = scopeY + 20; gy < scopeY + scopeH; gy += 30) {
    ctx.beginPath(); ctx.moveTo(scopeX, gy); ctx.lineTo(scopeX + scopeW, gy); ctx.stroke();
  }

  // V_c(t) curve
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const maxPlotTime = 5 * tau_sec;
  for (let px = 0; px < scopeW - 30; px += 2) {
    const t = (px / (scopeW - 30)) * maxPlotTime;
    const v = V0 * (1 - Math.exp(-t / tau_sec));
    const py = (scopeY + scopeH - 25) - (v / V0) * (scopeH - 50);
    if (px === 0) ctx.moveTo(scopeX + 20 + px, py);
    else ctx.lineTo(scopeX + 20 + px, py);
  }
  ctx.stroke();

  // Current time point marker
  const currentPlotX = scopeX + 20 + (Math.min(cycleTime, maxPlotTime) / maxPlotTime) * (scopeW - 30);
  const currentPlotY = (scopeY + scopeH - 25) - (instantVoltage / V0) * (scopeH - 50);

  ctx.fillStyle = "#f59e0b";
  ctx.shadowColor = "#f59e0b";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(currentPlotX, currentPlotY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 63.2% V0 Mark (1 Tau)
  const tauX = scopeX + 20 + (tau_sec / maxPlotTime) * (scopeW - 30);
  const tauY = (scopeY + scopeH - 25) - (0.632) * (scopeH - 50);
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
  ctx.beginPath();
  ctx.moveTo(tauX, scopeY + scopeH - 25);
  ctx.lineTo(tauX, tauY);
  ctx.lineTo(scopeX + 20, tauY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#f59e0b";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`63.2% (τ = ${(tau_sec * 1000).toFixed(0)}ms)`, tauX + 4, tauY - 4);

  // Scope Header
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("OSCILLOSCOPE: V_C(t) = V₀(1 - e⁻ᵗ/ᴿᶜ)", scopeX + 15, scopeY + 18);

  ctx.restore();
}

// =========================================================================
// 4. Photosynthesis Light Phase (Thylakoid ETC) Simulation
// =========================================================================
function renderPhotosynthesisSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const light = params.lightIntensity || 75;
  const temp = params.temperature || 25;

  const membraneY = height * 0.52;
  const stromaY = height * 0.25;
  const lumenY = height * 0.78;

  ctx.save();

  // 1. Compartment Backgrounds
  // Stroma (Top - Light Green)
  ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
  ctx.fillRect(0, 0, width, membraneY - 25);
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("STROMA (Low H⁺ Concentration / High pH ≈ 8.0)", 20, 30);

  // Thylakoid Lumen (Bottom - Dark Green)
  ctx.fillStyle = "rgba(5, 150, 105, 0.18)";
  ctx.fillRect(0, membraneY + 25, width, height - (membraneY + 25));
  ctx.fillStyle = "#34d399";
  ctx.fillText("THYLAKOID LUMEN (High H⁺ Proton Reservoir / Low pH ≈ 5.5)", 20, height - 20);

  // 2. Lipid Bilayer Membrane
  ctx.fillStyle = "#0f3a2f";
  ctx.strokeStyle = "#059669";
  ctx.lineWidth = 2;
  ctx.fillRect(0, membraneY - 22, width, 44);
  ctx.strokeRect(0, membraneY - 22, width, 44);

  // Lipid head circles
  ctx.fillStyle = "#10b981";
  for (let x = 10; x < width; x += 16) {
    ctx.beginPath(); ctx.arc(x, membraneY - 20, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, membraneY + 20, 4, 0, Math.PI * 2); ctx.fill();
  }

  // 3. Protein Complexes along Membrane
  const ps2X = width * 0.22;
  const cytX = width * 0.44;
  const ps1X = width * 0.65;
  const atpX = width * 0.85;

  // PS II (P680)
  ctx.fillStyle = "#047857";
  ctx.strokeStyle = "#34d399";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(ps2X - 32, membraneY - 35, 64, 70, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PS II", ps2X, membraneY - 5);
  ctx.fillText("P680", ps2X, membraneY + 12);

  // Incoming Photons (Yellow Energy Beams)
  const photonBeamCount = Math.round(light / 20);
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 8;
  for (let p = 0; p < photonBeamCount; p++) {
    const py = ((simTime * 80 + p * 35) % (membraneY - 40));
    ctx.beginPath();
    ctx.moveTo(ps2X - 15 + p * 10, py);
    ctx.lineTo(ps2X - 5 + p * 10, py + 15);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  // Cytochrome b6f
  ctx.fillStyle = "#1e3a8a";
  ctx.strokeStyle = "#60a5fa";
  ctx.beginPath();
  ctx.roundRect(cytX - 26, membraneY - 30, 52, 60, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Cyt b₆f", cytX, membraneY + 4);

  // PS I (P700)
  ctx.fillStyle = "#047857";
  ctx.strokeStyle = "#34d399";
  ctx.beginPath();
  ctx.roundRect(ps1X - 30, membraneY - 35, 60, 70, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText("PS I", ps1X, membraneY - 5);
  ctx.fillText("P700", ps1X, membraneY + 12);

  // ATP Synthase Rotary Engine
  ctx.fillStyle = "#b45309";
  ctx.strokeStyle = "#f59e0b";
  ctx.beginPath();
  ctx.roundRect(atpX - 28, membraneY - 45, 56, 90, 10);
  ctx.fill();
  ctx.stroke();

  // Spinning Rotor Head in Stroma
  const rotorAngle = simTime * 4.0;
  ctx.save();
  ctx.translate(atpX, membraneY - 50);
  ctx.rotate(rotorAngle);
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(-16, -6, 32, 12);
  ctx.fillRect(-6, -16, 12, 32);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText("ATP Synthase", atpX, membraneY + 18);

  // 4. Photolysis (Water Splitting) Reaction at PS II bottom
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 10px sans-serif";
  ctx.fillText("2H₂O → O₂ + 4H⁺ + 4e⁻", ps2X, membraneY + 52);

  // 5. Electron Traveling Particles (Glowing Yellow e⁻)
  const eStep = (simTime * 120) % (ps1X - ps2X + 60);
  ctx.fillStyle = "#fde047";
  ctx.shadowColor = "#fde047";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(ps2X + eStep, membraneY - 15 + Math.sin(simTime * 8) * 6, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 6. Protons (H⁺) accumulating in Lumen & Flowing through ATP Synthase
  const protonCount = 14;
  ctx.fillStyle = "#ec4899";
  for (let i = 0; i < protonCount; i++) {
    const hx = 60 + ((i * 65 + simTime * 25) % (width - 120));
    const hy = membraneY + 35 + Math.sin(i * 2 + simTime * 3) * 16;
    ctx.beginPath();
    ctx.arc(hx, hy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px sans-serif";
    ctx.fillText("H⁺", hx, hy + 3);
    ctx.fillStyle = "#ec4899";
  }

  // ATP Generation Output Callout
  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("⚡ ADP + Pi ➔ ATP (Produced)", atpX, membraneY - 70);

  ctx.restore();
}

// =========================================================================
// 5. Doppler Effect Sound Simulation
// =========================================================================
function renderDopplerSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const v_s = params.sourceSpeed || 120;
  const v_sound = params.soundSpeed || 340;
  const f0 = params.sourceFrequency || 440;

  const centerY = height / 2;
  const trackW = width * 0.75;
  const trackStartX = width * 0.12;

  // Source position traversing track
  const sourceCycleTime = (simTime * (v_s / 80)) % 5.0;
  const sourceX = trackStartX + (sourceCycleTime / 5.0) * trackW;

  ctx.save();

  // Wave emission history (Simulate moving sound waves)
  const waveCount = 12;
  const soundSpeedPx = 90; // px/sec
  ctx.lineWidth = 2;

  for (let w = 0; w < waveCount; w++) {
    const age = ((simTime * 1.5 + w * 0.35) % 3.0);
    const radius = age * soundSpeedPx;
    // Position where this wave was emitted in past
    const emitSourceProgress = Math.max(0, (sourceCycleTime / 5.0) - (age / 5.0) * (v_s / 80));
    const emitX = trackStartX + emitSourceProgress * trackW;

    const alpha = Math.max(0, 0.7 * (1 - age / 3.0));
    ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
    ctx.beginPath();
    ctx.arc(emitX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Moving Vehicle / Siren Source
  ctx.fillStyle = "#ec4899";
  ctx.shadowColor = "#ec4899";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(sourceX, centerY, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Velocity Vector Arrow
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sourceX, centerY);
  ctx.lineTo(sourceX + 45, centerY);
  ctx.stroke();
  // Arrowhead
  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.moveTo(sourceX + 45, centerY - 6);
  ctx.lineTo(sourceX + 55, centerY);
  ctx.lineTo(sourceX + 45, centerY + 6);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Source (v_s = ${v_s} m/s)`, sourceX, centerY - 22);

  // Observer Ahead (Right)
  const obsRightX = width * 0.9;
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(obsRightX, centerY, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("Observer Ahead", obsRightX, centerY - 20);
  const f_ahead = f0 * (v_sound / Math.max(10, v_sound - v_s));
  ctx.fillText(`f' = ${Math.round(f_ahead)} Hz (High Pitch)`, obsRightX, centerY + 25);

  // Observer Behind (Left)
  const obsLeftX = width * 0.08;
  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.arc(obsLeftX, centerY, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Observer Behind", obsLeftX, centerY - 20);
  const f_behind = f0 * (v_sound / (v_sound + v_s));
  ctx.fillText(`f' = ${Math.round(f_behind)} Hz (Low Pitch)`, obsLeftX, centerY + 25);

  ctx.restore();
}

// =========================================================================
// 6. Rutherford Alpha Scattering Simulation
// =========================================================================
function renderRutherfordSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const K = params.alphaEnergy || 5.5;
  const Z = params.atomicNumber || 79;

  const nucleusX = width * 0.62;
  const nucleusY = height / 2;

  ctx.save();

  // 1. Gold Nucleus (+Ze concentrated core)
  const nucleusGrad = ctx.createRadialGradient(nucleusX, nucleusY, 4, nucleusX, nucleusY, 28);
  nucleusGrad.addColorStop(0, "#fde047");
  nucleusGrad.addColorStop(0.5, "#eab308");
  nucleusGrad.addColorStop(1, "#ca8a04");

  ctx.fillStyle = nucleusGrad;
  ctx.shadowColor = "#eab308";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(nucleusX, nucleusY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#000000";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`+${Z}e`, nucleusX, nucleusY + 4);

  ctx.fillStyle = "#eab308";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText(`Gold Nucleus (Z=${Z})`, nucleusX, nucleusY + 34);

  // 2. Alpha Particle Trajectories with various impact parameters 'b'
  const impactParams = [-80, -50, -25, -8, 0, 8, 25, 50, 80];

  ctx.lineWidth = 2;
  for (let idx = 0; idx < impactParams.length; idx++) {
    const b = impactParams[idx];
    const initialY = nucleusY + b;

    ctx.strokeStyle = "rgba(253, 224, 71, 0.45)";
    ctx.beginPath();
    ctx.moveTo(50, initialY);

    if (b === 0) {
      // Head-on collision (180 deg rebound)
      const closestX = nucleusX - 35 * (79 / Z) * (5.5 / K);
      ctx.lineTo(closestX, initialY);
      // Rebound line back
      ctx.stroke();

      // Moving particle dot
      const cycle = (simTime * 2.0) % 2.0;
      let px = 50 + cycle * (closestX - 50);
      if (cycle > 1.0) {
        px = closestX - (cycle - 1.0) * (closestX - 50);
      }
      ctx.fillStyle = "#ec4899";
      ctx.beginPath(); ctx.arc(px, initialY, 4, 0, Math.PI * 2); ctx.fill();
    } else {
      // Hyperbolic deflection path
      const theta = 2 * Math.atan((1.44 * Z) / (Math.abs(b) * K * 0.4));
      const deflAngle = b > 0 ? theta : -theta;

      ctx.quadraticCurveTo(nucleusX - 25, initialY, nucleusX + 160 * Math.cos(deflAngle), nucleusY + 160 * Math.sin(deflAngle));
      ctx.stroke();

      // Moving particle along hyperbolic trajectory
      const tProgress = ((simTime * 1.6 + idx * 0.22) % 1.5) / 1.5;
      const curX = 50 + tProgress * (width * 0.85);
      const curY = initialY + Math.sin(tProgress * Math.PI) * (b > 0 ? 50 : -50) * Math.sin(deflAngle);

      ctx.fillStyle = "#facc15";
      ctx.beginPath(); ctx.arc(curX, curY, 3.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Alpha Gun Source
  ctx.fillStyle = "#334155";
  ctx.fillRect(20, height * 0.35, 30, height * 0.3);
  ctx.fillStyle = "#facc15";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Alpha (He²⁺)", 15, height * 0.32);
  ctx.fillText(`${K} MeV`, 15, height * 0.69);

  ctx.restore();
}

// =========================================================================
// 7. Ideal Gas & Piston Thermodynamics Simulation
// =========================================================================
function renderIdealGasPistonSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const T = params.temperature || 300;
  const V_L = params.chamberVolume || 5;
  const n = params.moleCount || 1.0;

  // Pressure P = nRT / V
  const P_kPa = (n * 8.314 * T) / V_L;
  const rmsSpeed = Math.sqrt((3 * 8.314 * T) / 0.028); // Speed scale

  const chamberX = width * 0.12;
  const chamberW = width * 0.42;
  const chamberBottomY = height * 0.82;
  const chamberMaxH = height * 0.6;
  const pistonH = (V_L / 10) * chamberMaxH;
  const pistonY = chamberBottomY - pistonH;

  ctx.save();

  // 1. Cylinder Chamber Walls
  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 6;
  ctx.beginPath();
  // Left wall
  ctx.moveTo(chamberX, chamberBottomY - chamberMaxH - 20);
  ctx.lineTo(chamberX, chamberBottomY);
  // Bottom base
  ctx.lineTo(chamberX + chamberW, chamberBottomY);
  // Right wall
  ctx.lineTo(chamberX + chamberW, chamberBottomY - chamberMaxH - 20);
  ctx.stroke();

  // 2. Gas Chamber Interior
  const tempRatio = Math.min(1, Math.max(0, (T - 100) / 500));
  const gasR = Math.round(56 + tempRatio * 180);
  const gasB = Math.round(248 - tempRatio * 180);
  ctx.fillStyle = `rgba(${gasR}, 60, ${gasB}, 0.18)`;
  ctx.fillRect(chamberX + 3, pistonY, chamberW - 6, chamberBottomY - pistonY);

  // 3. Movable Piston Head
  ctx.fillStyle = "#475569";
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.fillRect(chamberX + 3, pistonY - 18, chamberW - 6, 18);
  ctx.strokeRect(chamberX + 3, pistonY - 18, chamberW - 6, 18);

  // Piston Rod
  ctx.fillStyle = "#64748b";
  ctx.fillRect(chamberX + chamberW / 2 - 10, pistonY - 90, 20, 72);

  // 4. Bouncing Gas Particles (Kinetic Theory)
  const particleCount = 35;
  const speedScale = (rmsSpeed / 500) * 80;

  for (let i = 0; i < particleCount; i++) {
    // Pseudo-chaotic particle positions inside current chamber bounds
    const seedX = (Math.sin(i * 17.3 + simTime * speedScale * 0.05) + 1) / 2;
    const seedY = (Math.cos(i * 31.7 + simTime * speedScale * 0.05) + 1) / 2;
    const px = chamberX + 12 + seedX * (chamberW - 24);
    const py = pistonY + 10 + seedY * (chamberBottomY - pistonY - 20);

    ctx.fillStyle = `rgb(${gasR}, 180, ${gasB})`;
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Pressure Gauge Dial (Center Right)
  const dialX = width * 0.72;
  const dialY = height * 0.45;
  const dialR = Math.min(65, width * 0.12);

  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(dialX, dialY, dialR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Dial Ticks
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.5;
  for (let a = -Math.PI * 0.75; a <= Math.PI * 0.75; a += Math.PI * 0.25) {
    const tx1 = dialX + (dialR - 10) * Math.cos(a);
    const ty1 = dialY + (dialR - 10) * Math.sin(a);
    const tx2 = dialX + dialR * Math.cos(a);
    const ty2 = dialY + dialR * Math.sin(a);
    ctx.beginPath(); ctx.moveTo(tx1, ty1); ctx.lineTo(tx2, ty2); ctx.stroke();
  }

  // Dial Needle
  const maxP = 1200; // kPa
  const pRatio = Math.min(1, P_kPa / maxP);
  const needleAngle = -Math.PI * 0.75 + pRatio * (Math.PI * 1.5);

  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(dialX, dialY);
  ctx.lineTo(dialX + (dialR - 14) * Math.cos(needleAngle), dialY + (dialR - 14) * Math.sin(needleAngle));
  ctx.stroke();

  // Dial Center Cap
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.arc(dialX, dialY, 5, 0, Math.PI * 2); ctx.fill();

  // Pressure readout text
  ctx.fillStyle = "#ef4444";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${P_kPa.toFixed(1)} kPa`, dialX, dialY + dialR + 25);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText("PRESSURE GAUGE", dialX, dialY - dialR - 12);

  ctx.restore();
}

// =========================================================================
// 8. Projectile Motion Simulation
// =========================================================================
function renderProjectileSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const u = params.initialSpeed || 30; // m/s
  const thetaDeg = params.launchAngle || 45;
  const g = params.gravity || 9.8;
  const thetaRad = (thetaDeg * Math.PI) / 180;

  const launchX = width * 0.12;
  const groundY = height * 0.82;

  // Theoretical metrics
  const T_flight = (2 * u * Math.sin(thetaRad)) / g;
  const R_max = (u * u * Math.sin(2 * thetaRad)) / g;
  const H_max = (u * u * Math.pow(Math.sin(thetaRad), 2)) / (2 * g);

  // Visual scaling factors
  const scaleX = (width * 0.75) / Math.max(40, R_max * 1.2);
  const scaleY = (height * 0.6) / Math.max(20, H_max * 1.3);

  ctx.save();

  // 1. Ground Surface
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.05, groundY);
  ctx.lineTo(width * 0.95, groundY);
  ctx.stroke();

  // 2. Parabolic Trajectory Path (Dotted Arc)
  ctx.strokeStyle = "rgba(139, 92, 246, 0.65)";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();

  const steps = 60;
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * T_flight;
    const x = u * Math.cos(thetaRad) * t;
    const y = u * Math.sin(thetaRad) * t - 0.5 * g * t * t;
    const px = launchX + x * scaleX;
    const py = groundY - y * scaleY;
    if (s === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // 3. Apex Height Marker
  const apexX = launchX + (R_max / 2) * scaleX;
  const apexY = groundY - H_max * scaleY;
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath(); ctx.arc(apexX, apexY, 4, 0, Math.PI * 2); ctx.fill();
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Apex H = ${H_max.toFixed(1)}m`, apexX, apexY - 10);

  // 4. Moving Projectile Ball
  const simT = simTime % (T_flight + 0.8);
  const activeT = Math.min(simT, T_flight);

  const curX = u * Math.cos(thetaRad) * activeT;
  const curY = u * Math.sin(thetaRad) * activeT - 0.5 * g * activeT * activeT;
  const ballPx = launchX + curX * scaleX;
  const ballPy = groundY - Math.max(0, curY) * scaleY;

  // Glowing Projectile
  ctx.fillStyle = "#8b5cf6";
  ctx.shadowColor = "#8b5cf6";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(ballPx, ballPy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Velocity Vector Arrows (v_x, v_y)
  const curVx = u * Math.cos(thetaRad);
  const curVy = u * Math.sin(thetaRad) - g * activeT;

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ballPx, ballPy);
  ctx.lineTo(ballPx + curVx * 1.5, ballPy - curVy * 1.5);
  ctx.stroke();

  // Launcher Cannon
  ctx.save();
  ctx.translate(launchX, groundY);
  ctx.rotate(-thetaRad);
  ctx.fillStyle = "#64748b";
  ctx.fillRect(-8, -10, 36, 20);
  ctx.restore();

  // Range text at ground landing
  const landX = launchX + R_max * scaleX;
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Landing: R = ${R_max.toFixed(1)}m`, landX, groundY + 22);

  ctx.restore();
}

// =========================================================================
// 9. Generic Custom Interactive Model (Parametric Dynamic Canvas)
// =========================================================================
function renderGenericDynamicSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: AISimulationSpec,
  params: Record<string, number>,
  simTime: number
) {
  const centerY = height * 0.54;
  const centerX = width / 2;
  const pKeys = Object.keys(params);
  const p1 = params[pKeys[0]] ?? 50;
  const p2 = params[pKeys[1]] ?? 50;
  const p3 = params[pKeys[2]] ?? 20;

  ctx.save();

  // 1. Grid Background
  ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
  ctx.lineWidth = 1;
  const gridStep = 30;
  ctx.beginPath();
  for (let x = 0; x < width; x += gridStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y < height; y += gridStep) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // 2. Central Reference Axes
  ctx.strokeStyle = "rgba(148, 163, 184, 0.28)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(30, centerY);
  ctx.lineTo(width - 30, centerY);
  ctx.moveTo(centerX, 70);
  ctx.lineTo(centerX, height - 20);
  ctx.stroke();

  // 3. Animated sinusoidal multi-wave field (Parametric)
  ctx.lineWidth = 2.5;
  const colors = ["#38bdf8", "#10b981", "#f59e0b", "#ec4899"];

  for (let k = 0; k < 3; k++) {
    const waveColor = colors[k % colors.length];
    ctx.strokeStyle = waveColor;
    ctx.beginPath();

    const freq = 0.01 + (p1 / 100) * 0.02 * (k + 1);
    const amp = 25 + (p2 / 100) * 35 * (k * 0.4 + 1);

    for (let x = 30; x < width - 30; x += 3) {
      const y = centerY + Math.sin((x - centerX) * freq + simTime * 3 + k * 1.2) * amp;
      if (x === 30) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // 4. Floating reactive particle nodes
  const nodeCount = 10;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 + simTime * 0.9;
    const dist = 60 + Math.sin(simTime * 2 + i) * (p3 * 0.8 + 10);
    const nx = centerX + Math.cos(angle) * dist;
    const ny = centerY + Math.sin(angle) * dist;

    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 5. Header HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 340), 72, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(spec.title || spec.topic, 24, 34);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`${spec.category || "Interactive Dynamic Simulation"}`, 24, 52);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  const pSummary = pKeys.slice(0, 2).map(k => `${k}: ${params[k]}`).join(" | ");
  ctx.fillText(pSummary || "Active real-time simulation model", 24, 68);

  ctx.restore();
}

// =========================================================================
// 10. Bar Magnet & Magnetic Field Lines Renderer
// =========================================================================
function renderBarMagnetSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const strength = (params.magnetStrength ?? 70) / 100;
  const compassDist = params.compassDistance ?? 100;
  const compassAngleDeg = params.compassAngle ?? 45;
  const showFilings = (params.showFilings ?? 60) > 20;

  const cx = width * 0.46;
  const cy = height * 0.5;
  const magW = Math.min(180, width * 0.32);
  const magH = 44;

  ctx.save();

  // 1. Magnetic Field Curves (Loops from North to South)
  const loopCount = 6;
  ctx.lineWidth = 1.6;

  for (let i = 1; i <= loopCount; i++) {
    const spreadY = (magH / 2) + i * 28;
    const spreadX = (magW / 2) + i * 36;
    const alpha = Math.max(0.15, (0.75 - i * 0.09) * strength);

    ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;

    // Top loop (N -> S)
    ctx.beginPath();
    ctx.moveTo(cx - magW / 2 + 10, cy - 10);
    ctx.bezierCurveTo(
      cx - spreadX, cy - spreadY * 1.5,
      cx + spreadX, cy - spreadY * 1.5,
      cx + magW / 2 - 10, cy - 10
    );
    ctx.stroke();

    // Direction arrow on top loop
    const arrowX = cx;
    const arrowY = cy - spreadY * 1.08;
    ctx.fillStyle = `rgba(56, 189, 248, ${Math.min(1, alpha + 0.3)})`;
    ctx.beginPath();
    ctx.moveTo(arrowX + 5, arrowY);
    ctx.lineTo(arrowX - 5, arrowY - 4);
    ctx.lineTo(arrowX - 5, arrowY + 4);
    ctx.closePath();
    ctx.fill();

    // Bottom loop (N -> S)
    ctx.beginPath();
    ctx.moveTo(cx - magW / 2 + 10, cy + 10);
    ctx.bezierCurveTo(
      cx - spreadX, cy + spreadY * 1.5,
      cx + spreadX, cy + spreadY * 1.5,
      cx + magW / 2 - 10, cy + 10
    );
    ctx.stroke();

    // Direction arrow on bottom loop
    const bArrowY = cy + spreadY * 1.08;
    ctx.beginPath();
    ctx.moveTo(bArrowX(arrowX), bArrowY);
    ctx.lineTo(bArrowX(arrowX) - 5, bArrowY - 4);
    ctx.lineTo(bArrowX(arrowX) - 5, bArrowY + 4);
    ctx.closePath();
    ctx.fill();
  }

  function bArrowX(x: number) { return x; }

  // 2. Iron Filings particles (Scattered magnetic dust)
  if (showFilings) {
    ctx.fillStyle = "rgba(203, 213, 225, 0.4)";
    const dustCount = 80;
    for (let d = 0; d < dustCount; d++) {
      const angle = (d / dustCount) * Math.PI * 2;
      const radius = 60 + (d * 17) % 130;
      const fx = cx + Math.cos(angle) * radius * 1.2;
      const fy = cy + Math.sin(angle) * radius * 0.85;
      ctx.fillRect(fx, fy, 2, 1.5);
    }
  }

  // 3. The Physical Bar Magnet
  const leftX = cx - magW / 2;
  const topY = cy - magH / 2;

  // Shadow/Glow
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 12;

  // North Pole (Red half on Left)
  const redGrad = ctx.createLinearGradient(leftX, topY, leftX + magW / 2, topY + magH);
  redGrad.addColorStop(0, "#ef4444");
  redGrad.addColorStop(1, "#b91c1c");
  ctx.fillStyle = redGrad;
  ctx.beginPath();
  ctx.roundRect(leftX, topY, magW / 2, magH, [8, 0, 0, 8]);
  ctx.fill();

  // South Pole (Blue half on Right)
  const blueGrad = ctx.createLinearGradient(leftX + magW / 2, topY, leftX + magW, topY + magH);
  blueGrad.addColorStop(0, "#2563eb");
  blueGrad.addColorStop(1, "#1d4ed8");
  ctx.fillStyle = blueGrad;
  ctx.beginPath();
  ctx.roundRect(leftX + magW / 2, topY, magW / 2, magH, [0, 8, 8, 0]);
  ctx.fill();

  ctx.shadowBlur = 0;

  // Center divider line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, topY);
  ctx.lineTo(cx, topY + magH);
  ctx.stroke();

  // Pole Labels
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("N", leftX + magW * 0.25, cy);
  ctx.fillText("S", leftX + magW * 0.75, cy);

  ctx.font = "bold 9px sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText("NORTH", leftX + magW * 0.25, cy + 14);
  ctx.fillText("SOUTH", leftX + magW * 0.75, cy + 14);

  // 4. Test Magnetic Compass Needle
  const compRad = (compassAngleDeg * Math.PI) / 180;
  const compX = cx + Math.cos(compRad) * compassDist * 1.3;
  const compY = cy + Math.sin(compRad) * compassDist;
  const compRadius = 24;

  // Compass Casing
  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(compX, compY, compRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Compass Cardinal directions marks
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 8px sans-serif";
  ctx.fillText("N", compX, compY - compRadius + 6);
  ctx.fillText("S", compX, compY + compRadius - 6);

  // Tangent angle calculation for compass needle
  const dx = compX - cx;
  const dy = compY - cy;
  const fieldAngle = Math.atan2(dy, dx) + Math.PI / 2 + Math.sin(simTime * 2) * 0.05;

  // Rotating Needle
  ctx.save();
  ctx.translate(compX, compY);
  ctx.rotate(fieldAngle);

  // Red tip (points towards magnetic south)
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(4, 0);
  ctx.lineTo(-4, 0);
  ctx.closePath();
  ctx.fill();

  // Silver tip (points away)
  ctx.fillStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(4, 0);
  ctx.lineTo(-4, 0);
  ctx.closePath();
  ctx.fill();

  // Brass pivot
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Compass Label
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Magnetic Compass", compX, compY + compRadius + 14);

  ctx.restore();
}

// =========================================================================
// 11. Electromagnet & Coiled Nail Renderer
// =========================================================================
function renderElectromagnetSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const turns = params.coilTurns ?? 40;
  const voltage = params.batteryVoltage ?? 6;
  const isSwitchOn = (params.switchState ?? 1) === 1;
  const hasIronCore = (params.coreType ?? 1) === 1;

  const cx = width * 0.48;
  const cy = height * 0.46;
  const nailW = Math.min(220, width * 0.42);
  const nailH = 26;

  ctx.save();

  // 1. Soft Iron Nail (Core)
  const startX = cx - nailW / 2;
  const headW = 16;
  const headH = 46;

  // Nail Head on Left
  ctx.fillStyle = hasIronCore ? "#64748b" : "#f1f5f9";
  ctx.fillRect(startX - headW, cy - headH / 2, headW, headH);

  // Nail Body
  const bodyGrad = ctx.createLinearGradient(startX, cy - nailH / 2, startX, cy + nailH / 2);
  bodyGrad.addColorStop(0, hasIronCore ? "#94a3b8" : "#e2e8f0");
  bodyGrad.addColorStop(0.5, hasIronCore ? "#cbd5e1" : "#ffffff");
  bodyGrad.addColorStop(1, hasIronCore ? "#64748b" : "#cbd5e1");
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(startX, cy - nailH / 2, nailW - 30, nailH);

  // Pointed Tip on Right
  ctx.beginPath();
  ctx.moveTo(startX + nailW - 30, cy - nailH / 2);
  ctx.lineTo(startX + nailW, cy);
  ctx.lineTo(startX + nailW - 30, cy + nailH / 2);
  ctx.closePath();
  ctx.fill();

  // 2. Copper Wire Coils wound tightly around the nail body
  const coilStart = startX + 20;
  const coilEnd = startX + nailW - 50;
  const coilWidth = coilEnd - coilStart;
  const visualLoops = Math.min(28, Math.max(8, Math.round(turns * 0.35)));
  const step = coilWidth / visualLoops;

  ctx.lineWidth = 4;
  ctx.strokeStyle = isSwitchOn ? "#ea580c" : "#b45309";
  ctx.lineCap = "round";

  for (let i = 0; i < visualLoops; i++) {
    const lx = coilStart + i * step;
    ctx.beginPath();
    ctx.moveTo(lx, cy - nailH / 2 - 5);
    ctx.bezierCurveTo(lx + step * 0.4, cy - nailH / 2 - 9, lx + step * 0.6, cy + nailH / 2 + 9, lx + step, cy + nailH / 2 + 5);
    ctx.stroke();

    // If current is flowing, draw animated glowing current electron sparkles
    if (isSwitchOn) {
      const sparkT = (simTime * 4 + i * 0.3) % 1;
      const spX = lx + step * sparkT;
      const spY = cy - nailH / 2 + (nailH + 10) * sparkT;
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(spX, spY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Magnetic Field Lines & Tip Glow when Switch is ON
  if (isSwitchOn) {
    const strengthFactor = (turns / 40) * (voltage / 6) * (hasIronCore ? 1 : 0.2);
    const tipX = startX + nailW;

    // Glowing magnetic halo around tip
    ctx.fillStyle = "rgba(250, 204, 21, 0.18)";
    ctx.shadowColor = "#facc15";
    ctx.shadowBlur = 18 * strengthFactor;
    ctx.beginPath();
    ctx.arc(tipX, cy, 26 * strengthFactor, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Concentric magnetic flux arcs
    ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
    ctx.lineWidth = 1.5;
    for (let a = 1; a <= 3; a++) {
      ctx.beginPath();
      ctx.arc(tipX, cy, 20 + a * 16, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }
  }

  // 4. Paperclips Tray and Attracted Paperclips
  const trayY = cy + 78;
  ctx.fillStyle = "#334155";
  ctx.fillRect(cx - 100, trayY, 200, 8);

  const totalClips = 7;
  const liftedCount = isSwitchOn
    ? Math.min(totalClips, Math.max(1, Math.floor((turns / 100) * (voltage / 12) * (hasIronCore ? 7 : 1))))
    : 0;

  for (let c = 0; c < totalClips; c++) {
    const isLifted = c < liftedCount;
    const clipX = isLifted ? (startX + nailW - 4 - c * 5) : (cx - 80 + c * 25);
    const clipY = isLifted ? (cy + 4 + (c % 3) * 7) : (trayY - 6);

    ctx.save();
    ctx.translate(clipX, clipY);
    if (isLifted) ctx.rotate(0.3 + (c * 0.18));

    // Metallic Paperclip SVG path
    ctx.strokeStyle = isLifted ? "#e2e8f0" : "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-6, -10, 12, 20, 5);
    ctx.stroke();
    ctx.restore();
  }

  // 5. Battery and Switch Schematic below
  const batX = cx - 110;
  const batY = cy + 120;

  // Connecting Wires
  ctx.strokeStyle = isSwitchOn ? "#22c55e" : "#64748b";
  ctx.lineWidth = 2.5;

  // Wire from left coil end to battery
  ctx.beginPath();
  ctx.moveTo(coilStart, cy + nailH / 2 + 5);
  ctx.lineTo(coilStart, batY);
  ctx.lineTo(batX, batY);
  ctx.stroke();

  // Battery icon
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(batX - 25, batY - 12, 50, 24);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${voltage.toFixed(1)}V`, batX, batY);

  // Wire from battery to knife switch
  const swX = cx + 80;
  ctx.beginPath();
  ctx.moveTo(batX + 25, batY);
  ctx.lineTo(swX - 20, batY);
  ctx.stroke();

  // Knife Switch
  ctx.fillStyle = "#475569";
  ctx.beginPath();
  ctx.arc(swX - 20, batY, 4, 0, Math.PI * 2);
  ctx.arc(swX + 20, batY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Switch lever
  ctx.strokeStyle = isSwitchOn ? "#22c55e" : "#ef4444";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(swX - 20, batY);
  if (isSwitchOn) {
    ctx.lineTo(swX + 20, batY);
  } else {
    ctx.lineTo(swX + 12, batY - 18);
  }
  ctx.stroke();

  // Wire from switch back to right coil end
  ctx.beginPath();
  ctx.moveTo(swX + 20, batY);
  ctx.lineTo(coilEnd, batY);
  ctx.lineTo(coilEnd, cy + nailH / 2 + 5);
  ctx.stroke();

  // Labels
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(hasIronCore ? "Soft Iron Nail Core" : "Plastic Core (No Magnetism)", cx, cy - 26);
  ctx.font = "9px sans-serif";
  ctx.fillStyle = isSwitchOn ? "#4ade80" : "#f87171";
  ctx.fillText(isSwitchOn ? `SWITCH ON: ${liftedCount} CLIPS ATTRACTED` : "SWITCH OFF: NO MAGNETIC FORCE", cx, trayY + 22);

  ctx.restore();
}

// =========================================================================
// 12. Glass Prism & Rainbow Dispersion Renderer
// =========================================================================
function renderPrismDispersionSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const iAngleDeg = params.incidenceAngle ?? 48;
  const pAngleDeg = params.prismAngle ?? 60;
  const isWhiteLight = (params.lightMode ?? 1) === 1;

  const cx = width * 0.44;
  const cy = height * 0.52;
  const prismSize = Math.min(170, width * 0.28);

  ctx.save();

  // 1. Triangular Glass Prism (Equilateral)
  const topPoint = { x: cx, y: cy - prismSize * 0.75 };
  const leftPoint = { x: cx - prismSize * 0.65, y: cy + prismSize * 0.5 };
  const rightPoint = { x: cx + prismSize * 0.65, y: cy + prismSize * 0.5 };

  // Glass Translucent Body
  const glassGrad = ctx.createLinearGradient(leftPoint.x, topPoint.y, rightPoint.x, rightPoint.y);
  glassGrad.addColorStop(0, "rgba(56, 189, 248, 0.12)");
  glassGrad.addColorStop(0.5, "rgba(129, 140, 248, 0.22)");
  glassGrad.addColorStop(1, "rgba(56, 189, 248, 0.15)");

  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.moveTo(topPoint.x, topPoint.y);
  ctx.lineTo(leftPoint.x, leftPoint.y);
  ctx.lineTo(rightPoint.x, rightPoint.y);
  ctx.closePath();
  ctx.fill();

  // Glass Edge Glow
  ctx.strokeStyle = "rgba(125, 211, 252, 0.75)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Prism Angle label at apex
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`A = ${pAngleDeg}°`, topPoint.x, topPoint.y - 12);

  // 2. Incident Light Source (Slit / Flashlight on Left)
  const sourceX = 35;
  const sourceY = cy - 20;
  const hitX = cx - prismSize * 0.32;
  const hitY = cy - 10;

  // Lamp Box
  ctx.fillStyle = "#334155";
  ctx.fillRect(sourceX - 25, sourceY - 14, 25, 28);
  ctx.fillStyle = isWhiteLight ? "#ffffff" : "#22c55e";
  ctx.beginPath();
  ctx.arc(sourceX, sourceY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Incident Beam
  ctx.strokeStyle = isWhiteLight ? "#ffffff" : "#22c55e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sourceX, sourceY);
  ctx.lineTo(hitX, hitY);
  ctx.stroke();

  // Incident beam label
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(isWhiteLight ? "White Light Beam" : "Green Laser Ray", (sourceX + hitX) / 2, hitY - 14);

  // 3. Dispersion Spectrum inside and exiting the prism
  const colors = isWhiteLight
    ? [
        { name: "Red (R)", hex: "#ef4444", shift: 0 },
        { name: "Orange (O)", hex: "#f97316", shift: 4 },
        { name: "Yellow (Y)", hex: "#facc15", shift: 8 },
        { name: "Green (G)", hex: "#22c55e", shift: 12 },
        { name: "Blue (B)", hex: "#06b6d4", shift: 16 },
        { name: "Indigo (I)", hex: "#3b82f6", shift: 20 },
        { name: "Violet (V)", hex: "#a855f7", shift: 24 },
      ]
    : [{ name: "Green (532nm)", hex: "#22c55e", shift: 12 }];

  const screenX = width - 45;

  colors.forEach((c, idx) => {
    // Internal refraction to right face
    const internalX = cx + prismSize * 0.28;
    const internalY = cy - 18 + c.shift * 0.9;

    ctx.strokeStyle = c.hex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hitX, hitY);
    ctx.lineTo(internalX, internalY);
    ctx.stroke();

    // Emergent ray to observation screen
    const screenY = cy - 40 + idx * 16 + (iAngleDeg - 48) * 0.8;
    ctx.beginPath();
    ctx.moveTo(internalX, internalY);
    ctx.lineTo(screenX, screenY);
    ctx.stroke();

    // Spectrum spot on screen
    ctx.fillStyle = c.hex;
    ctx.fillRect(screenX, screenY - 5, 8, 10);

    // Color name label
    ctx.font = "9px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(c.name, screenX - 65, screenY + 3);
  });

  // 4. White Observation Screen on the right
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(screenX + 8, cy - 60, 6, 140);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SCREEN", screenX + 11, cy + 96);

  ctx.restore();
}

// =========================================================================
// 13. Friction Bench & Surface Roughness Renderer
// =========================================================================
function renderFrictionSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const surfaceId = params.surfaceType ?? 2;
  const massG = params.blockMass ?? 400;
  const pullForce = params.pullForce ?? 3.5;
  const isSliding = (params.motionType ?? 1) === 1;

  // Coefficients
  const surfaceMeta: Record<number, { name: string; mu_s: number; mu_k: number; color: string; bg: string }> = {
    1: { name: "Smooth Glass (Ice)", mu_s: 0.15, mu_k: 0.10, color: "#06b6d4", bg: "#083344" },
    2: { name: "Polished Wood", mu_s: 0.40, mu_k: 0.35, color: "#d97706", bg: "#451a03" },
    3: { name: "Rough Sandpaper", mu_s: 0.80, mu_k: 0.70, color: "#64748b", bg: "#1e293b" },
    4: { name: "Lubricated with Oil", mu_s: 0.10, mu_k: 0.06, color: "#eab308", bg: "#713f12" },
  };

  const curSurf = surfaceMeta[surfaceId] || surfaceMeta[2];
  const massKg = massG / 1000;
  const g = 9.8;
  const normalN = massKg * g;
  const frictionForceN = isSliding ? curSurf.mu_k * normalN : 0.02 * normalN;
  const isMoving = pullForce > (isSliding ? curSurf.mu_s * normalN : 0.05 * normalN);
  const netForce = Math.max(0, pullForce - frictionForceN);
  const accel = netForce / massKg;

  const trackY = height * 0.62;
  const blockW = 84;
  const blockH = 50;

  // Dynamic movement of block along bench
  const blockBaseX = width * 0.38 + (isMoving ? Math.sin(simTime * 2) * 20 : 0);
  const blockY = trackY - blockH;

  ctx.save();

  // 1. Horizontal Surface Track
  ctx.fillStyle = curSurf.bg;
  ctx.fillRect(40, trackY, width - 80, 24);
  ctx.strokeStyle = curSurf.color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, trackY);
  ctx.lineTo(width - 40, trackY);
  ctx.stroke();

  // Surface texture hatches
  if (surfaceId === 3) {
    // Rough sandpaper bumps
    ctx.fillStyle = "#94a3b8";
    for (let x = 50; x < width - 50; x += 8) {
      ctx.fillRect(x, trackY - 1, 3, 2);
    }
  } else if (surfaceId === 4) {
    // Oil sheen drops
    ctx.fillStyle = "#facc15";
    for (let x = 60; x < width - 60; x += 24) {
      ctx.beginPath();
      ctx.arc(x, trackY + 1, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Sliding Test Block
  const blockGrad = ctx.createLinearGradient(blockBaseX, blockY, blockBaseX, blockY + blockH);
  blockGrad.addColorStop(0, "#b45309");
  blockGrad.addColorStop(1, "#78350f");
  ctx.fillStyle = blockGrad;
  ctx.fillRect(blockBaseX, blockY, blockW, blockH);
  ctx.strokeStyle = "#fde68a";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(blockBaseX, blockY, blockW, blockH);

  // Rollers if rolling mode
  if (!isSliding) {
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.arc(blockBaseX + 18, trackY - 5, 5, 0, Math.PI * 2);
    ctx.arc(blockBaseX + blockW - 18, trackY - 5, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Block Mass Label
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`m = ${massG}g`, blockBaseX + blockW / 2, blockY + blockH / 2 + 4);

  // 3. Force Vectors with Arrows
  const arrowScale = 14;

  // Applied Pull Force (F) -> Green Arrow to Right
  const fLen = pullForce * arrowScale;
  ctx.strokeStyle = "#22c55e";
  ctx.fillStyle = "#22c55e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(blockBaseX + blockW, blockY + blockH / 2);
  ctx.lineTo(blockBaseX + blockW + fLen, blockY + blockH / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(blockBaseX + blockW + fLen, blockY + blockH / 2);
  ctx.lineTo(blockBaseX + blockW + fLen - 6, blockY + blockH / 2 - 5);
  ctx.lineTo(blockBaseX + blockW + fLen - 6, blockY + blockH / 2 + 5);
  ctx.closePath();
  ctx.fill();
  ctx.font = "bold 10px sans-serif";
  ctx.fillText(`F = ${pullForce.toFixed(1)}N`, blockBaseX + blockW + fLen / 2, blockY + blockH / 2 - 10);

  // Friction Force (f) -> Red Arrow to Left
  const frLen = Math.min(fLen, frictionForceN * arrowScale);
  ctx.strokeStyle = "#ef4444";
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(blockBaseX, trackY - 2);
  ctx.lineTo(blockBaseX - frLen, trackY - 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(blockBaseX - frLen, trackY - 2);
  ctx.lineTo(blockBaseX - frLen + 6, trackY - 7);
  ctx.lineTo(blockBaseX - frLen + 6, trackY + 3);
  ctx.closePath();
  ctx.fill();
  ctx.fillText(`f = ${frictionForceN.toFixed(2)}N`, blockBaseX - frLen / 2, trackY - 12);

  // Surface Label
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Track: ${curSurf.name} (μ_k = ${curSurf.mu_k})`, width / 2, trackY + 45);

  ctx.restore();
}

// =========================================================================
// 14. Archimedes' Buoyancy & Liquid Floatation Renderer
// =========================================================================
function renderArchimedesSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const depthPct = (params.immersionDepth ?? 60) / 100;
  const matId = params.objectMaterial ?? 1; // 1: Al (2.7), 2: Wood (0.6), 3: Iron (7.8)
  const liqId = params.liquidType ?? 1; // 1: Water (1.0), 2: Brine (1.2), 3: Oil (0.8)
  const volumeCm3 = params.objectVolume ?? 100;

  const matDensities: Record<number, { name: string; rho: number; color: string }> = {
    1: { name: "Aluminum", rho: 2.7, color: "#94a3b8" },
    2: { name: "Pine Wood", rho: 0.6, color: "#b45309" },
    3: { name: "Cast Iron", rho: 7.8, color: "#475569" },
  };

  const liqDensities: Record<number, { name: string; rho: number; color: string }> = {
    1: { name: "Fresh Water", rho: 1.0, color: "rgba(56, 189, 248, 0.35)" },
    2: { name: "Saline Brine", rho: 1.2, color: "rgba(14, 165, 233, 0.45)" },
    3: { name: "Vegetable Oil", rho: 0.8, color: "rgba(234, 179, 8, 0.35)" },
  };

  const curMat = matDensities[matId] || matDensities[1];
  const curLiq = liqDensities[liqId] || liqDensities[1];

  const objMassG = curMat.rho * volumeCm3;
  const weightAirN = (objMassG / 1000) * 9.8;
  const dispVolMl = volumeCm3 * depthPct;
  const buoyantForceN = (curLiq.rho * dispVolMl / 1000) * 9.8;
  const scaleWeightN = Math.max(0, weightAirN - buoyantForceN);

  const cx = width * 0.45;
  const beakerW = 140;
  const beakerH = 160;
  const beakerY = height * 0.42;

  ctx.save();

  // 1. Big Glass Beaker
  ctx.fillStyle = curLiq.color;
  ctx.fillRect(cx - beakerW / 2, beakerY + 30, beakerW, beakerH - 30);
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3;
  ctx.strokeRect(cx - beakerW / 2, beakerY, beakerW, beakerH);

  // Overflow spout on right
  ctx.fillStyle = curLiq.color;
  ctx.beginPath();
  ctx.moveTo(cx + beakerW / 2, beakerY + 32);
  ctx.lineTo(cx + beakerW / 2 + 25, beakerY + 52);
  ctx.lineTo(cx + beakerW / 2 + 25, beakerY + 62);
  ctx.lineTo(cx + beakerW / 2, beakerY + 42);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Water level waves
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  for (let wx = cx - beakerW / 2; wx < cx + beakerW / 2; wx += 10) {
    const wy = beakerY + 30 + Math.sin(wx * 0.1 + simTime * 3) * 2;
    ctx.fillRect(wx, wy, 8, 2);
  }

  // 2. Small Overflow Measuring Cylinder on the right
  const cylX = cx + beakerW / 2 + 30;
  const cylY = beakerY + 70;
  const cylW = 40;
  const cylH = 90;

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.strokeRect(cylX, cylY, cylW, cylH);

  // Collected displaced water inside cylinder
  const waterHeight = Math.min(cylH - 4, (dispVolMl / volumeCm3) * (cylH - 10));
  ctx.fillStyle = curLiq.color;
  ctx.fillRect(cylX + 2, cylY + cylH - waterHeight - 2, cylW - 4, waterHeight);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${dispVolMl.toFixed(0)} mL`, cylX + cylW / 2, cylY + cylH + 14);

  // 3. Submerged Solid Cylinder hanging from string
  const objW = 50;
  const objH = 65;
  const submergeY = beakerY + 20 + depthPct * (objH * 0.9);

  // Spring scale line
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, 40);
  ctx.lineTo(cx, submergeY - objH / 2);
  ctx.stroke();

  // Spring Scale Display above
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(cx - 30, 20, 60, 42);
  ctx.strokeStyle = "#f59e0b";
  ctx.strokeRect(cx - 30, 20, 60, 42);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${scaleWeightN.toFixed(2)} N`, cx, 44);

  // Solid Cylinder Block
  ctx.fillStyle = curMat.color;
  ctx.fillRect(cx - objW / 2, submergeY - objH / 2, objW, objH);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - objW / 2, submergeY - objH / 2, objW, objH);

  // Material text inside block
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText(curMat.name, cx, submergeY);

  // 4. Force Vectors (Upthrust F_b vs Weight W)
  ctx.strokeStyle = "#22c55e";
  ctx.fillStyle = "#22c55e";
  ctx.lineWidth = 2.5;
  // Buoyant Force arrow pointing up
  ctx.beginPath();
  ctx.moveTo(cx - objW / 2 - 12, submergeY + 15);
  ctx.lineTo(cx - objW / 2 - 12, submergeY - 20);
  ctx.stroke();
  ctx.font = "bold 9px sans-serif";
  ctx.fillText(`F_b = ${buoyantForceN.toFixed(2)}N`, cx - objW / 2 - 38, submergeY - 5);

  ctx.restore();
}

// =========================================================================
// 15. Number Line & Rational Jump Renderer
// =========================================================================
function renderNumberLineSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const startA = params.startValue ?? 2;
  const jumpB = params.jumpStep ?? -5;
  const showFrac = (params.showFractions ?? 1) === 1;
  const opMode = params.operationMode ?? 1; // 1: A+B, 2: A-B, 3: |A-B|

  const lineY = height * 0.54;
  const centerX = width / 2;
  const stepPx = Math.min(34, width * 0.05);

  const finalVal = opMode === 2 ? startA - jumpB : opMode === 3 ? Math.abs(startA - jumpB) : startA + jumpB;

  ctx.save();

  // 1. Horizontal Axis
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, lineY);
  ctx.lineTo(width - 40, lineY);
  ctx.stroke();

  // Axis Arrowheads (<--->)
  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.moveTo(35, lineY); ctx.lineTo(45, lineY - 6); ctx.lineTo(45, lineY + 6); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(width - 35, lineY); ctx.lineTo(width - 45, lineY - 6); ctx.lineTo(width - 45, lineY + 6); ctx.closePath(); ctx.fill();

  // 2. Integer and Fractional Ticks (-10 to +10)
  for (let n = -10; n <= 10; n++) {
    const tx = centerX + n * stepPx;
    if (tx < 50 || tx > width - 50) continue;

    // Major tick
    const isZero = n === 0;
    ctx.strokeStyle = isZero ? "#f59e0b" : "#cbd5e1";
    ctx.lineWidth = isZero ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(tx, lineY - (isZero ? 14 : 8));
    ctx.lineTo(tx, lineY + (isZero ? 14 : 8));
    ctx.stroke();

    // Integer Label
    ctx.fillStyle = isZero ? "#f59e0b" : "#f8fafc";
    ctx.font = isZero ? "bold 13px sans-serif" : "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${n}`, tx, lineY + 28);

    // Half Ticks
    if (showFrac && n < 10) {
      const hx = tx + stepPx / 2;
      ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, lineY - 4);
      ctx.lineTo(hx, lineY + 4);
      ctx.stroke();
    }
  }

  // 3. Point A (Start Position)
  const ax = centerX + startA * stepPx;
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(ax, lineY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "bold 11px sans-serif";
  ctx.fillText(`A (${startA})`, ax, lineY - 14);

  // 4. Parabolic Jump Arc to Final Result
  const bx = centerX + finalVal * stepPx;
  const isRightJump = bx >= ax;
  const arcHeight = Math.min(80, Math.abs(bx - ax) * 0.45 + 30);
  const midX = (ax + bx) / 2;

  ctx.strokeStyle = isRightJump ? "#22c55e" : "#ef4444";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(ax, lineY);
  ctx.quadraticCurveTo(midX, lineY - arcHeight, bx, lineY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Arc label showing the jump
  ctx.fillStyle = isRightJump ? "#4ade80" : "#f87171";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText(
    opMode === 2 ? `-${jumpB}` : opMode === 3 ? `|${startA}-${jumpB}|` : `${jumpB >= 0 ? "+" : ""}${jumpB}`,
    midX,
    lineY - arcHeight - 6
  );

  // 5. Point B (Result Landing Pin)
  ctx.fillStyle = "#ec4899";
  ctx.shadowColor = "#ec4899";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(bx, lineY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = "bold 12px sans-serif";
  ctx.fillText(`Result = ${finalVal}`, bx, lineY + 48);

  ctx.restore();
}

// =========================================================================
// 15. Bohr's Atomic Model & Electron Shells Renderer (Chemistry)
// =========================================================================
function renderBohrAtomicSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const z = Math.max(1, Math.min(20, Math.round(params.atomicNumber ?? 6)));
  const excitation = Math.max(1, Math.min(4, Math.round(params.excitationLevel ?? 1)));
  const speed = params.orbitSpeed ?? 1.0;

  const ELEMENTS = [
    { z: 1, sym: "H", name: "Hydrogen", mass: 1, k: 1, l: 0, m: 0, n: 0 },
    { z: 2, sym: "He", name: "Helium", mass: 4, k: 2, l: 0, m: 0, n: 0 },
    { z: 3, sym: "Li", name: "Lithium", mass: 7, k: 2, l: 1, m: 0, n: 0 },
    { z: 4, sym: "Be", name: "Beryllium", mass: 9, k: 2, l: 2, m: 0, n: 0 },
    { z: 5, sym: "B", name: "Boron", mass: 11, k: 2, l: 3, m: 0, n: 0 },
    { z: 6, sym: "C", name: "Carbon", mass: 12, k: 2, l: 4, m: 0, n: 0 },
    { z: 7, sym: "N", name: "Nitrogen", mass: 14, k: 2, l: 5, m: 0, n: 0 },
    { z: 8, sym: "O", name: "Oxygen", mass: 16, k: 2, l: 6, m: 0, n: 0 },
    { z: 9, sym: "F", name: "Fluorine", mass: 19, k: 2, l: 7, m: 0, n: 0 },
    { z: 10, sym: "Ne", name: "Neon", mass: 20, k: 2, l: 8, m: 0, n: 0 },
    { z: 11, sym: "Na", name: "Sodium", mass: 23, k: 2, l: 8, m: 1, n: 0 },
    { z: 12, sym: "Mg", name: "Magnesium", mass: 24, k: 2, l: 8, m: 2, n: 0 },
    { z: 13, sym: "Al", name: "Aluminum", mass: 27, k: 2, l: 8, m: 3, n: 0 },
    { z: 14, sym: "Si", name: "Silicon", mass: 28, k: 2, l: 8, m: 4, n: 0 },
    { z: 15, sym: "P", name: "Phosphorus", mass: 31, k: 2, l: 8, m: 5, n: 0 },
    { z: 16, sym: "S", name: "Sulfur", mass: 32, k: 2, l: 8, m: 6, n: 0 },
    { z: 17, sym: "Cl", name: "Chlorine", mass: 35.5, k: 2, l: 8, m: 7, n: 0 },
    { z: 18, sym: "Ar", name: "Argon", mass: 40, k: 2, l: 8, m: 8, n: 0 },
    { z: 19, sym: "K", name: "Potassium", mass: 39, k: 2, l: 8, m: 8, n: 1 },
    { z: 20, sym: "Ca", name: "Calcium", mass: 40, k: 2, l: 8, m: 8, n: 2 },
  ];

  const elem = ELEMENTS[z - 1] || ELEMENTS[5];
  const shellElectrons = [elem.k, elem.l, elem.m, elem.n];

  // If excited, promote 1 valence electron to the target excitation shell
  let activeExcitedShell = -1;
  if (excitation > 1) {
    let highestShell = 0;
    for (let s = 3; s >= 0; s--) {
      if (shellElectrons[s] > 0) {
        highestShell = s;
        break;
      }
    }
    const targetShell = Math.min(3, Math.max(highestShell + 1, excitation - 1));
    if (targetShell > highestShell && shellElectrons[highestShell] > 0) {
      shellElectrons[highestShell] -= 1;
      shellElectrons[targetShell] += 1;
      activeExcitedShell = targetShell;
    }
  }

  const cx = width * 0.5;
  const cy = height * 0.52;
  const scale = Math.min(width, height) / 440;
  const shellRadii = [48 * scale, 88 * scale, 130 * scale, 172 * scale];
  const shellNames = ["K (n=1)", "L (n=2)", "M (n=3)", "N (n=4)"];

  ctx.save();

  // 1. Draw Concentric Shell Orbits
  shellRadii.forEach((r, idx) => {
    const isOccupied = shellElectrons[idx] > 0 || (idx === activeExcitedShell);
    ctx.strokeStyle = idx === activeExcitedShell ? "rgba(234, 179, 8, 0.7)" : isOccupied ? "rgba(56, 189, 248, 0.4)" : "rgba(100, 116, 139, 0.2)";
    ctx.lineWidth = idx === activeExcitedShell ? 2 : 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Shell label
    ctx.fillStyle = idx === activeExcitedShell ? "#facc15" : isOccupied ? "#38bdf8" : "#64748b";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(shellNames[idx], cx, cy - r - 4);
  });

  // 2. Central Nucleus (Protons & Neutrons cluster)
  const nucleusRadius = Math.max(16, 20 * scale);
  const nucleusGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, nucleusRadius);
  nucleusGrad.addColorStop(0, "#f97316");
  nucleusGrad.addColorStop(0.7, "#dc2626");
  nucleusGrad.addColorStop(1, "#7f1d1d");

  ctx.fillStyle = nucleusGrad;
  ctx.shadowColor = "#f97316";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(cx, cy, nucleusRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Proton/Neutron particles inside nucleus
  const numNucleons = Math.min(18, Math.round(elem.mass));
  for (let i = 0; i < numNucleons; i++) {
    const angle = (i / numNucleons) * Math.PI * 2 + (i % 2) * 0.4;
    const dist = (nucleusRadius * 0.6) * Math.sqrt((i + 1) / numNucleons);
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;
    ctx.fillStyle = i % 2 === 0 ? "#fef08a" : "#cbd5e1"; // Protons yellow, Neutrons light slate
    ctx.beginPath();
    ctx.arc(px, py, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nucleus Center Label
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.max(10, Math.round(11 * scale))}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`+${z}e`, cx, cy);
  ctx.textBaseline = "alphabetic";

  // 3. Orbiting Electrons on each Shell
  shellElectrons.forEach((count, sIdx) => {
    if (count <= 0) return;
    const r = shellRadii[sIdx];
    const baseSpeed = (1.6 / Math.sqrt(sIdx + 1)) * speed;
    for (let e = 0; e < count; e++) {
      const offset = (e / count) * Math.PI * 2;
      const angle = offset + simTime * baseSpeed;
      const ex = cx + Math.cos(angle) * r;
      const ey = cy + Math.sin(angle) * r;

      const isExcitedElectron = (sIdx === activeExcitedShell && e === count - 1);

      // Subtle particle trail
      ctx.strokeStyle = isExcitedElectron ? "rgba(250, 204, 21, 0.4)" : "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, angle - 0.25, angle);
      ctx.stroke();

      // Electron Sphere
      ctx.fillStyle = isExcitedElectron ? "#facc15" : "#38bdf8";
      ctx.shadowColor = isExcitedElectron ? "#facc15" : "#38bdf8";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(ex, ey, 4.5 * scale, 0, Math.PI * 2);
      ctx.fill();

      // White hot center
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ex, ey, 1.8 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });

  // 4. Photon Emission / Absorption Wave Packet when Excited
  if (activeExcitedShell > 0) {
    const photonAngle = (simTime * 1.5) % (Math.PI * 2);
    const waveDist = shellRadii[activeExcitedShell] + 25 * scale + ((simTime * 40) % 60);
    const wx = cx + Math.cos(photonAngle) * waveDist;
    const wy = cy + Math.sin(photonAngle) * waveDist;

    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let w = -15; w <= 15; w++) {
      const px = wx + w * Math.cos(photonAngle + Math.PI / 2);
      const py = wy + w * Math.sin(photonAngle + Math.PI / 2) + Math.sin(w * 0.5 + simTime * 8) * 5;
      if (w === -15) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.fillStyle = "#e9d5ff";
    ctx.font = "bold 9.5px sans-serif";
    ctx.fillText("Photon: ΔE = hν", wx + 12, wy - 8);
  }

  // 5. Header HUD Card: Element Details
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 260), 68, 8);
  ctx.fill();
  ctx.stroke();

  // Chemical Symbol Badge
  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.roundRect(22, 22, 40, 52, 6);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(elem.sym, 42, 54);

  // Element info text
  ctx.textAlign = "left";
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`${elem.name} (Z = ${z}, A = ${elem.mass})`, 72, 36);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "11px monospace";
  ctx.fillText(`Configuration: ${elem.k}, ${elem.l}, ${elem.m}, ${elem.n}`, 72, 52);

  const valenceElectrons = elem.n > 0 ? elem.n : elem.m > 0 ? elem.m : elem.l > 0 ? elem.l : elem.k;
  ctx.fillStyle = "#facc15";
  ctx.font = "bold 10px sans-serif";
  ctx.fillText(`Valence Electrons: ${valenceElectrons} | State: ${excitation > 1 ? `Excited (n=${excitation})` : "Ground"}`, 72, 68);

  ctx.restore();
}

// =========================================================================
// 16. Chemical Reaction Kinetics & Collision Theory Renderer (Chemistry)
// =========================================================================
function renderChemicalKineticsSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const tempK = params.temperature ?? 300;
  const conc = params.concentration ?? 1.5;
  const hasCatalyst = (params.catalyst ?? 0) === 1;
  const baseEa = params.activationEnergy ?? 55; // kJ/mol
  const effectiveEa = hasCatalyst ? baseEa * 0.6 : baseEa; // 40% reduction

  // Kinetics physics calculations
  const R = 8.314; // J/(mol·K)
  const boltzmannFactor = Math.exp((-effectiveEa * 1000) / (R * tempK));
  const rateConstant = 1e5 * boltzmannFactor;
  const reactionVelocity = rateConstant * conc;

  ctx.save();

  // Layout: Chamber on left/top, Potential Energy Curve on right
  const isCompact = width < 600;
  const chamberW = isCompact ? width - 30 : Math.round(width * 0.54);
  const chamberH = isCompact ? Math.round(height * 0.48) : Math.round(height * 0.75);
  const chamberX = 15;
  const chamberY = 35;

  // 1. Reaction Chamber Glass Vessel
  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.strokeStyle = hasCatalyst ? "#10b981" : "#475569";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(chamberX, chamberY, chamberW, chamberH, 10);
  ctx.fill();
  ctx.stroke();

  // Chamber Header Label
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`REACTION VESSEL (T = ${tempK} K, [A] = ${conc.toFixed(2)} M)`, chamberX + 12, chamberY - 12);

  // Catalyst Bed at bottom if enabled
  if (hasCatalyst) {
    const bedH = 18;
    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
    ctx.fillRect(chamberX + 2, chamberY + chamberH - bedH, chamberW - 4, bedH - 2);
    ctx.strokeStyle = "#10b981";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(chamberX + 2, chamberY + chamberH - bedH);
    ctx.lineTo(chamberX + chamberW - 2, chamberY + chamberH - bedH);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 9.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚡ Solid Platinum Catalyst Bed (Lowers Eₐ)", chamberX + chamberW / 2, chamberY + chamberH - 5);
  }

  // 2. Molecular Reactant & Product Particles
  const numParticles = Math.round(18 + conc * 8);
  const speedMult = Math.sqrt(tempK / 300) * 45;

  for (let i = 0; i < numParticles; i++) {
    const isProduct = (i % 5 === 0) && (boltzmannFactor > 0.0001);
    const seedX = (i * 97) % (chamberW - 30) + 15;
    const seedY = (i * 61) % (chamberH - 45) + 15;
    const dirX = Math.cos(i * 1.7) * speedMult;
    const dirY = Math.sin(i * 1.3) * speedMult;

    // Bounce position calculation inside chamber
    const spanX = chamberW - 24;
    const spanY = chamberH - (hasCatalyst ? 40 : 24);
    let px = chamberX + 12 + Math.abs((seedX + dirX * simTime) % (spanX * 2) - spanX);
    let py = chamberY + 12 + Math.abs((seedY + dirY * simTime) % (spanY * 2) - spanY);

    ctx.beginPath();
    if (isProduct) {
      // Product AB molecule (Green/Violet diatomic)
      ctx.fillStyle = "#a855f7";
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (i % 2 === 0) {
      // Reactant A₂ (Blue sphere)
      ctx.fillStyle = "#38bdf8";
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Reactant B₂ (Orange sphere)
      ctx.fillStyle = "#fb923c";
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Collision Spark Burst Animation
  const sparkCycle = (simTime * 3) % 1.0;
  if (sparkCycle < 0.35) {
    const sparkX = chamberX + chamberW * 0.45;
    const sparkY = chamberY + chamberH * 0.4;
    ctx.strokeStyle = hasCatalyst ? "#4ade80" : "#facc15";
    ctx.lineWidth = 1.5;
    for (let s = 0; s < 6; s++) {
      const a = (s / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sparkX, sparkY);
      ctx.lineTo(sparkX + Math.cos(a) * 14 * sparkCycle, sparkY + Math.sin(a) * 14 * sparkCycle);
      ctx.stroke();
    }
  }

  // 3. Potential Energy vs Reaction Coordinate Graph (Right / Bottom)
  const graphX = isCompact ? chamberX : chamberX + chamberW + 20;
  const graphY = isCompact ? chamberY + chamberH + 30 : chamberY;
  const graphW = isCompact ? chamberW : width - graphX - 20;
  const graphH = isCompact ? height - graphY - 15 : chamberH;

  if (graphW > 100 && graphH > 80) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(graphX, graphY, graphW, graphH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 10.5px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("POTENTIAL ENERGY DIAGRAM", graphX + 12, graphY + 18);

    // Coordinate Axes
    const originX = graphX + 35;
    const originY = graphY + graphH - 28;
    const axisW = graphW - 50;
    const axisH = graphH - 55;

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY - axisH);
    ctx.lineTo(originX, originY);
    ctx.lineTo(originX + axisW, originY);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Reaction Coordinate →", originX + axisW / 2, originY + 18);
    ctx.save();
    ctx.translate(originX - 20, originY - axisH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Energy (E) →", 0, 0);
    ctx.restore();

    // Reaction Energy Profile Curves
    const rY = originY - axisH * 0.35; // Reactant Level
    const pY = originY - axisH * 0.18; // Product Level (Exothermic)
    const uncatalyzedPeakY = originY - axisH * (0.35 + (baseEa / 100) * 0.55);
    const catalyzedPeakY = originY - axisH * (0.35 + (effectiveEa / 100) * 0.55);

    // Uncatalyzed Curve (Orange)
    ctx.strokeStyle = "#fb923c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX + 10, rY);
    ctx.bezierCurveTo(originX + axisW * 0.3, rY, originX + axisW * 0.35, uncatalyzedPeakY, originX + axisW * 0.5, uncatalyzedPeakY);
    ctx.bezierCurveTo(originX + axisW * 0.65, uncatalyzedPeakY, originX + axisW * 0.7, pY, originX + axisW - 10, pY);
    ctx.stroke();

    // Catalyzed Curve (Green dashed if catalyst present)
    if (hasCatalyst) {
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(originX + 10, rY);
      ctx.bezierCurveTo(originX + axisW * 0.3, rY, originX + axisW * 0.35, catalyzedPeakY, originX + axisW * 0.5, catalyzedPeakY);
      ctx.bezierCurveTo(originX + axisW * 0.65, catalyzedPeakY, originX + axisW * 0.7, pY, originX + axisW - 10, pY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Peak labels
    ctx.fillStyle = "#fb923c";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Eₐ = ${baseEa} kJ`, originX + axisW * 0.5, uncatalyzedPeakY - 6);

    if (hasCatalyst) {
      ctx.fillStyle = "#34d399";
      ctx.fillText(`Eₐ' (Cat) = ${effectiveEa.toFixed(0)} kJ`, originX + axisW * 0.5, catalyzedPeakY - 6);
    }
  }

  ctx.restore();
}

// =========================================================================
// 17. Human Heart & Double Blood Circulation Renderer (Biology)
// =========================================================================
function renderHeartCirculationSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const bpm = params.heartRate ?? 72;
  const activity = params.exerciseLevel ?? 1;
  const resistance = (params.vascularResistance ?? 100) / 100;

  const cardiacCycle = 60 / bpm; // duration of 1 beat in seconds
  const beatProgress = (simTime % cardiacCycle) / cardiacCycle; // 0 to 1

  // Systole (0.1 to 0.4) vs Diastole (0.4 to 1.0)
  const isSystole = beatProgress >= 0.12 && beatProgress <= 0.42;
  const pumpFactor = isSystole ? 1.0 - 0.08 * Math.sin(((beatProgress - 0.12) / 0.3) * Math.PI) : 1.0;

  const cx = width * 0.44;
  const cy = height * 0.46;
  const scale = Math.min(width, height) / 440;

  ctx.save();

  // 1. Pulmonary Loop (Top to Lungs) & Systemic Loop (Bottom to Tissues)
  const lungY = cy - 135 * scale;
  const tissueY = cy + 135 * scale;

  // Lungs representation
  ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cx - 70 * scale, lungY - 18 * scale, 140 * scale, 32 * scale, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🫁 LUNGS (O₂ Inflow & CO₂ Exhale)", cx, lungY + 3 * scale);

  // Body Tissues representation
  ctx.fillStyle = "rgba(244, 63, 94, 0.15)";
  ctx.strokeStyle = "#f43f5e";
  ctx.beginPath();
  ctx.roundRect(cx - 70 * scale, tissueY - 15 * scale, 140 * scale, 30 * scale, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f43f5e";
  ctx.fillText("💪 BODY TISSUES (Cellular Respiration)", cx, tissueY + 4 * scale);

  // Connecting Great Vessels (Vena Cava Blue, Aorta Red)
  ctx.lineWidth = 12 * scale;
  // Pulmonary Artery (RV to Lungs - Blue deoxygenated!)
  ctx.strokeStyle = "rgba(30, 64, 175, 0.7)";
  ctx.beginPath();
  ctx.moveTo(cx - 28 * scale, cy - 25 * scale);
  ctx.lineTo(cx - 28 * scale, lungY + 12 * scale);
  ctx.stroke();

  // Pulmonary Vein (Lungs to LA - Red oxygenated!)
  ctx.strokeStyle = "rgba(225, 29, 72, 0.7)";
  ctx.beginPath();
  ctx.moveTo(cx + 28 * scale, lungY + 12 * scale);
  ctx.lineTo(cx + 28 * scale, cy - 25 * scale);
  ctx.stroke();

  // Aorta (LV to Body - Red oxygenated!)
  ctx.strokeStyle = "rgba(225, 29, 72, 0.7)";
  ctx.beginPath();
  ctx.moveTo(cx + 25 * scale, cy + 30 * scale);
  ctx.lineTo(cx + 25 * scale, tissueY - 15 * scale);
  ctx.stroke();

  // Vena Cava (Body to RA - Blue deoxygenated!)
  ctx.strokeStyle = "rgba(30, 64, 175, 0.7)";
  ctx.beginPath();
  ctx.moveTo(cx - 25 * scale, tissueY - 15 * scale);
  ctx.lineTo(cx - 25 * scale, cy + 30 * scale);
  ctx.stroke();

  // Moving blood cells along vessels
  const cellSpeed = (bpm / 60) * 60;
  for (let b = 0; b < 6; b++) {
    const tBlue = (simTime * cellSpeed + b * 40) % (tissueY - lungY);
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.arc(cx - 26 * scale, lungY + 20 * scale + tBlue, 3.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f87171";
    ctx.beginPath();
    ctx.arc(cx + 26 * scale, lungY + 20 * scale + tBlue, 3.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Anatomical 4-Chambered Heart Muscle
  const heartW = 120 * scale * pumpFactor;
  const heartH = 110 * scale * pumpFactor;

  // Outer Myocardium Wall
  ctx.fillStyle = "#881337";
  ctx.strokeStyle = "#be123c";
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.roundRect(cx - heartW / 2, cy - heartH / 2, heartW, heartH, 20);
  ctx.fill();
  ctx.stroke();

  // Central Muscular Septum
  ctx.fillStyle = "#4c0519";
  ctx.fillRect(cx - 4 * scale, cy - heartH / 2, 8 * scale, heartH);

  // Four Internal Chambers
  const chW = (heartW - 20 * scale) / 2;
  const chH = (heartH - 18 * scale) / 2;

  // Right Atrium (Deoxygenated Blue)
  ctx.fillStyle = isSystole ? "#1e3a8a" : "#1d4ed8";
  ctx.beginPath();
  ctx.roundRect(cx - heartW / 2 + 5 * scale, cy - heartH / 2 + 4 * scale, chW, chH, 10);
  ctx.fill();

  // Left Atrium (Oxygenated Red)
  ctx.fillStyle = isSystole ? "#991b1b" : "#dc2626";
  ctx.beginPath();
  ctx.roundRect(cx + 5 * scale, cy - heartH / 2 + 4 * scale, chW, chH, 10);
  ctx.fill();

  // Right Ventricle (Deoxygenated Blue)
  ctx.fillStyle = isSystole ? "#1e40af" : "#2563eb";
  ctx.beginPath();
  ctx.roundRect(cx - heartW / 2 + 5 * scale, cy + 4 * scale, chW, chH, 10);
  ctx.fill();

  // Left Ventricle (Oxygenated Red - Thicker Wall)
  ctx.fillStyle = isSystole ? "#b91c1c" : "#ef4444";
  ctx.beginPath();
  ctx.roundRect(cx + 5 * scale, cy + 4 * scale, chW, chH, 10);
  ctx.fill();

  // Atrioventricular Valves (Tricuspid & Bicuspid/Mitral)
  const valveAngle = isSystole ? 0 : 0.4; // Flaps snap shut during systole
  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = 2.5;

  // Tricuspid (Right side)
  ctx.beginPath();
  ctx.moveTo(cx - heartW / 2 + 15 * scale, cy + 2 * scale);
  ctx.lineTo(cx - 15 * scale, cy + 2 * scale + Math.sin(valveAngle) * 6);
  ctx.stroke();

  // Bicuspid / Mitral (Left side)
  ctx.beginPath();
  ctx.moveTo(cx + 15 * scale, cy + 2 * scale);
  ctx.lineTo(cx + heartW / 2 - 15 * scale, cy + 2 * scale + Math.sin(valveAngle) * 6);
  ctx.stroke();

  // Chamber Text Labels
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.round(9.5 * scale)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("RA", cx - heartW / 4, cy - heartH / 4);
  ctx.fillText("LA", cx + heartW / 4, cy - heartH / 4);
  ctx.fillText("RV", cx - heartW / 4, cy + heartH / 4 + 4);
  ctx.fillText("LV", cx + heartW / 4, cy + heartH / 4 + 4);

  // Heartbeat Sound indicator (LUB / DUB)
  ctx.fillStyle = isSystole ? "#facc15" : "#38bdf8";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(isSystole ? "💓 LUB (AV Valves Closed)" : "💙 DUB (SL Valves Closed)", 15, cy + heartH / 2 + 20);

  // 3. Live ECG Oscilloscope Screen (Right / Bottom)
  const ecgW = Math.min(220 * scale, width - cx - heartW / 2 - 25);
  if (ecgW > 110) {
    const ecgX = width - ecgW - 15;
    const ecgY = 25;
    const ecgH = 85 * scale;

    ctx.fillStyle = "rgba(6, 78, 59, 0.4)";
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(ecgX, ecgY, ecgW, ecgH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`LEAD II ECG: ${bpm} BPM`, ecgX + 8, ecgY + 14);

    // Continuous ECG trace
    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const ecgMidY = ecgY + ecgH * 0.6;
    for (let x = 0; x < ecgW - 16; x++) {
      const phase = ((x / (ecgW - 16)) + simTime * (bpm / 60)) % 1.0;
      let dy = 0;
      if (phase > 0.1 && phase < 0.2) dy = -Math.sin((phase - 0.1) * 10 * Math.PI) * 5; // P wave
      else if (phase > 0.25 && phase < 0.28) dy = 4; // Q wave
      else if (phase >= 0.28 && phase < 0.33) dy = -25; // R peak!
      else if (phase >= 0.33 && phase < 0.36) dy = 6; // S wave
      else if (phase > 0.5 && phase < 0.65) dy = -Math.sin((phase - 0.5) * 6.6 * Math.PI) * 7; // T wave

      const px = ecgX + 8 + x;
      const py = ecgMidY + dy;
      if (x === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  ctx.restore();
}

// =========================================================================
// 18. Osmosis, Turgidity & Plasmolysis Renderer (Biology)
// =========================================================================
function renderOsmosisCellsSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const solutePercent = params.soluteConcentration ?? 0.9;
  const cellType = Math.round(params.cellType ?? 1); // 1: Plant, 2: Animal RBC
  const isPlant = cellType === 1;

  // Tonicity determination
  const isHypotonic = solutePercent < 0.8;
  const isIsotonic = solutePercent >= 0.8 && solutePercent <= 1.1;
  const isHypertonic = solutePercent > 1.1;

  // Osmotic contraction / swelling factor
  let cellScale = 1.0;
  if (isHypotonic) {
    cellScale = 1.0 + (0.9 - solutePercent) * 0.18; // swell
  } else if (isHypertonic) {
    cellScale = Math.max(0.62, 1.0 - (solutePercent - 0.9) * 0.05); // shrink / plasmolysis
  }

  const cx = width * 0.48;
  const cy = height * 0.52;
  const scale = Math.min(width, height) / 440;

  ctx.save();

  // 1. Surrounding Beaker / Fluid Container
  const beakerW = Math.min(width - 30, 360 * scale);
  const beakerH = Math.min(height - 70, 300 * scale);
  const beakerX = cx - beakerW / 2;
  const beakerY = cy - beakerH / 2;

  // Solution fluid background color depending on salinity
  const fluidGrad = ctx.createLinearGradient(0, beakerY, 0, beakerY + beakerH);
  if (isHypotonic) {
    fluidGrad.addColorStop(0, "rgba(56, 189, 248, 0.15)");
    fluidGrad.addColorStop(1, "rgba(14, 165, 233, 0.25)");
  } else if (isIsotonic) {
    fluidGrad.addColorStop(0, "rgba(52, 211, 153, 0.15)");
    fluidGrad.addColorStop(1, "rgba(16, 185, 129, 0.25)");
  } else {
    fluidGrad.addColorStop(0, "rgba(245, 158, 11, 0.2)");
    fluidGrad.addColorStop(1, "rgba(217, 119, 6, 0.35)");
  }

  ctx.fillStyle = fluidGrad;
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(beakerX, beakerY, beakerW, beakerH, 16);
  ctx.fill();
  ctx.stroke();

  // Beaker Salinity Header Badge
  ctx.fillStyle = isHypotonic ? "#38bdf8" : isIsotonic ? "#34d399" : "#f59e0b";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(
    `ENVIRONMENT: ${solutePercent.toFixed(1)}% NaCl (${isHypotonic ? "HYPOTONIC - Pure/Dilute Water" : isIsotonic ? "ISOTONIC - Physiological Saline" : "HYPERTONIC - High Salt Solution"})`,
    beakerX + 14,
    beakerY - 10
  );

  // Floating solute salt ions (amber/green dots) in surrounding beaker
  const numSaltIons = Math.round(solutePercent * 8);
  for (let s = 0; s < numSaltIons; s++) {
    const sx = beakerX + 15 + ((s * 47 + simTime * 12) % (beakerW - 30));
    const sy = beakerY + 15 + ((s * 61 + simTime * 8) % (beakerH - 30));
    // Avoid drawing directly over cell center
    if (Math.abs(sx - cx) > 80 * scale || Math.abs(sy - cy) > 60 * scale) {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Cell Rendering (Plant Cell vs Animal RBC)
  if (isPlant) {
    // A. Rigid Outer Cellulose Cell Wall (Constant shape)
    const wallW = 160 * scale;
    const wallH = 120 * scale;

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 6 * scale;
    ctx.beginPath();
    ctx.roundRect(cx - wallW / 2, cy - wallH / 2, wallW, wallH, 12);
    ctx.stroke();

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 9.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Rigid Cellulose Cell Wall", cx, cy - wallH / 2 - 8);

    // B. Inner Protoplast & Plasma Membrane
    const protoW = Math.min(wallW - 8 * scale, (wallW - 10 * scale) * cellScale);
    const protoH = Math.min(wallH - 8 * scale, (wallH - 10 * scale) * cellScale);

    ctx.fillStyle = isHypertonic ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.35)";
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - protoW / 2, cy - protoH / 2, protoW, protoH, isHypertonic ? 24 : 10);
    ctx.fill();
    ctx.stroke();

    // C. Central Vacuole
    const vacW = protoW * 0.65;
    const vacH = protoH * 0.6;
    ctx.fillStyle = isHypertonic ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.65)";
    ctx.beginPath();
    ctx.roundRect(cx - vacW / 2 + 5 * scale, cy - vacH / 2, vacW, vacH, 14);
    ctx.fill();

    // D. Nucleus
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(cx - protoW / 2 + 20 * scale, cy, 7 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Plasmolysis label if contracted
    if (isHypertonic) {
      ctx.fillStyle = "#f87171";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("⚠️ PLASMOLYSIS: Protoplast Shrunk Away from Wall!", cx, cy + wallH / 2 + 20);
    } else if (isHypotonic) {
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("🌱 TURGID: Turgor Pressure Pushes Against Cell Wall", cx, cy + wallH / 2 + 20);
    } else {
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("⚖️ FLACCID: In Dynamic Osmotic Equilibrium", cx, cy + wallH / 2 + 20);
    }
  } else {
    // Animal Red Blood Cell (No Cell Wall)
    if (isHypotonic && solutePercent <= 0.3) {
      // Cell Bursts (Hemolysis / Lysis)
      ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, 65 * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Released Hemoglobin specks
      for (let h = 0; h < 20; h++) {
        const hx = cx + Math.cos(h * 0.7) * (70 * scale + (h % 3) * 12);
        const hy = cy + Math.sin(h * 0.7) * (70 * scale + (h % 3) * 12);
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("💥 CELL LYSIS (HEMOLYSIS): RBC Burst in Hypotonic Solution!", cx, cy + 90 * scale);
    } else {
      // Intact or Crenated RBC
      const rbcR = (isHypertonic ? 42 : 55) * scale * cellScale;
      ctx.fillStyle = "#ef4444";
      ctx.shadowColor = "#dc2626";
      ctx.shadowBlur = 10;
      ctx.beginPath();

      if (isHypertonic) {
        // Spiky Crenated star appearance
        for (let p = 0; p < 12; p++) {
          const a = (p / 12) * Math.PI * 2;
          const r = p % 2 === 0 ? rbcR : rbcR * 0.75;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else {
        // Biconcave disc
        ctx.arc(cx, cy, rbcR, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Central biconcave depression
      ctx.fillStyle = "#991b1b";
      ctx.beginPath();
      ctx.arc(cx, cy, rbcR * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isHypertonic ? "#fbbf24" : "#38bdf8";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        isHypertonic ? "⚠️ CRENATION: RBC Shriveled & Spiky (Exosmosis)" : "🔴 Normal Biconcave Disc RBC",
        cx,
        cy + 80 * scale
      );
    }
  }

  // 3. Directional Osmotic Water Flux Arrows
  const arrowSpeed = simTime * 2.5;
  const arrowDir = isHypotonic ? -1 : isHypertonic ? 1 : 0; // -1 = into cell, 1 = out of cell

  if (arrowDir !== 0) {
    ctx.strokeStyle = "#38bdf8";
    ctx.fillStyle = "#38bdf8";
    ctx.lineWidth = 2;
    for (let a = 0; a < 4; a++) {
      const angle = (a / 4) * Math.PI * 2;
      const startDist = arrowDir === -1 ? 140 * scale - ((arrowSpeed * 25) % 40) : 75 * scale + ((arrowSpeed * 25) % 40);
      const endDist = startDist + (arrowDir === -1 ? -22 : 22);
      const ax1 = cx + Math.cos(angle) * startDist;
      const ay1 = cy + Math.sin(angle) * startDist;
      const ax2 = cx + Math.cos(angle) * endDist;
      const ay2 = cy + Math.sin(angle) * endDist;

      ctx.beginPath();
      ctx.moveTo(ax1, ay1);
      ctx.lineTo(ax2, ay2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// =========================================================================
// 19. Quadratic Functions & Parabola Geometry Renderer (Mathematics)
// =========================================================================
function renderQuadraticParabolaSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const a = params.coeffA ?? 1;
  const b = params.coeffB ?? -2;
  const c = params.coeffC ?? -3;

  const isLinear = Math.abs(a) < 0.01;
  const D = b * b - 4 * a * c;
  const vertexX = isLinear ? 0 : -b / (2 * a);
  const vertexY = isLinear ? c : c - (b * b) / (4 * a);

  ctx.save();

  const originX = width * 0.5;
  const originY = height * 0.52;
  const scale = Math.min(width, height) / 24; // 1 unit in math = scale pixels

  // 1. Cartesian Grid & Axes
  const xMin = -11;
  const xMax = 11;
  const yMin = -10;
  const yMax = 10;

  // Grid lines
  ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
  ctx.lineWidth = 1;
  for (let x = xMin; x <= xMax; x++) {
    const px = originX + x * scale;
    ctx.beginPath();
    ctx.moveTo(px, originY + yMin * scale);
    ctx.lineTo(px, originY + yMax * scale);
    ctx.stroke();
  }
  for (let y = yMin; y <= yMax; y++) {
    const py = originY - y * scale;
    ctx.beginPath();
    ctx.moveTo(originX + xMin * scale, py);
    ctx.lineTo(originX + xMax * scale, py);
    ctx.stroke();
  }

  // Major Coordinate Axes X and Y
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  // X Axis
  ctx.beginPath();
  ctx.moveTo(originX + xMin * scale - 10, originY);
  ctx.lineTo(originX + xMax * scale + 10, originY);
  ctx.stroke();
  // Y Axis
  ctx.beginPath();
  ctx.moveTo(originX, originY - yMax * scale - 10);
  ctx.lineTo(originX, originY - yMin * scale + 10);
  ctx.stroke();

  // Axis Labels & Unit Ticks
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "9px monospace";
  ctx.textAlign = "center";
  for (let x = -10; x <= 10; x += 2) {
    if (x === 0) continue;
    const px = originX + x * scale;
    ctx.fillText(`${x}`, px, originY + 12);
  }
  ctx.textAlign = "right";
  for (let y = -8; y <= 8; y += 2) {
    if (y === 0) continue;
    const py = originY - y * scale;
    ctx.fillText(`${y}`, originX - 6, py + 3);
  }
  ctx.fillText("O", originX - 6, originY + 12);

  // 2. Axis of Symmetry (Dashed Rose Line)
  if (!isLinear) {
    const symPx = originX + vertexX * scale;
    ctx.strokeStyle = "rgba(244, 63, 94, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(symPx, originY + yMin * scale);
    ctx.lineTo(symPx, originY + yMax * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#fb7185";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Axis: x = ${vertexX.toFixed(2)}`, symPx, originY - yMax * scale + 14);
  }

  // 3. Parabola Curve Path
  ctx.strokeStyle = "#818cf8";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#6366f1";
  ctx.shadowBlur = 12;
  ctx.beginPath();

  let started = false;
  for (let x = xMin - 1; x <= xMax + 1; x += 0.1) {
    const yVal = a * x * x + b * x + c;
    const px = originX + x * scale;
    const py = originY - yVal * scale;

    if (py >= originY - (yMax + 4) * scale && py <= originY - (yMin - 4) * scale) {
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    } else {
      started = false;
    }
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 4. Real Roots / X-Intercepts
  if (!isLinear) {
    if (D > 0) {
      const r1 = (-b - Math.sqrt(D)) / (2 * a);
      const r2 = (-b + Math.sqrt(D)) / (2 * a);
      [r1, r2].forEach((rVal, idx) => {
        const rpx = originX + rVal * scale;
        ctx.fillStyle = "#34d399";
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(rpx, originY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = "bold 9.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`x${idx + 1} = ${rVal.toFixed(2)}`, rpx, originY + (rVal >= 0 ? 24 : -14));
      });
    } else if (Math.abs(D) < 0.01) {
      const r0 = -b / (2 * a);
      const rpx = originX + r0 * scale;
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(rpx, originY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`Root: x = ${r0.toFixed(2)} (Equal)`, rpx, originY + 24);
    }
  }

  // 5. Y-Intercept (0, c)
  const yIntPy = originY - c * scale;
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(originX, yIntPy, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`(0, ${c})`, originX + 8, yIntPy + 3);

  // 6. Vertex Point Marker
  if (!isLinear) {
    const vpx = originX + vertexX * scale;
    const vpy = originY - vertexY * scale;
    ctx.fillStyle = "#facc15";
    ctx.shadowColor = "#eab308";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(vpx, vpy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Vertex Label Badge
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `Vertex V(${vertexX.toFixed(1)}, ${vertexY.toFixed(1)})`,
      vpx,
      vpy + (a > 0 ? 18 : -10)
    );
  }

  // 7. Top-Left HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#4f46e5";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 280), 72, 8);
  ctx.fill();
  ctx.stroke();

  // Equation display string
  const signB = b >= 0 ? "+" : "-";
  const signC = c >= 0 ? "+" : "-";
  const aStr = a === 1 ? "" : a === -1 ? "-" : `${a}`;
  const bStr = Math.abs(b) === 1 ? "" : `${Math.abs(b)}`;
  const eqStr = `y = ${aStr}x² ${signB} ${bStr}x ${signC} ${Math.abs(c)}`;

  ctx.textAlign = "left";
  ctx.fillStyle = "#818cf8";
  ctx.font = "bold 13px monospace";
  ctx.fillText(eqStr, 24, 34);

  // Discriminant badge
  const dTag = D > 0 ? "D > 0 (2 Real Distinct Roots)" : Math.abs(D) < 0.01 ? "D = 0 (1 Real Equal Root)" : "D < 0 (No Real Roots / Complex)";
  ctx.fillStyle = D > 0 ? "#34d399" : Math.abs(D) < 0.01 ? "#facc15" : "#f87171";
  ctx.font = "bold 10px sans-serif";
  ctx.fillText(`Discriminant D = ${D.toFixed(1)} | ${dTag}`, 24, 52);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText(
    `Orientation: ${a > 0 ? "Concave UP (Min Vertex)" : a < 0 ? "Concave DOWN (Max Vertex)" : "Linear Line"}`,
    24,
    68
  );

  ctx.restore();
}

// =========================================================================
// 20. Pythagoras Theorem & Geometric Proof Renderer (Mathematics)
// =========================================================================
function renderPythagorasSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const a = Math.max(3, Math.min(12, Math.round(params.sideA ?? 6)));
  const b = Math.max(3, Math.min(12, Math.round(params.sideB ?? 8)));
  const proofMode = Math.round(params.dissectProof ?? 1);

  const c = Math.sqrt(a * a + b * b);
  const isTriplet = Math.abs(c - Math.round(c)) < 1e-4;

  ctx.save();

  // Unit scale to fit all 3 squares neatly inside the canvas
  const totalSpan = a + b + c;
  const scale = Math.min(width, height) / (totalSpan * 1.05 + 8);

  const cx = width * 0.44;
  const cy = height * 0.52;

  const aLen = a * scale;
  const bLen = b * scale;
  const cLen = c * scale;
  const theta = Math.atan2(b, a);

  // Triangle vertices:
  // Right Angle corner at O(cx, cy)
  // Vertex A on horizontal base: (cx + aLen, cy)
  // Vertex B on vertical altitude: (cx, cy - bLen)
  const oX = cx;
  const oY = cy;
  const aX = cx + aLen;
  const aY = cy;
  const bX = cx;
  const bY = cy - bLen;

  // 1. Square on Base (a x a, below horizontal leg)
  ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(oX, oY, aLen, aLen);
  ctx.fill();
  ctx.stroke();

  // Grid unit tiles inside Square A if mode 1
  if (proofMode === 1 && a <= 10) {
    ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
    ctx.lineWidth = 1;
    for (let i = 1; i < a; i++) {
      const gx = oX + i * scale;
      const gy = oY + i * scale;
      ctx.beginPath();
      ctx.moveTo(gx, oY);
      ctx.lineTo(gx, oY + aLen);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(oX, gy);
      ctx.lineTo(oX + aLen, gy);
      ctx.stroke();
    }
  }

  // Label for Square A
  ctx.fillStyle = "#60a5fa";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`a² = ${a * a}`, oX + aLen / 2, oY + aLen / 2 + 4);

  // 2. Square on Altitude (b x b, left of vertical leg)
  ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(oX - bLen, bY, bLen, bLen);
  ctx.fill();
  ctx.stroke();

  // Grid unit tiles inside Square B
  if (proofMode === 1 && b <= 10) {
    ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
    ctx.lineWidth = 1;
    for (let i = 1; i < b; i++) {
      const gx = oX - bLen + i * scale;
      const gy = bY + i * scale;
      ctx.beginPath();
      ctx.moveTo(gx, bY);
      ctx.lineTo(gx, bY + bLen);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(oX - bLen, gy);
      ctx.lineTo(oX, gy);
      ctx.stroke();
    }
  }

  // Label for Square B
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`b² = ${b * b}`, oX - bLen / 2, bY + bLen / 2 + 4);

  // 3. Square on Hypotenuse (c x c, constructed outward along hypotenuse)
  ctx.save();
  ctx.translate(aX, aY);
  ctx.rotate(-Math.PI + theta);

  ctx.fillStyle = "rgba(245, 158, 11, 0.22)";
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(0, 0, cLen, cLen);
  ctx.fill();
  ctx.stroke();

  // Grid tiles inside Square C if integer
  if (proofMode === 1 && isTriplet && Math.round(c) <= 10) {
    const cInt = Math.round(c);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 1;
    for (let i = 1; i < cInt; i++) {
      const gx = i * scale;
      const gy = i * scale;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, cLen);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(cLen, gy);
      ctx.stroke();
    }
  }

  // Hypotenuse square center label
  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`c² = ${a * a + b * b}`, cLen / 2, cLen / 2 + 4);
  ctx.restore();

  // 4. Central Right-Angled Triangle
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(oX, oY);
  ctx.lineTo(aX, aY);
  ctx.lineTo(bX, bY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right-angle 90° square marker at corner O
  const raSize = Math.max(10, 14 * (scale / 20));
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(oX, oY - raSize, raSize, raSize);
  ctx.stroke();

  // Side length labels
  ctx.fillStyle = "#60a5fa";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`a = ${a}`, oX + aLen / 2, oY - 6);

  ctx.fillStyle = "#34d399";
  ctx.fillText(`b = ${b}`, oX + 16, bY + bLen / 2);

  ctx.fillStyle = "#fbbf24";
  ctx.fillText(`c = ${c.toFixed(2)}`, (aX + bX) / 2 + 16, (aY + bY) / 2 - 10);

  // 5. Area Conservation Animated Stream in Mode 2
  if (proofMode === 2) {
    const flowT = (simTime * 1.5) % 1.0;
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    // Flow from A to C
    ctx.beginPath();
    ctx.moveTo(oX + aLen / 2, oY + aLen / 2);
    ctx.lineTo(oX + aLen / 2 + (aX - oX) * flowT, oY - (bLen * 0.5) * flowT);
    ctx.stroke();

    // Flow from B to C
    ctx.beginPath();
    ctx.moveTo(oX - bLen / 2, bY + bLen / 2);
    ctx.lineTo(oX - bLen / 2 + (aLen * 0.5) * flowT, bY + (bLen * 0.5) * flowT);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 6. Header HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 290), 70, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px monospace";
  ctx.fillText(`a² + b² = c²`, 24, 34);

  ctx.fillStyle = "#93c5fd";
  ctx.font = "11px monospace";
  ctx.fillText(`${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b} = (${c.toFixed(2)})²`, 24, 50);

  ctx.fillStyle = isTriplet ? "#34d399" : "#fbbf24";
  ctx.font = "bold 10px sans-serif";
  ctx.fillText(
    isTriplet ? `✨ Pythagorean Triplet: (${a}, ${b}, ${Math.round(c)})` : `Hypotenuse c = √(${a * a + b * b}) ≈ ${c.toFixed(3)}`,
    24,
    66
  );

  ctx.restore();
}

// =========================================================================
// 21. Normal (Gaussian) Distribution & 68-95-99.7 Rule Renderer (Mathematics)
// =========================================================================
function renderNormalDistributionSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const mu = params.mean ?? 0;
  const sigma = Math.max(0.5, params.stdDev ?? 1.5);
  const sampleN = Math.round(params.sampleSize ?? 400);
  const kInterval = Math.max(1, Math.min(3, Math.round(params.shadeInterval ?? 1))); // 1: 68.3%, 2: 95.4%, 3: 99.7%

  ctx.save();

  const originX = width * 0.5;
  const baseY = height * 0.72;
  const scaleX = width / 26; // approx -13 to +13 range on X
  const scaleY = (height * 0.45) / 0.45; // scale PDF height (peak for std=1 is ~0.4)

  // 1. Coordinate Grid & X-Axis
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(15, baseY);
  ctx.lineTo(width - 15, baseY);
  ctx.stroke();

  // X Axis Ticks
  ctx.fillStyle = "#94a3b8";
  ctx.font = "9px monospace";
  ctx.textAlign = "center";
  for (let x = -12; x <= 12; x += 2) {
    const px = originX + x * scaleX;
    if (px > 20 && px < width - 20) {
      ctx.beginPath();
      ctx.moveTo(px, baseY);
      ctx.lineTo(px, baseY + 4);
      ctx.stroke();
      ctx.fillText(`${x}`, px, baseY + 14);
    }
  }

  // Gaussian PDF function: f(x) = (1 / (sigma * sqrt(2*PI))) * exp(-(x - mu)^2 / (2*sigma^2))
  const gaussianPDF = (x: number) => {
    const z = (x - mu) / sigma;
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
  };

  const lowerK = mu - kInterval * sigma;
  const upperK = mu + kInterval * sigma;

  // 2. Shaded Confidence Interval Region (μ ± kσ)
  const xLeftPx = originX + lowerK * scaleX;
  const xRightPx = originX + upperK * scaleX;

  const shadeGrad = ctx.createLinearGradient(0, baseY - 120, 0, baseY);
  if (kInterval === 1) {
    shadeGrad.addColorStop(0, "rgba(56, 189, 248, 0.55)");
    shadeGrad.addColorStop(1, "rgba(56, 189, 248, 0.1)");
  } else if (kInterval === 2) {
    shadeGrad.addColorStop(0, "rgba(129, 140, 248, 0.55)");
    shadeGrad.addColorStop(1, "rgba(129, 140, 248, 0.1)");
  } else {
    shadeGrad.addColorStop(0, "rgba(236, 72, 153, 0.55)");
    shadeGrad.addColorStop(1, "rgba(236, 72, 153, 0.1)");
  }

  ctx.fillStyle = shadeGrad;
  ctx.beginPath();
  ctx.moveTo(xLeftPx, baseY);
  for (let x = lowerK; x <= upperK; x += 0.1) {
    const px = originX + x * scaleX;
    const py = baseY - gaussianPDF(x) * scaleY;
    ctx.lineTo(px, py);
  }
  ctx.lineTo(xRightPx, baseY);
  ctx.closePath();
  ctx.fill();

  // 3. Bell Curve Line
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#0284c7";
  ctx.shadowBlur = 8;
  ctx.beginPath();

  const minPlotX = -13;
  const maxPlotX = 13;
  let firstPt = true;
  for (let x = minPlotX; x <= maxPlotX; x += 0.1) {
    const px = originX + x * scaleX;
    const py = baseY - gaussianPDF(x) * scaleY;
    if (firstPt) {
      ctx.moveTo(px, py);
      firstPt = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 4. Vertical Standard Deviation Markers (μ - 3σ, μ - 2σ, μ - σ, μ, μ + σ, μ + 2σ, μ + 3σ)
  const sigmas = [-3, -2, -1, 0, 1, 2, 3];
  sigmas.forEach((s) => {
    const xVal = mu + s * sigma;
    const px = originX + xVal * scaleX;
    const isCenter = s === 0;

    ctx.strokeStyle = isCenter ? "#facc15" : Math.abs(s) <= kInterval ? "rgba(56, 189, 248, 0.7)" : "rgba(100, 116, 139, 0.4)";
    ctx.lineWidth = isCenter ? 2 : 1.2;
    ctx.setLineDash(isCenter ? [] : [3, 3]);

    const py = baseY - gaussianPDF(xVal) * scaleY;
    ctx.beginPath();
    ctx.moveTo(px, baseY);
    ctx.lineTo(px, isCenter ? py - 8 : py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tick Label
    ctx.fillStyle = isCenter ? "#facc15" : "#94a3b8";
    ctx.font = isCenter ? "bold 10px sans-serif" : "9px sans-serif";
    ctx.textAlign = "center";
    const label = isCenter ? "μ" : s > 0 ? `+${s}σ` : `${s}σ`;
    ctx.fillText(label, px, baseY + 26);
  });

  // 5. Stochastic Sample Scatter Dots (Galton Board / Monte Carlo Demonstration)
  const pseudoSeed = Math.round(sampleN);
  for (let i = 0; i < Math.min(80, pseudoSeed); i++) {
    // Box-Muller transform for pseudo-random Gaussian
    const u1 = ((i * 37 + 13) % 97) / 97;
    const u2 = ((i * 53 + 29) % 101) / 101;
    const z0 = Math.sqrt(-2.0 * Math.log(u1 + 0.001)) * Math.cos(2.0 * Math.PI * u2);
    const sampleX = mu + z0 * sigma;
    const px = originX + sampleX * scaleX;
    const py = baseY + 36 + (i % 4) * 6;

    if (px > 20 && px < width - 20) {
      ctx.fillStyle = Math.abs(sampleX - mu) <= kInterval * sigma ? "#38bdf8" : "#94a3b8";
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 6. Header HUD Card: Empirical Rule Details
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 300), 72, 8);
  ctx.fill();
  ctx.stroke();

  const areaPercentStr = kInterval === 1 ? "68.27% (1σ)" : kInterval === 2 ? "95.45% (2σ)" : "99.73% (3σ)";
  const badgeColor = kInterval === 1 ? "#38bdf8" : kInterval === 2 ? "#818cf8" : "#f472b6";

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`Normal Distribution N(μ = ${mu}, σ² = ${(sigma * sigma).toFixed(2)})`, 24, 34);

  ctx.fillStyle = badgeColor;
  ctx.font = "bold 11px monospace";
  ctx.fillText(`Empirical Area [μ - ${kInterval}σ, μ + ${kInterval}σ] = ${areaPercentStr}`, 24, 52);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText(
    `Peak: f(μ) = ${(1 / (sigma * Math.sqrt(2 * Math.PI))).toFixed(3)} | Bounds: [${lowerK.toFixed(1)}, ${upperK.toFixed(1)}]`,
    24,
    68
  );

  ctx.restore();
}

// =========================================================================
// 22. Faraday's Law & Electromagnetic Induction Renderer (Physics)
// =========================================================================
function renderFaradayInductionSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const basePos = params.magnetPos ?? -60;
  const turns = Math.max(1, Math.min(4, Math.round(params.coilTurns ?? 3)));
  const speed = params.magnetSpeed ?? 2;
  const polarity = params.magnetPolarity === -1 ? -1 : 1; // 1 = North leading, -1 = South leading

  // Dynamic oscillation if speed > 0
  const oscFreq = speed * 1.8;
  const oscAmp = speed > 0 ? 35 : 0;
  const oscX = oscAmp > 0 ? Math.sin(simTime * oscFreq) * oscAmp : 0;
  const currentX = basePos + oscX; // magnet center X in mm (-100 to +100)
  const currentVel = oscAmp > 0 ? Math.cos(simTime * oscFreq) * oscAmp * oscFreq * 0.1 : 0;

  // Magnetic flux model through coil at x=0:
  // Flux peaks when magnet enters coil center x=0
  const dCoil = 40; // characteristic spatial scale in mm
  const normX = currentX / dCoil;
  const flux = (1.0 / Math.pow(1 + normX * normX, 1.5)) * polarity;
  // dFlux/dt derivative
  const dFlux_dt = (-3.0 * normX / Math.pow(1 + normX * normX, 2.5)) * (currentVel / dCoil) * polarity;
  // Induced EMF by Faraday-Lenz law: EMF = -N * dFlux/dt
  const inducedEMF = -turns * dFlux_dt * 12.0; // scaled Volts
  const bulbPower = Math.min(1.0, (inducedEMF * inducedEMF) * 0.08);

  ctx.save();

  const centerX = width * 0.5;
  const centerY = height * 0.48;
  const scaleMm = Math.min(width, height) / 230; // pixels per mm

  // 1. Solenoid Coil Body (Helical Copper Loops)
  const coilWidth = 60 * scaleMm;
  const coilHeight = 70 * scaleMm;
  const coilX = centerX - coilWidth / 2;
  const coilY = centerY - coilHeight / 2;

  // Coil core back shadow
  ctx.fillStyle = "rgba(30, 41, 59, 0.6)";
  ctx.fillRect(coilX - 4, coilY + 6, coilWidth + 8, coilHeight - 12);

  // Magnetic Field Lines (Looping vector lines around magnet)
  const magPx = centerX + currentX * scaleMm;
  const magPy = centerY;
  ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
  ctx.lineWidth = 1.2;
  for (let r = 24; r <= 80; r += 16) {
    ctx.beginPath();
    ctx.ellipse(magPx, magPy, (r * 1.5) * scaleMm, (r * 0.8) * scaleMm, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Bar Magnet (Cylindrical with North and South Poles)
  const magW = 70 * scaleMm;
  const magH = 28 * scaleMm;
  const northOnRight = polarity === 1;

  // South Pole Rect
  ctx.fillStyle = northOnRight ? "#2563eb" : "#dc2626";
  ctx.fillRect(magPx - magW / 2, magPy - magH / 2, magW / 2, magH);
  // North Pole Rect
  ctx.fillStyle = northOnRight ? "#dc2626" : "#2563eb";
  ctx.fillRect(magPx, magPy - magH / 2, magW / 2, magH);

  // Magnet Border & Metallic Sheen
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(magPx - magW / 2, magPy - magH / 2, magW, magH);

  // Magnet Pole Labels
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (northOnRight) {
    ctx.fillText("S", magPx - magW / 4, magPy);
    ctx.fillText("N", magPx + magW / 4, magPy);
  } else {
    ctx.fillText("N", magPx - magW / 4, magPy);
    ctx.fillText("S", magPx + magW / 4, magPy);
  }

  // Magnet Motion Velocity Arrow
  if (Math.abs(currentVel) > 0.5) {
    const arrowDir = currentVel > 0 ? 1 : -1;
    const arrowLen = Math.min(30, Math.abs(currentVel) * 5);
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(magPx, magPy - magH / 2 - 12);
    ctx.lineTo(magPx + arrowDir * arrowLen, magPy - magH / 2 - 12);
    ctx.lineTo(magPx + arrowDir * (arrowLen - 6), magPy - magH / 2 - 16);
    ctx.moveTo(magPx + arrowDir * arrowLen, magPy - magH / 2 - 12);
    ctx.lineTo(magPx + arrowDir * (arrowLen - 6), magPy - magH / 2 - 8);
    ctx.stroke();

    ctx.fillStyle = "#facc15";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText(`v = ${currentVel.toFixed(1)} m/s`, magPx, magPy - magH / 2 - 22);
  }

  // 3. Solenoid Copper Turns (Front Loops layered over magnet)
  const loopSpacing = coilWidth / (turns + 1);
  for (let i = 1; i <= turns; i++) {
    const lx = coilX + i * loopSpacing;

    // Copper turn loop
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 5 * scaleMm;
    ctx.beginPath();
    ctx.ellipse(lx, centerY, 5 * scaleMm, coilHeight / 2, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Metallic Copper highlight
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 4. Electrical Circuit Connecting Solenoid to Galvanometer & Bulb
  const wireTopY = centerY - coilHeight / 2 - 25;
  const wireBotY = centerY + coilHeight / 2 + 35;
  const meterX = centerX - 60;
  const bulbX = centerX + 60;

  // Circuit Wires
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  // Top circuit wire
  ctx.beginPath();
  ctx.moveTo(coilX, centerY - coilHeight / 2 + 5);
  ctx.lineTo(coilX - 15, wireTopY);
  ctx.lineTo(bulbX, wireTopY);
  ctx.lineTo(bulbX, wireBotY - 45);
  ctx.stroke();

  // Bottom circuit wire
  ctx.beginPath();
  ctx.moveTo(coilX + coilWidth, centerY + coilHeight / 2 - 5);
  ctx.lineTo(coilX + coilWidth + 15, wireBotY);
  ctx.lineTo(bulbX, wireBotY);
  ctx.stroke();

  // Branch to galvanometer
  ctx.beginPath();
  ctx.moveTo(meterX, wireTopY);
  ctx.lineTo(meterX, wireBotY - 50);
  ctx.moveTo(meterX, wireBotY);
  ctx.lineTo(meterX, wireBotY - 10);
  ctx.stroke();

  // Animated Current Flow Dots (if EMF active)
  if (Math.abs(inducedEMF) > 0.1) {
    const electronSpeed = inducedEMF * 2.0;
    const dotPhase = (simTime * electronSpeed) % 1.0;
    ctx.fillStyle = "#38bdf8";
    for (let d = 0; d < 6; d++) {
      const frac = ((d / 6) + dotPhase + 1.0) % 1.0;
      const wirePx = coilX - 15 + frac * (bulbX - coilX + 15);
      ctx.beginPath();
      ctx.arc(wirePx, wireTopY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. Center-Zero Sensitive Galvanometer
  const meterY = wireBotY - 30;
  const meterR = 26;
  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(meterX, meterY, meterR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Dial scale ticks (-G, 0, +G)
  ctx.fillStyle = "#94a3b8";
  ctx.font = "8px monospace";
  ctx.fillText("0", meterX, meterY - meterR + 8);
  ctx.fillText("-", meterX - 14, meterY - meterR + 12);
  ctx.fillText("+", meterX + 14, meterY - meterR + 12);
  ctx.fillText("G", meterX, meterY + 12);

  // Needle Deflection
  const maxDeflectAngle = Math.PI / 4; // 45 deg
  const needleAngle = Math.max(-maxDeflectAngle, Math.min(maxDeflectAngle, inducedEMF * 0.4));
  ctx.save();
  ctx.translate(meterX, meterY);
  ctx.rotate(needleAngle);
  ctx.strokeStyle = "#f43f5e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.lineTo(0, -meterR + 4);
  ctx.stroke();
  // Pivot dot
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Miniature Incandescent Bulb
  const bulbY = wireBotY - 22;
  // Bulb Glow Aura
  if (bulbPower > 0.05) {
    const bulbGlow = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, 26 * bulbPower + 8);
    bulbGlow.addColorStop(0, "rgba(254, 240, 138, 0.9)");
    bulbGlow.addColorStop(0.5, "rgba(250, 204, 21, 0.45)");
    bulbGlow.addColorStop(1, "rgba(250, 204, 21, 0)");
    ctx.fillStyle = bulbGlow;
    ctx.beginPath();
    ctx.arc(bulbX, bulbY, 26 * bulbPower + 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Glass Bulb Outline
  ctx.fillStyle = bulbPower > 0.1 ? "#fef08a" : "rgba(255, 255, 255, 0.15)";
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(bulbX, bulbY, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Filament
  ctx.strokeStyle = bulbPower > 0.1 ? "#f59e0b" : "#64748b";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(bulbX - 4, bulbY + 5);
  ctx.lineTo(bulbX, bulbY - 3);
  ctx.lineTo(bulbX + 4, bulbY + 5);
  ctx.stroke();

  // 7. Top Header HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 300), 72, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Faraday's Law: ℰ = -N (dΦ_B / dt)", 24, 34);

  const emfSign = inducedEMF >= 0 ? "+" : "";
  ctx.fillStyle = Math.abs(inducedEMF) > 0.05 ? "#34d399" : "#94a3b8";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`Induced EMF: ${emfSign}${inducedEMF.toFixed(2)} V | Turns N = ${turns}`, 24, 52);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "10px sans-serif";
  const lenzTag = Math.abs(inducedEMF) < 0.05 ? "Equilibrium (dΦ/dt = 0)" : inducedEMF > 0 ? "Lenz: Opposing flux decrease" : "Lenz: Opposing flux increase";
  ctx.fillText(`Flux Φ_B = ${flux.toFixed(3)} Wb | ${lenzTag}`, 24, 68);

  ctx.restore();
}

// =========================================================================
// 23. Photoelectric Effect & Quantum Physics Renderer (Physics)
// =========================================================================
function renderPhotoelectricSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const wavelength = Math.max(200, Math.min(750, params.wavelength ?? 380));
  const intensity = Math.max(10, Math.min(100, params.intensity ?? 60));
  const voltage = params.stoppingVoltage ?? 0.0;
  const targetIdx = Math.max(1, Math.min(4, Math.round(params.targetMetal ?? 2)));

  // Target metals work function Φ₀ in eV
  const metals = [
    { name: "Cesium (Cs)", phi0: 2.14, color: "#d8b4fe" },
    { name: "Sodium (Na)", phi0: 2.75, color: "#cbd5e1" },
    { name: "Zinc (Zn)", phi0: 4.31, color: "#94a3b8" },
    { name: "Copper (Cu)", phi0: 4.70, color: "#f59e0b" },
  ];
  const metal = metals[targetIdx - 1];

  // Photon energy: E = 1240 / lambda eV
  const photonE = 1240 / wavelength;
  const isAboveThreshold = photonE > metal.phi0;
  const maxKE = isAboveThreshold ? photonE - metal.phi0 : 0;
  const stoppingPotential = maxKE; // in Volts

  // Photocurrent calculation:
  let photocurrent = 0;
  if (isAboveThreshold) {
    if (voltage < -stoppingPotential) {
      photocurrent = 0; // completely turned back by retarding potential
    } else {
      const satCurrent = (intensity / 100) * 1.5; // max saturation current in mA
      const vDiff = voltage - (-stoppingPotential);
      photocurrent = Math.min(satCurrent, satCurrent * Math.sqrt(vDiff / (stoppingPotential + 1.0)));
    }
  }

  // Wavelength to RGB color mapping
  const getWavelengthColor = (wl: number) => {
    if (wl < 380) return "#c084fc"; // UV Violet
    if (wl < 450) return "#818cf8"; // Violet-Blue
    if (wl < 495) return "#38bdf8"; // Cyan
    if (wl < 570) return "#4ade80"; // Green
    if (wl < 590) return "#facc15"; // Yellow
    if (wl < 620) return "#fb923c"; // Orange
    return "#f87171"; // Red
  };
  const beamColor = getWavelengthColor(wavelength);

  ctx.save();

  const centerX = width * 0.5;
  const centerY = height * 0.44;

  // 1. Evacuated Quartz Tube Envelope
  const tubeW = Math.min(width - 50, 310);
  const tubeH = 110;
  const tubeX = centerX - tubeW / 2;
  const tubeY = centerY - tubeH / 2;

  // Glass background with subtle glow
  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(tubeX, tubeY, tubeW, tubeH, 20);
  ctx.fill();
  ctx.stroke();

  // Vacuum tube quartz reflection highlight
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(tubeX + 15, tubeY + 8);
  ctx.lineTo(tubeX + tubeW - 15, tubeY + 8);
  ctx.stroke();

  // 2. Photosensitive Cathode (Emitter Plate) & Anode (Collector Plate)
  const plateW = 10;
  const plateH = 70;
  const cathodeX = tubeX + 45;
  const anodeX = tubeX + tubeW - 45;
  const plateY = centerY - plateH / 2;

  // Cathode plate
  ctx.fillStyle = metal.color;
  ctx.fillRect(cathodeX, plateY, plateW, plateH);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.strokeRect(cathodeX, plateY, plateW, plateH);

  // Anode plate
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(anodeX - plateW, plateY, plateW, plateH);
  ctx.strokeRect(anodeX - plateW, plateY, plateW, plateH);

  // Plate Labels
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Cathode (-)", cathodeX + plateW / 2, plateY - 8);
  ctx.fillText(`${metal.name}`, cathodeX + plateW / 2, plateY + plateH + 12);
  ctx.fillText("Anode (+)", anodeX - plateW / 2, plateY - 8);

  // 3. Incident Monochromatic Light Beam shining through quartz window onto cathode
  const lightSourceX = tubeX - 10;
  const lightSourceY = tubeY - 30;

  ctx.strokeStyle = beamColor;
  ctx.lineWidth = (intensity / 100) * 8 + 2;
  ctx.shadowColor = beamColor;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(lightSourceX, lightSourceY);
  ctx.lineTo(cathodeX + 2, centerY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Incident Photon Wave Packets
  const photonCount = Math.round((intensity / 100) * 5) + 2;
  for (let p = 0; p < photonCount; p++) {
    const tP = ((p / photonCount) + simTime * 1.5) % 1.0;
    const px = lightSourceX + tP * (cathodeX - lightSourceX);
    const py = lightSourceY + tP * (centerY - lightSourceY);

    ctx.fillStyle = beamColor;
    ctx.beginPath();
    ctx.arc(px, py + Math.sin(tP * Math.PI * 8) * 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Ejected Photoelectrons in Transit
  if (isAboveThreshold && maxKE > 0) {
    const electronCount = Math.round((intensity / 100) * 14) + 4;
    const electronSpeed = Math.sqrt(maxKE) * 0.8; // v proportional to sqrt(KE)

    for (let e = 0; e < electronCount; e++) {
      const ePhase = ((e / electronCount) + simTime * electronSpeed) % 1.0;
      const progress = ePhase;

      // Retarding potential decelerates or reverses electrons
      let eX = cathodeX + plateW + progress * (anodeX - cathodeX - plateW);
      if (voltage < 0) {
        const turnBackPoint = Math.max(0.1, 1.0 - Math.abs(voltage) / (stoppingPotential + 0.01));
        if (progress > turnBackPoint) {
          // Electron reflected back by retarding electric field
          eX = cathodeX + plateW + (turnBackPoint - (progress - turnBackPoint)) * (anodeX - cathodeX - plateW);
        }
      }

      const eY = plateY + 8 + ((e * 17) % (plateH - 16));

      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#0284c7";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(eX, eY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // 5. External Circuit with DC Voltage & Microammeter
  const circuitBotY = centerY + tubeH / 2 + 35;
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  // Wires connecting cathode down to battery
  ctx.beginPath();
  ctx.moveTo(cathodeX + plateW / 2, plateY + plateH);
  ctx.lineTo(cathodeX + plateW / 2, circuitBotY);
  ctx.lineTo(centerX - 40, circuitBotY);
  ctx.stroke();

  // Wires connecting anode down to microammeter and battery
  ctx.beginPath();
  ctx.moveTo(anodeX - plateW / 2, plateY + plateH);
  ctx.lineTo(anodeX - plateW / 2, circuitBotY);
  ctx.lineTo(centerX + 40, circuitBotY);
  ctx.stroke();

  // Applied Voltage Battery Icon
  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = voltage < 0 ? "#f43f5e" : "#3b82f6";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(centerX - 40, circuitBotY - 14, 80, 28, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`V = ${voltage.toFixed(1)} V`, centerX, circuitBotY + 4);

  // Microammeter (Current indicator)
  const ammeterX = anodeX - plateW / 2;
  const ammeterY = circuitBotY - 18;
  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(ammeterX, ammeterY, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = photocurrent > 0 ? "#34d399" : "#94a3b8";
  ctx.font = "bold 8px monospace";
  ctx.fillText("μA", ammeterX, ammeterY + 3);

  // 6. Top Header HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#a855f7";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 300), 74, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(`Einstein Photoelectric: K_max = hν - Φ₀`, 24, 34);

  ctx.fillStyle = isAboveThreshold ? "#34d399" : "#f87171";
  ctx.font = "bold 11px monospace";
  ctx.fillText(
    `Photon hν = ${photonE.toFixed(2)} eV | Φ₀ = ${metal.phi0} eV | ${isAboveThreshold ? "EMISSION ACTIVE" : "E < Φ₀ (NO EMISSION)"}`,
    24,
    52
  );

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "10px sans-serif";
  ctx.fillText(
    `K_max = ${maxKE.toFixed(2)} eV | Stopping V₀ = ${stoppingPotential.toFixed(2)} V | I = ${photocurrent.toFixed(2)} μA`,
    24,
    69
  );

  ctx.restore();
}

// =========================================================================
// 24. Electrolysis of Water & Hofmann Voltameter Renderer (Chemistry)
// =========================================================================
function renderWaterElectrolysisSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  const voltage = params.cellVoltage ?? 12;
  const acidDrops = Math.max(1, Math.min(10, params.acidConcentration ?? 5));
  const timeSec = Math.max(10, Math.min(120, params.electrolysisTime ?? 40));
  const testMode = Math.round(params.testSplint ?? 1); // 1: normal, 2: cathode pop, 3: anode rekindle

  // Electrolysis rate scales with voltage and electrolyte ionic conductance
  const current = (voltage / 8) * (acidDrops / 5) * 0.45; // in Amperes
  const gasProductionRate = current * (timeSec / 30);
  const vO2 = Math.min(30, gasProductionRate * 2.5); // Oxygen volume in mL
  const vH2 = vO2 * 2; // Strict 2:1 stoichiometric ratio

  ctx.save();

  const centerX = width * 0.5;
  const centerY = height * 0.5;

  // Hofmann Voltameter dimensions
  const tubeWidth = 26;
  const tubeHeight = 150;
  const tubeSpacing = 65;
  const cathodeTubeX = centerX - tubeSpacing;
  const anodeTubeX = centerX + tubeSpacing;
  const tubeTopY = centerY - tubeHeight / 2 - 10;
  const tubeBotY = tubeTopY + tubeHeight;

  // 1. Central Reservoir Funnel
  ctx.fillStyle = "rgba(14, 165, 233, 0.25)";
  ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 18, tubeTopY - 20);
  ctx.lineTo(centerX + 18, tubeTopY - 20);
  ctx.lineTo(centerX + 8, tubeBotY - 40);
  ctx.lineTo(centerX - 8, tubeBotY - 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Bottom connecting manifold
  ctx.fillRect(cathodeTubeX - 4, tubeBotY - 25, tubeSpacing * 2 + tubeWidth + 8, 22);
  ctx.strokeRect(cathodeTubeX - 4, tubeBotY - 25, tubeSpacing * 2 + tubeWidth + 8, 22);

  // 2. Left Column: Cathode Column (Hydrogen H₂)
  // Gas accumulation pushes water meniscus downward
  const h2WaterLevel = tubeTopY + 20 + vH2 * 1.5; // lower meniscus means more gas
  // Gas pocket at top
  ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
  ctx.fillRect(cathodeTubeX, tubeTopY, tubeWidth, h2WaterLevel - tubeTopY);
  // Acidified water liquid below meniscus
  ctx.fillStyle = "rgba(14, 165, 233, 0.4)";
  ctx.fillRect(cathodeTubeX, h2WaterLevel, tubeWidth, tubeBotY - h2WaterLevel);
  // Glass tube outline
  ctx.strokeStyle = "rgba(226, 232, 240, 0.6)";
  ctx.lineWidth = 2;
  ctx.strokeRect(cathodeTubeX, tubeTopY, tubeWidth, tubeHeight);

  // 3. Right Column: Anode Column (Oxygen O₂)
  const o2WaterLevel = tubeTopY + 20 + vO2 * 1.5; // strictly half displacement of H₂!
  // Gas pocket
  ctx.fillStyle = "rgba(52, 211, 153, 0.15)";
  ctx.fillRect(anodeTubeX, tubeTopY, tubeWidth, o2WaterLevel - tubeTopY);
  // Liquid
  ctx.fillStyle = "rgba(14, 165, 233, 0.4)";
  ctx.fillRect(anodeTubeX, o2WaterLevel, tubeWidth, tubeBotY - o2WaterLevel);
  // Glass outline
  ctx.strokeRect(anodeTubeX, tubeTopY, tubeWidth, tubeHeight);

  // Column Volume Tick Marks
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1;
  for (let y = tubeTopY + 20; y <= tubeBotY - 20; y += 12) {
    ctx.beginPath();
    ctx.moveTo(cathodeTubeX + tubeWidth - 6, y);
    ctx.lineTo(cathodeTubeX + tubeWidth, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(anodeTubeX, y);
    ctx.lineTo(anodeTubeX + 6, y);
    ctx.stroke();
  }

  // 4. Platinum Electrodes at Bottom of Tubes
  const ptH = 22;
  const ptW = 4;
  // Cathode (-) Platinum foil
  ctx.fillStyle = "#334155";
  ctx.fillRect(cathodeTubeX + tubeWidth / 2 - ptW / 2, tubeBotY - ptH - 6, ptW, ptH);
  // Anode (+) Platinum foil
  ctx.fillRect(anodeTubeX + tubeWidth / 2 - ptW / 2, tubeBotY - ptH - 6, ptW, ptH);

  // 5. Rising Effervescence Gas Bubbles
  const bubbleCount = Math.round(current * 10);
  // Hydrogen bubbles (twice as frequent)
  for (let i = 0; i < bubbleCount * 2; i++) {
    const bPhase = ((i / (bubbleCount * 2)) + simTime * 1.8) % 1.0;
    const by = tubeBotY - 8 - bPhase * (tubeBotY - h2WaterLevel - 4);
    const bx = cathodeTubeX + 6 + ((i * 7) % (tubeWidth - 12));

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Oxygen bubbles (half volume)
  for (let i = 0; i < bubbleCount; i++) {
    const bPhase = ((i / bubbleCount) + simTime * 1.2) % 1.0;
    const by = tubeBotY - 8 - bPhase * (tubeBotY - o2WaterLevel - 4);
    const bx = anodeTubeX + 6 + ((i * 9) % (tubeWidth - 12));

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stopcocks at top of tubes
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(cathodeTubeX + tubeWidth / 2 - 3, tubeTopY - 10, 6, 10);
  ctx.fillRect(anodeTubeX + tubeWidth / 2 - 3, tubeTopY - 10, 6, 10);

  // Column Labels
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Cathode (-)", cathodeTubeX + tubeWidth / 2, tubeBotY + 16);
  ctx.fillText(`H₂: ${vH2.toFixed(1)} mL`, cathodeTubeX + tubeWidth / 2, tubeBotY + 30);

  ctx.fillStyle = "#34d399";
  ctx.fillText("Anode (+)", anodeTubeX + tubeWidth / 2, tubeBotY + 16);
  ctx.fillText(`O₂: ${vO2.toFixed(1)} mL`, anodeTubeX + tubeWidth / 2, tubeBotY + 30);

  // 6. Diagnostic Spark Test Simulation
  if (testMode === 2) {
    // Cathode POP test
    const flameX = cathodeTubeX + tubeWidth / 2;
    const flameY = tubeTopY - 16;
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(flameX, flameY, 8 + Math.sin(simTime * 20) * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("💥 SQUEAKY POP!", flameX, flameY - 14);
  } else if (testMode === 3) {
    // Anode Glowing Splint Rekindling
    const flameX = anodeTubeX + tubeWidth / 2;
    const flameY = tubeTopY - 16;
    ctx.fillStyle = "#facc15";
    ctx.shadowColor = "#eab308";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(flameX, flameY, 9 + Math.sin(simTime * 15) * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("🔥 REKINDLED!", flameX, flameY - 14);
  }

  // 7. DC Power Supply Box at Bottom
  const psuY = tubeBotY + 44;
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(centerX - 50, psuY, 100, 24, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 10px monospace";
  ctx.fillText(`DC ${voltage}V | ${current.toFixed(2)}A`, centerX, psuY + 16);

  // 8. Top Header HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#0ea5e9";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 300), 72, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Water Electrolysis: 2H₂O → 2H₂ + O₂", 24, 34);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`Volume Ratio H₂ : O₂ = ${(vH2 / Math.max(0.1, vO2)).toFixed(1)} : 1 (Exact 2 : 1)`, 24, 52);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "10px sans-serif";
  ctx.fillText(`H₂ = ${vH2.toFixed(1)} mL (Cathode) | O₂ = ${vO2.toFixed(1)} mL (Anode)`, 24, 68);

  ctx.restore();
}

// =========================================================================
// 25. Vector Addition & Resolution Renderer (Head-to-Tail & Parallelogram)
// =========================================================================
function renderVectorAdditionSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  ctx.save();
  const magA = params.vectorAMag ?? params.magA ?? 50;
  const angADeg = params.vectorAAngle ?? params.angleA ?? 0;
  const magB = params.vectorBMag ?? params.magB ?? 45;
  const angBDeg = params.vectorBAngle ?? params.angleB ?? 60;

  const radA = (angADeg * Math.PI) / 180;
  const radB = (angBDeg * Math.PI) / 180;

  const Ax = magA * Math.cos(radA);
  const Ay = magA * Math.sin(radA);
  const Bx = magB * Math.cos(radB);
  const By = magB * Math.sin(radB);

  const Rx = Ax + Bx;
  const Ry = Ay + By;
  const magR = Math.sqrt(Rx * Rx + Ry * Ry);
  const angRDeg = ((Math.atan2(Ry, Rx) * 180) / Math.PI + 360) % 360;

  const originX = width * 0.38;
  const originY = height * 0.62;
  const scale = Math.min(width, height) / 220;

  // Grid / axes
  ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(20, originY);
  ctx.lineTo(width - 20, originY);
  ctx.moveTo(originX, 20);
  ctx.lineTo(originX, height - 20);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("+X", width - 30, originY - 6);
  ctx.fillText("+Y", originX + 8, 30);
  ctx.fillText("O", originX - 16, originY + 16);

  const ptA = { x: originX + Ax * scale, y: originY - Ay * scale };
  const ptB_from_O = { x: originX + Bx * scale, y: originY - By * scale };
  const ptR = { x: originX + Rx * scale, y: originY - Ry * scale };

  // Parallelogram ghost lines
  ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(ptB_from_O.x, ptB_from_O.y);
  ctx.lineTo(ptR.x, ptR.y);
  ctx.moveTo(ptA.x, ptA.y);
  ctx.lineTo(ptR.x, ptR.y);
  ctx.stroke();
  ctx.setLineDash([]);

  const drawVectorArrow = (fromX: number, fromY: number, toX: number, toY: number, color: string, widthLine: number, label: string) => {
    const headLen = 12;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = widthLine;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(label, midX - 8, midY - 10);
  };

  drawVectorArrow(originX, originY, ptA.x, ptA.y, "#38bdf8", 3, `A⃗ (${magA.toFixed(0)})`);
  drawVectorArrow(ptA.x, ptA.y, ptR.x, ptR.y, "#f43f5e", 3, `B⃗ (${magB.toFixed(0)})`);

  ctx.shadowColor = "#10b981";
  ctx.shadowBlur = 8;
  drawVectorArrow(originX, originY, ptR.x, ptR.y, "#10b981", 4, `R⃗ = A⃗ + B⃗ (${magR.toFixed(1)})`);
  ctx.shadowBlur = 0;

  // Angle arc for Resultant
  ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(originX, originY, 32, -((angRDeg * Math.PI) / 180), 0);
  ctx.stroke();

  // HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 320), 74, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Vector Addition: Head-to-Tail Law", 24, 34);

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`|R⃗| = ${magR.toFixed(1)} units  |  θ_R = ${angRDeg.toFixed(1)}°`, 24, 52);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText(`A = (${Ax.toFixed(1)}, ${Ay.toFixed(1)}) | B = (${Bx.toFixed(1)}, ${By.toFixed(1)}) | R = (${Rx.toFixed(1)}, ${Ry.toFixed(1)})`, 24, 68);

  ctx.restore();
}

// =========================================================================
// 26. Bernoulli Fluid Principle & Venturi Flow Renderer
// =========================================================================
function renderBernoulliFluidSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  ctx.save();
  const v1 = params.inletVelocity ?? 3;
  const constriction = (params.throatConstriction ?? 50) / 100;
  const rho = params.fluidDensity ?? 1000;
  const p1 = params.inletPressure ?? 160;

  const pipeY = height * 0.58;
  const pipeLen = width - 40;
  const startX = 20;
  const endX = width - 20;
  const throatX = width * 0.5;
  const h1 = Math.min(80, height * 0.22);
  const h2 = Math.max(24, h1 * constriction);

  const v2 = v1 * (h1 / h2);
  const deltaP = (0.5 * rho * (v2 * v2 - v1 * v1)) / 1000;
  const p2 = Math.max(5, p1 - deltaP);

  // Venturi tube
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.fillStyle = "rgba(14, 165, 233, 0.08)";

  ctx.beginPath();
  ctx.moveTo(startX, pipeY - h1 / 2);
  ctx.lineTo(throatX - 70, pipeY - h1 / 2);
  ctx.bezierCurveTo(throatX - 30, pipeY - h1 / 2, throatX - 30, pipeY - h2 / 2, throatX, pipeY - h2 / 2);
  ctx.bezierCurveTo(throatX + 30, pipeY - h2 / 2, throatX + 30, pipeY - h1 / 2, throatX + 70, pipeY - h1 / 2);
  ctx.lineTo(endX, pipeY - h1 / 2);

  ctx.lineTo(endX, pipeY + h1 / 2);
  ctx.lineTo(throatX + 70, pipeY + h1 / 2);
  ctx.bezierCurveTo(throatX + 30, pipeY + h1 / 2, throatX + 30, pipeY + h2 / 2, throatX, pipeY + h2 / 2);
  ctx.bezierCurveTo(throatX - 30, pipeY + h2 / 2, throatX - 30, pipeY + h1 / 2, throatX - 70, pipeY + h1 / 2);
  ctx.lineTo(startX, pipeY + h1 / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Streamlines
  for (let s = 0; s < 5; s++) {
    const norm = s / 4 - 0.5;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, pipeY + norm * h1 * 0.7);
    ctx.lineTo(throatX - 70, pipeY + norm * h1 * 0.7);
    ctx.bezierCurveTo(throatX - 30, pipeY + norm * h1 * 0.7, throatX - 30, pipeY + norm * h2 * 0.7, throatX, pipeY + norm * h2 * 0.7);
    ctx.bezierCurveTo(throatX + 30, pipeY + norm * h2 * 0.7, throatX + 30, pipeY + norm * h1 * 0.7, throatX + 70, pipeY + norm * h1 * 0.7);
    ctx.lineTo(endX, pipeY + norm * h1 * 0.7);
    ctx.stroke();
  }

  // Fluid particles
  for (let p = 0; p < 24; p++) {
    const rawPos = (simTime * (v1 * 40) + p * 45) % pipeLen;
    const px = startX + rawPos;
    let localH = h1;
    let localV = v1;

    if (px >= throatX - 70 && px <= throatX + 70) {
      const t = Math.abs(px - throatX) / 70;
      localH = h2 + (h1 - h2) * (t * t);
      localV = v1 + (v2 - v1) * (1 - t);
    }

    const norm = Math.sin(p * 3.7) * 0.35;
    const py = pipeY + norm * localH;

    ctx.fillStyle = localV > v1 * 1.3 ? "#f43f5e" : "#38bdf8";
    ctx.beginPath();
    ctx.arc(px, py, localV > v1 * 1.3 ? 3.5 : 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Vertical Manometer Tubes
  const drawManometer = (x: number, topPipeY: number, liquidHeight: number, label: string, pKpa: number) => {
    const tubeW = 18;
    const tubeTopY = pipeY - h1 / 2 - 75;
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
    ctx.strokeRect(x - tubeW / 2, tubeTopY, tubeW, topPipeY - tubeTopY);
    ctx.fillStyle = "rgba(56, 189, 248, 0.65)";
    ctx.fillRect(x - tubeW / 2 + 1, topPipeY - liquidHeight, tubeW - 2, liquidHeight);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - tubeW / 2 + 1, topPipeY - liquidHeight);
    ctx.lineTo(x + tubeW / 2 - 1, topPipeY - liquidHeight);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${pKpa.toFixed(0)} kPa`, x, tubeTopY - 6);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(label, x, tubeTopY + 16);
  };

  const hCol1 = 65;
  const hCol2 = Math.max(12, 65 - deltaP * 0.6);
  drawManometer(width * 0.25, pipeY - h1 / 2, hCol1, "P₁", p1);
  drawManometer(throatX, pipeY - h2 / 2, hCol2, "P₂", p2);
  drawManometer(width * 0.75, pipeY - h1 / 2, hCol1 * 0.95, "P₃", p1 * 0.98);

  // HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 320), 74, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Bernoulli's Principle: Venturi Effect", 24, 34);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`Throat: v₂ = ${v2.toFixed(2)} m/s (High)  |  P₂ = ${p2.toFixed(1)} kPa (Low)`, 24, 52);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText(`Inlet: v₁ = ${v1.toFixed(1)} m/s | Area Ratio = ${(constriction * 100).toFixed(0)}% | ΔP = ${deltaP.toFixed(1)} kPa`, 24, 68);

  ctx.restore();
}

// =========================================================================
// 27. DNA Replication Fork Renderer
// =========================================================================
function renderDNAReplicationSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  ctx.save();
  const helicaseSpeed = params.helicaseSpeed ?? 50;
  const polySpeed = params.polymeraseRate ?? 60;

  const centerY = height * 0.52;
  const forkX = width * 0.46;

  // Unzipped double helix on left side
  const basePairs = [
    { name: "A", color: "#22c55e", comp: "T", compColor: "#ef4444" },
    { name: "T", color: "#ef4444", comp: "A", compColor: "#22c55e" },
    { name: "G", color: "#3b82f6", comp: "C", compColor: "#eab308" },
    { name: "C", color: "#eab308", comp: "G", compColor: "#3b82f6" }
  ];

  // Draw parental duplex before fork
  const leftStart = 30;
  for (let x = leftStart; x < forkX - 25; x += 18) {
    const idx = Math.floor((x + simTime * 20) / 18) % basePairs.length;
    const bp = basePairs[Math.abs(idx)];
    const waveY = Math.sin((x + simTime * 30) * 0.05) * 18;

    // Hydrogen bond rung
    ctx.strokeStyle = "rgba(203, 213, 225, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, centerY - 20 + waveY);
    ctx.lineTo(x, centerY + 20 + waveY);
    ctx.stroke();

    // Top base
    ctx.fillStyle = bp.color;
    ctx.beginPath();
    ctx.arc(x, centerY - 20 + waveY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Bottom base
    ctx.fillStyle = bp.compColor;
    ctx.beginPath();
    ctx.arc(x, centerY + 20 + waveY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fork opening strands (Y-junction)
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  // Leading arm (top)
  ctx.beginPath();
  ctx.moveTo(forkX - 25, centerY - 20);
  ctx.bezierCurveTo(forkX, centerY - 25, forkX + 60, centerY - 55, width - 40, centerY - 55);
  ctx.stroke();

  // Lagging arm (bottom)
  ctx.beginPath();
  ctx.moveTo(forkX - 25, centerY + 20);
  ctx.bezierCurveTo(forkX, centerY + 25, forkX + 60, centerY + 55, width - 40, centerY + 55);
  ctx.stroke();

  // Helicase Enzyme (Triangular Wedge at fork point)
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.moveTo(forkX - 20, centerY);
  ctx.lineTo(forkX + 15, centerY - 24);
  ctx.lineTo(forkX + 15, centerY + 24);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 9px sans-serif";
  ctx.fillText("Helicase", forkX - 8, centerY + 3);

  // Top Arm: Continuous Leading Strand (DNA Polymerase III)
  const polyLeadX = forkX + 80 + Math.sin(simTime * 2) * 15;
  ctx.fillStyle = "#10b981";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(forkX + 15, centerY - 45);
  ctx.lineTo(polyLeadX, centerY - 45);
  ctx.stroke();

  ctx.fillStyle = "#ec4899";
  ctx.beginPath();
  ctx.roundRect(polyLeadX, centerY - 62, 28, 16, 4);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 8px sans-serif";
  ctx.fillText("Pol III", polyLeadX + 4, centerY - 51);

  // Bottom Arm: Discontinuous Okazaki Fragments on Lagging Strand
  const okaStart = forkX + 40;
  for (let frag = 0; frag < 2; frag++) {
    const fx = okaStart + frag * 75;
    // RNA primer
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx, centerY + 45);
    ctx.lineTo(fx + 18, centerY + 45);
    ctx.stroke();
    // DNA fragment
    ctx.strokeStyle = "#10b981";
    ctx.beginPath();
    ctx.moveTo(fx + 18, centerY + 45);
    ctx.lineTo(fx + 65, centerY + 45);
    ctx.stroke();
  }

  // Floating dNTP nucleotides
  for (let n = 0; n < 8; n++) {
    const nx = forkX + 30 + Math.sin(simTime * 3 + n) * 80;
    const ny = centerY - 15 + Math.cos(simTime * 2 + n) * 35;
    ctx.fillStyle = basePairs[n % 4].color;
    ctx.beginPath();
    ctx.arc(nx, ny, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 320), 74, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("DNA Replication: Semi-Conservative Fork", 24, 34);

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`Top: Leading (Continuous 5'→3')`, 24, 52);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText(`Bottom: Lagging (Okazaki Fragments) | Helicase: ${helicaseSpeed} bp/s`, 24, 68);

  ctx.restore();
}

// =========================================================================
// 28. Optics Refraction & Snell's Law Renderer
// =========================================================================
function renderOpticsRefractionSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  ctx.save();
  const incAngleDeg = params.incidentAngle ?? 45;
  const n1 = params.indexN1 ?? 1.5;
  const n2 = params.indexN2 ?? 1.0;

  const boundaryY = height * 0.52;
  const centerX = width * 0.5;

  // Medium 1 (Upper) & Medium 2 (Lower) backgrounds
  ctx.fillStyle = n1 > 1.2 ? "rgba(14, 165, 233, 0.12)" : "rgba(15, 23, 42, 0.2)";
  ctx.fillRect(0, 0, width, boundaryY);

  ctx.fillStyle = n2 > 1.2 ? "rgba(14, 165, 233, 0.18)" : "rgba(15, 23, 42, 0.05)";
  ctx.fillRect(0, boundaryY, width, height - boundaryY);

  // Interface boundary line
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, boundaryY);
  ctx.lineTo(width, boundaryY);
  ctx.stroke();

  // Normal dashed line
  ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(centerX, 20);
  ctx.lineTo(centerX, height - 20);
  ctx.stroke();
  ctx.setLineDash([]);

  // Labels for media
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText(`Medium 1 (n₁ = ${n1.toFixed(2)})`, 20, boundaryY - 14);
  ctx.fillText(`Medium 2 (n₂ = ${n2.toFixed(2)})`, 20, boundaryY + 24);

  // Snell calculations
  const incRad = (incAngleDeg * Math.PI) / 180;
  const sinR = (n1 / n2) * Math.sin(incRad);
  const isTIR = sinR > 1.0;
  const critAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  // Incident ray from top-left hitting center
  const rayLen = Math.min(width, height) * 0.4;
  const inX = centerX - Math.sin(incRad) * rayLen;
  const inY = boundaryY - Math.cos(incRad) * rayLen;

  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(inX, inY);
  ctx.lineTo(centerX, boundaryY);
  ctx.stroke();

  // Reflected ray (always present, 100% if TIR)
  const refX = centerX + Math.sin(incRad) * rayLen;
  const refY = boundaryY - Math.cos(incRad) * rayLen;
  ctx.strokeStyle = isTIR ? "#eab308" : "rgba(234, 179, 8, 0.35)";
  ctx.lineWidth = isTIR ? 3 : 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX, boundaryY);
  ctx.lineTo(refX, refY);
  ctx.stroke();

  // Refracted ray (only if not TIR)
  if (!isTIR) {
    const refrRad = Math.asin(sinR);
    const refrDeg = (refrRad * 180) / Math.PI;
    const refrX = centerX + Math.sin(refrRad) * rayLen;
    const refrY = boundaryY + Math.cos(refrRad) * rayLen;

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, boundaryY);
    ctx.lineTo(refrX, refrY);
    ctx.stroke();

    // Refraction angle arc
    ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, boundaryY, 32, Math.PI / 2 - refrRad, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = "#38bdf8";
    ctx.font = "10px monospace";
    ctx.fillText(`θ₂ = ${refrDeg.toFixed(1)}°`, centerX + 36, boundaryY + 28);
  }

  // Incident angle arc
  ctx.strokeStyle = "rgba(234, 179, 8, 0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(centerX, boundaryY, 30, -Math.PI / 2, -Math.PI / 2 + incRad);
  ctx.stroke();
  ctx.fillStyle = "#eab308";
  ctx.font = "10px monospace";
  ctx.fillText(`θ₁ = ${incAngleDeg}°`, centerX - 45, boundaryY - 24);

  // HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = isTIR ? "#f43f5e" : "#38bdf8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 320), 74, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(isTIR ? "Total Internal Reflection (TIR)" : "Snell's Law of Refraction", 24, 34);

  ctx.fillStyle = isTIR ? "#f43f5e" : "#38bdf8";
  ctx.font = "bold 11px monospace";
  if (isTIR) {
    ctx.fillText(`θ₁ (${incAngleDeg}°) > θ_c (${critAngleDeg?.toFixed(1)}°) → 100% Reflection`, 24, 52);
  } else {
    const refrDeg = (Math.asin(sinR) * 180) / Math.PI;
    ctx.fillText(`n₁ sin θ₁ = n₂ sin θ₂ → θ₂ = ${refrDeg.toFixed(1)}°`, 24, 52);
  }

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText(`n₁ = ${n1.toFixed(2)} | n₂ = ${n2.toFixed(2)} | Critical θ_c = ${critAngleDeg ? `${critAngleDeg.toFixed(1)}°` : "None"}`, 24, 68);

  ctx.restore();
}

// =========================================================================
// 29. Kepler Planetary Laws & Orbit Renderer
// =========================================================================
function renderKeplerOrbitSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  ctx.save();
  const a = params.semiMajorAxis ?? 2.5;
  const e = Math.min(0.85, Math.max(0, params.eccentricity ?? 0.45));
  const starMass = params.starMass ?? 1.0;

  const centerX = width * 0.52;
  const centerY = height * 0.52;
  const aPx = Math.min(width, height) * 0.36;
  const bPx = aPx * Math.sqrt(Math.max(0.01, 1 - e * e));
  const fDist = aPx * e;
  const sunX = centerX - fDist;
  const sunY = centerY;

  // Draw star (Sun at focus 1)
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 3, sunX, sunY, 20);
  sunGrad.addColorStop(0, "#fbbf24");
  sunGrad.addColorStop(0.5, "#f59e0b");
  sunGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Draw Elliptical Orbit
  ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, aPx, bPx, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Kepler sweep angle (mean to true anomaly approximation)
  const T = Math.sqrt(Math.pow(a, 3) / starMass);
  const meanAnomaly = (simTime * (2 * Math.PI / Math.max(1, T))) % (Math.PI * 2);
  // Eccentric anomaly approximation
  const theta = meanAnomaly + 2 * e * Math.sin(meanAnomaly);

  // Planet coordinates
  const r = (aPx * (1 - e * e)) / (1 + e * Math.cos(theta));
  const planetX = sunX + r * Math.cos(theta);
  const planetY = sunY + r * Math.sin(theta);

  // Equal area sector slice
  ctx.fillStyle = "rgba(251, 191, 36, 0.15)";
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.arc(sunX, sunY, r, theta - 0.25, theta);
  ctx.closePath();
  ctx.fill();

  // Radius vector
  ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(planetX, planetY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Planet sphere
  ctx.fillStyle = "#38bdf8";
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(planetX, planetY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Instantaneous velocity vector (tangential)
  const vMag = 25 * Math.sqrt(2 / Math.max(0.1, r / aPx) - 1);
  const vAngle = theta + Math.PI / 2 + e * Math.sin(theta) * 0.5;
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(planetX, planetY);
  ctx.lineTo(planetX + Math.cos(vAngle) * vMag, planetY + Math.sin(vAngle) * vMag);
  ctx.stroke();

  // HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 320), 74, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Kepler's Planetary Laws: Orbits & Areas", 24, 34);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`Period T = ${T.toFixed(2)} yrs (T² ∝ a³) | e = ${e.toFixed(2)}`, 24, 52);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText(`Equal Areas in Equal Times (dA/dt = Const) | Sun at Focus`, 24, 68);

  ctx.restore();
}

// =========================================================================
// 30. Simple Pendulum & SHM Renderer
// =========================================================================
function renderPendulumSHMSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, number>,
  simTime: number
) {
  ctx.save();
  const L = params.pendulumLength ?? 1.5;
  const theta0Deg = params.initialAngle ?? 20;
  const g = params.gravityAcc ?? 9.8;
  const m = params.bobMass ?? 0.5;

  const pivotX = width * 0.5;
  const pivotY = 55;
  const L_px = Math.min(height * 0.58, 200);

  const omega = Math.sqrt(g / L);
  const theta0Rad = (theta0Deg * Math.PI) / 180;
  const theta = theta0Rad * Math.cos(omega * simTime);

  const bobX = pivotX + L_px * Math.sin(theta);
  const bobY = pivotY + L_px * Math.cos(theta);

  // Rigid pivot mount
  ctx.fillStyle = "#64748b";
  ctx.fillRect(pivotX - 30, pivotY - 8, 60, 8);
  ctx.fillStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Pendulum string
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  // Bob sphere
  const bobRadius = 12 + m * 4;
  const bobGrad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobRadius);
  bobGrad.addColorStop(0, "#38bdf8");
  bobGrad.addColorStop(1, "#0284c7");
  ctx.fillStyle = bobGrad;
  ctx.beginPath();
  ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
  ctx.fill();

  // Velocity vector (tangential)
  const vInstant = -theta0Rad * omega * Math.sin(omega * simTime);
  const vScale = 30;
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(bobX, bobY);
  ctx.lineTo(bobX + Math.cos(theta) * vInstant * vScale, bobY - Math.sin(theta) * vInstant * vScale);
  ctx.stroke();

  // Energy Bar Display
  const T_sec = (2 * Math.PI) / omega;
  const vMax = Math.sqrt(2 * g * L * (1 - Math.cos(theta0Rad)));
  const totalE = m * g * L * (1 - Math.cos(theta0Rad));
  const currentKE = 0.5 * m * (vInstant * L) * (vInstant * L);
  const currentPE = Math.max(0, totalE - currentKE);

  // Energy gauges at bottom-right
  const gaugeW = 70;
  const gaugeX = width - 90;
  ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
  ctx.fillRect(gaugeX - 8, height - 70, gaugeW + 16, 56);

  ctx.fillStyle = "#10b981";
  ctx.font = "9px monospace";
  ctx.fillText("KE (Kinetic)", gaugeX, height - 52);
  ctx.fillRect(gaugeX, height - 48, Math.min(gaugeW, (currentKE / Math.max(0.01, totalE)) * gaugeW), 6);

  ctx.fillStyle = "#38bdf8";
  ctx.fillText("PE (Potential)", gaugeX, height - 30);
  ctx.fillRect(gaugeX, height - 26, Math.min(gaugeW, (currentPE / Math.max(0.01, totalE)) * gaugeW), 6);

  // HUD Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(14, 14, Math.min(width - 28, 320), 74, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Simple Pendulum: Harmonic Motion", 24, 34);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px monospace";
  ctx.fillText(`Period T = ${T_sec.toFixed(2)} s (T = 2π√(L/g)) | v_max = ${vMax.toFixed(2)} m/s`, 24, 52);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText(`Length L = ${L} m | g = ${g} m/s² | Mass = ${m} kg (Independent of T)`, 24, 68);

  ctx.restore();
}



