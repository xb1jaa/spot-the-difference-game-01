// Lantern Lane — Spot the Difference.
// Two near-identical panels side by side; find every difference before the
// timer runs out. Three original hand-drawn scenes, seven differences each.
// Mouse (or touch) to click, H for a hint, P to pause, M to mute, R to restart.
//
// Screenshot staging (used by shots.json): ?shot=start shows the title
// screen, ?shot=play stages a mid-game board with three differences already
// found, ?shot=end shows the final score screen. All staged states are
// deterministic so repeated captures match.

import { LEVELS, drawPanel } from './scenes.js';
import * as sfx from './audio.js';

const W = 1280;
const H = 720;
const PANEL_W = 560;
const PANEL_H = 520;
const PANEL_Y = 128;
const LEFT_X = 40;
const RIGHT_X = 680;

const canvas = document.getElementById('game');
const g = canvas.getContext('2d');
const statusEl = document.getElementById('status');

const params = new URLSearchParams(location.search);
const shot = params.get('shot') || '';

function scaleCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const state = {
  screen: 'title', // title | playing | levelDone | gameOver | timeUp
  levelIndex: 0,
  found: new Set(),
  score: 0,
  levelStartScore: 0,
  streak: 0,
  wrong: 0,
  timeLeft: 90,
  hintsLeft: 2,
  hint: null, // {x, y, until}
  hintCooldownUntil: 0,
  wrongMarks: [], // {x, y, until}
  foundAnim: [], // {x, y, until}
  paused: false,
  levelDoneAt: 0,
  timeBonus: 0,
  stars: 0,
  flash: 0,
};

function level() { return LEVELS[state.levelIndex]; }
function diffs() { return level().diffs; }

function announce(msg) {
  statusEl.textContent = msg;
}

function startLevel(i) {
  state.levelIndex = i;
  state.found = new Set();
  state.streak = 0;
  state.timeLeft = level().time;
  state.hintsLeft = 2;
  state.hint = null;
  state.wrongMarks = [];
  state.foundAnim = [];
  state.levelStartScore = state.score;
  state.paused = false;
  state.screen = 'playing';
  announce(`Level ${i + 1}: ${level().name}. Find ${diffs().length} differences.`);
}

function startGame() {
  state.score = 0;
  state.wrong = 0;
  startLevel(0);
}

function levelComplete() {
  state.timeBonus = Math.ceil(state.timeLeft) * 5;
  state.score += state.timeBonus;
  state.levelDoneAt = performance.now();
  state.screen = 'levelDone';
  sfx.sfxLevel();
  announce(`Level complete! Time bonus ${state.timeBonus}. Score ${state.score}.`);
}

function gameOver() {
  state.stars = state.wrong <= 2 ? 3 : state.wrong <= 5 ? 2 : 1;
  state.screen = 'gameOver';
  sfx.sfxWin();
  announce(`You found every difference! Final score ${state.score}, ${state.stars} stars.`);
}

function timeUp() {
  state.screen = 'timeUp';
  announce('Time is up. Try this level again.');
}

function useHint(now) {
  if (state.screen !== 'playing' || state.paused) return;
  if (state.hintsLeft <= 0) return;
  if (now < state.hintCooldownUntil) return;
  const remaining = diffs().filter((d, i) => !state.found.has(i));
  if (!remaining.length) return;
  const d = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 25);
  state.hint = { x: d.x, y: d.y, until: now + 2500 };
  state.hintCooldownUntil = now + 2500;
  sfx.sfxClick();
  announce('Hint: look at the glowing circle.');
}

// ---- input ---------------------------------------------------------------
function toLogical(e) {
  const r = canvas.getBoundingClientRect();
  const cx = (e.clientX - r.left) * (W / r.width);
  const cy = (e.clientY - r.top) * (H / r.height);
  return { x: cx, y: cy };
}

