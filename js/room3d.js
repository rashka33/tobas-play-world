// Stage 3 (Nov 27): the 3D room — a gentle real-time three.js corner of
// Toba's own room. Drag to look around; tap a thing and it bounces, says
// its name, and the cat cheers. Speech rule holds: the room only ever says
// lines that exist in the voice pack (TW.voice.say with pack keys below).
// No timers, no points, no fail states. Rendering pauses when the room
// is not the active screen.
window.TW = window.TW || {};
(function () {
  // Hub art for the new stepping stone (hub.js reads TW.art.hubArt at boot;
  // this file loads before TW.boot() runs, so the key lands in time).
  if (TW.art && TW.art.hubArt && !TW.art.hubArt.room3d) {
    const O = TW.art.O, NS = TW.art.NS;
    TW.art.hubArt.room3d = `<svg ${NS} viewBox="0 0 120 120"><path d="M14 58 L60 16 L106 58" fill="none" stroke="${O}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 54 V104 H94 V54" fill="#FFF3D6" stroke="${O}" stroke-width="5" stroke-linejoin="round"/><path d="M14 58 L60 16 L106 58 L98 66 L60 30 L22 66 Z" fill="#FF6B6B" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><rect x="50" y="74" width="20" height="30" rx="9" fill="#0E7C66" stroke="${O}" stroke-width="4"/><circle cx="66" cy="90" r="2.6" fill="#FFD93D"/><rect x="30" y="62" width="14" height="14" rx="3" fill="#7FD6FF" stroke="${O}" stroke-width="3.5"/><circle cx="88" cy="34" r="10" fill="#FFD93D" stroke="${O}" stroke-width="3.5"/></svg>`;
  }

  const CAT = 'assets/cat/';
  let section = null, wrap = null, fallbackEl = null;
  let renderer = null, scene = null, camera = null, raycaster = null;
  let built = false, running = false, rafId = 0;
  let yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0;
  let hitMeshes = [], groups = {};
  let found = {}, foundCount = 0, celebrated = false;
  let catSprite = null, catTex = {}, catPose = 'wave', catPoseUntil = 0, catHopT0 = -1;
  const CAT_Y = 1.02;
  let floater = null;

  // ---------- tiny builders (three.js primitives only) ----------
  function M(color) { return new THREE.MeshLambertMaterial({ color: color }); }
  function box(w, h, d, color, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(color));
    m.position.set(x, y, z); return m;
  }
  function sph(r, color, x, y, z, sx, sy, sz) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), M(color));
    m.position.set(x, y, z); if (sx) m.scale.set(sx, sy, sz); return m;
  }
  function cyl(rt, rb, h, color, x, y, z) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 18), M(color));
    m.position.set(x, y, z); return m;
  }
  // Invisible-but-raycastable fat touch target, so little fingers cannot miss.
  function proxy(geo, x, y, z) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, transparent: true }));
    m.position.set(x, y, z); return m;
  }
  function group(key, say, x, y, z, rotY, burstY) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    if (rotY) g.rotation.y = rotY;
    g.userData = { key: key, say: say, burstY: burstY, animT0: 0, flash: 0 };
    groups[key] = g;
    return g;
  }
  function addProxy(g, mesh) {
    mesh.userData.objGroup = g;
    g.add(mesh); hitMeshes.push(mesh);
  }

  // ---------- the room and its things ----------
  function buildScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFDF3DC);
    camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
    raycaster = new THREE.Raycaster();

    scene.add(new THREE.HemisphereLight(0xFFF6E0, 0x8A6A4A, 0.95));
    const sun = new THREE.DirectionalLight(0xFFE9C4, 0.55);
    sun.position.set(4, 8, 6);
    scene.add(sun);

    // Floor and two warm walls (a cosy corner).
    scene.add(box(13, 0.2, 13, 0xC8894E, 0, -0.1, 0));
    scene.add(box(13, 6.4, 0.2, 0xF3E3C2, 0, 3.2, -6.1));
    scene.add(box(0.2, 6.4, 13, 0xEFDBB8, -6.1, 3.2, 0));
    // Rug: teal with a sunny middle.
    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.7, 36), M(0x35A08B));
    rug.rotation.x = -Math.PI / 2; rug.position.set(0.3, 0.02, 0.6); scene.add(rug);
    const rugIn = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), M(0xFFD93D));
    rugIn.rotation.x = -Math.PI / 2; rugIn.position.set(0.3, 0.035, 0.6); scene.add(rugIn);

    // Window on the back wall, with sun and clouds outside.
    const win = new THREE.Group(); win.position.set(1.8, 3.5, -5.96);
    win.add(box(2.7, 2.7, 0.1, 0xFFFFFF, 0, 0, 0));
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), M(0xBFE8FF));
    glass.position.z = 0.06; win.add(glass);
    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(0.34, 24), M(0xFFD93D));
    sunDisc.position.set(-0.62, 0.66, 0.08); win.add(sunDisc);
    const cloud1 = sph(0.3, 0xFFFFFF, 0.55, 0.5, 0.08, 1.5, 0.62, 0.4);
    const cloud2 = sph(0.22, 0xFFFFFF, -0.35, -0.55, 0.08, 1.6, 0.6, 0.4);
    win.add(cloud1); win.add(cloud2);
    win.add(box(0.09, 2.3, 0.05, 0xFFFFFF, 0, 0, 0.1));
    win.add(box(2.3, 0.09, 0.05, 0xFFFFFF, 0, 0, 0.1));
    scene.add(win);

    // Bed (scenery) along the left wall.
    const bed = new THREE.Group(); bed.position.set(-4.3, 0, -2.6);
    bed.add(box(3.2, 0.7, 4.6, 0xB5733F, 0, 0.35, 0));
    bed.add(box(3.0, 0.35, 4.4, 0xFFF6E6, 0, 0.85, 0));
    bed.add(box(3.05, 0.18, 2.6, 0xFF8FB8, 0, 1.05, 0.8));
    bed.add(box(1.6, 0.3, 1.0, 0xFFFFFF, 0, 1.15, -1.6));
    bed.add(box(3.2, 1.1, 0.18, 0xB5733F, 0, 0.9, -2.35));
    scene.add(bed);

    // Table (scenery) on the right.
    const table = new THREE.Group(); table.position.set(2.8, 0, -2.6);
    table.add(box(3.2, 0.16, 2.2, 0x8A5A33, 0, 1.5, 0));
    [[-1.45, -0.95], [1.45, -0.95], [-1.45, 0.95], [1.45, 0.95]].forEach(function (p) {
      table.add(cyl(0.09, 0.09, 1.5, 0x7A4A2C, p[0], 0.75, p[1]));
    });
    scene.add(table);

    // Duck pond disc (scenery).
    const pond = new THREE.Mesh(new THREE.CircleGeometry(0.78, 28), M(0x7FD6FF));
    pond.rotation.x = -Math.PI / 2; pond.position.set(-0.6, 0.045, 2.7); scene.add(pond);

    // ----- the ten tappable things (every name is a voice-pack line) -----

    // Teddy bear, sitting on the bed. Pack: "Teddy bear!" (v098)
    const teddy = group('teddy', 'Teddy bear!', -4.3, 1.03, -3.1, 0.35, 0.85);
    teddy.add(sph(0.42, 0xA0663A, 0, 0.42, 0, 1, 1.15, 0.9));
    teddy.add(sph(0.29, 0xE8C08A, 0, 0.4, 0.24, 1, 1.1, 0.55));
    teddy.add(sph(0.34, 0xA0663A, 0, 1.06, 0));
    teddy.add(sph(0.13, 0xA0663A, -0.25, 1.33, 0));
    teddy.add(sph(0.13, 0xA0663A, 0.25, 1.33, 0));
    teddy.add(sph(0.16, 0xE8C08A, 0, 0.99, 0.27, 1.2, 0.8, 0.9));
    teddy.add(sph(0.13, 0xA0663A, -0.47, 0.55, 0.06, 1, 1.6, 1));
    teddy.add(sph(0.13, 0xA0663A, 0.47, 0.55, 0.06, 1, 1.6, 1));
    teddy.add(sph(0.15, 0xA0663A, -0.22, 0.09, 0.3));
    teddy.add(sph(0.15, 0xA0663A, 0.22, 0.09, 0.3));
    addProxy(teddy, proxy(new THREE.SphereGeometry(0.88, 10, 8), 0, 0.75, 0));
    scene.add(teddy);

    // Ball on the rug. Pack: "Ball!" (v157)
    const ball = group('ball', 'Ball!', 1.5, 0, 1.0, 0, 0.55);
    ball.add(sph(0.55, 0xFF5A6E, 0, 0.55, 0));
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.075, 10, 28), M(0xFFFFFF));
    band.rotation.x = Math.PI / 2; band.position.y = 0.55; ball.add(band);
    addProxy(ball, proxy(new THREE.SphereGeometry(0.72, 10, 8), 0, 0.55, 0));
    scene.add(ball);

    // Balloon floating by the table. Pack: "Balloon!" (v097)
    const balloon = group('balloon', 'Balloon!', 4.3, 0, -0.8, 0, 3.0);
    floater = new THREE.Group();
    floater.add(sph(0.62, 0xFF6B6B, 0, 3.0, 0, 1, 1.15, 1));
    const knot = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 10), M(0xFF6B6B));
    knot.rotation.x = Math.PI; knot.position.y = 2.18; floater.add(knot);
    floater.add(cyl(0.014, 0.014, 2.0, 0x8A5A33, 0, 1.18, 0));
    balloon.add(floater);
    balloon.add(box(0.34, 0.26, 0.34, 0x4B5BD6, 0, 0.13, 0));
    addProxy(balloon, proxy(new THREE.SphereGeometry(0.85, 10, 8), 0, 3.0, 0));
    scene.add(balloon);

    // Cup on the table. Pack: "Cup!" (v155)
    const cup = group('cup', 'Cup!', 2.0, 1.58, -2.05, 0, 0.24);
    cup.add(cyl(0.23, 0.17, 0.42, 0x14A085, 0, 0.21, 0));
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.045, 8, 18, Math.PI), M(0x14A085));
    handle.position.set(0.25, 0.21, 0); handle.rotation.z = -Math.PI / 2; cup.add(handle);
    addProxy(cup, proxy(new THREE.BoxGeometry(0.62, 0.6, 0.62), 0, 0.24, 0));
    scene.add(cup);

    // Apple on the table. Pack: "Apple!" (v028)
    const apple = group('apple', 'Apple!', 3.55, 1.58, -2.35, 0, 0.26);
    apple.add(sph(0.27, 0xE23B3B, 0, 0.24, 0, 1, 0.92, 1));
    const stem = cyl(0.03, 0.03, 0.2, 0x7A4A2C, 0.03, 0.52, 0); stem.rotation.z = 0.25; apple.add(stem);
    apple.add(sph(0.13, 0x4CC25E, 0.14, 0.56, 0, 1.3, 0.4, 0.8));
    addProxy(apple, proxy(new THREE.SphereGeometry(0.4, 10, 8), 0, 0.26, 0));
    scene.add(apple);

    // Banana on the table. Pack: "Banana!" (v170)
    const banana = group('banana', 'Banana!', 2.75, 1.58, -3.3, 0.5, 0.2);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.115, 10, 20, Math.PI * 0.95), M(0xFFD93D));
    arc.rotation.set(-Math.PI / 2 + 0.5, 0, Math.PI * 0.05); arc.position.y = 0.13;
    banana.add(arc);
    addProxy(banana, proxy(new THREE.BoxGeometry(0.9, 0.45, 0.45), 0, 0.16, 0));
    scene.add(banana);

    // Toy blocks on the rug. Pack: "Block!" (v158)
    const block = group('block', 'Block!', -1.3, 0, 1.6, 0.5, 0.55);
    block.add(box(0.62, 0.62, 0.62, 0x3FA7FF, 0, 0.31, 0));
    const top = box(0.44, 0.44, 0.44, 0xFFD93D, 0.05, 0.84, 0.02); top.rotation.y = 0.4; block.add(top);
    addProxy(block, proxy(new THREE.BoxGeometry(1.0, 1.25, 1.0), 0, 0.55, 0));
    scene.add(block);

    // Rubber duck on its pond. Pack: "Rubber duck!" (v159)
    const duck = group('duck', 'Rubber duck!', -0.6, 0.03, 2.7, 0.2, 0.35);
    duck.add(sph(0.3, 0xFFD93D, 0, 0.24, 0, 1.15, 0.9, 1.3));
    duck.add(sph(0.2, 0xFFD93D, 0, 0.52, 0.16));
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 10), M(0xFF9F1C));
    beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.5, 0.4); duck.add(beak);
    addProxy(duck, proxy(new THREE.SphereGeometry(0.52, 10, 8), 0, 0.3, 0));
    scene.add(duck);

    // Toy box in the corner. Pack: "Toy box!" (v162)
    const toybox = group('toybox', 'Toy box!', 4.55, 0, 0.75, -0.5, 0.55);
    toybox.add(box(1.7, 0.1, 1.1, 0xE07F3F, 0, 0.05, 0));
    toybox.add(box(1.7, 0.55, 0.08, 0xFF9F5A, 0, 0.32, 0.51));
    toybox.add(box(1.7, 0.55, 0.08, 0xFF9F5A, 0, 0.32, -0.51));
    toybox.add(box(0.08, 0.55, 1.1, 0xFF9F5A, -0.81, 0.32, 0));
    toybox.add(box(0.08, 0.55, 1.1, 0xFF9F5A, 0.81, 0.32, 0));
    toybox.add(sph(0.22, 0xFF5A6E, -0.3, 0.62, 0.05));
    toybox.add(sph(0.18, 0x3FA7FF, 0.35, 0.6, -0.1));
    addProxy(toybox, proxy(new THREE.BoxGeometry(1.95, 1.05, 1.35), 0, 0.5, 0));
    scene.add(toybox);

    // Flower in a pot by the window. Pack: "Flower!" (v115)
    const flower = group('flower', 'Flower!', 0.1, 0, -4.75, 0, 1.15);
    flower.add(cyl(0.2, 0.27, 0.44, 0xC65B39, 0, 0.22, 0));
    flower.add(cyl(0.035, 0.035, 0.72, 0x2F8F3A, 0, 0.78, 0));
    flower.add(sph(0.13, 0xFFD93D, 0, 1.18, 0.03));
    [[-0.17, 1.18], [0.17, 1.18], [-0.09, 1.33], [0.09, 1.33], [-0.09, 1.03], [0.09, 1.03]].forEach(function (p) {
      flower.add(sph(0.105, 0xFF8CC8, p[0], p[1], 0.03));
    });
    addProxy(flower, proxy(new THREE.SphereGeometry(0.52, 10, 8), 0, 1.1, 0));
    scene.add(flower);

    // The cat, as a billboard sprite in the middle of the rug.
    const loader = new THREE.TextureLoader();
    catTex.wave = loader.load(CAT + 'wave.png');
    catTex.cheer = loader.load(CAT + 'cheer.png');
    catTex.wave.encoding = THREE.sRGBEncoding;
    catTex.cheer.encoding = THREE.sRGBEncoding;
    catSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: catTex.wave, transparent: true }));
    catSprite.position.set(0.9, CAT_Y, -0.9);
    catSprite.scale.set(2.0, 2.0, 1);
    scene.add(catSprite);
  }

  // ---------- interaction ----------
  function burstAt(g) {
    if (!renderer || !camera) return;
    const v = new THREE.Vector3();
    g.getWorldPosition(v); v.y += g.userData.burstY;
    v.project(camera);
    const r = renderer.domElement.getBoundingClientRect();
    const x = r.left + (v.x * 0.5 + 0.5) * r.width;
    const y = r.top + (-v.y * 0.5 + 0.5) * r.height;
    TW.fx.burst(x, y, { count: 9 });
  }

  function catCheer(now) {
    catPose = 'cheer';
    if (catSprite && catTex.cheer) catSprite.material.map = catTex.cheer;
    catPoseUntil = now + 950;
    catHopT0 = now;
  }

  function trigger(g, now) {
    g.userData.animT0 = now;
    g.userData.flash = 1;
    TW.sound.pop();
    TW.voice.say(g.userData.say);
    burstAt(g);
    catCheer(now);
    if (!found[g.userData.key]) {
      found[g.userData.key] = true;
      foundCount++;
      if (foundCount >= hitMeshes.length && !celebrated) {
        celebrated = true;
        setTimeout(function () { if (TW.current() === 'room3d') TW.celebrate('Well done!'); }, 800);
      }
    }
  }

  function attachPointer(canvas) {
    let down = null;
    canvas.addEventListener('pointerdown', function (e) {
      down = { x: e.clientX, y: e.clientY, ox: e.clientX, oy: e.clientY, t: performance.now(), moved: false };
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!down) return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (Math.abs(e.clientX - down.ox) + Math.abs(e.clientY - down.oy) > 9) down.moved = true;
      if (down.moved) {
        targetYaw = Math.max(-0.62, Math.min(0.62, targetYaw - dx * 0.0042));
        targetPitch = Math.max(-0.18, Math.min(0.38, targetPitch + dy * 0.0022));
        down.x = e.clientX; down.y = e.clientY;
      }
    });
    canvas.addEventListener('pointerup', function (e) {
      if (!down) return;
      const wasTap = !down.moved && (performance.now() - down.t) < 600;
      down = null;
      if (!wasTap || !renderer) return;
      const r = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      if (hits.length) trigger(hits[0].object.userData.objGroup, performance.now());
    });
    canvas.addEventListener('pointercancel', function () { down = null; });
  }

  // ---------- frame loop ----------
  function tick(now) {
    if (!running) return;
    rafId = requestAnimationFrame(tick);
    yaw += (targetYaw - yaw) * 0.08;
    pitch += (targetPitch - pitch) * 0.08;
    // Mostly turn-in-place (with a whisper of sway for parallax): a pure
    // orbit would swing the camera through the walls before a portrait
    // phone could ever see the room's far corners.
    camera.position.set(
      Math.sin(yaw) * 1.2,
      3.3 + pitch * 1.2,
      7.0 - (1 - Math.cos(yaw)) * 1.5
    );
    camera.lookAt(Math.sin(yaw) * 7.5, 1.25 - pitch * 2.2, -2);
    if (floater) floater.position.y = Math.sin(now * 0.0011) * 0.16;
    // Object bounce + glow flash.
    for (const key in groups) {
      const g = groups[key], u = g.userData;
      if (u.animT0) {
        const p = (now - u.animT0) / 460;
        if (p >= 1) { g.scale.set(1, 1, 1); u.animT0 = 0; }
        else {
          const s = Math.sin(p * Math.PI);
          g.scale.set(1 + 0.13 * s, 1 - 0.17 * s * (1 - p) + 0.08 * s * p, 1 + 0.13 * s);
        }
      }
      if (u.flash > 0.01) {
        u.flash *= 0.90;
        g.traverse(function (m) {
          if (m.isMesh && m.material && m.material.emissive) m.material.emissive.setRGB(0.55 * u.flash, 0.45 * u.flash, 0.15 * u.flash);
        });
      } else if (u.flash !== 0) {
        u.flash = 0;
        g.traverse(function (m) {
          if (m.isMesh && m.material && m.material.emissive) m.material.emissive.setRGB(0, 0, 0);
        });
      }
    }
    // The cat: cheer pose for a moment, with a little hop.
    if (catSprite) {
      if (catPose === 'cheer' && now > catPoseUntil) {
        catPose = 'wave';
        catSprite.material.map = catTex.wave;
      }
      if (catHopT0 > 0) {
        const p = (now - catHopT0) / 480;
        if (p >= 1) { catSprite.position.y = CAT_Y; catHopT0 = -1; }
        else catSprite.position.y = CAT_Y + Math.sin(p * Math.PI) * 0.38;
      }
    }
    renderer.render(scene, camera);
  }

  function fit() {
    if (!renderer || !wrap) return;
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 1 ? 74 : 58; // portrait phones see a wider room
    camera.updateProjectionMatrix();
  }

  // ---------- scene registration ----------
  TW.registerScene('room3d', {
    init: function () {
      section = document.getElementById('room3d');
      section.innerHTML =
        '<div class="room3d-wrap"></div>' +
        '<div class="room3d-fallback" style="display:none"><div class="room3d-card">The 3D room could not load.<br>Tap the back button and try again!</div></div>' +
        '<button class="rbtn back corner" data-back aria-label="Back to home">' + TW.art.icons.back + '</button>';
      wrap = section.querySelector('.room3d-wrap');
      fallbackEl = section.querySelector('.room3d-fallback');
      window.addEventListener('resize', function () { if (TW.current() === 'room3d') fit(); });
    },
    enter: function () {
      if (typeof window.THREE === 'undefined') { fallbackEl.style.display = 'flex'; return; }
      if (!built) {
        try {
          buildScene();
          renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          wrap.appendChild(renderer.domElement);
          attachPointer(renderer.domElement);
          built = true;
        } catch (e) {
          fallbackEl.style.display = 'flex';
          return;
        }
      }
      fallbackEl.style.display = 'none';
      fit();
      if (!running) { running = true; rafId = requestAnimationFrame(tick); }
      TW.voice.say("Let's play!");
    },
    leave: function () {
      running = false;
      cancelAnimationFrame(rafId);
    }
  });

  // Small handle for automated checks (not used by the app itself).
  TW.room3dDebug = {
    foundCount: function () { return foundCount; },
    isRunning: function () { return running; },
    hasRenderer: function () { return !!renderer; },
    pose: function () { return catPose; },
    yaw: function () { return yaw; },
    project: function (key) {
      const g = groups[key];
      if (!g || !renderer || !camera) return null;
      const v = new THREE.Vector3();
      g.getWorldPosition(v); v.y += g.userData.burstY;
      v.project(camera);
      const r = renderer.domElement.getBoundingClientRect();
      return { x: r.left + (v.x * 0.5 + 0.5) * r.width, y: r.top + (-v.y * 0.5 + 0.5) * r.height };
    }
  };
})();
