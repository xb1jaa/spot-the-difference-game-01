// Lantern Lane — spot the difference: scene art.
// Every scene is drawn procedurally on canvas (no image files, no network).
// Each level has a base drawing, identical on both panels, plus a list of
// differences. A difference's paint() draws the differing element for one
// side only, or with a different colour per side. Panel space is 560 x 520.

function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function circle(g, x, y, r) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
}

function star4(g, x, y, r, color) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x, y - r);
  g.quadraticCurveTo(x, y, x + r, y);
  g.quadraticCurveTo(x, y, x, y + r);
  g.quadraticCurveTo(x, y, x - r, y);
  g.quadraticCurveTo(x, y, x, y - r);
  g.fill();
}

function cloud(g, x, y, s, color) {
  g.fillStyle = color;
  circle(g, x, y, 16 * s); g.fill();
  circle(g, x + 18 * s, y + 4 * s, 13 * s); g.fill();
  circle(g, x - 18 * s, y + 5 * s, 12 * s); g.fill();
}

// ---------------------------------------------------------------- level 1
function drawLaneBase(g) {
  // dusk sky
  const sky = g.createLinearGradient(0, 0, 0, 330);
  sky.addColorStop(0, '#2b2350');
  sky.addColorStop(0.55, '#7a4a72');
  sky.addColorStop(1, '#e08a4e');
  g.fillStyle = sky;
  g.fillRect(0, 0, 560, 330);
  // distant rooftops
  g.fillStyle = '#3a2f5e';
  g.fillRect(0, 250, 560, 80);
  g.fillStyle = '#463a6e';
  g.beginPath();
  g.moveTo(30, 250); g.lineTo(90, 205); g.lineTo(150, 250); g.closePath(); g.fill();
  g.beginPath();
  g.moveTo(380, 250); g.lineTo(450, 200); g.lineTo(520, 250); g.closePath(); g.fill();
  // cobbled street
  g.fillStyle = '#6b5a72';
  g.fillRect(0, 330, 560, 190);
  g.fillStyle = '#7d6a84';
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * 72 + (row % 2 ? 36 : 0);
      rr(g, x + 4, 344 + row * 42, 60, 30, 8);
      g.fill();
    }
  }
  g.fillStyle = '#8d7a94';
  g.fillRect(0, 330, 560, 10);
  // bakery (left building)
  g.fillStyle = '#c98a5a';
  g.fillRect(60, 180, 200, 150);
  g.fillStyle = '#a86a42';
  g.fillRect(60, 180, 200, 12);
  // awning
  for (let i = 0; i < 5; i++) {
    g.fillStyle = i % 2 ? '#f2e3c9' : '#c94f4f';
    g.fillRect(56 + i * 42, 236, 42, 26);
    g.beginPath();
    g.arc(56 + i * 42 + 21, 262, 21, 0, Math.PI);
    g.fill();
  }
  // door
  g.fillStyle = '#5d3a24';
  rr(g, 140, 268, 44, 62, 6); g.fill();
  circle(g, 176, 300, 3); g.fillStyle = '#ffd76a'; g.fill();
  // house (right building)
  g.fillStyle = '#7a6a9e';
  g.fillRect(340, 150, 170, 180);
  g.fillStyle = '#5d4f80';
  g.beginPath();
  g.moveTo(330, 150); g.lineTo(425, 95); g.lineTo(520, 150); g.closePath(); g.fill();
  // chimney
  g.fillStyle = '#8a5a4a';
  g.fillRect(462, 78, 26, 46);
  // house window
  g.fillStyle = '#2c2350';
  g.fillRect(380, 200, 44, 54);
  g.strokeStyle = '#c9b8a3'; g.lineWidth = 3;
  g.strokeRect(380, 200, 44, 54);
  g.beginPath(); g.moveTo(402, 200); g.lineTo(402, 254); g.moveTo(380, 227); g.lineTo(424, 227); g.stroke();
  // wall the cat sits on
  g.fillStyle = '#5d4f6e';
  g.fillRect(300, 320, 130, 12);
  // lantern post
  g.fillStyle = '#3a2f4e';
  g.fillRect(276, 120, 8, 210);
  g.beginPath(); g.moveTo(276, 120); g.quadraticCurveTo(300, 100, 322, 118); g.stroke();
  g.lineWidth = 4; g.stroke();
  // flower pots by the bakery door
  g.fillStyle = '#a85a3a';
  g.beginPath(); g.moveTo(196, 470); g.lineTo(224, 470); g.lineTo(220, 494); g.lineTo(200, 494); g.closePath(); g.fill();
  g.fillStyle = '#a85a3a';
  g.beginPath(); g.moveTo(96, 470); g.lineTo(124, 470); g.lineTo(120, 494); g.lineTo(100, 494); g.closePath(); g.fill();
  // green leaves in pots
  g.fillStyle = '#4a7a3a';
  circle(g, 210, 462, 12); g.fill();
  circle(g, 110, 462, 12); g.fill();
}

