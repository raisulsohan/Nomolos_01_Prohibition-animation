(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng, hash } = FILM, PR = FILM.props;
  const ID = 'seq-17', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S14 = FILM.getScene('seq-14').api, S14b = FILM.getScene('seq-14b').api, S14c = FILM.getScene('seq-14c').api, S15 = FILM.getScene('seq-15').api;
  const TUN = S14b.TUN, ROOM = S14b.ROOM, SEC = S14b.SEC, HZ = S14.HZ;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { whiskey: 0, smuggled: 0.568, canadian: 1.402, border: 1.902, liquor: 3.037,
    basements: 3.938, bathtubs: 4.572, all: 5.339, flowing: 5.84, hidden: 6.54,
    speakeasies: 7.441, secret: 8.809, replaced: 10.144, saloons: 10.778 };
  const LATE = 60;
  const line = (x, pts, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'butt'; x.lineJoin = 'miter'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); };

  const SM = 50, CHI = [2450, 600];
  const M = (() => { const m0 = FILM.usmap({ width: 1320 * SM, cx: 0, cy: 0 }), p = m0.proj([-87.63, 41.88]); return FILM.usmap({ width: 1320 * SM, cx: CHI[0] - p[0], cy: CHI[1] - p[1] }); })();
  const RECT = [-900, -900, 5500, 3900];
  function land(x) {
    x.fillStyle = '#3a2f5e'; polyPath(x, M.canada); x.fill();
    x.fillStyle = '#2c3378'; polyPath(x, M.us); x.fill();
    x.fillStyle = '#0a1a3a'; for (const l of Object.values(M.lakes)) { polyPath(x, l); x.fill(); }
    x.strokeStyle = 'rgba(160,200,255,.35)'; x.lineWidth = 60; for (const l of Object.values(M.lakes)) { polyPath(x, l); x.stroke(); }
  }
  function mapLayer(x, sv) {
    x.save(); x.beginPath(); x.rect(-1e7, -1e7, 2e7, 2e7); x.rect(...RECT); x.clip('evenodd'); land(x); x.restore();
    if (sv < 1) { x.save(); x.globalAlpha = 1 - sv; x.beginPath(); x.rect(...RECT); x.clip(); land(x); x.restore(); }
  }
  const RUNS = [['boat', [-81.0, 42.62], [-81.05, 41.98], .15], ['boat', [-80.1, 42.62], [-80.15, 42.2], .45], ['boat', [-82.4, 42.1], [-82.95, 42.2], .75],
    ['boat', [-77.9, 43.95], [-77.95, 43.35], .3], ['boat', [-76.7, 43.95], [-76.75, 43.45], .9], ['truck', [-73.4, 45.5], [-73.35, 44.55], .2], ['truck', [-74.6, 45.35], [-74.5, 44.5], .6],
    ['truck', [-71.8, 45.6], [-71.9, 44.8], 1.0]].map(([k, a, b, t0]) => ({ k, a: M.proj(a), b: M.proj(b), t0: K.whiskey + t0 }));
  function smuggle(ctx, t, cam) {
    FILM.sheet(ctx, cam, 1, W, H, R); const s = 1 / cam.z;
    for (const r of RUNS) {
      const u = easeIO(clamp((t - r.t0) / 1.7)); if (u <= 0) continue;
      const p = [lerp(r.a[0], r.b[0], u), lerp(r.a[1], r.b[1], u)];
      ctx.strokeStyle = 'rgba(255,179,77,.9)'; ctx.lineWidth = 7 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(r.a[0], r.a[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
      ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(2.2 * s, 2.2 * s);
      if (r.k === 'boat') { ctx.fillStyle = '#0a0a18'; polyPath(ctx, [[-18, -6], [18, -6], [12, 6], [-12, 6]]); ctx.fill(); ctx.fillRect(-6, -14, 12, 8); ctx.fillStyle = '#ffcf80'; ctx.fillRect(-3, -12, 5, 4); }
      else { ctx.fillStyle = '#0a0a18'; ctx.fillRect(-14, -8, 20, 14); ctx.fillRect(6, -4, 9, 10); ctx.fillStyle = '#ffcf80'; ctx.fillRect(13, -2, 3, 3); }
      ctx.restore();
      PR.glow(ctx, p[0], p[1], 70 * s, B.amber, .6, 'lightbox');
    }
    const lab = smooth((t - K.canadian + .4) / .4) * (1 - smooth((t - K.liquor - .1) / .3));
    if (lab > 0) {
      ctx.save(); ctx.globalAlpha = .85 * lab; ctx.fillStyle = '#ffe3b0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${46 * s}px NSC`;
      const ca = M.proj([-79.5, 45.2]), us = M.proj([-76.6, 42.5]); ctx.fillText('CANADA', ca[0], ca[1]); ctx.fillText('U.S.', us[0], us[1]); ctx.restore();
    }
  }

  const HX = 3560, BASE = { x0: 3420, x1: 3720, y0: 1060, y1: 1200 }, PIPE = [[3690, 500], [3690, 1060]], DOWN = [[3620, 1200], [3620, 1540]];
  const DRAIN = [K.all - .1, K.all + .6];
  function house(x, tp) {
    x.fillStyle = '#16143a'; x.fillRect(HX - 190, 380, 380, HZ - 380); polyPath(x, [[HX - 210, 384], [HX, 270], [HX + 210, 384]]); x.fill();
    x.fillStyle = '#3e2c3c'; x.fillRect(HX - 170, 400, 340, 110); x.fillRect(HX - 170, 526, 340, HZ - 526 - 4);
    x.fillStyle = '#16143a'; x.fillRect(HX - 170, 510, 340, 16);
    const lvl = 1 - smooth((tp - DRAIN[0]) / (DRAIN[1] - DRAIN[0]));
    x.fillStyle = '#d8d0e8'; x.beginPath(); x.moveTo(HX - 120, 460); x.lineTo(HX + 60, 460); x.quadraticCurveTo(HX + 60, 506, HX + 20, 506); x.lineTo(HX - 80, 506); x.quadraticCurveTo(HX - 120, 506, HX - 120, 460); x.fill();
    x.save(); x.beginPath(); x.rect(HX - 116, 464 + 36 * (1 - lvl), 172, 40); x.clip(); x.fillStyle = B.amber; x.fillRect(HX - 116, 464, 172, 40); x.restore();
    x.fillStyle = '#a8a0c0'; for (const fx of [HX - 104, HX + 44]) x.fillRect(fx, 506, 6, 8);
    x.strokeStyle = '#a8a0c0'; x.lineWidth = 5; x.beginPath(); x.moveTo(HX - 130, 430); x.lineTo(HX - 110, 430); x.lineTo(HX - 110, 444); x.stroke();
    x.fillStyle = '#16143a'; for (let k = 0; k < 6; k++) x.fillRect(HX + 60 + k * 18, HZ - 4 - (k + 1) * 18, 18, 18 * (k + 1));
    x.fillRect(HX - 130, 590, 90, 6); x.fillRect(HX - 124, 596, 5, 40); x.fillRect(HX - 50, 596, 5, 40);
    for (const P of [PIPE, DOWN]) { line(x, P, 22, '#2e2a6e'); line(x, P, 12, '#0c0a24'); }
    line(x, [[HX + 56, 500], [3690, 500]], 12, '#2e2a6e');
    const f1 = smooth((tp - DRAIN[0] - .1) / .5), f2 = smooth((tp - DRAIN[1] + .1) / .5);
    if (f1 > 0 && tp < DRAIN[1] + 1.2) line(x, [PIPE[0], [PIPE[0][0], lerp(PIPE[0][1], PIPE[1][1], f1)]], 7, B.amber);
    if (f2 > 0) line(x, [DOWN[0], [DOWN[0][0], lerp(DOWN[0][1], DOWN[1][1], f2)]], 7, B.amber);
    x.fillStyle = '#2e2a6e'; x.fillRect(BASE.x0 - 8, BASE.y0 - 8, BASE.x1 - BASE.x0 + 16, BASE.y1 - BASE.y0 + 16); x.fillStyle = '#3a2830'; x.fillRect(BASE.x0, BASE.y0, BASE.x1 - BASE.x0, BASE.y1 - BASE.y0);
    line(x, [[HX, HZ], [HX, BASE.y0]], 30, '#2e2a6e'); line(x, [[HX, HZ], [HX, BASE.y0]], 18, '#1a1636');
    x.save(); x.translate(3500, BASE.y1); x.scale(.55, .55);
    x.fillStyle = '#ff9a3a'; polyPath(x, [[-50, 0], [-30, -26], [-14, -8], [0, -34], [14, -8], [30, -26], [50, 0]]); x.fill();
    x.fillStyle = '#a0643a'; x.beginPath(); x.ellipse(0, -70, 58, 44, 0, 0, TAU); x.fill(); x.fillRect(-10, -150, 20, 44);
    x.strokeStyle = '#a0643a'; x.lineWidth = 7; x.beginPath(); x.moveTo(8, -140); x.lineTo(110, -110); x.lineTo(110, -40); x.stroke();
    x.fillStyle = '#6a4a3a'; x.beginPath(); x.roundRect(92, -40, 40, 40, 6); x.fill(); x.fillStyle = B.amber; x.fillRect(98, -30, 28, 24);
    for (let k = 0; k < 5; k++) { const u = ((tp * 1.6 + k * .2) % 1); x.fillStyle = `rgba(255,220,160,${.8 * (1 - u)})`; x.beginPath(); x.arc(112 + 10 * Math.sin(k * 2 + tp * 3), -8 - 30 * u, 4, 0, TAU); x.fill(); }
    x.restore();
  }

  const HID = [[3350, 1420], [3700, 1420], [3500, 1690], [3900, 1700], [3050, 1150], [2600, 1950], [1800, 1950], [1300, 1150], [1000, 1420], [1150, 1700], [650, 1690], [800, 1150]]
    .map(([x, y], i) => ({ x, y, t: K.hidden - .2 + i * .17 }));
  function speakeasy(x, cx, cy, w, h, lit, seed, tp) {
    x.fillStyle = '#2e2a6e'; x.fillRect(cx - w / 2 - 8, cy - h / 2 - 8, w + 16, h + 16);
    x.fillStyle = FILM.rgba(FILM.hex('#0c0a24').map((v, i) => Math.round(lerp(v, FILM.hex('#6a4636')[i], lit))), 1); x.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (lit <= 0) return;
    x.fillStyle = '#2a1a1a'; x.fillRect(cx + w * .15, cy + h / 2 - 34, w * .3, 34);
    const g = rng(seed);
    for (let k = 0; k < 3; k++) { const px = cx - w * .35 + k * w * .2 + (g() - .5) * 10, bob = Math.abs(Math.sin(tp * 4 + k + seed)) * 2; x.save(); x.translate(px, cy + h / 2 - bob); x.scale(g() < .5 ? .5 : -.5, .5); PR.person(x, B, { kind: g() < .4 ? 'woman' : 'man', hat: g() < .5 ? 'wide' : 'none', hatColor: '#06060f', dark: 1, arm: .8 }); x.restore(); }
  }
  function network(x, tp) {
    for (const r of HID) {
      const lit = smooth((tp - r.t) / .3);
      const ty = r.y < 1300 ? 1300 : r.y < 1560 ? 1300 : (r.x < 2210 ? 1560 : 1540);
      line(x, [[r.x + 60, r.y], [r.x + 60, ty]], 22, '#2e2a6e'); line(x, [[r.x + 60, r.y], [r.x + 60, ty]], 12, '#0c0a24');
      speakeasy(x, r.x, r.y, 180, 100, lit, Math.round(r.x), tp);
    }
    const big = smooth((tp - K.secret + .1) / .4);
    speakeasy(x, ROOM.x, ROOM.y, ROOM.w, ROOM.h, big, 7, tp);
  }
  function roomGlows(ctx, tp) {
    for (const r of HID) { const lit = smooth((tp - r.t) / .3); if (lit > 0) PR.glow(ctx, r.x, r.y, 170, '#ffcf80', .3 * lit, 'lightbox'); }
    const big = smooth((tp - K.secret + .1) / .4); if (big > 0) PR.glow(ctx, ROOM.x, ROOM.y, 260, '#ffcf80', .45 * big, 'lightbox');
  }

  const mz = M45 ? .68 : 1;
  const BC = M.proj([-78, 43.9]), BZ = 1920 / Math.abs(M.proj([-86.5, 43])[0] - M.proj([-70, 43])[0]);
  const KEYS = [[0, [BC[0], BC[1], Math.log(BZ * .92 * mz)]], [K.border + .3, [BC[0] - 400, BC[1] + 300, Math.log(BZ * mz)]],
    [K.liquor + .4, [CHI[0] + 900, CHI[1] + 300, Math.log(.14 * mz)]], [K.basements + .1, [HX - 20, 790, Math.log(1.3 * mz)]], [K.all - .15, [HX - 10, 800, Math.log(1.35 * mz)]],
    [K.flowing + .5, [HX - 100, 1260, Math.log(.9 * mz)]], [K.speakeasies + .3, [2600, 1450, Math.log(.55 * mz)]], [K.secret + .2, [2100, 1400, Math.log(.56 * mz)]],
    [K.saloons + .1, [ROOM.x, 850, Math.log(1.02 * mz)]], [DUR, [ROOM.x, 855, Math.log(1.05 * mz)]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  const streetFade = cam => 1 - smooth((Math.log(cam.z) - Math.log(.5)) / (Math.log(.2) - Math.log(.5)));

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t), sv = streetFade(cam), tl = S14c.DUR + LATE + t;
    L.background(ctx);
    if (sv > 0) L.sheet(ctx, cam, 1, R, x => {
      S14b.scene(x, S14b.DUR + LATE + t, 'lightbox');
      S14c.imprint(x, tl); S15.calendar(x, 99); S14c.crowd(x, tl); S15.moreCrowd(x, 99);
      S15.river(x, S15.LATE + t); S15.industry(x, 99);
      network(x, tp); house(x, tp);
    }, { glow: .35, glowBlur: 12 });
    if (sv < 1) L.sheet(ctx, cam, 1, R, x => mapLayer(x, sv), { glow: .25, glowBlur: 10 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    if (sv > 0) { for (const ch of [...S14c.chests(tl), ...S15.moreChests(99)]) PR.glow(ctx, ch.c[0], ch.c[1], 60 * ch.s, B.amber, .5 * sv, 'lightbox'); roomGlows(ctx, tp); PR.glow(ctx, 3500, BASE.y1 - 20, 120, '#ff9a3a', .4 * sv, 'lightbox'); PR.glow(ctx, HX - 30, 480, 160, B.amber, .3 * sv, 'lightbox'); }
    if (t < K.basements) smuggle(ctx, t, cam);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.border, K.basements, K.bathtubs, K.flowing, K.speakeasies, K.replaced],
  });
})();
