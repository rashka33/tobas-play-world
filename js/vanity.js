// New scene: Princess Vanity — big-sister pup at a dressing table with a crown-topped mirror.
(function () {
  const A = TW.art, O = A.O, sp = A.starPath;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const sister = A.FAMILY.sister;
  const CHEEKS = ['#FF4F9A', '#FF7A7A', '#D96BFF'];

  const DRESS = `<path d="M50 142 Q100 124 150 142 L172 228 Q100 244 28 228 Z" fill="#FF9CD0"/>
<path d="M30 220 Q100 238 170 220" fill="none" stroke="#FFF3B0" stroke-width="6"/>
<path d="${sp(80, 190, 7, 3)} ${sp(122, 176, 6, 2.5)} ${sp(104, 212, 5, 2.2)}" fill="#fff" stroke="none"/>`;
  const PEARLS = (function () {
    let s = '';
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, x = (1 - t) * (1 - t) * 62 + 2 * (1 - t) * t * 100 + t * t * 138, y = (1 - t) * (1 - t) * 138 + 2 * (1 - t) * t * 178 + t * t * 138;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="#FFFDF4" stroke="${O}" stroke-width="2.5"/>`;
    }
    return s;
  })();
  const EARRINGS = `<g stroke="${O}" stroke-width="2.5"><circle cx="34" cy="132" r="6" fill="#FFD23F"/><circle cx="34" cy="146" r="8" fill="#FFFDF4"/><circle cx="166" cy="132" r="6" fill="#FFD23F"/><circle cx="166" cy="146" r="8" fill="#FFFDF4"/></g>`;
  const BIGBOW = `<g transform="translate(100 34)"><path d="M0 0 L-34 -20 L-34 20 Z M0 0 L34 -20 L34 20 Z" fill="#E8453C" ${st}/><circle r="9" fill="#C8322B" ${st}/></g>`;
  const FLUFF = (function () {
    let s = '';
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (1.12 + i * 0.127);
      s += `<circle cx="${(100 + Math.cos(a) * 58).toFixed(1)}" cy="${(88 + Math.sin(a) * 58).toFixed(1)}" r="16" fill="${sister.body}"/>`;
    }
    return s;
  })();
  const GLITTER = `<g fill="#FFF6C2" stroke="#E8B400" stroke-width="1"><path d="${sp(60, 104, 5, 2)} ${sp(72, 112, 4, 1.6)} ${sp(140, 104, 5, 2)} ${sp(128, 112, 4, 1.6)}"/></g>`;

  function pupSvg(s) {
    return TW.pupAt('sister', {
      outfit: (s.fluffy ? FLUFF : '') + DRESS,
      cheek: s.cheek || '#FF8FA3', cheekOp: s.cheek ? 0.85 : 0.55,
      extra: (s.glitter ? GLITTER : '') + (s.necklace ? PEARLS : '') + (s.earrings ? EARRINGS : '') + (s.bow ? BIGBOW : '')
    });
  }

  function bg(L) {
    const W = L === 'L' ? 1000 : 600;
    let stripes = '';
    for (let x = -400; x < W + 400; x += 70) stripes += `<rect x="${x}" y="-3000" width="30" height="7000" fill="#FFE3EF"/>`;
    const m = L === 'L' ? [500, 235, 150, 160] : [300, 250, 150, 165];
    const crownY = m[1] - m[3] + 6;
    return `<rect x="-3000" y="-3000" width="7000" height="7000" fill="#FFD0E4"/>${stripes}
<ellipse cx="${m[0]}" cy="${m[1]}" rx="${m[2] + 20}" ry="${m[3] + 20}" fill="#F2C14E" ${st}/>
<ellipse cx="${m[0]}" cy="${m[1]}" rx="${m[2]}" ry="${m[3]}" fill="#D7F1FF" ${st}/>
<path d="M${m[0] + 60} ${m[1] - 110} L${m[0] + 110} ${m[1] - 40} M${m[0] + 80} ${m[1] - 120} L${m[0] + 122} ${m[1] - 64}" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".8"/>
<g transform="translate(${m[0]} ${crownY})"><path d="M-60 0 L-66 -54 L-32 -26 L0 -62 L32 -26 L66 -54 L60 0 Z" fill="#FFD23F" ${st}/><circle cy="-16" r="9" fill="#FF4D6D" ${st}/><circle cx="-36" cy="-12" r="6" fill="#3FA7FF" ${st}/><circle cx="36" cy="-12" r="6" fill="#4CC96B" ${st}/></g>`;
  }

  function tableDraw(L) {
    return L === 'L'
      ? `<path d="M-600 0 H600 V400 H-600 Z" fill="#FFF0F6" ${st}/><path d="M-600 0 H600" stroke="#E8A6C4" stroke-width="14"/>`
      : `<path d="M-500 0 H500 V600 H-500 Z" fill="#FFF0F6" ${st}/><path d="M-500 0 H500" stroke="#E8A6C4" stroke-width="14"/>`;
  }

  function worn(api, id) { return api.state[id] ? ' opacity=".35"' : ''; }
  function toggleWear(key) {
    return function (api) {
      api.state[key] = !api.state[key];
      api.redraw('pup'); api.redraw(key);
      api.play('pup', 'bounce'); api.play(key, 'pop');
      if (api.state[key]) { TW.sound.boing(); const c = api.center('pup'); TW.fx.burst(c.x, c.y - 40, { count: 10 }); }
      else TW.sound.plop();
    };
  }
  function cheekSparkle(api) {
    const p = api.pos('pup'), s = p[2];
    [[66, 108], [134, 108]].forEach(function (c) {
      const q = api.point(p[0] + (c[0] - 100) * s, p[1] + (c[1] - 120) * s);
      TW.fx.burst(q.x, q.y, { count: 6, colors: ['#FFFFFF', '#FFD6EA', '#FFF3B0'] });
    });
  }

  TW.makeRoom({
    id: 'vanity',
    state: { necklace: false, earrings: false, bow: false, cheek: null, glitter: false, fluffy: false, ci: -1 },
    bg: bg,
    items: [
      { id: 'pup', pos: { L: [500, 335, 1.3], P: [300, 455, 1.45] }, hit: [210, 240], hitDy: -10,
        draw: api => pupSvg(api.state),
        tap: function (api) { TW.sound.boing(); api.play('pup', 'bounce'); } },
      { id: 'table', pos: function (L) { return L === 'L' ? [500, 470, 1] : [300, 625, 1]; }, draw: api => tableDraw(api.layout()) },
      { id: 'necklace', pos: { L: [100, 545, 1], P: [85, 725, 1.2] }, hit: [112, 120],
        draw: api => `<g${worn(api, 'necklace')}><path d="M-10 40 L-30 40 L0 -40 L30 40 Z" fill="#B57CFF" ${st}/><path d="M-26 -6 Q0 40 26 -6" fill="none" stroke="#FFFDF4" stroke-width="10" stroke-dasharray="1 11" stroke-linecap="round"/></g>`,
        tap: toggleWear('necklace') },
      { id: 'earrings', pos: { L: [215, 545, 1], P: [228, 725, 1.2] }, hit: [112, 120],
        draw: api => `<g${worn(api, 'earrings')}><ellipse cy="26" rx="44" ry="16" fill="#9FD8FF" ${st}/><g stroke="${O}" stroke-width="2.5"><circle cx="-14" cy="0" r="7" fill="#FFD23F"/><circle cx="-14" cy="16" r="10" fill="#FFFDF4"/><circle cx="14" cy="0" r="7" fill="#FFD23F"/><circle cx="14" cy="16" r="10" fill="#FFFDF4"/></g></g>`,
        tap: toggleWear('earrings') },
      { id: 'bow', pos: { L: [330, 545, 1], P: [372, 725, 1.2] }, hit: [112, 120],
        draw: api => `<g${worn(api, 'bow')}><path d="M0 0 L-40 -24 L-40 24 Z M0 0 L40 -24 L40 24 Z" fill="#E8453C" ${st}/><circle r="10" fill="#C8322B" ${st}/><path d="M-6 8 L-18 40 M6 8 L18 40" stroke="#E8453C" stroke-width="8" stroke-linecap="round"/></g>`,
        tap: toggleWear('bow') },
      { id: 'lipstick', pos: { L: [670, 545, 1], P: [515, 725, 1.2] }, hit: [112, 120],
        draw: `<rect x="-20" y="0" width="40" height="44" rx="6" fill="#FFD23F" ${st}/><rect x="-14" y="-28" width="28" height="30" fill="#FF4F9A" ${st}/><path d="M-14 -28 L14 -44 V-28 Z" fill="#FF4F9A" ${st}/>`,
        tap: function (api) {
          const s = api.state;
          s.ci = (s.ci + 1) % CHEEKS.length; s.cheek = CHEEKS[s.ci];
          api.redraw('pup'); api.play('lipstick', 'wiggle'); cheekSparkle(api); TW.sound.sparkle();
        } },
      { id: 'powder', pos: { L: [785, 545, 1], P: [155, 890, 1.2] }, hit: [112, 120],
        draw: `<ellipse cy="20" rx="44" ry="18" fill="#C9A8FF" ${st}/><ellipse cy="12" rx="36" ry="12" fill="#FFD6E6"/><circle cx="6" cy="-10" r="22" fill="#FFF0F6" ${st}/><circle cx="6" cy="-32" r="6" fill="#FF9CD0" ${st}/>`,
        tap: function (api) {
          api.state.glitter = true;
          if (!api.state.cheek) api.state.cheek = '#FFB38A';
          api.redraw('pup'); api.play('powder', 'bounce'); cheekSparkle(api); TW.sound.sparkle();
          const c = api.center('powder');
          TW.fx.bubbles(c.x, c.y - 20, 4, '#FFE0F0');
        } },
      { id: 'brush', pos: { L: [900, 545, 1], P: [300, 890, 1.2] }, hit: [112, 120],
        draw: `<g transform="rotate(-30)"><rect x="-8" y="0" width="16" height="56" rx="7" fill="#B5733F" ${st}/><rect x="-28" y="-44" width="56" height="48" rx="20" fill="#FF9CD0" ${st}/><path d="M-18 -36 V-10 M-6 -38 V-10 M6 -38 V-10 M18 -36 V-10" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`,
        tap: function (api) {
          api.state.fluffy = !api.state.fluffy;
          api.redraw('pup'); api.play('pup', 'bounce'); api.play('brush', 'wiggle'); TW.sound.boing();
          const c = api.center('pup'); TW.fx.burst(c.x, c.y - 60, { count: 8 });
        } },
      { id: 'bubbles', pos: { L: [500, 552, 1], P: [445, 890, 1.2] }, hit: [120, 120],
        draw: `<rect x="-24" y="-10" width="48" height="56" rx="12" fill="#BDEBFF" fill-opacity=".85" ${st}/><rect x="-14" y="-22" width="28" height="14" rx="4" fill="#FF6FA8" ${st}/>
<path d="M14 -22 L30 -58" stroke="${O}" stroke-width="4"/><circle cx="34" cy="-66" r="12" fill="none" stroke="#FF6FA8" stroke-width="5"/>
<circle cx="-36" cy="-40" r="10" fill="#E6F7FF" stroke="#9FD8FF" stroke-width="2"/><circle cx="-24" cy="-62" r="6" fill="#E6F7FF" stroke="#9FD8FF" stroke-width="2"/>`,
        tap: function (api) {
          const p = api.local('bubbles', 34, -66);
          TW.fx.bubbles(p.x, p.y, 9); TW.sound.bloop(); api.play('bubbles', 'wiggle');
        } }
    ]
  });
})();
