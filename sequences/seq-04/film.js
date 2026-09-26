(() => {
  'use strict';
  const { TAU, keyed, smooth, easeOut, easeIn, easeIO, clamp, lerp, polyPath, rng, hash } = FILM, PR = FILM.props;
  const ID = 'seq-04', { W, H, id: FMT } = FILM.format(), R = [960, 540];
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;

  const K = {
    believed: 1.268, empty1: 3.837, prisons: 4.771, heal: 4.905, slums: 5.939,
    preacher: 7.24, promised: 7.707, jails: 8.408, empty2: 9.643,
    men: 10.844, finally: 11.278, walk: 11.778, sober: 12.712, families: 12.946,
  };
  const SLIDES = [
    { kind: 'prison', in: [K.empty1 - .55, K.empty1 - .1], k: t => clamp((t - K.empty1 - .1) / (K.prisons + .4 - K.empty1 - .1)) },
    { kind: 'slum', in: [K.heal - .4, K.heal + .05], k: t => clamp((t - K.heal - .05) / (K.slums + .3 - K.heal - .05)) },
    { kind: 'prison', in: [K.jails - .35, K.jails + .1], k: () => 1 },
    { kind: 'home', in: [K.men - .4, K.men + .05], k: t => t },
  ];
  K.walkK = [K.walk - .05, K.sober + .1]; K.door = [K.families - .5, K.families + .2];
  K.step = [K.preacher - .25, K.preacher + .75];
  K.crane = [K.believed + .75, K.empty1 - .3];

  const SCREEN = { x0: 510, y0: 110, x1: 1410, y1: 730, p: .62 }, STAGE_Y = 760;
  const LENS = { at: [1000, 748], p: 1.12 };
  const PREACHER = { from: [1470, STAGE_Y], to: [1240, STAGE_Y], s: 3.05 };
  const SHADOW = { at: [1275, 735], s: 3.9 };
  const PROFILE = { at: [460, 727], p: 1.6, s: 2.3 };
  const ROWS = [
    { p: .95, y: 830, s: 1.7, dx: 118, seed: 3 }, { p: 1.08, y: 900, s: 1.95, dx: 132, seed: 5 },
    { p: 1.25, y: 985, s: 2.25, dx: 150, seed: 7 }, { p: 1.5, y: 1080, s: 2.65, dx: 175, seed: 9 },
  ].map(r => {
    const g = rng(r.seed * 31), heads = [];
    for (let x = -600 + g() * 80; x < 2500; x += r.dx * (.8 + g() * .45)) heads.push({ x, hat: ['bowler', 'wide', 'cap', 'none', 'boater', 'wide'][Math.floor(g() * 6)], ht: .9 + g() * .2, lean: (g() - .5) * .08, ph: g() * 6 });
    return { ...r, heads };
  });
  const MOTES = Array.from({ length: 70 }, (_, i) => { const r = rng(500 + i * 7); return { u: r(), v: r() * 2 - 1, sp: .02 + r() * .05, s: 1 + r() * 2.2, a: .25 + r() * .5 }; });
  const LANTERNS = [260, 560, 880, 1200, 1520, 1800].map((x, i) => ({ x, y: 40 + Math.sin(i * 1.3) * 18, ph: i * 1.7 }));

  const CAM = FMT === '4x5' ? [
    [0, [640, 560], 1.2], [K.crane[0], [640, 555], 1.25], [K.crane[1], [960, 470], .9], [K.prisons + .2, [960, 440], 1.02],
    [K.slums + .3, [960, 440], 1.05], [K.promised + .25, [1060, 470], .98], [K.men - .4, [1050, 460], 1.0],
    [K.families - .3, [900, 425], 1.22], [DUR - .4, [960, 500], .86], [DUR, [960, 500], .86],
  ] : [
    [0, [700, 560], 1.38], [K.crane[0], [700, 555], 1.44], [K.crane[1], [960, 470], 1.0], [K.prisons + .2, [960, 440], 1.18],
    [K.slums + .3, [960, 440], 1.22], [K.promised + .25, [1060, 470], 1.12], [K.men - .4, [1050, 460], 1.16],
    [K.families - .3, [960, 425], 1.42], [DUR - .4, [960, 520], .96], [DUR, [960, 520], .96],
  ];
  function camera(t) {
    const xy = keyed(t, CAM.map(k => [k[0], k[1]])), z = keyed(t, CAM.map(k => [k[0], k[2]]), true);
    return { x: xy[0], y: xy[1], z };
  }
  function toScreen(cam, p, [wx, wy]) {
    const s = Math.pow(cam.z, p), cx = R[0] + p * (cam.x - R[0]), cy = R[1] + p * (cam.y - R[1]);
    return [W / 2 + s * (wx - cx), H / 2 + s * (wy - cy)];
  }

  const [SL, slx] = FILM.canvas(840, 600), [SL2, slx2] = FILM.canvas(840, 600);
  function slide(x, sl, t, tp) {
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, 840, 600); x.setTransform(sl.kind === 'home' ? -3 : 3, 0, 0, 3, 420, 300);
    if (sl.kind === 'prison') PR.promisePrison(x, P, sl.k(tp));
    else if (sl.kind === 'slum') PR.promiseSlum(x, P, sl.k(tp));
    else PR.promiseHome(x, P, clamp((tp - K.walkK[0]) / (K.walkK[1] - K.walkK[0])), clamp((tp - K.door[0]) / (K.door[1] - K.door[0])), tp);
  }
  function screenImage(x, t, tp) {
    const { x0, y0, x1, y1 } = SCREEN, w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const on = smooth(t / .5);
    x.fillStyle = '#b3a283'; x.fillRect(x0, y0, w, h);
    const g = x.createRadialGradient(cx, cy, 30, cx, cy, w * .62); g.addColorStop(0, `rgba(255,236,196,${.95 * on})`); g.addColorStop(1, `rgba(255,236,196,${.25 * on})`);
    x.fillStyle = g; x.fillRect(x0, y0, w, h);
    let cur = -1; SLIDES.forEach((s, i) => { if (tp >= s.in[0]) cur = i; });
    if (cur >= 0) {
      const s = SLIDES[cur], a = smooth((tp - s.in[0]) / (s.in[1] - s.in[0]));
      x.save(); x.beginPath(); x.rect(x0 + 20, y0 + 20, w - 40, h - 40); x.clip();
      if (cur > 0 && a < 1) { slide(slx2, SLIDES[cur - 1], t, tp); x.globalAlpha = 1; x.drawImage(SL2, x0 + 20, y0 + 20, w - 40, h - 40); }
      slide(slx, s, t, tp); x.globalAlpha = a; x.drawImage(SL, x0 + 20, y0 + 20, w - 40, h - 40); x.globalAlpha = 1;
      x.restore();
    }
    const v = x.createRadialGradient(cx, cy, h * .25, cx, cy, w * .7); v.addColorStop(0, 'rgba(40,24,10,0)'); v.addColorStop(1, 'rgba(40,24,10,.62)');
    x.fillStyle = v; x.fillRect(x0, y0, w, h);
    const f = (hash(Math.floor(t * 15 + 1e-6), 77) - .5) * .06;
    x.fillStyle = f > 0 ? `rgba(255,236,200,${f})` : `rgba(30,18,8,${-f})`; x.fillRect(x0, y0, w, h);
    const inBeam = smooth((tp - K.step[0] - .3) / .5);
    if (inBeam > 0) {
      x.save(); x.beginPath(); x.rect(x0, y0, w, h); x.clip(); x.globalAlpha = .9 * inBeam; x.filter = 'blur(2.5px)';
      x.translate(SHADOW.at[0] + (1 - inBeam) * 160, SHADOW.at[1]); x.scale(SHADOW.s, SHADOW.s); PR.preacher(x, P, pumpAt(tp), 1);
      x.restore();
    }
  }
  const pumpAt = t => .35 + .65 * Math.max(...[K.promised, K.empty2, K.finally].map(p => Math.exp(-(((t - p - .1) / .3) ** 2))), smooth((t - K.families + .2) / .6) * .8);

  const FACE = [[-22, 0], [-25, -30], [-34, -58], [-36, -88], [-24, -114], [0, -124], [22, -116], [30, -100], [31, -90], [29, -84], [41, -70],
    [33, -66], [35, -61], [31, -58], [34, -54], [28, -48], [31, -40], [22, -33], [14, -26], [14, 0]];
  const BUST = [[14, -4], [32, 16], [72, 40], [112, 92], [124, 280], [-190, 280], [-165, 80], [-84, 30], [-30, 8], [-22, -4]];
  function profile(x, look) {
    x.fillStyle = '#1b1613';
    PR.smooth(x, BUST); x.fill();
    x.save(); x.translate(0, -18); x.rotate(-.2 * look); x.translate(0, 18);
    PR.smooth(x, FACE); x.fill();
    x.beginPath(); x.arc(-38, -84, 21, 0, TAU); x.fill();
    x.save(); x.translate(-6, -114); x.rotate(-.13);
    x.beginPath(); x.ellipse(0, 0, 74, 12, 0, 0, TAU); x.fill();
    x.beginPath(); x.ellipse(-8, -8, 40, 26, 0, Math.PI, TAU); x.fill();
    x.beginPath(); x.moveTo(-20, -24); x.quadraticCurveTo(-74, -92, -150, -54); x.quadraticCurveTo(-88, -58, -26, -12); x.closePath(); x.fill();
    x.strokeStyle = '#1b1613'; x.lineCap = 'round'; x.lineWidth = 3.5;
    for (let i = 1; i < 12; i++) { const u = i / 12, px = (1 - u) ** 2 * -20 + 2 * (1 - u) * u * -74 + u * u * -150, py = (1 - u) ** 2 * -24 + 2 * (1 - u) * u * -92 + u * u * -54; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px - 6, py - 10, px - 16, py - 8 + u * 6); x.stroke(); }
    x.restore();
    x.restore();
    x.fillStyle = '#f7f0e0'; x.save(); x.translate(44, 46); x.scale(2.2, 2.2);
    polyPath(x, [[0, 0], [6, -3], [6, 3]]); x.fill(); polyPath(x, [[0, 0], [-6, -3], [-6, 3]]); x.fill(); polyPath(x, [[0, 0], [-3, 8], [0, 6.5], [3, 8]]); x.fill();
    x.restore();
  }

  function backHead(x, h, t) {
    x.save(); x.rotate(h.lean + Math.sin(t * .9 + h.ph) * .012); x.scale(1, h.ht);
    x.fillStyle = '#17120f';
    x.beginPath(); x.moveTo(-34, 0); x.quadraticCurveTo(-32, -26, -12, -30); x.lineTo(12, -30); x.quadraticCurveTo(32, -26, 34, 0); x.closePath(); x.fill();
    x.fillRect(-34, -1, 68, 160);
    x.fillRect(-5, -36, 10, 8); x.beginPath(); x.arc(0, -46, 12, 0, TAU); x.fill();
    if (h.hat === 'bowler') { x.beginPath(); x.ellipse(0, -52, 17, 3.5, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(0, -53, 11, 10, 0, Math.PI, TAU); x.fill(); }
    else if (h.hat === 'wide') { x.beginPath(); x.ellipse(0, -52, 24, 5, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(0, -54, 12, 9, 0, Math.PI, TAU); x.fill(); x.beginPath(); x.arc(-7, -44, 6, 0, TAU); x.fill(); }
    else if (h.hat === 'boater') { x.beginPath(); x.ellipse(0, -52, 18, 3.5, 0, 0, TAU); x.fill(); x.fillRect(-10, -62, 20, 10); }
    else if (h.hat === 'cap') { x.beginPath(); x.ellipse(0, -51, 13, 7, 0, Math.PI, TAU); x.fill(); }
    x.restore();
  }

  function lantern(x, t) {
    x.fillStyle = '#2a2016'; x.fillRect(-6, 0, 12, 90); polyPath(x, [[-40, 90], [40, 90], [6, 20], [-6, 20]]); x.fill();
    x.fillStyle = '#7a5c32'; x.fillRect(-58, -52, 116, 72);
    x.fillStyle = '#9b7a45'; x.fillRect(-58, -52, 116, 10);
    x.fillStyle = '#4a3820'; x.fillRect(-18, -98, 36, 48); x.fillRect(-24, -104, 48, 8);
    for (let i = 0; i < 4; i++) { const f = .6 + .4 * hash(Math.floor(t * 15 + 1e-6), i, 3); x.fillStyle = `rgba(255,190,90,${.7 * f})`; x.fillRect(-12, -92 + i * 10, 24, 4); }
  }

  function draw(ctx, t) {
    const cam = camera(t), tp = pose(t);
    L.background(ctx);
    L.sheet(ctx, cam, .5, R, x => {
      x.fillStyle = '#2f241c'; x.fillRect(-1600, -1000, 5200, 2600);
      x.fillStyle = '#271e17'; for (let sx = -1600; sx < 3600; sx += 170) x.fillRect(sx, -1000, 6, 2600);
      x.fillStyle = '#453225'; x.beginPath(); x.moveTo(-1600, -140);
      for (let sx = -1600; sx <= 3600; sx += 120) x.quadraticCurveTo(sx + 60, -40, sx + 120, -140);
      x.lineTo(3600, -1000); x.lineTo(-1600, -1000); x.closePath(); x.fill();
    }, { shadow: false, rimAlpha: .15 });
    L.sheet(ctx, cam, .8, R, x => {
      x.fillStyle = '#211811'; x.fillRect(150, -1000, 26, 2000); x.fillRect(1760, -1000, 26, 2000);
      x.strokeStyle = '#140f0b'; x.lineWidth = 2; x.beginPath(); x.moveTo(163, 30); for (const l of LANTERNS) x.lineTo(l.x, l.y + 10); x.lineTo(1773, 30); x.stroke();
      for (const l of LANTERNS) { x.fillStyle = '#3a2a1c'; x.fillRect(l.x - 9, l.y + 8, 18, 5); x.fillStyle = '#f0b25a'; x.fillRect(l.x - 7, l.y + 13, 14, 20); x.fillStyle = '#3a2a1c'; x.fillRect(l.x - 9, l.y + 33, 18, 4); }
    }, { shadow: false, rimAlpha: .2 });
    FILM.sheet(ctx, cam, .8, W, H, R);
    for (const l of LANTERNS) PR.glow(ctx, l.x, l.y + 24, 90, '#ffc070', .28 + .06 * Math.sin(t * 3 + l.ph), 'lightbox');
    L.sheet(ctx, cam, SCREEN.p, R, x => {
      x.strokeStyle = '#1a130d'; x.lineWidth = 3; for (const rx of [SCREEN.x0 + 20, SCREEN.x1 - 20]) { x.beginPath(); x.moveTo(rx, SCREEN.y0); x.lineTo(rx, -900); x.stroke(); }
      x.fillStyle = '#2a1f16'; x.fillRect(SCREEN.x0 - 14, SCREEN.y0 - 14, SCREEN.x1 - SCREEN.x0 + 28, SCREEN.y1 - SCREEN.y0 + 28);
      screenImage(x, t, tp);
      x.fillStyle = '#3b2a1f'; x.fillRect(260, STAGE_Y, 1400, 700); x.fillStyle = '#5a4030'; x.fillRect(260, STAGE_Y, 1400, 12);
      const k = easeIO(clamp((tp - K.step[0]) / (K.step[1] - K.step[0]))), px = lerp(PREACHER.from[0], PREACHER.to[0], k), stepY = k > 0 && k < 1 ? -Math.abs(Math.sin(k * Math.PI * 3)) * 6 : 0;
      x.save(); x.translate(px, STAGE_Y + stepY); x.scale(PREACHER.s, PREACHER.s); PR.preacher(x, P, pumpAt(tp), .15); x.restore();
    }, { rimShift: [0, 1.4], rimColor: '#ffd9a0', rimAlpha: .55, paperShadow: [3, 5, 5, .35] });
    FILM.sheet(ctx, cam, SCREEN.p, W, H, R);
    PR.glow(ctx, 960, 420, 720, '#ffd9a0', .22, 'lightbox');
    {
      const lens = toScreen(cam, LENS.p, LENS.at), a = toScreen(cam, SCREEN.p, [SCREEN.x0 + 20, SCREEN.y0 + 20]), b = toScreen(cam, SCREEN.p, [SCREEN.x1 - 20, SCREEN.y1 - 20]);
      const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(lens[0], lens[1], cx, cy); g.addColorStop(0, 'rgba(255,220,160,.34)'); g.addColorStop(1, 'rgba(255,220,160,.05)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(lens[0] - 10, lens[1]); ctx.lineTo(a[0], a[1]); ctx.lineTo(b[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(a[0], b[1]); ctx.lineTo(lens[0] + 10, lens[1]); ctx.closePath(); ctx.fill();
      for (const m of MOTES) {
        const u = (m.u + t * m.sp) % 1, ex = lerp(lens[0], lerp(a[0], b[0], (m.v + 1) / 2), u), ey = lerp(lens[1], lerp(a[1], b[1], (Math.sin(m.v * 3) + 1) / 2), u);
        ctx.fillStyle = `rgba(255,236,200,${m.a * Math.sin(u * Math.PI)})`; ctx.beginPath(); ctx.arc(ex, ey, m.s * (1.3 - u * .6), 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    ROWS.forEach((r, i) => {
      L.sheet(ctx, cam, r.p, R, x => { for (const h of r.heads) { x.save(); x.translate(h.x, r.y); x.scale(r.s, r.s); backHead(x, h, t); x.restore(); } },
        { shadow: false, rimShift: [0, 1.6], rimColor: '#ffcf8a', rimAlpha: .75 - i * .12, rimWidth: 2.4, fibre: .5 });
      if (i === 1) {
        L.sheet(ctx, cam, LENS.p, R, x => { x.save(); x.translate(LENS.at[0], LENS.at[1] + 52); lantern(x, t); x.restore(); }, { shadow: false, rimShift: [0, 1.4], rimColor: '#ffcf8a' });
        FILM.sheet(ctx, cam, LENS.p, W, H, R); PR.glow(ctx, LENS.at[0], LENS.at[1] - 10, 120, '#ffc070', .35, 'lightbox');
      }
    });
    const drop = easeIn(clamp((t - K.crane[0]) / (K.crane[1] - K.crane[0])), 2) * 1150;
    if (drop < 1100) L.sheet(ctx, cam, PROFILE.p, R, x => {
      const look = easeOut(clamp((tp - K.believed + .1) / .7));
      x.save(); x.translate(PROFILE.at[0], PROFILE.at[1] + drop); x.scale(PROFILE.s, PROFILE.s); profile(x, look); x.restore();
    }, { shadow: false, rimShift: [-1.3, .35], rimColor: '#ffe2b0', rimAlpha: 1, rimWidth: 6, fibre: .5 });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: Promise.resolve(), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.believed, K.empty1, K.heal, K.preacher, K.men, K.families],
  });
})();
