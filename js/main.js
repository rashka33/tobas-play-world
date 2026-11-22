// Scene router and global touch guards.
window.TW = window.TW || {};
(function () {
  const scenes = {};
  let current = 'hub', tapped = false;
  const WELCOME = {
    paint: "Let's paint!", coloring: 'Pick a color!', dressup: 'Dress up time!', kitchen: "Let's make pizza!",
    wizard: 'Magic time!', space: 'Blast off!', vanity: 'So pretty!', lab: "Let's mix!", dragon: 'A dragon friend!',
    animals: 'Hello, animal friends!', sorting: "Let's sort!", helper: "Let's help Mummy!",
    glow: 'Glow drawing! Draw with light!'
  };
  TW.current = function () { return current; };

  TW.registerScene = function (id, obj) { scenes[id] = obj; };

  TW.show = function (id) {
    if (id === current) return;
    const prev = scenes[current];
    if (prev && prev.leave) prev.leave();
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.toggle('active', s.id === id); });
    current = id;
    TW.voice.cancel();
    if (id === 'hub') { if (tapped) TW.sound.musicStart(); } else TW.sound.musicStop();
    const s = scenes[id];
    if (s) {
      if (!s._ready) { s.init(); s._ready = true; }
      if (s.enter) s.enter();
    }
    if (WELCOME[id]) TW.voice.say(WELCOME[id]);
  };

  TW.boot = function () {
    // Audio can only start inside a user gesture (iOS).
    document.addEventListener('pointerdown', function () {
      TW.sound.unlock();
      TW.voice.unlock();
      tapped = true;
      if (current === 'hub') TW.sound.musicStart();
    }, true);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { TW.sound.musicStop(); TW.voice.cancel(); }
      else if (current === 'hub' && tapped) TW.sound.musicStart();
    });
    // Every toolbar/picture button answers a press with a tiny sparkle.
    document.addEventListener('pointerdown', function (e) {
      const b = e.target.closest && e.target.closest('.tool, .blob, .thumb, .cat, .item, .bin, .rbtn');
      if (!b) return;
      TW.fx.bounce(b, 'pressed');
      const c = TW.fx.center(b);
      TW.fx.burst(c.x, c.y, { count: 4 });
    });
    // No zooming, long-press menus or double-tap surprises.
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
    document.addEventListener('dblclick', function (e) { e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); });
    document.addEventListener('touchmove', function (e) {
      if (!e.target.closest || !e.target.closest('.scrolly')) e.preventDefault();
    }, { passive: false });

    document.addEventListener('click', function (e) {
      const b = e.target.closest && e.target.closest('[data-back]');
      if (b) { TW.sound.swish(); TW.show('hub'); }
    });

    scenes.hub.init(); scenes.hub._ready = true;
  };
})();
