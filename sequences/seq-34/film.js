(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-34', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const LP = FILM.look('paper', W, H), LB = FILM.look('lightbox', W, H), P = LP.P, B = LB.P, pose = LP.pose;
  const S11 = FILM.getScene('seq-11').api, T11 = S11.K.take - .3;
  const K = { reformers: 0.501, mistake: 2.002, start: 3.036, problem: 4.838, alcohol: 5.506,
    not: 7.04, desire: 8.909, cannot: 10.31, erases: 11.578, desire2: 12.179,
    all: 13.18, profit: 15.115, legal: 16.183, taxed: 17.117, regulated: 17.784, open: 18.952,
    illegal: 20.22, shadows: 21.588, men: 22.222, guns: 22.656, prohibition: 23.757, neither: 25.259,
    actually: 26.426, second: 27.361 };
  const INK = P.ink, AMB = P.amber, back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const stroke = (x, pts, wd, col) => { x.strokeStyle = col; x.lineWidth = wd; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); };
  const plen = pts => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  const upto = (pts, u) => { const d = plen(pts) * u, out = [pts[0]]; let s = 0; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (s + l >= d) { out.push([lerp(a[0], b[0], (d - s) / l), lerp(a[1], b[1], (d - s) / l)]); return out; } out.push(b); s += l; } return out; };

  const BOTC = [S11.BOT[0], S11.BOT[1] - S11.BH / 2], GLOW = [960, 170];
  const MAG = [[0, [590, 770]], [1.2, [700, 780]], [2.2, [1330, 770]], [K.start + .2, [960, 390]], [K.not + .8, [960, 390]], [K.not + 1.4, [1700, -200]]];
  const magAt = t => keyed(t, MAG.map(([a, p]) => [a, p]));
  function magnifier(x, t) {
    if (t > K.not + 1.4) return; const [mx, my] = magAt(t);
    x.save(); x.translate(mx, my); x.fillStyle = 'rgba(230,240,245,.18)'; x.beginPath(); x.arc(0, 0, 118, 0, TAU); x.fill();
    x.strokeStyle = '#8a6a3a'; x.lineWidth = 16; x.beginPath(); x.arc(0, 0, 118, 0, TAU); x.stroke();
    x.strokeStyle = '#5a3a22'; x.lineWidth = 26; x.lineCap = 'round'; x.beginPath(); x.moveTo(84, 84); x.lineTo(210, 210); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(-44, -52, 26, 12, -.7, 0, TAU); x.fill(); x.restore();
  }
  function problem(x, t) {
    const wr = clamp((t - K.problem + .1) / .45), fall = easeIO(clamp((t - K.not - .05) / .7)), ring = clamp((t - K.alcohol + .05) / .45), strike = clamp((t - K.not + .05) / .25);
    if (wr > 0) {
      x.save(); x.translate(1210, 300 + 700 * fall * fall); x.rotate(.5 * fall); x.globalAlpha = 1 - smooth((fall - .7) / .3);
      x.beginPath(); x.rect(-10, -40, 250 * wr, 80); x.clip(); x.fillStyle = INK; x.font = '900 52px NSC'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('PROBLEM', 0, 0);
      x.restore();
      if (fall < .05) stroke(x, upto([[1200, 320], [1090, 360]], wr), 5, INK);
    }
    if (ring > 0) { x.strokeStyle = INK; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.ellipse(BOTC[0], BOTC[1], 110, 150, -.08, -Math.PI / 2, -Math.PI / 2 + TAU * ring); x.stroke(); }
    if (strike > 0) stroke(x, upto([[BOTC[0] - 130, BOTC[1] + 150], [BOTC[0] + 130, BOTC[1] - 150]], strike), 8, INK);
  }
  const glowOn = t => smooth((t - K.desire + .15) / .5);
  const ERASE = [K.cannot - .1, K.desire2 + .25];
  const dodge = t => { const u = clamp((t - ERASE[0] - .6) / (ERASE[1] - ERASE[0] - .6)); return u > 0 && u < 1 ? -90 * Math.sin(u * TAU * 2.5) : 0; };
  function glow(x, t, tp) {
    const g = glowOn(t); if (g <= 0) return; const gx = GLOW[0] + dodge(t), gy = GLOW[1], d = clamp((t - K.all - .1) / .7), s = g * (1 - .7 * d);
    x.save(); x.translate(gx, gy); x.scale(1.45, 1.45); x.translate(-gx, -gy);
    for (const [r, a] of [[150, .18], [100, .3], [60, .55]]) { const gr = x.createRadialGradient(gx, gy, 0, gx, gy, r * s * (1 + .06 * Math.sin(tp * 3))); gr.addColorStop(0, FILM.rgba(FILM.hex(AMB), a)); gr.addColorStop(1, FILM.rgba(FILM.hex(AMB), 0)); x.fillStyle = gr; x.beginPath(); x.arc(gx, gy, r * s * 1.1, 0, TAU); x.fill(); }
    x.fillStyle = FILM.rgba(FILM.hex('#ffd78a'), .9 * s); x.beginPath();
    for (let k = 0; k <= 24; k++) { const q = k / 24 * TAU, rr = (40 + 10 * Math.sin(q * 3 + tp * 4)) * s; x.lineTo(gx + rr * Math.cos(q), gy + rr * Math.sin(q) * 1.25 - 8 * s); } x.fill(); x.restore();
    const lab = smooth((t - K.desire + .05) / .3) * (1 - smooth((t - K.all) / .4));
    if (lab > 0) { x.globalAlpha = lab; x.fillStyle = INK; x.font = 'italic 900 48px NSC'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('desire', GLOW[0] + 200, GLOW[1] - 10); x.globalAlpha = 1; }
  }
  function eraser(x, t) {
    if (t < ERASE[0] || t > ERASE[1] + .7) return;
    const inU = easeOut(clamp((t - ERASE[0]) / .6)), outU = easeIO(clamp((t - ERASE[1]) / .6)), scrub = t > ERASE[0] + .6 && t < ERASE[1] ? 80 * Math.sin((t - ERASE[0]) * 15) : 0;
    x.save(); x.translate(lerp(1700, GLOW[0] + 20, inU) + 800 * outU + scrub, lerp(-150, GLOW[1] + 10, inU) - 300 * outU); x.rotate(-.35); PR.eraser(x, P, 230); x.restore();
  }
  const J = [960, 1260], TRUNK = [[960, 230], [960, J[1]]], LBR = [J, [880, 1320], [520, 1320], [520, 1600]], RBR = [J, [1040, 1320], [1400, 1320], [1400, 1640]];
  const VL = [760, 1320], VR = [1160, 1320];
  const flowT = t => clamp((t - K.all - .1) / 2.1), flowL = t => clamp((t - K.legal + .75) / .9), flowR = t => clamp((t - K.illegal + .55) / .8);
  const shutL = t => easeIO(clamp((t - K.prohibition - .45) / .5)), shutR = t => easeIO(clamp((t - K.prohibition - 1.15) / .5));
  const burst = t => clamp((t - K.actually - .2) / .5), bulge = t => smooth((t - K.prohibition - 1.4) / .8) * (1 - smooth((t - K.actually - .15) / .3));
  function pipe(x, pts, u, flow, tp, laid = 1) {
    if (laid <= 0) return; const lp = upto(pts, laid); stroke(x, lp, 30, INK); stroke(x, lp, 20, '#e6d9bb');
    if (u > 0) { const q = upto(pts, u); stroke(x, q, 12, AMB); if (flow > 0) { x.save(); x.setLineDash([12, 20]); x.lineDashOffset = -tp * 160; x.globalAlpha = flow; stroke(x, q, 5, '#f6cf7e'); x.restore(); } }
  }
  function valve(x, p, shut, gone, tp) {
    if (gone >= 1) return; const fly = gone > 0 ? gone : 0;
    x.save(); x.translate(p[0] + 260 * fly, p[1] - 44 - 420 * fly + 600 * fly * fly); x.rotate(shut * Math.PI / 2 + fly * 9);
    x.strokeStyle = '#8a3a2a'; x.lineWidth = 9; x.beginPath(); x.arc(0, 0, 34, 0, TAU); x.stroke();
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(34 * Math.cos(a), 34 * Math.sin(a)); x.stroke(); }
    x.restore();
    if (fly <= 0) { x.fillStyle = '#6a5a48'; x.fillRect(p[0] - 5, p[1] - 44, 10, 30); }
  }
  function plumbing(x, t, tp) {
    const tr = flowT(t), sl = shutL(t), sr = shutR(t), b = burst(t), bg = bulge(t);
    const laidT = clamp((t - K.all + .15) / 1.9), laidB = clamp((t - K.all - 1.5) / .7);
    pipe(x, TRUNK, tr, 1 - smooth((t - K.prohibition - .5) / .6) + b, tp, laidT);
    pipe(x, LBR, flowL(t), 1 - sl, tp, laidB); pipe(x, RBR, flowR(t), (1 - sr) + b, tp, laidB);
    if (laidB <= 0) return;
    if (bg > 0) { const r = 18 + 30 * bg * (1 + .12 * Math.sin(tp * 14)); x.fillStyle = INK; x.beginPath(); x.arc(J[0], J[1], r + 5, 0, TAU); x.fill(); x.fillStyle = AMB; x.beginPath(); x.arc(J[0], J[1], r, 0, TAU); x.fill(); }
    valve(x, VL, sl, 0, tp); valve(x, VR, sr, b, tp);
    if (b > 0 && b < 1) for (let k = 0; k < 10; k++) { const a = -.6 + k * .14, d = 40 + 260 * b; x.fillStyle = FILM.rgba(FILM.hex(AMB), 1 - b); x.beginPath(); x.arc(VR[0] + d * Math.cos(a), VR[1] - 30 + d * Math.sin(a) - 80 * b, 10 * (1 - b) + 3, 0, TAU); x.fill(); }
  }
  function lawHand(x, t) {
    const inU = easeOut(clamp((t - K.prohibition + .1) / .5)), outU = easeIO(clamp((t - K.actually - .4) / .6)); if (inU <= 0 || outU >= 1) return;
    const mv = easeIO(clamp((t - K.prohibition - .95) / .2)), shut = mv < .5 ? shutL(t) : shutR(t), wheel = [lerp(VL[0], VR[0], mv), VL[1] - 44];
    const th = -Math.PI / 2 - .45 + shut * Math.PI / 2, rim = [wheel[0] + 34 * Math.cos(th), wheel[1] + 34 * Math.sin(th)];
    const h = [lerp(1250, rim[0], inU) + 700 * outU, lerp(600, rim[1], inU) - 900 * outU], turn = -Math.PI / 2 + shut * Math.PI / 2;
    const o = { h, side: 1, r: 10, grip: 1, skin: P.skin, s: .8, arm: -Math.PI / 2, style: 'fingers' }, w = FILM.hand.wristAt(o, turn);
    FILM.hand.arm(x, w, [w.p[0], h[1] - 1400], { sleeve: '#35516b', cuff: '#f5ecd8', link: '#c8a040', cuffAt: 40, taper: 1.15 });
    FILM.hand.turned(x, o, turn, o2 => { FILM.hand.back(x, o2); FILM.hand.front(x, o2); });
  }

  const TOP = 1290, GROUND = 2000;
  function dayWorld(x, t, tp) {
    x.fillStyle = '#cfe0e0'; x.fillRect(-800, TOP, 1760, GROUND - TOP); x.fillStyle = P.sheet2 || '#87a39c'; x.fillRect(-800, GROUND, 1760, 1200);
    x.fillStyle = '#b9ccc6'; for (const [bx, bw, bh] of [[-300, 260, 420], [40, 200, 360], [820, 160, 300]]) x.fillRect(bx, GROUND - bh, bw, bh);
    x.fillStyle = '#e8d8b8'; x.fillRect(300, 1600, 480, GROUND - 1600); x.fillStyle = '#d4c4a0'; x.fillRect(300, 1600, 480, 20);
    for (let k = 0; k < 6; k++) { x.fillStyle = k % 2 ? '#f4ecd8' : '#5f8a6a'; x.fillRect(300 + k * 80, 1700, 80, 44); }
    x.fillStyle = INK; x.font = '900 40px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('WINE & SPIRITS', 540, 1655);
    x.fillStyle = '#a8cbe0'; x.fillRect(330, 1770, 220, 170); for (let k = 0; k < 5; k++) { x.save(); x.translate(360 + k * 42, 1920); PR.bottle(x, P, 70); x.restore(); }
    const op = easeIO(clamp((t - K.open + .1) / .5)); x.fillStyle = '#4a3528'; x.fillRect(600, 1770, 140, GROUND - 1770); x.fillStyle = '#2a1c14'; x.fillRect(600, 1770, 140 * (1 - .75 * op), GROUND - 1770);
    const st = back((t - K.taxed + .05) / .3); if (st > 0) { x.save(); x.translate(670, 1820); x.rotate(-.12); x.scale(st, st); x.strokeStyle = '#2c4a8a'; x.lineWidth = 4; x.strokeRect(-56, -30, 112, 60); x.fillStyle = '#2c4a8a'; x.font = '900 20px NSC'; x.fillText('TAX PAID', 0, -6); x.font = '700 13px NSC'; x.fillText('U.S. INTERNAL REVENUE', 0, 16); x.restore(); }
    const lic = back((t - K.regulated) / .3); if (lic > 0) { x.save(); x.translate(440, 1760); x.scale(lic, lic); x.fillStyle = P.card; x.fillRect(-60, -18, 120, 36); x.fillStyle = INK; x.font = '900 18px NSC'; x.fillText('LICENSED', 0, 1); x.restore(); }
    for (const [k, px0] of [[0, -200], [1, 1000]]) {
      const u = clamp((tp - K.open + .6 - k * .3) / 2.2), px = lerp(px0, 680 + k * 40, easeOut(u)), bob = u > 0 && u < 1 ? Math.abs(Math.sin(tp * 10 + k)) * 3 : 0;
      if (u > 0) { x.save(); x.translate(px, GROUND - bob); x.scale((k ? -1 : 1) * 2.1, 2.1); PR.person(x, P, { kind: k ? 'woman' : 'man', hat: k ? 'none' : 'bowler', coat: k ? P.coat2 : P.coat }); x.restore(); }
    }
  }
  function nightWorld(x, t, tp) {
    const on = smooth((t - K.illegal + .6) / .6), flood = smooth((t - K.actually - .3) / 1.2);
    x.lineCap = 'butt'; x.lineJoin = 'miter'; x.setLineDash([]); x.lineDashOffset = 0;
    x.fillStyle = '#0c0a24'; x.fillRect(960, TOP, 1400, 1900); x.fillStyle = '#1c1a44'; x.fillRect(960, TOP + 120, 1400, GROUND - TOP - 120);
    x.fillStyle = 'rgba(46,42,110,.6)'; for (let y = TOP + 140; y < GROUND; y += 40) for (let bx = 960 + ((y / 40) % 2) * 40; bx < 2360; bx += 80) x.fillRect(bx, y, 76, 36);
    x.fillStyle = '#141232'; x.fillRect(960, GROUND, 1400, 1200);
    x.fillStyle = '#3e2c3c'; x.fillRect(1330, 1720, 140, GROUND - 1720); x.fillStyle = FILM.rgba(FILM.hex('#ffcf80'), .9 * on); x.fillRect(1372, 1770, 56, 14);
    x.fillStyle = '#0a0a18'; x.fillRect(1395, 1640, 10, 80);
    for (const [k, gx] of [[0, 1230], [1, 1560]]) {
      const u = smooth((tp - K.men + .3 - k * .15) / .5); if (u <= 0) continue;
      x.save(); x.translate(gx + (k ? 40 : -40) * (1 - u), GROUND); x.scale((k ? -1 : 1) * 2.2, 2.2); x.globalAlpha = u;
      PR.person(x, B, { kind: 'man', hat: 'wide', hatColor: '#06060f', dark: .95, arm: .15 });
      x.fillStyle = '#06060f'; x.fillRect(4, -58, 30, 6); x.beginPath(); x.arc(14, -50, 5, 0, TAU); x.fill(); x.fillRect(-2, -56, 10, 10);
      x.restore();
    }
    if (flood > 0) { x.fillStyle = FILM.rgba(FILM.hex(B.amber), .35 * flood); x.fillRect(960, 1600, 1400, 1600); }
  }

  const KEYS16 = [[0, [590, 780, 2.0]], [1.2, [760, 780, 1.9]], [2.2, [1200, 780, 1.9]], [K.start + .25, [960, 420, 1.7]], [K.alcohol + .5, [990, 380, 1.6]], [K.not + .9, [990, 380, 1.6]],
    [K.desire + .2, [960, 300, 1.5]], [K.desire2 + .6, [960, 300, 1.5]], [K.all + .3, [960, 340, 1.4]], [K.legal - .3, [960, 1680, 1.0]], [K.illegal - .6, [960, 1690, 1.0]], [K.prohibition - .3, [960, 1580, 1.0]], [DUR, [980, 1600, 1.03]]];
  const KEYS = KEYS16.map(([t, v]) => [t, M45 ? [v[0], v[1] > 1500 ? v[1] + 160 : v[1], Math.log(v[2] * (v[1] > 1500 ? .74 : .66))] : [v[0], v[1], Math.log(v[2])]]);
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  const planVeil = t => .55 * smooth((t - K.all + .2) / .6);
  function paperWorld(x, t, tp) {
    x.lineCap = 'butt'; x.lineJoin = 'miter'; x.setLineDash([]); x.lineDashOffset = 0;
    x.fillStyle = P.sheet2 || '#87a39c'; x.fillRect(-1600, 1040, 4800, 300);
    S11.sheet(x); S11.pipes(x, T11); S11.cards(x, T11, T11);
    x.save(); x.translate(S11.BOT[0], S11.BOT[1]); PR.bottle(x, P, S11.BH); x.restore();
    const v = planVeil(t); if (v > 0) { x.fillStyle = `rgba(236,223,194,${v})`; x.fillRect(...S11.SHEET); }
    problem(x, t); glow(x, t, tp); eraser(x, t);
    dayWorld(x, t, tp);
    plumbing(x, t, tp); lawHand(x, t); magnifier(x, t);
  }
  const [C1, c1] = FILM.canvas(W, H);
  function label(ctx, t, text, t0, pos, col) {
    const u = back((t - t0) / .3); if (u <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(pos[0], pos[1]); ctx.scale(u, u); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 64 : 72}px NSC`;
    ctx.fillStyle = col; ctx.fillText(text, 0, 0); ctx.restore();
  }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t), toS = (wx, wy) => [(wx - cam.x) * cam.z + W / 2, (wy - cam.y) * cam.z + H / 2];
    LP.background(ctx);
    LP.sheet(ctx, cam, 1, R, x => paperWorld(x, t, tp), { paperShadow: [5, 7, 5, .3] });
    const [sx, sy] = toS(960, TOP);
    if (sy < H) {
      c1.setTransform(1, 0, 0, 1, 0, 0); c1.globalAlpha = 1; c1.globalCompositeOperation = 'source-over'; c1.filter = 'none'; c1.clearRect(0, 0, W, H);
      LB.background(c1); LB.sheet(c1, cam, 1, R, x => { nightWorld(x, t, tp); plumbing(x, t, tp); lawHand(x, t); }, { glow: .35, glowBlur: 12 });
      FILM.sheet(c1, cam, 1, W, H, R);
      const on = smooth((t - K.illegal + .6) / .6), flood = smooth((t - K.actually - .3) / 1.2);
      PR.glow(c1, 1400, 1777, 120, '#ffcf80', .5 * on, 'lightbox'); PR.glow(c1, 1400, 1640, 180, '#ffcf80', .35 * on, 'lightbox'); if (flood > 0) PR.glow(c1, 1400, 1700, 900, B.amber, .6 * flood, 'lightbox');
      c1.setTransform(1, 0, 0, 1, 0, 0);
      ctx.save(); ctx.beginPath(); ctx.rect(Math.max(0, sx), Math.max(0, sy), W, H); ctx.clip(); ctx.drawImage(C1, 0, 0); ctx.restore();
      ctx.fillStyle = INK; ctx.fillRect(sx - 2, Math.max(0, sy), 4, H);
    }
    const [lx, ly] = toS(540, 1460), [rx, ry] = toS(1400, 1460);
    label(ctx, t, 'legal', K.legal, [lx, ly], INK); label(ctx, t, 'illegal', K.illegal, [rx, ry], '#ff4a3d');
    LP.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.problem, K.not, K.desire, K.all, K.legal, K.illegal, K.neither, K.second],
  });
})();
