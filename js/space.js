// New scene: Space World — inside a pink-and-purple rocket, baby pup at the window.
(function () {
  const A = TW.art, O = A.O, sp = A.starPath;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

  const ANTENNA = `<path d="M48 66 Q100 0 152 66" fill="none" stroke="${O}" stroke-width="12" stroke-linecap="round"/><path d="M48 66 Q100 0 152 66" fill="none" stroke="#FF6FA8" stroke-width="7" stroke-linecap="round"/>
<path d="M76 36 L60 -4 M124 36 L140 -4" stroke="${O}" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="-6" r="11" fill="#FFD93D" ${st}/><circle cx="140" cy="-6" r="11" fill="#7FE0FF" ${st}/>`;
  const HELMET = ANTENNA + `<circle cx="100" cy="84" r="74" fill="rgba(200,240,255,.35)" stroke="${O}" stroke-width="4"/><path d="M60 40 Q74 26 92 24" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  const BTN = [{ c: '#FF5A6E', f: 523 }, { c: '#FFD23F', f: 659 }, { c: '#3FA7FF', f: 784 }];

  let busy = false, blasting = false;

  function winStars() {
    const rnd = TW.seeded(11);
    let s = '';
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 175, size = 3 + rnd() * 5;
      s += `<path class="twinkle" style="animation-delay:${(-rnd() * 3).toFixed(2)}s" d="${sp(Math.cos(a) * r, Math.sin(a) * r, size, size * 0.45)}" fill="#FFF6C2"/>`;
    }
    let warp = '';
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2 + 0.2, r1 = 30 + (i % 3) * 14;
      warp += `<line style="animation-delay:${(-(i % 5) * 0.09).toFixed(2)}s" x1="${(Math.cos(a) * r1).toFixed(1)}" y1="${(Math.sin(a) * r1).toFixed(1)}" x2="${(Math.cos(a) * (r1 + 34)).toFixed(1)}" y2="${(Math.sin(a) * (r1 + 34)).toFixed(1)}" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
    }
    return { s: s, warp: warp };
  }
  const WS = winStars();

  function button(i) {
    const b = BTN[i];
    return `<ellipse cy="22" rx="56" ry="20" fill="#5A3A8C" ${st}/><circle class="glowring" r="58" fill="${b.c}" opacity="0"/>
<circle r="42" fill="${b.c}" ${st}/><circle class="btn-glow" r="42" fill="#fff"/><ellipse cx="-14" cy="-16" rx="12" ry="8" fill="#fff" opacity=".6"/>`;
  }
  function lightUp(api, i) {
    TW.sound.beep(BTN[i].f);
    api.play('btn' + i, 'lit');
  }

  function bg(L) {
    const W = L === 'L' ? 1000 : 600;
    const con = L === 'L' ? `<path d="M470 600 V500 Q470 470 500 470 H1600 V2000 H470 Z" fill="#8E5BD1" ${st}/><path d="M490 492 H1600" stroke="#B48BEA" stroke-width="10"/>`
      : `<path d="M-400 830 H1000 V2000 H-400 Z" fill="#8E5BD1" ${st}/><path d="M-400 850 H1000" stroke="#B48BEA" stroke-width="10"/>`;
    let ribs = '';
    for (let x = -400; x < W + 400; x += 160) ribs += `<rect x="${x}" y="-3000" width="18" height="7000" fill="#F7C4E2"/>`;
    const LC = ['#FF5A6E', '#FFD23F', '#57E08A', '#3FA7FF'];
    let lights = '';
    for (let i = 0; i < (L === 'L' ? 11 : 12); i++) {
      const x = L === 'L' ? 520 + i * 42 : 52 + i * 45, y = L === 'L' ? 505 : 846;
      lights += `<circle class="cockpit-light" style="animation-delay:${(-(i * 0.37) % 1.6).toFixed(2)}s" cx="${x}" cy="${y}" r="8" fill="${LC[i % 4]}" stroke="${O}" stroke-width="2.5"/>`;
    }
    return `<rect x="-3000" y="-3000" width="7000" height="7000" fill="#F2A7D3"/>${ribs}
<rect x="-3000" y="-3000" width="7000" height="3016" fill="#B07BE0"/>${con}${lights}`;
  }

  TW.makeRoom({
    id: 'space',
    defs: '<clipPath id="spaceClip"><circle r="188"/></clipPath>',
    bg: bg,
    items: [
      { id: 'window', pos: { L: [650, 255, 1], P: [300, 320, 1] }, hit: [380, 380], say: 'Stars!',
        draw: `<circle r="214" fill="#D9D2E8" ${st}/><circle r="190" fill="#1B1747" ${st}/>
<g clip-path="url(#spaceClip)"><circle cx="-120" cy="110" r="90" fill="#2A2470"/><circle cx="130" cy="-120" r="70" fill="#2B1F66"/>${WS.s}<g class="warp">${WS.warp}</g></g>
${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="${(Math.cos(a * Math.PI / 180) * 202).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 202).toFixed(1)}" r="5" fill="#8C83A8"/>`).join('')}`,
        tap: function (api, e) { TW.sound.sparkle(); TW.fx.burst(e.x, e.y, { count: 8, colors: ['#FFF6C2', '#FFFFFF', '#C9A8FF'] }); } },
      { id: 'alien', pos: { L: [650, 255, 1], P: [300, 320, 1] }, say: 'Hello, alien friend!', tap: function (api, e) {
          const arm = api.anim('alien').querySelector('.alien-arm');
          TW.fx.bounce(arm, 'waving'); TW.sound.boing();
          TW.fx.hearts(e.x, e.y - 30, 3);
        },
        draw: `<g class="drift"><rect x="-60" y="-70" width="120" height="130" rx="30" fill="transparent"/>
<path d="M-6 -50 L-12 -72" stroke="${O}" stroke-width="4" stroke-linecap="round"/><circle cx="-12" cy="-74" r="7" fill="#FF7AC6" ${st}/>
<path d="M-38 30 Q-40 -50 0 -50 Q40 -50 38 30 Q20 44 0 34 Q-20 44 -38 30 Z" fill="#8EE07A" ${st}/>
<circle cy="-16" r="16" fill="#fff" ${st}/><circle cx="3" cy="-14" r="7" fill="${O}"/><path d="M-10 12 Q0 20 10 12" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
<g class="alien-arm"><path d="M34 0 Q52 -10 56 -30" fill="none" stroke="${O}" stroke-width="12" stroke-linecap="round"/><path d="M34 0 Q52 -10 56 -30" fill="none" stroke="#8EE07A" stroke-width="7" stroke-linecap="round"/></g></g>` },
      { id: 'planet1', pos: { L: [560, 170, 1], P: [210, 230, 1] }, hit: [130, 120], say: 'Ringed planet!',
        draw: `<circle r="42" fill="#FF9F45" ${st}/><path d="M-30 -14 Q0 -24 34 -8 M-36 10 Q0 0 38 14" fill="none" stroke="#E07B22" stroke-width="5" stroke-linecap="round"/><ellipse rx="66" ry="16" fill="none" stroke="#FFD93D" stroke-width="8" transform="rotate(-18)"/>`,
        tap: function (api) { TW.sound.boing(); api.play('planet1', 'wigspin'); } },
      { id: 'planet2', pos: { L: [745, 330, 1], P: [395, 405, 1] }, hit: [120, 120], say: 'Planet!',
        draw: `<circle r="36" fill="#57D9C4" ${st}/><circle cx="-12" cy="-8" r="8" fill="#3BB3A0"/><circle cx="12" cy="12" r="6" fill="#3BB3A0"/><circle cx="14" cy="-14" r="4" fill="#3BB3A0"/>`,
        tap: function (api) { TW.sound.boing(); api.play('planet2', 'wigspin'); } },
      { id: 'moon', pos: { L: [555, 345, 1], P: [205, 400, 1] }, hit: [110, 110], say: 'Moon!',
        draw: `<circle r="30" fill="#F4F0E0" ${st}/><circle cx="-10" cy="-8" r="7" fill="#DDD6BE"/><circle cx="10" cy="10" r="5" fill="#DDD6BE"/><circle cx="12" cy="-12" r="3.5" fill="#DDD6BE"/>`,
        tap: function (api) { TW.sound.chime(); api.play('moon', 'wigspin'); } },
      { id: 'satellite', pos: { L: [765, 160, 1], P: [400, 220, 1] }, hit: [120, 110], say: 'Satellite! Beep beep!',
        draw: `<rect x="-58" y="-10" width="36" height="20" fill="#3FA7FF" ${st}/><rect x="22" y="-10" width="36" height="20" fill="#3FA7FF" ${st}/><path d="M-58 0 H58" stroke="${O}" stroke-width="2"/>
<rect x="-16" y="-16" width="32" height="32" rx="6" fill="#D9D2E8" ${st}/><path d="M0 -16 V-30" stroke="${O}" stroke-width="3"/><circle class="cockpit-light" cy="-32" r="5" fill="#FF5A6E"/>`,
        tap: function (api) { TW.sound.beep(1320); setTimeout(function () { TW.sound.beep(1568); }, 150); api.play('satellite', 'wigspin'); } },
      { id: 'pup', pos: { L: [300, 430, 1.15], P: [300, 650, 1.1] }, hit: [190, 230], hitDy: 10, say: 'Wheee!',
        draw: api => '<g class="float-y">' + TW.pupAt('baby', { extra: api.state.helmet ? HELMET : ANTENNA }) + '</g>',
        tap: function (api, e) { TW.sound.boing(); api.play('pup', 'bounce'); TW.fx.hearts(e.x, e.y - 40, 2); } },
      { id: 'helmet', pos: { L: [110, 300, 1], P: [90, 600, 1] }, hit: [120, 120], say: api => api.state.helmet ? 'Space helmet on!' : 'Helmet off!',
        draw: api => `<path d="M0 -60 V-40" stroke="#8C83A8" stroke-width="6"/><circle cy="-62" r="6" fill="#8C83A8"/><g${api.state.helmet ? ' opacity=".3"' : ''}><circle r="40" fill="rgba(200,240,255,.55)" ${st}/><rect x="-34" y="26" width="68" height="18" rx="8" fill="#FFFFFF" ${st}/><path d="M-20 -22 Q-10 -32 4 -30" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/></g>`,
        tap: function (api) { api.state.helmet = !api.state.helmet; api.redraw('helmet'); api.redraw('pup'); api.play('pup', 'sqhop'); TW.sound.boing(); } },
      { id: 'snack', pos: { L: [110, 450, 1], P: [90, 760, 1] }, hit: [110, 120], say: 'Space snack! Yum!',
        draw: `<g class="float-y"><path d="M-26 -36 H26 L30 36 Q0 46 -30 36 Z" fill="#C0C6D0" ${st}/><rect x="-26" y="-46" width="52" height="14" rx="5" fill="#FF9F45" ${st}/><circle cy="4" r="14" fill="#FFD93D" ${st}/><path d="M-6 0 L0 8 L8 -4" fill="none" stroke="${O}" stroke-width="3"/></g>`,
        tap: function (api) { api.play('pup', 'munch'); TW.sound.munch(); const c = api.center('pup'); TW.fx.hearts(c.x, c.y - 30, 3); } },
      { id: 'toystar', pos: { L: [110, 560, 1], P: [515, 745, 1] }, hit: [110, 110], say: 'Star friend!',
        draw: `<g class="float-y" style="animation-delay:-1.4s"><path d="${sp(0, 0, 36, 16)}" fill="#FFD93D" ${st}/><circle cx="-9" cy="-3" r="3.5" fill="${O}"/><circle cx="9" cy="-3" r="3.5" fill="${O}"/><path d="M-7 7 Q0 13 7 7" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/></g>`,
        tap: function (api) { api.play('toystar', 'wigspin'); TW.sound.sparkle(); } },
      { id: 'radar', pos: { L: [310, 170, 1], P: [510, 620, 1] }, hit: [140, 110], say: 'Radar! Beep!',
        draw: `<rect x="-62" y="-44" width="124" height="88" rx="14" fill="#5A3A8C" ${st}/><circle r="34" fill="#173A2E" ${st}/><circle r="22" fill="none" stroke="#3BD68A" stroke-width="2"/><circle r="10" fill="none" stroke="#3BD68A" stroke-width="2"/><g class="sweep"><path d="M0 0 L0 -32" stroke="#7CFFB8" stroke-width="4" stroke-linecap="round"/></g><circle class="cockpit-light" cx="14" cy="-12" r="4" fill="#7CFFB8"/>`,
        tap: function (api) { TW.sound.beep(988); setTimeout(function () { TW.sound.beep(1318); }, 180); api.play(api.anim('radar').querySelector('.sweep'), 'fastsweep'); } },
      { id: 'btn0', pos: { L: [560, 555, 1], P: [110, 910, 1] }, hit: [124, 120], draw: button(0), tap: tapBtn(0), say: 'Red!' },
      { id: 'btn1', pos: { L: [690, 555, 1], P: [240, 910, 1] }, hit: [124, 120], draw: button(1), tap: tapBtn(1), say: 'Yellow!' },
      { id: 'btn2', pos: { L: [820, 555, 1], P: [370, 910, 1] }, hit: [124, 120], draw: button(2), tap: tapBtn(2), say: 'Blue!' },
      { id: 'lever', pos: { L: [935, 520, 1], P: [510, 890, 1] }, hit: [120, 170], hitDy: -20,
        draw: `<rect x="-34" y="20" width="68" height="40" rx="10" fill="#5A3A8C" ${st}/><g class="stick"><path d="M0 34 V-60" stroke="${O}" stroke-width="14" stroke-linecap="round"/><path d="M0 34 V-60" stroke="#C9CED6" stroke-width="8" stroke-linecap="round"/><circle cy="-70" r="20" fill="#FF5A6E" ${st}/></g>`,
        tap: function (api) {
          if (blasting) return;
          blasting = true;
          const el = api.el();
          api.anim('lever').classList.add('pulled');
          TW.voice.say('Three, two, one, blast off!');
          el.classList.add('blast');
          TW.sound.whoosh(); TW.sound.rumble(3);
          setTimeout(function () {
            el.classList.remove('blast');
            api.anim('lever').classList.remove('pulled');
            blasting = false;
            TW.sound.chime();
            TW.celebrate('We landed!');
            api.play('pup', 'somersault');
            const c = api.center('window');
            TW.fx.burst(c.x, c.y, { count: 14 });
          }, 3000);
        } }
    ]
  });

  function tapBtn(i) {
    return function (api) {
      if (busy) { lightUp(api, i); return; }
      busy = true;
      lightUp(api, i);
      [0, 1, 2].forEach(function (k) { setTimeout(function () { lightUp(api, k); }, 380 + k * 300); });
      setTimeout(function () { busy = false; }, 380 + 3 * 300);
    };
  }
})();
