// New scene: Animal Friends — farm animals that hop and call, a feed button, and a dance when everyone is full.
(function () {
  const A = TW.art, O = A.O;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const ORDER = ['cow', 'sheep', 'chicken', 'duck', 'horse'];
  const CALL = { cow: 'Cow! Moo!', sheep: 'Sheep! Baa!', chicken: 'Chicken! Cluck cluck!', duck: 'Duck! Quack quack!', horse: 'Horse! Neigh!' };
  const FOOD = { cow: 'hay', sheep: 'hay', horse: 'apple', chicken: 'seeds', duck: 'seeds' };
  const FOOD_SAY = { hay: 'Hay!', apple: 'Apple!', seeds: 'Seeds!' };

  function eyes(x, y, r, gap) {
    return `<g class="pup-eyes" style="animation-delay:-${(Math.random() * 4).toFixed(2)}s"><circle cx="${x}" cy="${y}" r="${r}" fill="${O}"/><circle cx="${x + 2}" cy="${y - 2}" r="${r * 0.38}" fill="#fff"/>` +
      (gap ? `<circle cx="${x + gap}" cy="${y}" r="${r}" fill="${O}"/><circle cx="${x + gap + 2}" cy="${y - 2}" r="${r * 0.38}" fill="#fff"/>` : '') + '</g>';
  }
  function heart(fed, y) { return fed ? `<path d="M0 ${y + 14} C-16 ${y + 4} -16 ${y - 10} -7 ${y - 12} C-3 ${y - 13} -1 ${y - 10} 0 ${y - 7} C1 ${y - 10} 3 ${y - 13} 7 ${y - 12} C16 ${y - 10} 16 ${y + 4} 0 ${y + 14} Z" fill="#FF5A8A" ${st}/>` : ''; }
  function bob(inner) { return `<g class="pup-bob" style="animation-delay:-${(Math.random() * 3).toFixed(2)}s">${inner}</g>`; }

  const ART = {
    cow: fed => bob(`<path d="M76 0 Q100 10 96 40" fill="none" stroke="${O}" stroke-width="5"/><circle cx="96" cy="44" r="7" fill="${O}"/>
${[-52, -24, 30, 58].map(x => `<rect x="${x - 9}" y="40" width="18" height="44" rx="6" fill="#fff" ${st}/><rect x="${x - 9}" y="74" width="18" height="12" rx="4" fill="${O}"/>`).join('')}
<ellipse rx="84" ry="52" fill="#fff" ${st}/><path d="M-10 -40 Q20 -50 26 -20 Q10 0 -14 -14 Z M30 10 Q56 0 60 26 Q40 40 26 26 Z" fill="${O}"/><ellipse cx="0" cy="40" rx="18" ry="10" fill="#FFB3C7" ${st}/>
<path d="M-108 -66 Q-118 -84 -100 -84 M-64 -66 Q-54 -84 -72 -84" fill="none" stroke="#E8D9B0" stroke-width="8" stroke-linecap="round"/>
<ellipse cx="-120" cy="-50" rx="16" ry="9" fill="#fff" ${st}/><ellipse cx="-50" cy="-50" rx="16" ry="9" fill="#fff" ${st}/>
<ellipse cx="-86" cy="-36" rx="38" ry="36" fill="#fff" ${st}/><path d="M-100 -60 Q-86 -70 -72 -58 Q-80 -46 -100 -60 Z" fill="${O}"/>
<ellipse cx="-90" cy="-8" rx="30" ry="20" fill="#FFB3C7" ${st}/><circle cx="-100" cy="-8" r="4" fill="${O}"/><circle cx="-80" cy="-8" r="4" fill="${O}"/>${eyes(-102, -38, 6, 30)}${heart(fed, -112)}`),
    sheep: fed => bob(`${[-34, -12, 16, 38].map(x => `<rect x="${x - 7}" y="24" width="14" height="40" rx="5" fill="#4a4a5a" ${st}/>`).join('')}
${[[-40, -10], [-14, -26], [16, -24], [40, -6], [28, 18], [-6, 22], [-34, 16], [0, -2]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="26" fill="#F7F4EE" ${st}/>`).join('')}
${[[-40, -10], [-14, -26], [16, -24], [40, -6], [28, 18], [-6, 22], [-34, 16], [0, -2]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="23" fill="#F7F4EE"/>`).join('')}
<ellipse cx="-70" cy="-18" rx="14" ry="8" fill="#4a4a5a" ${st} transform="rotate(-20 -70 -18)"/><ellipse cx="-58" cy="-4" rx="24" ry="28" fill="#4a4a5a" ${st}/>
<circle cx="-62" cy="-34" r="12" fill="#F7F4EE"/><circle cx="-50" cy="-36" r="10" fill="#F7F4EE"/>${eyes(-68, -8, 5, 18)}<path d="M-64 12 Q-58 16 -52 12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>${heart(fed, -76)}`),
    chicken: fed => bob(`<path d="M-8 30 V54 M8 30 V54 M-14 54 H0 M2 54 H16" stroke="#FF9F45" stroke-width="5" stroke-linecap="round"/>
<path d="M30 -10 L52 -30 L50 0 L60 -14 L48 12 Z" fill="#fff" ${st}/><ellipse rx="38" ry="34" fill="#fff" ${st}/><path d="M-4 0 Q14 -6 24 8 Q12 22 -4 12 Z" fill="#F0EBE0" ${st}/>
<path d="M-30 -40 Q-26 -54 -18 -44 Q-14 -56 -6 -44 Q0 -52 2 -38 Z" fill="#FF4D4D" ${st}/><circle cx="-18" cy="-24" r="20" fill="#fff" ${st}/>
<path d="M-38 -24 L-50 -18 L-38 -12 Z" fill="#FFC23D" ${st}/><path d="M-36 -10 Q-40 2 -32 4 Q-28 -4 -30 -10 Z" fill="#FF4D4D"/>${eyes(-24, -28, 4.5, 0)}${heart(fed, -72)}`),
    duck: fed => bob(`<path d="M-6 30 V48 M10 30 V48" stroke="#FF9F45" stroke-width="5" stroke-linecap="round"/><path d="M-16 48 H2 M0 48 H18" stroke="#FF9F45" stroke-width="7" stroke-linecap="round"/>
<path d="M34 -4 L56 -16 L48 10 Z" fill="#FFE066" ${st}/><ellipse cx="8" rx="44" ry="30" fill="#FFE066" ${st}/><path d="M0 -4 Q24 -14 34 6 Q18 20 0 10 Z" fill="#FFD23F" ${st}/>
<circle cx="-28" cy="-32" r="22" fill="#FFE066" ${st}/><path d="M-46 -30 Q-68 -28 -66 -20 Q-60 -14 -44 -20 Z" fill="#FF9F45" ${st}/>${eyes(-32, -38, 4.5, 0)}${heart(fed, -74)}`),
    horse: fed => bob(`${[-46, -22, 30, 54].map(x => `<rect x="${x - 9}" y="20" width="18" height="58" rx="6" fill="#B5733F" ${st}/><rect x="${x - 10}" y="70" width="20" height="12" rx="4" fill="#5A3A22"/>`).join('')}
<path d="M70 -10 Q104 0 96 50 Q84 30 74 20 Z" fill="#5A3A22" ${st}/><ellipse rx="76" ry="42" fill="#B5733F" ${st}/>
<path d="M-50 -20 L-80 -86 L-46 -96 L-20 -22 Z" fill="#B5733F" ${st}/><path d="M-46 -96 Q-30 -70 -22 -30 L-14 -34 Q-24 -74 -38 -100 Z" fill="#5A3A22" ${st}/>
<ellipse cx="-92" cy="-84" rx="34" ry="22" fill="#B5733F" ${st} transform="rotate(-20 -92 -84)"/><ellipse cx="-116" cy="-74" rx="14" ry="12" fill="#D9A070" ${st}/><circle cx="-120" cy="-74" r="3" fill="${O}"/>
<path d="M-74 -104 L-70 -124 L-60 -104 Z" fill="#B5733F" ${st}/>${eyes(-88, -92, 5, 0)}${heart(fed, -150)}`)
  };
  const HITS = { cow: [230, 170], sheep: [170, 140], chicken: [130, 130], duck: [140, 120], horse: [220, 220] };
  const HIT_DY = { cow: -10, sheep: 0, chicken: -10, duck: -10, horse: -30 };

  function animalItem(id, L, P) {
    return { id: id, pos: { L: L, P: P }, hit: HITS[id], hitDy: HIT_DY[id],
      draw: api => ART[id](api.state.fed[id]),
      tap: function (api) {
        api.play(id, 'sqhop');
        TW.sound.animal(id);
        api.later(function () { TW.voice.say(CALL[id]); }, 650); // let the animal's own call be heard first
      } };
  }

  function food(kind) {
    if (kind === 'hay') return `<path d="M-40 20 Q-46 -12 -20 -18 Q0 -30 20 -18 Q46 -12 40 20 Z" fill="#F2D06B" ${st}/><path d="M-30 4 L-20 -10 M-10 8 L0 -16 M10 6 L18 -12 M26 10 L32 -4" stroke="#C9A33A" stroke-width="3" stroke-linecap="round"/>`;
    if (kind === 'apple') return `<path d="M0 -20 Q24 -30 28 0 Q28 26 0 26 Q-28 26 -28 0 Q-24 -30 0 -20 Z" fill="#FF4D4D" ${st}/><path d="M0 -20 Q2 -32 8 -36" fill="none" stroke="${O}" stroke-width="4"/><ellipse cx="10" cy="-30" rx="9" ry="5" fill="#4CC96B" ${st}/>`;
    return `<ellipse cy="12" rx="38" ry="12" fill="#C8693A" ${st}/>${[[-18, 4], [-6, 0], [6, 4], [18, 0], [-12, 10], [10, 10], [0, -4]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="5" fill="#FFD23F" stroke="#D9A600" stroke-width="2"/>`).join('')}`;
  }

  let busy = false;
  function feed(api) {
    const s = api.state;
    if (busy || s.party) return;
    const hungry = ORDER.filter(a => !s.fed[a]);
    if (!hungry.length) return;
    busy = true;
    const id = hungry[Math.floor(Math.random() * hungry.length)];
    const p = api.pos(id), sc = p[2];
    s.food = FOOD[id];
    api.redraw('food');
    api.setPos('food', [p[0] - 120 * sc, p[1] + 50 * sc, 1]);
    api.show('food', true);
    api.play('food', 'drop-in');
    TW.sound.plop();
    TW.voice.say(FOOD_SAY[s.food]);
    api.later(function () { api.walk(id, p[0] - 40 * sc, null, [], 700); }, 500);
    api.later(function () {
      api.play(id, 'munch'); TW.sound.munch();
      const c = api.center(id); TW.fx.hearts(c.x, c.y - 30, 4);
    }, 1250);
    api.later(function () {
      api.show('food', false);
      s.fed[id] = true;
      api.redraw(id);
      TW.sound.animal(id);
      TW.voice.say('Yum yum!');
      busy = false;
      if (ORDER.every(a => s.fed[a])) party(api);
    }, 2400);
    setTimeout(function () { busy = false; }, 2600); // never stay stuck if the child leaves mid-feed
  }

  function party(api) {
    const s = api.state;
    s.party = true;
    ORDER.forEach(function (a, i) { setTimeout(function () { api.play(a, 'dance2'); TW.sound.animal(a); }, i * 220); });
    api.play('pup', 'dance2');
    TW.celebrate('Everyone is full! Dance party!');
    api.later(function () {
      ORDER.forEach(function (a) { s.fed[a] = false; api.clearPos(a); api.redraw(a); });
      s.party = false;
    }, 4200);
    setTimeout(function () { s.party = false; }, 4400);
  }

  function bg(L) {
    const gy = L === 'L' ? 300 : 420, W = L === 'L' ? 1000 : 600;
    let fence = '';
    for (let x = -100; x < W + 100; x += 60) fence += `<rect x="${x}" y="${gy - 50}" width="14" height="60" rx="4" fill="#E8C08A" ${st}/>`;
    return `<rect x="-3000" y="-3000" width="7000" height="7000" fill="#BDE8FF"/>
<circle cx="${L === 'L' ? 620 : 120}" cy="${L === 'L' ? 70 : 210}" r="40" fill="#FFD93D"/>
<path d="M-3000 ${gy} Q${W * 0.3} ${gy - 60} ${W * 0.6} ${gy - 10} Q${W * 0.85} ${gy - 50} 4000 ${gy} V4000 H-3000 Z" fill="#A6E07A"/>
<rect x="-3000" y="${gy - 34}" width="7000" height="10" fill="#E8C08A"/>${fence}
<path d="M-3000 ${gy + 20} H4000 V4000 H-3000 Z" fill="#8FDB6E"/>`;
  }

  A.hubArt.animals = `<svg ${A.NS} viewBox="-142 -132 250 232">` + ART.cow(false).replace(/<g class="pup-bob"[^>]*>/, '<g>') + '</svg>';
  TW.makeRoom({
    id: 'animals',
    state: { fed: { cow: false, sheep: false, chicken: false, duck: false, horse: false }, food: 'hay', party: false },
    bg: bg,
    onRender: function (api) { api.show('food', false); },
    items: [
      { id: 'barn', pos: { L: [880, 215, 1], P: [450, 250, 1] }, hit: [170, 160], say: 'Barn!',
        draw: `<path d="M-80 70 V-20 L0 -80 L80 -20 V70 Z" fill="#E8453C" ${st}/><path d="M-90 -14 L0 -88 L90 -14" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
<rect x="-34" y="0" width="68" height="70" fill="#7A3A2C" ${st}/><g class="door"><rect x="-34" y="0" width="34" height="70" fill="#C8432F" ${st}/><path d="M-34 0 L0 70 M0 0 L-34 70" stroke="#fff" stroke-width="5"/></g><circle cy="-34" r="12" fill="#FFF3D6" ${st}/>`,
        tap: function (api) { const a = api.anim('barn'); a.classList.add('door-open'); TW.sound.boing(); api.later(function () { a.classList.remove('door-open'); }, 1500); } },
      animalItem('horse', [190, 320, 0.95], [150, 420, 0.85]),
      animalItem('cow', [470, 330, 0.95], [440, 440, 0.85]),
      animalItem('sheep', [730, 350, 1], [130, 630, 0.95]),
      animalItem('chicken', [330, 515, 1], [480, 640, 1]),
      animalItem('duck', [600, 520, 1], [320, 650, 1]),
      { id: 'food', pos: { L: [0, 0, 1], P: [0, 0, 1] }, draw: api => food(api.state.food) },
      { id: 'pup', pos: { L: [110, 500, 0.95], P: [150, 830, 0.95] }, hit: [190, 230], hitDy: 10, say: 'Hello, animals!',
        draw: TW.pupAt('sister', { extra: `<path d="M44 40 Q100 -6 156 40 Z" fill="#F2D06B" stroke="${O}" stroke-width="4"/><ellipse cx="100" cy="40" rx="76" ry="12" fill="#F2D06B" stroke="${O}" stroke-width="4"/><path d="M60 34 Q100 24 140 34" fill="none" stroke="#E8453C" stroke-width="6"/>` }),
        tap: function (api) { api.play('pup', 'sqhop'); TW.sound.boing(); } },
      { id: 'feed', pos: { L: [900, 520, 1], P: [450, 860, 1] }, hit: [150, 150], say: 'Feeding time!',
        draw: `<circle r="64" fill="#FFD23F" ${st}/><circle r="52" fill="#FFE98A"/><path d="M-30 30 L-24 -4 H24 L30 30 Z" fill="#B5733F" ${st}/><path d="M-26 -4 Q-30 -26 -10 -24 Q0 -36 12 -24 Q30 -26 26 -4 Z" fill="#F2D06B" ${st}/><circle cx="16" cy="-16" r="11" fill="#FF4D4D" ${st}/>`,
        tap: function (api) { api.play('feed', 'press'); feed(api); } }
    ]
  });
})();
