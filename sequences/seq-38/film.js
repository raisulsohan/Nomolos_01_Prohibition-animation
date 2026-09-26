(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath } = FILM, PR = FILM.props;
  const ID = 'seq-38', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { rich: 1.101, nationwide: 2.235, wired: 3.837, hall: 4.771, america: 5.906,
    half: 7.14, monster: 8.708, crusade: 9.776, fed: 10.577, raised: 10.977 };
  const AMB = B.amber;

  const M = FILM.usmap({ width: M45 ? 950 : 1400, cx: 960, cy: M45 ? 520 : 560 });
  const NAMES = ['chicago', 'detroit', 'cleveland', 'pittsburgh', 'newyork', 'philadelphia', 'washington', 'stlouis', 'kansascity', 'minneapolis', 'neworleans', 'miami', 'atlanta', 'dallas', 'denver', 'losangeles', 'sanfrancisco', 'seattle'].filter(n => M.cities[n]);
  const HOPS = { chicago: 0 }; { const q = ['chicago']; while (q.length) { const a = q.shift(); for (const b of NAMES) if (!(b in HOPS) && Math.hypot(M.cities[a][0] - M.cities[b][0], M.cities[a][1] - M.cities[b][1]) < (M45 ? 300 : 440)) { HOPS[b] = HOPS[a] + 1; q.push(b); } } }
  const NODES = NAMES.map((n, i) => ({ n, p: M.cities[n], t: .1 + (HOPS[n] ?? 5) * .42 + (i % 3) * .05 }));
  const EDGES = []; for (const a of NODES) for (const b of NODES) if (a.n < b.n && Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1]) < (M45 ? 300 : 440)) EDGES.push([a, b]);

  const OC = [960, M45 ? 470 : 440], OS = M45 ? .8 : 1;
  const RISE = [K.america - .1, K.monster + .1];
  const morph = t => easeIO(clamp((t - RISE[0]) / (RISE[1] - RISE[0])));
  const swell = t => 1 + .12 * smooth((t - K.fed + .1) / .8);
  const tentacle = (i, t) => {
    const a0 = Math.PI * (.15 + .7 * i / 7), pts = [];
    for (let k = 0; k <= 14; k++) { const s = k / 14, a = a0 + Math.sin(t * 1.4 + i + s * 3) * .35 * s + (i < 4 ? -1 : 1) * s * s * .9; pts.push([OC[0] + Math.cos(a) * (120 + 520 * s) * OS, OC[1] + 60 * OS + Math.sin(a) * (80 + 380 * s) * OS]); }
    return pts;
  };
  const target = (i, t) => { const arm = i % 8, pts = tentacle(arm, t), s = Math.floor(i / 8); return i < 16 ? pts[4 + s * 6] : [OC[0] + (i - 17) * 60 * OS, OC[1] - 120 * OS]; };
  function octopus(x, t, m) {
    if (m <= 0) return; const sw = swell(t);
    x.save(); x.translate(OC[0], OC[1]); x.scale(sw, sw); x.translate(-OC[0], -OC[1]); x.globalAlpha = m;
    for (let i = 0; i < 8; i++) { const pts = tentacle(i, t); x.strokeStyle = '#0a0818'; x.lineCap = 'round'; x.lineJoin = 'round';
      for (let k = 1; k < pts.length; k++) { x.lineWidth = (90 - 76 * k / pts.length) * OS; x.beginPath(); x.moveTo(pts[k - 1][0], pts[k - 1][1]); x.lineTo(pts[k][0], pts[k][1]); x.stroke(); } }
    x.fillStyle = '#0a0818'; x.beginPath(); x.ellipse(OC[0], OC[1] - 60 * OS, 190 * OS, 230 * OS, 0, 0, TAU); x.fill();
    x.fillStyle = '#ffcf80'; for (const s of [-1, 1]) { x.beginPath(); x.ellipse(OC[0] + s * 70 * OS, OC[1] - 10 * OS, 22 * OS, 14 * OS, s * .25, 0, TAU); x.fill(); }
    x.restore();
  }
  function network(x, t, tp, m) {
    const pos = NODES.map((d, i) => { const q = target(i, tp); return [lerp(d.p[0], q[0], m), lerp(d.p[1], q[1], m)]; });
    for (const [a, b] of EDGES) {
      const u = smooth((t - Math.max(a.t, b.t)) / .4); if (u <= 0) continue; const pa = pos[NODES.indexOf(a)], pb = pos[NODES.indexOf(b)];
      x.strokeStyle = FILM.rgba(FILM.hex(AMB), .85 * u * (1 - .8 * m)); x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(pa[0], pa[1]); x.lineTo(lerp(pa[0], pb[0], u), lerp(pa[1], pb[1], u)); x.stroke();
    }
    NODES.forEach((d, i) => { const u = smooth((t - d.t) / .3); if (u <= 0) return; const gold = smooth((t - K.rich) / .4) * (1 - smooth((t - K.nationwide) / .8));
      x.fillStyle = gold > 0 ? FILM.rgba(FILM.mixc(FILM.hex('#ffcf80'), FILM.hex('#ffe9a0'), gold)) : '#ffcf80'; x.beginPath(); x.arc(pos[i][0], pos[i][1], (9 + 5 * gold) * u, 0, TAU); x.fill(); });
  }
  function halls(x, t, m) {
    const u0 = K.wired - .3; if (t < u0 || m >= 1) return;
    NODES.forEach((d, i) => {
      const u = back((t - u0 - i * .04) / .3); if (u <= 0) return; const hx = d.p[0] + 26, hy = d.p[1] - 22;
      x.save(); x.globalAlpha = 1 - m; x.translate(hx, hy); x.scale(u * .9, u * .9);
      x.fillStyle = '#e8e4ec'; x.fillRect(-14, -8, 28, 16); x.beginPath(); x.ellipse(0, -8, 9, 9, 0, Math.PI, TAU); x.fill(); x.fillRect(-1, -22, 2, 6);
      x.fillStyle = '#2e2a6e'; for (let k = -1; k <= 1; k++) x.fillRect(k * 8 - 2, -4, 4, 10); x.restore();
      const w = smooth((t - K.hall + .2 - i * .03) / .35); if (w > 0) { x.strokeStyle = FILM.rgba(FILM.hex(AMB), (1 - m) * .9); x.lineWidth = 3; x.beginPath(); x.moveTo(d.p[0], d.p[1]); x.lineTo(lerp(d.p[0], hx - 12, w), lerp(d.p[1], hy + 4, w)); x.stroke(); }
    });
  }
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  function map(x, m) {
    x.fillStyle = '#0c0a24'; x.fillRect(-1200, -1200, 4400, 3400);
    x.globalAlpha = 1 - .4 * m; x.fillStyle = '#3a2f5e'; polyPath(x, M.canada); x.fill(); polyPath(x, M.mexico); x.fill();
    x.fillStyle = '#2c3378'; polyPath(x, M.us); x.fill(); x.fillStyle = '#0a1a3a'; for (const l of Object.values(M.lakes)) { polyPath(x, l); x.fill(); } x.globalAlpha = 1;
  }
  const camera = t => ({ x: 960, y: M45 ? 560 : 540, z: (M45 ? .98 : 1) * lerp(1.02, 1.08, smooth(t / DUR)) });
  function year(ctx, t) {
    const a = smooth((t - K.half + .2) / .3); if (a <= 0) return; const u = clamp((t - K.half) / (K.raised - K.half)), yr = 1933 + Math.round(50 * easeIO(u));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 110 : 110}px NSC`;
    ctx.shadowColor = 'rgba(255,174,74,.5)'; ctx.shadowBlur = 26; ctx.fillStyle = '#ffe3b0'; ctx.fillText(String(yr), W / 2, H - (M45 ? 150 : 100)); ctx.restore();
  }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t), m = morph(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { map(x, m); octopus(x, tp, m); halls(x, t, m); network(x, t, tp, m); }, { glow: .4, glowBlur: 12 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    NODES.forEach((d, i) => { const u = smooth((t - d.t) / .3); if (u > 0 && m < 1) PR.glow(ctx, d.p[0], d.p[1], 50, AMB, .5 * u * (1 - m), 'lightbox'); });
    if (m > 0) for (const s of [-1, 1]) PR.glow(ctx, OC[0] + s * 70 * OS * swell(tp), OC[1] - 10 * OS, 70, '#ffcf80', .6 * m, 'lightbox');
    year(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.rich, K.nationwide, K.wired, K.monster, K.raised],
  });
})();
