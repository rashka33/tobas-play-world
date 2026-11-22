// Scene 13: Glow Drawing — neon markers on a black canvas, and a dance button that makes her drawing come alive.
(function () {
  const A = TW.art, I = A.icons, O = A.O, NS = A.NS;
  const PENS = [
    { id: 'rainbow', c: null, say: 'Rainbow!' }, { id: 'blue', c: '#3D6BFF', say: 'Blue!' }, { id: 'red', c: '#FF2D55', say: 'Red!' },
    { id: 'yellow', c: '#FFE14D', say: 'Yellow!' }, { id: 'green', c: '#3DFF6E', say: 'Green!' }, { id: 'cyan', c: '#2EE6FF', say: 'Cyan!' },
    { id: 'pink', c: '#FF4DFF', say: 'Pink!' }
  ];
  const LINE = 14;             // marker thickness (css px)
  const SPLIT = 260;           // long strokes are baked in pieces so redraws stay quick
  const DANCE_MS = 8000;
  const BEAT = 60 / 112;       // same tempo as the hub tune

  let el, stage, cv, ctx, live, lctx, dancerEl = null, dpr = 1, fitted = false;
  let pen = PENS[0], erasing = false, hue = 0, trail = 0, bbox = null, frame = 0, dance = null;
  const strokes = new Map();   // pointerId -> { pts: [{x,y,h}], color }

  function penSvg(p) {
    const body = p.c ? `<rect x="10" y="40" width="40" height="58" rx="8" fill="${p.c}" stroke="${O}" stroke-width="3"/>`
      : ['#FF2D55', '#FF9F1C', '#FFE14D', '#3DFF6E', '#2EE6FF', '#A86BFF'].map((c, i) => `<rect x="10" y="${40 + i * 9.6}" width="40" height="10" fill="${c}"/>`).join('') + `<rect x="10" y="40" width="40" height="58" rx="8" fill="none" stroke="${O}" stroke-width="3"/>`;
    return `<svg ${NS} viewBox="0 0 60 100"><path d="M22 4 H38 L42 18 H18 Z" fill="${p.c || '#FFE14D'}" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
<path d="M16 18 H44 L50 42 H10 Z" fill="#2A2A33" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>${body}<rect x="16" y="46" width="7" height="40" rx="3" fill="#fff" opacity=".35"/></svg>`;
  }
  const ERASER = `<svg ${NS} viewBox="0 0 60 100"><rect x="8" y="8" width="44" height="86" rx="12" fill="#fff" stroke="${O}" stroke-width="3"/><path d="M8 62 H52 V82 Q52 94 40 94 H20 Q8 94 8 82 Z" fill="#FF9EC4" stroke="${O}" stroke-width="3"/>
<circle cx="22" cy="34" r="7" fill="#fff" stroke="${O}" stroke-width="2.5"/><circle cx="38" cy="34" r="7" fill="#fff" stroke="${O}" stroke-width="2.5"/><circle cx="23" cy="35" r="3" fill="#2F8FE8"/><circle cx="39" cy="35" r="3" fill="#2F8FE8"/>
<path d="M20 48 Q30 58 40 48 Z" fill="#E8453C" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  const DANCE = `<svg ${NS} viewBox="0 0 100 100"><path d="${A.starPath(50, 54, 44, 20)}" fill="#FFD93D" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>
<path d="M44 66 V36 L62 32 V58" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="40" cy="67" rx="7" ry="5.5" fill="${O}"/><ellipse cx="58" cy="59" rx="7" ry="5.5" fill="${O}"/></svg>`;

  function init() {
    el = document.getElementById('glow');
    el.innerHTML = `<button class="rbtn back corner" data-back aria-label="Back to home">${I.back}</button>
<button class="rbtn glow-clear" aria-label="Clear the picture">${I.clear}</button>
<div class="glow-stage"><canvas class="glow-main"></canvas><canvas class="glow-live"></canvas>
<button class="dance-btn" aria-label="Make my drawing dance">${DANCE}</button></div>
<div class="pen-bar">${PENS.map(p => `<button class="pen" data-pen="${p.id}" aria-label="${p.id} marker">${penSvg(p)}</button>`).join('')}<button class="pen" data-eraser aria-label="Eraser">${ERASER}</button></div>`;
    stage = el.querySelector('.glow-stage');
    cv = el.querySelector('.glow-main'); ctx = cv.getContext('2d');
    live = el.querySelector('.glow-live'); lctx = live.getContext('2d');

    el.querySelector('.pen-bar').addEventListener('click', function (e) {
      const b = e.target.closest('.pen');
      if (!b) return;
      if ('eraser' in b.dataset) { erasing = true; TW.voice.say('Eraser!'); TW.sound.pop(); }
      else { erasing = false; pen = PENS.find(p => p.id === b.dataset.pen); TW.voice.say(pen.say); TW.sound.sparkle(); }
      TW.fx.bounce(b, 'pressed');
      const c = TW.fx.center(b); TW.fx.burst(c.x, c.y - 30, { count: 5, colors: pen.c && !erasing ? [pen.c, '#ffffff'] : undefined });
      updateUI();
    });
    el.querySelector('.glow-clear').addEventListener('click', function () {
      if (dance) return;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
      bbox = null;
      TW.sound.swish(); TW.voice.say('All clean!');
      const c = TW.fx.center(stage); TW.fx.burst(c.x, c.y, { count: 14 });
    });
    el.querySelector('.dance-btn').addEventListener('click', startDance);

    cv.addEventListener('pointerdown', down);
    cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    window.addEventListener('resize', function () { if (el.classList.contains('active')) fit(); });
    updateUI();
  }

  function updateUI() {
    el.querySelectorAll('.pen').forEach(b => b.classList.toggle('sel', erasing ? 'eraser' in b.dataset : b.dataset.pen === pen.id));
  }

  // ----- drawing -----
  function pt(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr }; }

  function down(e) {
    if (dance) return;
    e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch (_) {}
    const p = pt(e);
    if (erasing) { strokes.set(e.pointerId, { pts: [p], erase: true }); eraseSeg(p, p); return; }
    p.h = hue;
    strokes.set(e.pointerId, { pts: [p], color: pen.c });
    if (strokes.size === 1) TW.sound.tink();
    schedule();
  }

  function move(e) {
    const s = strokes.get(e.pointerId);
    if (!s) return;
    const list = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
    for (const ev of (list.length ? list : [e])) {
      const p = pt(ev), last = s.pts[s.pts.length - 1];
      const d = Math.hypot(p.x - last.x, p.y - last.y);
      if (d < 1.5 * dpr) continue;
      if (s.erase) { eraseSeg(last, p); s.pts.push(p); continue; }
      hue = (hue + d / dpr * 0.6) % 360;
      p.h = hue;
      s.pts.push(p);
      trail += d / dpr;
    }
    if (s.erase) return;
    if (trail > 90) { trail = 0; TW.sound.tink(); TW.fx.twinkle(e.clientX, e.clientY, s.color || `hsl(${hue},100%,65%)`); }
    if (s.pts.length > SPLIT) { bake(s); s.pts = s.pts.slice(-1); }
    schedule();
  }

  function up(e) {
    const s = strokes.get(e.pointerId);
    if (!s) return;
    strokes.delete(e.pointerId);
    if (!s.erase) bake(s);
    schedule();
  }

  function eraseSeg(a, b) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = LINE * 2.6 * dpr;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x + 0.01, b.y); ctx.stroke();
    ctx.restore();
  }

  // One stroke as light: coloured line with a soft halo, then a hot white core on top.
  function paintStroke(c, s) {
    const pts = s.pts, w = LINE * dpr;
    if (!pts.length) return;
    c.save();
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.shadowBlur = 18 * dpr;
    c.lineWidth = w;
    if (s.color) {
      c.shadowColor = s.color; c.strokeStyle = s.color;
      path(c, pts); c.stroke();
    } else {
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)], b = pts[i], col = `hsl(${b.h},100%,60%)`;
        c.shadowColor = col; c.strokeStyle = col;
        c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x + 0.01, b.y); c.stroke();
      }
    }
    c.shadowBlur = 0;
    c.strokeStyle = 'rgba(255,255,255,.88)';
    c.lineWidth = w * 0.36;
    path(c, pts); c.stroke();
    c.restore();
  }
  function path(c, pts) {
    c.beginPath();
    c.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 1) c.lineTo(pts[0].x + 0.01, pts[0].y);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
  }

  function bake(s) {
    paintStroke(ctx, s);
    const m = (LINE + 26) * dpr;
    s.pts.forEach(function (p) {
      if (!bbox) bbox = { x0: p.x, y0: p.y, x1: p.x, y1: p.y };
      bbox.x0 = Math.min(bbox.x0, p.x - m); bbox.y0 = Math.min(bbox.y0, p.y - m);
      bbox.x1 = Math.max(bbox.x1, p.x + m); bbox.y1 = Math.max(bbox.y1, p.y + m);
    });
  }

  // The live layer shows strokes still being drawn; redrawn at most once per frame.
  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(function () {
      frame = 0;
      lctx.clearRect(0, 0, live.width, live.height);
      strokes.forEach(function (s) { if (!s.erase) paintStroke(lctx, s); });
    });
  }

  function fit() {
    const r = stage.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (fitted && cv.width === w && cv.height === h) return;
    let tmp = null;
    if (fitted) { tmp = document.createElement('canvas'); tmp.width = cv.width; tmp.height = cv.height; tmp.getContext('2d').drawImage(cv, 0, 0); }
    cv.width = live.width = w; cv.height = live.height = h;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    if (tmp) ctx.drawImage(tmp, 0, 0);
    fitted = true;
  }

  // ----- the dance -----
  function startDance() {
    if (dance) { endSoon(); return; }
    strokes.forEach(function (s) { if (!s.erase) bake(s); });
    strokes.clear(); schedule();
    if (!bbox) {
      TW.voice.say('Draw something, then press dance!');
      TW.fx.bounce(el.querySelector('.dance-btn'), 'wiggle');
      return;
    }
    const x = Math.max(0, Math.floor(bbox.x0)), y = Math.max(0, Math.floor(bbox.y0));
    const w = Math.min(cv.width, Math.ceil(bbox.x1)) - x, h = Math.min(cv.height, Math.ceil(bbox.y1)) - y;
    if (w < 4 || h < 4) return;
    const snap = document.createElement('canvas');
    snap.width = w; snap.height = h;
    snap.getContext('2d').drawImage(cv, x, y, w, h, 0, 0, w, h);
    ctx.fillStyle = '#000'; ctx.fillRect(x, y, w, h);   // lift it off the canvas

    dancerEl = snap;
    snap.className = 'glow-dancer';
    snap.style.left = (x / dpr) + 'px'; snap.style.top = (y / dpr) + 'px';
    snap.style.width = (w / dpr) + 'px'; snap.style.height = (h / dpr) + 'px';
    snap.addEventListener('pointerdown', function (e) { e.preventDefault(); endSoon(); });
    stage.appendChild(snap);

    dance = { snap: snap, x: x, y: y, start: performance.now(), end: DANCE_MS, lastBeat: -1, raf: 0 };
    el.classList.add('dancing');
    TW.sound.musicStart();
    TW.voice.say('Wow! Your drawing is dancing!');
    TW.sound.fanfare();
    dance.raf = requestAnimationFrame(step);
  }

  function endSoon() {
    if (!dance) return;
    const t = performance.now() - dance.start;
    dance.end = Math.min(dance.end, t + 700);
  }

  function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }

  function step() {
    const d = dance;
    if (!d) return;
    // performance.now(), not the frame timestamp: some browsers hand rAF a time from an older timeline.
    const t = (performance.now() - d.start) / 1000, T = d.end / 1000;
    if (t >= T) { finish(); return; }
    const r = stage.getBoundingClientRect();
    const dw = d.snap.width / dpr, dh = d.snap.height / dpr;
    const homeX = d.x / dpr + dw / 2, homeY = d.y / dpr + dh / 2;
    // Gently shrink a huge drawing so it has room to dance.
    const fitS = Math.min(1, (r.width * 0.75) / dw, (r.height * 0.7) / dh);
    const blend = ease(t / 0.6) * ease((T - t) / 0.7);
    const s0 = 1 + (fitS - 1) * blend;
    const ax = Math.max(0, r.width / 2 - dw * s0 * 0.5 - 12), ay = Math.max(0, r.height / 2 - dh * s0 * 0.5 - 12) * 0.7;
    const cx = r.width / 2 + ax * Math.sin(t * 0.9), cy = r.height / 2 + ay * Math.sin(t * 1.3 + 1);
    const ox = (cx - homeX) * blend, oy = (cy - homeY) * blend;
    // A hop on every beat with squash on landing and stretch in the air.
    const ph = (t % BEAT) / BEAT, k = Math.cos(ph * Math.PI * 2);
    const hop = Math.sin(ph * Math.PI) * Math.min(70, r.height * 0.09) * blend;
    const sy = 1 - 0.13 * k * blend, sx = 1 + 0.11 * k * blend;
    let rot = 11 * Math.sin(t * Math.PI / BEAT) * blend;
    if (t > 3 && t < 4.1) rot += 360 * ease((t - 3) / 1.1);          // a little spin
    if (t > 6 && t < 6.9) rot -= 360 * ease((t - 6) / 0.9);          // and back the other way
    d.snap.style.transform = `translate(${ox}px,${oy - hop}px) rotate(${rot}deg) scale(${s0 * sx},${s0 * sy})`;
    d.snap.style.filter = `hue-rotate(${(t * 140) % 360}deg) brightness(${1.05 + 0.35 * (1 - k) / 2 * blend}) saturate(1.3)`;
    const beat = Math.floor(t / BEAT);
    if (beat !== d.lastBeat) {
      d.lastBeat = beat;
      if (blend > 0.5) {
        const b = d.snap.getBoundingClientRect();
        TW.fx.burst(b.left + b.width / 2 + (Math.random() - 0.5) * b.width * 0.6, b.top + b.height / 2 + (Math.random() - 0.5) * b.height * 0.6, { count: 6, colors: ['#FF4DFF', '#2EE6FF', '#FFE14D', '#3DFF6E', '#FFFFFF'] });
      }
    }
    d.raf = requestAnimationFrame(step);
  }

  function finish() {
    const d = dance;
    if (!d) return;
    cancelAnimationFrame(d.raf);
    dance = null;
    ctx.drawImage(d.snap, d.x, d.y);   // settle back exactly where it was drawn
    const b = d.snap.getBoundingClientRect();
    d.snap.remove();
    dancerEl = null;
    el.classList.remove('dancing');
    TW.sound.musicStop();
    TW.sound.chime();
    TW.fx.burst(b.left + b.width / 2, b.top + b.height / 2, { count: 16 });
  }

  A.hubArt.glow = `<svg ${NS} viewBox="0 0 120 120"><g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path d="M18 74 Q30 30 50 56 T82 48 Q100 40 96 76 Q92 98 66 90" stroke="#FF4DFF" stroke-width="16" opacity=".28"/>
<path d="M18 74 Q30 30 50 56 T82 48 Q100 40 96 76 Q92 98 66 90" stroke="#FF4DFF" stroke-width="8"/>
<path d="M18 74 Q30 30 50 56 T82 48 Q100 40 96 76 Q92 98 66 90" stroke="#fff" stroke-width="3"/>
<path d="M26 30 Q40 16 56 26" stroke="#2EE6FF" stroke-width="14" opacity=".28"/><path d="M26 30 Q40 16 56 26" stroke="#2EE6FF" stroke-width="7"/><path d="M26 30 Q40 16 56 26" stroke="#fff" stroke-width="2.5"/></g>
<path d="${A.starPath(92, 24, 10, 4)}" fill="#FFE14D"/><circle cx="30" cy="96" r="4" fill="#3DFF6E"/></svg>`;

  TW.registerScene('glow', {
    init: init,
    enter: function () { fit(); requestAnimationFrame(fit); },
    leave: function () {
      strokes.clear(); schedule();
      if (dance) finish();
    }
  });
})();
