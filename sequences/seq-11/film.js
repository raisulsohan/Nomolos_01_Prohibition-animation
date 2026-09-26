(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng, hash } = FILM, PR = FILM.props;
  const ID = 'seq-11', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { simple: 0.7, paper: 1.868, noble: 2.969, take: 3.703, alcohol: 4.371,
    crime: 5.839, poverty: 6.74, violence: 7.908, flowed: 8.508, cut: 9.743, off: 10.077,
    supply: 10.343, society: 11.344, heals: 11.912, itself: 12.245 };
  const SHEET = [260, 60, 1400, 980];
  const BOT = [960, 452], BH = 200;
  const CX = [590, 960, 1330], CYC = 770, CS = 1.1;
  const LABELS = ['CRIME', 'POVERTY', 'VIOLENCE'];

  const SUP = [[960, 62], [960, 250]];
  const PATHS = [[[960, 452], [960, 540], [590, 540], [590, 648]], [[960, 452], [960, 540], [960, 648]], [[960, 452], [960, 540], [1330, 540], [1330, 648]]];
  const len = pts => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  function span(pts, a, b) {
    const Lt = len(pts), A = a * Lt, B = b * Lt, out = []; let s = 0;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], q = pts[i], d = Math.hypot(q[0] - p[0], q[1] - p[1]), at = u => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)];
      if (s + d >= A && s <= B) { if (!out.length) out.push(at(clamp((A - s) / d))); out.push(at(clamp((B - s) / d))); }
      s += d;
    }
    return out;
  }
  const stroke = (x, pts, w, col) => { if (pts.length < 2) return; x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'butt'; x.lineJoin = 'miter'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); };

  const rect = (cx, cy, w, h) => [[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2], [cx - w / 2, cy - h / 2]];
  const FR = CX.map(cx => rect(cx, CYC, 330, 242));
  const STROKES = [[SUP, .1, .42], [PATHS[0], .52, .95], [[[960, 540], [1330, 540], [1330, 648]], 1.0, 1.3], [[[960, 540], [960, 648]], 1.33, 1.43],
    [FR[0], 1.48, 1.78], [FR[1], 1.86, 2.16], [FR[2], 2.24, 2.54]];
  const WRITE = CX.map((cx, i) => [STROKES[4 + i][2] + .02, STROKES[4 + i][2] + .2]);
  const drawn = (t, i) => clamp((t - STROKES[i][1]) / (STROKES[i][2] - STROKES[i][1]));
  function pen(t) {
    for (let i = 0; i < STROKES.length; i++) {
      const [pts, a, b] = STROKES[i];
      if (t < a) { const prev = i ? STROKES[i - 1] : null, from = prev ? prev[0][prev[0].length - 1] : [1250, -120], t0 = prev ? prev[2] : 0, u = easeIO(clamp((t - t0) / (a - t0))); return { p: [lerp(from[0], pts[0][0], u), lerp(from[1], pts[0][1], u)], down: false }; }
      if (t <= b) { const s = span(pts, 0, smooth((t - a) / (b - a))); return { p: s[s.length - 1], down: true }; }
      const wr = i >= 4 ? WRITE[i - 4] : null;
      if (wr && t <= wr[1] + .02 && (i === STROKES.length - 1 || t < STROKES[i + 1][1])) { const u = clamp((t - wr[0]) / (wr[1] - wr[0])); return { p: [CX[i - 4] - 80 + 160 * u, 942], down: t >= wr[0] }; }
    }
    const last = [CX[2] + 80, 942], u = easeIn(clamp((t - WRITE[2][1] - .15) / .7), 1.5);
    return { p: [lerp(last[0], 1900, u), lerp(last[1], -300, u)], down: false };
  }

  const COWER = [[[-7, -66], [-14, -76], [-5, -84]], [[7, -66], [12, -78], [3, -85]]];
  function violence(x) {
    x.fillStyle = P.card; x.fillRect(-150, -110, 300, 220); x.strokeStyle = P.ink; x.lineWidth = 2.2; x.strokeRect(-141, -101, 282, 202);
    x.save(); x.beginPath(); x.rect(-140, -100, 280, 200); x.clip();
    x.fillStyle = '#4a5566'; x.fillRect(-140, -100, 280, 200); x.fillStyle = '#5b6168'; x.fillRect(-140, 70, 280, 40);
    x.fillStyle = '#7d7468'; x.fillRect(-100, -38, 200, 108); polyPath(x, [[-112, -36], [0, -92], [112, -36]]); x.fillStyle = '#5b5047'; x.fill();
    x.fillStyle = '#efc56e'; x.fillRect(-72, -22, 144, 84);
    x.save(); x.beginPath(); x.rect(-72, -22, 144, 84); x.clip();
    x.save(); x.translate(26, 84); x.scale(.95, .95); PR.person(x, P, { kind: 'man', hat: 'none', arm: 1, dark: 1 }); x.restore();
    x.save(); x.translate(-30, 84); x.rotate(-.12); x.scale(.72, .72); PR.person(x, P, { kind: 'woman', hat: 'none', arms: COWER, dark: 1 }); x.restore();
    x.restore();
    x.strokeStyle = 'rgba(90,62,30,.35)'; x.lineWidth = 1.5; for (let k = 1; k < 6; k++) { x.beginPath(); x.moveTo(-72, -22 + k * 14); x.lineTo(72, -22 + k * 14); x.stroke(); }
    x.fillStyle = '#5a3e2c'; x.fillRect(-76, -26, 152, 6);
    x.restore();
  }
  const veil = (x, a) => { if (a <= 0) return; x.globalAlpha = a; x.fillStyle = P.card; x.fillRect(-150, -110, 300, 220); x.globalAlpha = 1; x.strokeStyle = P.ink; x.lineWidth = 2.2; x.strokeRect(-141, -101, 282, 202); };
  const harm = (x, i) => i === 0 ? PR.promisePrison(x, P, 0) : i === 1 ? PR.promiseSlum(x, P, 0) : violence(x);
  const promise = (x, i, t, tp) => i === 0 ? PR.promisePrison(x, P, clamp((t - HEAL[0] - .35) / 1))
    : i === 1 ? PR.promiseSlum(x, P, 1) : PR.promiseHome(x, P, lerp(.35, 1, clamp((t - HEAL[2] - .15) / .75)), clamp((t - HEAL[2] - .5) / .4), tp);

  function sheet(x) {
    const [sx, sy, sw, sh] = SHEET;
    x.fillStyle = P.sheet; x.fillRect(sx, sy, sw, sh);
    x.strokeStyle = 'rgba(80,110,120,.1)'; x.lineWidth = 1.2;
    for (let gx = sx + 40; gx < sx + sw; gx += 40) { x.beginPath(); x.moveTo(gx, sy); x.lineTo(gx, sy + sh); x.stroke(); }
    for (let gy = sy + 40; gy < sy + sh; gy += 40) { x.beginPath(); x.moveTo(sx, gy); x.lineTo(sx + sw, gy); x.stroke(); }
    x.fillStyle = '#b8913a'; for (const [px, py] of [[sx + 26, sy + 26], [sx + sw - 26, sy + 26], [sx + 26, sy + sh - 26], [sx + sw - 26, sy + sh - 26]]) { x.beginPath(); x.arc(px, py, 9, 0, TAU); x.fill(); }
  }
  function pipes(x, t) {
    const sup = t < K.off ? SUP : [SUP[0], [960, CUT]];
    const inkOf = [[sup, drawn(t, 0)], [PATHS[0], drawn(t, 1)], [STROKES[2][0], drawn(t, 2)], [STROKES[3][0], drawn(t, 3)]];
    for (const [pts, u] of inkOf) stroke(x, span(pts, 0, u), 26, P.ink);
    for (const [pts, u] of inkOf) stroke(x, span(pts, 0, u), 17, '#e6d9bb');
    const tail = smooth((t - K.alcohol - .1) / .9);
    const runs = [[sup, 0, smooth((t - .2) / .35), t < K.off], ...PATHS.map((p, i) => [p, tail, smooth((t - [.72, 1.4, 1.2][i]) / [.45, .25, .4][i]), tail < 1])];
    for (const [pts, a, b] of runs) if (b > a) stroke(x, span(pts, a, b), 11, P.amber);
    x.setLineDash([12, 20]); x.lineDashOffset = -t * 140;
    for (const [pts, a, b, on] of runs) if (on && b > a) stroke(x, span(pts, a, b), 5, '#f6cf7e');
    x.setLineDash([]);
  }
  function cards(x, t, tp) {
    CX.forEach((cx, i) => {
      const fr = drawn(t, 4 + i); if (fr <= 0) return;
      const pic = smooth((t - STROKES[4 + i][2] + .05) / .2), gone = smooth((t - [K.crime, K.poverty, K.violence][i]) / .35), heal = clamp((t - HEAL[i]) / .55);
      x.save(); x.translate(cx, CYC); x.scale(CS, CS);
      if (pic > 0) { harm(x, i); veil(x, Math.max(1 - pic, gone)); }
      if (heal > 0) {
        const sx = lerp(-150, 150, easeOut(heal, 2));
        x.save(); x.beginPath(); x.rect(-150, -110, sx + 150, 220); x.clip(); promise(x, i, t, tp); x.restore();
        if (heal < 1) { x.fillStyle = 'rgba(255,248,225,.85)'; x.fillRect(sx - 3, -101, 6, 202); }
      }
      x.restore();
      stroke(x, span(FR[i], 0, fr), 3, P.ink);
      const wr = clamp((t - WRITE[i][0]) / (WRITE[i][1] - WRITE[i][0]));
      if (wr > 0) { x.save(); x.beginPath(); x.rect(cx - 150, 910, 300 * wr, 60); x.clip(); x.fillStyle = P.ink; x.font = '600 42px NS'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(LABELS[i], cx, 942); x.restore(); }
      const st = smooth((t - [K.crime, K.poverty, K.violence][i] - .05) / .3);
      if (st > 0) { x.font = '600 42px NS'; const hw = x.measureText(LABELS[i]).width / 2 + 12; stroke(x, [[cx - hw, 940], [cx - hw + 2 * hw * st, 938]], 6, P.ink); }
    });
  }
  function ribbon(x, t) {
    const u = easeOut(clamp((t - K.noble + .1) / .3), 2); if (u <= 0) return;
    x.save(); x.translate(640, 190); x.rotate(-.15);
    x.fillStyle = '#fbf7ee';
    polyPath(x, [[0, 0], [-44, -26], [-40, 22]]); x.fill(); polyPath(x, [[0, 0], [44, -26], [40, 22]]); x.fill();
    polyPath(x, [[-4, 0], [-26, 64], [-14, 56], [-6, 70], [6, 2]]); x.fill(); polyPath(x, [[4, 0], [24, 60], [12, 54], [4, 66], [-4, 2]]); x.fill();
    x.fillStyle = '#e6dfcf'; x.beginPath(); x.arc(0, 0, 9, 0, TAU); x.fill();
    x.fillStyle = '#b8913a'; x.beginPath(); x.arc(0, 0, 5, 0, TAU); x.fill();
    x.restore();
  }

  const HK = [[K.take - .1, [1420, 80], 0], [K.take + .3, [960, 392], 0], [K.take + .42, [960, 392], 0], [K.alcohol - .05, [960, 392], 1], [K.alcohol + .05, [960, 392], 1],
    [K.alcohol + .55, [1180, 170], 1], [K.alcohol + 1.05, [2100, -800], 1]];
  const ELBOW = [1700, -420], SLEEVE = { skin: P.skin, sleeve: '#4d5b68', cuff: '#f0e8d6' };
  const handAt = tp => { const v = keyed(tp, HK.map(([t, h, g]) => [t, [h[0], h[1], g]])); return { h: [v[0], v[1]], g: v[2] }; };
  const handOpts = (h, grip) => ({ h, side: 1, r: 42, grip, skin: SLEEVE.skin, s: 1, arm: Math.atan2(ELBOW[1] - h[1], ELBOW[0] - h[0]) });
  function arm(x, o) {
    const w = FILM.hand.wrist(o), dx = w.p[0] - ELBOW[0], dy = w.p[1] - ELBOW[1], n = Math.hypot(dx, dy), nx = -dy / n, ny = dx / n, hw = w.w / 2;
    x.fillStyle = SLEEVE.sleeve; polyPath(x, [[ELBOW[0] + nx * hw * 2.4, ELBOW[1] + ny * hw * 2.4], [w.p[0] + nx * hw * 1.2, w.p[1] + ny * hw * 1.2], [w.p[0] - nx * hw * 1.2, w.p[1] - ny * hw * 1.2], [ELBOW[0] - nx * hw * 2.4, ELBOW[1] - ny * hw * 2.4]]); x.fill();
    const c = [w.p[0] - dx / n * 30, w.p[1] - dy / n * 30];
    x.fillStyle = SLEEVE.cuff; polyPath(x, [[c[0] + nx * hw * 1.15, c[1] + ny * hw * 1.15], [c[0] + dx / n * 14 + nx * hw * 1.15, c[1] + dy / n * 14 + ny * hw * 1.15], [c[0] + dx / n * 14 - nx * hw * 1.15, c[1] + dy / n * 14 - ny * hw * 1.15], [c[0] - nx * hw * 1.15, c[1] - ny * hw * 1.15]]); x.fill();
  }
  const lifted = tp => tp > K.alcohol + .05;
  const DRIP = .7, DRIP0 = K.alcohol + .4, MOUTH = SUP[1];
  function blot(x, t, tp) {
    if (t < DRIP0) return;
    const r = 8 + 26 * smooth((Math.min(t, K.off) - DRIP0) / (K.off - DRIP0)), c = [MOUTH[0], MOUTH[1] + 14];
    x.globalAlpha = 1 - .7 * smooth((t - K.society) / 1);
    x.fillStyle = P.amber; polyPath(x, [...Array(16).keys()].map(k => { const a = k / 16 * TAU, rr = r * (.8 + .35 * hash(k, 17)); return [c[0] + Math.cos(a) * rr * 1.15, c[1] + Math.sin(a) * rr]; })); x.fill();
    x.fillStyle = 'rgba(168,102,31,.35)'; x.beginPath(); x.ellipse(c[0] + r * .15, c[1] + r * .2, r * .55, r * .4, 0, 0, TAU); x.fill();
    x.globalAlpha = 1;
    if (tp < K.off) { const u = ((tp - DRIP0) % DRIP) / DRIP; x.fillStyle = P.amber; x.beginPath(); x.ellipse(MOUTH[0], MOUTH[1] + 4 + 10 * u * u, 5 + 3 * u, 6 + 7 * u, 0, 0, TAU); x.fill(); }
  }

  const CUT = 150, SK = [[K.cut - .35, [1760, 120], .45], [K.cut + .15, [1045, CUT], .45], [K.off - .08, [1045, CUT], .5], [K.off, [1045, CUT], 0], [K.off + .25, [1050, CUT], 0], [K.off + .8, [1800, 80], .3]];
  function scissors(x, tp) {
    if (tp < SK[0][0] || tp > SK[SK.length - 1][0]) return;
    const v = keyed(tp, SK.map(([t, p, o]) => [t, [p[0], p[1], o]]));
    x.save(); x.translate(v[0], v[1]);
    for (const d of [-1, 1]) {
      x.save(); x.rotate(d * v[2] / 2);
      x.fillStyle = d < 0 ? '#9aa3ad' : '#b7bec6'; polyPath(x, [[0, -9], [-165, -2], [-170, 1], [0, 9]]); x.fill();
      x.strokeStyle = '#2f3136'; x.lineWidth = 11; x.beginPath(); x.moveTo(6, 0); x.lineTo(62, d * 20); x.stroke();
      x.beginPath(); x.ellipse(84, d * 30, 24, 17, d * .5, 0, TAU); x.stroke();
      x.restore();
    }
    x.fillStyle = '#6a6f78'; x.beginPath(); x.arc(0, 0, 7, 0, TAU); x.fill();
    x.restore();
  }
  function fallingPiece(x, t) {
    const f = (t - K.off) / .7; if (f <= 0 || f >= 1) return;
    x.save(); x.translate(960, lerp(CUT, MOUTH[1], .5) + 520 * f * f); x.rotate(.9 * f); x.translate(-960, -lerp(CUT, MOUTH[1], .5));
    stroke(x, [[960, CUT], MOUTH], 26, P.ink); stroke(x, [[960, CUT], MOUTH], 17, '#e6d9bb'); stroke(x, [[960, CUT], MOUTH], 11, P.amber);
    x.restore();
  }

  const HEAL = [K.society - .1, K.society + .15, K.society + .4];
  function flower(x, t) {
    const g = easeOut(clamp((t - K.society) / .75), 2); if (g <= 0) return;
    const top = [BOT[0], BOT[1] - 150 * g];
    x.strokeStyle = '#5f7f4a'; x.lineWidth = 7; x.beginPath(); x.moveTo(BOT[0], BOT[1] + 6); x.quadraticCurveTo(BOT[0] - 16, lerp(BOT[1], top[1], .5), top[0], top[1]); x.stroke();
    const lf = smooth((t - K.society - .3) / .3);
    for (const d of [-1, 1]) { x.save(); x.translate(BOT[0] - 6, BOT[1] - 60 * g + d * 6); x.rotate(d * -.6); x.scale(lf, lf); x.fillStyle = '#6f8f5a'; x.beginPath(); x.ellipse(d * 22, 0, 24, 9, 0, 0, TAU); x.fill(); x.restore(); }
    const b = back(clamp((t - K.heals + .05) / .35)); if (b <= 0) return;
    x.save(); x.translate(top[0], top[1]); x.scale(b, b);
    x.fillStyle = '#f3c264'; for (let k = 0; k < 7; k++) { x.save(); x.rotate(k / 7 * TAU); x.beginPath(); x.ellipse(0, -24, 11, 19, 0, 0, TAU); x.fill(); x.restore(); }
    x.fillStyle = '#8a603f'; x.beginPath(); x.arc(0, 0, 12, 0, TAU); x.fill();
    x.restore();
  }
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const lz = (z, wide) => Math.log(M45 ? (wide ? .94 * z : .8 * z) : z);
  const KEYS = [[0, [960, 230, lz(1.75)]], [.45, [960, 260, lz(1.7)]], [1.0, [900, 420, lz(1.45)]], [2.3, [960, 535, lz(1, 1)]], [3.6, [960, 540, lz(.99, 1)]],
    [K.take + .5, [960, 380, lz(1.45)]], [K.alcohol + .6, [960, 380, lz(1.45)]], [K.crime - .3, [960, 720, lz(1.2)]], [K.violence + .5, [975, 720, lz(1.22)]],
    [K.cut - .15, [960, 230, lz(1.65)]], [K.off + .3, [960, 220, lz(1.7)]], [K.society + .3, [960, 545, lz(1.02, 1)]], [12.6, [960, 540, lz(1, 1)]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t), warm = .1 * smooth((t - K.society) / 1.2);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => {
      sheet(x); blot(x, t, tp); pipes(x, t); cards(x, t, tp); flower(x, t);
      if (warm > 0) { x.fillStyle = `rgba(255,236,190,${warm})`; x.fillRect(...SHEET); }
    }, { paperShadow: [4, 6, 5, .3] });
    L.sheet(ctx, cam, 1, R, x => {
      ribbon(x, t);
      const q = pen(t); x.save(); x.translate(q.p[0], q.p[1] - (q.down ? 0 : 10)); x.rotate(.25); PR.quill(x, P, 300); x.restore();
      scissors(x, tp);
    }, { paperShadow: [6, 9, 6, .32] });
    const up = smooth((tp - K.alcohol - .05) / .45), hd = handAt(tp);
    L.sheet(ctx, cam, 1, R, x => {
      const o = handOpts(hd.h, hd.g), on = tp > HK[0][0] && tp < HK[HK.length - 1][0];
      if (on) { arm(x, o); FILM.hand.back(x, o); }
      const b = lifted(tp) ? [hd.h[0], hd.h[1] + 60] : BOT;
      if (tp < HK[HK.length - 1][0]) { x.save(); x.translate(b[0], b[1]); PR.bottle(x, P, BH); x.restore(); }
      if (on) FILM.hand.front(x, o);
      fallingPiece(x, t);
    }, { paperShadow: [6 + 22 * up, 9 + 28 * up, 6 + 8 * up, .32] });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.paper, K.noble, K.alcohol, K.crime, K.poverty, K.violence, K.off, K.heals],
    api: { DUR, K, sheet, pipes, cards, SHEET, BOT, BH, SUP, CX, CYC },
  });
})();
