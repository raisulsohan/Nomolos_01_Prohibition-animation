(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath } = FILM;
  const ID = 'seq-06b', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S6 = FILM.getScene('seq-06').api, L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const HZ = S6.HZ, S0 = S6.drift(S6.DUR), BD3 = S6.BD[3];
  const K = { drank: 1.569, heavily: 2.67, estimates: 3.904, americans: 4.738,
    early: 5.573, three: 7.775, today: 10.411, and: 11.445, heart: 12.179,
    saloon: 13.848 };
  const back = u => { u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const hexA = (h, a) => FILM.rgba(FILM.hex(h), a), PR = FILM.props;
  const BEATS = [0, 1, 2].map(n => K.heart - .05 + .85 * n);
  const beat = tp => BEATS.reduce((a, b) => a + [[0, 1], [.235, .7]].reduce((s, [d, g]) => s + (tp >= b + d ? g * Math.exp(-(tp - b - d) / .1) : 0), 0), 0);

  const toCam = (bx, by, ls) => ({ x: R[0] + (bx - R[0]) / .4, y: R[1] + (by - R[1]) / .4, z: Math.exp(ls / .4) });
  const c6 = S6.camera(S6.DUR), V0 = [R[0] + .4 * (c6.x - R[0]), R[1] + .4 * (c6.y - R[1]), .4 * Math.log(c6.z)];
  const view = (x, y, s) => [x, y, Math.log(s)];
  const V = M45 ? { town: view(1560, 440, 1.15), gauge: view(1800, 585, 1.9), door: view(2440, 430, 1.8) }
    : { town: view(1480, 470, 1.3), gauge: view(1780, 590, 2.2), door: view(2440, 425, 2) };
  const push = (t, t0, ramp, v) => { const u = t - t0; return u <= 0 ? 0 : u < ramp ? v * u * u / (2 * ramp) : v * (u - ramp / 2); };
  function camera(t) {
    const g = [V.gauge[0], V.gauge[1], V.gauge[2] + .08];
    const v = keyed(t, [[0, V0], [2.5, V.town], [K.estimates, V.town], [K.early + .4, V.gauge], [K.and + .15, g], [K.saloon, V.door]]);
    return toCam(v[0], v[1], v[2] + push(t, K.saloon - .6, 1, .15));
  }

  const MORE = [[-40, 300, 280, '#6e5038'], [2080, 240, 280, '#6b4e36'], [2760, 220, 270, '#5e4632']];
  const SAL = { x: 2440, w: 400, h: 360 };
  const SIGNS = [[-40, HZ - 280, 200, 0], [320, HZ - 250, 180, 1], [600, HZ - 330, 200, 2], [920, HZ - 300, 200, 3], [1230, HZ - 260, 180, 0],
    [1520, HZ - 310, 200, 1], [2080, HZ - 280, 180, 2], [SAL.x, HZ - SAL.h, 280, 0], [2760, HZ - 270, 170, 3]]
    .map(([x, y, w, k], i, a) => ({ x, y, w, k, t: K.drank - .55 + .12 * i }));
  function front(x, cx, w, h, col) {
    x.fillStyle = col; x.fillRect(cx - w / 2, HZ - h, w, h); x.fillStyle = 'rgba(30,18,10,.35)'; x.fillRect(cx - w / 2, HZ - h, w, 14);
    x.fillStyle = '#f2c46e'; for (const wx of [-w * .3, w * .1]) x.fillRect(cx + wx, HZ - h * .55, w * .2, h * .28);
  }
  const mixHex = (a, b, u) => FILM.rgba(FILM.hex(a).map((v, i) => Math.round(v + (FILM.hex(b)[i] - v) * clamp(u))), 1);
  function saloon(x, tp) {
    const { x: cx, w, h } = SAL, l = cx - w / 2, full = smooth((tp - K.and - 1.6) / .5), lit = Math.min(1, .35 * full + .8 * beat(tp));
    const win = mixHex('#f2c46e', '#ffe9b0', lit);
    x.fillStyle = '#7a4630'; x.fillRect(l, HZ - h, w, h); x.fillStyle = 'rgba(30,18,10,.35)'; x.fillRect(l, HZ - h, w, 14);
    x.fillStyle = win; for (const wx of [l + 60, cx + 70]) x.fillRect(wx, HZ - 285, 70, 90);
    x.fillStyle = '#4a2c1c'; x.fillRect(l - 20, HZ - 168, w + 40, 18); for (const px of [l - 12, l + 120, cx + 110, l + w + 2]) x.fillRect(px, HZ - 150, 10, 150);
    x.fillStyle = win; x.fillRect(l + 40, HZ - 130, 90, 80); x.fillRect(cx + 70, HZ - 130, 90, 80);
    x.fillStyle = mixHex('#2a1a10', P.amber, .85 * full + .15 * lit); x.fillRect(cx - 50, HZ - 140, 100, 140);
    x.fillStyle = '#b88a58'; for (const d of [-1, 1]) x.fillRect(cx + (d < 0 ? -47 : 2), HZ - 112, 45, 70);
    x.fillStyle = 'rgba(60,36,20,.55)'; for (const d of [-1, 1]) for (let k = 0; k < 4; k++) x.fillRect(cx + (d < 0 ? -41 : 8) + k * 9, HZ - 104, 4, 54);
  }
  function glassIcon(x, k, fill) {
    const shape = [
      [[-12, 16], [12, 16], [12, -14], [-12, -14]], [[-12, 16], [12, 16], [15, -10], [-15, -10]],
      [[-8, 17], [8, 17], [8, -2], [3, -9], [3, -18], [-3, -18], [-3, -9], [-8, -2]], [[-14, -14], [14, -14], [3, 2], [3, 12], [9, 17], [-9, 17], [-3, 12], [-3, 2]]][k];
    x.fillStyle = 'rgba(255,248,230,.6)'; polyPath(x, shape); x.fill();
    if (fill > 0) { x.save(); polyPath(x, shape); x.clip(); x.fillStyle = P.amber; const top = k === 3 ? -14 : k === 2 ? -18 : -14, bot = k === 3 ? 2 : 17; x.fillRect(-20, lerp(bot, top, fill), 40, 40); x.restore(); }
    x.strokeStyle = P.ink; x.lineWidth = 2.5; x.lineJoin = 'round'; polyPath(x, shape); x.stroke();
    if (k === 0) { x.beginPath(); x.arc(14, 1, 7, -1.3, 1.3); x.stroke(); }
  }
  function sign(x, s, tp, fill) {
    const u = back((tp - s.t) / .22); if (u <= 0) return;
    x.save(); x.translate(s.x, s.y); x.scale(1, u);
    x.fillStyle = '#3e2c1e'; x.fillRect(-s.w / 2 + 12, -8, 6, 8); x.fillRect(s.w / 2 - 18, -8, 6, 8);
    const f = s.x === SAL.x ? clamp((tp - K.saloon + .1) / .24) : 0, word = f >= .5;
    x.scale(Math.max(.04, Math.abs(Math.cos(Math.PI * f))), 1);
    x.fillStyle = word ? '#fff0c8' : '#e8d9b8'; x.fillRect(-s.w / 2, -72, s.w, 64); x.strokeStyle = '#3e2c1e'; x.lineWidth = 4; x.strokeRect(-s.w / 2 + 2, -70, s.w - 4, 60);
    if (word) { x.fillStyle = INK; x.font = '900 46px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('SALOON', 0, -38); x.restore(); return; }
    x.translate(0, -40); x.scale(1.35, 1.35); glassIcon(x, s.k, fill);
    x.restore();
  }
  function moreTown(x, tp) {
    for (const [cx, w, h, col] of MORE) front(x, cx, w, h, col);
    saloon(x, tp);
    x.fillStyle = '#3e2c1e';
    for (const [a, b] of [[-230, 160], [1830, 2880]]) { x.fillRect(a, HZ - 120, b - a, 14); for (let px = a + 10; px < b; px += 100) x.fillRect(px, HZ - 120, 10, 120); }
    SIGNS.forEach((s, i) => sign(x, s, tp, fillOf(i, tp)));
  }

  const DEPTH = 90;
  const fillOf = (i, tp) => easeIO(clamp((tp - (K.heavily - .12 + .035 * i)) / .28));
  const level = (t, tp) => DEPTH * easeOut(clamp((tp - (K.heavily + .7)) / 1));
  const FLOOD = '#d8973a';
  const dripAt = i => K.heavily + .18 + .035 * i;
  function flood(x, t, tp) {
    SIGNS.forEach((s, i) => {
      const u = easeIn(clamp((tp - dripAt(i)) / .45), 1.6), v = easeIn(clamp((tp - dripAt(i) - .5) / .5), 1.6); if (u <= 0 || v >= 1) return;
      x.fillStyle = P.amber;
      for (const dx of [-s.w * .22, s.w * .18]) { const y0 = s.y - 8 + (HZ - s.y) * v, y1 = s.y - 8 + (HZ - s.y + 8) * u; x.fillRect(s.x + dx - 4, y0, 8, y1 - y0); x.beginPath(); x.arc(s.x + dx, y1, 6, 0, TAU); x.fill(); }
    });
    const dr = easeIO(clamp((tp - K.and - .15) / 1.7)), gone = clamp((tp - K.and - 1.85) / .3);
    if (gone >= 1) return;
    const xl = lerp(-900, SAL.x - 50, dr) + 50 * gone, xr = lerp(2900, SAL.x + 50, dr) - 50 * gone;
    const hw = (xr - xl) / 2, tap = Math.min(80, hw);
    x.save(); x.beginPath(); x.moveTo(xl, HZ); x.lineTo(xl + tap, HZ - 300); x.lineTo(xr - tap, HZ - 300); x.lineTo(xr, HZ); x.ellipse(SAL.x, HZ, hw, Math.max(hw, 1) * .45, 0, 0, Math.PI); x.clip();
    x.fillStyle = FLOOD;
    SIGNS.forEach((s, i) => { const r = 1400 * easeOut(clamp((tp - dripAt(i) - .42) / .9), 2); if (r > 0) { x.beginPath(); x.ellipse(s.x, HZ - 3, r, r * .45, 0, 0, Math.PI); x.fill(); } });
    const d = level(t, tp) * (1 - .6 * dr);
    if (d > 0) {
      x.fillRect(-900, HZ - d, 3800, d);
      x.fillStyle = '#f7cf86'; x.fillRect(-900, HZ - d - 1.5, 3800, 3);
      const still = smooth((tp - K.estimates) / .3);
      if (still < 1) { x.fillStyle = hexA('#fff1c8', .55 * (1 - still)); for (let k = 0; k < 16; k++) x.fillRect(-900 + ((k * 297 + tp * 140) % 3800), HZ - d + 5 + (k % 3) * 9, 46, 2.5); }
      if (dr > 0) {
        x.fillStyle = hexA('#fff1c8', .6 * Math.sin(Math.PI * dr));
        for (let k = 0; k < 14; k++) { const e = k % 2 ? 1 : -1, span = Math.max(1, e < 0 ? SAL.x - xl : xr - SAL.x), o = (k * 211 + tp * 420) % span; x.fillRect(e < 0 ? xl + o : xr - o - 46, HZ - d + 5 + (k % 3) * 8, 46, 2.5); }
      }
    }
    x.restore();
  }
  const POLE = 1786, INK = '#2c2824', CARD = '#efe4c8';
  function tag(x, txt, px, py, u, side, font, pad = 10) {
    x.save(); x.font = font; const w = x.measureText(txt).width + 2 * pad, h = parseFloat(font.split(' ')[1]) * 1.25 + pad;
    x.translate(px, py); x.scale(u, u); const l = side < 0 ? -w : 0;
    x.fillStyle = CARD; x.beginPath(); x.roundRect(l, -h / 2, w, h, 5); x.fill();
    x.fillStyle = INK; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, l + w / 2, 1.5);
    x.restore();
  }
  function gauge(x, tp) {
    const out = 1 - smooth((tp - K.and - 1) / .4); if (out <= 0) return;
    x.globalAlpha = out;
    [30, 60, DEPTH].forEach((m, k) => { const u = back((tp - (K.americans - .3 + .12 * k)) / .2); if (u > 0) { x.fillStyle = CARD; x.fillRect(POLE - 17 * u, HZ - m - 2.5, 34 * u, 5); } });
    const e = back((tp - K.early) / .25); if (e > 0) tag(x, 'EARLY 1800s', POLE - 24, HZ - DEPTH, e, -1, '600 22px NS');
    const th = back((tp - K.three) / .3);
    if (th > 0) {
      x.strokeStyle = INK; x.lineWidth = 3.5; x.beginPath(); x.moveTo(POLE + 20, HZ - 30); x.lineTo(POLE + 30, HZ - 30); x.lineTo(POLE + 30, HZ - 30 - (DEPTH - 30) * clamp(th)); x.lineTo(POLE + 20, HZ - 30 - (DEPTH - 30) * clamp(th)); x.stroke();
      tag(x, '3×', POLE + 42, HZ - 60, th, 1, '900 60px NSC', 12);
    }
    const d = clamp((tp - K.today + .05) / .35);
    if (d > 0) { x.strokeStyle = INK; x.lineWidth = 3; x.setLineDash([14, 9]); x.beginPath(); x.moveTo(POLE - 420, HZ - 30); x.lineTo(POLE - 420 + 440 * easeOut(d), HZ - 30); x.stroke(); x.setLineDash([]); }
    const td = back((tp - K.today - .12) / .25); if (td > 0) tag(x, 'TODAY', POLE - 24, HZ - 30, td, -1, '600 22px NS');
    x.globalAlpha = 1;
  }

  function street(x, t, tp) {
    S6.backdrop(x, { ...BD3, draw: (x, c) => { BD3.draw(x, c); moreTown(x, tp); } }, S0);
    x.fillStyle = 'rgba(40,22,14,.34)'; x.fillRect(-900, -900, 3800, 3000);
    flood(x, t, tp);
  }

  function draw(ctx, t, cam = camera(t)) {
    const tp = pose(t);
    S6.draw(ctx, S6.DUR, cam, { backdrop: x => street(x, t, tp), label: 1 - smooth(t / .6), noGrade: true });
    const sa = smooth((tp - K.heart + .3) / .5);
    if (sa > 0) {
      FILM.sheet(ctx, cam, .4, W, H, R); PR.glow(ctx, SAL.x, HZ - 70, 300, P.amber, sa * (.1 + .28 * Math.min(1, beat(tp))), 'lightbox');
      const sg = smooth((tp - K.saloon) / .3); if (sg > 0) PR.glow(ctx, SAL.x, HZ - SAL.h - 40, 230, P.amber, .2 * sg * (1 + .5 * Math.min(1, beat(tp))), 'lightbox');
    }
    if (tp > K.americans - .4 && tp < K.and + 1.5) L.sheet(ctx, cam, .4, R, x => gauge(x, tp), { paperShadow: [3, 4, 3, .35], rimAlpha: .3 });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })),
    api: { DUR, camera, draw, toCam, V, SAL, HZ, push, K },
  });
})();
