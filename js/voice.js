// Friendly spoken words: real Somali voice clips first (TW.voicePack, see js/voice-pack.js),
// with the browser's built-in speech as fallback for anything not in the pack.
window.TW = window.TW || {};
TW.voice = (function () {
  const ok = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  const PRAISE = ['Well done!', 'Yay!', 'Wow!', 'Great job!', 'Hooray!'];
  const PREFER = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira'];
  let voice = null, unlocked = false, praiseI = 0, said = 0;
  let clipAudio = null;

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

  function stopClip() {
    if (!clipAudio) return;
    try { clipAudio.pause(); clipAudio.currentTime = 0; } catch (e) {}
    clipAudio.onended = clipAudio.onerror = null;
  }

  function playClip(src) {
    if (!clipAudio) clipAudio = new Audio();
    stopClip();
    clipAudio.src = src;
    clipAudio.onended = clipAudio.onerror = function () { TW.sound.duck(false); };
    TW.sound.duck(true);
    try {
      const pr = clipAudio.play();
      if (pr && pr.catch) pr.catch(function () { TW.sound.duck(false); });
    } catch (e) { TW.sound.duck(false); }
  }

  function clipPlaying() {
    return !!(clipAudio && clipAudio.src && !clipAudio.paused && !clipAudio.ended);
  }

  function say(text, opt) {
    opt = opt || {};
    said++;
    if (TW.sound.isMuted()) return;
    const norm = (text == null ? '' : String(text)).trim().replace(/\s+/g, ' ');
    const pack = window.TW && TW.voicePack;
    if (pack && norm && Object.prototype.hasOwnProperty.call(pack, norm)) {
      // Somali clip route.
      if (opt.queue && clipPlaying()) {
        // Chain this clip right after the one that is playing.
        const src = pack[norm];
        clipAudio.onended = function () { playClip(src); };
        clipAudio.onerror = function () { TW.sound.duck(false); };
        return;
      }
      if (ok && !opt.queue) { try { speechSynthesis.cancel(); } catch (e) {} }
      playClip(pack[norm]);
      return;
    }
    if (!ok) return;
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
    get count() { return said; },
    say: say,
    praise: function (opt) { say(PRAISE[praiseI++ % PRAISE.length], opt); },
    cancel: function () {
      stopClip();
      if (ok) { try { speechSynthesis.cancel(); } catch (e) {} }
      TW.sound.duck(false);
    },
    // iOS only lets speech start inside a tap; a silent first word unlocks it.
    unlock: function () {
      if (unlocked) return;
      unlocked = true;
      if (ok) {
        try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
      }
      // Prime the clip player inside the same tap so later clips can play.
      try {
        const pack = window.TW && TW.voicePack;
        const first = pack && pack[Object.keys(pack)[0]];
        if (first) {
          if (!clipAudio) clipAudio = new Audio();
          clipAudio.src = first;
          clipAudio.volume = 0;
          const pr = clipAudio.play();
          if (pr && pr.then) pr.then(function () {
            try { clipAudio.pause(); clipAudio.currentTime = 0; clipAudio.volume = 1; } catch (e) {}
          });
        }
      } catch (e) {}
    }
  };
})();
