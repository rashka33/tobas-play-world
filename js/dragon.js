// New scene: Dragon Friend — dad pup as a prince with a friendly pink dragon in a rainbow meadow.
(function () {
  const A = TW.art, O = A.O, sp = A.starPath;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

  const CAPE = `<path d="M50 128 Q100 116 150 128 L178 236 Q100 252 22 236 Z" fill="#D7263D" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>`;
  const TUNIC = `<path d="M52 140 Q100 124 148 140 L158 214 Q100 228 42 214 Z" fill="#3E6FD8"/><path d="M46 192 Q100 206 154 192" fill="none" stroke="#FFD23F" stroke-width="9"/><circle cx="100" cy="199" r="7" fill="#FFD23F"/>`;
  const CROWN = `<path d="M-44 0 L-48 -44 L-24 -22 L0 -52 L24 -22 L48 -44 L44 0 Z" fill="#FFD23F" ${st}/><circle cy="-14" r="7" fill="#FF4D6D" ${st}/><circle cx="-26" cy="-10" r="5" fill="#3FA7FF" ${st}/><circle cx="26" cy="-10" r="5" fill="#4CC96B" ${st}/>`;
  const DRAGON = `<path d="M60 70 Q170 96 152 6 Q148 -12 132 -2 Q146 50 56 40 Z" fill="#FF8CC8" ${st}/><path d="M150 4 L166 -16 L170 12 Z" fill="#C9A8FF" ${st}/>
<g class="wingL"><path d="M-30 -10 Q-150 -100 -150 10 Q-118 -6 -104 22 Q-80 2 -50 30 Z" fill="#F7A1D0" ${st}/><path d="M-40 0 Q-100 -40 -130 -10 M-60 18 Q-96 -6 -118 8" fill="none" stroke="#E07BB3" stroke-width="4"/></g>
<g class="wingR"><path d="M30 -10 Q150 -100 150 10 Q118 -6 104 22 Q80 2 50 30 Z" fill="#F7A1D0" ${st}/><path d="M40 0 Q100 -40 130 -10 M60 18 Q96 -6 118 8" fill="none" stroke="#E07BB3" stroke-width="4"/></g>
<ellipse cx="-44" cy="132" rx="32" ry="18" fill="#FF8CC8" ${st}/><ellipse cx="44" cy="132" rx="32" ry="18" fill="#FF8CC8" ${st}/>
<ellipse cy="52" rx="80" ry="84" fill="#FF8CC8" ${st}/><ellipse cy="64" rx="50" ry="62" fill="#FFD6EA" ${st}/>
<path d="M-30 40 H30 M-36 70 H36 M-30 100 H30" stroke="#F2A8CC" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="-72" cy="48" rx="16" ry="28" fill="#FF8CC8" ${st} transform="rotate(28 -72 48)"/><ellipse cx="72" cy="48" rx="16" ry="28" fill="#FF8CC8" ${st} transform="rotate(-28 72 48)"/>
<path d="M-46 -104 L-38 -136 L-24 -112 Z M46 -104 L38 -136 L24 -112 Z" fill="#FFD23F" ${st}/>
<ellipse cy="-62" rx="72" ry="60" fill="#FF8CC8" ${st}/><ellipse cy="-36" rx="44" ry="28" fill="#FFB3DA" ${st}/>
<circle cx="-12" cy="-42" r="4" fill="${O}"/><circle cx="12" cy="-42" r="4" fill="${O}"/>
<circle cx="-28" cy="-78" r="13" fill="${O}"/><circle cx="-24" cy="-82" r="5" fill="#fff"/><circle cx="28" cy="-78" r="13" fill="${O}"/><circle cx="32" cy="-82" r="5" fill="#fff"/>
<path d="M-16 -22 Q0 -10 16 -22" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
<circle cx="-52" cy="-50" r="10" fill="#FF6FA8" opacity=".55"/><circle cx="52" cy="-50" r="10" fill="#FF6FA8" opacity=".55"/>`;
  A.hubArt.dragon = `<svg ${A.NS} viewBox="-165 -150 345 310">${DRAGON}</svg>`;
  const DAISIES =`<path d="M0 50 L-14 -6 M0 50 L0 -16 M0 50 L14 -4" stroke="#3DAA5C" stroke-width="6" stroke-linecap="round"/>
${[[-14, -10], [0, -22], [14, -8]].map(p => [0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="${(p[0] + Math.cos(a * Math.PI / 180) * 11).toFixed(1)}" cy="${(p[1] + Math.sin(a * Math.PI / 180) * 11).toFixed(1)}" rx="7" ry="5" fill="#fff" stroke="${O}" stroke-width="2" transform="rotate(${a} ${(p[0] + Math.cos(a * Math.PI / 180) * 11).toFixed(1)} ${(p[1] + Math.sin(a * Math.PI / 180) * 11).toFixed(1)})"/>`).join('') + `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#FFD23F" stroke="${O}" stroke-width="2"/>`).join('')}
<path d="M-10 30 L10 30 L0 40 Z" fill="#FF6FA8" ${st}/>`;
  const SHIELD_PATH = 'M-50 -60 H50 V0 Q50 50 0 76 Q-50 50 -50 0 Z';
  const FLOWER_COLORS = ['#FF6FA8', '#FFD23F', '#B57CFF', '#FF7A59', '#3FA7FF'];

  function flower(open, c) {
    const stem = `<path d="M0 10 V64" stroke="#3DAA5C" stroke-width="7" stroke-linecap="round"/><ellipse cx="12" cy="44" rx="13" ry="6" fill="#4CC96B" ${st} transform="rotate(-30 12 44)"/>`;
    if (!open) return stem + `<path d="M0 14 Q-20 -6 0 -30 Q20 -6 0 14 Z" fill="${c}" ${st}/><path d="M-10 10 Q0 -2 10 10" fill="#4CC96B" ${st}/>`;
    let pet = '';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3, x = Math.cos(a) * 20, y = Math.sin(a) * 20 - 6;
      pet += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" fill="${c}" ${st}/>`;
    }
    return stem + pet + `<circle cy="-6" r="12" fill="#FFF3B0" ${st}/>`;
  }
  function flowerItem(i, L, P) {
    const id = 'flower' + i;
    return { id: id, pos: { L: L, P: P }, hit: [110, 120], hitDy: 6,
      draw: api => flower(api.state.open[i], FLOWER_COLORS[i]),
      tap: function (api) {
        api.state.open[i] = !api.state.open[i];
        api.redraw(id); api.play(id, 'pop');
        if (api.state.open[i]) { TW.sound.chime(); const c = api.center(id); TW.fx.burst(c.x, c.y, { count: 6 }); }
        else TW.sound.plop();
      } };
  }

  // Where the crown/daisies sit, worked out from the pup's and dragon's positions.
  function pupP(L) { return L === 'L' ? [300, 370, 1.2] : [160, 560, 1.15]; }
  function dragonP(L) { return L === 'L' ? [670, 300, 1] : [430, 470, 0.85]; }

  function bg(L) {
    const W = L === 'L' ? 1000 : 600, gy = L === 'L' ? 410 : 590, cx = W / 2, R = L === 'L' ? 560 : 420;
    const bands = ['#FF6B6B', '#FFA94D', '#FFE066', '#8CE99A', '#74C0FC', '#B197FC'];
    const rainbow = bands.map((c, i) => `<path d="M${cx - R + i * 22} ${gy} A${R - i * 22} ${R - i * 22} 0 0 1 ${cx + R - i * 22} ${gy}" fill="none" stroke="${c}" stroke-width="22" opacity=".75"/>`).join('');
    return `<rect x="-3000" y="-3000" width="7000" height="7000" fill="#BDE8FF"/>${rainbow}
<path d="M-3000 ${gy + 30} Q${cx} ${gy - 60} 4000 ${gy + 30} V4000 H-3000 Z" fill="#8FDB6E"/>
<path d="M-3000 ${gy + 120} Q${cx * 0.6} ${gy + 40} 4000 ${gy + 140} V4000 H-3000 Z" fill="#7ACB5C"/>`;
  }

  TW.makeRoom({
    id: 'dragon',
    defs: `<clipPath id="shieldClip"><path d="${SHIELD_PATH}"/></clipPath>`,
    state: { crownOn: 'pup', holding: false, open: [false, false, false, false, false] },
    bg: bg,
    items: [
      flowerItem(0, [70, 548, 1], [70, 860, 1]),
      flowerItem(1, [230, 548, 1], [190, 935, 1]),
      flowerItem(2, [560, 548, 1], [310, 880, 1]),
      flowerItem(3, [790, 548, 1], [430, 940, 1]),
      flowerItem(4, [935, 520, 1], [545, 860, 1]),
      { id: 'shield', pos: { L: [130, 450, 1], P: [520, 705, 0.95] }, hit: [120, 150], hitDy: 6,
        draw: `<path d="${SHIELD_PATH}" fill="#5B8DEF" stroke="#F2C14E" stroke-width="10" stroke-linejoin="round"/><path d="${SHIELD_PATH}" fill="none" ${st}/>
<path d="M0 34 C-24 16 -28 -6 -14 -14 C-6 -18 -2 -12 0 -8 C2 -12 6 -18 14 -14 C28 -6 24 16 0 34 Z" fill="#FF6FA8" ${st}/>
<g clip-path="url(#shieldClip)"><rect class="shine" x="-14" y="-110" width="28" height="220" fill="#fff" opacity=".85"/></g>`,
        tap: function (api) {
          api.play('shield', 'shining'); TW.sound.sparkle();
          const c = api.center('shield'); TW.fx.burst(c.x, c.y, { count: 10, colors: ['#FFFFFF', '#FFF3B0', '#9FD8FF'] });
        } },
      { id: 'dragon', pos: { L: dragonP('L'), P: dragonP('P') }, hit: [260, 290], hitDy: 4,
        draw: DRAGON,
        tap: function (api) {
          api.play('dragon', 'flap');
          TW.sound.whoosh(); setTimeout(TW.sound.chime, 350);
          const m = api.local('dragon', 0, -26);
          TW.fx.petals(m.x, m.y, 18);
        } },
      { id: 'pup', pos: { L: pupP('L'), P: pupP('P') }, hit: [200, 240], hitDy: 10,
        draw: TW.pupAt('dad', { back: CAPE, outfit: TUNIC, extra: A.parts.BROWS }),
        tap: function (api) { TW.sound.boing(); api.play('pup', 'bounce'); } },
      { id: 'crown', hit: [150, 140], hitDy: -24,
        pos: function (L, api) {
          if (api.state.crownOn === 'pup') { const p = pupP(L); return [p[0], p[1] + (42 - 120) * p[2], p[2] * 0.85]; }
          const d = dragonP(L); return [d[0], d[1] - 108 * d[2], d[2] * 0.95];
        },
        draw: CROWN,
        tap: function (api) {
          api.state.crownOn = api.state.crownOn === 'pup' ? 'dragon' : 'pup';
          api.place('crown'); api.play('crown', 'hop'); TW.sound.boing();
          setTimeout(function () {
            const c = api.center('crown'); TW.fx.burst(c.x, c.y, { count: 10 }); TW.sound.sparkle();
            api.play(api.state.crownOn, 'bounce');
          }, 600);
        } },
      { id: 'daisies', hit: [110, 130],
        pos: function (L, api) {
          if (!api.state.holding) return L === 'L' ? [440, 540, 1] : [300, 760, 1];
          const p = pupP(L); return [p[0] + 52 * p[2], p[1] + 58 * p[2], p[2] * 0.8];
        },
        draw: DAISIES,
        tap: function (api) {
          api.state.holding = !api.state.holding;
          api.place('daisies'); api.play('daisies', 'pop');
          if (api.state.holding) {
            TW.sound.chime();
            setTimeout(function () { const c = api.center('pup'); TW.fx.hearts(c.x, c.y - 40, 7); api.play('pup', 'bounce'); }, 400);
          } else TW.sound.plop();
        } }
    ]
  });
})();
