// Friendly spoken words using the browser's built-in speech. Silent if the device has none.
window.TW = window.TW || {};
TW.voice = (function () {
  const ok = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  const PRAISE = ['Well done!', 'Yay!', 'Wow!', 'Great job!', 'Hooray!'];
  const PREFER = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira'];
  let voice = null, unlocked = false, praiseI = 0;

  function pick() {
    let all = [];
    try { all = speechSynthesis.getVoices() || []; } catch (e) { return; }
    const en = all.filter(v => /^en/i.test(v.lang));
    voice = PREFER.map(n => en.find(v => v.name.indexOf(n) >= 0)).find(Boolean) ||
      en.find(v => /en[-_]US/i.test(v.lang) && v.localService) || en.find(v => v.localService) || en[0] || null;
  }
  if (ok) {
    pick();
    try { speechSynthesis.addEventListener('voiceschanged', pick); } catch (e) { speechSynthesis.onvoiceschanged = pick; }
  }

  function say(text, opt) {
    opt = opt || {};
    if (!ok || TW.sound.isMuted()) return;
    try {
      if (!opt.queue) speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-US';
      u.pitch = 1.35;
      u.rate = 1.0;
      u.volume = 1;
      u.onstart = function () { TW.sound.duck(true); };
      u.onend = u.onerror = function () { TW.sound.duck(false); };
      speechSynthesis.speak(u);
    } catch (e) { /* no voice: stay silent */ }
  }

  return {
    say: say,
    praise: function (opt) { say(PRAISE[praiseI++ % PRAISE.length], opt); },
    cancel: function () {
      if (ok) { try { speechSynthesis.cancel(); } catch (e) {} }
      TW.sound.duck(false);
    },
    // iOS only lets speech start inside a tap; a silent first word unlocks it.
    unlock: function () {
      if (!ok || unlocked) return;
      unlocked = true;
      try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
    }
  };
})();
