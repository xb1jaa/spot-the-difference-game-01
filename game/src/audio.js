// Tiny WebAudio synth for Lantern Lane: no audio files, everything is
// generated in code. Created lazily on the first user gesture.
let ctx = null;
let muted = false;

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

function ac() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type, vol) {
  const c = ac();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + at);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + at + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(c.currentTime + at);
  o.stop(c.currentTime + at + dur + 0.05);
}

export function sfxFound() {
  tone(660, 0, 0.12, 'sine', 0.18);
  tone(880, 0.08, 0.18, 'sine', 0.18);
  tone(1320, 0.16, 0.2, 'sine', 0.1);
}

export function sfxWrong() {
  tone(160, 0, 0.18, 'sawtooth', 0.1);
  tone(120, 0.05, 0.22, 'sawtooth', 0.08);
}

export function sfxLevel() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.16));
}

export function sfxWin() {
  [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.16));
}

export function sfxClick() {
  tone(440, 0, 0.06, 'sine', 0.08);
}