const laneDiffs = [
  { x: 296, y: 138, r: 30, paint(g, side) {
    // lantern glow colour differs
    g.fillStyle = side === 'left' ? '#ffd76a' : '#6ad2ff';
    rr(g, 282, 122, 28, 34, 6); g.fill();
    g.fillStyle = side === 'left' ? '#fff3c9' : '#d8f3ff';
    circle(g, 296, 139, 8); g.fill();
    g.fillStyle = '#3a2f4e';
    g.fillRect(288, 116, 16, 6);
  } },
  { x: 420, y: 306, r: 26, paint(g, side) {
    // cat on the wall, left only
    if (side !== 'left') return;
    g.fillStyle = '#2c2350';
    g.beginPath();
    g.ellipse(420, 312, 16, 10, 0, 0, Math.PI * 2);
    g.fill();
    circle(g, 434, 300, 8); g.fill();
    g.beginPath(); g.moveTo(428, 294); g.lineTo(431, 286); g.lineTo(434, 294); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(436, 294); g.lineTo(439, 286); g.lineTo(442, 294); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(404, 310); g.quadraticCurveTo(392, 306, 394, 294); g.stroke();
    g.lineWidth = 4; g.stroke();
  } },
  { x: 108, y: 300, r: 30, paint(g, side) {
    // bakery window: lit with curtains on the left, dark on the right
    if (side === 'left') {
      g.fillStyle = '#ffd76a';
      g.fillRect(84, 272, 48, 56);
      g.fillStyle = '#c94f4f';
      g.fillRect(84, 272, 12, 56);
      g.fillRect(120, 272, 12, 56);
    } else {
      g.fillStyle = '#241d40';
      g.fillRect(84, 272, 48, 56);
    }
    g.strokeStyle = '#c9b8a3'; g.lineWidth = 3;
    g.strokeRect(84, 272, 48, 56);
  } },
  { x: 160, y: 212, r: 30, paint(g, side) {
    // shop sign: BAKERY vs BAKFRY
    g.fillStyle = '#f2e3c9';
    rr(g, 84, 192, 152, 34, 6); g.fill();
    g.fillStyle = '#5d3a24';
    g.font = 'bold 24px Georgia, serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(side === 'left' ? 'BAKERY' : 'BAKFRY', 160, 210);
  } },
  { x: 475, y: 62, r: 28, paint(g, side) {
    // chimney smoke, left only
    if (side !== 'left') return;
    g.fillStyle = 'rgba(230, 220, 235, 0.85)';
    circle(g, 470, 66, 10); g.fill();
    circle(g, 480, 48, 13); g.fill();
    circle(g, 466, 30, 15); g.fill();
  } },
  { x: 90, y: 60, r: 24, paint(g, side) {
    // bright star, left only
    if (side !== 'left') return;
    star4(g, 90, 60, 16, '#fff3c9');
    star4(g, 90, 60, 7, '#ffffff');
  } },
  { x: 210, y: 452, r: 26, paint(g, side) {
    // flowers in the pot: red on the left, blue on the right
    g.fillStyle = side === 'left' ? '#d94f6a' : '#4f7ad9';
    circle(g, 200, 452, 8); g.fill();
    circle(g, 212, 446, 8); g.fill();
    circle(g, 220, 456, 8); g.fill();
    circle(g, 204, 460, 7); g.fill();
  } },
];

