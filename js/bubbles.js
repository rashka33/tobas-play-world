// New scene: Bubble Pop — big gentle bubbles float up with pictures and
// numbers inside. Pop one and it sparkles and says its name; a star counter
// counts every pop, with praise at five and a party at ten. No timer, no end.
(function () {
  const A = TW.art, O = A.O;
  const st = `stroke="${O}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;

  const PICS = [
    { say: 'Star!', svg: () => A.starSvg('#FFD93D') },
    { say: 'Heart!', svg: () => A.heartSvg('#FF5A8A') },
    { say: 'Flower!', svg: () => `<svg ${A.NS} viewBox="0 0 100 100"><g ${st}><circle cx="50" cy="26" r="15" fill="#FF8CC8"/><circle cx="71" cy="41" r="15" fill="#FF8CC8"/><circle cx="65" cy="66" r="15" fill="#FF8CC8"/><circle cx="35" cy="66" r="15" fill="#FF8CC8"/><circle cx="29" cy="41" r="15" fill="#FF8CC8"/></g><circle cx="50" cy="46" r="11" fill="#FFD93D" ${st}/></svg>` },
    { say: 'Balloon!', svg: () => `<svg ${A.NS} viewBox="0 0 100 100"><ellipse cx="50" cy="36" rx="27" ry="31" fill="#FF6B6B" ${st}/><ellipse cx="40" cy="24" rx="8" ry="12" fill="#fff" opacity=".55"/><path d="M45 67 L55 67 L50 76 Z" fill="#FF6B6B" ${st}/><path d="M50 76 Q42 84 50 92" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/></svg>` },
    { say: 'Butterfly!', svg: () => `<svg ${A.NS} viewBox="0 0 100 100"><g ${st}><ellipse cx="28" cy="36" rx="17" ry="13" fill="#B57CFF" transform="rotate(-24 28 36)"/><ellipse cx="72" cy="36" rx="17" ry="13" fill="#B57CFF" transform="rotate(24 72 36)"/><ellipse cx="30" cy="62" rx="13" ry="10" fill="#D9B8FF" transform="rotate(20 30 62)"/><ellipse cx="70" cy="62" rx="13" ry="10" fill="#D9B8FF" transform="rotate(-20 70 62)"/></g><ellipse cx="50" cy="50" rx="6" ry="20" fill="${O}"/><path d="M46 32 Q40 20 32 18 M54 32 Q60 20 68 18" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/></svg>` },
    { say: 'Apple!', svg: () => `<svg ${A.NS} viewBox="0 0 100 100"><path d="M50 30 Q78 12 84 44 Q88 74 50 88 Q12 74 16 44 Q22 12 50 30 Z" fill="#FF4D4D" ${st}/><path d="M50 28 Q52 14 62 8" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round"/><ellipse cx="66" cy="16" rx="11" ry="6" fill="#4CC96B" ${st}/><ellipse cx="32" cy="46" rx="7" ry="12" fill="#fff" opacity=".5"/></svg>` },
    { say: 'Ball!', svg: () => `<svg ${A.NS} viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#fff" ${st}/><path d="M50 8 Q72 50 50 92" fill="#FF5A6E" ${st}/><path d="M50 8 Q28 50 50 92" fill="#3FA7FF" ${st}/><path d="M9 50 H91" stroke="${O}" stroke-width="4"/></svg>` },
    { say: 'Sunshine!', svg: () => `<svg ${A.NS} viewBox="0 0 100 100"><g stroke="#FF9F1C" stroke-width="6" stroke-linecap="round"><path d="M50 4 V16 M50 84 V96 M4 50 H16 M84 50 H96 M18 18 L26 26 M74 74 L82 82 M82 18 L74 26 M26 74 L18 82"/></g><circle cx="50" cy="50" r="24" fill="#FFD93D" ${st}/><circle cx="42" cy="46" r="3" fill="${O}"/><circle cx="58" cy="46" r="3" fill="${O}"/><path d="M42 56 Q50 63 58 56" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/></svg>` }
  ];

  let stage = null, badge = null, pupEl = null, timer = null, count = 0, deck = [];

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function nextItem() {
    if (!deck.length) {
      deck = shuffle(PICS.map(p => ({ pic: p })).concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({ num: n }))));
    }
    return deck.pop();
  }
  function alive() { return stage ? stage.querySelectorAll('.pop-bubble').length : 0; }

  function spawn() {
    if (!stage || alive() >= 6) return;
    const item = nextItem();
    const size = 92 + Math.round(Math.random() * 38);
    const b = document.createElement('button');
    b.className = 'pop-bubble';
    b.setAttribute('aria-label', item.pic ? item.pic.say.replace('!', '') : 'Number ' + item.num);
    b.style.left = (3 + Math.random() * 82) + '%';
    b.style.width = b.style.height = size + 'px';
    b.style.setProperty('--dur', (10 + Math.random() * 4).toFixed(1) + 's');
    b.innerHTML = '<span class="pb-sway" style="animation-delay:-' + (Math.random() * 2).toFixed(1) + 's"><span class="pb-in">' +
      (item.pic ? item.pic.svg() : '<span class="pb-num">' + item.num + '</span>') + '</span></span>';
    b.addEventListener('animationend', function (e) { if (e.animationName === 'rise') b.remove(); });
    b.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      if (!b.isConnected || b.classList.contains('popped')) return;
      pop(b, item);
    });
    stage.appendChild(b);
  }

  function pop(b, item) {
    const c = TW.fx.center(b);
    b.classList.add('popped');
    setTimeout(function () { b.remove(); }, 130);
    count++;
    badge.textContent = count;
    TW.fx.bounce(badge.parentElement, 'bounce');
    TW.sound.pop();
    TW.fx.burst(c.x, c.y, { count: 9 });
    if (pupEl) TW.fx.bounce(pupEl, 'sqhop');
    if (count % 10 === 0) { TW.celebrate('Bubbles!'); return; }
    if (item.pic) TW.voice.say(item.pic.say);
    else {
      TW.sound.chime();
      // She popped the very number the counter just reached — a quiet match!
      if (item.num === count) TW.fx.hearts(c.x, c.y - 24, 4);
    }
    if (count % 5 === 0) TW.voice.praise({ queue: true });
    setTimeout(spawn, 350);
  }

  function init() {
    const el = document.getElementById('bubbles');
    el.innerHTML =
      '<button class="rbtn back corner" data-back aria-label="Back to home">' + A.icons.back + '</button>' +
      '<div class="bub-top"><div class="bub-count"><span class="bc-star">' + A.starSvg('#FFD93D') + '</span><span class="bub-num">0</span></div></div>' +
      '<div class="bub-stage"></div>' +
      '<div class="bub-pup">' + A.pup('sister') + '</div>';
    stage = el.querySelector('.bub-stage');
    badge = el.querySelector('.bub-num');
    pupEl = el.querySelector('.bub-pup');
  }

  function enter() {
    count = 0;
    if (badge) badge.textContent = '0';
    deck = [];
    for (let i = 0; i < 3; i++) setTimeout(spawn, 250 * i);
    if (timer) clearInterval(timer);
    timer = setInterval(spawn, 1900);
  }

  function leave() {
    if (timer) { clearInterval(timer); timer = null; }
    if (stage) stage.innerHTML = '';
  }

  A.hubArt.bubbles = `<svg ${A.NS} viewBox="0 0 120 120"><circle cx="42" cy="66" r="30" fill="rgba(160,220,255,.35)" stroke="#fff" stroke-width="4"/><circle cx="80" cy="44" r="22" fill="rgba(160,220,255,.35)" stroke="#fff" stroke-width="4"/><circle cx="72" cy="84" r="15" fill="rgba(160,220,255,.35)" stroke="#fff" stroke-width="3.5"/><path d="${A.starPath(42, 66, 13, 5.5)}" fill="#FFD93D" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="32" cy="54" rx="7" ry="4.5" fill="#fff" opacity=".8" transform="rotate(-30 32 54)"/><ellipse cx="72" cy="34" rx="5" ry="3.4" fill="#fff" opacity=".8" transform="rotate(-30 72 34)"/></svg>`;

  TW.registerScene('bubbles', { init: init, enter: enter, leave: leave });
})();
