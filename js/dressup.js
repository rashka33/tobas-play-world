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
    // glasses
    { id: 'round', cat: 'glasses', layer: 'face', svg: `<g fill="rgba(255,255,255,.35)" stroke="#3B3B98" stroke-width="7"><circle cx="122" cy="134" r="24"/><circle cx="178" cy="134" r="24"/></g><path d="M146 132 Q150 126 154 132" fill="none" stroke="#3B3B98" stroke-width="6"/><path d="M98 130 L82 124 M202 130 L218 124" stroke="#3B3B98" stroke-width="6" stroke-linecap="round"/>` },
    { id: 'stars', cat: 'glasses', layer: 'face', svg: `<g fill="rgba(255,230,90,.45)" stroke="#FFB000" stroke-width="6" stroke-linejoin="round"><path d="${A.starPath(120, 136, 32, 15)}"/><path d="${A.starPath(180, 136, 32, 15)}"/></g><path d="M140 134 Q150 128 160 134" fill="none" stroke="#FFB000" stroke-width="6"/>` },
    { id: 'hearts', cat: 'glasses', layer: 'face', svg: `<g fill="rgba(255,120,170,.45)" stroke="#FF3D8B" stroke-width="6" stroke-linejoin="round"><path d="${heartPath(121, 136, 1.4)}"/><path d="${heartPath(179, 136, 1.4)}"/></g><path d="M146 128 Q150 124 154 128" fill="none" stroke="#FF3D8B" stroke-width="6"/>` },
    { id: 'shades', cat: 'glasses', layer: 'face', svg: `<g fill="#222" stroke="#111" stroke-width="5"><rect x="92" y="116" width="56" height="38" rx="16"/><rect x="152" y="116" width="56" height="38" rx="16"/></g><path d="M100 126 L114 140 M160 126 L174 140" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>` },
    // shirts
    { id: 'stripes', cat: 'shirt', layer: 'shirt', svg: `<path d="${SHIRT}" fill="#4DA8FF" ${st}/><path d="M92 256 H208 M89 278 H211 M88 300 H212 M88 322 H212" stroke="#fff" stroke-width="9" stroke-linecap="round"/>` },
    { id: 'startee', cat: 'shirt', layer: 'shirt', svg: `<path d="${SHIRT}" fill="#FFD93D" ${st}/><path d="${A.starPath(150, 290, 28, 12)}" fill="#FF7A59" ${st}/>` },
    { id: 'dots', cat: 'shirt', layer: 'shirt', svg: `<path d="${SHIRT}" fill="#FF8CC6" ${st}/><g fill="#fff"><circle cx="110" cy="262" r="7"/><circle cx="150" cy="250" r="7"/><circle cx="190" cy="262" r="7"/><circle cx="128" cy="292" r="7"/><circle cx="172" cy="292" r="7"/><circle cx="106" cy="318" r="7"/><circle cx="150" cy="320" r="7"/><circle cx="194" cy="318" r="7"/></g>` },
    { id: 'heartee', cat: 'shirt', layer: 'shirt', svg: `<path d="${SHIRT}" fill="#6BD68A" ${st}/><path d="${heartPath(150, 288, 1.5)}" fill="#FF4D6D" ${st}/>` },
    // silly
    { id: 'cape', cat: 'silly', layer: 'back', vb: '40 210 220 220', svg: `<path d="M96 230 Q150 246 204 230 L246 410 Q150 430 54 410 Z" fill="#E8453C" ${st}/><path d="${A.starPath(64, 396, 10, 4)} ${A.starPath(236, 396, 10, 4)}" fill="#FFD93D"/>` },
    { id: 'wings', cat: 'silly', layer: 'back', vb: '10 190 280 180', svg: `<g ${st} fill="#B98CFF"><ellipse cx="78" cy="250" rx="58" ry="40" transform="rotate(-30 78 250)"/><ellipse cx="222" cy="250" rx="58" ry="40" transform="rotate(30 222 250)"/></g><g ${st} fill="#7FD6FF"><ellipse cx="88" cy="322" rx="38" ry="28" transform="rotate(25 88 322)"/><ellipse cx="212" cy="322" rx="38" ry="28" transform="rotate(-25 212 322)"/></g><g fill="#fff" opacity=".8"><circle cx="52" cy="232" r="7"/><circle cx="248" cy="232" r="7"/><circle cx="70" cy="326" r="5"/><circle cx="230" cy="326" r="5"/></g>` },
    { id: 'tutu', cat: 'silly', layer: 'waist', vb: '50 300 200 80', svg: `<path d="M80 318 Q150 336 220 318 L240 362 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 q-11 12 -22.5 2 Z" fill="#FF9CD0" ${st}/><path d="M78 318 Q150 338 222 318" fill="none" stroke="#FF5FAE" stroke-width="8" stroke-linecap="round"/>` },
    { id: 'clown', cat: 'silly', layer: 'face', vb: '118 126 64 64', svg: `<circle cx="150" cy="158" r="18" fill="#FF3B3B" ${st}/><circle cx="144" cy="152" r="5" fill="#fff" opacity=".8"/>` },
    { id: 'tache', cat: 'silly', layer: 'face', vb: '96 148 108 46', svg: `<path d="M150 170 Q136 160 122 170 Q112 178 104 168 Q106 186 124 184 Q140 182 150 174 Q160 182 176 184 Q194 186 196 168 Q188 178 178 170 Q164 160 150 170 Z" fill="#5A3A22" ${st}/>` },
    { id: 'bunny', cat: 'silly', layer: 'top', vb: '78 -50 144 124', svg: `<g ${st} fill="#fff"><ellipse cx="118" cy="10" rx="20" ry="52" transform="rotate(-12 118 10)"/><ellipse cx="182" cy="10" rx="20" ry="52" transform="rotate(12 182 10)"/></g><ellipse cx="118" cy="14" rx="9" ry="36" fill="#FFB3CF" transform="rotate(-12 118 14)"/><ellipse cx="182" cy="14" rx="9" ry="36" fill="#FFB3CF" transform="rotate(12 182 14)"/>` }
  ];
  const CAT_VB = { hat: '70 -55 160 150', glasses: '86 100 128 72', shirt: '62 208 176 150' };
  const CATS = [
    { id: 'hat', icon: 'party' }, { id: 'glasses', icon: 'round' },
    { id: 'shirt', icon: 'stripes' }, { id: 'silly', icon: 'wings' }
  ];
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
    <div class="cats">${CATS.map(c => `<button class="cat" data-cat="${c.id}" aria-label="${c.id}">${thumb(byId[c.icon])}</button>`).join('')}<button class="cat shuffle" aria-label="Surprise outfit">${I.shuffle}</button></div>
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
      cat = b.dataset.cat;
      TW.sound.pop();
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
      const r = pupBox.getBoundingClientRect();
      TW.fx.burst(r.left + r.width / 2, r.top + r.height * 0.4, { count: 10 });
    }
    render(true);
  }

  function shuffle() {
    worn.clear();
    ['hat', 'glasses', 'shirt'].forEach(function (c) {
      const list = ITEMS.filter(it => it.cat === c);
      if (c === 'shirt' || Math.random() < 0.85) worn.add(list[Math.floor(Math.random() * list.length)].id);
    });
    const silly = ITEMS.filter(it => it.cat === 'silly').sort(() => Math.random() - 0.5);
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      // a silly hat-like item would hide under the real hat, so skip it then
      if (silly[i].layer === 'top' && [...worn].some(w => byId[w].cat === 'hat')) continue;
      worn.add(silly[i].id);
    }
    TW.sound.chime();
    const r = pupBox.getBoundingClientRect();
    TW.fx.burst(r.left + r.width / 2, r.top + r.height * 0.45, { count: 18 });
    render(true);
  }

  function render(bounce) {
    const svg = pupBox.querySelector('svg');
    ['back', 'shirt', 'waist', 'face', 'top'].forEach(function (layer) {
      svg.querySelector(`[data-layer="${layer}"]`).innerHTML =
        ITEMS.filter(it => it.layer === layer && worn.has(it.id)).map(it => it.svg).join('');
    });
    const hatOn = [...worn].some(w => byId[w].layer === 'top');
    svg.querySelector('[data-layer="bow"]').style.display = hatOn ? 'none' : '';
    markWorn();
    if (bounce) TW.fx.bounce(pupBox);
  }

  TW.registerScene('dressup', { init: init });
})();