// ---------------------------------------------------------------- level 2
function drawHarborBase(g) {
  // dawn sky
  const sky = g.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#ffd9a0');
  sky.addColorStop(0.5, '#ffb27a');
  sky.addColorStop(1, '#ff9a7a');
  g.fillStyle = sky;
  g.fillRect(0, 0, 560, 300);
  // sea
  const sea = g.createLinearGradient(0, 300, 0, 520);
  sea.addColorStop(0, '#3a7a9e');
  sea.addColorStop(1, '#205a7a');
  g.fillStyle = sea;
  g.fillRect(0, 300, 560, 220);
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    g.beginPath();
    g.moveTo(30 + i * 20, 340 + i * 34);
    g.quadraticCurveTo(90 + i * 40, 332 + i * 34, 150 + i * 30, 340 + i * 34);
    g.stroke();
  }
  // clouds
  cloud(g, 150, 70, 1.1, 'rgba(255,240,220,0.9)');
  cloud(g, 330, 120, 0.8, 'rgba(255,240,220,0.8)');
  // lighthouse
  g.fillStyle = '#f2e3c9';
  g.beginPath();
  g.moveTo(64, 300); g.lineTo(76, 150); g.lineTo(104, 150); g.lineTo(116, 300); g.closePath(); g.fill();
  g.fillStyle = '#c94f4f';
  g.fillRect(70, 210, 40, 26);
  g.fillRect(73, 262, 34, 22);
  g.fillStyle = '#3a2f4e';
  g.fillRect(72, 138, 36, 16);
  g.fillStyle = '#ffd76a';
  circle(g, 90, 146, 8); g.fill();
  // rocks at lighthouse base
  g.fillStyle = '#6b5a52';
  g.beginPath(); g.ellipse(90, 302, 70, 16, 0, 0, Math.PI * 2); g.fill();
  // pier
  g.fillStyle = '#8a6a4a';
  g.fillRect(400, 280, 160, 14);
  for (let i = 0; i < 4; i++) g.fillRect(416 + i * 38, 294, 10, 30);
  // sailboat
  g.fillStyle = '#5d3a24';
  g.beginPath(); g.moveTo(340, 380); g.lineTo(440, 380); g.lineTo(420, 404); g.lineTo(360, 404); g.closePath(); g.fill();
  g.fillStyle = '#3a2f4e';
  g.fillRect(388, 280, 6, 100);
  // small rowboat
  g.fillStyle = '#a86a42';
  g.beginPath(); g.ellipse(210, 400, 34, 12, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#5d3a24';
  g.fillRect(206, 388, 8, 12);
}

const harborDiffs = [
  { x: 140, y: 146, r: 30, paint(g, side) {
    // lighthouse beam, left only
    if (side !== 'left') return;
    g.fillStyle = 'rgba(255, 215, 106, 0.45)';
    g.beginPath();
    g.moveTo(108, 146); g.lineTo(210, 110); g.lineTo(210, 182); g.closePath(); g.fill();
  } },
  { x: 300, y: 90, r: 24, paint(g, side) {
    // third seagull, left only
    if (side !== 'left') return;
    g.strokeStyle = '#3a2f4e'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(288, 92); g.quadraticCurveTo(296, 84, 302, 92); g.quadraticCurveTo(308, 84, 314, 92); g.stroke();
  } },
  { x: 366, y: 330, r: 30, paint(g, side) {
    // sail colour differs
    g.fillStyle = side === 'left' ? '#c94f4f' : '#e8b93a';
    g.beginPath(); g.moveTo(388, 288); g.lineTo(388, 372); g.lineTo(344, 372); g.closePath(); g.fill();
  } },
  { x: 500, y: 430, r: 26, paint(g, side) {
    // buoy, left only
    if (side !== 'left') return;
    g.fillStyle = '#e86a2a';
    g.beginPath(); g.moveTo(500, 408); g.lineTo(516, 436); g.lineTo(484, 436); g.closePath(); g.fill();
    g.fillStyle = '#fff';
    g.fillRect(492, 420, 16, 6);
  } },
  { x: 470, y: 80, r: 28, paint(g, side) {
    // sun: rays on the left, plain on the right
    g.fillStyle = '#ffdf6a';
    circle(g, 470, 80, 26); g.fill();
    if (side === 'left') {
      g.strokeStyle = '#ffdf6a'; g.lineWidth = 4;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        g.beginPath();
        g.moveTo(470 + Math.cos(a) * 32, 80 + Math.sin(a) * 32);
        g.lineTo(470 + Math.cos(a) * 42, 80 + Math.sin(a) * 42);
        g.stroke();
      }
    }
  } },
  { x: 394, y: 262, r: 24, paint(g, side) {
    // flag on the mast, left only
    if (side !== 'left') return;
    g.fillStyle = '#c94f4f';
    g.beginPath(); g.moveTo(394, 250); g.lineTo(424, 258); g.lineTo(394, 268); g.closePath(); g.fill();
  } },
  { x: 150, y: 430, r: 26, paint(g, side) {
    // jumping fish, left only
    if (side !== 'left') return;
    g.fillStyle = '#9ecfe8';
    g.beginPath();
    g.ellipse(150, 428, 16, 8, -0.5, 0, Math.PI * 2);
    g.fill();
    g.beginPath(); g.moveTo(164, 420); g.lineTo(176, 412); g.lineTo(172, 430); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.7)';
    circle(g, 138, 448, 4); g.fill();
    circle(g, 148, 456, 3); g.fill();
  } },
];

