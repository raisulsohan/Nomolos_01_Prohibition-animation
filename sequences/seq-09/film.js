(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-09', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const LF = FILM.look('flat', W, H), LP = FILM.look('paper', W, H), PF = LF.P, PP = LP.P, pose = LP.pose;
  const K = { womans: 0.201, grew: 1.869, country: 4.572, these: 5.639, reformers: 6.14,
    tied: 7.608, bottle: 8.008, poverty: 8.442, abuse: 9.41, corruption: 10.477,
    and: 11.645, wrong: 12.279 };
  const hexA = (h, a) => FILM.rgba(FILM.hex(h), a);
  const back = u => { u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const M = FILM.usmap({ width: 1320, cx: 960, cy: 640 }), CLE = M.cities.cleveland;
  const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
  const TOWNS = (() => {
    const b = M.us.reduce((a, [x, y]) => [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)], [1e9, 1e9, -1e9, -1e9]), r = rng(31), out = [CLE, ...Object.values(M.cities)];
    while (out.length < 170) { const p = [lerp(b[0], b[2], r()), lerp(b[1], b[3], r())]; if (inside(p, M.us) && out.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > 40)) out.push(p); }
    const far = Math.max(...out.map(p => Math.hypot(p[0] - CLE[0], p[1] - CLE[1])));
    return out.map((p, i) => ({ p, t: K.womans + .3 + (K.country - .2 - K.womans - .3) * Math.pow(Math.hypot(p[0] - CLE[0], p[1] - CLE[1]) / far, .8) + (i ? .08 * r() : 0) }));
  })();
  function ribbon(x, s, ink) {
    x.save(); x.scale(s, s); x.fillStyle = '#fbf7ee'; x.strokeStyle = ink; x.lineWidth = 1.4 / s * s; x.lineJoin = 'round';
    const bow = [[[0, 0], [7, -4], [7, 4]], [[0, 0], [-7, -4], [-7, 4]], [[-1, 0], [-4.5, 11], [0, 8.5], [4.5, 11], [1, 0]]];
    for (const b of bow) { polyPath(x, b); x.fill(); if (ink) x.stroke(); }
    x.restore();
  }
  function map(x, tp) {
    x.fillStyle = PF.sheet2; polyPath(x, M.canada); x.fill(); polyPath(x, M.mexico); x.fill();
    x.fillStyle = PF.sheetShade; polyPath(x, M.us); x.fill();
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; for (const l of Object.values(M.lakes)) { polyPath(x, l); x.fill(); } x.globalCompositeOperation = 'source-over';
    for (const tw of TOWNS) { const u = back((tp - tw.t) / .2); if (u > 0) { x.save(); x.translate(tw.p[0], tw.p[1]); ribbon(x, 1.25 * u, PF.ink); x.restore(); } }
  }
  function title(ctx, t) {
    const a = smooth((t - K.womans + .1) / .3) * (1 - smooth((t - K.these) / .3)); if (a <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
    const cx = W / 2, cy = M45 ? 150 : 96, w = M45 ? 900 : 1180, h = M45 ? 150 : 96;
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 6, cy - h / 2 + 8, w, h, 8); ctx.fill();
    ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 8); ctx.fill();
    ctx.fillStyle = '#2c2824'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 52 : 58}px NSC`;
    if (M45) { ctx.fillText("WOMAN'S CHRISTIAN", cx, cy - 30); ctx.fillText('TEMPERANCE UNION', cx, cy + 30); } else ctx.fillText("WOMAN'S CHRISTIAN TEMPERANCE UNION", cx, cy + 2);
    ctx.restore();
  }
  const T_W = K.these + .55;
  function mapCam(t) {
    const u = clamp((t - K.these) / (T_W - K.these)), z = Math.exp(lerp(0, Math.log(90), easeIn(u, 2.2)));
    return { x: lerp(960, CLE[0], easeOut(u, 2)), y: lerp(560, CLE[1] + 3, easeOut(u, 2)), z: z * (M45 ? .7 : 1) };
  }

  const PS = 1.9;
  const GROUP = [[-300, '#6d5a4a', '#4a3a30', 'wide'], [-150, '#4d5b68', '#3a3a40', 'none'], [0, '#8a6044', '#4d5b68', 'none'], [150, '#5a4632', '#3e3a36', 'wide'], [300, '#3e4a5a', '#2e3440', 'none']];
  const BADGE = [2.5 * PS, -63 * PS];
  const BOARD = { x: 820, y: -250, w: 720, h: 470 };
  const CARDS = [
    { k: 'POVERTY', x: 820 - 245, y: -370, at: K.poverty }, { k: 'ABUSE', x: 820 + 245, y: -370, at: K.abuse }, { k: 'CORRUPTION', x: 820 + 30, y: -120, at: K.corruption }];
  const PIN0 = [BOARD.x - 40, BOARD.y - 30];
  function purse(x, tp) {
    x.fillStyle = '#7a5236'; x.beginPath(); x.moveTo(-36, 0); x.quadraticCurveTo(-42, 36, 0, 38); x.quadraticCurveTo(42, 36, 36, 0); x.closePath(); x.fill();
    x.fillStyle = '#2a1a10'; x.beginPath(); x.ellipse(0, 0, 32, 10, 0, Math.PI, TAU); x.fill();
    x.strokeStyle = '#c8a050'; x.lineWidth = 4; x.beginPath(); x.moveTo(-36, 0); x.lineTo(36, 0); x.moveTo(-34, -1); x.quadraticCurveTo(-26, -24, -8, -26); x.moveTo(34, -1); x.quadraticCurveTo(26, -24, 8, -26); x.stroke();
    x.fillStyle = '#c8a050'; x.beginPath(); x.arc(-8, -27, 5, 0, TAU); x.arc(8, -27, 5, 0, TAU); x.fill();
    const m = clamp((tp - K.poverty) / 1.2), f = Math.round(tp * 15) % 2;
    x.save(); x.translate(10 + 26 * m, -18 - 34 * m); x.fillStyle = '#8a8070'; x.beginPath(); x.ellipse(-5, 0, 6, f ? 4 : 2, -.4, 0, TAU); x.ellipse(5, 0, 6, f ? 4 : 2, .4, 0, TAU); x.fill(); x.fillStyle = '#4a4238'; x.fillRect(-1, -4, 2, 8); x.restore();
  }
  function hands(x) { x.fillStyle = '#e2b28c'; x.beginPath(); x.ellipse(-30, 6, 18, 11, .3, 0, TAU); x.ellipse(30, -4, 18, 11, -.3, 0, TAU); x.fill();
    x.fillStyle = '#e9e2d0'; x.fillRect(-62, 0, 20, 14); x.fillRect(42, -10, 20, 14); x.save(); x.rotate(-.15); x.fillStyle = '#7f9c68'; x.fillRect(-22, -12, 44, 20); x.fillStyle = '#6a8656'; x.fillRect(-16, -8, 32, 12); x.restore(); }
  function card(x, c, tp) {
    x.save(); x.translate(c.x, c.y); x.rotate(c.k === 'ABUSE' ? .04 : c.k === 'POVERTY' ? -.05 : .02);
    x.fillStyle = PP.card; x.fillRect(-100, -80, 200, 160); x.strokeStyle = PP.ink; x.lineWidth = 2; x.strokeRect(-92, -72, 184, 144);
    x.save(); x.translate(0, -12); if (c.k === 'POVERTY') purse(x, tp); else if (c.k === 'ABUSE') { x.scale(.95, .95); x.translate(0, 34); PR.house(x, PP, 1, 0); } else hands(x); x.restore();
    const lab = smooth((tp - c.at) / .2);
    if (lab > 0) { x.globalAlpha = lab; x.fillStyle = PP.ink; x.font = '900 26px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(c.k, 0, 52); x.globalAlpha = 1; }
    x.fillStyle = PP.red; x.beginPath(); x.arc(0, -66, 7, 0, TAU); x.fill();
    x.restore();
  }
  function board(x, tp) {
    const { x: bx, y: by, w, h } = BOARD; x.lineCap = 'round';
    x.fillStyle = '#4a2f1b'; x.fillRect(bx - 250, by + h / 2 - 10, 16, 290); x.fillRect(bx + 234, by + h / 2 - 10, 16, 290);
    x.fillStyle = '#5a3a22'; x.fillRect(bx - w / 2 - 16, by - h / 2 - 16, w + 32, h + 32); x.fillStyle = '#c49a6a'; x.fillRect(bx - w / 2, by - h / 2, w, h);
    x.fillStyle = 'rgba(90,60,30,.25)'; const r = rng(4); for (let k = 0; k < 160; k++) x.fillRect(bx - w / 2 + r() * w, by - h / 2 + r() * h, 3, 3);
    for (const c of CARDS) card(x, c, tp);
    x.save(); x.translate(PIN0[0], PIN0[1] + 80); x.scale(1.1, 1.1); PR.bottle(x, PP, 110); x.restore(); x.fillStyle = PP.red; x.beginPath(); x.arc(PIN0[0], PIN0[1], 8, 0, TAU); x.fill();
    const taut = easeOut(clamp((tp - K.wrong + .15) / .3));
    x.strokeStyle = PP.red; x.lineWidth = 3.5; x.lineCap = 'round';
    for (const c of CARDS) {
      const u = easeOut(clamp((tp - c.at + .1) / .35)); if (u <= 0) continue;
      const e = [c.x, c.y - 66], m = [(PIN0[0] + e[0]) / 2, (PIN0[1] + e[1]) / 2 + 60 * (1 - taut)];
      x.beginPath(); for (let k = 0; k <= 24; k++) { const s = k / 24 * u, q = [(1 - s) ** 2 * PIN0[0] + 2 * (1 - s) * s * m[0] + s * s * e[0], (1 - s) ** 2 * PIN0[1] + 2 * (1 - s) * s * m[1] + s * s * e[1]]; k ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); } x.stroke();
    }
  }
  function reformers(x, tp) {
    x.fillStyle = '#5f7d78'; x.fillRect(-2000, -1400, 4400, 1400); x.fillStyle = '#465e5a'; x.fillRect(-2000, 0, 4400, 800);
    for (const [px, coat, skirt, hat] of GROUP) { x.save(); x.translate(px, 0); x.scale(PS, PS); PR.person(x, PP, { kind: 'woman', coat, skirt, hat, hatColor: '#3a2e26', ribbon: true }); x.restore(); }
    board(x, tp);
  }
  function tag(ctx, t) {
    const a = smooth((t - K.reformers + .05) / .3) * (1 - smooth((t - K.tied - .45) / .3)); if (a <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; const cx = M45 ? W / 2 : W * .32, cy = H - (M45 ? 170 : 110), w = 420, h = 88;
    ctx.fillStyle = 'rgba(40,30,20,.25)'; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 6, cy - h / 2 + 8, w, h, 8); ctx.fill();
    ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 8); ctx.fill();
    ctx.fillStyle = '#2c2824'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 58px NSC'; ctx.fillText('REFORMERS', cx, cy + 2);
    ctx.restore();
  }
  const mz = M45 ? .62 : 1, lz = z => Math.log(z * mz);
  const PKEYS = [[T_W, [BADGE[0], BADGE[1], lz(45)]], [K.reformers + .75, [0, -170, lz(1.55)]], [K.tied + .2, [0, -170, lz(1.5)]], [K.poverty - .1, [820, -250, lz(1.75)]],
    [K.and + .1, [820, -250, lz(1.8)]], [K.wrong + .6, [440, -230, lz(1.1)]]];
  function paperCam(t) { const v = keyed(t, PKEYS, false, t < K.reformers + .75 ? u => easeOut(u, 3) : easeIO); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t);
    if (t < T_W) {
      const cam = mapCam(t);
      LF.background(ctx); LF.sheet(ctx, cam, 1, R, x => map(x, tp), {});
      title(ctx, t);
      const wh = smooth((t - T_W + .18) / .18); if (wh > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = hexA('#fbf7ee', wh); ctx.fillRect(0, 0, W, H); ctx.restore(); }
      LF.grade(ctx, t); return;
    }
    const cam = paperCam(t);
    LP.background(ctx); LP.sheet(ctx, cam, 1, R, x => reformers(x, tp), { paperShadow: [6, 8, 6, .35] });
    const wh = 1 - smooth((t - T_W) / .2); if (wh > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = hexA('#fbf7ee', wh); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    tag(ctx, t);
    LP.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.womans, T_W, K.poverty, K.abuse, K.corruption, K.wrong],
    api: { DUR, K, board, reformers, CARDS, BOARD, PIN0 },
  });
})();
