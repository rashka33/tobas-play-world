// New scene: Who Says That? — a real animal sound plays, three animal friends
// appear, and she taps the one she heard. A "wrong" tap is never wrong here:
// that animal makes its own real sound and says its name, then she tries again.
(function () {
  const A = TW.art, O = A.O;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

  // Somali name clips that already exist in the voice pack (see js/voice-pack.js).
  // Animals without an entry simply get praise instead of a spoken name.
  const NAME = {
    cow: 'Cow! Moo!', sheep: 'Sheep! Baa!', chicken: 'Chicken! Cluck cluck!',
    duck: 'Duck! Quack quack!', horse: 'Horse! Neigh!', dog: 'Baby pup!'
  };
  const ALL = ['cow', 'goat', 'sheep', 'chicken', 'duck', 'donkey', 'horse', 'dog', 'cat', 'lion', 'elephant'];

  function eyes(x, y, r, gap) {
    return `<g class="pup-eyes" style="animation-delay:-${(Math.random() * 4).toFixed(2)}s"><circle cx="${x}" cy="${y}" r="${r}" fill="${O}"/><circle cx="${x + 2}" cy="${y - 2}" r="${r * 0.38}" fill="#fff"/>` +
      (gap ? `<circle cx="${x + gap}" cy="${y}" r="${r}" fill="${O}"/><circle cx="${x + gap + 2}" cy="${y - 2}" r="${r * 0.38}" fill="#fff"/>` : '') + '</g>';
  }
  function bob(inner) { return `<g class="pup-bob" style="animation-delay:-${(Math.random() * 3).toFixed(2)}s">${inner}</g>`; }
  function legs(xs, y, h, fill) { return xs.map(x => `<rect x="${x - 9}" y="${y}" width="18" height="${h}" rx="6" fill="${fill}" ${st}/>`).join(''); }

  const ART = {
    cow: () => bob(`<path d="M76 0 Q100 10 96 40" fill="none" stroke="${O}" stroke-width="5"/><circle cx="96" cy="44" r="7" fill="${O}"/>
${legs([-52, -24, 30, 58], 40, 44, '#fff')}
<ellipse rx="84" ry="52" fill="#fff" ${st}/><path d="M-10 -40 Q20 -50 26 -20 Q10 0 -14 -14 Z M30 10 Q56 0 60 26 Q40 40 26 26 Z" fill="${O}"/><ellipse cx="0" cy="40" rx="18" ry="10" fill="#FFB3C7" ${st}/>
<path d="M-108 -66 Q-118 -84 -100 -84 M-64 -66 Q-54 -84 -72 -84" fill="none" stroke="#E8D9B0" stroke-width="8" stroke-linecap="round"/>
<ellipse cx="-120" cy="-50" rx="16" ry="9" fill="#fff" ${st}/><ellipse cx="-50" cy="-50" rx="16" ry="9" fill="#fff" ${st}/>
<ellipse cx="-86" cy="-36" rx="38" ry="36" fill="#fff" ${st}/><path d="M-100 -60 Q-86 -70 -72 -58 Q-80 -46 -100 -60 Z" fill="${O}"/>
<ellipse cx="-90" cy="-8" rx="30" ry="20" fill="#FFB3C7" ${st}/><circle cx="-100" cy="-8" r="4" fill="${O}"/><circle cx="-80" cy="-8" r="4" fill="${O}"/>${eyes(-102, -38, 6, 30)}`),
    sheep: () => bob(`${[-34, -12, 16, 38].map(x => `<rect x="${x - 7}" y="24" width="14" height="40" rx="5" fill="#4a4a5a" ${st}/>`).join('')}
${[[-40, -10], [-14, -26], [16, -24], [40, -6], [28, 18], [-6, 22], [-34, 16], [0, -2]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="26" fill="#F7F4EE" ${st}/>`).join('')}
${[[-40, -10], [-14, -26], [16, -24], [40, -6], [28, 18], [-6, 22], [-34, 16], [0, -2]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="23" fill="#F7F4EE"/>`).join('')}
<ellipse cx="-70" cy="-18" rx="14" ry="8" fill="#4a4a5a" ${st} transform="rotate(-20 -70 -18)"/><ellipse cx="-58" cy="-4" rx="24" ry="28" fill="#4a4a5a" ${st}/>
<circle cx="-62" cy="-34" r="12" fill="#F7F4EE"/><circle cx="-50" cy="-36" r="10" fill="#F7F4EE"/>${eyes(-68, -8, 5, 18)}<path d="M-64 12 Q-58 16 -52 12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`),
    chicken: () => bob(`<path d="M-8 30 V54 M8 30 V54 M-14 54 H0 M2 54 H16" stroke="#FF9F45" stroke-width="5" stroke-linecap="round"/>
<path d="M30 -10 L52 -30 L50 0 L60 -14 L48 12 Z" fill="#fff" ${st}/><ellipse rx="38" ry="34" fill="#fff" ${st}/><path d="M-4 0 Q14 -6 24 8 Q12 22 -4 12 Z" fill="#F0EBE0" ${st}/>
<path d="M-30 -40 Q-26 -54 -18 -44 Q-14 -56 -6 -44 Q0 -52 2 -38 Z" fill="#FF4D4D" ${st}/><circle cx="-18" cy="-24" r="20" fill="#fff" ${st}/>
<path d="M-38 -24 L-50 -18 L-38 -12 Z" fill="#FFC23D" ${st}/><path d="M-36 -10 Q-40 2 -32 4 Q-28 -4 -30 -10 Z" fill="#FF4D4D"/>${eyes(-24, -28, 4.5, 0)}`),
    duck: () => bob(`<path d="M-6 30 V48 M10 30 V48" stroke="#FF9F45" stroke-width="5" stroke-linecap="round"/><path d="M-16 48 H2 M0 48 H18" stroke="#FF9F45" stroke-width="7" stroke-linecap="round"/>
<path d="M34 -4 L56 -16 L48 10 Z" fill="#FFE066" ${st}/><ellipse cx="8" rx="44" ry="30" fill="#FFE066" ${st}/><path d="M0 -4 Q24 -14 34 6 Q18 20 0 10 Z" fill="#FFD23F" ${st}/>
<circle cx="-28" cy="-32" r="22" fill="#FFE066" ${st}/><path d="M-46 -30 Q-68 -28 -66 -20 Q-60 -14 -44 -20 Z" fill="#FF9F45" ${st}/>${eyes(-32, -38, 4.5, 0)}`),
    horse: () => bob(`${legs([-46, -22, 30, 54], 20, 58, '#B5733F')}
<path d="M70 -10 Q104 0 96 50 Q84 30 74 20 Z" fill="#5A3A22" ${st}/><ellipse rx="76" ry="42" fill="#B5733F" ${st}/>
<path d="M-50 -20 L-80 -86 L-46 -96 L-20 -22 Z" fill="#B5733F" ${st}/><path d="M-46 -96 Q-30 -70 -22 -30 L-14 -34 Q-24 -74 -38 -100 Z" fill="#5A3A22" ${st}/>
<ellipse cx="-92" cy="-84" rx="34" ry="22" fill="#B5733F" ${st} transform="rotate(-20 -92 -84)"/><ellipse cx="-116" cy="-74" rx="14" ry="12" fill="#D9A070" ${st}/><circle cx="-120" cy="-74" r="3" fill="${O}"/>
<path d="M-74 -104 L-70 -124 L-60 -104 Z" fill="#B5733F" ${st}/>${eyes(-88, -92, 5, 0)}`),
    goat: () => bob(`${legs([-46, -20, 26, 50], 30, 42, '#EDEAE2')}
<path d="M72 -6 Q94 4 88 34 Q78 18 70 12 Z" fill="#D8D2C4" ${st}/><ellipse rx="72" ry="44" fill="#F4F1E8" ${st}/>
<path d="M-52 -24 L-78 -78 L-44 -88 L-22 -26 Z" fill="#F4F1E8" ${st}/>
<path d="M-66 -86 Q-84 -104 -70 -116 M-40 -92 Q-44 -112 -28 -114" fill="none" stroke="#C9A86A" stroke-width="8" stroke-linecap="round"/>
<ellipse cx="-88" cy="-70" rx="32" ry="24" fill="#F4F1E8" ${st} transform="rotate(-18 -88 -70)"/><ellipse cx="-110" cy="-58" rx="13" ry="11" fill="#E8B4B8" ${st}/><circle cx="-114" cy="-58" r="3" fill="${O}"/>
<path d="M-96 -34 Q-92 -18 -98 -8 Q-88 -14 -86 -30 Z" fill="#D8D2C4" ${st}/>${eyes(-84, -80, 5, 0)}
<ellipse cx="-128" cy="-84" rx="13" ry="7" fill="#F4F1E8" ${st} transform="rotate(-24 -128 -84)"/>`),
    donkey: () => bob(`${legs([-46, -20, 26, 50], 30, 46, '#9AA0A8')}
<path d="M72 -4 Q96 6 90 38 Q80 20 70 12 Z" fill="#6E747C" ${st}/><ellipse rx="74" ry="44" fill="#A8AEB6" ${st}/><ellipse cx="6" cy="22" rx="40" ry="20" fill="#C9CDD3"/>
<path d="M-54 -26 L-72 -92 L-52 -96 L-34 -30 Z M-30 -28 L-26 -96 L-6 -92 L-12 -26 Z" fill="#A8AEB6" ${st}/>
<path d="M-62 -88 L-66 -50 M-16 -88 L-15 -50" stroke="#8A9098" stroke-width="7" stroke-linecap="round"/>
<ellipse cx="-86" cy="-64" rx="34" ry="24" fill="#A8AEB6" ${st} transform="rotate(-16 -86 -64)"/><ellipse cx="-108" cy="-50" rx="16" ry="13" fill="#D8B4A0" ${st}/><circle cx="-114" cy="-50" r="3.5" fill="${O}"/>${eyes(-82, -74, 5, 0)}`),
    dog: () => bob(`${legs([-40, -16, 22, 44], 26, 38, '#C8894E')}
<path d="M64 -8 Q92 0 86 30 Q76 14 66 8 Z" fill="#A5662F" ${st}/><ellipse rx="66" ry="40" fill="#C8894E" ${st}/><ellipse cx="4" cy="18" rx="34" ry="18" fill="#FFE6C7"/>
<circle cx="-72" cy="-44" r="34" fill="#C8894E" ${st}/><ellipse cx="-100" cy="-52" rx="12" ry="24" fill="#A5662F" ${st} transform="rotate(14 -100 -52)"/><ellipse cx="-44" cy="-52" rx="12" ry="24" fill="#A5662F" ${st} transform="rotate(-14 -44 -52)"/>
<ellipse cx="-72" cy="-28" rx="17" ry="13" fill="#FFE6C7" ${st}/><ellipse cx="-72" cy="-34" rx="7" ry="5.5" fill="${O}"/><path d="M-66 -18 Q-60 -8 -52 -14" fill="none" stroke="#FF8FA3" stroke-width="5" stroke-linecap="round"/>${eyes(-84, -52, 5.5, 24)}`),
    cat: () => bob(`<path d="M58 26 Q96 20 92 -22 Q104 16 66 40" fill="none" stroke="#F29B38" stroke-width="11" stroke-linecap="round"/>
${legs([-38, -14, 20, 42], 24, 36, '#F29B38')}
<ellipse rx="62" ry="38" fill="#F5A83D" ${st}/><ellipse cx="2" cy="16" rx="30" ry="16" fill="#FFE6C7"/>
<path d="M-96 -58 L-92 -88 L-66 -68 Z M-36 -68 L-10 -88 L-6 -56 Z" fill="#F5A83D" ${st}/><path d="M-90 -62 L-88 -78 L-72 -66 Z M-32 -66 L-16 -78 L-13 -60 Z" fill="#FFB3C7"/>
<circle cx="-52" cy="-42" r="32" fill="#F5A83D" ${st}/><ellipse cx="-52" cy="-26" rx="15" ry="11" fill="#FFE6C7" ${st}/><path d="M-56 -30 L-48 -30 L-52 -24 Z" fill="#FF8FA3" ${st}/>
<path d="M-84 -24 L-104 -28 M-84 -16 L-102 -14 M-20 -24 L0 -28 M-20 -16 L-2 -14" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>${eyes(-64, -48, 5.5, 24)}`),
    lion: () => bob(`${legs([-44, -18, 24, 48], 28, 42, '#D9A441')}
<path d="M68 -4 Q94 6 86 36 Q78 18 68 10 Z" fill="#B97E26" ${st}/><ellipse rx="70" ry="42" fill="#E8B95A" ${st}/>
${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<circle cx="${(-58 + Math.cos(a) * 37).toFixed(1)}" cy="${(-42 + Math.sin(a) * 37).toFixed(1)}" r="17" fill="#C97E2C" ${st}/>`; }).join('')}
<circle cx="-58" cy="-42" r="34" fill="#E8B95A" ${st}/><ellipse cx="-58" cy="-26" rx="16" ry="12" fill="#FFE6C7" ${st}/><path d="M-62 -30 L-54 -30 L-58 -24 Z" fill="#B5543A" ${st}/>${eyes(-70, -50, 5.5, 24)}`),
    elephant: () => bob(`${legs([-48, -18, 24, 50], 30, 44, '#8E97A3')}
<ellipse rx="78" ry="48" fill="#9AA5B1" ${st}/><circle cx="-72" cy="-34" r="36" fill="#9AA5B1" ${st}/>
<ellipse cx="-52" cy="-30" rx="20" ry="26" fill="#B9C2CC" ${st}/>
<path d="M-100 -22 Q-118 10 -104 44 Q-96 58 -86 48 Q-96 22 -88 -8 Z" fill="#9AA5B1" ${st}/>
<path d="M-88 6 L-80 22 L-92 24 Z" fill="#FFF6E6" ${st}/>${eyes(-84, -44, 5.5, 0)}`)
  };
  const HITS = { cow: [240, 210], sheep: [190, 150], chicken: [140, 140], duck: [150, 130], horse: [230, 230], goat: [220, 210], donkey: [220, 210], dog: [200, 180], cat: [200, 180], lion: [220, 200], elephant: [230, 200] };

  // ---- real animal sounds (recordings, see audio/animals/) ----
  let snd = null;
  function stopSound() { if (snd) { try { snd.pause(); snd.currentTime = 0; } catch (e) {} snd = null; } }
  function playSound(name) {
    if (TW.sound.isMuted()) return;
    stopSound();
    snd = new Audio('audio/animals/' + name + '.mp3');
    try { const p = snd.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function newRound(api) {
    const s = api.state;
    s.busy = false;
    s.won = false;
    if (!s.bag || !s.bag.length) s.bag = shuffle(ALL);
    s.target = s.bag.pop();
    const others = shuffle(ALL.filter(a => a !== s.target));
    s.choices = shuffle([s.target, others[0], others[1]]);
    api.redraw('s0'); api.redraw('s1'); api.redraw('s2');
    api.play('speaker', 'pop');
    api.later(function () { playSound(s.target); }, 550);
  }

  function judge(api, slot) {
    const s = api.state;
    const id = s.choices[slot], sid = 's' + slot;
    // While a tapped animal is teaching its sound, other wrong taps wait —
    // but tapping the RIGHT animal always answers, even mid-lesson.
    if (s.busy && (id !== s.target || s.won)) return;
    if (id === s.target) {
      s.busy = true;
      s.won = true;
      s.seq++;
      api.play(sid, 'dance2');
      playSound(id); // hear that sound again, tied to the right friend
      if (NAME[id]) api.later(function () { TW.voice.say(NAME[id]); }, 1300);
      api.later(function () { TW.celebrate(); }, 2800);
      api.later(function () { newRound(api); }, 4700);
    } else {
      // Not this one — but now she learns what THIS friend sounds like.
      s.busy = true;
      const my = ++s.seq;
      api.play(sid, 'wiggle');
      playSound(id);
      if (NAME[id]) api.later(function () { if (s.seq === my) TW.voice.say(NAME[id]); }, 1100);
      api.later(function () { if (s.seq === my) s.busy = false; }, 1500);
    }
  }

  function slot(i, L, P) {
    return { id: 's' + i, pos: { L: L, P: P }, hit: [250, 240], hitDy: -10,
      draw: function (api) { const id = api.state.choices[i]; return `<g data-animal="${id}">${ART[id]()}</g>`; },
      tap: function (api) { judge(api, i); } };
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

  A.hubArt.whosays = `<svg ${A.NS} viewBox="-160 -170 330 300"><g transform="translate(-52 8) scale(.92)">${ART.cow()}</g><g transform="translate(96 -64)"><circle r="46" fill="#FFD23F" stroke="${O}" stroke-width="4"/><path d="M-16 -10 H-4 L10 -22 V22 L-4 10 H-16 Z" fill="#2F8FE8"/><path d="M18 -12 Q28 0 18 12 M26 -20 Q40 0 26 20" fill="none" stroke="#2F8FE8" stroke-width="5" stroke-linecap="round"/></g></svg>`;

  TW.makeRoom({
    id: 'whosays',
    state: { target: 'cow', choices: ['cow', 'sheep', 'horse'], bag: [], busy: false, won: false, seq: 0 },
    bg: bg,
    init: function (api) {
      // Real recordings stop when she leaves the game.
      const el = api.el();
      new MutationObserver(function () { if (!el.classList.contains('active')) stopSound(); })
        .observe(el, { attributes: true, attributeFilter: ['class'] });
    },
    enter: function (api) { newRound(api); },
    items: [
      { id: 'speaker', pos: { L: [500, 128, 1], P: [300, 178, 1] }, hit: [180, 180],
        draw: `<g class="spk-pulse"><circle r="74" fill="#FFD23F" ${st}/><circle r="59" fill="#FFE98A"/><path d="M-30 -19 H-9 L19 -42 V42 L-9 19 H-30 Z" fill="#2F8FE8" ${st}/><path d="M31 -23 Q46 0 31 23 M43 -35 Q66 0 43 35" fill="none" stroke="#2F8FE8" stroke-width="7" stroke-linecap="round"/></g>`,
        tap: function (api) { api.play('speaker', 'sqhop'); playSound(api.state.target); } },
      slot(0, [212, 428, 1.0], [112, 540, 0.78]),
      slot(1, [500, 452, 1.05], [300, 566, 0.82]),
      slot(2, [788, 428, 1.0], [488, 540, 0.78]),
      { id: 'pup', pos: { L: [108, 528, 0.8], P: [300, 884, 0.85] }, hit: [170, 210], hitDy: 10, say: 'Hello, animals!',
        draw: TW.pupAt('sister'),
        tap: function (api) { api.play('pup', 'sqhop'); TW.sound.boing(); } }
    ]
  });
})();
