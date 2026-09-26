(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-27', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { in29: 1.668, capones: 3.437, men: 3.971, dressed: 4.938, police: 5.439,
    lined: 6.573, seven: 7.04, wall: 9.776, cut: 10.477, guns: 11.678,
    st: 13.08, massacre: 14.248, mass: 15.816, uniform: 16.917, law: 18.018, stop: 19.153 };
  const line = (x, a, b, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); };

  const GY = 760, DOOR = { x: 900, y: 420, w: 340, h: 340 }, DC = [1070, 590], DS = DOOR.w / 1920;
  const I2W = (ix, iy) => [DC[0] + (ix - 960) * DS, DC[1] + (iy - 540) * DS];
  const HEART = [1010, 960], CAP = [1150, 966], GONE = 10.9;
  const carX = t => lerp(-700, 560, easeOut(clamp((t - K.capones + .3) / 1.25), 2.2));
  function street(x, t) {
    x.fillStyle = '#2a3252'; x.fillRect(-1600, -1200, 5200, GY + 1200);
    for (const [x0, x1, top] of [[-800, 540, 200], [1580, 2800, 150]]) { x.fillStyle = '#262846'; x.fillRect(x0, top, x1 - x0, GY - top); x.fillStyle = '#dfe6f0'; x.fillRect(x0, top - 8, x1 - x0, 10);
      const g = rng(x0 + 3000); for (let wy = top + 60; wy < GY - 80; wy += 110) for (let wx = x0 + 50; wx < x1 - 40; wx += 120) { x.fillStyle = g() < .3 ? 'rgba(255,207,128,.35)' : '#1a1a36'; x.fillRect(wx, wy, 44, 64); } }
    x.fillStyle = '#3e2c38'; x.fillRect(560, 260, 1000, GY - 260);
    x.fillStyle = 'rgba(20,14,24,.35)'; for (let y = 280; y < GY; y += 26) x.fillRect(560, y, 1000, 3);
    x.fillStyle = '#dfe6f0'; x.fillRect(550, 250, 1020, 12);
    x.fillStyle = '#1a1628'; x.fillRect(620, 292, 880, 64); x.fillStyle = '#ffe3b0'; x.font = '900 44px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('S-M-C CARTAGE CO.', 1060, 326);
    x.fillStyle = '#1a1628'; x.fillRect(624, 454, 228, 196); x.fillStyle = 'rgba(255,207,128,.35)'; x.fillRect(636, 466, 204, 172); x.fillStyle = '#1a1628'; x.fillRect(734, 466, 8, 172); x.fillRect(636, 548, 204, 8);
    x.fillStyle = '#dfe6f0'; x.fillRect(618, 648, 240, 8);
    x.fillStyle = '#1a1628'; x.fillRect(DOOR.x - 16, DOOR.y - 16, DOOR.w + 32, 16); x.fillRect(DOOR.x - 16, DOOR.y, 16, DOOR.h); x.fillRect(DOOR.x + DOOR.w, DOOR.y, 16, DOOR.h);
    x.fillStyle = '#cdd6e6'; x.fillRect(-1600, GY, 5200, 900); x.fillStyle = '#bcc6d8'; x.fillRect(-1600, GY + 26, 5200, 6);
    const tx = t < GONE ? carX(t) - 130 : 3200; x.fillStyle = '#a4afc4'; x.fillRect(-1600, 896, tx + 1600, 7); x.fillRect(-1600, 922, tx + 1600, 7);
  }
  function car(x, t) {
    if (t >= GONE) return; const cx = carX(t), by = 912;
    x.fillStyle = '#16162c'; x.fillRect(cx - 210, by - 112, 300, 74); x.fillRect(cx + 80, by - 96, 132, 58);
    x.fillRect(cx - 170, by - 196, 230, 86); x.fillStyle = 'rgba(120,140,180,.45)'; x.fillRect(cx - 156, by - 184, 96, 60); x.fillRect(cx - 50, by - 184, 96, 60);
    x.fillStyle = '#0c0c1c'; x.fillRect(cx - 222, by - 44, 450, 10);
    for (const wx of [cx - 130, cx + 140]) { x.fillStyle = '#0a0a14'; x.beginPath(); x.arc(wx, by - 34, 36, 0, TAU); x.fill(); x.fillStyle = '#5a5a70'; x.beginPath(); x.arc(wx, by - 34, 12, 0, TAU); x.fill(); }
    x.fillStyle = '#ffe3b0'; x.font = '900 32px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('POLICE', cx - 60, by - 76);
    x.fillStyle = '#c8a040'; x.beginPath(); x.arc(cx + 196, by - 118, 12, 0, TAU); x.fill();
    x.fillStyle = '#ffe3b0'; x.beginPath(); x.arc(cx + 212, by - 84, 10, 0, TAU); x.fill();
    x.fillStyle = '#dfe6f0'; x.fillRect(cx - 170, by - 200, 230, 6);
  }
  const MEN = [0, 1, 2, 3].map(k => ({ k, cop: k < 2, x0: 470 + k * 60, out: K.men + .8 + k * .14, walk: K.police - .2 + k * .1 }));
  function men(x, t, tp) {
    for (const m of MEN) {
      if (t < m.out) continue;
      const up = easeOut(clamp((tp - m.out) / .35)), w = clamp((tp - m.walk) / 1.0), e = easeIO(w), px = lerp(m.x0, 1030 + m.k * 12, e), bob = w > 0 && w < 1 ? Math.abs(Math.sin(tp * 11 + m.k)) * 3 : 0;
      const a = 1 - smooth((px - 960) / 70); if (a <= 0) continue;
      x.save(); x.globalAlpha = a; x.translate(px, lerp(GY + 150, GY + 30, e) - 60 * (1 - up) - bob); x.scale(lerp(1.9, 1.55, e), lerp(1.9, 1.55, e));
      PR.person(x, B, { kind: 'man', hat: m.cop ? 'cap' : 'wide', coat: m.cop ? '#1e2848' : '#2a2630', trouser: m.cop ? '#1a2240' : '#221e28', hatColor: m.cop ? '#16204a' : '#141018', dark: .3 });
      if (m.cop) { x.fillStyle = '#c8a040'; x.beginPath(); x.arc(-5, -63, 2.2, 0, TAU); x.arc(0, -87.5, 1.6, 0, TAU); x.fill(); }
      x.restore();
    }
  }

  const FL = [K.cut + .02, K.cut + .5, K.cut + 1.0];
  const SEVEN = [0, 1, 2, 3, 4, 5, 6].map(k => ({ x: (M45 ? 350 : 300) + k * (M45 ? 148 : 185) + (k % 2 ? 8 : -6), t: K.seven - .05 + k * .16, hat: k % 3 !== 1, gone: FL[[1, 0, 2, 1, 0, 2, 0][k]] }));
  const FR = M45 ? 1722 : 1920;
  const GUN = [{ x: FR - (M45 ? 330 : 360), s: 7.2 }, { x: FR - (M45 ? 110 : 130), s: 8 }], GIN = K.cut - .35, GOUT = FL[2] + .4;
  const sway = t => t < FL[0] ? 0 : .14 * Math.sin((t - FL[0]) * 5.5) * Math.exp(-(t - FL[0]) * .45);
  const poly = (x, pts) => {
    const area = pts.reduce((a, p, i) => { const q = pts[(i + 1) % pts.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0), ps = area < 0 ? [...pts].reverse() : pts;
    x.moveTo(ps[0][0], ps[0][1]); for (const p of ps.slice(1)) x.lineTo(p[0], p[1]); x.closePath();
  };
  function shadowMan(x, cx, by, s, hat) {
    x.save(); x.translate(cx, by); x.scale(s, s); x.beginPath();
    x.rect(-9, -46, 7, 46); x.rect(2, -46, 7, 46); poly(x, [[-12, -76], [12, -76], [11, -40], [-11, -40]]);
    poly(x, [[-10, -74], [-21, -105], [-15, -107], [-5, -76]]); poly(x, [[10, -74], [21, -105], [15, -107], [5, -76]]);
    x.moveTo(-2.5, -76); x.rect(-2.5, -80, 5, 5); x.moveTo(7, -86); x.arc(0, -86, 7, 0, TAU);
    if (hat) { x.moveTo(13, -91); x.ellipse(0, -91, 13, 3, 0, 0, TAU); x.moveTo(7, -93); x.ellipse(0, -93, 7, 6, 0, Math.PI, TAU); }
    x.fill(); x.restore();
  }
  function shadowGunman(x, cx, by, s) {
    x.save(); x.translate(cx, by); x.scale(s, s); x.beginPath();
    x.rect(-9, -46, 7, 46); x.rect(2, -46, 7, 46); poly(x, [[-13, -76], [13, -76], [14, -34], [-14, -34]]);
    x.moveTo(-2.5, -76); x.rect(-2.5, -80, 5, 5); x.moveTo(7, -86); x.arc(0, -86, 7, 0, TAU);
    poly(x, [[-8, -91], [8, -91], [10, -97], [-10, -97]]); poly(x, [[-8, -91], [-17, -89], [-8, -87]]);
    poly(x, [[-10, -70], [-22, -54], [-18, -50], [-6, -64]]);
    poly(x, [[4, -58], [-52, -58], [-52, -54], [-30, -54], [-30, -50], [0, -50], [10, -46], [12, -52]]); x.moveTo(-18, -48); x.arc(-22, -48, 6, 0, TAU);
    x.fill(); x.restore();
  }
  const MUZZLE = s => [-52 * s, -56 * s];
  function interior(x, t, tp) {
    x.fillStyle = '#4a3434'; x.fillRect(-500, -900, 2920, 1800);
    x.fillStyle = '#3a2626'; for (let r = 0, y = -900; y < 900; y += 44, r++) { x.fillRect(-500, y, 2920, 4); for (let bx = -500 + (r % 2) * 55; bx < 2420; bx += 110) x.fillRect(bx, y, 4, 44); }
    x.fillStyle = '#2a2230'; x.fillRect(-500, 900, 2920, 1000); x.fillStyle = '#3a3040'; x.fillRect(-500, 900, 2920, 10);
    const a = sway(t), bulb = [960 + 740 * Math.sin(a), -900 + 740 * Math.cos(a)];
    line(x, [960, -900], bulb, 4, '#1a1628'); x.fillStyle = '#ffe3b0'; x.beginPath(); x.arc(bulb[0], bulb[1] + 12, 18, 0, TAU); x.fill();
    const g = x.createRadialGradient(bulb[0], 300, 100, bulb[0], 300, 1300); g.addColorStop(0, 'rgba(8,4,14,0)'); g.addColorStop(1, 'rgba(8,4,14,.7)');
    x.fillStyle = g; x.fillRect(-500, -900, 2920, 2800);
    for (const m of SEVEN) {
      const u = smooth((tp - m.t) / .25); if (u <= 0 || t >= m.gone) continue;
      x.fillStyle = `rgba(6,3,10,${.3 * u})`; shadowMan(x, m.x - 40 * (1 - u), 900, 5.35, m.hat);
      x.fillStyle = `rgba(6,3,10,${.55 * u})`; shadowMan(x, m.x - 40 * (1 - u), 900, 5.2, m.hat);
    }
    for (const [i, gm] of GUN.entries()) {
      const u = easeOut(clamp((t - GIN - i * .12) / .4)) - easeIO(clamp((t - GOUT - i * .1) / .5)); if (u <= 0) continue;
      const gx = gm.x + 420 * (1 - u);
      x.fillStyle = `rgba(6,3,10,${.35 * u})`; shadowGunman(x, gx, 980, gm.s * 1.02); x.fillStyle = `rgba(6,3,10,${.78 * u})`; shadowGunman(x, gx, 980, gm.s);
    }
    if (t > FL[0]) { const r = rng(27); for (let k = 0; k < 14; k++) { const age = t - FL[0] - r() * .6; if (age <= 0) continue; const sx = 400 + r() * 1200, sy = 700 - r() * 300 - 60 * age;
      const px = sx + 30 * Math.sin(age + k), pr = 80 + 50 * age, pg = x.createRadialGradient(px, sy, 0, px, sy, pr), pa = .1 * Math.min(1, age / .3) * Math.exp(-age * .3);
      pg.addColorStop(0, `rgba(200,190,210,${pa})`); pg.addColorStop(1, 'rgba(200,190,210,0)'); x.fillStyle = pg; x.fillRect(px - pr, sy - pr, 2 * pr, 2 * pr); } }
  }
  function flashAmt(t) { let a = 0; for (const f of FL) { const u = (t - f) / .22; if (u > 0 && u < 1) a = Math.max(a, 1 - u); } return a; }

  function heart(x) {
    const hp = s => { x.beginPath(); x.moveTo(0, 30 * s); x.bezierCurveTo(-60 * s, -6 * s, -40 * s, -52 * s, 0, -24 * s); x.bezierCurveTo(40 * s, -52 * s, 60 * s, -6 * s, 0, 30 * s); };
    x.save(); x.translate(HEART[0], HEART[1]); x.rotate(-.28); x.scale(1.3, .8);
    x.fillStyle = 'rgba(40,50,80,.25)'; x.translate(5, 8); hp(1.2); x.fill(); x.translate(-5, -8);
    x.fillStyle = '#f4f0f8'; hp(1.2); x.fill();
    x.fillStyle = '#e4e0ec'; for (let k = 0; k < 22; k++) { const q = k / 22 * TAU; x.beginPath(); x.arc(46 * Math.sin(q) * .9, -4 + 34 * Math.cos(q) * .9, 3, 0, TAU); x.fill(); }
    x.fillStyle = '#c62f3a'; hp(.95); x.fill(); x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.ellipse(-18, -18, 10, 6, -.5, 0, TAU); x.fill();
    x.restore();
    x.fillStyle = '#e8eef6'; x.beginPath(); x.ellipse(HEART[0] + 30, HEART[1] + 6, 26, 5, -.2, 0, TAU); x.fill();
  }
  function cap(x, t) {
    const dull = smooth((t - K.law - .5) / .9), badge = FILM.mixc(FILM.hex('#d8b050'), FILM.hex('#6a6458'), dull);
    x.save(); x.translate(CAP[0], CAP[1]); x.rotate(.12);
    x.fillStyle = 'rgba(40,50,80,.25)'; x.beginPath(); x.ellipse(6, 10, 66, 18, 0, 0, TAU); x.fill();
    x.fillStyle = '#0c0c16'; x.beginPath(); x.ellipse(-30, 6, 36, 10, -.2, 0, TAU); x.fill();
    x.fillStyle = '#1e2848'; x.beginPath(); x.ellipse(8, -16, 60, 22, 0, 0, TAU); x.fill();
    x.fillStyle = '#16204a'; x.fillRect(-44, -12, 94, 18); x.fillStyle = '#0c0c16'; x.fillRect(-44, 2, 94, 6);
    x.fillStyle = FILM.rgba(badge); polyPath(x, [[-10, -24], [0, -28], [10, -24], [11, -10], [0, -2], [-11, -10]]); x.fill();
    x.restore();
    x.fillStyle = '#e8eef6'; x.beginPath(); x.ellipse(CAP[0] + 40, CAP[1] - 30, 24, 6, .1, 0, TAU); x.fill();
  }

  const IN = M45 ? 4.05 : 5.75;
  const KEYS = M45
    ? [[0, [1060, 580, .95]], [2.8, [1070, 580, 1.0]], [K.capones, [1000, 610, 1.0]], [K.men + .5, [780, 660, 1.2]], [K.police + .2, [760, 660, 1.35]], [K.lined - .25, [880, 640, 1.35]],
      [K.seven - .05, [DC[0], DC[1], IN]], [K.cut - .3, [DC[0], DC[1] + 1, IN * 1.01]], [GOUT + .25, [DC[0], DC[1], IN * 1.01]], [K.st - .15, [1060, 740, 1.2]], [K.massacre + .1, [1010, 960, 3.0]],
      [K.mass - .2, [1015, 960, 3.05]], [K.uniform + .3, [1080, 962, 2.6]], [DUR, [1080, 962, 2.7]]]
    : [[0, [1060, 560, .95]], [2.8, [1070, 560, 1.0]], [K.capones, [1000, 590, 1.02]], [K.men + .5, [820, 640, 1.2]], [K.police + .2, [800, 650, 1.3]], [K.lined - .25, [900, 620, 1.3]],
      [K.seven - .05, [DC[0], DC[1], IN]], [K.cut - .3, [DC[0], DC[1] + 1, IN * 1.01]], [GOUT + .25, [DC[0], DC[1], IN * 1.01]], [K.st - .15, [1060, 740, 1.3]], [K.massacre + .1, [1015, 960, 4.0]],
      [K.mass - .2, [1020, 960, 4.05]], [K.uniform + .3, [1080, 962, 3.4]], [DUR, [1080, 962, 3.55]]];
  const LK = KEYS.map(([t, v]) => [t, [v[0], v[1], Math.log(v[2])]]);
  function camera(t) { const v = keyed(t, LK); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function snow(ctx, t, cam) {
    const a = 1 - smooth((cam.z - 2.2) / 1.2) * (t < GOUT + 1 ? 1 : 0); if (a <= 0) return; const g = rng(29);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(240,244,252,${.75 * a})`;
    for (let k = 0; k < 140; k++) { const x0 = g() * W, y0 = g() * H, sp = 40 + g() * 60, r = 1.5 + g() * 2.5, px = (x0 + 25 * Math.sin(t * .8 + k) - cam.x * .15 + 4 * W) % W, py = (y0 + sp * t) % H;
      ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  function card(ctx, t, text, t0, t1, y, size) {
    const a = smooth((t - t0) / .3) * (1 - smooth((t - t1) / .4)); if (a <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${size}px NSC`;
    const lines = [].concat(text), bw = Math.max(...lines.map(s => ctx.measureText(s).width)) + size * 1.2, bh = lines.length * size * 1.1 + size * .6;
    ctx.fillStyle = 'rgba(10,10,26,.6)'; ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2, y - bh / 2, bw, bh, 10); ctx.fill();
    ctx.fillStyle = '#ffe3b0'; lines.forEach((s, i) => ctx.fillText(s, W / 2, y + 2 + (i - (lines.length - 1) / 2) * size * 1.1)); ctx.restore();
  }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => {
      street(x, t);
      x.save(); x.beginPath(); x.rect(DOOR.x, DOOR.y, DOOR.w, DOOR.h); x.clip(); x.translate(DC[0], DC[1]); x.scale(DS, DS); x.translate(-960, -540); interior(x, t, tp); x.restore();
      if (t > GONE - .5) { heart(x); cap(x, t); }
      men(x, t, tp); car(x, t);
    }, { glow: .3, glowBlur: 12 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    const a = sway(t), bw = I2W(960 + 740 * Math.sin(a), -900 + 740 * Math.cos(a) + 12);
    PR.glow(ctx, bw[0], bw[1] + 60 * DS, 900 * DS, '#ffcf80', .45, 'lightbox');
    PR.glow(ctx, 738, 552, 170, '#ffcf80', .25, 'lightbox');
    if (t < GONE) PR.glow(ctx, carX(t) + 212, 828, 90, '#ffe3b0', .5, 'lightbox');
    const fa = flashAmt(t);
    if (fa > 0) for (const [i, gm] of GUN.entries()) { const m = MUZZLE(gm.s), p = I2W(gm.x + m[0], 980 + m[1]); PR.glow(ctx, p[0], p[1], 260 * DS, '#fff2c8', fa, 'lightbox'); PR.glow(ctx, DC[0], DC[1], 900 * DS, '#ffe3b0', .5 * fa, 'lightbox'); }
    const gl = Math.sin(Math.PI * clamp((t - K.law + .1) / .9)) * (t > K.law - .1 ? 1 : 0);
    if (gl > 0) PR.glow(ctx, CAP[0] - 1, CAP[1] - 15, 40, '#fff2c8', .8 * gl, 'lightbox');
    if (fa > 0 && cam.z > 3) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,240,210,${.22 * fa})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    snow(ctx, t, cam);
    card(ctx, t, '14 February 1929', K.in29 - .05, K.capones + .2, M45 ? 170 : 110, 64);
    card(ctx, t, M45 ? ["St. Valentine's Day", 'Massacre'] : "St. Valentine's Day Massacre", K.st - .05, K.uniform + .5, M45 ? 210 : H - 130, M45 ? 74 : 72);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.in29, K.police, K.seven, K.cut, K.st, K.law],
  });
})();