function panelHit(p) {
  if (p.y < PANEL_Y || p.y > PANEL_Y + PANEL_H) return null;
  if (p.x >= LEFT_X && p.x <= LEFT_X + PANEL_W) return { side: 'left', x: p.x - LEFT_X, y: p.y - PANEL_Y };
  if (p.x >= RIGHT_X && p.x <= RIGHT_X + PANEL_W) return { side: 'right', x: p.x - RIGHT_X, y: p.y - PANEL_Y };
  return null;
}

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  const now = performance.now();
  if (state.screen === 'title') { sfx.sfxClick(); startGame(); return; }
  if (state.screen === 'levelDone') {
    if (state.levelIndex + 1 < LEVELS.length) { sfx.sfxClick(); startLevel(state.levelIndex + 1); }
    else { gameOver(); }
    return;
  }
  if (state.screen === 'gameOver' || state.screen === 'timeUp') {
    // clicks on the buttons are handled by the button hit test below
  }
  const p = toLogical(e);
  // footer buttons
  const btn = hitButton(p);
  if (btn) { btn.action(); return; }
  if (state.screen !== 'playing' || state.paused) return;
  const hit = panelHit(p);
  if (!hit) return;
  // find the nearest unfound difference within reach
  let best = -1;
  let bestD = 1e9;
  diffs().forEach((d, i) => {
    if (state.found.has(i)) return;
    const dd = Math.hypot(d.x - hit.x, d.y - hit.y);
    if (dd < d.r + 12 && dd < bestD) { best = i; bestD = dd; }
  });
  if (best >= 0) {
    const d = diffs()[best];
    state.found.add(best);
    state.streak += 1;
    const gain = 100 + (state.streak - 1) * 25;
    state.score += gain;
    state.foundAnim.push({ x: d.x, y: d.y, until: now + 900 });
    sfx.sfxFound();
    announce(`Found! ${state.found.size} of ${diffs().length}. Score ${state.score}.`);
    if (state.found.size === diffs().length) {
      if (state.levelIndex + 1 < LEVELS.length) levelComplete();
      else {
        state.timeBonus = Math.ceil(state.timeLeft) * 5;
        state.score += state.timeBonus;
        gameOver();
      }
    }
  } else {
    state.wrong += 1;
    state.streak = 0;
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    state.flash = now + 180;
    state.wrongMarks.push({ x: p.x, y: p.y, until: now + 700 });
    sfx.sfxWrong();
    announce(`Not a difference. Five seconds lost. ${state.found.size} of ${diffs().length} found.`);
    if (state.timeLeft <= 0) timeUp();
  }
});

window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (k === 'h') useHint(performance.now());
  if (k === 'm') { sfx.setMuted(!sfx.isMuted()); }
  if (k === 'p' && state.screen === 'playing') { state.paused = !state.paused; }
  if (k === 'r') { sfx.sfxClick(); startGame(); }
  if (k === 'enter' && state.screen === 'title') { startGame(); }
});

// footer buttons, logical coords
function buttons() {
  return [
    { label: 'Hint  (' + state.hintsLeft + ')', x: 40, y: 662, w: 130, h: 40, action: () => useHint(performance.now()) },
    { label: state.paused ? 'Resume' : 'Pause', x: 182, y: 662, w: 110, h: 40, action: () => { if (state.screen === 'playing') state.paused = !state.paused; } },
    { label: sfx.isMuted() ? 'Sound off' : 'Sound on', x: 304, y: 662, w: 120, h: 40, action: () => sfx.setMuted(!sfx.isMuted()) },
    { label: 'Restart', x: 436, y: 662, w: 110, h: 40, action: () => { sfx.sfxClick(); startGame(); } },
  ];
}

