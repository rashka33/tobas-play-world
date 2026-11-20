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
  function butterfly(c, d) {
    return `<g class="flutter" style="animation-delay:${d}s"><g class="wings-flap"><g class="bw"><ellipse cx="-16" cy="-6" rx="16" ry="20" fill="${c}" ${st}/><ellipse cx="16" cy="-6" rx="16" ry="20" fill="${c}" ${st}/></g></g>
<ellipse cy="0" rx="5" ry="18" fill="${O}"/><path d="M-3 -16 L-10 -28 M3 -16 L10 -28" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/></g>`;
  }
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
      say: api => api.state.open[i] ? ['Pink flower!', 'Yellow flower!', 'Purple flower!', 'Orange flower!', 'Blue flower!'][i] : 'Sleepy flower!',
      draw: api => flower(api.state.open[i], FLOWER_COLORS[i]),
      tap: function (api) {
        const s = api.state;
        s.open[i] = !s.open[i];
        api.redraw(id); api.play(id, 'pop');
        walkPup(api, id);
        if (s.open[i]) { TW.sound.chime(); const c = api.center(id); TW.fx.burst(c.x, c.y, { count: 6 }); }
        else { TW.sound.plop(); s.allBloomed = false; }
        if (s.open.every(Boolean) && !s.allBloomed) {
          s.allBloomed = true;
          api.later(function () { TW.celebrate('All the flowers bloomed!'); flyLoop(api); api.play('pup', 'sqhop'); }, 600);
        }
      } };
  }

  // Where the crown/daisies sit, worked out from the pup's (possibly walked) and dragon's positions.
  function pupP(L, api) { return api ? api.pos('pup') : (L === 'L' ? [300, 370, 1.2] : [160, 560, 1.15]); }
  function walkPup(api, id) {
    const t = api.pos(id), p = api.pos('pup'), L = api.layout();
    const side = t[0] < p[0] ? 1 : -1;
    let x = t[0] + side * (L === 'L' ? 110 : 90);
    x = Math.max(L === 'L' ? 130 : 110, Math.min(L === 'L' ? 370 : 230, x));
    const deps = [];
    if (api.state.crownOn === 'pup') deps.push('crown');
    if (api.state.holding) deps.push('daisies');
    if (Math.abs(x - p[0]) > 20) api.walk('pup', x, null, deps, 1100);
  }
  // A slow loop around the meadow (only when the crown isn't riding on the dragon's head).
  function flyLoop(api) {
    if (api.state.crownOn === 'dragon') { api.play('dragon', 'flap'); return; }
    api.play('dragon', 'flyloop'); TW.sound.whoosh();
  }
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
    // Every so often the dragon gives a happy flap all by itself.
    init: function (api) {
      let n = 0;
      (function loop() {
        setTimeout(function () {
          if (api.active() && !api.anim('dragon').classList.contains('flyloop')) {
            if (++n % 2 === 0) flyLoop(api); else api.play('dragon', 'flap');
          }
          loop();
        }, 5000 + Math.random() * 3000);
      })();
    },
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
        say: 'Shiny shield!',
        tap: function (api) {
          api.play('shield', 'shining'); TW.sound.sparkle();
          const c = api.center('shield'); TW.fx.burst(c.x, c.y, { count: 10, colors: ['#FFFFFF', '#FFF3B0', '#9FD8FF'] });
        } },
      { id: 'dragon', pos: { L: dragonP('L'), P: dragonP('P') }, hit: [260, 290], hitDy: 4,
        draw: DRAGON,
        say: 'Dragon friend!',
        tap: function (api) {
          if (api.anim('dragon').classList.contains('flyloop')) return;
          flyLoop(api);
          api.play('dragon', 'flap');
          TW.sound.whoosh(); setTimeout(TW.sound.chime, 350);
          const m = api.local('dragon', 0, -26);
          TW.fx.petals(m.x, m.y, 18);
        } },
      { id: 'pup', pos: { L: pupP('L'), P: pupP('P') }, hit: [200, 240], hitDy: 10,
        draw: TW.pupAt('dad', { back: CAPE, outfit: TUNIC, extra: A.parts.BROWS }),
        say: 'I am a prince!',
        tap: function (api) { TW.sound.boing(); api.play('pup', 'sqhop'); } },
      { id: 'crown', hit: [150, 140], hitDy: -24,
        pos: function (L, api) {
          if (api.state.crownOn === 'pup') { const p = pupP(L, api); return [p[0], p[1] + (42 - 120) * p[2], p[2] * 0.85]; }
          const d = dragonP(L); return [d[0], d[1] - 108 * d[2], d[2] * 0.95];
        },
        draw: CROWN, say: api => api.state.crownOn === 'pup' ? 'Crown for the prince!' : 'Crown for the dragon!',
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
          const p = pupP(L, api); return [p[0] + 52 * p[2], p[1] + 58 * p[2], p[2] * 0.8];
        },
        draw: DAISIES, say: 'Daisies!',
        tap: function (api) {
          api.state.holding = !api.state.holding;
          api.place('daisies'); api.play('daisies', 'pop');
          if (api.state.holding) {
            TW.sound.chime();
            setTimeout(function () { const c = api.center('pup'); TW.fx.hearts(c.x, c.y - 40, 7); api.play('pup', 'bounce'); }, 400);
          } else TW.sound.plop();
        } },
      { id: 'sun', pos: { L: [880, 90, 1], P: [510, 100, 1] }, hit: [130, 130], say: 'Sunshine!',
        draw: `<g class="sweep">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M${(Math.cos(a * Math.PI / 180) * 46).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * 46).toFixed(1)} L${(Math.cos(a * Math.PI / 180) * 62).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * 62).toFixed(1)}" stroke="#FFC24B" stroke-width="8" stroke-linecap="round"/>`).join('')}</g>
