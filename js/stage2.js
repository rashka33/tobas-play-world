// Stage 2 (Nov 27): opening animation, village-path home, growing-world
// rewards, the cat as in-game guide, and the credits screen.
// Speech rule holds: this file never speaks except through existing pack
// lines via TW.voice.say (in practice it stays silent — visuals only).
window.TW = window.TW || {};
(function () {
  const O = '#4a2e1c';
  const CAT = 'assets/cat/';

  // The 16 games, in hub order, each with its stepping-stone spot (% of world).
  const STONES = [
    { scene: 'paint', x: 5, y: 64 }, { scene: 'coloring', x: 12, y: 76 },
    { scene: 'dressup', x: 19, y: 62 }, { scene: 'kitchen', x: 26, y: 75 },
    { scene: 'wizard', x: 33, y: 60 }, { scene: 'space', x: 40, y: 73 },
    { scene: 'vanity', x: 47, y: 59 }, { scene: 'lab', x: 54, y: 71 },
    { scene: 'dragon', x: 61, y: 58 }, { scene: 'animals', x: 68, y: 70 },
    { scene: 'whosays', x: 75, y: 57 }, { scene: 'bubbles', x: 82, y: 69 },
    { scene: 'sorting', x: 88, y: 57 }, { scene: 'helper', x: 93, y: 68 },
    { scene: 'glow', x: 97, y: 56 }, { scene: 'room3d', x: 98.5, y: 70 }
  ];
  const W = 3000, H = 700; // village viewBox

  function seeded(seed) {
    let s = seed;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  // ---------- village scenery (flat style, brown outline, like js/art.js) ----------
  function acacia(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})" stroke="${O}" stroke-width="5" stroke-linecap="round">
      <path d="M0 0 L-6 -70 M0 -40 L-44 -78 M0 -48 L40 -84" fill="none" stroke="#8A5A33"/>
      <ellipse cx="-52" cy="-88" rx="58" ry="17" fill="#3FA34D"/><ellipse cx="8" cy="-102" rx="72" ry="20" fill="#4CC25E"/><ellipse cx="62" cy="-86" rx="52" ry="15" fill="#3FA34D"/>
    </g>`;
  }
  function aqal(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})" stroke="${O}" stroke-width="5" stroke-linejoin="round">
      <path d="M-95 0 A95 78 0 0 1 95 0 Z" fill="#E8C08A"/>
      <path d="M-95 0 A95 78 0 0 1 95 0 M-64 -52 A78 60 0 0 1 64 -52 M-34 -70 A60 40 0 0 1 34 -70" fill="none" stroke="#C99A5B" stroke-width="4"/>
      <path d="M0 -78 L0 -104 M-16 -74 L-30 -94 M16 -74 L30 -94" stroke="#8A5A33" stroke-width="6"/>
      <path d="M-20 0 V-38 A20 16 0 0 1 20 -38 V0 Z" fill="#7A4A2C"/>
      <circle cx="34" cy="-30" r="10" fill="#FFF3D6"/>
    </g>`;
  }
  function market(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})" stroke="${O}" stroke-width="5" stroke-linejoin="round">
      <path d="M-100 0 V-110 M100 0 V-110" stroke="#8A5A33" stroke-width="9"/>
      <path d="M-125 -108 L125 -108 L100 -142 L-100 -142 Z" fill="#FF6B6B"/>
      <path d="M-84 -142 L-58 -108 L-30 -142 L-4 -108 L22 -142 L48 -108 L76 -142 L100 -108" fill="none" stroke="#fff" stroke-width="10"/>
      <rect x="-95" y="-52" width="190" height="52" rx="8" fill="#C8894E"/>
      <path d="M-95 -26 H95" stroke="#9C6B33" stroke-width="5"/>
      <g stroke-width="3.5"><circle cx="-60" cy="-66" r="14" fill="#FF9F1C"/><circle cx="-30" cy="-68" r="14" fill="#FF6B6B"/><circle cx="2" cy="-66" r="14" fill="#FFD93D"/><circle cx="34" cy="-68" r="14" fill="#FF6B6B"/><circle cx="64" cy="-66" r="14" fill="#FF9F1C"/></g>
    </g>`;
  }
  function farm(x, y, s) {
    let rows = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
      rows += `<path d="M${-105 + c * 36} ${-14 - r * 22} q7 -16 14 0 q7 -16 14 0" fill="none" stroke="#3FA34D" stroke-width="6" stroke-linecap="round"/>`;
    }
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-125" y="-78" width="250" height="82" rx="16" fill="#B07A50" stroke="${O}" stroke-width="5"/>
      ${rows}
      <path d="M-125 -78 L-138 -96 M125 -78 L138 -96 M-138 -96 H138" stroke="#8A5A33" stroke-width="6" fill="none" stroke-linecap="round"/>
    </g>`;
  }
  function villageSvg() {
    const rnd = seeded(42);
    let tufts = '', flowers = '';
    for (let i = 0; i < 46; i++) {
      const x = (rnd() * W).toFixed(0), y = (470 + rnd() * 210).toFixed(0);
      tufts += `<path d="M${x} ${y} q4 -18 9 -22 M${+x + 10} ${y} q-2 -16 -8 -20" stroke="#2F8F3A" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    }
    const fcols = ['#FF8CC8', '#FFD93D', '#fff', '#FF9F1C'];
    for (let i = 0; i < 26; i++) {
      const x = (rnd() * W).toFixed(0), y = (500 + rnd() * 180).toFixed(0), c = fcols[i % 4];
      flowers += `<g transform="translate(${x} ${y})"><circle r="5" fill="${c}"/><circle cx="-7" cy="-3" r="4" fill="${c}"/><circle cx="7" cy="-3" r="4" fill="${c}"/><circle r="2.4" fill="#FF8A3D"/></g>`;
    }
    const pts = STONES.map(s => `${(s.x / 100 * W).toFixed(0)},${(s.y / 100 * H).toFixed(0)}`).join(' ');
    const stones = STONES.map(s => {
      const cx = (s.x / 100 * W).toFixed(0), cy = (s.y / 100 * H + 46).toFixed(0);
      return `<ellipse cx="${cx}" cy="${cy}" rx="86" ry="24" fill="#E9DFC9" stroke="${O}" stroke-width="4"/><ellipse cx="${cx}" cy="${+cy - 5}" rx="66" ry="17" fill="#F7EFDB"/>`;
    }).join('');
    return `<svg class="village-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M0 470 Q400 400 900 452 T1900 442 T3000 458 V700 H0 Z" fill="#8FE388"/>
      <path d="M0 520 Q600 470 1300 512 T3000 505 V700 H0 Z" fill="#7ED957"/>
      ${acacia(180, 500, 1.1)}${acacia(1240, 478, 0.9)}${acacia(2260, 492, 1.15)}${acacia(2900, 480, 0.95)}
      ${aqal(430, 512, 1)}${aqal(1560, 500, 0.9)}${aqal(2620, 508, 1.05)}
      ${market(1010, 528, 1)}${farm(2010, 540, 1)}
      <polyline points="${pts}" fill="none" stroke="#F2D8A0" stroke-width="64" stroke-linecap="round" stroke-linejoin="round" opacity=".65"/>
      ${stones}${tufts}${flowers}
    </svg>`;
  }

  // ---------- growing-world items ----------
  const GROW = {
    flower: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 96 V58" stroke="#2F8F3A" stroke-width="6" stroke-linecap="round"/><path d="M50 76 Q32 70 30 56 Q46 58 50 70 Q54 58 70 56 Q68 70 50 76Z" fill="#4CC25E" stroke="${O}" stroke-width="3"/><g transform="translate(50 36)"><circle cx="0" cy="-15" r="11" fill="#FF8CC8" stroke="${O}" stroke-width="3"/><circle cx="14" cy="-5" r="11" fill="#FF8CC8" stroke="${O}" stroke-width="3"/><circle cx="9" cy="12" r="11" fill="#FF8CC8" stroke="${O}" stroke-width="3"/><circle cx="-9" cy="12" r="11" fill="#FF8CC8" stroke="${O}" stroke-width="3"/><circle cx="-14" cy="-5" r="11" fill="#FF8CC8" stroke="${O}" stroke-width="3"/><circle r="9" fill="#FFD93D" stroke="${O}" stroke-width="3"/></g></svg>`,
    tree: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke-linecap="round"><path d="M50 96 L46 52 M48 66 L26 44 M49 60 L72 40" stroke="#8A5A33" stroke-width="7" fill="none"/><ellipse cx="24" cy="38" rx="24" ry="9" fill="#3FA34D" stroke="${O}" stroke-width="3.5"/><ellipse cx="52" cy="28" rx="30" ry="11" fill="#4CC25E" stroke="${O}" stroke-width="3.5"/><ellipse cx="78" cy="38" rx="22" ry="8" fill="#3FA34D" stroke="${O}" stroke-width="3.5"/></g></svg>`,
    bird: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="${O}" stroke-width="3.5" stroke-linejoin="round"><ellipse cx="46" cy="58" rx="28" ry="20" fill="#7FD6FF"/><circle cx="70" cy="42" r="13" fill="#7FD6FF"/><path d="M82 42 L96 47 L82 52 Z" fill="#FF9F1C"/><path d="M38 52 Q22 30 8 40 Q24 44 28 58 Z" fill="#3FA7FF"/><circle cx="73" cy="40" r="2.6" fill="${O}" stroke="none"/><path d="M40 78 V90 M56 78 V90" stroke="#FF9F1C" stroke-width="4"/></g></svg>`,
    goat: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="${O}" stroke-width="3.5" stroke-linejoin="round"><ellipse cx="44" cy="56" rx="30" ry="19" fill="#FFF6E6"/><circle cx="76" cy="40" r="13" fill="#FFF6E6"/><path d="M68 30 Q60 16 50 20 M80 28 Q82 12 92 14" fill="none" stroke="#C9A86A" stroke-width="5" stroke-linecap="round"/><path d="M86 44 L96 40 L94 52 Z" fill="#FFF6E6"/><path d="M74 52 l3 8 l3 -8 Z" fill="#E8DCC4"/><circle cx="79" cy="38" r="2.4" fill="${O}" stroke="none"/><path d="M28 74 V90 M58 74 V90" stroke="${O}" stroke-width="4.5"/><path d="M15 48 q-8 -4 -6 -14" fill="none" stroke-width="5" stroke-linecap="round"/></g></svg>`,
    butterfly: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="${O}" stroke-width="3.5"><ellipse cx="30" cy="38" rx="17" ry="13" fill="#FF8CC8" transform="rotate(-24 30 38)"/><ellipse cx="70" cy="38" rx="17" ry="13" fill="#FF8CC8" transform="rotate(24 70 38)"/><ellipse cx="33" cy="64" rx="13" ry="10" fill="#C9A8FF" transform="rotate(20 33 64)"/><ellipse cx="67" cy="64" rx="13" ry="10" fill="#C9A8FF" transform="rotate(-20 67 64)"/><rect x="46" y="28" width="8" height="44" rx="4" fill="#4a2e1c" stroke="none"/><path d="M48 28 q-8 -12 -14 -13 M52 28 q8 -12 14 -13" fill="none" stroke-linecap="round"/></g></svg>`,
    bush: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="${O}" stroke-width="3.5"><circle cx="32" cy="66" r="20" fill="#3FA34D"/><circle cx="66" cy="62" r="24" fill="#4CC25E"/><circle cx="50" cy="48" r="20" fill="#57B84B"/></g><g fill="#FF6B6B"><circle cx="38" cy="52" r="4"/><circle cx="62" cy="44" r="4"/><circle cx="72" cy="64" r="4"/><circle cx="48" cy="66" r="4"/></g></svg>`
  };
  const GROW_ORDER = ['flower', 'tree', 'bird', 'goat', 'butterfly', 'bush'];
  const GROW_KEY = 'tw-village-v1', GROW_CAP = 60;

  function growLoad() {
    try { const a = JSON.parse(localStorage.getItem(GROW_KEY) || '[]'); return Array.isArray(a) ? a.filter(k => GROW[k]) : []; }
    catch (e) { return []; }
  }
  function growSave(a) { try { localStorage.setItem(GROW_KEY, JSON.stringify(a)); } catch (e) {} }

  let grownLayer = null;
  function growNode(kind, i) {
    const rnd = seeded(1000 + i * 131);
    const d = document.createElement('div');
    d.className = 'grown-item';
    d.dataset.kind = kind;
    d.style.left = (3 + rnd() * 93).toFixed(1) + '%';
    d.style.top = (64 + rnd() * 22).toFixed(1) + '%';
    const size = 62 + Math.floor(rnd() * 48);
    d.style.width = d.style.height = size + 'px';
    d.innerHTML = GROW[kind];
    return d;
  }
  function growRender() {
    if (!grownLayer) return;
    grownLayer.innerHTML = '';
    growLoad().forEach(function (k, i) { grownLayer.appendChild(growNode(k, i)); });
  }

  let lastGrowAt = 0, lastGrowScene = '';
  function grow() {
    const now = Date.now(), scene = TW.current ? TW.current() : '';
    if (now - lastGrowAt < 15000 && scene === lastGrowScene) return; // celebrations can repeat fast; the village grows steadily, not in bursts
    const items = growLoad();
    if (items.length >= GROW_CAP) return;
    lastGrowAt = now; lastGrowScene = scene;
    const kind = GROW_ORDER[items.length % GROW_ORDER.length];
    items.push(kind);
    growSave(items);
    if (grownLayer) {
      const node = growNode(kind, items.length - 1);
      node.classList.add('drop-in');
      grownLayer.appendChild(node);
      if (TW.current && TW.current() === 'hub') {
        const r = node.getBoundingClientRect();
        if (r.width) TW.fx.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 8 });
      }
    }
  }
  TW.village = { grow: grow, count: function () { return growLoad().length; }, render: growRender };

  // Every game's completion already funnels through TW.celebrate — grow there.
  const origCelebrate = TW.celebrate;
  TW.celebrate = function (line) { origCelebrate(line); grow(); };

  // ---------- village path home ----------
  function todayStone() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000) % STONES.length;
  }

  function buildVillage() {
    const scroll = document.querySelector('#hub .hub-scroll');
    const grid = document.querySelector('#hub .hub-grid');
    if (!scroll || !grid || scroll.querySelector('.village-world')) return;
    scroll.classList.add('village-scroll');
    const world = document.createElement('div');
    world.className = 'village-world';
    world.innerHTML = villageSvg() + '<div class="village-grown"></div>';
    scroll.insertBefore(world, grid);
    world.appendChild(grid);
    grid.classList.add('village-stones');
    const byScene = {};
    grid.querySelectorAll('.hub-btn').forEach(function (b) { byScene[b.dataset.scene] = b; });
    STONES.forEach(function (s) {
      const b = byScene[s.scene];
      if (!b) return;
      b.classList.add('stone-btn');
      b.style.left = s.x + '%';
      b.style.top = s.y + '%';
    });
    grownLayer = world.querySelector('.village-grown');
    growRender();
    // The cat waits on today's stone.
    const t = STONES[todayStone()];
    const cat = document.createElement('img');
    cat.className = 'village-cat';
    cat.src = CAT + 'wave.png';
    cat.alt = '';
    cat.style.left = t.x + '%';
    cat.style.top = t.y + '%';
    world.appendChild(cat);
    // Start the scroll where today's stone is (roughly centred).
    requestAnimationFrame(function () {
      const target = (t.x / 100) * world.scrollWidth - scroll.clientWidth / 2;
      scroll.scrollLeft = Math.max(0, target);
    });
  }

  // ---------- opening animation (~4s, tap to skip) ----------
  let openingEl = null, openingTimer = 0, openingDone = false;
  function finishOpening() {
    if (openingDone) return;
    openingDone = true;
    clearTimeout(openingTimer);
    if (!openingEl) return;
    openingEl.classList.add('done');
    const el = openingEl;
    setTimeout(function () { el.remove(); }, 420);
    openingEl = null;
  }
  function buildOpening() {
    const el = document.createElement('div');
    el.id = 'opening';
    el.innerHTML =
      '<div class="op-sun"></div>' +
      '<svg class="op-hills" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<path d="M0 190 Q250 120 520 175 T1000 165 V300 H0 Z" fill="#8FE388"/>' +
      '<path d="M0 235 Q320 180 640 225 T1000 220 V300 H0 Z" fill="#7ED957"/>' +
      '<ellipse cx="120" cy="238" rx="70" ry="15" fill="#E9DFC9"/><ellipse cx="330" cy="262" rx="70" ry="15" fill="#E9DFC9"/>' +
      '<ellipse cx="540" cy="240" rx="70" ry="15" fill="#E9DFC9"/><ellipse cx="750" cy="264" rx="70" ry="15" fill="#E9DFC9"/>' +
      '<ellipse cx="940" cy="242" rx="70" ry="15" fill="#E9DFC9"/></svg>' +
      '<img class="op-cat" src="' + CAT + 'jump.png" alt="">' +
      '<div class="op-title">Toba\'s Play World</div>' +
      '<div class="op-dots"><span></span><span></span><span></span><span></span><span></span></div>' +
      '<div class="op-sparkles"></div>';
    const sp = el.querySelector('.op-sparkles');
    const cols = ['#FFD93D', '#FF7AC6', '#3FA7FF', '#FF9F1C'];
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.innerHTML = TW.art.starSvg(cols[i % 4]);
      s.style.left = (8 + i * 9.2) + '%';
      s.style.top = (12 + (i % 3) * 9) + '%';
      s.style.animationDelay = (1.9 + i * 0.09) + 's';
      sp.appendChild(s);
    }
    el.addEventListener('pointerdown', function () { TW.sound.pop(); finishOpening(); });
    document.body.appendChild(el);
    openingEl = el;
    // Trot in, then swap to the wave for the greeting.
    setTimeout(function () { const c = el.querySelector('.op-cat'); if (c) c.src = CAT + 'wave.png'; }, 1500);
    openingTimer = setTimeout(finishOpening, 4300);
  }

  // ---------- the cat as guide inside games ----------
  const guideSeen = {};
  let guideEl = null, guideTimer = 0;
  function hideGuide() {
    clearTimeout(guideTimer);
    if (guideEl) { guideEl.remove(); guideEl = null; }
  }
  function showGuide(sceneId) {
    if (TW.current() !== sceneId) return;
    const sec = document.getElementById(sceneId);
    if (!sec) return;
    const cands = sec.querySelectorAll('.prop.tappable, .bin, .tool, .blob, .thumb, .cat, .item, .pen, .pop-bubble, .pizza, canvas');
    let target = null;
    for (let i = 0; i < cands.length; i++) {
      const r = cands[i].getBoundingClientRect();
      if (r.width > 10 && r.height > 10 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth) { target = r; break; }
    }
    if (!target) return;
    hideGuide();
    const img = document.createElement('img');
    img.id = 'cat-guide';
    img.src = CAT + 'point.png';
    img.alt = '';
    const w = 132;
    let left = target.left - w - 6;
    if (left < 4) left = Math.min(window.innerWidth - w - 4, target.right + 6);
    let top = target.top + target.height / 2 - w / 2;
    top = Math.max(4, Math.min(window.innerHeight - w - 4, top));
    img.style.left = left + 'px';
    img.style.top = top + 'px';
    img.style.width = w + 'px';
    document.body.appendChild(img);
    guideEl = img;
    guideTimer = setTimeout(hideGuide, 4500);
  }
  document.addEventListener('pointerdown', function () { if (guideEl) hideGuide(); }, true);

  const origShow = TW.show;
  TW.show = function (id) {
    hideGuide();
    origShow(id);
    if (id !== 'hub' && id !== 'credits' && !guideSeen[id]) {
      guideSeen[id] = true;
      setTimeout(function () { showGuide(id); }, 750);
    }
  };

  // ---------- credits ----------
  const CREDITS = [
    'Cow moo recording by Secretlondon, CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0), via Wikimedia Commons. Trimmed and loudness-normalised.',
    'Dog barking recording by Amada44, CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0), via Wikimedia Commons. Loudness-normalised.',
    'Stump-tailed macaque recording by Rushenb, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0), via Wikimedia Commons. Trimmed and loudness-normalised.',
    'Giraffe humming recording by Anton Baotic, Florian Sicks and Angela S. Stoeger (2015), CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0), via Wikimedia Commons. Trimmed and loudness-normalised.'
  ];
  TW.registerScene('credits', {
    init: function () {
      const el = document.getElementById('credits');
      el.innerHTML = '<button class="rbtn back corner" data-back aria-label="Back to home">' + TW.art.icons.back + '</button>' +
        '<div class="credits-card scrolly"><h2>About &amp; Credits</h2>' +
        '<p class="credits-app">Toba\'s Play World — made with love for Toba.</p>' +
        '<h3>Animal sounds</h3>' +
        CREDITS.map(function (c) { return '<p class="credit-line">' + c + '</p>'; }).join('') +
        '<p class="credits-note">All other animal sounds in this app are public domain or CC0 recordings. The animal sound clips above are shared under the same CC BY-SA licenses named in each line.</p></div>';
    }
  });

  // ---------- go ----------
  buildVillage();
  buildOpening();
  const creditsBtn = document.getElementById('creditsBtn');
  if (creditsBtn) creditsBtn.addEventListener('click', function () { TW.sound.pop(); TW.show('credits'); });
})();