function hitButton(p) {
  for (const b of buttons()) {
    if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) return b;
  }
  if (state.screen === 'gameOver' || state.screen === 'timeUp' || state.screen === 'levelDone') {
    // big centre button
    if (p.x >= 540 && p.x <= 740 && p.y >= 500 && p.y <= 552) {
      return { action: () => {
        if (state.screen === 'levelDone') {
          if (state.levelIndex + 1 < LEVELS.length) startLevel(state.levelIndex + 1); else gameOver();
        } else if (state.screen === 'timeUp') {
          state.score = state.levelStartScore;
          startLevel(state.levelIndex);
        } else {
          startGame();
        }
      } };
    }
  }
  return null;
}

// ---- drawing --------------------------------------------------------------
function drawBackground() {
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#1d2340');
  bg.addColorStop(1, '#2c2350');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
}

function drawHeader() {
  g.fillStyle = '#f2e3c9';
  g.font = 'bold 34px Georgia, serif';
  g.textAlign = 'left'; g.textBaseline = 'middle';
  g.fillText('Lantern Lane', 40, 44);
  g.font = '16px Georgia, serif';
  g.fillStyle = '#c9b8d9';
  g.fillText('spot the difference', 40, 76);
  // level + found counter, centre
  g.textAlign = 'center';
  g.fillStyle = '#f2e3c9';
  g.font = 'bold 22px Georgia, serif';
  if (state.screen === 'playing' || state.screen === 'levelDone' || state.screen === 'timeUp') {
    g.fillText(`Level ${state.levelIndex + 1} of ${LEVELS.length} — ${level().name}`, 640, 34);
    g.font = '18px Georgia, serif';
    g.fillStyle = '#ffd76a';
    g.fillText(`Found ${state.found.size} / ${diffs().length}`, 640, 66);
    // progress dots
    diffs().forEach((d, i) => {
      g.beginPath();
      g.arc(560 + i * 24, 92, 7, 0, Math.PI * 2);
      g.fillStyle = state.found.has(i) ? '#7ad96a' : 'rgba(242,227,201,0.3)';
      g.fill();
    });
  } else {
    g.fillText('Three scenes. Seven differences each.', 640, 44);
  }
  // timer + score, right
  g.textAlign = 'right';
  g.font = 'bold 26px Georgia, serif';
  g.fillStyle = state.timeLeft <= 15 && state.screen === 'playing' ? '#ff6a6a' : '#f2e3c9';
  g.fillText(`⏱ ${Math.ceil(state.timeLeft)}s`, 1240, 40);
  g.fillStyle = '#ffd76a';
  g.fillText(`★ ${state.score}`, 1240, 74);
  // timer bar
  const frac = Math.max(0, state.timeLeft / level().time);
  g.fillStyle = 'rgba(242,227,201,0.2)';
  g.fillRect(1000, 96, 240, 8);
  g.fillStyle = frac > 0.3 ? '#7ad96a' : '#ff6a6a';
  g.fillRect(1000, 96, 240 * frac, 8);
}

function drawPanelFrame(x) {
  g.fillStyle = '#f7efdd';
  g.fillRect(x - 6, PANEL_Y - 6, PANEL_W + 12, PANEL_H + 12);
  g.strokeStyle = '#c9b8a3';
  g.lineWidth = 2;
  g.strokeRect(x - 6, PANEL_Y - 6, PANEL_W + 12, PANEL_H + 12);
}

// Draw one panel: frame, then the scene clipped to the panel, restored after.
function drawOnePanel(x, side) {
  drawPanelFrame(x);
  g.save();
  g.beginPath();
  g.rect(x, PANEL_Y, PANEL_W, PANEL_H);
  g.clip();
  g.translate(x, PANEL_Y);
  drawPanel(g, level(), side);
  g.restore();
}

