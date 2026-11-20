// New scene: Sorting Fun — put each thing in the fruit basket, the toy box or the shoe rack.
// A different container just wiggles and the item hops back: there is no "wrong" here.
(function () {
  const A = TW.art, O = A.O, sp = A.starPath;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

  const THINGS = {
    apple: ['fruit', 'Apple!', `<path d="M0 -36 Q44 -56 50 0 Q50 46 0 46 Q-50 46 -50 0 Q-44 -56 0 -36 Z" fill="#FF4D4D" ${st}/><path d="M0 -36 Q2 -54 12 -60" fill="none" stroke="${O}" stroke-width="5"/><ellipse cx="18" cy="-52" rx="14" ry="7" fill="#4CC96B" ${st}/><ellipse cx="-22" cy="-12" rx="8" ry="14" fill="#fff" opacity=".5"/>`],
    banana: ['fruit', 'Banana!', `<path d="M-50 -20 Q-40 50 40 40 Q56 36 52 26 Q-6 36 -30 -26 Z" fill="#FFE066" ${st}/><path d="M-30 -26 L-36 -40" stroke="${O}" stroke-width="7" stroke-linecap="round"/>`],
    pear: ['fruit', 'Pear!', `<path d="M0 -40 Q22 -40 20 -6 Q46 14 40 34 Q30 52 0 52 Q-30 52 -40 34 Q-46 14 -20 -6 Q-22 -40 0 -40 Z" fill="#B5E04D" ${st}/><path d="M0 -40 V-56" stroke="${O}" stroke-width="5"/>`],
    ball: ['toy', 'Ball!', `<circle r="48" fill="#fff" ${st}/><path d="M0 -48 Q30 0 0 48" fill="#FF5A6E" ${st}/><path d="M0 -48 Q-30 0 0 48" fill="#3FA7FF" ${st}/><path d="M-48 0 H48" stroke="${O}" stroke-width="4"/>`],
    car: ['toy', 'Toy car!', `<path d="M-56 18 V-4 Q-52 -14 -36 -16 L-22 -36 H24 L40 -16 Q56 -14 58 -2 V18 Z" fill="#3FA7FF" ${st}/><path d="M-16 -30 H-2 V-16 H-28 Z M6 -30 H20 L30 -16 H6 Z" fill="#D7F1FF" ${st}/><circle cx="-30" cy="22" r="13" fill="#4a4a5a" ${st}/><circle cx="32" cy="22" r="13" fill="#4a4a5a" ${st}/>`],
    teddy: ['toy', 'Teddy bear!', `<g ${st}><circle cx="-26" cy="-38" r="14" fill="#B5733F"/><circle cx="26" cy="-38" r="14" fill="#B5733F"/><circle cy="-16" r="34" fill="#C8894E"/><ellipse cy="34" rx="34" ry="26" fill="#C8894E"/><ellipse cy="-4" rx="14" ry="10" fill="#E8C08A"/></g><circle cx="-12" cy="-22" r="4" fill="${O}"/><circle cx="12" cy="-22" r="4" fill="${O}"/><circle cy="-8" r="4" fill="${O}"/>`],
    shoe: ['shoe', 'Shoe!', `<path d="M-52 20 V-10 Q-50 -24 -36 -24 Q-26 -4 -6 -10 Q12 -10 28 2 Q54 6 54 20 Z" fill="#FF6FA8" ${st}/><path d="M-56 22 H58" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M-56 22 H58" stroke="${O}" stroke-width="3"/><path d="M-20 -8 L-12 2 M-8 -10 L0 0" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`],
    sock: ['shoe', 'Sock!', `<path d="M-18 -50 H18 V14 Q20 40 0 48 H-36 Q-50 44 -46 30 Q-40 18 -18 14 Z" fill="#B57CFF" ${st}/><path d="M-18 -34 H18 M-18 -18 H18 M-18 -2 H18" stroke="#fff" stroke-width="7"/><rect x="-22" y="-56" width="44" height="12" rx="5" fill="#FFE066" ${st}/>`],
    boot: ['shoe', 'Rain boot!', `<path d="M-20 -52 H20 V20 Q48 22 48 44 H-24 Q-30 30 -20 20 Z" fill="#FFD23F" ${st}/><path d="M-20 -36 H20" stroke="#E8B400" stroke-width="6"/><path d="M-26 44 H50" stroke="${O}" stroke-width="8" stroke-linecap="round"/>`]
  };
  const KINDS = { fruit: 'basket', toy: 'toybox', shoe: 'rack' };
  const PLACE = { fruit: 'the fruit basket', toy: 'the toy box', shoe: 'the shoe rack' };
  const GOAL = 6;

  let busy = false, queue = [];
  function nextThing(api) {
    if (!queue.length) queue = Object.keys(THINGS).sort(() => Math.random() - 0.5);
    let k = queue.shift();
    if (k === api.state.thing && queue.length) { queue.push(k); k = queue.shift(); }
    api.state.thing = k;
    api.redraw('thing'); api.clearPos('thing'); api.show('thing', true);
    api.play('thing', 'pop');
    TW.voice.say(THINGS[k][1]);
  }

  function judge(api, cid) {
    const s = api.state, kind = THINGS[s.thing][0];
    if (busy) return;
    if (KINDS[kind] === cid) {
      busy = true;
      const c = api.pos(cid);
      api.node('thing').style.transition = 'transform .6s cubic-bezier(.4,0,.6,1)';
      api.setPos('thing', [c[0], c[1] - 40 * c[2], 0.35]);
      TW.sound.whoosh();
      api.later(function () {
        api.show('thing', false);
        api.node('thing').style.transition = '';
        api.play(cid, 'sqhop'); api.play('pup', 'sqhop');
        const p = api.center(cid);
        TW.fx.burst(p.x, p.y, { count: 16 });
        TW.sound.chime();
        s.sorted++;
        api.redraw('stars');
        if (s.sorted >= GOAL) {
          ['basket', 'toybox', 'rack', 'pup'].forEach(function (k) { api.play(k, 'dance2'); });
          TW.celebrate('All sorted! You are a super sorter!');
          api.later(function () { s.sorted = 0; api.redraw('stars'); nextThing(api); busy = false; }, 3600);
        } else {
          TW.voice.praise();
          api.later(function () { nextThing(api); busy = false; }, 1100);
        }
      }, 620);
      setTimeout(function () { if (!api.active()) busy = false; }, 4000);
    } else {
      // Not that one: a friendly wiggle, the item hops home, and a gentle hint.
      api.play(cid, 'wiggle');
      api.clearPos('thing');
      api.play('thing', 'sqhop');
      TW.sound.boing();
      TW.voice.say('Where does the ' + THINGS[s.thing][1].replace('!', '').toLowerCase() + ' go?');
    }
  }

  function container(id, label, body) {
    return { id: id, hit: [200, 180], hitDy: -10, say: label, draw: body, tap: function (api) { judge(api, id); },
      pos: { L: { basket: [200, 480, 1], toybox: [500, 480, 1], rack: [800, 480, 1] }[id], P: { basket: [105, 770, 0.85], toybox: [300, 770, 0.85], rack: [495, 770, 0.85] }[id] } };
  }

  A.hubArt.sorting = `<svg ${A.NS} viewBox="-100 -110 200 200"><path d="M-90 -20 H90 L74 70 H-74 Z" fill="#C8894E" ${st}/><path d="M-80 10 H80 M-76 40 H76" stroke="#9C6B33" stroke-width="5"/>
<g transform="translate(-34 -40) scale(.7)">${THINGS.apple[2]}</g><g transform="translate(34 -44) scale(.65)">${THINGS.ball[2]}</g></svg>`;
  TW.makeRoom({
    id: 'sorting',
    state: { thing: 'apple', sorted: 0 },
    enter: function (api) { if (!busy) nextThing(api); },
    bg: function (L) {
      const fy = L === 'L' ? 400 : 650;
      return `<rect x="-3000" y="-3000" width="7000" height="7000" fill="#FFF1D6"/>
${Array.from({ length: 30 }, (_, i) => `<circle cx="${-100 + i * 70}" cy="${L === 'L' ? 120 : 200}" r="7" fill="#FFD8A8"/>`).join('')}
<rect x="-3000" y="${fy}" width="7000" height="3000" fill="#E8C08A"/><path d="M-3000 ${fy} H4000" stroke="#C9A06A" stroke-width="8"/>`;
    },
    items: [
      { id: 'stars', pos: { L: [560, 52, 1], P: [340, 80, 0.9] },
        draw: api => Array.from({ length: GOAL }, (_, i) => `<path d="${sp(-110 + i * 44, 0, 20, 8.5)}" fill="${i < api.state.sorted ? '#FFD93D' : '#FFF3D6'}" ${st}/>`).join('') },
      container('basket', 'Fruit basket!', `<path d="M-90 -20 H90 L74 70 H-74 Z" fill="#C8894E" ${st}/><path d="M-80 10 H80 M-76 40 H76 M-40 -20 L-34 70 M0 -20 V70 M40 -20 L34 70" stroke="#9C6B33" stroke-width="5"/>
<path d="M-60 -20 Q0 -110 60 -20" fill="none" stroke="#9C6B33" stroke-width="10"/><g transform="translate(-36 -34) scale(.55)">${THINGS.apple[2]}</g><g transform="translate(26 -30) scale(.5)">${THINGS.banana[2]}</g>`),
      container('toybox', 'Toy box!', `<g class="lid"><rect x="-96" y="-56" width="192" height="26" rx="8" fill="#5B8DEF" ${st}/></g><g transform="translate(-40 -40) scale(.5)">${THINGS.ball[2]}</g><g transform="translate(36 -42) scale(.45)">${THINGS.teddy[2]}</g>
<rect x="-88" y="-30" width="176" height="100" rx="12" fill="#3FA7FF" ${st}/><path d="${sp(0, 20, 26, 11)}" fill="#FFD93D" ${st}/>`),
      container('rack', 'Shoe rack!', `<rect x="-90" y="-60" width="14" height="130" fill="#B5733F" ${st}/><rect x="76" y="-60" width="14" height="130" fill="#B5733F" ${st}/>
<rect x="-90" y="-10" width="180" height="12" fill="#D9A070" ${st}/><rect x="-90" y="54" width="180" height="12" fill="#D9A070" ${st}/>
<g transform="translate(-32 -28) scale(.5)">${THINGS.shoe[2]}</g><g transform="translate(36 -30) scale(.45)">${THINGS.boot[2]}</g><g transform="translate(0 34) scale(.45)">${THINGS.sock[2]}</g>`),
      { id: 'pup', pos: { L: [870, 230, 0.9], P: [480, 560, 0.8] }, hit: [190, 230], hitDy: 10, say: 'Let us tidy up!',
        draw: TW.pupAt('sister'), tap: function (api) { api.play('pup', 'sqhop'); TW.sound.boing(); } },
      { id: 'thing', pos: { L: [500, 250, 1.15], P: [300, 420, 1.15] }, hit: [140, 140],
        draw: api => `<g class="float-y">${THINGS[api.state.thing][2]}</g>`,
        tap: function (api) { api.play('thing', 'sqhop'); TW.sound.boing(); TW.voice.say(THINGS[api.state.thing][1]); },
        drag: {
          start: function (api) { api.node('thing').style.transition = 'none'; TW.sound.softPop(); },
          move: function (api, p) { const h = api.home('thing'); api.setPos('thing', [p.x, p.y, h[2]]); },
          end: function (api, p) {
            api.node('thing').style.transition = '';
            const hit = ['basket', 'toybox', 'rack'].find(c => TW.inHit(api, c, p, 10));
            if (hit) judge(api, hit);
            else { api.clearPos('thing'); TW.sound.boing(); }
          }
        } }
    ]
  });
})();
