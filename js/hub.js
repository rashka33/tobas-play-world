// Home screen: title, clouds, big round scene buttons, the puppy family.
(function () {
  const A = TW.art;

  function init() {
    const hub = document.getElementById('hub');

    const title = "Toba's Play World";
    const cols = ['#FF5A7A', '#FF9F1C', '#F5C400', '#3DBE5E', '#2F8FE8', '#A86BFF'];
    let k = 0;
    document.getElementById('title').innerHTML = title.split(' ').map(function (word) {
      return '<span class="word">' + word.split('').map(function (ch) {
        const html = `<span class="ch" style="color:${cols[k % cols.length]};animation-delay:${(k * -0.17).toFixed(2)}s">${ch === "'" ? '&#39;' : ch}</span>`;
        k++;
        return html;
      }).join('') + '</span>';
    }).join(' ');

    const sky = document.getElementById('sky');
    for (let i = 0; i < 6; i++) {
      const c = document.createElement('div');
      c.className = 'cloud';
      const dur = 45 + Math.random() * 35;
      c.style.top = (6 + i * 10 + Math.random() * 6) + '%';
      c.style.setProperty('--s', (0.6 + Math.random() * 0.8).toFixed(2));
      c.style.animationDuration = dur + 's';
      c.style.animationDelay = (-Math.random() * dur) + 's';
      sky.appendChild(c);
    }

    hub.querySelectorAll('.hub-btn').forEach(function (b) {
      b.querySelector('.hub-art').innerHTML = A.hubArt[b.dataset.scene];
    });
    hub.querySelector('.hub-grid').addEventListener('click', function (e) {
      const b = e.target.closest('.hub-btn');
      if (!b) return;
      TW.sound.pop();
      const c = TW.fx.center(b);
      TW.fx.burst(c.x, c.y, { count: 12 });
      setTimeout(function () { TW.show(b.dataset.scene); }, 220);
    });

    const fam = document.getElementById('family');
    ['dad', 'mum', 'sister', 'baby'].forEach(function (n) {
      const d = document.createElement('div');
      d.className = 'fam-pup ' + n;
      d.innerHTML = A.pup(n);
      d.addEventListener('pointerdown', function () {
        TW.sound.boing();
        TW.fx.bounce(d);
        const r = d.getBoundingClientRect();
        TW.fx.hearts(r.left + r.width / 2, r.top + 10, 3);
      });
      fam.appendChild(d);
    });

    const mute = document.getElementById('muteBtn');
    function paintMute() {
      mute.innerHTML = TW.sound.isMuted() ? A.icons.soundOff : A.icons.soundOn;
      mute.classList.toggle('off', TW.sound.isMuted());
    }
    mute.addEventListener('click', function () {
      TW.sound.setMuted(!TW.sound.isMuted());
      paintMute();
      TW.sound.pop();
    });
    paintMute();
  }

  TW.registerScene('hub', { init: init });
})();
