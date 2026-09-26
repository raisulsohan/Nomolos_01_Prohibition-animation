(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng, hash } = FILM, PR = FILM.props;
  const ID = 'seq-18', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { counts: 0.534, york: 1.201, more: 2.202, speakeasies: 2.502, legal: 5.071, bars: 5.372,
    drinking: 6.439, stop: 7.207, moved: 8.441, behind: 8.742, locked: 9.209, door: 9.543, password: 10.01 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const TOWERS = (() => {
    const g = rng(64), out = []; let x = -300;
    while (x < 4300) { const w = 220 + g() * 260, h = 600 + g() * 1500 * (x > 1200 && x < 2900 ? 1.2 : .8), tiers = 1 + ((g() * 3) | 0); out.push({ x, w, h, tiers, spire: g() < .3 }); x += w + 20 + g() * 40; }
    return out;
  })();
  const BASEF = .7, insetAt = (T, y) => { if (y < -T.h || y > 0) return null; if (T.tiers === 1 || y > -T.h * BASEF) return 0; const k = Math.min(T.tiers - 1, Math.ceil((-y - T.h * BASEF) / (T.h * (1 - BASEF) / (T.tiers - 1)))); return k * T.w * .14; };
  const WINS = (() => {
    const g = rng(65), out = [];
    for (const T of TOWERS) for (let y = -T.h + 60; y < -80; y += 56) for (let x = T.x + 24; x < T.x + T.w - 30; x += 44) {
      const inset = insetAt(T, y); if (inset === null || x < T.x + inset || x > T.x + T.w - inset - 30) continue;
      out.push({ x, y, w: 20, h: 30, hid: g() < .12, t: K.speakeasies - .1 + g() * 1.6 });
    }
    return out;
  })();
  const BARS = [260, 980, 1630, 2560, 3420].map((x, i) => ({ x, t: K.counts + .3 + i * .12 }));
  const CELLARS = (() => { const g = rng(66), out = []; for (let x = -200; x < 4200; x += 110 + g() * 60) out.push({ x, t: K.speakeasies + .2 + g() * 1.4 }); return out; })();
  const WIN = { x: 1860, y: 50, w: 84, h: 52 };
  function skyline(x, tp) {
    for (const T of TOWERS) {
      x.fillStyle = '#191a44';
      const bh = T.tiers === 1 ? T.h : T.h * BASEF; x.fillRect(T.x, -bh, T.w, bh);
      for (let k = 1; k < T.tiers; k++) { const sec = T.h * (1 - BASEF) / (T.tiers - 1), inset = k * T.w * .14; x.fillRect(T.x + inset, -bh - k * sec, T.w - 2 * inset, sec + 2); }
      if (T.spire) { polyPath(x, [[T.x + T.w / 2 - 20, -T.h], [T.x + T.w / 2, -T.h - 160], [T.x + T.w / 2 + 20, -T.h]]); x.fill(); }
    }
    for (const w of WINS) { const on = w.hid ? smooth((tp - w.t) / .2) : 0; x.fillStyle = on > 0 ? FILM.rgba(FILM.hex('#ffcf80'), .25 + .75 * on) : '#0e0e2a'; x.fillRect(w.x, w.y, w.w, w.h); }
    x.fillStyle = '#0c0b22'; x.fillRect(-1000, 0, 6000, 1400); x.fillStyle = '#23224e'; x.fillRect(-1000, -6, 6000, 12);
    for (const c of CELLARS) { const on = smooth((tp - c.t) / .25); x.fillStyle = '#2e2a6e'; x.fillRect(c.x - 4, 36, 68, 46); x.fillStyle = on > 0 ? FILM.rgba(FILM.hex('#ffcf80'), .2 + .8 * on) : '#0e0e2a'; x.fillRect(c.x, 40, 60, 38); }
    for (const b of BARS) {
      const dark = smooth((tp - b.t) / .2);
      x.fillStyle = FILM.rgba(FILM.hex('#ffcf80'), .9 * (1 - dark)); x.fillRect(b.x, -110, 120, 90);
      x.fillStyle = '#0c0b22'; if (dark > 0) { x.globalAlpha = dark; x.fillRect(b.x, -110, 120, 90); x.fillStyle = '#5a4030'; x.save(); x.translate(b.x + 60, -65); for (const r of [.5, -.5]) { x.save(); x.rotate(r); x.fillRect(-70, -7, 140, 14); x.restore(); } x.restore(); x.globalAlpha = 1; }
      x.fillStyle = dark < .5 ? '#ffe3b0' : '#3a3860'; x.font = '900 30px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('BAR', b.x + 60, -134);
      const fl = Math.exp(-Math.pow((tp - K.legal - .15) / .25, 2)) + Math.exp(-Math.pow((tp - K.legal - .75) / .25, 2));
      if (fl > .02) { x.strokeStyle = FILM.rgba(FILM.hex('#ffb34d'), Math.min(1, fl)); x.lineWidth = 6; x.setLineDash([14, 10]); x.strokeRect(b.x - 10, -160, 140, 150); x.setLineDash([]); }
    }
    x.strokeStyle = '#2e2a6e'; x.lineWidth = 6; x.strokeRect(WIN.x - 4, WIN.y - 4, WIN.w + 8, WIN.h + 8);
  }
  function title(ctx, t) {
    const a = smooth((t - K.york) / .3) * (1 - smooth((t - K.drinking + .6) / .4)); if (a <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
    const cx = W / 2, cy = M45 ? 150 : 96, w = M45 ? 620 : 560, h = M45 ? 110 : 96;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 6, cy - h / 2 + 8, w, h, 8); ctx.fill();
    ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 8); ctx.fill();
    ctx.fillStyle = '#2c2824'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 68 : 62}px NSC`; ctx.fillText('NEW YORK', cx, cy + 2);
    ctx.restore();
  }

  const RS = WIN.w / 1920, RX = WIN.x, RY = WIN.y;
  const DOOR = { x: -900, y: 300, w: 330, h: 700 };
  function room(x, tp) {
    x.save(); x.beginPath(); x.rect(WIN.x, WIN.y, WIN.w, WIN.h); x.clip();
    x.translate(RX, RY); x.scale(RS, RS); roomInside(x, tp); x.restore();
  }
  function roomInside(x, tp) {
    x.fillStyle = '#4a2a2e'; x.fillRect(-1500, -700, 3600, 1780);
    x.strokeStyle = 'rgba(20,10,20,.35)'; x.lineWidth = 3; for (let y = -670; y < 1080; y += 42) { x.beginPath(); x.moveTo(-1500, y); x.lineTo(2100, y); x.stroke(); for (let bx = -1500 + ((y / 42) % 2) * 45; bx < 2100; bx += 90) { x.beginPath(); x.moveTo(bx, y - 42); x.lineTo(bx, y); x.stroke(); } }
    x.fillStyle = '#1c1024'; x.fillRect(-1500, -700, 3600, 740); for (let bx = -1400; bx < 2100; bx += 400) x.fillRect(bx, 0, 30, 90);
    x.fillStyle = '#2a1a1a'; x.fillRect(-1500, 1000, 3600, 700);
    x.fillStyle = '#2a1a1a'; for (const sy of [300, 440]) { x.fillRect(1120, sy, 700, 14); for (let k = 0; k < 10; k++) { x.save(); x.translate(1150 + k * 66, sy); PR.bottle(x, B, 90); x.restore(); } }
    x.fillStyle = '#3a2418'; x.fillRect(1080, 700, 760, 300); x.fillStyle = '#5a3a24'; x.fillRect(1060, 690, 800, 26);
    const P5 = [[180, 1000, 2.6, 'woman'], [420, 1000, 2.9, 'man'], [640, 1000, 2.7, 'man'], [900, 1000, 3.0, 'woman'], [1250, 1000, 2.6, 'man']];
    P5.forEach(([px, py, s, kind], i) => {
      const bob = Math.abs(Math.sin(tp * 5.5 + i * 1.3)) * 10, lift = i === 2 ? smooth((tp - K.stop + .2) / .3) : 0;
      x.save(); x.translate(px, py - bob); x.scale(i % 2 ? -s : s, s); x.rotate(Math.sin(tp * 5.5 + i) * .03);
      PR.person(x, B, { kind, hat: kind === 'man' ? 'wide' : 'none', hatColor: '#06060f', dark: 1, arm: i === 2 ? .2 + .8 * lift : .55 });
      if (i === 2) { x.fillStyle = '#ffb34d'; x.fillRect(14, lerp(-58, -102, lift), 8, 12); }
      x.restore();
    });
    const d = DOOR; x.fillStyle = '#3a2418'; x.fillRect(d.x, d.y, d.w, d.h); x.fillStyle = '#2a1810'; x.fillRect(d.x + 20, d.y + 20, d.w - 40, d.h - 40);
    x.fillStyle = '#6a6a80'; for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { x.beginPath(); x.arc(d.x + 50 + c * 76, d.y + 70 + r * 110, 8, 0, TAU); x.fill(); }
    const slot = smooth((tp - K.behind - .1) / .25) * (1 - smooth((tp - K.password - .4) / .25)), sx = d.x + d.w / 2 - 70, sy = d.y + 150;
    x.fillStyle = '#ffe0a8'; x.fillRect(sx, sy, 140, 44 * slot);
    if (slot > .5) { x.fillStyle = '#0a0a18'; for (const ex of [sx + 42, sx + 98]) { x.beginPath(); x.ellipse(ex, sy + 22, 13, 7, 0, 0, TAU); x.fill(); } x.fillStyle = '#ffe0a8'; for (const ex of [sx + 45, sx + 101]) { x.beginPath(); x.arc(ex, sy + 20, 3, 0, TAU); x.fill(); } }
    x.fillStyle = '#3a2418'; x.fillRect(sx - 10, sy - 50 + 50 * (1 - slot), 160, 50);
    const bolt = easeIO(clamp((tp - K.password) / .3));
    x.fillStyle = '#8a8aa0'; x.fillRect(d.x + d.w - 90, d.y + 380, 150, 16); x.fillStyle = '#b0b0c8'; x.fillRect(d.x + d.w - 60 + 90 * (1 - bolt), d.y + 372, 70, 32);
    x.fillStyle = '#5a5a70'; x.fillRect(d.x + d.w + 40, d.y + 360, 30, 56);
  }
  function roomGlows(ctx, tp, inside) {
    if (inside <= 0) return;
    for (const [bx, by] of [[200, 120], [800, 120], [1500, 120], [-600, 120]]) PR.glow(ctx, RX + bx * RS, RY + by * RS, 500 * RS, '#ffcf80', .45 * inside, 'lightbox');
    PR.glow(ctx, RX + 1450 * RS, RY + 400 * RS, 700 * RS, B.amber, .3 * inside, 'lightbox');
  }

  const mz = M45 ? .62 : 1, inz = z => Math.log(z * mz);
  const IN = (lx, ly, z) => [RX + lx * RS, RY + ly * RS, Math.log(z * (M45 ? .8 : 1) / RS)];
  const KEYS = [[0, [2000, -760, inz(.4)]], [K.bars + .3, [2000, -700, inz(.43)]], [K.drinking + .15, [WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, inz(2.2)]],
    [K.stop - .2, IN(900, 560, 1.02)], [K.moved + .2, IN(820, 560, 1)], [K.behind + .1, IN(-620, 560, 1.15)], [DUR, IN(-640, 570, 1.18)]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t, cam = camera(t), extra) {
    const tp = pose(t), inside = smooth((Math.log(cam.z) - Math.log(3 * mz)) / (Math.log(14 * mz) - Math.log(3 * mz)));
    L.background(ctx);
    if (inside < 1) L.sheet(ctx, cam, 1, R, x => { skyline(x, tp); room(x, tp); }, { glow: .35, glowBlur: 12 });
    if (inside > 0) { ctx.save(); ctx.globalAlpha = inside; L.sheet(ctx, cam, 1, R, x => { x.translate(RX, RY); x.scale(RS, RS); roomInside(x, tp); }, { glow: .3, glowBlur: 12, alpha: inside }); ctx.restore(); }
    FILM.sheet(ctx, cam, 1, W, H, R);
    if (inside < 1) { for (const w of WINS) if (w.hid) { const on = smooth((tp - w.t) / .2); if (on > 0 && hash(w.x, w.y) < .25) PR.glow(ctx, w.x + 10, w.y + 15, 60, '#ffcf80', .25 * on * (1 - inside), 'lightbox'); } for (const b of BARS) { const lit = 1 - smooth((tp - b.t) / .2); if (lit > 0) PR.glow(ctx, b.x + 60, -60, 160, B.amber, .4 * lit, 'lightbox'); } }
    roomGlows(ctx, tp, Math.max(inside, .6 * smooth((tp - K.drinking) / .3)));
    if (extra) extra(ctx, cam, tp);
    title(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.york, K.speakeasies, K.legal, K.stop, K.behind, K.password],
    api: { DUR, camera, draw, RS, RX, RY, DOOR, K, L },
  });
})();
