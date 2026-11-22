// Gentle synthesized sounds (WebAudio, no audio files).
window.TW = window.TW || {};
TW.sound = (function () {
  let ctx = null, master = null, nbuf = null, muted = false;
  try { muted = localStorage.getItem('tobaMuted') === '1'; } catch (e) {}

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try {
        ctx = new C();
        master = ctx.createGain();
        master.gain.value = 0.9;
        master.connect(ctx.destination);
      } catch (e) { ctx = null; return null; }
    }
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume().catch(function () {});
    return ctx;
  }

  function env(g, t, vol, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  function tone(freq, dur, o) {
    o = o || {};
    if (muted) return;
    const c = ac(); if (!c) return;
    const t = c.currentTime + (o.delay || 0);
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur * 0.8);
    env(g, t, o.vol || 0.2, dur);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  function noise(dur, o) {
    o = o || {};
    if (muted) return;
    const c = ac(); if (!c) return;
    if (!nbuf) {
      nbuf = c.createBuffer(1, Math.floor(c.sampleRate * 1.5), c.sampleRate);
      const d = nbuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t = c.currentTime + (o.delay || 0);
    const src = c.createBufferSource(); src.buffer = nbuf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = o.q || 1.2;
    f.frequency.setValueAtTime(o.from || 800, t);
    f.frequency.exponentialRampToValueAtTime(o.to || 800, t + dur);
    const g = c.createGain(); env(g, t, o.vol || 0.15, dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.05);
  }

  function boing() {
    if (muted) return;
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = 'triangle';
    const f = osc.frequency;
    f.setValueAtTime(160, t);
    f.exponentialRampToValueAtTime(520, t + 0.07);
    f.exponentialRampToValueAtTime(260, t + 0.15);
    f.exponentialRampToValueAtTime(420, t + 0.23);
    f.exponentialRampToValueAtTime(300, t + 0.31);
    f.exponentialRampToValueAtTime(360, t + 0.4);
    env(g, t, 0.2, 0.45);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + 0.5);
  }

  // ---------- hub music: a small original tune on an eighth-note grid ----------
  const EIGHTH = 60 / 112 / 2;
  const MELODY = [[72, 1], [76, 1], [79, 1], [76, 1], [77, 1], [81, 1], [79, 2],
    [76, 1], [79, 1], [84, 2], [81, 1], [79, 1], [76, 2],
    [74, 1], [77, 1], [81, 1], [77, 1], [76, 1], [79, 1], [77, 1], [74, 1],
    [72, 1], [76, 1], [74, 1], [71, 1], [72, 4]];
  const BASS = [48, 45, 50, 43];
  const SLOTS = [];
  (function () { let k = 0; MELODY.forEach(function (n) { SLOTS[k] = n; k += n[1]; }); SLOTS.length = 32; })();
  let mus = null;

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function note(f, t, dur, type, vol, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function schedule() {
    if (!mus) return;
    const now = ctx.currentTime;
    if (mus.next < now - 0.05) mus.next = now + 0.05; // tab was asleep: don't play a pile-up
    while (mus.next < now + 0.35) {
      const e = mus.e % 32, n = SLOTS[e];
      if (n) note(mtof(n[0]), mus.next, n[1] * EIGHTH * 0.95, 'triangle', 0.07, mus.gain);
      if (e % 4 === 0) note(mtof(BASS[Math.floor(e / 8)]), mus.next, EIGHTH * 3.6, 'sine', 0.07, mus.gain);
      if (e % 2 === 1) note(mtof(BASS[Math.floor(e / 8)] + 31), mus.next, EIGHTH * 0.6, 'sine', 0.02, mus.gain);
      mus.next += EIGHTH;
      mus.e++;
    }
  }
  function musicStart() {
    if (muted || mus) return;
    const c = ac(); if (!c) return;
    const g = c.createGain();
    g.gain.setValueAtTime(0, c.currentTime);
    g.gain.linearRampToValueAtTime(1, c.currentTime + 1);
    g.connect(master);
    mus = { gain: g, next: c.currentTime + 0.15, e: 0 };
    mus.timer = setInterval(schedule, 90);
    schedule();
  }
  function musicStop() {
    if (!mus) return;
    const m = mus; mus = null;
    clearInterval(m.timer);
    m.gain.gain.cancelScheduledValues(ctx.currentTime);
    m.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
    setTimeout(function () { m.gain.disconnect(); }, 600);
  }

  // A shaped synth voice for animal calls: pitch glide, optional wobble, a filter for colour.
  function call(type, f0, f1, dur, o) {
    o = o || {};
    if (muted) return;
    const c = ac(); if (!c) return;
    const t = c.currentTime + (o.delay || 0);
    const osc = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    if (o.vib) {
      const l = c.createOscillator(), lg = c.createGain();
      l.frequency.value = o.vib; lg.gain.value = o.depth || 20;
      l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + dur + 0.05);
    }
    f.type = o.ft || 'lowpass'; f.frequency.value = o.ff || 1200; f.Q.value = o.q || 1;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.25, t + (o.att || 0.05));
    g.gain.setValueAtTime(o.vol || 0.25, t + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(f); f.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.05);
  }
  const ANIMALS = {
    cow: function () { call('sawtooth', 150, 105, 1.1, { ff: 520, vib: 4, depth: 6, att: 0.15, vol: 0.3 }); },
    sheep: function () { call('sawtooth', 420, 380, 0.8, { ff: 1800, vib: 9, depth: 40, att: 0.04, vol: 0.18 }); },
    chicken: function () { [0, 0.11, 0.22, 0.42].forEach(function (d, i) { call('square', i === 3 ? 1100 : 900, 600, 0.08, { ff: 2400, vol: 0.12, att: 0.01, delay: d }); }); },
    duck: function () { [0, 0.24].forEach(function (d) { call('square', 560, 380, 0.17, { ft: 'bandpass', ff: 1100, q: 3, vol: 0.3, att: 0.01, delay: d }); }); },
    horse: function () { call('sawtooth', 950, 480, 1.0, { ff: 2200, vib: 11, depth: 70, att: 0.03, vol: 0.16 }); }
  };

  return {
    unlock: function () { ac(); },
    animal: function (k) { if (ANIMALS[k]) ANIMALS[k](); },
    fanfare: function () {
      [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.22, { type: 'triangle', vol: 0.14, delay: i * 0.11 }); });
      [523, 659, 784].forEach(function (f) { tone(f * 2, 0.9, { type: 'triangle', vol: 0.07, delay: 0.5 }); });
    },
    tink: function () { tone(1700 + Math.random() * 900, 0.14, { type: 'triangle', vol: 0.045 }); },
    drip: function () { tone(1200 + Math.random() * 400, 0.08, { to: 600, vol: 0.12 }); },
    musicStart: musicStart,
    musicStop: musicStop,
    musicPlaying: function () { return !!mus; },
    // Lower the music while the voice talks.
    duck: function (on) { if (mus) mus.gain.gain.setTargetAtTime(on ? 0.3 : 1, ctx.currentTime, 0.12); },
    pop: function () { tone(500 + Math.random() * 250, 0.12, { to: 1100, vol: 0.2 }); },
    softPop: function () { tone(380 + Math.random() * 120, 0.1, { to: 700, vol: 0.12 }); },
    plop: function () { tone(700, 0.14, { to: 220, vol: 0.18 }); },
    boing: boing,
    chime: function () { [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, 0.4, { type: 'triangle', vol: 0.12, delay: i * 0.08 }); }); },
    ding: function () { tone(1568, 1.0, { vol: 0.16 }); tone(2093, 0.8, { vol: 0.07, delay: 0.02 }); },
    whoosh: function () { noise(0.35, { from: 400, to: 2400, vol: 0.16 }); },
    swish: function () { noise(0.25, { from: 1800, to: 600, vol: 0.12 }); },
    munch: function () { [0, 0.16, 0.32].forEach(function (d) { noise(0.09, { from: 900, to: 500, vol: 0.25, delay: d }); }); },
    sizzle: function (d) {
      d = d || 1.4;
      noise(d, { from: 3200, to: 2600, vol: 0.06, q: 0.7 });
      for (let i = 0; i < d * 6; i++) noise(0.03, { from: 4000, to: 3000, vol: 0.05, q: 2, delay: Math.random() * d });
    },
    beep: function (f) { tone(f || 880, 0.16, { type: 'square', vol: 0.06 }); },
    flutter: function () { for (let i = 0; i < 6; i++) noise(0.07, { from: 2500, to: 1400, vol: 0.12, delay: i * 0.09 }); },
    rumble: function (dur) { noise(dur || 3, { from: 160, to: 90, q: 0.8, vol: 0.35 }); },
    fizz: function () { noise(0.9, { from: 4000, to: 1800, vol: 0.09, q: 0.6 }); tone(500, 0.2, { to: 900, vol: 0.1, delay: 0.1 }); },
    bloop: function () { tone(260 + Math.random() * 120, 0.18, { to: 640, vol: 0.16 }); },
    sparkle: function () { [1568, 2093, 2637, 3136].forEach(function (f, i) { tone(f, 0.3, { type: 'triangle', vol: 0.06, delay: i * 0.06 }); }); },
    isMuted: function () { return muted; },
    setMuted: function (m) {
      muted = m;
      if (m) { musicStop(); if (TW.voice) TW.voice.cancel(); }
      try { localStorage.setItem('tobaMuted', m ? '1' : '0'); } catch (e) {}
    }
  };
})();