// ---------------------------------------------------------------- level 3
function drawGardenBase(g) {
  // night sky
  const sky = g.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#141a3a');
  sky.addColorStop(1, '#3a2f5e');
  g.fillStyle = sky;
  g.fillRect(0, 0, 560, 320);
  // stars (fixed, identical both sides)
  g.fillStyle = '#ffffff';
  for (const [x, y, r] of [[60, 50, 2], [140, 36, 2], [250, 60, 2], [330, 40, 2], [520, 130, 2], [40, 150, 2], [180, 110, 2], [380, 120, 2]]) {
    circle(g, x, y, r); g.fill();
  }
  // garden wall + lawn
  g.fillStyle = '#4a3a5e';
  g.fillRect(0, 300, 560, 26);
  g.fillStyle = '#3a6a3a';
  g.fillRect(0, 326, 560, 194);
  g.fillStyle = '#2f5a2f';
  for (let i = 0; i < 9; i++) {
    g.beginPath(); g.moveTo(20 + i * 62, 520); g.lineTo(40 + i * 62, 470); g.lineTo(60 + i * 62, 520); g.closePath(); g.fill();
  }
  // big tree (left)
  g.fillStyle = '#5d3a24';
  g.fillRect(96, 200, 22, 126);
  g.beginPath(); g.moveTo(107, 230); g.quadraticCurveTo(150, 210, 170, 180); g.stroke();
  g.lineWidth = 10; g.stroke();
  g.fillStyle = '#2f5a2f';
  circle(g, 110, 180, 52); g.fill();
  circle(g, 70, 200, 36); g.fill();
  circle(g, 150, 200, 38); g.fill();
  // gate (right)
  g.fillStyle = '#3a2f4e';
  g.fillRect(470, 220, 14, 106);
  g.fillRect(520, 220, 14, 106);
  g.beginPath(); g.moveTo(464, 220); g.quadraticCurveTo(502, 196, 540, 220); g.stroke();
  g.lineWidth = 8; g.stroke();
  // fountain (centre)
  g.fillStyle = '#8a8a9e';
  g.beginPath(); g.ellipse(280, 420, 90, 26, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#6a6a80';
  g.beginPath(); g.ellipse(280, 414, 74, 18, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#8a8a9e';
  g.fillRect(272, 360, 16, 52);
  g.beginPath(); g.ellipse(280, 360, 22, 8, 0, 0, Math.PI * 2); g.fill();
  // path stones
  g.fillStyle = '#c9b8a3';
  for (const [x, y] of [[260, 470], [300, 490], [250, 500]]) {
    g.beginPath(); g.ellipse(x, y, 20, 9, 0, 0, Math.PI * 2); g.fill();
  }
  // mushrooms (right)
  g.fillStyle = '#e8e0d0';
  g.fillRect(428, 448, 8, 22);
  g.fillRect(448, 452, 7, 18);
}

const gardenDiffs = [
  { x: 450, y: 80, r: 30, paint(g, side) {
    // moon: full on the left, crescent on the right
    g.fillStyle = '#f2ead0';
    circle(g, 450, 80, 28); g.fill();
    if (side === 'right') {
      g.fillStyle = '#1c2450';
      circle(g, 462, 72, 26); g.fill();
    }
  } },
  { x: 200, y: 150, r: 22, paint(g, side) {
    // one firefly fewer on the right
    if (side !== 'left') return;
    g.fillStyle = '#d8ff6a';
    circle(g, 200, 150, 5); g.fill();
    g.fillStyle = 'rgba(216,255,106,0.3)';
    circle(g, 200, 150, 12); g.fill();
  } },
  { x: 280, y: 392, r: 30, paint(g, side) {
    // fountain water: flowing arcs on the left, still on the right
    if (side === 'left') {
      g.strokeStyle = '#9ecfe8'; g.lineWidth = 4;
      g.beginPath(); g.moveTo(280, 356); g.quadraticCurveTo(250, 380, 236, 402); g.stroke();
      g.beginPath(); g.moveTo(280, 356); g.quadraticCurveTo(310, 380, 324, 402); g.stroke();
      g.beginPath(); g.moveTo(280, 356); g.lineTo(280, 400); g.stroke();
    } else {
      g.fillStyle = '#4a6a8a';
      g.beginPath(); g.ellipse(280, 414, 74, 18, 0, 0, Math.PI * 2); g.fill();
    }
  } },
  { x: 150, y: 176, r: 26, paint(g, side) {
    // owl on the branch, left only
    if (side !== 'left') return;
    g.fillStyle = '#7a5a3a';
    g.beginPath(); g.ellipse(150, 176, 14, 18, 0, 0, Math.PI * 2); g.fill();
    circle(g, 138, 164, 6); g.fill();
    circle(g, 162, 164, 6); g.fill();
    g.fillStyle = '#fff';
    circle(g, 146, 170, 4); g.fill();
    circle(g, 156, 170, 4); g.fill();
    g.fillStyle = '#141a3a';
    circle(g, 146, 170, 2); g.fill();
    circle(g, 156, 170, 2); g.fill();
  } },
  { x: 432, y: 440, r: 26, paint(g, side) {
    // mushroom cap colour differs
    g.fillStyle = side === 'left' ? '#c94f4f' : '#8a5ac9';
    g.beginPath(); g.arc(432, 448, 16, Math.PI, 0); g.closePath(); g.fill();
    g.fillStyle = '#fff';
    circle(g, 426, 438, 3); g.fill();
    circle(g, 438, 442, 3); g.fill();
  } },
  { x: 502, y: 206, r: 24, paint(g, side) {
    // gate lantern: lit on the left, dark on the right
    g.fillStyle = side === 'left' ? '#ffd76a' : '#3a3450';
    rr(g, 492, 196, 20, 24, 4); g.fill();
    if (side === 'left') {
      g.fillStyle = '#fff3c9';
      circle(g, 502, 208, 5); g.fill();
    }
  } },
  { x: 330, y: 250, r: 24, paint(g, side) {
    // butterfly, left only
    if (side !== 'left') return;
    g.fillStyle = '#e8a2d9';
    g.beginPath(); g.ellipse(322, 244, 9, 12, -0.5, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(338, 244, 9, 12, 0.5, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(324, 258, 7, 9, -0.4, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(336, 258, 7, 9, 0.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#3a2f4e';
    g.fillRect(328, 240, 4, 22);
  } },
];

// Fireflies that are identical on both sides (garden level ambience).
function gardenFireflies(g) {
  const spots = [[120, 260, 4], [250, 210, 4], [360, 300, 4], [480, 340, 4], [90, 380, 4]];
  for (const [x, y, r] of spots) {
    g.fillStyle = '#d8ff6a';
    circle(g, x, y, r); g.fill();
    g.fillStyle = 'rgba(216,255,106,0.25)';
    circle(g, x, y, r + 7); g.fill();
  }
}

// Seagulls identical on both sides (harbor level ambience).
function harborGulls(g) {
  g.strokeStyle = '#3a2f4e'; g.lineWidth = 3;
  for (const [x, y] of [[220, 70], [360, 140]]) {
    g.beginPath(); g.moveTo(x - 12, y); g.quadraticCurveTo(x - 5, y - 8, x, y); g.quadraticCurveTo(x + 5, y - 8, x + 12, y); g.stroke();
  }
}

export const LEVELS = [
  { name: 'Lantern Lane', sub: 'A quiet street at dusk', time: 90, base: drawLaneBase, diffs: laneDiffs },
  { name: 'Harbor Dawn', sub: 'Boats, gulls and a lighthouse', time: 90, base: drawHarborBase, diffs: harborDiffs, ambience: harborGulls },
  { name: 'Starlit Garden', sub: 'A garden under a full moon', time: 90, base: drawGardenBase, diffs: gardenDiffs, ambience: gardenFireflies },
];

// Draw one panel: base art, ambience, then each difference painted for that side.
export function drawPanel(g, level, side) {
  level.base(g);
  if (level.ambience) level.ambience(g);
  for (const d of level.diffs) d.paint(g, side);
}
