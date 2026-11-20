// Scene 3: Dress-up — tap clothes to put them on big-sister pup, tap again to take them off.
(function () {
  const A = TW.art, I = A.icons, O = A.O;
  const st = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const SHIRT = 'M98 234 Q150 214 202 234 L230 262 L214 284 L214 332 Q150 352 86 332 L86 284 L70 262 Z';

  function flowerAt(x, y, c) {
    let p = '';
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      p += `<circle cx="${(x + Math.cos(a) * 8).toFixed(1)}" cy="${(y + Math.sin(a) * 8).toFixed(1)}" r="7" fill="${c}" stroke="${O}" stroke-width="2.5"/>`;
    }
    return p + `<circle cx="${x}" cy="${y}" r="5" fill="#FFD93D" stroke="${O}" stroke-width="2.5"/>`;
  }
  function heartPath(cx, cy, s) {
    return `M${cx} ${cy + 16 * s} C${cx - 22 * s} ${cy} ${cx - 24 * s} ${cy - 18 * s} ${cx - 12 * s} ${cy - 20 * s} C${cx - 5 * s} ${cy - 21 * s} ${cx} ${cy - 14 * s} ${cx} ${cy - 10 * s} C${cx} ${cy - 14 * s} ${cx + 5 * s} ${cy - 21 * s} ${cx + 12 * s} ${cy - 20 * s} C${cx + 24 * s} ${cy - 18 * s} ${cx + 22 * s} ${cy} ${cx} ${cy + 16 * s} Z`;
  }

  const ITEMS = [
    // hats
    { id: 'party', cat: 'hat', layer: 'top', svg: `<path d="M150 -36 L110 72 Q150 88 190 72 Z" fill="#7BD3F7" ${st}/><path d="M130 22 Q150 30 170 22 M120 48 Q150 58 180 48" fill="none" stroke="#FF6FA8" stroke-width="8" stroke-linecap="round"/><circle cx="150" cy="-38" r="12" fill="#FFD93D" ${st}/>` },
    { id: 'crown', cat: 'hat', layer: 'top', svg: `<path d="M98 80 L102 24 L126 50 L150 12 L174 50 L198 24 L202 80 Z" fill="#FFD23F" ${st}/><circle cx="150" cy="62" r="8" fill="#FF4D6D" ${st}/><circle cx="120" cy="66" r="6" fill="#3FA7FF" ${st}/><circle cx="180" cy="66" r="6" fill="#4CC96B" ${st}/><circle cx="102" cy="22" r="6" fill="#FFD23F" ${st}/><circle cx="150" cy="10" r="6" fill="#FFD23F" ${st}/><circle cx="198" cy="22" r="6" fill="#FFD23F" ${st}/>` },
    { id: 'cowboy', cat: 'hat', layer: 'top', svg: `<path d="M104 70 Q96 4 150 8 Q204 4 196 70 Z" fill="#B5733F" ${st}/><path d="M104 54 Q150 64 196 54 L197 68 Q150 78 103 68 Z" fill="#E84855" ${st}/><path d="M40 70 Q60 94 150 94 Q240 94 260 70 Q250 60 230 68 Q150 84 70 68 Q50 60 40 70 Z" fill="#9C5F30" ${st}/>` },
    { id: 'chef', cat: 'hat', layer: 'top', svg: `<path d="M112 78 L112 40 Q90 34 96 10 Q104 -14 128 -4 Q140 -26 164 -14 Q190 -22 200 4 Q212 28 188 40 L188 78 Z" fill="#fff" ${st}/><path d="M112 62 H188" stroke="${O}" stroke-width="4"/>` },
    { id: 'flowers', cat: 'hat', layer: 'top', svg: `<path d="M84 92 Q150 40 216 92" fill="none" stroke="#3DAA5C" stroke-width="7" stroke-linecap="round"/>` + flowerAt(92, 84, '#FF7AC6') + flowerAt(118, 66, '#FFFFFF') + flowerAt(150, 58, '#A86BFF') + flowerAt(182, 66, '#FFFFFF') + flowerAt(208, 84, '#FF7AC6') },
    { id: 'beanie', cat: 'hat', layer: 'top', svg: `<path d="M94 78 Q96 8 150 6 Q204 8 206 78 Z" fill="#4CC96B" ${st}/><rect x="90" y="62" width="120" height="22" rx="10" fill="#FFD93D" ${st}/><circle cx="150" cy="0" r="14" fill="#FF6FA8" ${st}/>` },
    // glasses
    { id: 'round', cat: 'glasses', layer: 'face', svg: `<g fill="rgba(255,255,255,.35)" stroke="#3B3B98" stroke-width="7"><circle cx="122" cy="134" r="24"/><circle cx="178" cy="134" r="24"/></g><path d="M146 132 Q150 126 154 132" fill="none" stroke="#3B3B98" stroke-width="6"/><path d="M98 130 L82 124 M202 130 L218 124" stroke="#3B3B98" stroke-width="6" stroke-linecap="round"/>` },
    { id: 'stars', cat: 'glasses', layer: 'face', svg: `<g fill="rgba(255,230,90,.45)" stroke="#FFB000" stroke-width="6" stroke-linejoin="round"><path d="${A.starPath(120, 136, 32, 15)}"/><path d="${A.starPath(180, 136, 32, 15)}"/></g><path d="M140 134 Q150 128 160 134" fill="none" stroke="#FFB000" stroke-width="6"/>` },
    { id: 'hearts', cat: 'glasses', layer: 'face', svg: `<g fill="rgba(255,120,170,.45)" stroke="#FF3D8B" stroke-width="6" stroke-linejoin="round"><path d="${heartPath(121, 136, 1.4)}"/><path d="${heartPath(179, 136, 1.4)}"/></g><path d="M146 128 Q150 124 154 128" fill="none" stroke="#FF3D8B" stroke-width="6"/>` },
    { id: 'shades', cat: 'glasses', layer: 'face', svg: `<g fill="#222" stroke="#111" stroke-width="5"><rect x="92" y="116" width="56" height="38" rx="16"/><rect x="152" y="116" width="56" height="38" rx="16"/></g><path d="M100 126 L114 140 M160 126 L174 140" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>` },
    { id: 'goggles', cat: 'glasses', layer: 'face', svg: `<path d="M74 134 H226" stroke="#3FA7FF" stroke-width="9"/><g fill="rgba(160,225,255,.45)" stroke="#2F7FC0" stroke-width="7"><circle cx="121" cy="134" r="27"/><circle cx="179" cy="134" r="27"/></g><path d="M108 120 L116 128 M166 120 L174 128" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` },
    // shirts
    { id: 'stripes', cat: 'shirt', layer: 'shirt', svg: `<path d="${SHIRT}" fill="#4DA8FF" ${st}/><path d="M92 256 H208 M89 278 H211 M88 300 H212 M88 322 H212" stroke="#fff" stroke-width="9" stroke-linecap="round"/>` },
    { id: 'startee', cat: 'shirt', layer: 'shirt', svg: `<path d="${SHIRT}" fill="#FFD93D" ${st}/><path d="${A.starPath(150, 290, 28, 12)}" fill="#FF7A59" ${st}/>` },
    { id: 'dots', cat: 'shirt', layer: 'shirt', svg: `<path d="${SHIRT}" fill="#FF8CC6" ${st}/><g fill="#fff"><circle cx="110" cy="262" r="7"/><circle cx="150" cy="250" r="7"/><circle cx="190" cy="262" r="7"/><circle cx="128" cy="292" r="7"/><circle cx="172" cy="292" r="7"/><circle cx="106" cy="318" r="7"/><circle cx="150" cy="320" r="7"/><circle cx="194" cy="318" r="7"/></g>` },
    { id: 'heartee', cat: 'shirt', layer: 'shirt', svg: `<path d="${SHIRT}" fill="#6BD68A" ${st}/><path d="${heartPath(150, 288, 1.5)}" fill="#FF4D6D" ${st}/>` },
    { id: 'rainbow', cat: 'shirt', layer: 'shirt', svg: `<path d="${SHIRT}" fill="#FFFFFF" ${st}/><path d="M92 256 H208" stroke="#FF6B6B" stroke-width="10" stroke-linecap="round"/><path d="M89 274 H211" stroke="#FFA94D" stroke-width="10" stroke-linecap="round"/><path d="M88 292 H212" stroke="#FFE066" stroke-width="10" stroke-linecap="round"/><path d="M88 310 H212" stroke="#8CE99A" stroke-width="10" stroke-linecap="round"/><path d="M88 328 H212" stroke="#74C0FC" stroke-width="8" stroke-linecap="round"/><path d="${SHIRT}" fill="none" ${st}/>` },
    { id: 'gown', cat: 'shirt', layer: 'shirt', svg: `<path d="M98 234 Q150 214 202 234 L230 262 L214 284 L246 376 Q150 400 54 376 L86 284 L70 262 Z" fill="#C9A8FF" ${st}/><path d="M64 360 Q150 384 236 360" fill="none" stroke="#FFF3B0" stroke-width="7"/><path d="${A.starPath(150, 280, 14, 6)} ${A.starPath(110, 330, 9, 4)} ${A.starPath(190, 330, 9, 4)}" fill="#FFF3B0"/>` },
    // shoes
    { id: 'sneakers', cat: 'shoes', layer: 'feet', svg: `<g ${st}><ellipse cx="120" cy="400" rx="36" ry="19" fill="#FF5A6E"/><ellipse cx="180" cy="400" rx="36" ry="19" fill="#FF5A6E"/></g><path d="M88 410 H152 M148 410 H212" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M108 392 L126 396 M168 392 L186 396" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` },
    { id: 'boots', cat: 'shoes', layer: 'feet', svg: `<g fill="#FFD23F" ${st}><path d="M100 360 H142 V398 Q150 418 120 418 H96 Q86 400 100 396 Z"/><path d="M158 360 H200 V396 Q214 400 204 418 H180 Q150 418 158 398 Z"/></g><path d="M100 372 H142 M158 372 H200" stroke="#E8B400" stroke-width="5"/>` },
    { id: 'slippers', cat: 'shoes', layer: 'feet', svg: `<g fill="#FFB3D9" ${st}><ellipse cx="120" cy="400" rx="33" ry="17"/><ellipse cx="180" cy="400" rx="33" ry="17"/></g><path d="M104 386 L116 362 M136 386 L124 362 M164 386 L176 362 M196 386 L184 362" stroke="#FF6FA8" stroke-width="4" stroke-linecap="round"/><circle cx="120" cy="392" r="5" fill="#FF6FA8"/><circle cx="180" cy="392" r="5" fill="#FF6FA8"/>` },
    { id: 'flippers', cat: 'shoes', layer: 'feet', svg: `<g fill="#57D9C4" ${st}><path d="M110 386 L60 426 Q100 434 136 412 Z"/><path d="M190 386 L240 426 Q200 434 164 412 Z"/></g><path d="M80 420 L108 400 M218 420 L192 400" stroke="#2E9E8C" stroke-width="4"/>` },
    // things to hold
    { id: 'balloon', cat: 'hand', layer: 'hand', vb: '196 70 110 280', svg: `<path d="M232 332 Q240 260 258 198" fill="none" stroke="${O}" stroke-width="3"/><ellipse cx="262" cy="150" rx="38" ry="48" fill="#FF5A6E" ${st}/><path d="M254 196 L270 196 L262 206 Z" fill="#FF5A6E" ${st}/><ellipse cx="250" cy="134" rx="8" ry="14" fill="#fff" opacity=".6"/>` },
    { id: 'teddy', cat: 'hand', layer: 'hand', vb: '196 270 90 100', svg: `<g ${st}><circle cx="226" cy="294" r="9" fill="#B5733F"/><circle cx="254" cy="294" r="9" fill="#B5733F"/><circle cx="240" cy="310" r="20" fill="#C8894E"/><ellipse cx="240" cy="344" rx="22" ry="20" fill="#C8894E"/></g><circle cx="233" cy="306" r="3" fill="${O}"/><circle cx="247" cy="306" r="3" fill="${O}"/><ellipse cx="240" cy="316" rx="6" ry="4" fill="${O}"/>` },
    { id: 'bouquet', cat: 'hand', layer: 'hand', vb: '196 250 90 110', svg: `<path d="M236 344 L226 300 M236 344 L240 292 M236 344 L254 300" stroke="#3DAA5C" stroke-width="5" stroke-linecap="round"/>` + flowerAt(224, 294, '#FF7AC6') + flowerAt(242, 282, '#FFD93D') + flowerAt(258, 296, '#A86BFF') + `<path d="M226 330 L246 330 L236 344 Z" fill="#FF6FA8" ${st}/>` },
    { id: 'icecream', cat: 'hand', layer: 'hand', vb: '200 240 80 120', svg: `<path d="M222 300 L254 300 L238 350 Z" fill="#E8B060" ${st}/><circle cx="238" cy="288" r="20" fill="#FFB3D9" ${st}/><circle cx="238" cy="264" r="15" fill="#B5F07A" ${st}/><circle cx="238" cy="248" r="6" fill="#FF4D4D" ${st}/>` },
    // silly
    { id: 'cape', cat: 'silly', layer: 'back', vb: '40 210 220 220', svg: `<path d="M96 230 Q150 246 204 230 L246 410 Q150 430 54 410 Z" fill="#E8453C" ${st}/><path d="${A.starPath(64, 396, 10, 4)} ${A.starPath(236, 396, 10, 4)}" fill="#FFD93D"/>` },
    { id: 'wings', cat: 'silly', layer: 'back', vb: '10 190 280 180', svg: `<g ${st} fill="#B98CFF"><ellipse cx="78" cy="250" rx="58" ry="40" transform="rotate(-30 78 250)"/><ellipse cx="222" cy="250" rx="58" ry="40" transform="rotate(30 222 250)"/></g><g ${st} fill="#7FD6FF"><ellipse cx="88" cy="322" rx="38" ry="28" transform="rotate(25 88 322)"/><ellipse cx="212" cy="322" rx="38" ry="28" transform="rotate(-25 212 322)"/></g><g fill="#fff" opacity=".8"><circle cx="52" cy="232" r="7"/><circle cx="248" cy="232" r="7"/><circle cx="70" cy="326" r="5"/><circle cx="230" cy="326" r="5"/></g>` },
    { id: 'tutu', cat: 'silly', layer: 'waist', vb: '50 300 200 80', svg: `<path d="M80 318 Q150 336 220 318 L240 362 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 Z" fill="#FF9CD0" ${st}/><path d="M78 318 Q150 338 222 318" fill="none" stroke="#FF5FAE" stroke-width="8" stroke-linecap="round"/>` },
    { id: 'clown', cat: 'silly', layer: 'face', vb: '118 126 64 64', svg: `<circle cx="150" cy="158" r="18" fill="#FF3B3B" ${st}/><circle cx="144" cy="152" r="5" fill="#fff" opacity=".8"/>` },
    { id: 'tache', cat: 'silly', layer: 'face', vb: '96 148 108 46', svg: `<path d="M150 170 Q136 160 122 170 Q112 178 104 168 Q106 186 124 184 Q140 182 150 174 Q160 182 176 184 Q194 186 196 168 Q188 178 178 170 Q164 160 150 170 Z" fill="#5A3A22" ${st}/>` },
    { id: 'mask', cat: 'silly', layer: 'face', vb: '90 108 120 56', svg: `<path d="M92 128 Q150 108 208 128 Q212 150 186 152 Q166 152 156 140 H144 Q134 152 114 152 Q88 150 92 128 Z" fill="#E8453C" ${st}/><ellipse cx="122" cy="134" rx="11" ry="9" fill="#fff"/><ellipse cx="178" cy="134" rx="11" ry="9" fill="#fff"/><circle cx="122" cy="134" r="6" fill="${O}"/><circle cx="178" cy="134" r="6" fill="${O}"/>` },
    { id: 'scarf', cat: 'silly', layer: 'waist', vb: '86 190 128 110', svg: `<path d="M96 206 Q150 232 204 206 L206 228 Q150 252 94 228 Z" fill="#3FA7FF" ${st}/><path d="M170 228 L176 290 L196 288 L188 226 Z" fill="#3FA7FF" ${st}/><path d="M110 214 V236 M130 220 V242 M150 222 V244 M170 220 V242 M190 214 V236" stroke="#fff" stroke-width="5"/>` },
    { id: 'bunny', cat: 'silly', layer: 'top', vb: '78 -50 144 124', svg: `<g ${st} fill="#fff"><ellipse cx="118" cy="10" rx="20" ry="52" transform="rotate(-12 118 10)"/><ellipse cx="182" cy="10" rx="20" ry="52" transform="rotate(12 182 10)"/></g><ellipse cx="118" cy="14" rx="9" ry="36" fill="#FFB3CF" transform="rotate(-12 118 14)"/><ellipse cx="182" cy="14" rx="9" ry="36" fill="#FFB3CF" transform="rotate(12 182 14)"/>` }
  ];
  const CAT_VB = { hat: '70 -55 160 150', glasses: '74 100 152 72', shirt: '52 208 196 196', shoes: '50 352 200 86' };
  const CATS = [
    { id: 'hat', icon: 'party' }, { id: 'glasses', icon: 'round' },
    { id: 'shirt', icon: 'stripes' }, { id: 'shoes', icon: 'sneakers' }, { id: 'hand', icon: 'balloon' }, { id: 'silly', icon: 'wings' }
  ];
  const SAY = { party: 'Party hat!', crown: 'Crown!', cowboy: 'Cowboy hat!', chef: 'Chef hat!', flowers: 'Flowers!',
    round: 'Glasses!', stars: 'Star glasses!', hearts: 'Heart glasses!', shades: 'Sunglasses!',
    stripes: 'Stripy shirt!', startee: 'Star shirt!', dots: 'Spotty shirt!', heartee: 'Heart shirt!',
    cape: 'Cape!', wings: 'Wings!', tutu: 'Tutu!', clown: 'Clown nose!', tache: 'Moustache!', bunny: 'Bunny ears!', beanie: 'Woolly hat!', goggles: 'Swim goggles!', rainbow: 'Rainbow top!', gown: 'Princess dress!',
    sneakers: 'Sneakers!', boots: 'Rain boots!', slippers: 'Ballet slippers!', flippers: 'Flippers!', balloon: 'Balloon!', teddy: 'Teddy bear!',
    bouquet: 'Flowers!', icecream: 'Ice cream!', mask: 'Super mask!', scarf: 'Scarf!' };
  const CAMERA = `<svg ${A.NS} viewBox="0 0 64 64"><rect x="6" y="18" width="52" height="36" rx="8" fill="#5A5A6A" stroke="${O}" stroke-width="4"/><rect x="20" y="10" width="20" height="10" rx="3" fill="#5A5A6A" stroke="${O}" stroke-width="4"/><circle cx="32" cy="36" r="12" fill="#7FD6FF" stroke="${O}" stroke-width="4"/><circle cx="48" cy="26" r="3" fill="#FFD93D"/></svg>`;
  function photo() {
    const f = document.createElement('div');
    f.className = 'flash';
    el.appendChild(f);
    setTimeout(function () { f.remove(); }, 700);
    TW.sound.swish();
    TW.fx.bounce(pupBox, 'twirl');
    TW.celebrate('Say cheese!');
  }
  const byId = {};
  ITEMS.forEach(it => { byId[it.id] = it; });

  let el, pupBox, items, worn = new Set(), cat = 'hat';

  function thumb(it) { return `<svg ${A.NS} viewBox="${it.vb || CAT_VB[it.cat]}">${it.svg}</svg>`; }

  function init() {
    el = document.getElementById('dressup');
    el.innerHTML = `<button class="rbtn back corner" data-back aria-label="Back to home">${I.back}</button>
<div class="d-main">
  <div class="d-stage"><div class="pupbox">${A.sisterDress()}</div></div>
  <div class="d-panel">
    <div class="cats">${CATS.map(c => `<button class="cat" data-cat="${c.id}" aria-label="${c.id}">${thumb(byId[c.icon])}</button>`).join('')}<button class="cat shuffle" aria-label="Surprise outfit">${I.shuffle}</button><button class="cat camera" aria-label="Take a photo">${CAMERA}</button></div>
    <div class="items"></div>
  </div>
</div>`;
    pupBox = el.querySelector('.pupbox');
    items = el.querySelector('.items');

    el.querySelector('.cats').addEventListener('click', function (e) {
      const b = e.target.closest('.cat');
      if (!b) return;
      TW.fx.bounce(b, 'pressed');
      if (b.classList.contains('shuffle')) { shuffle(); return; }
      if (b.classList.contains('camera')) { photo(); return; }
      cat = b.dataset.cat;
      TW.sound.pop();
      TW.voice.say({ hat: 'Hats!', glasses: 'Glasses!', shirt: 'Clothes!', shoes: 'Shoes!', hand: 'Things to hold!', silly: 'Silly things!' }[cat]);
      buildItems();
    });
    items.addEventListener('click', function (e) {
      const b = e.target.closest('.item');
      if (b) toggle(b.dataset.item);
    });
    pupBox.addEventListener('pointerdown', function () {
      TW.sound.boing();
      TW.fx.bounce(pupBox);
      const r = pupBox.getBoundingClientRect();
      TW.fx.hearts(r.left + r.width / 2, r.top + r.height * 0.2, 3);
    });
    buildItems();
    render(false);
  }

  function buildItems() {
    el.querySelectorAll('.cat[data-cat]').forEach(b => b.classList.toggle('sel', b.dataset.cat === cat));
    items.innerHTML = ITEMS.filter(it => it.cat === cat)
      .map(it => `<button class="item" data-item="${it.id}" aria-label="${it.id}">${thumb(it)}</button>`).join('');
    markWorn();
  }

  function markWorn() {
    items.querySelectorAll('.item').forEach(b => b.classList.toggle('sel', worn.has(b.dataset.item)));
  }

  function toggle(id) {
    const it = byId[id];
    if (worn.has(id)) {
      worn.delete(id);
      TW.sound.plop();
    } else {
      // One hat, one pair of glasses, one shirt; silly things can pile up.
      if (it.cat !== 'silly') worn.forEach(w => { if (byId[w].cat === it.cat) worn.delete(w); });
      worn.add(id);
      TW.sound.boing();
      TW.voice.say(SAY[id]);
      worn._last = it.layer === 'shirt' ? 'twirl' : 'hop';
      // A hat, glasses and a shirt all on: that's a whole outfit!
      if (['hat', 'glasses', 'shirt'].every(c => [...worn].some(w => byId[w].cat === c))) TW.voice.praise({ queue: true });
      const r = pupBox.getBoundingClientRect();
      TW.fx.burst(r.left + r.width / 2, r.top + r.height * 0.4, { count: 10 });
    }
    render(worn._last || true);
    worn._last = null;
  }

  function shuffle() {
    worn.clear();
    ['hat', 'glasses', 'shirt', 'shoes', 'hand'].forEach(function (c) {
      const list = ITEMS.filter(it => it.cat === c);
      if (c === 'shirt' || Math.random() < (c === 'hand' ? 0.6 : 0.85)) worn.add(list[Math.floor(Math.random() * list.length)].id);
    });
    const silly = ITEMS.filter(it => it.cat === 'silly').sort(() => Math.random() - 0.5);
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      // a silly hat-like item would hide under the real hat, so skip it then
      if (silly[i].layer === 'top' && [...worn].some(w => byId[w].cat === 'hat')) continue;
      worn.add(silly[i].id);
    }
    TW.sound.chime();
    TW.voice.praise();
    const r = pupBox.getBoundingClientRect();
    TW.fx.burst(r.left + r.width / 2, r.top + r.height * 0.45, { count: 18 });
    render('twirl');
  }

  function render(bounce) {
    const svg = pupBox.querySelector('svg');
    ['back', 'shirt', 'waist', 'feet', 'hand', 'face', 'top'].forEach(function (layer) {
      svg.querySelector(`[data-layer="${layer}"]`).innerHTML =
        ITEMS.filter(it => it.layer === layer && worn.has(it.id)).map(it => it.svg).join('');
    });
    const hatOn = [...worn].some(w => byId[w].layer === 'top');
    svg.querySelector('[data-layer="bow"]').style.display = hatOn ? 'none' : '';
    markWorn();
    if (bounce) TW.fx.bounce(pupBox, bounce === 'twirl' ? 'twirl' : 'sqhop');
  }

  TW.registerScene('dressup', { init: init });
})();
