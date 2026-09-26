(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, hash } = FILM, PR = FILM.props;
  const ID = 'seq-14', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S6 = FILM.getScene('seq-06').api, L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const HZ = S6.HZ, S0 = S6.drift(S6.DUR), BD3 = S6.BD[3];
  const K = { saloon: 0.234, doors: 0.634, closed: 0.968, and: 2.069, moment: 2.903,
    looked: 3.871, reformers: 4.271, might: 4.805, right: 5.406 };
  const mix = (a, b, u) => { const A = FILM.hex(a), B = FILM.hex(b); return FILM.rgba(A.map((v, i) => Math.round(v + (B[i] - v) * clamp(u))), 1); };

  const MORE = [[-40, 300, 280, '#6e5038'], [2080, 240, 280, '#6b4e36'], [2760, 220, 270, '#5e4632']];
  const SAL = { x: 2440, w: 400, h: 360 }, COT = { x: 3080, w: 190, h: 150 }, DOOR = [3120, HZ];
  function front(x, cx, w, h, col) { x.fillStyle = col; x.fillRect(cx - w / 2, HZ - h, w, h); x.fillStyle = 'rgba(30,18,10,.35)'; x.fillRect(cx - w / 2, HZ - h, w, 14); x.fillStyle = '#4a3a2c'; for (const wx of [-w * .3, w * .1]) x.fillRect(cx + wx, HZ - h * .55, w * .2, h * .28); }
  function saloon(x, tp) {
    const { x: cx, w, h } = SAL, l = cx - w / 2;
    x.fillStyle = '#7a4630'; x.fillRect(l, HZ - h, w, h); x.fillStyle = 'rgba(30,18,10,.35)'; x.fillRect(l, HZ - h, w, 14);
    x.fillStyle = '#3a2a20'; for (const wx of [l + 60, cx + 70]) x.fillRect(wx, HZ - 285, 70, 90);
    x.fillStyle = '#4a2c1c'; x.fillRect(l - 20, HZ - 168, w + 40, 18); for (const px of [l - 12, l + 120, cx + 110, l + w + 2]) x.fillRect(px, HZ - 150, 10, 150);
    x.fillStyle = '#3a2a20'; x.fillRect(l + 40, HZ - 130, 90, 80); x.fillRect(cx + 70, HZ - 130, 90, 80);
    x.fillStyle = '#2a1a10'; x.fillRect(cx - 50, HZ - 140, 100, 140);
    x.fillStyle = '#3e2c1e'; x.fillRect(cx - 128, HZ - h - 8, 6, 8); x.fillRect(cx + 122, HZ - h - 8, 6, 8);
    x.fillStyle = '#e8d9b8'; x.fillRect(cx - 140, HZ - h - 72, 280, 64); x.strokeStyle = '#3e2c1e'; x.lineWidth = 4; x.strokeRect(cx - 138, HZ - h - 70, 276, 60);
    x.fillStyle = '#2c2824'; x.font = '900 46px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('SALOON', cx, HZ - h - 38);
  }
  const SHUT = K.closed, PLANKS = [SHUT + .42, SHUT + .7];
  function doorway(x, tp, lit) {
    const cx = SAL.x, sh = easeIn(clamp((tp - SHUT + .22) / .22), 2);
    x.fillStyle = mix('#2a1a10', '#f2b050', lit); x.fillRect(cx - 50, HZ - 140, 100, 140);
    x.fillStyle = '#b88a58'; for (const d of [-1, 1]) x.fillRect(cx + (d < 0 ? -47 : 2), HZ - 112, 45, 70);
    x.fillStyle = 'rgba(60,36,20,.55)'; for (const d of [-1, 1]) for (let k = 0; k < 4; k++) x.fillRect(cx + (d < 0 ? -41 : 8) + k * 9, HZ - 104, 4, 54);
    for (const d of [-1, 1]) {
      if (sh <= 0) continue; const w = 50 * sh, hx = cx + d * 50;
      x.fillStyle = '#5a3a24'; x.fillRect(d < 0 ? hx : hx - w, HZ - 140, w, 140);
      x.fillStyle = 'rgba(30,18,10,.35)'; x.fillRect(d < 0 ? hx + w * .15 : hx - w * .85, HZ - 128, w * .7, 50); x.fillRect(d < 0 ? hx + w * .15 : hx - w * .85, HZ - 66, w * .7, 52);
    }
    PLANKS.forEach((pt, i) => {
      const u = easeIn(clamp((tp - pt + .16) / .16), 2); if (u <= 0) return;
      x.save(); x.translate(cx, HZ - 72 - 40 * (1 - u)); x.rotate(i ? -.55 : .55); x.scale(lerp(1.25, 1, u), lerp(1.25, 1, u)); x.globalAlpha = clamp(u * 3);
      x.fillStyle = '#a8845a'; x.fillRect(-92, -11, 184, 22); x.fillStyle = 'rgba(80,50,28,.35)'; x.fillRect(-92, 5, 184, 4);
      if (tp > pt) { x.fillStyle = '#4a4a4a'; for (const nx of [-76, 76]) { x.beginPath(); x.arc(nx, 0, 3.5, 0, TAU); x.fill(); } }
      x.restore();
    });
  }
  function cottage(x) {
    const { x: cx, w, h } = COT;
    x.fillStyle = '#efe0bf'; x.fillRect(cx - w / 2, HZ - h, w, h); polyPath(x, [[cx - w / 2 - 14, HZ - h + 2], [cx, HZ - h - 70], [cx + w / 2 + 14, HZ - h + 2]]); x.fillStyle = '#9a5238'; x.fill();
    x.fillStyle = '#f3c264'; x.fillRect(cx - 70, HZ - 110, 40, 36); x.fillStyle = P.ink; x.fillRect(cx - 51, HZ - 110, 3, 36);
    x.fillStyle = '#ffd98a'; x.fillRect(DOOR[0] - 22, HZ - 84, 44, 84);
  }
  function town(x, tp) {
    for (const [cx, w, h, col] of MORE) front(x, cx, w, h, col);
    saloon(x, tp); cottage(x);
    x.fillStyle = '#3e2c1e'; for (const [a, b] of [[-230, 160], [1830, 2880]]) { x.fillRect(a, HZ - 120, b - a, 14); for (let px = a + 10; px < b; px += 100) x.fillRect(px, HZ - 120, 10, 120); }
  }
  const DRAIN = [2210, 880];
  function drain(x) {
    const [dx, dy] = DRAIN;
    x.fillStyle = '#7d6a55'; x.fillRect(dx - 96, dy - 20, 192, 40);
    x.fillStyle = '#1c1612'; x.fillRect(dx - 80, dy - 12, 160, 24);
    x.fillStyle = '#5a5048'; for (let k = 0; k < 9; k++) x.fillRect(dx - 76 + k * 18, dy - 12, 6, 24);
  }
  const glowAt = tp => smooth((tp - K.might + .1) / .6) * (.75 + .25 * Math.sin(tp * 5));

  const MAN0 = [K.moment, 2050], MAN1 = [K.right + .25, 2720], KID0 = K.reformers, OPEN = K.looked;
  const manX = tp => lerp(MAN0[1], MAN1[1], clamp((tp - MAN0[0]) / (MAN1[0] - MAN0[0])));
  const kidX = tp => lerp(DOOR[0], 2800, easeOut(clamp((tp - KID0) / (K.right + .1 - KID0)), 1.5));
  const REACH = [[[-7, -66], [-14, -80], [-18, -94]], [[7, -66], [14, -80], [18, -94]]];
  function family(x, tp) {
    const walking = tp < MAN1[0], mx = manX(tp), step = walking ? Math.abs(Math.sin((tp - MAN0[0]) * 6.5)) : 0;
    if (tp > MAN0[0] - .2) { x.save(); x.translate(mx, HZ + 110 - 4 * step); x.rotate(walking ? .03 * Math.sin((tp - MAN0[0]) * 6.5) : 0); x.scale(1.5, 1.5); PR.person(x, P, { kind: 'man', coat: P.coat, trouser: P.trouser, hat: 'cap', hatColor: P.cap, arm: tp > K.right ? smooth((tp - K.right) / .2) : 0 }); x.restore(); }
    const d = easeOut(clamp((tp - OPEN) / .35));
    if (d > 0) { x.save(); x.translate(DOOR[0], HZ); x.scale(.95, .95); PR.person(x, P, { kind: 'woman', coat: '#8a6044', skirt: '#4d5b68', hat: 'none', hatColor: '#5a3e2c' }); x.restore(); }
    x.fillStyle = '#5a3e2c'; x.fillRect(DOOR[0] - 22 + 44 * .82 * d, HZ - 84, 44 * (1 - .82 * d), 84);
    if (tp > KID0) { const kx = kidX(tp), run = tp < K.right + .1 ? Math.abs(Math.sin((tp - KID0) * 11)) : 0, at = tp > K.right; x.save(); x.translate(kx, HZ + 110 - 6 * run); x.scale(.95, .95); PR.person(x, P, { kind: 'man', coat: '#b5372b', trouser: '#3a3a40', hat: 'none', arms: at ? REACH : null, arm: at ? 0 : .3 }); x.restore(); }
  }
  function birds(x, tp) {
    for (let i = 0; i < 4; i++) {
      const u = tp - (K.moment + .2 + i * .25); if (u <= 0) continue;
      const bx = 3300 - 260 * u - i * 70, by = 70 + i * 30 + 20 * Math.sin(u * 2 + i), f = Math.sin(tp * 18 + i * 2);
      x.strokeStyle = '#3a3036'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(bx - 16, by - 8 * f); x.lineTo(bx, by); x.lineTo(bx + 16, by - 8 * f); x.stroke();
    }
  }

  const dawnAt = t => smooth((t - K.and + .1) / 2.2);
  const lightsOn = tp => 1 - clamp((tp - SHUT - .2) / .06);
  function beyond(x, sky) {
    const g = x.createLinearGradient(0, -300, 0, HZ); g.addColorStop(0, sky[1]); g.addColorStop(1, sky[0]); x.fillStyle = g; x.fillRect(2880, -900, 1700, HZ + 900);
    const s2 = S0 * .5; x.fillStyle = BD3.hills; x.beginPath(); x.moveTo(2880, HZ);
    for (let px = 2880; px <= 4580; px += 40) x.lineTo(px, HZ - 60 - 40 * Math.sin((px + s2) * .004) - 25 * Math.sin((px + s2) * .011 + 1));
    x.lineTo(4580, HZ); x.closePath(); x.fill(); x.fillStyle = BD3.ground; x.fillRect(2880, HZ, 1700, 1400);
  }
  function street(x, t, tp) {
    const dn = dawnAt(t), sky = [mix('#2a3252', '#f3d2a8', dn), mix('#101630', '#b89ab0', dn)];
    beyond(x, sky);
    S6.backdrop(x, { ...BD3, sky, draw: (x, c) => { BD3.draw(x, c); town(x, tp); } }, S0);
    drain(x); birds(x, tp);
    x.fillStyle = `rgba(16,20,44,${.6 * (1 - dn)})`; x.fillRect(-900, -900, 4400, 3000);
    const lo = lightsOn(tp), cx = SAL.x, l = cx - SAL.w / 2;
    doorway(x, tp, lo);
    if (lo > 0) { x.fillStyle = FILM.rgba(FILM.hex('#f2c46e'), lo); for (const wx of [l + 60, cx + 70]) x.fillRect(wx, HZ - 285, 70, 90); x.fillRect(l + 40, HZ - 130, 90, 80); x.fillRect(cx + 70, HZ - 130, 90, 80); }
    family(x, tp);
  }

  const Z = M45 ? [1.6, .95] : [2.2, 1.05], END = M45 ? [2640, 620] : [2380, 560];
  const KEYS = [[0, [2440, 445, Math.log(Z[0])]], [K.closed + .9, [2440, 455, Math.log(Z[0] * 1.06)]], [DUR + .6, [END[0], END[1], Math.log(Z[1])]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t, cam = camera(t)) {
    const tp = pose(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => street(x, t, tp), { paperShadow: [4, 6, 5, .3] });
    FILM.sheet(ctx, cam, 1, W, H, R);
    const lo = lightsOn(tp), sh = clamp((tp - SHUT) / .05);
    if (lo > 0) PR.glow(ctx, SAL.x, HZ - 80, 260, P.amber, .3 * lo * (1 - .7 * sh), 'lightbox');
    const g = glowAt(tp); if (g > 0) PR.glow(ctx, DRAIN[0], DRAIN[1], 140, P.amber, .35 * g, 'lightbox');
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.closed, K.moment, K.reformers, K.might, K.right],
    api: { DUR, camera, draw, street, DRAIN, HZ, SAL, K },
  });
})();
