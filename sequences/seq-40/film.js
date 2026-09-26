(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIn, easeIO, clamp, lerp, polyPath, rng, noise1 } = FILM;
  const ID = 'seq-40', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { strip: 0, simple: 2.169, underneath: 2.903, put: 4.071, price: 4.905,
    disappear: 7.508, almost: 9.009, never: 9.343, does: 9.777 };
  const INK = '#1d1a22', back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const PAGE = [960, 540, 1500, M45 ? 1800 : 980];

  const LAYERS = [
    { bg: '#1c1a44', draw: x => { x.fillStyle = 'rgba(255,207,128,.7)'; const g = rng(1); for (let k = 0; k < 60; k++) x.fillRect(-700 + g() * 1400, -400 + g() * 700, 22, 30); x.fillStyle = '#0c0a24'; x.fillRect(-750, 300, 1500, 190); } },
    { bg: '#28344a', draw: x => { x.fillStyle = '#ecdfc2'; x.beginPath(); x.ellipse(0, 0, 560, 300, 0, 0, TAU); x.fill(); x.fillStyle = '#28344a'; x.beginPath(); x.ellipse(120, -170, 90, 50, .3, 0, TAU); x.fill(); } },
    { bg: '#7a4630', draw: x => { x.fillStyle = '#e8d9b8'; x.fillRect(-160, -330, 320, 80); x.fillStyle = '#2c2824'; x.font = '900 56px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('SALOON', 0, -288); x.fillStyle = '#2a1a10'; x.fillRect(-60, 80, 120, 220); } },
    { bg: '#34463a', draw: x => { x.fillStyle = '#d8b050'; x.font = '900 90px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('PAYROLL', 0, 0); x.strokeStyle = '#c8a040'; x.lineWidth = 6; x.strokeRect(-560, -300, 1120, 600); } },
    { bg: '#e6cf9f', draw: x => { x.strokeStyle = '#3a2818'; x.lineWidth = 3; for (let r = 0; r < 12; r++) { x.beginPath(); x.moveTo(-500, -380 + r * 40); x.lineTo(500, -380 + r * 40); x.stroke(); } x.fillStyle = '#3a2818'; x.font = '900 150px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('XVIII', 0, 200); } }];
  LAYERS.forEach((l, i) => { l.t = .15 + i * .55; l.side = i % 2 ? 1 : -1; });
  function sheet(x, l, t) {
    const u = easeIn(clamp((t - l.t) / .7), 1.6); if (u >= 1) return;
    const [cx, cy, w, h] = PAGE, px = cx + l.side * w / 2, py = cy - h / 2;
    x.save(); x.translate(px + l.side * 900 * u, py - 700 * u * u); x.rotate(l.side * 1.3 * u); x.translate(-px, -py);
    x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(cx - w / 2 + 12, cy - h / 2 + 16, w, h);
    x.fillStyle = l.bg; x.fillRect(cx - w / 2, cy - h / 2, w, h); x.save(); x.translate(cx, cy); x.beginPath(); x.rect(-w / 2, -h / 2, w, h); x.clip(); l.draw(x); x.restore();
    if (u > 0) { x.fillStyle = 'rgba(255,255,255,.15)'; polyPath(x, [[px, py], [px - l.side * 260 * u, py], [px, py + 260 * u]]); x.fill(); }
    x.restore();
  }
  const BC = [960, 560];
  const blotR = t => {
    const inU = back((t - K.put + .1) / .4) * 110, shrink = easeIO(clamp((t - K.disappear + .7) / 1.1)), spring = back((t - K.almost + .15) / .45);
    return lerp(inU, 22, shrink) + (spring > 0 ? (180 - 22) * spring : 0);
  };
  function blot(x, t, tp) {
    const r = blotR(t); if (r <= 0) return;
    x.fillStyle = INK; x.beginPath();
    for (let k = 0; k <= 36; k++) { const a = k / 36 * TAU, rr = r * (1 + .16 * noise1(k * .7, 3) + .06 * Math.sin(a * 5 + tp)); x.lineTo(BC[0] + rr * Math.cos(a), BC[1] + rr * Math.sin(a)); } x.fill();
    const g = rng(9); for (let k = 0; k < 7; k++) { const a = g() * TAU, d = r * (1.2 + .5 * g()); x.beginPath(); x.arc(BC[0] + d * Math.cos(a), BC[1] + d * Math.sin(a), r * (.05 + .07 * g()), 0, TAU); x.fill(); }
  }
  function tag(x, t, tp) {
    const u = back((t - K.price + .1) / .35); if (u <= 0) return; const fling = easeOut(clamp((t - K.almost) / .7)), r = blotR(t);
    const knot = [BC[0] + r * .7, BC[1] - r * .7], tp2 = [knot[0] + 90 + 500 * fling, knot[1] + 50 - 300 * fling + 700 * fling * fling];
    x.strokeStyle = '#8a2a22'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(knot[0], knot[1]); x.lineTo(tp2[0] - 20, tp2[1]); x.stroke();
    x.save(); x.translate(tp2[0], tp2[1]); x.rotate(.3 + 4 * fling); x.scale(u, u); x.fillStyle = '#e9d7a8'; polyPath(x, [[-24, 0], [-8, -26], [110, -26], [110, 26], [-8, 26]]); x.fill();
    x.fillStyle = '#2c2824'; x.font = '900 36px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('$$$', 52, 2); x.restore();
  }
  function plannersRing(x, t) {
    const a = smooth((t - K.disappear + 1.1) / .4) * (1 - smooth((t - K.almost + .1) / .3)); if (a <= 0) return;
    x.save(); x.globalAlpha = a; x.setLineDash([10, 9]); x.lineDashOffset = 0; x.strokeStyle = '#5a5048'; x.lineWidth = 4; x.lineCap = 'butt'; x.beginPath(); x.arc(BC[0], BC[1], 34, 0, TAU); x.stroke();
    x.setLineDash([]); x.restore();
  }
  function snake(x, t, tp) {
    const u = easeOut(clamp((t - K.almost) / 1.1)); if (u <= 0) return;
    const pts = []; for (let k = 0; k <= 30; k++) { const s = k / 30 * u, a = -1.2 + 2.6 * s + .25 * Math.sin(tp * 2 + s * 6); pts.push([BC[0] + 150 + 340 * s * Math.cos(a) * (1 - .3 * s), BC[1] - 30 - 440 * s + 70 * Math.sin(a * 1.4)]); }
    x.strokeStyle = INK; x.lineCap = 'round'; x.lineJoin = 'round';
    for (let k = 1; k < pts.length; k++) { x.lineWidth = 84 - 50 * k / 30; x.beginPath(); x.moveTo(pts[k - 1][0], pts[k - 1][1]); x.lineTo(pts[k][0], pts[k][1]); x.stroke(); }
    const hd = pts[pts.length - 1], hood = smooth((u - .7) / .3);
    if (hood > 0) { x.fillStyle = INK; x.beginPath(); x.ellipse(hd[0], hd[1] - 14, 36 + 52 * hood, 50 + 24 * hood, 0, 0, TAU); x.fill(); x.fillStyle = '#e8d8b0'; for (const s of [-1, 1]) { x.beginPath(); x.arc(hd[0] + s * 12, hd[1] - 30, 5 * hood, 0, TAU); x.fill(); } }
  }
  const camera = t => ({ x: 960, y: M45 ? 560 : 540, z: (M45 ? .72 : 1.0) * (1 + .08 * smooth((t - K.put) / 3) - .05 * smooth((t - K.almost) / .8)) });
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => {
      const [cx, cy, w, h] = PAGE; x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(cx - w / 2 + 12, cy - h / 2 + 16, w, h); x.fillStyle = '#f4ecd8'; x.fillRect(cx - w / 2, cy - h / 2, w, h);
      plannersRing(x, t); blot(x, t, tp); snake(x, t, tp); tag(x, t, tp);
      for (let i = LAYERS.length - 1; i >= 0; i--) sheet(x, LAYERS[i], t);
    }, { paperShadow: [6, 9, 6, .35] });
    const a = smooth((t - K.almost + .05) / .3); if (a > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.font = `900 ${M45 ? 58 : 64}px NSC`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#2c2824'; ctx.fillText('It almost never does.', W / 2, M45 ? H - 230 : H - 100); ctx.restore(); }
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.simple, K.put, K.price, K.disappear, K.almost],
  });
})();
