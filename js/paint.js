// Scene 1: Painting studio — finger painting, brush sizes, eraser, puppy stickers.
(function () {
  const A = TW.art, I = A.icons;
  const COLORS = ['#FF4D4D', '#FF9F1C', '#FFD93D', '#4CC96B', '#3FA7FF', '#A86BFF', '#FF7AC6', '#9B5E35', '#333333'];
  const SIZES = [7, 16, 32];
  const STICKERS = ['sister', 'baby', 'mum', 'dad', 'heart'];

  let el, wrap, canvas, ctx, toolbar, rect = null, dpr = 1, fitted = false;
  let color = COLORS[4], size = SIZES[1], mode = 'paint', sticker = null;
  const strokes = new Map();
  const imgs = {};

  function init() {
    el = document.getElementById('paint');
    STICKERS.forEach(function (k) {
      const im = new Image();
      im.src = A.svgUrl(k === 'heart' ? A.heartSvg('#FF5A8A') : A.pup(k));
      imgs[k] = { img: im, ratio: k === 'heart' ? 1 : 1.2 };
    });

    el.innerHTML = `
<div class="scene-top"><button class="rbtn back" data-back aria-label="Back to home">${I.back}</button><div class="grow"></div><button class="rbtn" id="pClear" aria-label="Clear the page">${I.clear}</button></div>
<div class="work"><div class="canvas-wrap"><canvas></canvas></div>
<div class="toolbar scrolly">
  <div class="tgroup">${COLORS.map(c => `<button class="blob" data-color="${c}" style="--c:${c}" aria-label="Paint color"></button>`).join('')}</div>
  <div class="tgroup">${SIZES.map(s => `<button class="tool size" data-size="${s}" aria-label="Brush size"><span style="width:${s + 6}px;height:${s + 6}px"></span></button>`).join('')}<button class="tool" data-eraser aria-label="Eraser">${I.eraser}</button></div>
  <div class="tgroup">${STICKERS.map(k => `<button class="tool sticker" data-sticker="${k}" aria-label="Sticker"><img alt="" src="${imgs[k].img.src}"></button>`).join('')}</div>
</div></div>`;

    wrap = el.querySelector('.canvas-wrap');
    canvas = el.querySelector('canvas');
    ctx = canvas.getContext('2d');
    toolbar = el.querySelector('.toolbar');

    toolbar.addEventListener('click', onTool);
    el.querySelector('#pClear').addEventListener('click', function () {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      TW.sound.swish();
      const c = TW.fx.center(wrap);
      TW.fx.burst(c.x, c.y, { count: 14 });
    });

    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    window.addEventListener('resize', function () { if (el.classList.contains('active')) fit(); });
    updateUI();
  }

  function onTool(e) {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.color) { color = b.dataset.color; mode = 'paint'; TW.sound.pop(); }
    else if (b.dataset.size) { size = +b.dataset.size; if (mode === 'sticker') mode = 'paint'; TW.sound.pop(); }
    else if ('eraser' in b.dataset) { mode = 'erase'; TW.sound.pop(); }
    else if (b.dataset.sticker) { mode = 'sticker'; sticker = b.dataset.sticker; TW.sound.boing(); }
    TW.fx.bounce(b, 'pressed');
    updateUI();
  }

  function updateUI() {
    toolbar.querySelectorAll('.blob').forEach(b => b.classList.toggle('sel', mode === 'paint' && b.dataset.color === color));
    toolbar.querySelectorAll('.size').forEach(b => b.classList.toggle('sel', mode !== 'sticker' && +b.dataset.size === size));
    toolbar.querySelector('[data-eraser]').classList.toggle('sel', mode === 'erase');
    toolbar.querySelectorAll('.sticker').forEach(b => b.classList.toggle('sel', mode === 'sticker' && b.dataset.sticker === sticker));
    toolbar.style.setProperty('--cur', mode === 'erase' ? '#d8d8d8' : color);
  }

  function pt(e) { return { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr }; }

  function down(e) {
    e.preventDefault();
    rect = canvas.getBoundingClientRect();
    const p = pt(e);
    if (mode === 'sticker') { stamp(p); return; }
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    strokes.set(e.pointerId, p);
    draw(p, p);
    if (strokes.size === 1) TW.sound.softPop();
  }

  function move(e) {
    const last = strokes.get(e.pointerId);
    if (!last) return;
    const list = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
    const evs = list.length ? list : [e];
    let prev = last;
    for (const ev of evs) { const p = pt(ev); draw(prev, p); prev = p; }
    strokes.set(e.pointerId, prev);
  }

  function up(e) { strokes.delete(e.pointerId); }

  function draw(a, b) {
    ctx.strokeStyle = mode === 'erase' ? '#fff' : color;
    ctx.lineWidth = (mode === 'erase' ? size * 1.8 : size) * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x + 0.01, b.y);
    ctx.stroke();
  }

  function stamp(p) {
    const s = imgs[sticker];
    if (!s || !s.img.complete) return;
    const w = 120 * dpr, h = w * s.ratio;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((Math.random() - 0.5) * 0.5);
    ctx.drawImage(s.img, -w / 2, -h / 2, w, h);
    ctx.restore();
    TW.sound.pop();
    TW.fx.burst(rect.left + p.x / dpr, rect.top + p.y / dpr, { count: 6 });
  }

  // Match the canvas to its box, keeping whatever is already painted.
  function fit() {
    const r = wrap.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (fitted && canvas.width === w && canvas.height === h) return;
    let tmp = null;
    if (fitted) {
      tmp = document.createElement('canvas');
      tmp.width = canvas.width; tmp.height = canvas.height;
      tmp.getContext('2d').drawImage(canvas, 0, 0);
    }
    canvas.width = w; canvas.height = h;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    if (tmp) ctx.drawImage(tmp, 0, 0);
    fitted = true;
  }

  TW.registerScene('paint', {
    init: init,
    enter: function () { fit(); requestAnimationFrame(fit); },
    leave: function () { strokes.clear(); }
  });
})();
