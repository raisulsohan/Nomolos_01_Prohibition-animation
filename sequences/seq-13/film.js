(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, cutPoly, polyPath, rng, noise1 } = FILM, PR = FILM.props;
  const ID = 'seq-13', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { eighteenth: 0.2, took: 1.034, effect: 1.234, law: 2.402, volstead: 2.936,
    act: 3.437, spelled: 3.67, rules: 4.237 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const INK = '#3a2818';

  const SHEET = cutPoly([[150, 34], [1774, 46], [1790, 1400], [134, 1390]], 10, 2.6, 9);
  const HAND = (() => {
    const r = rng(41), lines = [];
    for (let c = 0; c < 3; c++) for (let i = 0; i < 12; i++) { const x0 = 230 + c * 500 + r() * 20, x1 = x0 + 400 + r() * 50 - (i === 11 ? 180 : 0), y = 270 + i * 26; lines.push({ x0, x1, y, seed: c * 50 + i, amp: 3 + r() * 2.5 }); }
    return lines;
  })();
  function handLine(x, l) { x.beginPath(); for (let px = l.x0; px <= l.x1; px += 3) { const u = (px - l.x0) / 9, y = l.y + Math.sin(u * 2.1) * l.amp * .7 + noise1(u * .9, l.seed) * l.amp; px === l.x0 ? x.moveTo(px, y) : x.lineTo(px, y); } x.stroke(); }
  function heading(x) { x.beginPath(); for (let u = 0; u <= 52; u += .05) { const px = 300 + u * 17 - 21 * Math.sin(u), py = 172 - 30 * Math.cos(u) * (.7 + .3 * noise1(u * .4, 3)) + noise1(u * .7, 8) * 5; u === 0 ? x.moveTo(px, py) : x.lineTo(px, py); } x.stroke(); }
  const Y0 = 628, Y1 = 778;
  const XVIII = [[[742, Y0], [846, Y1]], [[846, Y0], [742, Y1]], [[884, Y0], [934, Y1]], [[934, Y1], [984, Y0]], [[1026, Y0], [1026, Y1]], [[1070, Y0], [1070, Y1]], [[1114, Y0], [1114, Y1]]];
  function parchment(x) {
    polyPath(x, SHEET); x.fillStyle = P.parchment; x.fill();
    x.save(); polyPath(x, SHEET); x.clip();
    const g = x.createRadialGradient(960, 620, 380, 960, 700, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(120,80,30,.45)'); x.fillStyle = g; x.fillRect(0, 0, W, 1500);
    x.restore();
    x.strokeStyle = INK; x.lineCap = 'round'; x.lineJoin = 'round';
    x.globalAlpha = .8; x.lineWidth = 7; heading(x);
    x.globalAlpha = .62; x.lineWidth = 2.6; for (const l of HAND) handLine(x, l);
    x.globalAlpha = 1; x.lineWidth = 17;
    for (const [a, b] of XVIII) { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
    x.lineWidth = 8;
    for (const [a, b] of XVIII) for (const p of [a, b]) { if ((p[1] !== Y0 && p[1] !== Y1) || (p[0] === 934 && p[1] === Y1)) continue; x.beginPath(); x.moveTo(p[0] - 16, p[1]); x.lineTo(p[0] + 16, p[1]); x.stroke(); }
  }

  function label(x, tp) {
    const u = back((tp - K.eighteenth - .05) / .25); if (u <= 0) return;
    x.save(); x.translate(928, 868); x.rotate(-.02); x.scale(u, u); x.font = '900 64px NSC';
    const w = x.measureText('18TH AMENDMENT').width + 48;
    x.fillStyle = '#efe4c8'; x.beginPath(); x.roundRect(-w / 2, -44, w, 88, 6); x.fill();
    x.fillStyle = P.ink; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('18TH AMENDMENT', 0, 3);
    x.restore();
  }
  const SEAL = [1345, 665], SEAL_T = K.effect;
  function seal(x, tp) {
    const u = clamp((tp - SEAL_T + .22) / .22); if (u <= 0) return;
    const s = lerp(1.6, 1, easeIn(u, 2)) * (1 + .06 * Math.exp(-Math.pow((tp - SEAL_T - .06) / .06, 2)));
    x.save(); x.translate(SEAL[0], SEAL[1]); x.scale(s, s); x.globalAlpha = clamp(u * 3);
    x.fillStyle = '#fbf7ee';
    x.beginPath(); x.moveTo(-18, 20); x.lineTo(-62, 150); x.lineTo(-40, 138); x.lineTo(-28, 162); x.lineTo(8, 30); x.fill();
    x.beginPath(); x.moveTo(18, 20); x.lineTo(58, 146); x.lineTo(36, 136); x.lineTo(22, 160); x.lineTo(-8, 30); x.fill();
    x.fillStyle = '#b8913a'; x.beginPath(); for (let k = 0; k < 48; k++) { const a = k / 48 * TAU, r = k % 2 ? 84 : 94; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill();
    x.fillStyle = '#d8b25a'; x.beginPath(); x.arc(0, 0, 72, 0, TAU); x.fill();
    x.strokeStyle = '#a07a2a'; x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 60, 0, TAU); x.stroke();
    x.fillStyle = '#a07a2a'; polyPath(x, [...Array(10).keys()].map(k => { const a = k / 10 * TAU - Math.PI / 2, r = k % 2 ? 18 : 40; return [Math.cos(a) * r, Math.sin(a) * r]; })); x.fill();
    x.restore();
  }

  const BK = { x: 960, y: 1000, w: 600, h: 320 }, NP = 6;
  const inAt = K.volstead - .25, foldAt = k => K.spelled + k * .12;
  function finePrint(x, k) {
    x.fillStyle = '#f3ead2'; x.fillRect(-BK.w / 2, 0, BK.w, BK.h); x.strokeStyle = 'rgba(58,40,24,.25)'; x.lineWidth = 2; x.strokeRect(-BK.w / 2 + 14, 14, BK.w - 28, BK.h - 28);
    x.fillStyle = INK; x.font = '900 30px NSC'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText(`SEC. ${k + 1}.`, -BK.w / 2 + 40, 50);
    const g = rng(60 + k); x.fillStyle = 'rgba(58,40,24,.55)';
    for (let r = 0; r < 12; r++) { let px = -BK.w / 2 + 40 + (r === 0 ? 110 : 0); const y = 50 + (r === 0 ? 0 : 20 + r * 19), end = BK.w / 2 - 40 - (r % 5 === 4 ? 180 : 0); while (px < end) { const w = 10 + g() * 34; x.fillRect(px, y - 2.5, Math.min(w, end - px), 5); px += w + 7; } }
  }
  function booklet(x, tp) {
    const s = easeOut(clamp((tp - inAt) / .35), 3); if (s <= 0) return;
    x.save(); x.translate(lerp(BK.x + 900, BK.x, s), BK.y); x.rotate(lerp(.12, -.015, s));
    for (let k = NP - 1; k >= 0; k--) {
      const f = easeOut(clamp((tp - foldAt(k)) / .22), 2); if (f <= 0) continue;
      x.save(); x.translate(0, BK.h / 2 + k * BK.h); x.scale(1, f); finePrint(x, k);
      x.fillStyle = `rgba(40,26,14,${.35 * (1 - f)})`; x.fillRect(-BK.w / 2, 0, BK.w, BK.h); x.restore();
    }
    x.fillStyle = '#4f5e4a'; x.fillRect(-BK.w / 2, -BK.h / 2, BK.w, BK.h); x.fillStyle = '#3e4b3a'; x.fillRect(-BK.w / 2, BK.h / 2 - 16, BK.w, 16);
    x.strokeStyle = '#c9a24a'; x.lineWidth = 3; x.strokeRect(-BK.w / 2 + 18, -BK.h / 2 + 18, BK.w - 36, BK.h - 52);
    x.fillStyle = '#f2e6cc'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '600 24px NS'; x.fillText('NATIONAL PROHIBITION ACT · 1919', 0, -BK.h / 2 + 62);
    x.font = '900 84px NSC'; x.fillText('VOLSTEAD ACT', 0, 14);
    x.restore();
  }

  const Z = M45 ? { a: 1.12, b: 1.02, c: .94 } : { a: 1.36, b: 1.08, c: .8 };
  const KEYS = [[0, [935, 700, Math.log(Z.a)]], [K.effect + .3, [990, 710, Math.log(Z.a * 1.04)]], [K.volstead - .1, [960, 930, Math.log(Z.b)]],
    [K.rules + .55, [960, M45 ? 1290 : 1230, Math.log(Z.c)]], [DUR, [960, M45 ? 1295 : 1235, Math.log(Z.c * .99)]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => parchment(x), { rimAlpha: .3 });
    L.sheet(ctx, cam, 1, R, x => { label(x, tp); booklet(x, tp); }, { paperShadow: [6, 9, 6, .32] });
    const up = 1 - clamp((tp - SEAL_T + .22) / .22);
    L.sheet(ctx, cam, 1, R, x => seal(x, tp), { paperShadow: [6 + 26 * up, 9 + 30 * up, 6 + 8 * up, .34] });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.eighteenth, K.effect, K.volstead, K.spelled, K.rules],
  });
})();
