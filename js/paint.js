// Scene 1: Painting studio — finger painting, brush sizes, magic brushes, eraser, a sticker book, a helper pup.
(function () {
  const A = TW.art, I = A.icons, O = A.O, sp = A.starPath, NS = A.NS;
  const COLORS = ['#FF4D4D', '#FF9F1C', '#FFD93D', '#4CC96B', '#2EC4B6', '#3FA7FF', '#A86BFF', '#FF7AC6', '#9B5E35', '#333333', '#FFFFFF'];
  const SIZES = [7, 16, 32];
  const NAMES = { '#FF4D4D': 'Red!', '#FF9F1C': 'Orange!', '#FFD93D': 'Yellow!', '#4CC96B': 'Green!', '#2EC4B6': 'Teal!', '#3FA7FF': 'Blue!',
    '#A86BFF': 'Purple!', '#FF7AC6': 'Pink!', '#9B5E35': 'Brown!', '#333333': 'Black!', '#FFFFFF': 'White!' };
  const TRAIL_EVERY = 70; // screen px of stroke between trail sparkles
  const PUP_LINES = ['Paint with me!', 'Beautiful!', 'More colors!', 'I love it!'];
  const st = `stroke="${O}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;

  // Sticker book: name -> [svg (with width/height so canvas can draw it), aspect, spoken name]
  function sq(inner) { return `<svg ${NS} viewBox="0 0 200 200" width="200" height="200">${inner}</svg>`; }
  const STICKERS = {
    sister: [A.pup('sister'), 1.2, 'Big sister!'], baby: [A.pup('baby'), 1.2, 'Baby pup!'],
    mum: [A.pup('mum'), 1.2, 'Mummy!'], dad: [A.pup('dad'), 1.2, 'Daddy!'],
    heart: [A.heartSvg('#FF5A8A'), 1, 'Heart!'], star: [A.starSvg('#FFD93D'), 1, 'Star!'],
    sun: [sq(`<g stroke="#FFB000" stroke-width="12" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M${100 + Math.cos(a * Math.PI / 180) * 66} ${100 + Math.sin(a * Math.PI / 180) * 66} L${100 + Math.cos(a * Math.PI / 180) * 90} ${100 + Math.sin(a * Math.PI / 180) * 90}"/>`).join('')}</g><circle cx="100" cy="100" r="54" fill="#FFD93D" ${st}/><circle cx="82" cy="92" r="6" fill="${O}"/><circle cx="118" cy="92" r="6" fill="${O}"/><path d="M80 114 Q100 130 120 114" fill="none" ${st}/>`), 1, 'Sunshine!'],
    flower: [sq([0, 60, 120, 180, 240, 300].map(a => `<circle cx="${100 + Math.cos(a * Math.PI / 180) * 44}" cy="${90 + Math.sin(a * Math.PI / 180) * 44}" r="32" fill="#FF7AC6" ${st}/>`).join('') + `<circle cx="100" cy="90" r="28" fill="#FFD93D" ${st}/><path d="M100 150 V196" stroke="#3DAA5C" stroke-width="10"/>`), 1, 'Flower!'],
    rainbow: [sq(['#FF6B6B', '#FFA94D', '#FFE066', '#8CE99A', '#74C0FC', '#B197FC'].map((c, i) => `<path d="M${16 + i * 13} 150 A${84 - i * 13} ${84 - i * 13} 0 0 1 ${184 - i * 13} 150" fill="none" stroke="${c}" stroke-width="14"/>`).join('') + `<ellipse cx="34" cy="156" rx="30" ry="18" fill="#fff" ${st}/><ellipse cx="166" cy="156" rx="30" ry="18" fill="#fff" ${st}/>`), 1, 'Rainbow!'],
    butterfly: [sq(`<ellipse cx="62" cy="80" rx="46" ry="54" fill="#B98CFF" ${st}/><ellipse cx="138" cy="80" rx="46" ry="54" fill="#B98CFF" ${st}/><ellipse cx="72" cy="146" rx="30" ry="32" fill="#7FD6FF" ${st}/><ellipse cx="128" cy="146" rx="30" ry="32" fill="#7FD6FF" ${st}/><ellipse cx="100" cy="110" rx="11" ry="56" fill="${O}"/>`), 1, 'Butterfly!'],
    fish: [sq(`<path d="M30 100 Q90 30 150 100 Q90 170 30 100 Z" fill="#FF9F45" ${st}/><path d="M146 100 L190 66 L190 134 Z" fill="#FF9F45" ${st}/><circle cx="70" cy="90" r="9" fill="${O}"/><path d="M92 70 Q100 100 92 130" fill="none" ${st}/>`), 1, 'Fishy!'],
    balloon: [sq(`<path d="M100 150 Q90 170 104 196" fill="none" stroke="${O}" stroke-width="4"/><ellipse cx="100" cy="80" rx="58" ry="70" fill="#FF5A6E" ${st}/><path d="M92 148 L108 148 L100 160 Z" fill="#FF5A6E" ${st}/><ellipse cx="76" cy="56" rx="12" ry="20" fill="#fff" opacity=".6"/>`), 1, 'Balloon!'],
    cake: [sq(`<rect x="34" y="100" width="132" height="76" rx="12" fill="#FFB3D9" ${st}/><path d="M34 118 Q56 136 78 118 Q100 136 122 118 Q144 136 166 118" fill="none" stroke="#fff" stroke-width="10"/><rect x="94" y="54" width="12" height="46" fill="#7FD6FF" ${st}/><path d="M100 26 Q114 44 100 54 Q86 44 100 26 Z" fill="#FFB347" ${st}/>`), 1, 'Birthday cake!']
  };
  const KEYS = Object.keys(STICKERS);

  let trail = 0, hue = 0, pupLine = 0;
  let el, wrap, canvas, ctx, toolbar, tray, rect = null, dpr = 1, fitted = false;
  let color = '#3FA7FF', size = SIZES[1], mode = 'paint', brush = 'plain', sticker = 'sister';
  const strokes = new Map();
  const imgs = {};

  function init() {
    el = document.getElementById('paint');
    KEYS.forEach(function (k) {
      const im = new Image();
      im.src = A.svgUrl(STICKERS[k][0]);
      imgs[k] = { img: im, ratio: STICKERS[k][1] };
    });

    el.innerHTML = `
<div class="scene-top"><button class="rbtn back" data-back aria-label="Back to home">${I.back}</button>
<div class="grow"><button class="helper-pup" aria-label="Helper pup">${A.pup('sister')}</button></div>
<button class="rbtn done-btn" id="pDone" aria-label="All done">${A.starSvg('#FFD93D')}</button><button class="rbtn" id="pClear" aria-label="Clear the page">${I.clear}</button></div>
<div class="work"><div class="canvas-wrap"><canvas></canvas></div>
<div class="toolbar scrolly">
  <div class="tgroup">${COLORS.map(c => `<button class="blob" data-color="${c}" style="--c:${c}" aria-label="Paint color"></button>`).join('')}</div>
  <div class="tgroup">${SIZES.map(s => `<button class="tool size" data-size="${s}" aria-label="Brush size"><span style="width:${s + 6}px;height:${s + 6}px"></span></button>`).join('')}
    <button class="tool" data-brush="rainbow" aria-label="Rainbow brush"><span class="rainbow-dot"></span></button>
    <button class="tool" data-brush="glitter" aria-label="Glitter brush">${A.starSvg('#FFD93D')}</button>
    <button class="tool" data-eraser aria-label="Eraser">${I.eraser}</button>
    <button class="tool" data-book aria-label="Sticker book"><img alt="" src="${imgs[sticker].img.src}"></button></div>
</div></div>
<div class="sticker-tray"><div class="tray-card">${KEYS.map(k => `<button class="tool sticker" data-sticker="${k}" aria-label="Sticker"><img alt="" src="${imgs[k].img.src}"></button>`).join('')}</div></div>`;

    wrap = el.querySelector('.canvas-wrap');
    canvas = el.querySelector('canvas');
    ctx = canvas.getContext('2d');
    toolbar = el.querySelector('.toolbar');
    tray = el.querySelector('.sticker-tray');

    toolbar.addEventListener('click', onTool);
    tray.addEventListener('click', function (e) {
      const b = e.target.closest('.sticker');
      if (b) {
        sticker = b.dataset.sticker; mode = 'sticker';
        toolbar.querySelector('[data-book] img').src = imgs[sticker].img.src;
        TW.sound.boing(); TW.voice.say(STICKERS[sticker][2]);
        updateUI();
      }
      tray.classList.remove('open');
    });
    el.querySelector('#pClear').addEventListener('click', function () {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      wrap.classList.remove('framed');
      TW.sound.swish(); TW.voice.say('Clean page!');
      const c = TW.fx.center(wrap);
      TW.fx.burst(c.x, c.y, { count: 14 });
    });
    el.querySelector('#pDone').addEventListener('click', function () {
      TW.fx.bounce(wrap, 'framed-pop');
      wrap.classList.add('framed');
      hopPup();
      TW.celebrate('What a beautiful painting!');
    });
    el.querySelector('.helper-pup').addEventListener('click', function () {
      hopPup();
      TW.sound.boing();
      TW.voice.say(PUP_LINES[pupLine++ % PUP_LINES.length]);
    });

    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    window.addEventListener('resize', function () { if (el.classList.contains('active')) fit(); });
    updateUI();
  }

  function hopPup() { TW.fx.bounce(el.querySelector('.helper-pup'), 'sqhop'); }

  function onTool(e) {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.color) { color = b.dataset.color; mode = 'paint'; brush = 'plain'; TW.sound.pop(); TW.voice.say(NAMES[color]); }
    else if (b.dataset.size) { size = +b.dataset.size; if (mode === 'sticker') mode = 'paint'; TW.sound.pop(); TW.voice.say(['Thin!', 'Medium!', 'Big!'][SIZES.indexOf(size)]); }
    else if (b.dataset.brush) { brush = b.dataset.brush; mode = 'paint'; TW.sound.sparkle(); TW.voice.say(brush === 'rainbow' ? 'Rainbow brush!' : 'Glitter brush!'); }
    else if ('eraser' in b.dataset) { mode = 'erase'; TW.sound.pop(); TW.voice.say('Eraser!'); }
    else if ('book' in b.dataset) { tray.classList.add('open'); TW.sound.flutter(); TW.voice.say('Sticker book!'); }
    TW.fx.bounce(b, 'pressed');
    updateUI();
  }

  function updateUI() {
    toolbar.querySelectorAll('.blob').forEach(b => b.classList.toggle('sel', mode === 'paint' && brush === 'plain' && b.dataset.color === color));
    toolbar.querySelectorAll('.size').forEach(b => b.classList.toggle('sel', mode !== 'sticker' && +b.dataset.size === size));
    toolbar.querySelectorAll('[data-brush]').forEach(b => b.classList.toggle('sel', mode === 'paint' && brush === b.dataset.brush));
    toolbar.querySelector('[data-eraser]').classList.toggle('sel', mode === 'erase');
    toolbar.querySelector('[data-book]').classList.toggle('sel', mode === 'sticker');
    tray.querySelectorAll('.sticker').forEach(b => b.classList.toggle('sel', b.dataset.sticker === sticker));
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
    for (const ev of evs) {
      const p = pt(ev);
      draw(prev, p);
      trail += Math.hypot(p.x - prev.x, p.y - prev.y) / dpr;
      prev = p;
    }
    strokes.set(e.pointerId, prev);
    if (trail > TRAIL_EVERY && mode === 'paint') {
      trail = 0;
      TW.fx.twinkle(e.clientX, e.clientY, brush === 'rainbow' ? `hsl(${hue},90%,60%)` : color);
    }
  }

  function up(e) { strokes.delete(e.pointerId); }

  function draw(a, b) {
    if (mode === 'paint' && brush === 'glitter') {
      // Glitter: a sprinkle of little bright dots along the path.
      const n = Math.max(1, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / (6 * dpr)));
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
        for (let k = 0; k < 2; k++) {
          ctx.fillStyle = `hsl(${Math.random() * 360},95%,62%)`;
          ctx.beginPath();
          ctx.arc(x + (Math.random() - 0.5) * size * 2 * dpr, y + (Math.random() - 0.5) * size * 2 * dpr, (1.5 + Math.random() * 2.5) * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return;
    }
    if (mode === 'paint' && brush === 'rainbow') hue = (hue + 5) % 360;
    ctx.strokeStyle = mode === 'erase' ? '#fff' : (brush === 'rainbow' ? `hsl(${hue},90%,60%)` : color);
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
    TW.voice.say(STICKERS[sticker][2]);
    hopPup();
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
    leave: function () { strokes.clear(); if (tray) tray.classList.remove('open'); }
  });
})();