function drawMarkers(now) {
  for (const i of state.found) {
    const d = diffs()[i];
    for (const px of [LEFT_X, RIGHT_X]) {
      g.strokeStyle = '#2fae4e';
      g.lineWidth = 4;
      g.beginPath();
      g.arc(px + d.x, PANEL_Y + d.y, d.r + 4, 0, Math.PI * 2);
      g.stroke();
      g.strokeStyle = 'rgba(47,174,78,0.4)';
      g.lineWidth = 10;
      g.beginPath();
      g.arc(px + d.x, PANEL_Y + d.y, d.r + 8, 0, Math.PI * 2);
      g.stroke();
    }
  }
  // fresh-find pulse
  state.foundAnim = state.foundAnim.filter((a) => now < a.until);
  for (const a of state.foundAnim) {
    const t = 1 - (a.until - now) / 900;
    for (const px of [LEFT_X, RIGHT_X]) {
      g.strokeStyle = `rgba(47,174,78,${0.9 - t * 0.9})`;
      g.lineWidth = 3;
      g.beginPath();
      g.arc(px + a.x, PANEL_Y + a.y, 10 + t * 34, 0, Math.PI * 2);
      g.stroke();
    }
  }
  // hint glow
  if (state.hint && now < state.hint.until) {
    const pulse = 0.6 + 0.4 * Math.sin(now / 120);
    for (const px of [LEFT_X, RIGHT_X]) {
      g.strokeStyle = `rgba(255,215,106,${pulse})`;
      g.lineWidth = 4;
      g.beginPath();
      g.arc(px + state.hint.x, PANEL_Y + state.hint.y, 30 + 4 * Math.sin(now / 120), 0, Math.PI * 2);
      g.stroke();
    }
  } else if (state.hint) state.hint = null;
  // wrong-click marks
  state.wrongMarks = state.wrongMarks.filter((m) => now < m.until);
  for (const m of state.wrongMarks) {
    g.strokeStyle = '#ff5a5a';
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(m.x - 12, m.y - 12); g.lineTo(m.x + 12, m.y + 12);
    g.moveTo(m.x + 12, m.y - 12); g.lineTo(m.x - 12, m.y + 12);
    g.stroke();
  }
}

function drawFooter() {
  g.textAlign = 'left'; g.textBaseline = 'middle';
  for (const b of buttons()) {
    g.fillStyle = '#3a2f5e';
    g.beginPath(); g.roundRect(b.x, b.y, b.w, b.h, 8); g.fill();
    g.strokeStyle = '#c9b8d9'; g.lineWidth = 1.5;
    g.beginPath(); g.roundRect(b.x, b.y, b.w, b.h, 8); g.stroke();
    g.fillStyle = '#f2e3c9';
    g.font = '16px Georgia, serif';
    g.textAlign = 'center';
    g.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + 1);
    g.textAlign = 'left';
  }
  g.fillStyle = '#c9b8d9';
  g.font = '15px Georgia, serif';
  g.textAlign = 'right';
  g.fillText('Click a difference on either picture  •  H hint  •  P pause  •  M mute  •  R restart', 1240, 682);
  g.textAlign = 'left';
}

function overlay(title, lines, buttonLabel) {
  g.fillStyle = 'rgba(20,16,40,0.78)';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#f7efdd';
  g.beginPath(); g.roundRect(340, 150, 600, 400, 18); g.fill();
  g.fillStyle = '#2c2350';
  g.font = 'bold 40px Georgia, serif';
  g.textAlign = 'center';
  g.fillText(title, 640, 220);
  g.font = '20px Georgia, serif';
  g.fillStyle = '#5d4f6e';
  lines.forEach((ln, i) => g.fillText(ln, 640, 280 + i * 36));
  if (buttonLabel) {
    g.fillStyle = '#2fae4e';
    g.beginPath(); g.roundRect(540, 500, 200, 52, 10); g.fill();
    g.fillStyle = '#ffffff';
    g.font = 'bold 22px Georgia, serif';
    g.fillText(buttonLabel, 640, 527);
  }
  g.textAlign = 'left';
}

