// New scene: Scientist Lab — mum pup in a lab coat with a friendly robot. Nothing ever explodes.
(function () {
  const A = TW.art, O = A.O, sp = A.starPath;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const COLORS = ['#FF6B9E', '#4CC9F0', '#9BE15D', '#FFD23F', '#B57CFF', '#FF9F45'];

  const COAT = `<path d="M46 140 Q100 122 154 140 L164 226 Q100 240 36 226 Z" fill="#F7FBFF"/>
<path d="M84 134 L100 178 L116 134" fill="none"/><rect x="118" y="186" width="24" height="20" rx="3" fill="#E3EEF7"/><path d="M126 186 V174" stroke="#3FA7FF" stroke-width="5"/>`;
  const GOGGLES = `<path d="M42 84 H158" stroke="${O}" stroke-width="11" stroke-linecap="round"/><path d="M42 84 H158" stroke="#6BC1FF" stroke-width="6" stroke-linecap="round"/>
<g fill="rgba(210,245,255,.22)" stroke="#2F7FC0" stroke-width="5"><rect x="58" y="68" width="40" height="32" rx="12"/><rect x="102" y="68" width="40" height="32" rx="12"/></g>`;

  const CNAME = { '#FF6B9E': 'Pink!', '#4CC9F0': 'Blue!', '#9BE15D': 'Green!', '#FFD23F': 'Yellow!', '#B57CFF': 'Purple!', '#FF9F45': 'Orange!' };
  const SHAPES = [
    ['Circle!', `<circle r="20" fill="#FFD23F"/>`], ['Square!', `<rect x="-18" y="-18" width="36" height="36" fill="#FF6B9E"/>`],
    ['Triangle!', `<path d="M0 -22 L22 18 H-22 Z" fill="#57E08A"/>`], ['Star!', `<path d="${sp(0, 0, 24, 10)}" fill="#4CC9F0"/>`], ['Heart!', `<path d="M0 18 C-24 2 -24 -18 -10 -20 C-4 -21 -1 -16 0 -12 C1 -16 4 -21 10 -20 C24 -18 24 2 0 18 Z" fill="#FF6B9E"/>`]];
  function tube(color) {
    return `<rect x="-14" y="-20" width="28" height="64" rx="14" fill="${color}"/>
<g fill="#fff"><circle class="bub-out" cx="0" cy="-48" r="5"/><circle class="bub-out" style="animation-delay:-.8s" cx="4" cy="-50" r="4"/></g>
<rect x="-16" y="-58" width="32" height="104" rx="16" fill="rgba(255,255,255,.25)" ${st}/><rect x="-20" y="-62" width="40" height="10" rx="4" fill="#E6F2FA" ${st}/>`;
  }
  function tubeItem(i, L, P) {
    const id = 'tube' + i;
    return { id: id, pos: { L: L, P: P }, hit: [104, 130], say: 'Test tube!',
      draw: api => tube(api.state.tubes[i]),
      tap: function (api) {
        const s = api.state;
        s.tubes[i] = COLORS[(COLORS.indexOf(s.tubes[i]) + 2) % COLORS.length];
        api.redraw(id); api.play(id, 'boil'); TW.sound.bloop(); api.play('pup', 'sqhop');
        const t = api.local(id, 0, -60); TW.fx.bubbles(t.x, t.y, 3, s.tubes[i]);
      } };
  }
  const POT = [
    '', `<path d="M0 -20 V-34" stroke="#3DAA5C" stroke-width="5" stroke-linecap="round"/><ellipse cx="7" cy="-36" rx="9" ry="5" fill="#57E08A" ${st}/>`,
    `<path d="M0 -20 V-60" stroke="#3DAA5C" stroke-width="5" stroke-linecap="round"/><ellipse cx="-12" cy="-44" rx="13" ry="6" fill="#57E08A" ${st}/><ellipse cx="12" cy="-54" rx="13" ry="6" fill="#57E08A" ${st}/>`,
    `<path d="M0 -20 V-62" stroke="#3DAA5C" stroke-width="5" stroke-linecap="round"/><ellipse cx="-12" cy="-40" rx="13" ry="6" fill="#57E08A" ${st}/>` +
      [0, 72, 144, 216, 288].map(a => `<circle cx="${(Math.cos(a * Math.PI / 180) * 12).toFixed(1)}" cy="${(-70 + Math.sin(a * Math.PI / 180) * 12).toFixed(1)}" r="10" fill="#FF6B9E" ${st}/>`).join('') + `<circle cy="-70" r="7" fill="#FFD23F" ${st}/>`];

  function mix(a, b) {
    const n = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16));
    const x = n(a), y = n(b);
    return '#' + x.map((v, i) => Math.round((v + y[i]) / 2).toString(16).padStart(2, '0')).join('');
  }

  function flask(color) {
    return `<path d="M-30 14 H30 L44 46 Q46 56 36 56 H-36 Q-46 56 -44 46 Z" fill="${color}"/>
<g class="bubs" fill="#fff" opacity=".8"><circle class="bub" cx="-14" cy="48" r="5"/><circle class="bub" style="animation-delay:-.6s" cx="6" cy="50" r="4"/><circle class="bub" style="animation-delay:-1.1s" cx="20" cy="46" r="3.5"/></g>
<path d="M-14 -60 H14 V-24 L44 46 Q46 56 36 56 H-36 Q-46 56 -44 46 L-14 -24 Z" fill="rgba(255,255,255,.25)" ${st}/>
<g fill="${color}" stroke="${O}" stroke-width="2"><circle class="bub-out" cx="-4" cy="-72" r="6"/><circle class="bub-out" style="animation-delay:-.9s" cx="6" cy="-74" r="4.5"/></g>
<rect x="-19" y="-68" width="38" height="10" rx="4" fill="#E6F2FA" ${st}/><path d="M-26 30 L-34 46" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  }

  function flaskItem(i, L, P) {
    const id = 'flask' + i;
    return {
      id: id, pos: { L: L, P: P }, hit: [108, 140], say: api => CNAME[api.state.flasks[i]],
      draw: api => flask(api.state.flasks[i]),
      tap: function (api) {
        const s = api.state;
        s.flasks[i] = COLORS[(COLORS.indexOf(s.flasks[i]) + 1) % COLORS.length];
        api.redraw(id); api.play(id, 'boil'); TW.sound.bloop();
        const top = api.local(id, 0, -66);
        TW.fx.bubbles(top.x, top.y, 3, s.flasks[i]);
        if (s.last !== null && s.last !== i) {
          s.beaker = mix(s.flasks[s.last], s.flasks[i]);
          s.last = null;
          setTimeout(function () {
            api.redraw('beaker'); api.play('beaker', 'boil'); TW.sound.fizz();
            const b = api.local('beaker', 0, -60);
            TW.fx.bubbles(b.x, b.y, 8, s.beaker);
            TW.fx.burst(b.x, b.y, { count: 10, colors: [s.beaker, '#FFFFFF', '#FFF3B0'] });
            api.play('pup', 'sqhop'); api.play('robot', 'dance');
            TW.celebrate('A new potion!');
          }, 250);
        } else {
          s.last = i;
        }
      }
    };
  }

  const ROBOT = `<circle cx="-28" cy="74" r="14" fill="#5A5A6A" ${st}/><circle cx="28" cy="74" r="14" fill="#5A5A6A" ${st}/>
<rect x="-62" y="10" width="20" height="40" rx="10" fill="#9FD8FF" ${st} transform="rotate(20 -52 14)"/><rect x="42" y="10" width="20" height="40" rx="10" fill="#9FD8FF" ${st} transform="rotate(-20 52 14)"/>
<rect x="-48" y="0" width="96" height="66" rx="16" fill="#9FD8FF" ${st}/>
<circle class="rl" cx="-20" cy="26" r="8" fill="#FF6B6B" ${st}/><circle class="rl" style="animation-delay:.12s" cx="0" cy="26" r="8" fill="#FFD23F" ${st}/><circle class="rl" style="animation-delay:.24s" cx="20" cy="26" r="8" fill="#57E08A" ${st}/>
<rect x="-20" y="44" width="40" height="10" rx="5" fill="#E6F6FF" ${st}/>
<rect x="-9" y="-12" width="18" height="14" fill="#C8ECFF" ${st}/>
<path d="M0 -70 V-90" stroke="${O}" stroke-width="4"/><circle class="rl" cx="0" cy="-94" r="9" fill="#FF6B6B" ${st}/>
<rect x="-44" y="-72" width="88" height="62" rx="18" fill="#C8ECFF" ${st}/>
<rect x="-32" y="-60" width="64" height="34" rx="10" fill="#2E3A59"/><circle cx="-14" cy="-44" r="7" fill="#7FF0FF"/><circle cx="14" cy="-44" r="7" fill="#7FF0FF"/>
<path d="M-10 -22 Q0 -16 10 -22" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`;

  function arm(thumbs) {
    const hand = thumbs
      ? `<g transform="translate(-112 -100)"><rect x="-20" y="-18" width="34" height="36" rx="12" fill="#FFD23F" ${st}/><rect x="-46" y="-22" width="34" height="14" rx="7" fill="#FFD23F" ${st}/></g>`
      : `<g transform="translate(-112 -100)"><path d="M10 -8 L-18 -24 L-24 -14 L-4 0 L-24 14 L-18 24 L10 8 Z" fill="#FFD23F" ${st}/></g>`;
    return `<rect x="-42" y="40" width="84" height="34" rx="10" fill="#7C8796" ${st}/>
<rect x="-13" y="-100" width="26" height="144" rx="12" fill="#FF9F45" ${st}/>
<g class="fore"><rect x="-104" y="-112" width="104" height="24" rx="12" fill="#FF9F45" ${st}/>${hand}<circle cy="-100" r="17" fill="#7C8796" ${st}/></g>`;
  }

  function bg(L) {
    const rack = L === 'L' ? `<rect x="90" y="590" width="350" height="16" rx="6" fill="#8B5A2B" ${st}/>` : `<rect x="10" y="900" width="200" height="14" rx="6" fill="#8B5A2B" ${st}/>`;
    const W = L === 'L' ? 1000 : 600;
    let tiles = '';
    for (let x = -400; x < W + 400; x += 60) tiles += `<path d="M${x} -3000 V3000" stroke="#CBEDE3" stroke-width="3"/>`;
    for (let y = -400; y < 1200; y += 60) tiles += `<path d="M-3000 ${y} H4000" stroke="#CBEDE3" stroke-width="3"/>`;
    const shelf = L === 'L' ? [560, 110, 300] : [240, 200, 200];
    let jars = '';
    ['#FF9CD0', '#7FD6FF', '#FFE066', '#9BE15D'].slice(0, L === 'L' ? 4 : 3).forEach(function (c, i) {
      const x = shelf[0] + 30 + i * 70;
      jars += `<rect x="${x}" y="${shelf[1] - 52}" width="44" height="52" rx="10" fill="${c}" ${st}/><rect x="${x + 6}" y="${shelf[1] - 62}" width="32" height="12" rx="4" fill="#fff" ${st}/>`;
    });
    return `<rect x="-3000" y="-3000" width="7000" height="7000" fill="#E2F6EF"/>${tiles}${jars}
<rect x="${shelf[0]}" y="${shelf[1]}" width="${shelf[2]}" height="14" rx="6" fill="#8B5A2B" ${st}/>` + '<!--rack-->';
  }

  TW.makeRoom({
    id: 'lab',
    state: { flasks: ['#FF6B9E', '#4CC9F0', '#9BE15D'], last: null, beaker: null, thumbs: false, tubes: ['#FFD23F', '#B57CFF', '#FF9F45'], pot: 0, shape: 0 },
    html: `<div class="scope-view lab-scope"><svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="196" fill="#E9FFF4" stroke="#7C8796" stroke-width="12"/>
${[[130, 140, '#9BE15D'], [260, 150, '#FF9CD0'], [190, 270, '#7FD6FF'], [290, 270, '#FFE066']].map(c => `<g transform="translate(${c[0]} ${c[1]})"><circle r="44" fill="${c[2]}" stroke="#4a2e1c" stroke-width="4" opacity=".9"/><circle cx="-14" cy="-8" r="5" fill="#4a2e1c"/><circle cx="14" cy="-8" r="5" fill="#4a2e1c"/><path d="M-12 10 Q0 22 12 10" fill="none" stroke="#4a2e1c" stroke-width="4" stroke-linecap="round"/></g>`).join('')}</svg></div>`,
    bg: bg,
    items: [
      { id: 'pup', pos: { L: [150, 305, 1.18], P: [150, 455, 1.2] }, hit: [190, 240], hitDy: 10,
        draw: TW.pupAt('mum', { outfit: COAT, extra: A.FAMILY.mum.extra + GOGGLES }),
        say: 'Science is fun!',
        tap: function (api) { TW.sound.boing(); api.play('pup', 'sqhop'); } },
      { id: 'robot', pos: { L: [345, 365, 1], P: [350, 525, 1.05] }, hit: [140, 190], hitDy: -6,
        draw: ROBOT, say: 'Beep boop! Robot!',
        tap: function (api) {
          [880, 1175, 660, 1320].forEach(function (f, i) { setTimeout(function () { TW.sound.beep(f); }, i * 140); });
          api.play('robot', 'dance');
        } },
      { id: 'arm', pos: { L: [920, 345, 1], P: [527, 480, 1] }, hit: [150, 240], hitDy: -30,
        draw: api => arm(api.state.thumbs), say: 'Robot arm!',
        tap: function (api) { waveArm(api); } },
      { id: 'bench', pos: function (L) { return L === 'L' ? [500, 450, 1] : [300, 610, 1]; },
        draw: `<rect x="-700" y="0" width="1400" height="600" fill="#9AA9BA" ${st}/><rect x="-700" y="0" width="1400" height="26" fill="#C8D3DF" ${st}/>` },
      flaskItem(0, [470, 395, 1], [90, 715, 1.2]),
      flaskItem(1, [585, 395, 1], [225, 715, 1.2]),
      flaskItem(2, [700, 395, 1], [360, 715, 1.2]),
      { id: 'beaker', pos: { L: [820, 380, 1], P: [500, 705, 1.15] }, hit: [130, 160],
        draw: api => {
          const liquid = api.state.beaker ? `<path d="M-51 -20 H51 V58 Q51 66 43 66 H-43 Q-51 66 -51 58 Z" fill="${api.state.beaker}"/>
<g fill="#fff" opacity=".8"><circle class="bub" cx="-20" cy="56" r="6"/><circle class="bub" style="animation-delay:-.5s" cx="10" cy="58" r="5"/><circle class="bub" style="animation-delay:-1s" cx="30" cy="54" r="4"/></g>` : '';
          return `${liquid}<path d="M-55 -70 H55 V60 Q55 72 43 72 H-43 Q-55 72 -55 60 Z" fill="rgba(255,255,255,.25)" ${st}/><path d="M-64 -72 H64" stroke="${O}" stroke-width="6" stroke-linecap="round"/>
<path d="M-55 -30 H-38 M-55 0 H-38 M-55 30 H-38" stroke="${O}" stroke-width="3"/><path d="M38 -50 V40" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>`;
        },
        say: 'Beaker!',
        tap: function (api) { api.play('beaker', 'wiggle'); TW.sound.bloop(); } },
      { id: 'button', pos: { L: [580, 545, 1], P: [300, 900, 1.3] }, hit: [150, 120],
        draw: `<rect x="-64" y="0" width="128" height="34" rx="10" fill="#5A5A6A" ${st}/><path d="M-46 2 Q-46 -56 0 -56 Q46 -56 46 2 Z" fill="#FF3B3B" ${st}/><ellipse cx="-16" cy="-34" rx="12" ry="7" fill="#fff" opacity=".6"/>`,
        say: 'Big red button!',
        tap: function (api) { api.play('button', 'press'); TW.sound.pop(); waveArm(api); } },
      tubeItem(0, [150, 550, 1], [60, 840, 1]),
      tubeItem(1, [265, 550, 1], [160, 840, 1]),
      tubeItem(2, [380, 550, 1], [110, 945, 1]),
      { id: 'pot', pos: { L: [710, 550, 1], P: [500, 840, 1] }, hit: [110, 120], hitDy: -10,
        say: api => ['A tiny seed!', 'A sprout!', 'Leaves!', 'A flower!'][api.state.pot],
        draw: api => POT[api.state.pot] + `<path d="M-30 -20 H30 L24 30 H-24 Z" fill="#C8693A" ${st}/><rect x="-34" y="-28" width="68" height="12" rx="4" fill="#E07B4A" ${st}/>` + (api.state.pot ? '' : `<ellipse cy="-26" rx="5" ry="3.5" fill="#8B5A2B"/>`),
        tap: function (api) {
          api.state.pot = (api.state.pot + 1) % 4;
          api.redraw('pot'); api.play('pot', 'sqhop'); TW.sound.bloop();
          if (api.state.pot === 3) { const c = api.local('pot', 0, -70); TW.fx.burst(c.x, c.y, { count: 14 }); TW.sound.chime(); api.play('pup', 'sqhop'); }
        } },
      { id: 'microscope', pos: { L: [860, 545, 1], P: [510, 945, 1] }, hit: [110, 110], say: 'Microscope! Hello, tiny friends!',
        draw: `<rect x="-36" y="34" width="72" height="12" rx="5" fill="#7C8796" ${st}/><path d="M-10 34 Q-34 0 -6 -30" fill="none" stroke="${O}" stroke-width="12" stroke-linecap="round"/><path d="M-10 34 Q-34 0 -6 -30" fill="none" stroke="#C9CED6" stroke-width="7" stroke-linecap="round"/>
<g transform="rotate(25)"><rect x="-10" y="-50" width="22" height="50" rx="6" fill="#FFFFFF" ${st}/><rect x="-6" y="-60" width="14" height="12" rx="3" fill="#7C8796" ${st}/></g><rect x="-24" y="12" width="48" height="8" rx="3" fill="#7FD6FF" ${st}/>`,
        tap: function (api) {
          const v = api.el().querySelector('.lab-scope');
          if (v.classList.contains('show')) return;
          v.classList.add('show'); TW.sound.whoosh(); setTimeout(TW.sound.sparkle, 450);
          setTimeout(function () { v.classList.remove('show'); }, 2300);
        } },
      { id: 'computer', pos: { L: [420, 170, 1], P: [110, 230, 1] }, hit: [140, 110], say: api => SHAPES[api.state.shape][0],
        draw: api => `<rect x="-60" y="-42" width="120" height="78" rx="10" fill="#5A5A6A" ${st}/><rect x="-50" y="-33" width="100" height="58" rx="5" fill="#173A2E"/><g transform="translate(0 -4)">${SHAPES[api.state.shape][1]}</g><rect x="-14" y="36" width="28" height="12" fill="#7C8796" ${st}/>`,
        tap: function (api) { api.state.shape = (api.state.shape + 1) % SHAPES.length; api.redraw('computer'); TW.sound.beep(1046); api.play('computer', 'pop'); } }
    ]
  });

  function waveArm(api) {
    if (api.state.thumbs) return;
    api.state.thumbs = true;
    api.redraw('arm');
    api.anim('arm').classList.add('waving-arm');
    TW.sound.beep(988); setTimeout(function () { TW.sound.chime(); }, 300);
    const h = api.center('arm');
    TW.fx.burst(h.x, h.y - 60, { count: 8 });
    setTimeout(function () {
      api.state.thumbs = false;
      api.anim('arm').classList.remove('waving-arm');
      api.redraw('arm');
    }, 2300);
  }
})();
