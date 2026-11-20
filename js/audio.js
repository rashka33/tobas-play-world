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

  return {
    unlock: function () { ac(); },
    pop: function () { tone(500 + Math.random() * 250, 0.12, { to: 1100, vol: 0.2 }); },
    softPop: function () { tone(380 + Math.random() * 120, 0.1, { to: 700, vol: 0.12 }); },
    plop: function () { tone(700, 0.14, { to: 220, vol: 0.18 }); },
    boing: boing,
    chime: function () { [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, 0.4, { type: 'triangle', vol: 0.12, delay: i * 0.08 }); }); },
    ding: function () { tone(1568, 1.0, { vol: 0.16 }); tone(2093, 0.8, { vol: 0.07, delay: 0.02 }); },
    whoosh: function () { noise(0.35, { from: 400, to: 2400, vol: 0.16 }); },
    swish: function () { noise(0.25, { from: 1800, to: 600, vol: 0.12 }); },
    munch: function () { [0, 0.16, 0.32].forEach(function (d) { noise(0.09, { from: 900, to: 500, vol: 0.25, delay: d }); }); },
    sizzle: function () { noise(1.4, { from: 3000, to: 2600, vol: 0.05, q: 0.7 }); },
    beep: function (f) { tone(f || 880, 0.16, { type: 'square', vol: 0.06 }); },
    flutter: function () { for (let i = 0; i < 6; i++) noise(0.07, { from: 2500, to: 1400, vol: 0.12, delay: i * 0.09 }); },
    rumble: function (dur) { noise(dur || 3, { from: 160, to: 90, q: 0.8, vol: 0.35 }); },
    fizz: function () { noise(0.9, { from: 4000, to: 1800, vol: 0.09, q: 0.6 }); tone(500, 0.2, { to: 900, vol: 0.1, delay: 0.1 }); },
    bloop: function () { tone(260 + Math.random() * 120, 0.18, { to: 640, vol: 0.16 }); },
    sparkle: function () { [1568, 2093, 2637, 3136].forEach(function (f, i) { tone(f, 0.3, { type: 'triangle', vol: 0.06, delay: i * 0.06 }); }); },
    isMuted: function () { return muted; },
    setMuted: function (m) {
      muted = m;
      try { localStorage.setItem('tobaMuted', m ? '1' : '0'); } catch (e) {}
    }
  };
})();
