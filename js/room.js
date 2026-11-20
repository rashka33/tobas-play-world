// Shared engine for the pretend-play rooms: one big SVG with tappable props.
// Each room has a landscape layout (viewBox 1000x620) and a portrait one (600x1000),
// so props stay finger-sized on phones held either way.
(function () {
  const VB = { L: '0 0 1000 620', P: '0 0 600 1000' };

  function tf(p) { return `translate(${p[0]}px,${p[1]}px) scale(${p[2] || 1})`; }

  TW.makeRoom = function (cfg) {
    let el, svg, layout = null, drag = null;
    const items = {};
    let overrides = {}; // positions moved at runtime (walking, flying into boxes); per layout
    cfg.items.forEach(function (it) { items[it.id] = it; });

    function draw(it) { return typeof it.draw === 'function' ? it.draw(api) : it.draw; }
    function pos(it) {
      if (overrides[it.id]) return overrides[it.id];
      return typeof it.pos === 'function' ? it.pos(layout, api) : it.pos[layout];
    }

    const api = {
      state: cfg.state || {},
      layout: function () { return layout; },
      node: function (id) { return svg.querySelector(`.prop[data-id="${id}"]`); },
      anim: function (id) { return api.node(id).querySelector('.anim'); },
      redraw: function (id) { api.anim(id).innerHTML = draw(items[id]); },
      place: function (id) { api.node(id).style.transform = tf(pos(items[id])); },
      pos: function (id) { return pos(items[id]); },
      home: function (id) { const o = overrides[id]; delete overrides[id]; const p = pos(items[id]); if (o) overrides[id] = o; return p; },
      setPos: function (id, p) { overrides[id] = p; api.place(id); },
      clearPos: function (id) { delete overrides[id]; api.place(id); },
      // Slide a prop (and anything that follows it) somewhere, waddling if it's a walker.
      walk: function (id, x, y, deps, ms) {
        ms = ms || 900;
        const p = pos(items[id]);
        overrides[id] = [x, y == null ? p[1] : y, p[2]];
        [id].concat(deps || []).forEach(function (k) {
          const n = api.node(k);
          n.style.transition = `transform ${ms}ms ease-in-out`;
          n.style.transform = tf(pos(items[k]));
          setTimeout(function () { n.style.transition = ''; }, ms + 60);
        });
        api.play(id, 'walking');
      },
      show: function (id, on) { api.node(id).style.display = on ? '' : 'none'; },
      play: function (target, cls) { TW.fx.bounce(typeof target === 'string' ? api.anim(target) : target, cls); },
      center: function (id) { return TW.fx.center(api.anim(id)); },
      // viewBox point -> screen point
      point: function (x, y) {
        const m = svg.getScreenCTM(), pt = svg.createSVGPoint();
        pt.x = x; pt.y = y;
        const r = pt.matrixTransform(m);
        return { x: r.x, y: r.y };
      },
      // screen point -> viewBox point
      toSvg: function (x, y) {
        const m = svg.getScreenCTM().inverse(), pt = svg.createSVGPoint();
        pt.x = x; pt.y = y;
        const r = pt.matrixTransform(m);
        return { x: r.x, y: r.y };
      },
      // point given in an item's own drawing coordinates -> screen point
      local: function (id, x, y) {
        const p = pos(items[id]), s = p[2] || 1;
        return api.point(p[0] + x * s, p[1] + y * s);
      },
      active: function () { return el.classList.contains('active'); },
      // Run later only if the child is still in this room.
      later: function (fn, ms) { setTimeout(function () { if (api.active()) fn(); }, ms); },
      el: function () { return el; }
    };

    function render() {
      const L = window.innerWidth >= window.innerHeight * 1.15 ? 'L' : 'P';
      if (L === layout) return;
      layout = L;
      overrides = {};
      svg.setAttribute('viewBox', VB[L]);
      svg.innerHTML = (cfg.defs ? `<defs>${cfg.defs}</defs>` : '') + '<g class="world">' +
        `<g class="bg">${cfg.bg(L)}</g>` +
        cfg.items.map(function (it) {
          const hit = it.hit ? `<rect class="hit" x="${-it.hit[0] / 2}" y="${-it.hit[1] / 2 + (it.hitDy || 0)}" width="${it.hit[0]}" height="${it.hit[1]}" rx="24" fill="transparent"/>` : '';
          return `<g class="prop${it.tap || it.drag ? ' tappable' : ''}" data-id="${it.id}" style="transform:${tf(pos(it))}"><g class="anim">${draw(it)}</g>${hit}</g>`;
        }).join('') + '</g>';
      if (cfg.onRender) cfg.onRender(api);
    }

    // A tap: run the prop's own reaction, then make sure it moved, sparkled, made a sound and (if it has one) said its name.
    function tapProp(it, g, x, y) {
      const spoke = TW.voice.count;
      if (it.tap) it.tap(api, { x: x, y: y, g: g });
      TW.fx.burst(x, y, { count: 5 });
      TW.sound.softPop();
      if (it.say && TW.voice.count === spoke) TW.voice.say(typeof it.say === 'function' ? it.say(api) : it.say);
      const a = g.querySelector('.anim');
      if (a && a.getAnimations && !a.getAnimations().length) TW.fx.bounce(a, 'jiggle');
    }

    function init() {
      el = document.getElementById(cfg.id);
      el.classList.add('room');
      el.innerHTML = `<button class="rbtn back corner" data-back aria-label="Back to home">${TW.art.icons.back}</button>
<div class="room-stage"><svg class="room-svg" ${TW.art.NS}></svg></div>${cfg.html || ''}`;
      svg = el.querySelector('.room-svg');
      svg.addEventListener('pointerdown', function (e) {
        const g = e.target.closest && e.target.closest('.prop');
        if (!g || drag) return;
        const it = items[g.dataset.id];
        if (!it || !(it.tap || it.drag)) return;
        e.preventDefault();
        if (it.drag) {
          try { svg.setPointerCapture(e.pointerId); } catch (_) {}
          drag = { it: it, g: g, id: e.pointerId, sx: e.clientX, sy: e.clientY, moved: false };
          return;
        }
        tapProp(it, g, e.clientX, e.clientY);
      });
      svg.addEventListener('pointermove', function (e) {
        if (!drag || e.pointerId !== drag.id) return;
        if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 14) {
          drag.moved = true;
          if (drag.it.drag.start) drag.it.drag.start(api);
        }
        if (drag.moved) drag.it.drag.move(api, api.toSvg(e.clientX, e.clientY));
      });
      function up(e) {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag; drag = null;
        if (d.moved) d.it.drag.end(api, api.toSvg(e.clientX, e.clientY), { x: e.clientX, y: e.clientY });
        else if (e.type === 'pointerup') tapProp(d.it, d.g, e.clientX, e.clientY);
      }
      svg.addEventListener('pointerup', up);
      svg.addEventListener('pointercancel', up);
      window.addEventListener('resize', function () { if (el.classList.contains('active')) render(); });
      render();
      if (cfg.init) cfg.init(api);
    }

    TW.registerScene(cfg.id, { init: init, enter: function () { render(); if (cfg.enter) cfg.enter(api); } });
    return api;
  };

  // A family pup drawn centred on (0,0) so it can be placed like any prop.
  TW.pupAt = function (name, opts) {
    return '<g transform="translate(-100 -120)">' + TW.art.pup(name, Object.assign({ ov: true }, opts || {})) + '</g>';
  };

  // Tiny seeded random so backgrounds look the same every time.
  TW.seeded = function (seed) {
    let s = seed;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  };

  // Is a viewBox point inside a prop's hit box?
  TW.inHit = function (api, id, p, pad) {
    const g = api.node(id), h = g.querySelector(':scope > .hit');
    const r = h.getBoundingClientRect(), s = api.point(p.x, p.y);
    pad = pad || 20;
    return s.x > r.left - pad && s.x < r.right + pad && s.y > r.top - pad && s.y < r.bottom + pad;
  };
})();
