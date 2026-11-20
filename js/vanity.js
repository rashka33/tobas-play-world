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

  const TIARA = `<path d="M62 40 L70 18 L84 32 L100 10 L116 32 L130 18 L138 40 Q100 30 62 40 Z" fill="#E6ECF5" ${st}/><circle cx="100" cy="22" r="5" fill="#FF7AC6" ${st}/><circle cx="76" cy="30" r="3.5" fill="#7FD6FF"/><circle cx="124" cy="30" r="3.5" fill="#7FD6FF"/>`;
  const CLIP = (function () {
    let f = '';
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; f += `<circle cx="${(150 + Math.cos(a) * 9).toFixed(1)}" cy="${(52 + Math.sin(a) * 9).toFixed(1)}" r="8" fill="#B57CFF" stroke="${O}" stroke-width="2.5"/>`; }
    return f + `<circle cx="150" cy="52" r="6" fill="#FFD93D" stroke="${O}" stroke-width="2.5"/>`;
  })();
  const STEPS = ['necklace', 'earrings', 'bow', 'tiara', 'clip', 'cheek', 'glitter', 'fluffy', 'perfume'];
  // Five different pampering touches = a finished princess look.
  function checkReady(api) {
    const n = STEPS.filter(k => api.state[k]).length;
    if (n >= 5 && !api.state.done) {
      api.state.done = true;
      api.later(function () { api.play('pup', 'twirl'); TW.celebrate('So pretty!'); }, 700);
    } else if (n < 3) api.state.done = false;
  }

  function pupSvg(s) {
    return TW.pupAt('sister', {
      outfit: (s.fluffy ? FLUFF : '') + DRESS,
      cheek: s.cheek || '#FF8FA3', cheekOp: s.cheek ? 0.85 : 0.55,
      extra: (s.glitter ? GLITTER : '') + (s.necklace ? PEARLS : '') + (s.earrings ? EARRINGS : '') + (s.bow ? BIGBOW : '') + (s.tiara ? TIARA : '') + (s.clip ? CLIP : '')
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
${[[-80, -90, 0], [70, -40, -1.5], [-60, 60, -3], [90, 90, -2.2]].map(g => `<path class="glint" style="animation-delay:${g[2]}s" d="${sp(m[0] + g[0], m[1] + g[1], 16, 4)}" fill="#fff"/>`).join('')}
${L === 'L' ? `<rect x="60" y="292" width="260" height="14" rx="6" fill="#E8A6C4" ${st}/><rect x="680" y="292" width="260" height="14" rx="6" fill="#E8A6C4" ${st}/><rect x="120" y="436" width="140" height="14" rx="6" fill="#E8A6C4" ${st}/><rect x="740" y="436" width="140" height="14" rx="6" fill="#E8A6C4" ${st}/>`
  : [272, 402, 528].map(y => `<rect x="8" y="${y}" width="114" height="12" rx="5" fill="#E8A6C4" ${st}/><rect x="478" y="${y}" width="114" height="12" rx="5" fill="#E8A6C4" ${st}/>`).join('')}
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
      api.play('pup', api.state[key] ? 'twirl' : 'sqhop'); api.play(key, 'pop');
      if (api.state[key]) { TW.sound.boing(); const c = api.center('pup'); TW.fx.burst(c.x, c.y - 40, { count: 10 }); }
      else TW.sound.plop();
      checkReady(api);
    };
  }
  const NAMES = { necklace: 'Necklace!', earrings: 'Earrings!', bow: 'Big bow!', tiara: 'Tiara!', clip: 'Flower clip!' };
  function wearSay(key) { return api => api.state[key] ? NAMES[key] : 'Off it comes!'; }
  function cheekSparkle(api) {
    const p = api.pos('pup'), s = p[2];
    [[66, 108], [134, 108]].forEach(function (c) {
      const q = api.point(p[0] + (c[0] - 100) * s, p[1] + (c[1] - 120) * s);
      TW.fx.burst(q.x, q.y, { count: 6, colors: ['#FFFFFF', '#FFD6EA', '#FFF3B0'] });
    });
  }

  TW.makeRoom({
    id: 'vanity',
    state: { necklace: false, earrings: false, bow: false, tiara: false, clip: false, perfume: false, cheek: null, glitter: false, fluffy: false, ci: -1, done: false },
    bg: bg,
    items: [
      { id: 'pup', pos: { L: [500, 335, 1.3], P: [300, 455, 1.45] }, hit: [210, 240], hitDy: -10,
        draw: api => pupSvg(api.state),
        say: 'I feel like a princess!',
        tap: function (api) { TW.sound.boing(); api.play('pup', 'twirl'); } },
      { id: 'perfume', pos: { L: [130, 250, 1], P: [65, 230, 1] }, hit: [112, 120], say: 'Perfume! Smells nice!',
        draw: `<circle cy="14" r="30" fill="#FFB3D9" fill-opacity=".9" ${st}/><rect x="-10" y="-30" width="20" height="16" fill="#F2C14E" ${st}/><path d="M10 -24 Q24 -24 26 -36" fill="none" stroke="${O}" stroke-width="3"/><circle cx="28" cy="-40" r="8" fill="#FF6FA8" ${st}/><ellipse cx="-10" cy="4" rx="6" ry="10" fill="#fff" opacity=".6"/>`,
        tap: function (api) { api.state.perfume = true; api.play('perfume', 'wiggle'); const p = api.local('perfume', 30, -40); TW.fx.bubbles(p.x, p.y, 6, '#FFB3D9'); TW.sound.whoosh(); api.play('pup', 'sqhop'); checkReady(api); } },
      { id: 'vase', pos: { L: [250, 250, 1], P: [65, 360, 1] }, hit: [112, 120], say: 'Pretty flowers!',
        draw: `<path d="M-6 -6 L-20 -44 M0 -6 V-52 M6 -6 L20 -44" stroke="#3DAA5C" stroke-width="5" stroke-linecap="round"/>
${[[-20, -48, '#FF7AC6'], [0, -56, '#FFD93D'], [20, -48, '#A86BFF']].map(f => `<circle cx="${f[0]}" cy="${f[1]}" r="11" fill="${f[2]}" ${st}/><circle cx="${f[0]}" cy="${f[1]}" r="4" fill="#fff"/>`).join('')}
<path d="M-22 -6 H22 Q30 26 14 44 H-14 Q-30 26 -22 -6 Z" fill="#7FD6FF" ${st}/>`,
        tap: function (api) { api.play('vase', 'wiggle'); const p = api.local('vase', 0, -50); TW.fx.petals(p.x, p.y, 10); TW.sound.chime(); } },
      { id: 'clip', pos: { L: [190, 395, 1], P: [65, 490, 1] }, hit: [112, 112], tap: toggleWear('clip'), say: wearSay('clip'),
        draw: api => `<g${worn(api, 'clip')}><rect x="-30" y="12" width="60" height="10" rx="5" fill="#C9CED6" ${st}/><g transform="translate(-150 -40) scale(1.6) translate(56 15)">${CLIP}</g></g>` },
      { id: 'jewelbox', pos: { L: [750, 250, 1], P: [535, 230, 1] }, hit: [112, 120], say: 'Jewelry box! La la la!',
        draw: `<rect x="-40" y="-6" width="80" height="44" rx="8" fill="#B57CFF" ${st}/><path d="M0 26 C-10 18 -12 10 -6 6 C-3 4 -1 6 0 8 C1 6 3 4 6 6 C12 10 10 18 0 26 Z" fill="#FF6FA8"/><g class="lid"><rect x="-44" y="-26" width="88" height="22" rx="8" fill="#C9A8FF" ${st}/></g>`,
        tap: function (api) { const a = api.anim('jewelbox'); a.classList.add('lid-open'); [784, 988, 1175, 988, 784].forEach(function (f, i) { setTimeout(function () { TW.sound.beep(f); }, i * 160); }); api.later(function () { a.classList.remove('lid-open'); }, 1400); api.play('pup', 'twirl'); } },
      { id: 'handmirror', pos: { L: [870, 250, 1], P: [535, 360, 1] }, hit: [112, 120], say: 'Who is that? It is me!',
        draw: `<rect x="-7" y="18" width="14" height="40" rx="6" fill="#F2C14E" ${st}/><circle cy="-6" r="30" fill="#F2C14E" ${st}/><circle cy="-6" r="22" fill="#D7F1FF"/><path d="M-10 -18 L4 -2" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
        tap: function (api) { api.play('handmirror', 'wiggle'); const c = api.center('pup'); TW.fx.hearts(c.x, c.y - 60, 4); TW.sound.chime(); } },
      { id: 'tiara', pos: { L: [810, 395, 1], P: [535, 490, 1] }, hit: [112, 112], tap: toggleWear('tiara'), say: wearSay('tiara'),
        draw: api => `<g${worn(api, 'tiara')}><ellipse cy="26" rx="44" ry="12" fill="#FFD6E8" ${st}/><g transform="translate(-100 -10)">${TIARA}</g></g>` },
      { id: 'table', pos: function (L) { return L === 'L' ? [500, 470, 1] : [300, 625, 1]; }, draw: api => tableDraw(api.layout()) },
      { id: 'necklace', pos: { L: [100, 545, 1], P: [85, 725, 1.2] }, hit: [112, 120],
        draw: api => `<g${worn(api, 'necklace')}><path d="M-10 40 L-30 40 L0 -40 L30 40 Z" fill="#B57CFF" ${st}/><path d="M-26 -6 Q0 40 26 -6" fill="none" stroke="#FFFDF4" stroke-width="10" stroke-dasharray="1 11" stroke-linecap="round"/></g>`,
        tap: toggleWear('necklace'), say: wearSay('necklace') },
      { id: 'earrings', pos: { L: [215, 545, 1], P: [228, 725, 1.2] }, hit: [112, 120],
        draw: api => `<g${worn(api, 'earrings')}><ellipse cy="26" rx="44" ry="16" fill="#9FD8FF" ${st}/><g stroke="${O}" stroke-width="2.5"><circle cx="-14" cy="0" r="7" fill="#FFD23F"/><circle cx="-14" cy="16" r="10" fill="#FFFDF4"/><circle cx="14" cy="0" r="7" fill="#FFD23F"/><circle cx="14" cy="16" r="10" fill="#FFFDF4"/></g></g>`,
        tap: toggleWear('earrings'), say: wearSay('earrings') },
      { id: 'bow', pos: { L: [330, 545, 1], P: [372, 725, 1.2] }, hit: [112, 120],
        draw: api => `<g${worn(api, 'bow')}><path d="M0 0 L-40 -24 L-40 24 Z M0 0 L40 -24 L40 24 Z" fill="#E8453C" ${st}/><circle r="10" fill="#C8322B" ${st}/><path d="M-6 8 L-18 40 M6 8 L18 40" stroke="#E8453C" stroke-width="8" stroke-linecap="round"/></g>`,
        tap: toggleWear('bow'), say: wearSay('bow') },
      { id: 'lipstick', pos: { L: [670, 545, 1], P: [515, 725, 1.2] }, hit: [112, 120],
        draw: `<rect x="-20" y="0" width="40" height="44" rx="6" fill="#FFD23F" ${st}/><rect x="-14" y="-28" width="28" height="30" fill="#FF4F9A" ${st}/><path d="M-14 -28 L14 -44 V-28 Z" fill="#FF4F9A" ${st}/>`,
        say: 'Lipstick! Rosy cheeks!',
        tap: function (api) {
          const s = api.state;
          s.ci = (s.ci + 1) % CHEEKS.length; s.cheek = CHEEKS[s.ci];
          api.redraw('pup'); api.play('lipstick', 'wiggle'); api.play('pup', 'sqhop'); cheekSparkle(api); TW.sound.sparkle(); checkReady(api);
        } },
      { id: 'powder', pos: { L: [785, 545, 1], P: [155, 890, 1.2] }, hit: [112, 120],
        draw: `<ellipse cy="20" rx="44" ry="18" fill="#C9A8FF" ${st}/><ellipse cy="12" rx="36" ry="12" fill="#FFD6E6"/><circle cx="6" cy="-10" r="22" fill="#FFF0F6" ${st}/><circle cx="6" cy="-32" r="6" fill="#FF9CD0" ${st}/>`,
        say: 'Sparkle powder!',
        tap: function (api) {
          api.state.glitter = true;
          if (!api.state.cheek) api.state.cheek = '#FFB38A';
          api.redraw('pup'); api.play('powder', 'bounce'); api.play('pup', 'sqhop'); cheekSparkle(api); TW.sound.sparkle(); checkReady(api);
          const c = api.center('powder');
          TW.fx.bubbles(c.x, c.y - 20, 4, '#FFE0F0');
        } },
      { id: 'brush', pos: { L: [900, 545, 1], P: [300, 890, 1.2] }, hit: [112, 120],
        draw: `<g transform="rotate(-30)"><rect x="-8" y="0" width="16" height="56" rx="7" fill="#B5733F" ${st}/><rect x="-28" y="-44" width="56" height="48" rx="20" fill="#FF9CD0" ${st}/><path d="M-18 -36 V-10 M-6 -38 V-10 M6 -38 V-10 M18 -36 V-10" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`,
        say: api => api.state.fluffy ? 'Fluffy fur!' : 'Brush brush!',
        tap: function (api) {
          api.state.fluffy = !api.state.fluffy;
          api.redraw('pup'); api.play('pup', 'sqhop'); api.play('brush', 'wiggle'); TW.sound.boing(); checkReady(api);
          const c = api.center('pup'); TW.fx.burst(c.x, c.y - 60, { count: 8 });
        } },
      { id: 'bubbles', pos: { L: [500, 552, 1], P: [445, 890, 1.2] }, hit: [120, 120],
        draw: `<rect x="-24" y="-10" width="48" height="56" rx="12" fill="#BDEBFF" fill-opacity=".85" ${st}/><rect x="-14" y="-22" width="28" height="14" rx="4" fill="#FF6FA8" ${st}/>
<path d="M14 -22 L30 -58" stroke="${O}" stroke-width="4"/><circle cx="34" cy="-66" r="12" fill="none" stroke="#FF6FA8" stroke-width="5"/>
<circle cx="-36" cy="-40" r="10" fill="#E6F7FF" stroke="#9FD8FF" stroke-width="2"/><circle cx="-24" cy="-62" r="6" fill="#E6F7FF" stroke="#9FD8FF" stroke-width="2"/>`,
        say: 'Bubbles!',
        tap: function (api) {
          const p = api.local('bubbles', 34, -66);
          TW.fx.bubbles(p.x, p.y, 9); TW.sound.bloop(); api.play('bubbles', 'wiggle');
        } }
    ]
  });
})();
