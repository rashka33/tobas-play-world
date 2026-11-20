// Scene 4: Kitchen — put toppings on a pizza, bake it, give it to baby pup.
(function () {
  const A = TW.art, I = A.icons;
  const TOPS = ['pepperoni', 'mushroom', 'olive', 'pepper', 'tomato', 'pineapple', 'basil', 'cheese'];
  const MAX_TOPS = 90, RIM = 0.68;
  const SAY = { pepperoni: 'Pepperoni!', mushroom: 'Mushroom!', olive: 'Olive!', pepper: 'Green pepper!',
    tomato: 'Tomato!', pineapple: 'Pineapple!', basil: 'Basil!', cheese: 'Cheese!' };

  let el, cell, pizza, tops, pupEl, bins;
  let baked = false, baking = false, serving = false, drag = null, pz = null, offX = 0, offY = 0;

  function init() {
    el = document.getElementById('kitchen');
    el.innerHTML = `<button class="rbtn back corner" data-back aria-label="Back to home">${I.back}</button>
<div class="k-main">
  <div class="k-pup"><div class="k-pupwrap">${A.pup('baby')}</div></div>
  <div class="k-cell"><div class="pizza"><div class="pz">${A.pizzaSvg}<div class="tops"></div><div class="steam"><span></span><span></span><span></span></div><div class="oven"><div class="glow"></div>${A.ovenSvg}</div></div></div></div>
  <div class="k-btns">
    <button class="rbtn big oven-btn" aria-label="Bake in the oven">${I.oven}</button>
    <button class="rbtn big serve-btn" aria-label="Give the pizza to baby pup">${I.serve}</button>
    <button class="rbtn new-btn" aria-label="New pizza">${I.newPizza}</button>
  </div>
</div>
<div class="toolbar bins">${TOPS.map(t => `<button class="tool bin" data-top="${t}" aria-label="${t}">${A.topping(t, true)}</button>`).join('')}</div>`;

    cell = el.querySelector('.k-cell');
    pizza = el.querySelector('.pizza');
    tops = el.querySelector('.tops');
    pupEl = el.querySelector('.k-pupwrap');
    bins = el.querySelector('.bins');

    bins.addEventListener('pointerdown', binDown);
    bins.addEventListener('pointermove', binMove);
    bins.addEventListener('pointerup', binUp);
    bins.addEventListener('pointercancel', function (e) { if (drag && e.pointerId === drag.id) endDrag(); });

    pizza.addEventListener('pointerdown', pizzaDown);
    pizza.addEventListener('pointermove', pizzaMove);
    pizza.addEventListener('pointerup', pizzaUp);
    pizza.addEventListener('pointercancel', pizzaUp);

    el.querySelector('.oven-btn').addEventListener('click', bake);
    el.querySelector('.serve-btn').addEventListener('click', serve);
    el.querySelector('.new-btn').addEventListener('click', function () {
      if (baking || serving) return;
      TW.sound.swish();
      resetPizza();
    });
    pupEl.addEventListener('pointerdown', function () {
      if (baked && !serving && !baking) { serve(); return; }
      TW.sound.boing();
      TW.fx.bounce(pupEl);
      const r = pupEl.getBoundingClientRect();
      TW.fx.hearts(r.left + r.width / 2, r.top + r.height * 0.2, 2);
    });
    window.addEventListener('resize', function () { if (el.classList.contains('active')) sizePizza(); });
  }

  function sizePizza() {
    const r = cell.getBoundingClientRect();
    if (r.width < 2) return;
    const p = Math.max(140, Math.floor(Math.min(r.width, r.height) * 0.76));
    pizza.style.setProperty('--p', p + 'px');
  }

  // ----- toppings: tap a bin to drop one, or drag it to a spot -----
  function binDown(e) {
    const b = e.target.closest('.bin');
    if (!b || baking || serving || drag) return;
    e.preventDefault();
    try { b.setPointerCapture(e.pointerId); } catch (_) {}
    const g = document.createElement('div');
    g.className = 'ghost';
    g.innerHTML = A.topping(b.dataset.top, true);
    document.body.appendChild(g);
    drag = { b: b, id: e.pointerId, kind: b.dataset.top, sx: e.clientX, sy: e.clientY, g: g, moved: false };
    moveGhost(e.clientX, e.clientY);
    b.classList.add('held');
    TW.sound.softPop();
  }
  function binMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 14) drag.moved = true;
    moveGhost(e.clientX, e.clientY);
  }
  function binUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    endDrag();
    place(d.kind, e.clientX, e.clientY, d.moved);
  }
  function moveGhost(x, y) { drag.g.style.left = x + 'px'; drag.g.style.top = y + 'px'; }
  function endDrag() { drag.g.remove(); drag.b.classList.remove('held'); drag = null; }

  function place(kind, x, y, precise) {
    const r = pizza.getBoundingClientRect(), R = r.width / 2;
    let nx, ny;
    if (precise) {
      // Dropped anywhere: land on the pizza at the nearest spot (never a miss).
      nx = (x - (r.left + R)) / R; ny = (y - (r.top + R)) / R;
      const d = Math.hypot(nx, ny);
      if (d > RIM) { nx *= RIM / d; ny *= RIM / d; }
    } else {
      const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * (RIM - 0.02);
      nx = Math.cos(a) * d; ny = Math.sin(a) * d;
    }
    const n = kind === 'cheese' ? 6 : 1;
    for (let i = 0; i < n; i++) {
      let px = nx, py = ny;
      if (kind === 'cheese') {
        px += (Math.random() - 0.5) * 0.8; py += (Math.random() - 0.5) * 0.8;
        const d = Math.hypot(px, py);
        if (d > RIM + 0.02) { px *= (RIM + 0.02) / d; py *= (RIM + 0.02) / d; }
      }
      addTop(kind, px, py);
    }
    el.classList.add('has-tops');
    TW.sound.pop();
    TW.voice.say(SAY[kind]);
    TW.fx.burst(r.left + R + nx * R, r.top + R + ny * R, { count: 4 });
  }

  function addTop(kind, nx, ny) {
    const t = document.createElement('div');
    t.className = 'tp ' + kind;
    t.style.left = (50 + nx * 50) + '%';
    t.style.top = (50 + ny * 50) + '%';
    t.style.setProperty('--r', Math.round(Math.random() * 360) + 'deg');
    t.innerHTML = A.topping(kind, false);
    tops.appendChild(t);
    while (tops.children.length > MAX_TOPS) tops.firstChild.remove();
  }

  // ----- oven -----
  function bake() {
    if (baking || serving) return;
    baking = true;
    el.classList.add('baking');
    TW.sound.whoosh();
    setTimeout(function () { TW.sound.sizzle(2); }, 450);
    setTimeout(function () { pizza.classList.add('baked'); }, 1200);
    setTimeout(function () {
      TW.sound.ding();
      TW.voice.praise();
      el.classList.remove('baking');
      baking = false;
      baked = true;
      el.classList.add('is-baked');
      const c = TW.fx.center(pizza);
      TW.fx.burst(c.x, c.y, { count: 14 });
    }, 2600);
  }

  // ----- serving: the button, a tap on baby pup, or dragging the pizza to her -----
  function pizzaDown(e) {
    if (!baked || baking || serving) return;
    e.preventDefault();
    try { pizza.setPointerCapture(e.pointerId); } catch (_) {}
    pz = { id: e.pointerId, sx: e.clientX, sy: e.clientY };
    pizza.style.transition = 'transform .12s';
    pizza.style.transform = 'scale(.9)';
    TW.sound.softPop();
  }
  function pizzaMove(e) {
    if (!pz || e.pointerId !== pz.id) return;
    offX = e.clientX - pz.sx; offY = e.clientY - pz.sy;
    pizza.style.transition = 'none';
    pizza.style.transform = `translate(${offX}px,${offY}px) scale(.8)`;
  }
  function pizzaUp(e) {
    if (!pz || e.pointerId !== pz.id) return;
    pz = null;
    const r = pupEl.getBoundingClientRect(), pad = 50;
    if (e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad) {
      serve();
      return;
    }
    offX = offY = 0;
    pizza.style.transition = 'transform .35s cubic-bezier(.3,1.6,.5,1)';
    pizza.style.transform = '';
  }

  function serve() {
    if (!baked || serving || baking) return;
    serving = true;
    el.classList.add('serving');
    const pr = pizza.getBoundingClientRect(), br = pupEl.getBoundingClientRect();
    const tx = offX + (br.left + br.width / 2) - (pr.left + pr.width / 2);
    const ty = offY + (br.top + br.height * 0.55) - (pr.top + pr.height / 2);
    pizza.style.transition = 'transform .75s cubic-bezier(.45,-.25,.5,1), opacity .25s .6s';
    pizza.style.transform = `translate(${tx}px,${ty}px) scale(.16) rotate(200deg)`;
    pizza.style.opacity = '0';
    TW.sound.whoosh();
    setTimeout(function () {
      TW.sound.munch();
      TW.fx.bounce(pupEl, 'happy');
      const r = pupEl.getBoundingClientRect();
      TW.fx.hearts(r.left + r.width / 2, r.top + r.height * 0.25, 9);
      setTimeout(function () { TW.sound.chime(); TW.voice.praise(); }, 450);
    }, 760);
    setTimeout(resetPizza, 2400);
  }

  function resetPizza() {
    tops.innerHTML = '';
    baked = false;
    serving = false;
    offX = offY = 0;
    pizza.classList.remove('baked');
    el.classList.remove('serving', 'is-baked', 'has-tops');
    pizza.style.transition = 'none';
    pizza.style.opacity = '1';
    pizza.style.transform = 'scale(0)';
    void pizza.offsetWidth;
    pizza.style.transition = 'transform .45s cubic-bezier(.3,1.6,.5,1)';
    pizza.style.transform = '';
    TW.sound.boing();
  }

  TW.registerScene('kitchen', {
    init: init,
    enter: function () { sizePizza(); requestAnimationFrame(sizePizza); },
    leave: function () { if (drag) endDrag(); }
  });
})();
