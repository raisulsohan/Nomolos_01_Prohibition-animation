(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-25', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { drag: 0.834, court: 1.868, settle: 2.736, street: 3.67, the: 4.471,
    twenties: 4.705, got: 5.606, bloody: 5.839 };
  const RED = '#ff4a3d', toHex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

  const GY = 760, CW = M45 ? 700 : 900, DOORW = 180, DOORH = 270;
  const redIn = t => smooth((t - K.settle) / 1.4);
  const shut = t => easeOut(clamp((t - K.court + .25) / .25));
  const BLOCKS = (() => {
    const out = [], g = rng(86);
    for (const [x0, x1] of [[-1000, 960 - CW / 2 - 20], [960 + CW / 2 + 20, 2900]]) {
      let x = x0; while (x < x1 - 60) { const w = Math.min(x1 - x, 170 + g() * 160), h = 330 + g() * 330; out.push({ x, w, h, col: g() < .5 ? '#1c1a44' : '#221e4a' }); x += w + 8; }
    }
    return out;
  })();
  const WINS = BLOCKS.flatMap((b, i) => { const g = rng(300 + i), cols = Math.max(1, Math.floor((b.w - 20) / 60)), rows = Math.floor((b.h - 60) / 90), out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push({ x: b.x + 10 + (c + .5) * (b.w - 20) / cols, y: GY - b.h + 50 + r * 90, lit: g() < .45 });
    return out; });
  const FLASH = (() => { const g = rng(87), out = []; for (let k = 0; k < 34; k++) out.push({ w: WINS[Math.floor(g() * WINS.length)], t: lerp(K.twenties - .15, DUR - .3, Math.pow(g(), .8)) }); return out; })();
  const flashAt = (f, t) => { const u = (t - f.t) / .14; return u > 0 && u < 1 ? 1 - u : 0; };

  function street(x, t) {
    x.fillStyle = '#0e0c28'; x.fillRect(-1600, -1200, 5200, GY + 1200);
    for (const b of BLOCKS) { x.fillStyle = b.col; x.fillRect(b.x, GY - b.h, b.w, b.h); x.fillStyle = '#2e2a6e'; x.fillRect(b.x - 4, GY - b.h - 10, b.w + 8, 10); }
    for (const w of WINS) { x.fillStyle = w.lit ? 'rgba(255,207,128,.55)' : '#0c0a24'; x.fillRect(w.x - 15, w.y - 22, 30, 44); }
    for (const f of FLASH) { const a = flashAt(f, t); if (a > 0) { x.fillStyle = `rgba(255,248,220,${a})`; x.fillRect(f.w.x - 15, f.w.y - 22, 30, 44); } }
    x.fillStyle = '#141232'; x.fillRect(-1600, GY, 5200, 900); x.fillStyle = '#2a2656'; x.fillRect(-1600, GY, 5200, 26);
    for (const lx of [260, 1660]) { x.fillStyle = '#0a0a18'; x.fillRect(lx - 5, GY - 330, 10, 330); x.fillRect(lx - 30, GY - 334, 60, 8); x.fillStyle = '#ffe3b0'; x.beginPath(); x.arc(lx, GY - 318, 10, 0, TAU); x.fill(); }
  }
  function courthouse(x, t) {
    const L0 = 960 - CW / 2, top = GY - 560;
    x.fillStyle = '#1c1a44'; x.fillRect(L0, top, CW, 560);
    x.fillStyle = '#2e2a6e'; polyPath(x, [[L0 - 20, top], [960, top - 110], [L0 + CW + 20, top]]); x.fill(); x.fillRect(L0 - 20, top, CW + 40, 22);
    x.fillStyle = '#ffe3b0'; x.font = '900 40px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('COURT HOUSE', 960, top + 62);
    x.fillStyle = '#3a3670'; const n = M45 ? 6 : 8; for (let k = 0; k < n; k++) { const cx = L0 + 40 + k * (CW - 80) / (n - 1); if (Math.abs(cx - 960) > DOORW / 2 + 20) x.fillRect(cx - 14, top + 100, 28, 460); }
    for (let k = 0; k < 4; k++) { x.fillStyle = k % 2 ? '#2e2a6e' : '#262260'; x.fillRect(L0 - 30 - k * 14, GY - 12 * (4 - k), CW + 60 + k * 28, 12); }
    const s = shut(t), dx = 960 - DOORW / 2, dy = GY - 48 - DOORH;
    x.fillStyle = FILM.rgba(FILM.hex('#ffcf80'), .9 * (1 - s)); x.fillRect(dx, dy, DOORW, DOORH); x.fillStyle = `rgba(12,10,36,${s})`; x.fillRect(dx, dy, DOORW, DOORH);
    const lw = DOORW / 2 * lerp(.12, 1, s);
    x.fillStyle = '#3e2c3c'; x.fillRect(dx, dy, lw, DOORH); x.fillRect(dx + DOORW - lw, dy, lw, DOORH);
    if (s > .9) { x.fillStyle = '#c8a050'; x.fillRect(958 - 10, dy + DOORH / 2, 6, 18); x.fillRect(962 + 4, dy + DOORH / 2, 6, 18); }
  }
  const G = M45 ? 110 : 150, SPX = M45 ? 75 : 95;
  const CREWS = [0, 1, 2, 3].flatMap(k => [{ side: -1, k, x: 960 - G - k * SPX, hat: 'wide' }, { side: 1, k, x: 960 + G + k * SPX, hat: 'cap' }]);
  function crews(x, t, tp) {
    const step = easeIO(clamp((tp - K.settle - .05 * 0) / .5));
    for (const c of CREWS) {
      const px = c.x - c.side * 34 * step * (1 - c.k * .15), reach = c.k === 0 ? .25 * step : 0;
      x.save(); x.translate(px, GY + 6); x.scale(-c.side * 2.5, 2.5);
      PR.person(x, B, { kind: 'man', hat: c.hat, hatColor: '#06060f', coat: c.side < 0 ? '#2c2834' : '#34302a', dark: .88, arm: reach });
      x.restore();
    }
  }
  const SHARDS = (() => { const g = rng(88), out = []; for (let k = 0; k < 44; k++) out.push({ x: lerp(-700, 2600, g()), y: GY + 40 + g() * 200, t: lerp(K.twenties, DUR - .2, g()), s: 18 + g() * 44, r: g() * TAU, v: 160 + g() * 160, spin: (g() - .5) * 3, n: 3 + Math.floor(g() * 3) }); return out; })();
  function shards(x, t) {
    for (const s of SHARDS) {
      const u = t - s.t; if (u <= 0) continue;
      const a = Math.min(1, u / .2) * .85; x.save(); x.translate(s.x + 30 * Math.sin(u * 1.3 + s.r), s.y - s.v * u); x.rotate(s.r + s.spin * u);
      x.fillStyle = FILM.rgba(FILM.hex(RED), a); x.beginPath(); for (let k = 0; k < s.n; k++) { const q = k / s.n * TAU, rr = s.s * (k % 2 ? .55 : 1); x.lineTo(rr * Math.cos(q), rr * Math.sin(q)); } x.fill(); x.restore();
    }
  }

  const KEYS = M45
    ? [[0, [960, 520, 1.2]], [K.court + .2, [960, 530, 1.3]], [K.street + .3, [960, 560, 1.42]], [K.the, [960, 560, 1.43]], [K.got + .1, [960, 420, .62]], [DUR, [960, 410, .6]]]
    : [[0, [960, 470, 1.0]], [K.court + .2, [960, 480, 1.08]], [K.street + .3, [960, 520, 1.18]], [K.the, [960, 520, 1.19]], [K.got + .1, [960, 380, .55]], [DUR, [960, 370, .53]]];
  const LK = KEYS.map(([t, v]) => [t, [v[0], v[1], Math.log(v[2])]]);
  function camera(t) { const v = keyed(t, LK); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function counter(ctx, t) {
    const a = smooth((t - K.twenties + .3) / .25); if (a <= 0) return;
    const yr = 1920 + Math.min(9, Math.floor(clamp((t - K.twenties + .1) / (K.bloody + .45 - K.twenties + .1)) * 10));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 120 : 130}px NSC`;
    ctx.shadowColor = FILM.rgba(FILM.hex(RED), .6 * redIn(t)); ctx.shadowBlur = 30; ctx.fillStyle = '#ffe3b0'; ctx.fillText(String(yr), W / 2, M45 ? 190 : 150); ctx.restore();
  }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t), r = redIn(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { street(x, t); courthouse(x, t); crews(x, t, tp); shards(x, t); }, { glow: .35, glowBlur: 12 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    const s = shut(t); if (s < 1) PR.glow(ctx, 960, GY - 60, 520, '#ffcf80', .5 * (1 - s), 'lightbox');
    for (const lx of [260, 1660]) PR.glow(ctx, lx, GY - 318, 200, toHex(FILM.mixc(FILM.hex('#ffcf80'), FILM.hex(RED), r)), .45, 'lightbox');
    if (r > 0) PR.glow(ctx, 960, GY + 20, 520, RED, .35 * r, 'lightbox');
    for (const f of FLASH) { const a = flashAt(f, t); if (a > 0) PR.glow(ctx, f.w.x, f.w.y, 110, '#fff2c8', .9 * a, 'lightbox'); }
    for (const sh of SHARDS) if (t > sh.t) PR.glow(ctx, sh.x + 30 * Math.sin((t - sh.t) * 1.3 + sh.r), sh.y - sh.v * (t - sh.t), sh.s * 2.2, RED, .25 * Math.min(1, (t - sh.t) / .2), 'lightbox');
    const wash = smooth((t - K.bloody + .3) / .6);
    if (wash > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = FILM.rgba(FILM.mixc([255, 255, 255], FILM.hex('#ff8a78'), .85 * wash)); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    counter(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.court, K.settle, K.twenties, K.bloody],
  });
})();
