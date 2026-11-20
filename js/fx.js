// Sparkle bursts, floating hearts and bounce helpers.
window.TW = window.TW || {};
(function () {
  const COLORS = ['#FFD93D', '#FF7AC6', '#3FA7FF', '#4CC96B', '#FF9F1C', '#A86BFF'];

  function spawn(cls, html, x, y) {
    const d = document.createElement('div');
    d.className = 'spark ' + cls;
    d.innerHTML = html;
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    document.body.appendChild(d);
    return d;
  }

  TW.fx = {
    burst: function (x, y, opt) {
      opt = opt || {};
      const n = opt.count || 10, cols = opt.colors || COLORS;
      for (let i = 0; i < n; i++) {
        const d = spawn('star', TW.art.starSvg(cols[i % cols.length]), x, y);
        if (!d.animate) { d.remove(); continue; }
        const ang = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 90;
        const a = d.animate([
          { transform: 'translate(0,0) scale(.2)', opacity: 1 },
          { transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist}px) scale(1) rotate(${Math.random() * 200}deg)`, opacity: 0 }
        ], { duration: 650 + Math.random() * 450, easing: 'cubic-bezier(.2,.8,.3,1)' });
        a.onfinish = function () { d.remove(); };
      }
    },
    hearts: function (x, y, n) {
      n = n || 6;
      const cols = ['#FF5A8A', '#FF7AC6', '#FF3D6E'];
      for (let i = 0; i < n; i++) {
        const d = spawn('heart', TW.art.heartSvg(cols[i % 3]), x + (Math.random() - 0.5) * 70, y);
        if (!d.animate) { d.remove(); continue; }
        const dx = (Math.random() - 0.5) * 140, dy = -(130 + Math.random() * 130);
        const a = d.animate([
          { transform: 'translate(0,0) scale(.3)', opacity: 0 },
          { transform: `translate(${dx * 0.3}px,${dy * 0.3}px) scale(1)`, opacity: 1, offset: 0.3 },
          { transform: `translate(${dx}px,${dy}px) scale(1.1)`, opacity: 0 }
        ], { duration: 1300 + Math.random() * 500, delay: i * 90, easing: 'ease-out', fill: 'backwards' });
        a.onfinish = function () { d.remove(); };
      }
    },
    // Soap/potion bubbles that float up and pop softly.
    bubbles: function (x, y, n, tint) {
      n = n || 7;
      for (let i = 0; i < n; i++) {
        const d = spawn('bubble', '', x + (Math.random() - 0.5) * 50, y);
        const size = 26 + Math.random() * 34;
        d.style.width = d.style.height = size + 'px';
        d.style.margin = (-size / 2) + 'px 0 0 ' + (-size / 2) + 'px';
        if (tint) d.style.setProperty('--tint', tint);
        if (!d.animate) { d.remove(); continue; }
        const dx = (Math.random() - 0.5) * 140, dy = -(160 + Math.random() * 200);
        const a = d.animate([
          { transform: 'translate(0,0) scale(.3)', opacity: 0 },
          { transform: `translate(${dx * 0.4}px,${dy * 0.4}px) scale(1)`, opacity: 1, offset: 0.25 },
          { transform: `translate(${dx}px,${dy}px) scale(1)`, opacity: 1, offset: 0.92 },
          { transform: `translate(${dx}px,${dy}px) scale(1.5)`, opacity: 0 }
        ], { duration: 1500 + Math.random() * 900, delay: i * 120, easing: 'ease-out', fill: 'backwards' });
        a.onfinish = function () { d.remove(); TW.sound.softPop(); };
      }
    },
    // Flower petals twirling out in a swirl.
    petals: function (x, y, n) {
      n = n || 16;
      const cols = ['#FF8CC8', '#FFD6EA', '#FFFFFF', '#FFC24B', '#C9A8FF'];
      for (let i = 0; i < n; i++) {
        const c = cols[i % cols.length];
        const d = spawn('petal', `<svg viewBox="0 0 20 30"><ellipse cx="10" cy="15" rx="8" ry="13" fill="${c}" stroke="#C2588F" stroke-width="1.5"/></svg>`, x, y);
        if (!d.animate) { d.remove(); continue; }
        const dir = Math.random() < 0.5 ? -1 : 1, start = Math.random() * Math.PI * 2, frames = [];
        for (let k = 0; k <= 8; k++) {
          const t = k / 8, ang = start + dir * t * Math.PI * 3, rad = 20 + t * (140 + Math.random() * 60);
          frames.push({ transform: `translate(${Math.cos(ang) * rad + t * 60}px,${Math.sin(ang) * rad - t * 160}px) rotate(${t * 540}deg)`, opacity: k === 8 ? 0 : 1 });
        }
        const a = d.animate(frames, { duration: 1800 + Math.random() * 600, delay: i * 40, easing: 'ease-out', fill: 'backwards' });
        a.onfinish = function () { d.remove(); };
      }
    },
    // Restart a one-shot CSS animation class.
    bounce: function (el, cls) {
      cls = cls || 'bounce';
      el.classList.remove(cls);
      el.getBoundingClientRect(); // force a restyle so the animation restarts (works for SVG too)
      el.classList.add(cls);
      el.addEventListener('animationend', function done(e) {
        if (e.target !== el) return;
        el.classList.remove(cls);
        el.removeEventListener('animationend', done);
      });
    },
    center: function (el) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
  };
})();