function drawTitle() {
  drawBackground();
  // preview: level 1 panels, dimmed, behind the title card
  drawOnePanel(LEFT_X, 'left');
  drawOnePanel(RIGHT_X, 'right');
  g.fillStyle = 'rgba(20,16,40,0.55)';
  g.fillRect(0, 0, W, H);
  g.textAlign = 'center';
  g.fillStyle = '#ffd76a';
  g.font = 'bold 64px Georgia, serif';
  g.fillText('Lantern Lane', 640, 210);
  g.fillStyle = '#f2e3c9';
  g.font = '28px Georgia, serif';
  g.fillText('Spot the Difference', 640, 262);
  g.font = '20px Georgia, serif';
  g.fillStyle = '#c9b8d9';
  g.fillText('Two pictures. Seven differences. Three scenes.', 640, 320);
  g.fillText('Find them all before the lanterns burn down.', 640, 352);
  g.fillStyle = '#2fae4e';
  g.beginPath(); g.roundRect(520, 400, 240, 56, 12); g.fill();
  g.fillStyle = '#ffffff';
  g.font = 'bold 24px Georgia, serif';
  g.fillText('▶  Play', 640, 429);
  g.font = '16px Georgia, serif';
  g.fillStyle = '#c9b8d9';
  g.fillText('Click or press Enter  •  a wrong click costs 5 seconds', 640, 500);
  g.textAlign = 'left';
}

let last = performance.now();

function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (state.screen === 'playing' && !state.paused) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) { state.timeLeft = 0; timeUp(); }
  }
  drawBackground();
  if (state.screen === 'title') { drawTitle(); requestAnimationFrame(frame); return; }
  drawHeader();
  // panels
  drawOnePanel(LEFT_X, 'left');
  drawOnePanel(RIGHT_X, 'right');
  drawMarkers(now);
  drawFooter();
  if (state.paused && state.screen === 'playing') {
    overlay('Paused', ['Take a breath. The timer is waiting.'], 'Resume');
  }
  if (state.screen === 'levelDone') {
    const next = state.levelIndex + 1 < LEVELS.length ? LEVELS[state.levelIndex + 1].name : '';
    overlay('Level complete!', [
      `Time bonus +${state.timeBonus}`,
      `Score ${state.score}`,
      next ? `Next: ${next}` : '',
    ].filter(Boolean), state.levelIndex + 1 < LEVELS.length ? 'Next level  →' : 'See results  →');
  }
  if (state.screen === 'timeUp') {
    overlay("Time's up!", [
      `${level().name} — you found ${state.found.size} of ${diffs().length}.`,
      'Your score for this level is kept safe.',
    ], 'Try this level again');
  }
  if (state.screen === 'gameOver') {
    const starRow = '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars);
    overlay('You found them all!', [
      `Final score ${state.score}`,
      starRow,
      `Wrong clicks: ${state.wrong}`,
    ], 'Play again');
  }
  if (state.flash && now < state.flash) {
    g.fillStyle = 'rgba(255,60,60,0.12)';
    g.fillRect(0, 0, W, H);
  }
  requestAnimationFrame(frame);
}

// ---- screenshot staging ----------------------------------------------------
function stageShot() {
  if (shot === 'play') {
    state.screen = 'playing';
    state.levelIndex = 0;
    state.found = new Set([0, 2, 4]);
    state.score = 300;
    state.streak = 3;
    state.timeLeft = 62;
    state.hintsLeft = 2;
  } else if (shot === 'end') {
    state.screen = 'gameOver';
    state.levelIndex = 2;
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.score = 2150;
    state.wrong = 1;
    state.stars = 3;
    state.timeLeft = 24;
  } else {
    state.screen = 'title';
    state.levelIndex = 0;
    state.found = new Set();
    state.score = 0;
    state.timeLeft = 90;
  }
}

scaleCanvas();
window.addEventListener('resize', scaleCanvas);
stageShot();
requestAnimationFrame(frame);
