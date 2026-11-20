// Shared engine for the pretend-play rooms: one big SVG with tappable props.
// Each room has a landscape layout (viewBox 1000x620) and a portrait one (600x1000),
// so props stay finger-sized on phones held either way.
(function () {
  const VB = { L: '0 0 1000 620', P: '0 0 600 1000' };

  function tf(p) { return `translate(${p[0]}px,${p[1]}px) scale(${p[2] || 1})`; }

  TW.makeRoom = function (cfg) {
    let el, svg, layout = null;
    const items = {};
    cfg.items.forEach(function (it) { items[it.id] = it; });

    function draw(it) { return typeof it.draw === 'function' ? it.draw(api) : it.draw; }
    function pos(it) { return typeof it.pos === 'function' ? it.pos(layout, api) : it.pos[layout]; }

    const api = {
      state: cfg.state || {},
      layout: function () { return layout; },
      node: function (id) { return svg.querySelector(`.prop[data-id="${id}"]`); },
      anim: function (id) { return api.node(id).querySelector('.anim'); },
      redraw: function (id) { api.anim(id).innerHTML = draw(items[id]); },
      place: function (id) { api.node(id).style.transform = tf(pos(items[id])); },
      pos: function (id) { return pos(items[id]); },
      play: function (target, cls) { TW.fx.bounce(typeof target === 'string' ? api.anim(target) : target, cls); },
      center: function (id) { return TW.fx.center(api.anim(id)); },
      // viewBox point -> screen point
      point: function (x, y) {
        const m = svg.getScreenCTM(), pt = svg.createSVGPoint();
        pt.x = x; pt.y = y;
        const r = pt.matrixTransform(m);
        return { x: r.x, y: r.y };
      },
      // point given in an item's own drawing coordinates -> screen point
      local: function (id, x, y) {
        const p = pos(items[id]), s = p[2] || 1;
        return api.point(p[0] + x * s, p[1] + y * s);
      },
      el: function () { return el; }
    };

    function render() {
      const L = window.innerWidth >= window.innerHeight * 1.15 ? 'L' : 'P';
      if (L === layout) return;
      layout = L;
      svg.setAttribute('viewBox', VB[L]);
      svg.innerHTML = (cfg.defs ? `<defs>${cfg.defs}</defs>` : '') + '<g class="world">' +
        `<g class="bg">${cfg.bg(L)}</g>` +
        cfg.items.map(function (it) {
          const hit = it.hit ? `<rect class="hit" x="${-it.hit[0] / 2}" y="${-it.hit[1] / 2 + (it.hitDy || 0)}" width="${it.hit[0]}" height="${it.hit[1]}" rx="24" fill="transparent"/>` : '';
          return `<g class="prop${it.tap ? ' tappable' : ''}" data-id="${it.id}" style="transform:${tf(pos(it))}"><g class="anim">${draw(it)}</g>${hit}</g>`;
        }).join('') + '</g>';
      if (cfg.onRender) cfg.onRender(api);
    }

    function init() {
      el = document.getElementById(cfg.id);
      el.classList.add('room');
      el.innerHTML = `<button class="rbtn back corner" data-back aria-label="Back to home">${TW.art.icons.back}</button>
<div class="room-stage"><svg class="room-svg" ${TW.art.NS}></svg></div>${cfg.html || ''}`;
      svg = el.querySelector('.room-svg');
      svg.addEventListener('pointerdown', function (e) {
        const g = e.target.closest && e.target.closest('.prop');
        if (!g) return;
        const it = items[g.dataset.id];
        if (!it || !it.tap) return;
        e.preventDefault();
        it.tap(api, { x: e.clientX, y: e.clientY, g: g });
        // Every prop answers: a sparkle where the finger landed, and a jiggle if the prop isn't already moving.
        TW.fx.burst(e.clientX, e.clientY, { count: 5 });
        const a = g.querySelector('.anim');
        if (a && a.getAnimations && !a.getAnimations().length) TW.fx.bounce(a, 'jiggle');
      });
      window.addEventListener('resize', function () { if (el.classList.contains('active')) render(); });
      render();
      if (cfg.init) cfg.init(api);
    }

    TW.registerScene(cfg.id, { init: init, enter: render });
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
})();
