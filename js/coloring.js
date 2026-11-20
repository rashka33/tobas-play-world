// Scene 2: Coloring pages — tap a color, tap a region to fill it, or draw with the crayon on top.
(function () {
  const A = TW.art, I = A.icons;
  const COLORS = ['#FF4D4D', '#FF9F1C', '#FFD93D', '#4CC96B', '#3FA7FF', '#A86BFF', '#FF7AC6', '#9B5E35', '#8FD3FF', '#333333'];

  // ----- picture building blocks (viewBox 0 0 400 400) -----
  const SKY = '<rect class="rg" x="3" y="3" width="394" height="394" rx="22"/>';
  const GROUND = '<path class="rg" d="M3 318 Q200 284 397 318 V375 Q397 397 375 397 H25 Q3 397 3 375 Z"/>';
  function sun(cx, cy, r) {
    let d = '';
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      d += `M${(cx + Math.cos(a) * (r + 8)).toFixed(1)} ${(cy + Math.sin(a) * (r + 8)).toFixed(1)} L${(cx + Math.cos(a) * (r + 22)).toFixed(1)} ${(cy + Math.sin(a) * (r + 22)).toFixed(1)} `;
    }
    return `<path class="dl" d="${d}"/><circle class="rg" cx="${cx}" cy="${cy}" r="${r}"/>`;
  }
  function cloud(x, y) {
    return `<path class="rg" d="M${x} ${y} q-22 0 -22 -18 q0 -18 20 -18 q6 -18 28 -16 q18 -14 36 2 q22 -2 24 18 q16 4 12 20 q-2 12 -18 12 Z"/>`;
  }
  function flower(x, y) {
    let p = `<path class="dl" d="M${x} ${y + 10} V${y + 40}"/>`;
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
      p += `<circle class="rg" cx="${(x + Math.cos(a) * 11).toFixed(1)}" cy="${(y + Math.sin(a) * 11).toFixed(1)}" r="8"/>`;
    }
    return p + `<circle class="rg" cx="${x}" cy="${y}" r="7"/>`;
  }
  function pupRegions(tx, ty, s, small) {
    const br = small ? 46 : 56, by = small ? 180 : 172, hr = small ? 56 : 58, t = 100 + br;
    return `<g transform="translate(${tx} ${ty}) scale(${s})">
<path class="rg" d="M${t - 10} ${by + 8} Q${t + 36} ${by - 6} ${t + 30} ${by - 50} Q${t + 20} ${by - 54} ${t + 16} ${by - 44} Q${t + 18} ${by - 14} ${t - 14} ${by - 6} Z"/>
<circle class="rg" cx="100" cy="${by}" r="${br}"/>
<ellipse class="rg" cx="100" cy="${by + 10}" rx="${br * 0.58}" ry="${br * 0.66}"/>
<ellipse class="rg" cx="${100 - br * 0.52}" cy="${by + br - 4}" rx="20" ry="11"/>
<ellipse class="rg" cx="${100 + br * 0.52}" cy="${by + br - 4}" rx="20" ry="11"/>
<circle class="rg" cx="100" cy="88" r="${hr}"/>
<ellipse class="rg" cx="46" cy="94" rx="20" ry="40" transform="rotate(18 46 94)"/>
<ellipse class="rg" cx="154" cy="94" rx="20" ry="40" transform="rotate(-18 154 94)"/>
<ellipse class="rg" cx="100" cy="112" rx="30" ry="22"/>
<circle class="dk" cx="78" cy="84" r="8"/><circle class="dk" cx="122" cy="84" r="8"/>
<ellipse class="dk" cx="100" cy="102" rx="11" ry="8"/>
<path class="dl" d="M89 114 Q100 124 111 114"/>
${small ? '<path class="dl" d="M92 36 Q94 18 102 30 Q106 16 112 32"/>' : ''}
</g>`;
  }
  function wrapSvg(inner) { return `<svg ${A.NS} viewBox="0 0 400 400">${inner}</svg>`; }

  const PICTURES = {
    family: wrapSvg(SKY + cloud(40, 84) + GROUND +
      '<path class="rg" d="M300 122 C270 102 258 88 258 72 C258 58 268 50 280 50 C289 50 296 55 300 62 C304 55 311 50 320 50 C332 50 342 58 342 72 C342 88 330 102 300 122 Z"/>' +
      pupRegions(18, 96, 1.2, false) + pupRegions(232, 188, 0.8, true)),
    house: wrapSvg(SKY + sun(330, 70, 34) + cloud(60, 104) + GROUND +
      '<rect class="rg" x="246" y="96" width="34" height="64"/>' +
      '<rect class="rg" x="92" y="180" width="216" height="150" rx="4"/>' +
      '<path class="rg" d="M68 186 L200 82 L332 186 Z"/>' +
      '<rect class="rg" x="176" y="248" width="52" height="82" rx="8"/><circle class="dk" cx="216" cy="292" r="5"/>' +
      '<rect class="rg" x="110" y="212" width="50" height="46" rx="4"/><path class="dl" d="M135 212 V258 M110 235 H160"/>' +
      '<rect class="rg" x="242" y="212" width="50" height="46" rx="4"/><path class="dl" d="M267 212 V258 M242 235 H292"/>' +
      flower(44, 334) + flower(356, 336)),
    tree: wrapSvg(SKY + sun(68, 68, 30) + cloud(262, 82) + GROUND +
      '<path class="rg" d="M178 340 Q186 290 182 230 L218 230 Q214 290 222 340 Z"/>' +
      '<circle class="rg" cx="140" cy="200" r="62"/><circle class="rg" cx="260" cy="200" r="62"/><circle class="rg" cx="200" cy="140" r="78"/>' +
      '<circle class="rg" cx="150" cy="210" r="13"/><circle class="rg" cx="236" cy="132" r="13"/><circle class="rg" cx="262" cy="216" r="13"/><circle class="rg" cx="176" cy="110" r="13"/><circle class="rg" cx="206" cy="180" r="13"/>' +
      flower(70, 334) + flower(334, 338)),
    car: wrapSvg(SKY + sun(330, 64, 30) + cloud(44, 92) +
      '<path class="rg" d="M3 300 H397 V375 Q397 397 375 397 H25 Q3 397 3 375 Z"/><path class="dl" d="M30 360 H70 M120 360 H160 M210 360 H250 M300 360 H340"/>' +
      '<path class="rg" d="M110 208 L142 140 L262 140 L298 208 Z"/>' +
      '<path class="rg" d="M126 204 L150 152 H196 V204 Z"/><path class="rg" d="M208 152 H254 L280 204 H208 Z"/>' +
      '<path class="rg" d="M46 290 V236 Q48 210 86 206 H312 Q352 210 356 240 V290 Z"/>' +
      '<path class="dl" d="M200 212 V284 M212 232 H230"/>' +
      '<circle class="rg" cx="340" cy="250" r="11"/><rect class="rg" x="50" y="240" width="12" height="22" rx="3"/>' +
      '<circle class="rg" cx="118" cy="292" r="36"/><circle class="rg" cx="118" cy="292" r="14"/>' +
      '<circle class="rg" cx="286" cy="292" r="36"/><circle class="rg" cx="286" cy="292" r="14"/>')
  };
  const IDS = Object.keys(PICTURES);

  let el, stage, toolbar, color = COLORS[0], mode = 'fill', current = IDS[0], dpr = 1, side = 0;
  const pics = {};
  const strokes = new Map();

  function init() {
    el = document.getElementById('coloring');
    el.innerHTML = `
<div class="scene-top"><button class="rbtn back" data-back aria-label="Back to home">${I.back}</button>
<div class="grow thumbs">${IDS.map(id => `<button class="thumb" data-pic="${id}" aria-label="Choose picture">${PICTURES[id]}</button>`).join('')}</div></div>
<div class="work"><div class="cstage">${IDS.map(id => `<div class="cpic" data-pic="${id}">${PICTURES[id]}<canvas></canvas></div>`).join('')}</div>
<div class="toolbar scrolly">
  <div class="tgroup">${COLORS.map(c => `<button class="blob" data-color="${c}" style="--c:${c}" aria-label="Color"></button>`).join('')}</div>
  <div class="tgroup"><button class="tool mode" data-mode="fill" aria-label="Fill">${I.bucket}</button><button class="tool mode" data-mode="draw" aria-label="Crayon">${I.crayon}</button><button class="tool" data-clear aria-label="Clear">${I.clear}</button></div>
</div></div>`;
    stage = el.querySelector('.cstage');
    toolbar = el.querySelector('.toolbar');

    el.querySelectorAll('.cpic').forEach(function (box) {
      const cv = box.querySelector('canvas');
      pics[box.dataset.pic] = { box: box, canvas: cv, ctx: cv.getContext('2d'), fitted: false };
      cv.addEventListener('pointerdown', drawDown);
      cv.addEventListener('pointermove', drawMove);
      cv.addEventListener('pointerup', drawUp);
      cv.addEventListener('pointercancel', drawUp);
    });

    stage.addEventListener('pointerdown', function (e) {
      if (mode !== 'fill') return;
      const r = e.target.closest && e.target.closest('.rg');
      if (!r) return;
      e.preventDefault();
      r.style.fill = color;
      TW.sound.pop();
      TW.fx.burst(e.clientX, e.clientY, { count: 5, colors: [color, '#FFD93D', '#ffffff'] });
    });

    el.querySelector('.thumbs').addEventListener('click', function (e) {
      const b = e.target.closest('.thumb');
      if (!b || b.dataset.pic === current) return;
      current = b.dataset.pic;
      TW.sound.boing();
      showPic();
    });

    toolbar.addEventListener('click', function (e) {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.color) { color = b.dataset.color; TW.sound.pop(); }
      else if (b.dataset.mode) { mode = b.dataset.mode; TW.sound.pop(); }
      else if ('clear' in b.dataset) {
        const p = pics[current];
        p.box.querySelectorAll('.rg').forEach(r => { r.style.fill = ''; });
        p.ctx.clearRect(0, 0, p.canvas.width, p.canvas.height);
        TW.sound.swish();
        const c = TW.fx.center(p.box);
        TW.fx.burst(c.x, c.y, { count: 14 });
      }
      TW.fx.bounce(b, 'pressed');
      updateUI();
    });

    window.addEventListener('resize', function () { if (el.classList.contains('active')) layout(); });
    showPic();
  }

  function updateUI() {
    toolbar.querySelectorAll('.blob').forEach(b => b.classList.toggle('sel', b.dataset.color === color));
    toolbar.querySelectorAll('.mode').forEach(b => b.classList.toggle('sel', b.dataset.mode === mode));
    toolbar.style.color = color;
    stage.classList.toggle('draw', mode === 'draw');
    el.querySelectorAll('.thumb').forEach(b => b.classList.toggle('sel', b.dataset.pic === current));
  }

  function showPic() {
    IDS.forEach(id => pics[id].box.classList.toggle('on', id === current));
    updateUI();
    layout();
  }

  // Keep the picture square and the crayon canvas exactly on top of it.
  function layout() {
    const r = stage.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    side = Math.floor(Math.min(r.width, r.height) - 6);
    IDS.forEach(id => { pics[id].box.style.width = side + 'px'; pics[id].box.style.height = side + 'px'; });
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const p = pics[current], px = Math.round(side * dpr);
    if (p.fitted && p.canvas.width === px) return;
    let tmp = null;
    if (p.fitted) {
      tmp = document.createElement('canvas');
      tmp.width = p.canvas.width; tmp.height = p.canvas.height;
      tmp.getContext('2d').drawImage(p.canvas, 0, 0);
    }
    p.canvas.width = px; p.canvas.height = px;
    if (tmp) p.ctx.drawImage(tmp, 0, 0, px, px);
    p.fitted = true;
  }

  function cpt(e, cv) {
    const r = cv.getBoundingClientRect();
    return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height };
  }
  function drawDown(e) {
    e.preventDefault();
    try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
    const p = cpt(e, e.target);
    strokes.set(e.pointerId, p);
    line(e.target, p, p);
    if (strokes.size === 1) TW.sound.softPop();
  }
  function drawMove(e) {
    const last = strokes.get(e.pointerId);
    if (!last) return;
    const p = cpt(e, e.target);
    line(e.target, last, p);
    strokes.set(e.pointerId, p);
  }
  function drawUp(e) { strokes.delete(e.pointerId); }
  function line(cv, a, b) {
    const c = cv.getContext('2d');
    c.strokeStyle = color;
    c.lineWidth = 12 * cv.width / side;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x + 0.01, b.y);
    c.stroke();
  }

  TW.registerScene('coloring', {
    init: init,
    enter: function () { layout(); requestAnimationFrame(layout); },
    leave: function () { strokes.clear(); }
  });
})();