<circle r="38" fill="#FFD93D" ${st}/><circle cx="-12" cy="-6" r="4" fill="${O}"/><circle cx="12" cy="-6" r="4" fill="${O}"/><path d="M-12 8 Q0 18 12 8" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`,
        tap: function (api) { api.play('sun', 'wigspin'); TW.sound.chime(); } },
      { id: 'cloud', pos: { L: [560, 90, 1], P: [300, 120, 1] }, hit: [140, 112], say: 'Pitter patter, rain!',
        draw: `<path d="M-50 20 Q-70 20 -66 0 Q-64 -18 -44 -16 Q-36 -40 -10 -36 Q8 -52 30 -34 Q56 -36 58 -12 Q74 -6 66 12 Q62 22 48 20 Z" fill="#fff" ${st}/>`,
        tap: function (api) { api.play('cloud', 'wiggle'); const p = api.local('cloud', 0, 24); TW.fx.drops(p.x, p.y, 10); [0, 120, 240, 360].forEach(function (d) { setTimeout(TW.sound.drip, d); }); } },
      { id: 'castle', pos: { L: [900, 300, 1], P: [520, 280, 1] }, hit: [120, 120], say: 'A castle! Toot toot!',
        draw: `<rect x="-44" y="-20" width="88" height="62" fill="#E6E0F5" ${st}/><rect x="-54" y="-44" width="26" height="86" fill="#D6CCEE" ${st}/><rect x="28" y="-44" width="26" height="86" fill="#D6CCEE" ${st}/>
<path d="M-58 -44 L-41 -70 L-24 -44 Z M24 -44 L41 -70 L58 -44 Z" fill="#FF6FA8" ${st}/><path d="M-12 42 V14 Q0 2 12 14 V42 Z" fill="#B57CFF" ${st}/>
<path d="M41 -70 V-92" stroke="${O}" stroke-width="3"/><g class="flagwave"><path d="M41 -92 L64 -86 L41 -80 Z" fill="#FFD93D" ${st}/></g>`,
        tap: function (api) { api.play(api.anim('castle').querySelector('.flagwave'), 'wiggle'); [659, 784, 1047].forEach(function (f, i) { setTimeout(function () { TW.sound.beep(f); }, i * 140); }); } },
      { id: 'bunny', pos: { L: [480, 410, 1], P: [410, 690, 1] }, hit: [110, 110], say: 'Peekaboo, bunny!',
        draw: `<g class="peek"><ellipse cx="-10" cy="-38" rx="7" ry="20" fill="#fff" ${st}/><ellipse cx="10" cy="-38" rx="7" ry="20" fill="#fff" ${st}/><circle cy="-12" r="20" fill="#fff" ${st}/><circle cx="-7" cy="-14" r="3" fill="${O}"/><circle cx="7" cy="-14" r="3" fill="${O}"/><circle cy="-6" r="3" fill="#FF8FA3"/></g>
<path d="M-50 30 Q-56 0 -30 -4 Q-20 -24 0 -14 Q20 -26 32 -4 Q58 0 50 30 Z" fill="#4CC96B" ${st}/>`,
        tap: function (api) { api.play(api.anim('bunny').querySelector('.peek'), 'peekup'); TW.sound.boing(); } },
      { id: 'fly1', pos: { L: [230, 200, 1], P: [100, 330, 1] }, hit: [112, 112], say: 'Butterfly!',
        draw: butterfly('#FF9CD0', 0), tap: function (api) { api.play('fly1', 'wigspin'); TW.sound.sparkle(); } },
      { id: 'fly2', pos: { L: [880, 440, 1], P: [330, 250, 1] }, hit: [112, 112], say: 'Butterfly!',
        draw: butterfly('#9FD8FF', -2), tap: function (api) { api.play('fly2', 'wigspin'); TW.sound.sparkle(); } }
    ]
  });
})();
