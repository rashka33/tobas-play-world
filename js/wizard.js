// New scene: Wizard World — big-sister pup in a starry hat and robe, in a night-sky room.
(function () {
  const A = TW.art, O = A.O, sp = A.starPath;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

  const HAT = `<path d="M118 -86 Q96 -40 44 36 Q100 54 156 36 Q132 -14 118 -86 Z" fill="#5B3FC4" ${st}/>
<path d="${sp(96, 0, 9, 4)} ${sp(120, 18, 7, 3)} ${sp(86, 28, 6, 2.5)} ${sp(112, -34, 6, 2.5)}" fill="#FFD93D"/>
<ellipse cx="100" cy="38" rx="68" ry="14" fill="#4A30A8" ${st}/><circle cx="118" cy="-88" r="7" fill="#FFD93D" ${st}/>`;
  const ROBE = `<path d="M50 140 Q100 122 150 140 L168 224 Q100 240 32 224 Z" fill="#6A4BD8"/>
<path d="M34 216 Q100 232 166 216" fill="none" stroke="#FFD93D" stroke-width="6"/>
<path d="${sp(76, 186, 8, 3.5)} ${sp(128, 172, 7, 3)} ${sp(104, 206, 6, 2.5)}" fill="#FFD93D" stroke="none"/>`;

  const VISIONS = {
    star: `<path d="${sp(0, -10, 34, 15)}" fill="#FFD93D" ${st}/>`,
    moon: `<path d="M12 -44 A36 36 0 1 0 12 24 A28 28 0 1 1 12 -44 Z" fill="#FFF3B0" ${st}/>`,
    heart: `<path d="M0 22 C-30 2 -32 -22 -16 -30 C-8 -34 -2 -28 0 -22 C2 -28 8 -34 16 -30 C32 -22 30 2 0 22 Z" fill="#FF5A8A" ${st}/>`,
    fish: `<path d="M-30 -10 Q-4 -36 22 -10 Q-4 16 -30 -10 Z" fill="#FF9F45" ${st}/><path d="M20 -10 L40 -26 L40 6 Z" fill="#FF9F45" ${st}/><circle cx="-16" cy="-14" r="4" fill="${O}"/>`
  };
  const GLOWS = ['#FF5AD8', '#5CFFB0', '#FFD93D', '#5CD6FF', '#B98CFF'];

  function wall(L) {
    const rnd = TW.seeded(7), floorY = L === 'L' ? 470 : 720, W = L === 'L' ? 1000 : 600;
    let stars = '';
    for (let i = 0; i < 46; i++) {
      const x = -200 + rnd() * (W + 400), y = -150 + rnd() * (floorY + 120), r = 3 + rnd() * 6;
      stars += `<path class="twinkle" style="animation-delay:${(-rnd() * 3).toFixed(2)}s" d="${sp(x, y, r, r * 0.45)}" fill="#FFF6C2"/>`;
    }
    const shelf = L === 'L' ? [690, 236, 280] : [360, 452, 220];
    return `<rect x="-3000" y="-3000" width="7000" height="${3000 + floorY}" fill="#1E2259"/>${stars}
<rect x="${shelf[0]}" y="${shelf[1]}" width="${shelf[2]}" height="16" rx="6" fill="#8B5A2B" ${st}/>
<rect x="-3000" y="${floorY}" width="7000" height="3000" fill="#3E2C78"/>
<ellipse cx="${W / 2}" cy="${floorY + (L === 'L' ? 70 : 160)}" rx="${L === 'L' ? 380 : 270}" ry="${L === 'L' ? 50 : 90}" fill="#5A3FA0"/>`;
  }

  // The pup trots over to stand beside what was tapped (only things on the floor).
  function walkTo(api, id) {
    const t = api.pos(id), p = api.pos('pup'), L = api.layout();
    const side = t[0] < p[0] ? 1 : -1;
    let x = t[0] + side * (L === 'L' ? 150 : 120);
    x = Math.max(L === 'L' ? 230 : 190, Math.min(L === 'L' ? 760 : 430, x));
    if (Math.abs(x - p[0]) > 20) api.walk('pup', x, null, ['halo', 'wand']);
  }

  const room = TW.makeRoom({
    id: 'wizard',
    state: { vision: 'star', potion: '#FF5AD8', glow: GLOWS[0], gem: 0, brew: 0, moonAwake: false },
    html: `<div class="scope-view"><svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="196" fill="#141846" stroke="#C9A35A" stroke-width="10"/>
<circle cx="200" cy="200" r="118" fill="#FFF3B0" stroke="#E8D27A" stroke-width="5"/>
<circle cx="160" cy="160" r="22" fill="#F1E3A0"/><circle cx="240" cy="230" r="30" fill="#F1E3A0"/><circle cx="170" cy="255" r="13" fill="#F1E3A0"/><circle cx="245" cy="150" r="10" fill="#F1E3A0"/>
<path class="twinkle" d="${sp(300, 110, 16, 7)}" fill="#FFF6C2"/><path class="twinkle" style="animation-delay:-1s" d="${sp(320, 260, 12, 5)}" fill="#FFF6C2"/>
<path class="twinkle" style="animation-delay:-2s" d="${sp(90, 120, 10, 4)}" fill="#FFF6C2"/><path class="twinkle" style="animation-delay:-.5s" d="${sp(280, 320, 9, 4)}" fill="#FFF6C2"/></svg></div>`,
    bg: wall,
    items: [
      { id: 'halo', pos: (L, api) => { const p = api.pos('pup'); return [p[0], p[1], p[2] * 1.04]; },
        draw: api => `<circle class="halo" r="150" fill="${api.state.glow}"/>` },
      { id: 'pup', pos: { L: [480, 350, 1.25], P: [310, 540, 1.3] }, hit: [200, 260], hitDy: 20,
        draw: TW.pupAt('sister', { extra: HAT, outfit: ROBE }),
        say: 'Abracadabra!',
        tap: function (api) { TW.sound.boing(); api.play('pup', 'sqhop'); } },
      { id: 'wand', pos: (L, api) => { const p = api.pos('pup'); return [p[0] + 150 * p[2] / 1.25, p[1] + 30, 1]; }, hit: [130, 150], say: 'Magic wand!',
        draw: `<path d="M-34 56 L34 -44" stroke="${O}" stroke-width="12" stroke-linecap="round"/><path d="M-34 56 L34 -44" stroke="#8B5A2B" stroke-width="6" stroke-linecap="round"/>
<path d="${sp(40, -52, 24, 10)}" fill="#FFD93D" ${st}/>
<path class="twinkle" d="${sp(70, -76, 9, 3.5)}" fill="#FFF6C2"/><path class="twinkle" style="animation-delay:-.8s" d="${sp(12, -82, 7, 3)}" fill="#FFF6C2"/><path class="twinkle" style="animation-delay:-1.6s" d="${sp(74, -30, 6, 2.5)}" fill="#FFF6C2"/>`,
        tap: function (api) {
          const p = api.local('wand', 40, -52);
          TW.fx.burst(p.x, p.y, { count: 22 });
          setTimeout(function () { TW.fx.burst(p.x, p.y, { count: 12, colors: ['#FFFFFF', '#FFF3B0', '#C9A8FF'] }); }, 250);
          TW.sound.chime(); TW.sound.sparkle(); api.play('wand', 'wiggle');
        } },
      { id: 'telescope', pos: { L: [200, 350, 1], P: [110, 450, 0.85] }, hit: [170, 200], say: 'Telescope!',
        draw: `<path d="M0 10 L-44 92 M0 10 L44 92 M0 10 L0 92" stroke="${O}" stroke-width="8" stroke-linecap="round"/>
<g transform="rotate(-32)"><rect x="-76" y="-18" width="128" height="36" rx="10" fill="#C9A35A" ${st}/><rect x="40" y="-25" width="34" height="50" rx="8" fill="#8E6CE0" ${st}/><rect x="-92" y="-11" width="20" height="22" rx="5" fill="#5A5A6A" ${st}/></g>
<circle r="10" fill="#5A5A6A" ${st}/>`,
        tap: function (api) {
          const v = room.el().querySelector('.scope-view');
          if (v.classList.contains('show')) return;
          TW.sound.whoosh(); api.play('telescope', 'press'); walkTo(api, 'telescope');
          v.classList.add('show');
          setTimeout(function () { TW.sound.sparkle(); }, 450);
          setTimeout(function () { v.classList.remove('show'); }, 2400);
        } },
      { id: 'books', pos: { L: [270, 520, 1], P: [130, 860, 0.9] }, hit: [170, 150], say: 'Spell book!',
        draw: `<rect x="-66" y="34" width="132" height="26" rx="5" fill="#E8453C" ${st}/><rect x="-58" y="10" width="118" height="26" rx="5" fill="#3FA7FF" ${st}/><rect x="-62" y="-12" width="124" height="24" rx="5" fill="#4CC96B" ${st}/>
<g transform="translate(0 -40)"><path d="M0 0 Q-35 -10 -70 -4 V30 Q-35 24 0 34 Z" fill="#FFF8E6" ${st}/><path d="M0 0 Q35 -10 70 -4 V30 Q35 24 0 34 Z" fill="#FFF8E6" ${st}/>
<path d="M-56 6 H-14 M-56 16 H-18 M14 6 H56 M18 16 H56" stroke="#C9B49A" stroke-width="3" stroke-linecap="round"/>
<path class="fp" style="animation-delay:0s" d="M0 0 Q35 -10 70 -4 V30 Q35 24 0 34 Z" fill="#FFFDF4" ${st}/>
<path class="fp" style="animation-delay:.22s" d="M0 0 Q35 -10 70 -4 V30 Q35 24 0 34 Z" fill="#FFF3D6" ${st}/>
<path class="fp" style="animation-delay:.44s" d="M0 0 Q35 -10 70 -4 V30 Q35 24 0 34 Z" fill="#FFFDF4" ${st}/></g>`,
        tap: function (api) { TW.sound.flutter(); api.play('books', 'flipping'); walkTo(api, 'books'); } },
      { id: 'potion', pos: { L: [700, 520, 1], P: [310, 880, 0.9] }, hit: [120, 160], say: 'Potion!',
        draw: api => `<path d="M-14 -62 H14 V-36 Q50 -18 50 18 Q50 60 0 60 Q-50 60 -50 18 Q-50 -18 -14 -36 Z" fill="rgba(255,255,255,.5)" ${st}/>
<path d="M-46 10 Q0 -4 46 10 Q48 56 0 56 Q-48 56 -46 10 Z" fill="${api.state.potion}"/>
<rect x="-17" y="-80" width="34" height="20" rx="6" fill="#B5733F" ${st}/><ellipse cx="-24" cy="4" rx="7" ry="14" fill="#fff" opacity=".6"/>`,
        tap: function (api) {
          const s = api.state;
          s.glow = GLOWS[(GLOWS.indexOf(s.glow) + 1) % GLOWS.length];
          s.potion = s.glow;
          api.redraw('potion'); api.redraw('halo');
          api.play('potion', 'wiggle'); api.play('halo', 'glowing');
          const p = api.local('potion', 0, -80);
          TW.fx.bubbles(p.x, p.y, 7, s.glow);
          TW.sound.bloop(); setTimeout(TW.sound.bloop, 200);
          setTimeout(function () { TW.sound.chime(); api.play('pup', 'sqhop'); }, 500);
        } },
      { id: 'crystal', pos: { L: [830, 420, 1], P: [480, 860, 0.9] }, hit: [160, 190], say: 'Crystal ball!',
        draw: api => `<path d="M-52 80 L52 80 L38 44 L-38 44 Z" fill="#8B5A2B" ${st}/>
<circle cy="-10" r="62" fill="#BFE7FF" fill-opacity=".9" ${st}/>
<g class="swirl"><path d="M0 -10 m-34 0 a34 34 0 1 1 34 34 a22 22 0 1 1 -22 -22 a10 10 0 1 1 10 10" fill="none" stroke="#fff" stroke-width="5" opacity=".7" stroke-linecap="round"/></g>
<g class="vision">${VISIONS[api.state.vision]}</g><ellipse cx="-26" cy="-40" rx="12" ry="7" fill="#fff" opacity=".7" transform="rotate(-30 -26 -40)"/>`,
        tap: function (api) {
          const a = api.anim('crystal');
          if (a.classList.contains('swirling')) return;
          a.classList.add('swirling');
          TW.sound.whoosh(); walkTo(api, 'crystal');
          setTimeout(function () {
            const keys = Object.keys(VISIONS).filter(k => k !== api.state.vision);
            api.state.vision = keys[Math.floor(Math.random() * keys.length)];
            api.redraw('crystal');
            a.classList.remove('swirling');
            api.play(api.anim('crystal').querySelector('.vision'), 'pop');
            TW.sound.sparkle();
            const c = api.local('crystal', 0, -10);
            TW.fx.burst(c.x, c.y, { count: 8 });
          }, 700);
        } },
      { id: 'gem', pos: { L: [880, 192, 1], P: [525, 410, 0.9] }, hit: [130, 130], say: 'Sparkly gem!',
        draw: api => { const c = ['#FF4D9A', '#3FD0FF', '#57E08A', '#B57CFF'][api.state.gem];
          return `<path d="M-40 -14 L-22 -40 H22 L40 -14 L0 42 Z" fill="${c}" ${st}/><path d="M-40 -14 H40 M-22 -40 L-10 -14 L0 42 L10 -14 L22 -40" fill="none" stroke="${O}" stroke-width="2.5" opacity=".55"/><path d="M-26 -30 L-14 -30 L-20 -18 Z" fill="#fff" opacity=".7"/>`; },
        tap: function (api) {
          api.state.gem = (api.state.gem + 1) % 4;
          api.redraw('gem'); api.play('gem', 'wigspin');
          const c = api.center('gem');
          TW.fx.burst(c.x, c.y, { count: 12 }); TW.sound.sparkle();
        } },
      { id: 'moon', pos: { L: [330, 110, 1], P: [300, 110, 1] }, hit: [130, 130], say: api => api.state.moonAwake ? 'Hello, moon!' : 'Moon!',
        draw: api => `<path d="M10 -46 A46 46 0 1 0 10 46 A62 62 0 0 1 10 -46 Z" fill="#FFF3B0" ${st}/>` +
          (api.state.moonAwake ? `<circle cx="-22" cy="-8" r="4" fill="${O}"/><path d="M-30 14 Q-20 24 -10 16" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/><circle cx="-30" cy="4" r="5" fill="#FF8FA3" opacity=".6"/>`
            : `<path d="M-28 -8 Q-22 -2 -16 -8" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>`),
        tap: function (api) { api.state.moonAwake = !api.state.moonAwake; api.redraw('moon'); api.play('moon', 'wiggle'); TW.sound.chime(); } },
      { id: 'star', pos: { L: [750, 70, 1], P: [185, 240, 1] }, hit: [110, 120], say: 'Twinkle star!',
        draw: `<path d="M0 -70 V-30" stroke="#C9B49A" stroke-width="3"/><path d="${sp(0, 0, 32, 14)}" fill="#FFD93D" ${st}/><circle cx="-8" cy="-4" r="3" fill="${O}"/><circle cx="8" cy="-4" r="3" fill="${O}"/><path d="M-6 6 Q0 11 6 6" fill="none" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>`,
        tap: function (api) { api.play('star', 'wigspin'); TW.sound.sparkle(); } },
      { id: 'owl', pos: { L: [620, 150, 1], P: [490, 250, 1] }, hit: [110, 130], say: 'Owl! Hoo hoo!',
        draw: `<path d="M-30 40 L30 40" stroke="#8B5A2B" stroke-width="8" stroke-linecap="round"/><ellipse cy="4" rx="34" ry="40" fill="#A0703C" ${st}/><ellipse cy="14" rx="20" ry="24" fill="#E8C99A"/>
<path d="M-30 -28 L-22 -48 L-12 -32 Z M30 -28 L22 -48 L12 -32 Z" fill="#A0703C" ${st}/>
<g class="owl-eyes"><circle cx="-13" cy="-14" r="11" fill="#fff" ${st}/><circle cx="13" cy="-14" r="11" fill="#fff" ${st}/><circle cx="-12" cy="-13" r="5" fill="${O}"/><circle cx="12" cy="-13" r="5" fill="${O}"/></g><path d="M-5 -2 L5 -2 L0 6 Z" fill="#FFB347" ${st}/>`,
        tap: function (api) {
          api.play('owl', 'sqhop');
          [0, 0.35].forEach(function (d) { setTimeout(function () { TW.sound.bloop(); }, d * 1000); });
        } },
      { id: 'candle', pos: { L: [745, 195, 1], P: [415, 410, 0.9] }, hit: [118, 140], say: 'Candle!',
        draw: `<rect x="-14" y="-10" width="28" height="50" rx="5" fill="#FFF3D6" ${st}/><ellipse cy="40" rx="26" ry="8" fill="#C9A35A" ${st}/><g class="flame"><path d="M0 -50 Q14 -30 0 -14 Q-14 -30 0 -50 Z" fill="#FFB347" stroke="#FF7A00" stroke-width="2"/><path d="M0 -38 Q6 -28 0 -20 Q-6 -28 0 -38 Z" fill="#FFF3B0"/></g>`,
        tap: function (api) { api.play(api.anim('candle').querySelector('.flame'), 'bigflame'); TW.sound.sparkle(); const p = api.local('candle', 0, -40); TW.fx.burst(p.x, p.y, { count: 8, colors: ['#FFD93D', '#FFB347', '#FFFFFF'] }); } },
      { id: 'cauldron', pos: { L: [95, 520, 1], P: [110, 690, 1] }, hit: [150, 140], say: api => ['Cauldron!', 'Stir it!', 'One more!'][api.state.brew] || 'Cauldron!',
        draw: api => { const c = ['#57E08A', '#5CD6FF', '#FF7AC6', '#FFD93D'][api.state.brew];
          return `<path d="M-40 52 L-50 70 M40 52 L50 70" stroke="${O}" stroke-width="7" stroke-linecap="round"/>
<path d="M-62 -10 Q-66 60 0 62 Q66 60 62 -10 Z" fill="#3A3A4A" ${st}/><ellipse cy="-10" rx="62" ry="16" fill="${c}" ${st}/>
<g fill="#fff" opacity=".85"><circle class="bub-out" cx="-20" cy="-18" r="7"/><circle class="bub-out" style="animation-delay:-.7s" cx="12" cy="-20" r="5"/><circle class="bub-out" style="animation-delay:-1.3s" cx="30" cy="-16" r="6"/></g>
${[0, 1, 2].map(i => `<path d="${sp(-24 + i * 24, 34, 7, 3)}" fill="${i < api.state.brew ? '#FFD93D' : '#5A5A6A'}"/>`).join('')}`; },
        tap: function (api) {
          const s = api.state;
          walkTo(api, 'cauldron');
          s.brew++;
          const top = api.local('cauldron', 0, -20);
          TW.sound.bloop();
          if (s.brew >= 3) {
            s.brew = 0;
            api.redraw('cauldron'); api.play('cauldron', 'boil');
            TW.fx.bubbles(top.x, top.y, 12, '#C9A8FF');
            TW.fx.burst(top.x, top.y, { count: 30 });
            api.later(function () { api.play('pup', 'sqhop'); api.play('halo', 'glowing'); TW.celebrate('Magic potion!'); }, 400);
          } else {
            api.redraw('cauldron'); api.play('cauldron', 'boil');
            TW.fx.bubbles(top.x, top.y, 4, '#C9A8FF');
          }
        } },
      { id: 'broom', pos: { L: [948, 340, 1], P: [545, 700, 1] }, hit: [112, 190], say: 'Broom!',
        draw: `<path d="M0 -84 L0 40" stroke="${O}" stroke-width="12" stroke-linecap="round"/><path d="M0 -84 L0 40" stroke="#B5733F" stroke-width="6" stroke-linecap="round"/>
<path d="M-6 36 L-28 92 Q0 100 28 92 L6 36 Z" fill="#E8C060" ${st}/><path d="M-14 50 L-20 88 M0 50 L0 92 M14 50 L20 88" stroke="#B8902E" stroke-width="3"/><rect x="-9" y="30" width="18" height="12" rx="3" fill="#E8453C" ${st}/>`,
        tap: function (api) { api.play('broom', 'broomfly'); TW.sound.whoosh(); } }
    ]
  });
})();
