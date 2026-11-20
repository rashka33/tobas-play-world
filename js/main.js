// Scene router and global touch guards.
window.TW = window.TW || {};
(function () {
  const scenes = {};
  let current = 'hub';

  TW.registerScene = function (id, obj) { scenes[id] = obj; };

  TW.show = function (id) {
    if (id === current) return;
    const prev = scenes[current];
    if (prev && prev.leave) prev.leave();
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.toggle('active', s.id === id); });
    current = id;
    const s = scenes[id];
    if (s) {
      if (!s._ready) { s.init(); s._ready = true; }
      if (s.enter) s.enter();
    }
  };

  TW.boot = function () {
    // Audio can only start inside a user gesture (iOS).
    document.addEventListener('pointerdown', function () { TW.sound.unlock(); }, true);
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
