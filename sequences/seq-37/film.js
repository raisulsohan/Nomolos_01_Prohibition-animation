(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIn, easeIO, clamp, lerp, keyed } = FILM, PR = FILM.props;
  const ID = 'seq-37', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const S05 = FILM.getScene('seq-05').api, S14 = FILM.getScene('seq-14').api, DOC = S05.DOC, BAND = S05.BAND;
  const K = { amendment: 0.801, passed: 1.235, first: 2.903, one: 5.439, repealed: 7.274,
    another: 7.875, noble: 9.209, experiment: 9.543, finished: 10.244 };
  const INK = '#3a2818', back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const XY = [270, 380], XXI = [[[-190, XY[0]], [-110, XY[1]]], [[-110, XY[0]], [-190, XY[1]]], [[-80, XY[0]], [0, XY[1]]], [[0, XY[0]], [-80, XY[1]]], [[40, XY[0]], [40, XY[1]]]];
  const WRITE = [K.amendment - .55, K.passed + .05], SEG = (WRITE[1] - WRITE[0]) / XXI.length;
  const TEAR = K.repealed - .05, FALL = [K.repealed + .5, K.noble + .2], FADE = [K.repealed + .9, K.noble - .15];
  function xxi(x, t) {
    const wet = 1 - smooth((t - WRITE[1] - .3) / 2.5);
    XXI.forEach(([a, b], i) => {
      const u = clamp((t - WRITE[0] - i * SEG) / SEG); if (u <= 0) return; const e = [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
      x.strokeStyle = INK; x.lineCap = 'round'; x.lineWidth = 15; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(e[0], e[1]); x.stroke();
      if (wet > 0) { x.strokeStyle = `rgba(255,236,200,${.35 * wet})`; x.lineWidth = 4; x.beginPath(); x.moveTo(a[0] + 3, a[1]); x.lineTo(e[0] + 3, e[1]); x.stroke(); }
      if (u >= 1) { x.strokeStyle = INK; x.lineWidth = 7; for (const p of [a, b]) { x.beginPath(); x.moveTo(p[0] - 14, p[1]); x.lineTo(p[0] + 14, p[1]); x.stroke(); } }
    });
  }
  function nib(t) { const i = Math.min(XXI.length - 1, Math.floor((t - WRITE[0]) / SEG)), u = clamp((t - WRITE[0] - i * SEG) / SEG), [a, b] = XXI[Math.max(0, i)]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; }
  const TEN = [[-150, XY[0]], [-40, XY[0]], [40, XY[0]]].map((p, i) => ({ p, top: [p[0] + [-40, 20, 70][i], BAND.y1 - 6], t: K.one - .3 + i * .18 }));
  function tendrils(x, t) {
    const pull = easeIO(clamp((t - TEAR) / .45));
    for (const d of TEN) {
      const u = easeOut(clamp((t - d.t) / .9)); if (u <= 0 || pull >= 1) continue;
      const top = [d.top[0] + 40 * pull, d.top[1] + 260 * pull], c1 = [d.p[0] - 50, lerp(d.p[1], top[1], .4)], c2 = [top[0] + 40, lerp(d.p[1], top[1], .8)];
      x.strokeStyle = INK; x.lineWidth = 7 * (1 - .5 * u) + 2; x.lineCap = 'round'; x.beginPath(); x.moveTo(d.p[0], d.p[1]);
      for (let k = 1; k <= 20; k++) { const s = k / 20 * u, q = [(1 - s) ** 3 * d.p[0] + 3 * (1 - s) ** 2 * s * c1[0] + 3 * (1 - s) * s * s * c2[0] + s ** 3 * top[0], (1 - s) ** 3 * d.p[1] + 3 * (1 - s) ** 2 * s * c1[1] + 3 * (1 - s) * s * s * c2[1] + s ** 3 * top[1]]; x.lineTo(q[0], q[1]); }
      x.stroke();
      if (u >= 1) { x.beginPath(); x.arc(top[0] + 8, top[1] - 6, 9, Math.PI * .6, Math.PI * 1.9); x.stroke(); }
    }
  }
  const stripPos = t => { const pull = easeIO(clamp((t - TEAR) / .45)); return [40 * pull, (BAND.y0 + BAND.y1) / 2 + 260 * pull, .15 * pull]; };
  function desk(x, t) {
    x.fillStyle = '#4a3526'; x.fillRect(-1000, -1000, 4400, 3200);
    x.strokeStyle = 'rgba(20,12,6,.25)'; x.lineWidth = 3; x.lineCap = 'butt'; x.lineJoin = 'miter'; for (let y = -900; y < 2100; y += 38) { x.beginPath(); x.moveTo(-1000, y); for (let px = -1000; px <= 3400; px += 80) x.lineTo(px, y + Math.sin(px / 300 + y) * 6); x.stroke(); }
    x.save(); x.translate(DOC.x, DOC.y); x.rotate(.02);
    S05.page(x, t >= TEAR); xxi(x, t); tendrils(x, t);
    if (t >= TEAR && t < FALL[0]) { const [sx, sy, r] = stripPos(t); x.save(); x.translate(sx, sy); x.rotate(r); S05.strip(x); x.restore(); }
    if (t > WRITE[0] - .3 && t < WRITE[1] + .6) { const n = nib(t), up = t > WRITE[1] ? (t - WRITE[1]) * 400 : 0; x.save(); x.translate(n[0], n[1] - up); x.rotate(.25); PR.quill(x, P, 300); x.restore(); }
    x.restore();
  }
  const SAL = S14.SAL, HZ = S14.HZ, SHUT = S14.K.closed, LAND = [SAL.x - 190, HZ + 70];
  const t14 = t => lerp(SHUT + .2, SHUT - .35, easeIO(clamp((t - K.finished + .15) / .6)));
  const PL = [0, 1].map(i => ({ i, t: K.experiment - .05 + i * .2 }));
  function planks(x, t) {
    for (const p of PL) {
      const f = clamp((t - p.t) / .7), sw = easeIn(clamp(f / .45), 2), fall = easeIn(clamp((f - .4) / .6), 2), sgn = p.i ? -1 : 1;
      x.save(); x.translate(SAL.x + sgn * (76 * sw + 120 * fall), HZ - 72 + 60 * sw + (44 + 16 * p.i) * fall); x.rotate(lerp(lerp(sgn * .55, sgn * 1.45, sw), sgn * .14, fall)); x.translate(-sgn * 76 * sw, 0);
      x.fillStyle = '#a8845a'; x.fillRect(-92, -11, 184, 22); x.fillStyle = 'rgba(80,50,28,.35)'; x.fillRect(-92, 5, 184, 4);
      if (f <= 0) { x.fillStyle = '#4a4a4a'; for (const nx of [-76, 76]) { x.beginPath(); x.arc(nx, 0, 3.5, 0, TAU); x.fill(); } }
      x.restore();
    }
  }
  function street(x, t) { const a = t14(t); S14.street(x, a, pose(a)); planks(x, t); if (t > FALL[1]) { x.save(); x.translate(LAND[0], LAND[1]); x.rotate(-.08); x.scale(.34, .2); S05.strip(x); x.restore(); } }

  const deskCam = t => ({ x: DOC.x + (M45 ? 0 : 60), y: lerp(M45 ? 600 : 660, M45 ? 620 : 700, smooth(t / FALL[0])), z: (M45 ? 1.0 : 1.08) * lerp(1, 1.06, smooth(t / FALL[0])) });
  const streetCam = t => ({ x: SAL.x - 30, y: M45 ? HZ - 60 : HZ - 120, z: (M45 ? 1.35 : 1.75) * lerp(1, 1.05, smooth((t - FADE[0]) / (DUR - FADE[0]))) });
  const toScreen = (cam, p) => [W / 2 + cam.z * (p[0] - cam.x), H / 2 + cam.z * (p[1] - cam.y)];
  function fallingStrip(ctx, t) {
    if (t < FALL[0] || t > FALL[1]) return;
    const u = clamp((t - FALL[0]) / (FALL[1] - FALL[0])), e = easeIO(u), dc = deskCam(FALL[0]), sc = streetCam(FALL[1]);
    const [sx, sy] = stripPos(FALL[0]), a = toScreen(dc, [DOC.x + sx, DOC.y + sy]), b = toScreen(sc, LAND);
    const p = [lerp(a[0], b[0], e) + 90 * Math.sin(u * TAU * 1.5) * (1 - u), lerp(a[1], b[1], e)], s = lerp(dc.z, sc.z * .34, e);
    L.sheet(ctx, { x: W / 2, y: H / 2, z: 1 }, 1, [W / 2, H / 2], x => { x.save(); x.translate(p[0], p[1]); x.rotate(.15 + .5 * Math.sin(u * TAU * 1.2) * (1 - u) - .23 * e); x.scale(s, s * lerp(1, .6, e) * (.7 + .3 * Math.abs(Math.cos(u * TAU)))); S05.strip(x); x.restore(); }, { paperShadow: [10, 16, 8, .3] });
  }
  function card(ctx, t, text, t0, t1, y) {
    const a = smooth((t - t0) / .3) * (1 - smooth((t - t1) / .4)); if (a <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.font = `900 ${M45 ? 56 : 60}px NSC`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = ctx.measureText(text).width + 70, h = 96; ctx.fillStyle = 'rgba(40,30,20,.3)'; ctx.beginPath(); ctx.roundRect(W / 2 - w / 2 + 6, y - h / 2 + 8, w, h, 8); ctx.fill();
    ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, y - h / 2, w, h, 8); ctx.fill(); ctx.fillStyle = '#2c2824'; ctx.fillText(text, W / 2, y + 2); ctx.restore();
  }
  function draw(ctx, t) {
    const fade = smooth((t - FADE[0]) / (FADE[1] - FADE[0]));
    L.background(ctx);
    if (fade < 1) L.sheet(ctx, deskCam(t), 1, R, x => desk(x, t), { paperShadow: [6, 9, 7, .45] });
    if (fade > 0) L.sheet(ctx, streetCam(t), 1, R, x => street(x, t), { paperShadow: [4, 6, 5, .3], alpha: fade });
    if (fade > 0) { const a = t14(t), lit = clamp((SHUT + .2 - a) / .5), sc = streetCam(t); FILM.sheet(ctx, sc, 1, W, H, R); PR.glow(ctx, SAL.x, HZ - 80, 260, P.amber, .3 * lit * fade, 'lightbox'); ctx.setTransform(1, 0, 0, 1, 0, 0); }
    fallingStrip(ctx, t);
    card(ctx, t, '21st Amendment', K.passed - .05, K.first + .4, M45 ? 150 : 100);
    card(ctx, t, 'the first and only time', K.first - .05, K.one + .5, M45 ? H - 150 : H - 100);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.passed, K.first, K.repealed, K.experiment, K.finished],
    api: { DUR, K, street, streetCam, t14, SAL, HZ, SHUT },
  });
})();
