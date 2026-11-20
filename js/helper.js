// New scene: Little Helper — chores with Mum Pup: laundry, dishes, toys and a thirsty plant.
(function () {
  const A = TW.art, O = A.O, sp = A.starPath;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

  const CHORES = {
    laundry: { box: 'basket', items: ['shirt', 'sock', 'pants'] },
    dishes: { box: 'sink', items: ['plate', 'cup', 'bowl'] },
    toys: { box: 'toybox', items: ['ball', 'block', 'rubberduck'] }
  };
  const ITEM_SAY = { shirt: 'Shirt!', sock: 'Sock!', pants: 'Trousers!', plate: 'Plate!', cup: 'Cup!', bowl: 'Bowl!', ball: 'Ball!', block: 'Block!', rubberduck: 'Rubber duck!' };
  const DIRT = `<g fill="#B5845A" opacity=".75"><circle cx="-12" cy="-4" r="5"/><circle cx="10" cy="6" r="4"/><circle cx="4" cy="-12" r="3"/></g>`;
  const ART = {
    shirt: `<path d="M-24 -30 L-44 -16 L-36 -2 L-26 -8 V34 H26 V-8 L36 -2 L44 -16 L24 -30 Q0 -18 -24 -30 Z" fill="#3FA7FF" ${st}/>`,
    sock: `<path d="M-14 -36 H14 V10 Q16 30 0 36 H-28 Q-40 32 -36 22 Q-30 12 -14 10 Z" fill="#FF7AC6" ${st}/><path d="M-14 -20 H14 M-14 -6 H14" stroke="#fff" stroke-width="6"/>`,
    pants: `<path d="M-26 -34 H26 L30 36 H8 L0 -4 L-8 36 H-30 Z" fill="#4CC96B" ${st}/><path d="M-26 -24 H26" stroke="#2E9E4F" stroke-width="4"/>`,
    plate: `<ellipse rx="44" ry="16" fill="#fff" ${st}/><ellipse rx="28" ry="9" fill="#EEF4FA"/>` + DIRT,
    cup: `<path d="M-24 -26 H24 L20 26 H-20 Z" fill="#FFD93D" ${st}/><path d="M24 -14 Q42 -12 38 6 Q34 16 22 12" fill="none" ${st}/>` + DIRT,
    bowl: `<path d="M-44 -10 H44 Q40 34 0 34 Q-40 34 -44 -10 Z" fill="#B57CFF" ${st}/><ellipse cy="-10" rx="44" ry="10" fill="#D9C2FF" ${st}/>` + DIRT,
    ball: `<circle r="32" fill="#fff" ${st}/><path d="M0 -32 Q20 0 0 32" fill="#FF5A6E" ${st}/><path d="M0 -32 Q-20 0 0 32" fill="#FFD93D" ${st}/>`,
    block: `<rect x="-30" y="-30" width="60" height="60" rx="8" fill="#FF9F45" ${st}/><path d="M-12 18 L0 -16 L12 18 M-7 6 H7" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`,
    rubberduck: `<ellipse cx="4" cy="12" rx="34" ry="20" fill="#FFE066" ${st}/><circle cx="-14" cy="-16" r="18" fill="#FFE066" ${st}/><path d="M-30 -14 L-46 -10 L-30 -4 Z" fill="#FF9F45" ${st}/><circle cx="-18" cy="-20" r="3.5" fill="${O}"/>`
  };

  const POS = {
    L: { can: [210, 225, 1], plant: [330, 215, 1], plate: [585, 270, 1], cup: [690, 270, 1], bowl: [795, 270, 1], sink: [925, 265, 1],
      basket: [90, 520, 1], shirt: [210, 470, 1], sock: [320, 470, 1], pants: [265, 565, 1],
      ball: [585, 525, 1], block: [690, 525, 1], rubberduck: [795, 525, 1], toybox: [910, 525, 1], mum: [450, 360, 0.85], sister: [545, 400, 0.7] },
    P: { plate: [200, 260, 1], cup: [305, 260, 1], bowl: [410, 260, 1], sink: [525, 255, 1], can: [80, 420, 1], plant: [200, 410, 1],
      mum: [380, 450, 0.85], sister: [500, 470, 0.7], shirt: [100, 640, 1], sock: [205, 640, 1], pants: [310, 640, 1], basket: [470, 660, 1],
      ball: [100, 860, 1], block: [205, 860, 1], rubberduck: [310, 860, 1], toybox: [470, 860, 1] }
  };
  function pos(id) { return { L: POS.L[id], P: POS.P[id] }; }

  function choreOf(item) { return Object.keys(CHORES).find(c => CHORES[c].items.includes(item)); }
  function boxCount(api, chore) { return CHORES[chore].items.filter(i => api.state.done[i]).length; }

  function shine(api, id, line) {
    const c = api.center(id);
    TW.fx.burst(c.x, c.y, { count: 22, colors: ['#FFFFFF', '#FFF3B0', '#BDEBFF', '#FFD93D'] });
    TW.fx.twinkle(c.x - 30, c.y - 30, '#FFFFFF'); TW.fx.twinkle(c.x + 30, c.y - 10, '#FFF3B0');
    TW.sound.sparkle();
    TW.voice.say(line || 'Great helper!');
    api.play('mum', 'sqhop');
  }

  // The little pup trots toward whatever job she's helping with.
  function sisterGo(api, id) {
    const t = api.pos(id), L = api.layout();
    const x = Math.max(L === 'L' ? 470 : 440, Math.min(L === 'L' ? 640 : 540, t[0]));
    const p = api.pos('sister');
    if (Math.abs(x - p[0]) > 20) api.walk('sister', x, null, [], 800);
    else api.play('sister', 'sqhop');
  }

  function tidy(item) {
    return function (api) {
      const s = api.state;
      if (s.done[item] || s.flying) return;
      const chore = choreOf(item), box = CHORES[chore].box, b = api.pos(box);
      s.flying = true;
      sisterGo(api, box);
      api.node(item).style.transition = 'transform .6s cubic-bezier(.4,0,.6,1)';
      api.setPos(item, [b[0], b[1] - 30, 0.4]);
      TW.voice.say(ITEM_SAY[item]);
      if (chore === 'laundry') TW.sound.whoosh();
      if (chore === 'toys') TW.sound.boing();
      api.later(function () {
        s.flying = false;
        api.node(item).style.transition = '';
        s.done[item] = true;
        api.show(item, false);
        api.redraw(box); api.play(box, 'sqhop');
        if (chore === 'dishes') { const c = api.center('sink'); TW.fx.bubbles(c.x, c.y - 20, 5); TW.sound.drip(); }
        else TW.sound.plop();
        if (boxCount(api, chore) === 3) { s.chores[chore] = true; shine(api, box); checkAll(api); }
      }, 620);
      setTimeout(function () { s.flying = false; }, 900);
    };
  }

  function checkAll(api) {
    const s = api.state;
    if (!['laundry', 'dishes', 'toys', 'plant'].every(c => s.chores[c]) || s.hugging) return;
    s.hugging = true;
    api.later(function () {
      const sis = api.pos('sister'), L = api.layout();
      api.walk('mum', sis[0] - (L === 'L' ? 85 : 75), sis[1] - 20, [], 900);
      api.later(function () {
        api.anim('mum').style.setProperty('--lean', '10deg');
        api.anim('sister').style.setProperty('--lean', '-10deg');
        api.play('mum', 'hug'); api.play('sister', 'hug');
        const c = api.center('sister');
        TW.fx.hearts(c.x - 30, c.y - 40, 10);
        TW.celebrate('You are a great helper! Thank you!');
      }, 1000);
      api.later(function () { reset(api); }, 7500);
    }, 1400);
    setTimeout(function () { if (!api.active()) reset(api); }, 9000);
  }

  function reset(api) {
    const s = api.state;
    Object.keys(s.done).forEach(function (k) { s.done[k] = false; api.clearPos(k); api.show(k, true); api.play(k, 'pop'); });
    Object.keys(s.chores).forEach(function (k) { s.chores[k] = false; });
    s.plant = false; s.hugging = false;
    ['basket', 'sink', 'toybox', 'plant'].forEach(function (k) { api.redraw(k); });
    api.clearPos('mum'); api.clearPos('sister');
  }

  function itemProp(id) {
    return { id: id, pos: pos(id), hit: [105, 105], draw: ART[id], tap: tidy(id) };
  }

  function bg(L) {
    const W = L === 'L' ? 1000 : 600, fy = L === 'L' ? 430 : 600;
    const win = L === 'L' ? [190, 60, 200, 170] : [30, 300, 230, 150];
    const counter = L === 'L' ? `<rect x="530" y="305" width="520" height="22" rx="6" fill="#F2D3B0" ${st}/><rect x="540" y="327" width="510" height="100" fill="#E0B98E" ${st}/>`
      : `<rect x="140" y="292" width="500" height="20" rx="6" fill="#F2D3B0" ${st}/><rect x="150" y="312" width="490" height="60" fill="#E0B98E" ${st}/>`;
    const sill = L === 'L' ? `<rect x="150" y="282" width="270" height="16" rx="6" fill="#FFFFFF" ${st}/>` : `<rect x="20" y="478" width="260" height="14" rx="6" fill="#FFFFFF" ${st}/>`;
    return `<rect x="-3000" y="-3000" width="7000" height="7000" fill="#FFE8D6"/>
${Array.from({ length: 40 }, (_, i) => `<path d="${sp(-200 + (i % 10) * 160 + (Math.floor(i / 10) % 2) * 80, 40 + Math.floor(i / 10) * 110, 7, 3)}" fill="#FFD3B6"/>`).join('')}
<rect x="${win[0]}" y="${win[1]}" width="${win[2]}" height="${win[3]}" rx="12" fill="#BDE8FF" ${st}/><path d="M${win[0] + win[2] / 2} ${win[1]} V${win[1] + win[3]} M${win[0]} ${win[1] + win[3] / 2} H${win[0] + win[2]}" stroke="#fff" stroke-width="8"/>
${sill}${counter}
<rect x="-3000" y="${fy}" width="7000" height="3000" fill="#D9A070"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${-200 + i * 110} ${fy} V${fy + 600}" stroke="#C48A5A" stroke-width="3"/>`).join('')}
<ellipse cx="${W / 2}" cy="${fy + (L === 'L' ? 110 : 160)}" rx="${L === 'L' ? 300 : 260}" ry="${L === 'L' ? 50 : 70}" fill="#FF9CB0" opacity=".6"/>`;
  }

  A.hubArt.helper = `<svg ${A.NS} viewBox="-80 -90 170 170"><g transform="translate(-8 10) scale(1.2)"><path d="M-30 -20 H24 V30 H-30 Z" fill="#4CC96B" ${st}/><path d="M24 -6 L58 -34" stroke="${O}" stroke-width="11" stroke-linecap="round"/><path d="M24 -6 L58 -34" stroke="#4CC96B" stroke-width="6" stroke-linecap="round"/><ellipse cx="60" cy="-36" rx="8" ry="10" fill="#3BAA58" ${st}/><path d="M-30 -10 Q-56 -10 -50 14 Q-46 24 -30 22" fill="none" ${st}/></g>
<path d="M-20 -40 C-44 -56 -44 -78 -30 -80 C-24 -81 -21 -76 -20 -72 C-19 -76 -16 -81 -10 -80 C4 -78 4 -56 -20 -40 Z" fill="#FF5A8A" ${st}/></svg>`;
  TW.makeRoom({
    id: 'helper',
    state: { done: { shirt: false, sock: false, pants: false, plate: false, cup: false, bowl: false, ball: false, block: false, rubberduck: false },
      chores: { laundry: false, dishes: false, toys: false, plant: false }, plant: false, flying: false, hugging: false },
    onRender: function (api) { Object.keys(api.state.done).forEach(function (k) { if (api.state.done[k]) api.show(k, false); }); },
    bg: bg,
    items: [
      { id: 'basket', pos: pos('basket'), hit: [140, 120], say: 'Laundry basket!',
        draw: api => { const n = boxCount(api, 'laundry');
          return (n ? `<path d="M-40 -20 Q-20 -44 0 -30 Q20 -48 40 -20 Z" fill="${['#3FA7FF', '#FF7AC6', '#4CC96B'][n - 1]}" ${st}/>` : '') +
            `<path d="M-60 -20 H60 L50 46 H-50 Z" fill="#F2D06B" ${st}/><path d="M-56 0 H56 M-52 22 H52" stroke="#C9A33A" stroke-width="4"/><path d="M-60 -14 Q-76 -14 -72 4 M60 -14 Q76 -14 72 4" fill="none" ${st}/>`; } },
      { id: 'sink', pos: pos('sink'), hit: [140, 120], say: 'Sink! Splish splash!',
        draw: api => { const n = boxCount(api, 'dishes');
          return `<path d="M-10 -40 V-60 Q-10 -70 4 -70 H20 V-62" fill="none" stroke="#9AA9BA" stroke-width="9" stroke-linecap="round"/>
<path d="M-62 -24 H62 L50 34 H-50 Z" fill="#DDE6EE" ${st}/><ellipse cy="-24" rx="62" ry="10" fill="#C9D6E2" ${st}/>` +
            (n ? Array.from({ length: n * 3 }, (_, i) => `<circle cx="${-40 + (i * 13) % 80}" cy="${-30 - (i % 3) * 8}" r="${8 + (i % 2) * 4}" fill="#fff" stroke="#9FD8FF" stroke-width="2"/>`).join('') : ''); },
        tap: function (api) { const c = api.local('sink', 12, -60); TW.fx.drops(c.x, c.y, 5); TW.sound.drip(); } },
      { id: 'toybox', pos: pos('toybox'), hit: [140, 120], say: 'Toy box!',
        draw: api => { const n = boxCount(api, 'toys');
          return (n > 0 ? `<circle cx="-24" cy="-26" r="16" fill="#FF5A6E" ${st}/>` : '') + (n > 1 ? `<rect x="-2" y="-44" width="28" height="28" rx="5" fill="#FF9F45" ${st}/>` : '') + (n > 2 ? `<circle cx="34" cy="-28" r="13" fill="#FFE066" ${st}/>` : '') +
            `<rect x="-62" y="-20" width="124" height="66" rx="10" fill="#A86BFF" ${st}/><path d="${sp(0, 12, 18, 8)}" fill="#FFD93D" ${st}/>`; } },
      { id: 'plant', pos: pos('plant'), hit: [120, 150], hitDy: -20,
        say: api => api.state.plant ? 'Thank you! I feel better!' : 'I am thirsty!',
        draw: api => (api.state.plant
          ? `<path d="M0 -20 V-90" stroke="#3DAA5C" stroke-width="7" stroke-linecap="round"/><ellipse cx="-20" cy="-50" rx="20" ry="9" fill="#57E08A" ${st}/><ellipse cx="20" cy="-66" rx="20" ry="9" fill="#57E08A" ${st}/>` +
            [0, 60, 120, 180, 240, 300].map(a => `<circle cx="${(Math.cos(a * Math.PI / 180) * 16).toFixed(1)}" cy="${(-104 + Math.sin(a * Math.PI / 180) * 16).toFixed(1)}" r="13" fill="#FF7AC6" ${st}/>`).join('') + `<circle cy="-104" r="10" fill="#FFD93D" ${st}/>`
          : `<path d="M0 -20 Q4 -60 -26 -66" fill="none" stroke="#7FAF5A" stroke-width="7" stroke-linecap="round"/><ellipse cx="-30" cy="-50" rx="16" ry="7" fill="#A3C77A" ${st} transform="rotate(40 -30 -50)"/><path d="M-26 -66 Q-36 -60 -34 -48" fill="#C9A0A0" ${st}/>`) +
          `<path d="M-34 -22 H34 L26 34 H-26 Z" fill="#E07B4A" ${st}/><rect x="-38" y="-30" width="76" height="12" rx="4" fill="#C8693A" ${st}/>`,
        tap: function (api) { api.play('plant', api.state.plant ? 'sqhop' : 'wiggle'); } },
      { id: 'can', pos: pos('can'), hit: [120, 120], say: 'Watering can!',
        draw: `<path d="M-30 -20 H24 V30 H-30 Z" fill="#4CC96B" ${st}/><path d="M24 -6 L58 -34" stroke="${O}" stroke-width="11" stroke-linecap="round"/><path d="M24 -6 L58 -34" stroke="#4CC96B" stroke-width="6" stroke-linecap="round"/><ellipse cx="60" cy="-36" rx="8" ry="10" fill="#3BAA58" ${st}/><path d="M-30 -10 Q-56 -10 -50 14 Q-46 24 -30 22" fill="none" ${st}/>`,
        tap: function (api) {
          const s = api.state;
          if (s.plant) { api.play('can', 'wiggle'); return; }
          api.play('can', 'pour'); TW.sound.whoosh();
          const sp2 = api.local('can', 60, -36);
          TW.fx.drops(sp2.x, sp2.y, 10);
          [0, 200, 400, 600].forEach(function (d) { setTimeout(TW.sound.drip, d); });
          sisterGo(api, 'plant');
          api.later(function () {
            s.plant = true; s.chores.plant = true;
            api.redraw('plant'); api.play('plant', 'sqhop');
            shine(api, 'plant');
            checkAll(api);
          }, 1300);
        } },
      { id: 'mum', pos: pos('mum'), hit: [180, 230], hitDy: 10, say: 'I love you, little helper!',
        draw: TW.pupAt('mum', { outfit: `<path d="M56 150 Q100 136 144 150 L152 214 Q100 226 48 214 Z" fill="#FF9CB0"/><path d="M70 160 H130 V200 H70 Z" fill="#fff" opacity=".8"/>` }),
        tap: function (api) { api.play('mum', 'sqhop'); TW.sound.boing(); const c = api.center('mum'); TW.fx.hearts(c.x, c.y - 50, 3); } },
      { id: 'sister', pos: pos('sister'), hit: [160, 200], hitDy: 10, say: 'I can help!',
        draw: TW.pupAt('sister'), tap: function (api) { api.play('sister', 'sqhop'); TW.sound.boing(); } },
      itemProp('plate'), itemProp('cup'), itemProp('bowl'),
      itemProp('shirt'), itemProp('sock'), itemProp('pants'),
      itemProp('ball'), itemProp('block'), itemProp('rubberduck')
    ]
  });
})();
