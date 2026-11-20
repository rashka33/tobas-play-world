// Original flat-vector art: the puppy family, icons, hub pictures, kitchen pieces.
window.TW = window.TW || {};
(function () {
  const O = '#4a2e1c';
  const NS = 'xmlns="http://www.w3.org/2000/svg"';

  // ---------- Puppy family ----------
  const BOW = `<g transform="translate(64 40) rotate(-20)"><path d="M0 0 L-20 -13 L-20 13 Z M0 0 L20 -13 L20 13 Z" fill="#FF6FA8" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle r="6" fill="#FF3D8B" stroke="${O}" stroke-width="3"/></g>`;
  const TUFT = `<path d="M92 36 Q94 18 102 30 Q106 16 112 32" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/>`;
  let FLOWER = '';
  [0, 72, 144, 216, 288].forEach(function (a) {
    const r = a * Math.PI / 180;
    FLOWER += `<circle cx="${(Math.cos(r) * 9).toFixed(1)}" cy="${(Math.sin(r) * 9).toFixed(1)}" r="8" fill="#FFD23F" stroke="${O}" stroke-width="2.5"/>`;
  });
  FLOWER = `<g transform="translate(142 38)">${FLOWER}<circle r="6" fill="#FF8A3D" stroke="${O}" stroke-width="2.5"/></g>`;
  const LASHES = `<path d="M70 80 L63 74 M73 77 L68 70 M130 80 L137 74 M127 77 L132 70" stroke="${O}" stroke-width="3" stroke-linecap="round"/>`;
  const BROWS = `<path d="M66 70 L88 65 M112 65 L134 70" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`;
  const BOWTIE = `<g stroke="${O}" stroke-width="3" stroke-linejoin="round"><path d="M100 152 L80 140 L80 164 Z M100 152 L120 140 L120 164 Z" fill="#3E8EDE"/><circle cx="100" cy="152" r="6" fill="#2C6DB5"/></g>`;

  const FAMILY = {
    sister: { body: '#F4A259', ear: '#D2691E', belly: '#FFE6C7', extra: BOW },
    baby:   { body: '#F8DDB0', ear: '#E6A866', belly: '#FFF6E6', small: true, extra: TUFT },
    mum:    { body: '#D99566', ear: '#A0603A', belly: '#FCDDBB', extra: LASHES + FLOWER },
    dad:    { body: '#B07A50', ear: '#7A4A2C', belly: '#F2D2AC', extra: BROWS + BOWTIE }
  };

  function puppy(o) {
    const c = Object.assign({ body: '#F4A259', ear: '#D2691E', belly: '#FFE6C7', small: false, extra: '', vb: '0 0 200 240', size: true,
      back: '', outfit: '', cheek: '#FF8FA3', cheekOp: 0.55, ov: false }, o);
    const br = c.small ? 46 : 56, by = c.small ? 180 : 172, hr = c.small ? 56 : 58;
    const parts = c.vb.split(' ');
    const wh = c.size ? ` width="${parts[2]}" height="${parts[3]}"` : '';
    const tx = 100 + br;
    return `<svg ${NS} viewBox="${c.vb}"${wh}${c.ov ? ' overflow="visible"' : ''}>
${c.back}
<g stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
<path d="M${tx - 10} ${by + 8} Q${tx + 36} ${by - 6} ${tx + 30} ${by - 50} Q${tx + 20} ${by - 54} ${tx + 16} ${by - 44} Q${tx + 18} ${by - 14} ${tx - 14} ${by - 6} Z" fill="${c.ear}"/>
<circle cx="100" cy="${by}" r="${br}" fill="${c.body}"/>
<ellipse cx="100" cy="${by + 10}" rx="${br * 0.58}" ry="${br * 0.66}" fill="${c.belly}"/>
<ellipse cx="${100 - br * 0.52}" cy="${by + br - 4}" rx="20" ry="11" fill="${c.body}"/>
<ellipse cx="${100 + br * 0.52}" cy="${by + br - 4}" rx="20" ry="11" fill="${c.body}"/>
${c.outfit}
<circle cx="100" cy="88" r="${hr}" fill="${c.body}"/>
<ellipse cx="46" cy="94" rx="20" ry="40" fill="${c.ear}" transform="rotate(18 46 94)"/>
<ellipse cx="154" cy="94" rx="20" ry="40" fill="${c.ear}" transform="rotate(-18 154 94)"/>
<ellipse cx="100" cy="112" rx="30" ry="22" fill="${c.belly}"/>
</g>
<circle cx="78" cy="84" r="8" fill="${O}"/><circle cx="81" cy="81" r="3" fill="#fff"/>
<circle cx="122" cy="84" r="8" fill="${O}"/><circle cx="125" cy="81" r="3" fill="#fff"/>
<ellipse cx="100" cy="102" rx="11" ry="8" fill="${O}"/>
<path d="M89 114 Q100 124 111 114" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="66" cy="108" r="8" fill="${c.cheek}" opacity="${c.cheekOp}"/><circle cx="134" cy="108" r="8" fill="${c.cheek}" opacity="${c.cheekOp}"/>
${c.extra}
</svg>`;
  }

  function pup(name, opts) { return puppy(Object.assign({}, FAMILY[name], opts || {})); }

  // Big-sister pup, standing, with empty layers for dress-up items.
  function sisterDress() {
    const c = FAMILY.sister;
    const s = `stroke="${O}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
    return `<svg ${NS} viewBox="0 -50 300 490" width="300" height="490">
<g data-layer="back"></g>
<g ${s}>
<path d="M200 330 Q252 320 246 262 Q234 256 228 268 Q230 300 196 306 Z" fill="${c.ear}"/>
<ellipse cx="122" cy="398" rx="30" ry="17" fill="${c.body}"/>
<ellipse cx="178" cy="398" rx="30" ry="17" fill="${c.body}"/>
<ellipse cx="150" cy="300" rx="72" ry="88" fill="${c.body}"/>
<ellipse cx="150" cy="316" rx="44" ry="58" fill="${c.belly}"/>
</g>
<g data-layer="shirt"></g>
<g ${s}>
<ellipse cx="80" cy="292" rx="18" ry="46" fill="${c.body}" transform="rotate(18 80 292)"/>
<ellipse cx="220" cy="292" rx="18" ry="46" fill="${c.body}" transform="rotate(-18 220 292)"/>
</g>
<g data-layer="waist"></g>
<g ${s}>
<circle cx="150" cy="140" r="80" fill="${c.body}"/>
<ellipse cx="74" cy="152" rx="26" ry="54" fill="${c.ear}" transform="rotate(16 74 152)"/>
<ellipse cx="226" cy="152" rx="26" ry="54" fill="${c.ear}" transform="rotate(-16 226 152)"/>
<ellipse cx="150" cy="172" rx="40" ry="30" fill="${c.belly}"/>
</g>
<circle cx="122" cy="134" r="10" fill="${O}"/><circle cx="126" cy="130" r="3.5" fill="#fff"/>
<circle cx="178" cy="134" r="10" fill="${O}"/><circle cx="182" cy="130" r="3.5" fill="#fff"/>
<ellipse cx="150" cy="158" rx="14" ry="10" fill="${O}"/>
<path d="M134 176 Q150 192 166 176" fill="none" stroke="${O}" stroke-width="4.5" stroke-linecap="round"/>
<circle cx="102" cy="172" r="11" fill="#FF8FA3" opacity=".55"/><circle cx="198" cy="172" r="11" fill="#FF8FA3" opacity=".55"/>
<g data-layer="bow"><g transform="translate(100 70) rotate(-20) scale(1.4)"><path d="M0 0 L-20 -13 L-20 13 Z M0 0 L20 -13 L20 13 Z" fill="#FF6FA8" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle r="6" fill="#FF3D8B" stroke="${O}" stroke-width="3"/></g></g>
<g data-layer="face"></g>
<g data-layer="top"></g>
</svg>`;
  }

  function heartSvg(color) {
    return `<svg ${NS} viewBox="0 0 100 100" width="100" height="100"><path d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 21 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88 Z" fill="${color}" stroke="${O}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="30" cy="30" rx="9" ry="6" fill="#fff" opacity=".5" transform="rotate(-30 30 30)"/></svg>`;
  }

  function starPath(cx, cy, R, r) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 ? r : R, a = -Math.PI / 2 + i * Math.PI / 5;
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rad).toFixed(1) + ' ' + (cy + Math.sin(a) * rad).toFixed(1) + ' ';
    }
    return d + 'Z';
  }

  function starSvg(color) {
    return `<svg ${NS} viewBox="0 0 100 100" width="100" height="100"><path d="${starPath(50, 52, 46, 20)}" fill="${color}" stroke="${O}" stroke-width="5" stroke-linejoin="round"/></svg>`;
  }

  function svgUrl(svg) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }

  // ---------- Icons (64x64) ----------
  const B = '#2F8FE8';
  const SPEAKER = `<path d="M10 24 H22 L36 12 V52 L22 40 H10 Z" fill="${B}" stroke="${B}" stroke-width="4" stroke-linejoin="round"/>`;
  const icons = {
    back: `<svg ${NS} viewBox="0 0 64 64"><path d="M34 12 L14 32 L34 52" fill="none" stroke="${B}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 32 H52" stroke="${B}" stroke-width="10" stroke-linecap="round"/></svg>`,
    soundOn: `<svg ${NS} viewBox="0 0 64 64">${SPEAKER}<path d="M44 22 Q52 32 44 42 M50 14 Q64 32 50 50" fill="none" stroke="${B}" stroke-width="5" stroke-linecap="round"/></svg>`,
    soundOff: `<svg ${NS} viewBox="0 0 64 64">${SPEAKER}<path d="M44 24 L58 40 M58 24 L44 40" stroke="#FF5A5A" stroke-width="6" stroke-linecap="round"/></svg>`,
    clear: `<svg ${NS} viewBox="0 0 64 64"><rect x="14" y="8" width="36" height="48" rx="6" fill="#fff" stroke="${O}" stroke-width="4"/><path d="${starPath(32, 32, 13, 5.5)}" fill="#FFC83D" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="50" cy="12" r="5" fill="#FF7AC6"/><circle cx="12" cy="52" r="4.5" fill="#3FA7FF"/><circle cx="54" cy="46" r="3.5" fill="#4CC96B"/></svg>`,
    eraser: `<svg ${NS} viewBox="0 0 64 64"><g transform="rotate(-35 32 32)"><rect x="8" y="21" width="48" height="22" rx="5" fill="#FF9EC4" stroke="${O}" stroke-width="4"/><rect x="8" y="21" width="17" height="22" rx="5" fill="#fff" stroke="${O}" stroke-width="4"/></g></svg>`,
    bucket: `<svg ${NS} viewBox="0 0 64 64"><path d="M12 22 L20 52 Q32 58 44 52 L52 22 Z" fill="#9AA7B8" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="32" cy="22" rx="20" ry="7" fill="currentColor" stroke="${O}" stroke-width="4"/><path d="M50 24 Q60 32 56 46" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></svg>`,
    crayon: `<svg ${NS} viewBox="0 0 64 64"><g transform="rotate(-40 32 32)"><path d="M6 24 H42 L58 32 L42 40 H6 Z" fill="currentColor" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><path d="M42 24 L58 32 L42 40 Z" fill="#F5D6A8" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><path d="M51 28.5 L58 32 L51 35.5 Z" fill="currentColor"/><rect x="14" y="26" width="6" height="12" fill="#fff" opacity=".55"/></g></svg>`,
    shuffle: `<svg ${NS} viewBox="0 0 64 64"><path d="M12 54 L40 26" stroke="${O}" stroke-width="10" stroke-linecap="round"/><path d="M12 54 L40 26" stroke="#A86BFF" stroke-width="5" stroke-linecap="round"/><path d="${starPath(46, 18, 14, 6)}" fill="#FFD93D" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="18" cy="18" r="4.5" fill="#FF7AC6"/><circle cx="54" cy="44" r="4.5" fill="#3FA7FF"/><circle cx="30" cy="8" r="3" fill="#4CC96B"/></svg>`,
    oven: `<svg ${NS} viewBox="0 0 64 64"><rect x="6" y="6" width="52" height="52" rx="9" fill="#fff" stroke="${O}" stroke-width="4"/><rect x="13" y="23" width="38" height="28" rx="6" fill="#FFB347" stroke="${O}" stroke-width="4"/><circle cx="18" cy="15" r="3.5" fill="${O}"/><circle cx="29" cy="15" r="3.5" fill="${O}"/><path d="M32 47 Q22 46 24 37 Q26 32 30 30 Q29 36 33 37 Q36 33 35 28 Q42 33 41 40 Q40 46 32 47 Z" fill="#FF5A3D" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
    serve: `<svg ${NS} viewBox="0 0 64 64"><path d="M8 16 Q30 4 52 16 L30 58 Z" fill="#FFD36E" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><path d="M8 16 Q30 4 52 16" fill="none" stroke="#C98436" stroke-width="7" stroke-linecap="round"/><circle cx="24" cy="25" r="5" fill="#D9442B"/><circle cx="37" cy="27" r="4.5" fill="#D9442B"/><circle cx="30" cy="40" r="4" fill="#D9442B"/><path d="M50 60 C42 54 38 50 38 45 C38 41 41 39 44 39 C47 39 49 41 50 43 C51 41 53 39 56 39 C59 39 62 41 62 45 C62 50 58 54 50 60 Z" fill="#FF5A8A" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
    newPizza: `<svg ${NS} viewBox="0 0 64 64"><circle cx="30" cy="34" r="24" fill="#F1C885" stroke="${O}" stroke-width="4"/><circle cx="30" cy="34" r="18" fill="#F7DDAA"/><path d="${starPath(50, 14, 12, 5)}" fill="#FFD93D" stroke="${O}" stroke-width="3" stroke-linejoin="round"/></svg>`
  };

  // ---------- Kitchen pieces ----------
  const TOPPING = {
    pepperoni: `<circle cx="20" cy="20" r="16" fill="#C8322B" stroke="#8E1F1A" stroke-width="2.5"/><circle cx="14" cy="15" r="2.5" fill="#8E1F1A"/><circle cx="25" cy="25" r="2.5" fill="#8E1F1A"/><circle cx="24" cy="13" r="2" fill="#8E1F1A"/><circle cx="13" cy="25" r="2" fill="#8E1F1A"/>`,
    mushroom: `<path d="M4 22 Q4 6 20 6 Q36 6 36 22 Z" fill="#E9D8C4" stroke="#7A5A3A" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 22 H26 L25 34 Q20 36 15 34 Z" fill="#F7EEE2" stroke="#7A5A3A" stroke-width="2.5" stroke-linejoin="round"/><circle cx="13" cy="14" r="2" fill="#C9B29A"/><circle cx="25" cy="12" r="2.4" fill="#C9B29A"/>`,
    olive: `<circle cx="20" cy="20" r="11" fill="none" stroke="#2A2A2A" stroke-width="8"/><path d="M13 14 Q16 11 20 11" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round"/>`,
    pepper: `<path d="M7 24 Q7 8 20 8 Q33 8 33 24" fill="none" stroke="#2F7D3A" stroke-width="9" stroke-linecap="round"/><path d="M7 24 Q7 8 20 8 Q33 8 33 24" fill="none" stroke="#4CC25E" stroke-width="5" stroke-linecap="round"/>`,
    tomato: `<circle cx="20" cy="20" r="16" fill="#FF5E4D" stroke="#C0392B" stroke-width="2.5"/><circle cx="20" cy="20" r="9" fill="#FF8A75"/><g fill="#FFE08A"><ellipse cx="15" cy="17" rx="2" ry="3"/><ellipse cx="25" cy="17" rx="2" ry="3"/><ellipse cx="20" cy="26" rx="3" ry="2"/></g>`,
    pineapple: `<path d="M6 31 L20 7 L34 31 Z" fill="#FFD93D" stroke="#C99A00" stroke-width="2.5" stroke-linejoin="round"/><path d="M13 25 L20 15 L27 25" fill="none" stroke="#E8B400" stroke-width="2"/>`,
    basil: `<path d="M6 32 Q6 8 34 8 Q34 32 6 32 Z" fill="#3DAA5C" stroke="#226B37" stroke-width="2.5" stroke-linejoin="round"/><path d="M8 30 Q20 21 30 11" fill="none" stroke="#226B37" stroke-width="2"/>`,
    cheese: `<rect x="4" y="15" width="32" height="10" rx="5" fill="#FFE066" stroke="#E0B000" stroke-width="2"/>`,
    cheeseBin: `<path d="M3 32 L37 32 L37 13 Z" fill="#FFE066" stroke="#D9A600" stroke-width="2.5" stroke-linejoin="round"/><path d="M3 32 L37 13 L37 9 L3 28 Z" fill="#FFF0A0" stroke="#D9A600" stroke-width="2.5" stroke-linejoin="round"/><circle cx="27" cy="25" r="3" fill="#F2C200"/><circle cx="18" cy="29" r="2" fill="#F2C200"/>`
  };
  function topping(kind, bin) {
    const body = (bin && kind === 'cheese') ? TOPPING.cheeseBin : TOPPING[kind];
    return `<svg ${NS} viewBox="0 0 40 40">${body}</svg>`;
  }

  let spots = '';
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2 + 0.3, r = 88 + (i % 3) * 2;
    spots += `<circle cx="${(100 + Math.cos(a) * r).toFixed(1)}" cy="${(100 + Math.sin(a) * r).toFixed(1)}" r="${3 + (i % 2) * 1.5}"/>`;
  }
  const pizzaSvg = `<svg ${NS} viewBox="0 0 200 200" class="pizza-svg"><circle class="crust" cx="100" cy="100" r="96"/><circle class="sauce" cx="100" cy="100" r="80"/><g class="spots">${spots}</g></svg>`;

  const ovenSvg = `<svg ${NS} viewBox="0 0 270 320" class="oven-svg">
<path fill-rule="evenodd" d="M24 0 H246 Q270 0 270 24 V296 Q270 320 246 320 H24 Q0 320 0 296 V24 Q0 0 24 0 Z M48 74 H222 Q248 74 248 100 V274 Q248 300 222 300 H48 Q22 300 22 274 V100 Q22 74 48 74 Z" fill="#F0E6DA" stroke="${O}" stroke-width="6"/>
<rect x="22" y="74" width="226" height="226" rx="26" fill="rgba(255,200,120,.12)" stroke="#9A8F84" stroke-width="8"/>
<rect x="18" y="70" width="234" height="234" rx="30" fill="none" stroke="${O}" stroke-width="3"/>
<rect x="44" y="46" width="182" height="14" rx="7" fill="#C9CED6" stroke="${O}" stroke-width="4"/>
<circle cx="36" cy="22" r="11" fill="#5A5A6A" stroke="${O}" stroke-width="4"/><circle cx="70" cy="22" r="11" fill="#5A5A6A" stroke="${O}" stroke-width="4"/>
<rect x="150" y="9" width="90" height="26" rx="8" fill="#333" stroke="${O}" stroke-width="4"/>
<circle cx="172" cy="22" r="5" fill="#FF8A3D"/><circle cx="195" cy="22" r="5" fill="#FF8A3D"/><circle cx="218" cy="22" r="5" fill="#FF8A3D"/>
</svg>`;

  // ---------- Hub pictures ----------
  const hubArt = {
    paint: `<svg ${NS} viewBox="0 0 120 120"><path d="M60 12 C28 12 10 34 10 58 C10 86 32 106 58 106 C70 106 72 96 66 88 C60 80 66 72 76 74 C96 78 110 70 110 52 C110 28 88 12 60 12 Z" fill="#FFF1D6" stroke="${O}" stroke-width="5"/><g stroke="${O}" stroke-width="4"><circle cx="34" cy="48" r="10" fill="#FF4D4D"/><circle cx="56" cy="32" r="10" fill="#FFD93D"/><circle cx="84" cy="40" r="10" fill="#4CC96B"/><circle cx="34" cy="76" r="10" fill="#3FA7FF"/></g><g transform="rotate(35 84 82)"><rect x="79" y="56" width="11" height="52" rx="4" fill="#B5733F" stroke="${O}" stroke-width="4"/><path d="M77 58 Q84 30 92 58 Z" fill="#A86BFF" stroke="${O}" stroke-width="4" stroke-linejoin="round"/></g></svg>`,
    coloring: `<svg ${NS} viewBox="0 0 120 120"><rect x="16" y="12" width="78" height="94" rx="8" fill="#fff" stroke="${O}" stroke-width="5"/><path d="M28 58 L55 34 L82 58 Z" fill="#FF6B6B" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><rect x="34" y="58" width="42" height="34" fill="#fff" stroke="${O}" stroke-width="4"/><rect x="49" y="70" width="13" height="22" fill="#3FA7FF" stroke="${O}" stroke-width="3"/><g transform="rotate(-50 92 82)"><path d="M66 74 H104 L116 82 L104 90 H66 Z" fill="#4CC96B" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><path d="M104 74 L116 82 L104 90 Z" fill="#F5D6A8" stroke="${O}" stroke-width="4" stroke-linejoin="round"/></g></svg>`,
    dressup: puppy(Object.assign({}, FAMILY.sister, {
      size: false, vb: '0 -36 200 276',
      extra: `<path d="M100 -22 L72 40 Q100 52 128 40 Z" fill="#7BD3F7" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><path d="M88 6 Q100 12 112 6" fill="none" stroke="#FF6FA8" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="-24" r="9" fill="#FFD93D" stroke="${O}" stroke-width="3"/><g fill="rgba(255,255,255,.3)" stroke="#FF3D8B" stroke-width="5"><circle cx="78" cy="84" r="16"/><circle cx="122" cy="84" r="16"/></g><path d="M94 82 Q100 77 106 82" fill="none" stroke="#FF3D8B" stroke-width="4"/>`
    })),
    kitchen: `<svg ${NS} viewBox="0 0 120 120"><circle cx="60" cy="62" r="50" fill="#F1C885" stroke="${O}" stroke-width="5"/><circle cx="60" cy="62" r="40" fill="#E0482E"/><g fill="#FFE066"><rect x="34" y="44" width="16" height="6" rx="3" transform="rotate(20 42 47)"/><rect x="66" y="80" width="16" height="6" rx="3" transform="rotate(-25 74 83)"/><rect x="70" y="40" width="14" height="6" rx="3"/></g><g fill="#C8322B" stroke="#8E1F1A" stroke-width="2"><circle cx="46" cy="66" r="9"/><circle cx="74" cy="58" r="9"/><circle cx="58" cy="84" r="8"/><circle cx="62" cy="40" r="7"/></g><g fill="none" stroke="#2A2A2A" stroke-width="4"><circle cx="82" cy="74" r="4.5"/><circle cx="40" cy="82" r="4.5"/></g><path d="M30 34 Q34 22 44 28" fill="none" stroke="#3DAA5C" stroke-width="6" stroke-linecap="round"/></svg>`,
    wizard: `<svg ${NS} viewBox="0 0 120 120"><path d="M70 6 Q56 40 24 86 Q60 102 96 86 Q80 48 70 6 Z" fill="#6A4BD8" stroke="${O}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="60" cy="88" rx="48" ry="13" fill="#4A30A8" stroke="${O}" stroke-width="5"/><path d="${starPath(58, 52, 10, 4)} ${starPath(74, 70, 7, 3)} ${starPath(46, 74, 6, 2.5)}" fill="#FFD93D"/><circle cx="70" cy="6" r="7" fill="#FFD93D" stroke="${O}" stroke-width="3"/><path d="${starPath(100, 30, 11, 4.5)}" fill="#FFF3B0" stroke="${O}" stroke-width="3" stroke-linejoin="round"/></svg>`,
    space: `<svg ${NS} viewBox="0 0 120 120"><path d="M46 92 Q60 118 74 92 Z" fill="#FFB347" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><path d="M36 66 L18 92 L40 88 Z M84 66 L102 92 L80 88 Z" fill="#8E5BD1" stroke="${O}" stroke-width="5" stroke-linejoin="round"/><path d="M60 8 Q90 34 86 90 H34 Q30 34 60 8 Z" fill="#FF9CD0" stroke="${O}" stroke-width="5" stroke-linejoin="round"/><circle cx="60" cy="50" r="15" fill="#7FD6FF" stroke="${O}" stroke-width="5"/><circle cx="55" cy="45" r="4" fill="#fff"/></svg>`,
    vanity: `<svg ${NS} viewBox="0 0 120 120"><path d="M34 26 L32 6 L46 16 L60 2 L74 16 L88 6 L86 26 Z" fill="#FFD23F" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="60" cy="58" rx="34" ry="36" fill="#F2C14E" stroke="${O}" stroke-width="5"/><ellipse cx="60" cy="58" rx="24" ry="26" fill="#D7F1FF" stroke="${O}" stroke-width="4"/><path d="M68 42 L78 56" stroke="#fff" stroke-width="5" stroke-linecap="round"/><rect x="14" y="92" width="92" height="16" rx="6" fill="#FFF0F6" stroke="${O}" stroke-width="5"/><circle cx="30" cy="86" r="7" fill="#FFFDF4" stroke="${O}" stroke-width="3"/><rect x="84" y="74" width="12" height="18" fill="#FF4F9A" stroke="${O}" stroke-width="3"/></svg>`,
    lab: `<svg ${NS} viewBox="0 0 120 120"><path d="M44 70 H76 L94 98 Q96 108 86 108 H34 Q24 108 26 98 Z" fill="#57E08A"/><path d="M48 10 H72 V46 L98 98 Q100 110 88 110 H32 Q20 110 22 98 L48 46 Z" fill="rgba(255,255,255,.35)" stroke="${O}" stroke-width="5" stroke-linejoin="round"/><rect x="42" y="6" width="36" height="10" rx="4" fill="#E6F2FA" stroke="${O}" stroke-width="4"/><g fill="#fff"><circle cx="50" cy="94" r="5"/><circle cx="66" cy="84" r="4"/><circle cx="74" cy="98" r="3.5"/></g><circle cx="88" cy="30" r="7" fill="#9FE8FF" stroke="${O}" stroke-width="3"/><circle cx="100" cy="14" r="5" fill="#9FE8FF" stroke="${O}" stroke-width="3"/></svg>`,
    dragon: `<svg ${NS} viewBox="0 0 120 120"><path d="M30 34 L26 8 L44 26 Z M90 34 L94 8 L76 26 Z" fill="#FFD23F" stroke="${O}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="60" cy="60" rx="46" ry="40" fill="#FF8CC8" stroke="${O}" stroke-width="5"/><ellipse cx="60" cy="80" rx="28" ry="18" fill="#FFB3DA" stroke="${O}" stroke-width="4"/><circle cx="52" cy="78" r="3" fill="${O}"/><circle cx="68" cy="78" r="3" fill="${O}"/><circle cx="42" cy="52" r="9" fill="${O}"/><circle cx="45" cy="49" r="3.5" fill="#fff"/><circle cx="78" cy="52" r="9" fill="${O}"/><circle cx="81" cy="49" r="3.5" fill="#fff"/><path d="M52 90 Q60 96 68 90" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/><circle cx="26" cy="68" r="7" fill="#FF6FA8" opacity=".5"/><circle cx="94" cy="68" r="7" fill="#FF6FA8" opacity=".5"/></svg>`
  };

  TW.art = { parts: { BOW: BOW, TUFT: TUFT, FLOWER: FLOWER, LASHES: LASHES, BROWS: BROWS, BOWTIE: BOWTIE }, O: O, NS: NS, FAMILY: FAMILY, puppy: puppy, pup: pup, sisterDress: sisterDress, heartSvg: heartSvg, starSvg: starSvg, starPath: starPath, svgUrl: svgUrl, icons: icons, topping: topping, pizzaSvg: pizzaSvg, ovenSvg: ovenSvg, hubArt: hubArt };
})();
