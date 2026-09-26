(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, rng, hash } = FILM, PR = FILM.props;
  const ID = 'seq-14b', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S14 = FILM.getScene('seq-14').api, T0 = S14.DUR;
  const LP = FILM.look('paper', W, H), LB = FILM.look('lightbox', W, H), P = LP.P, B = LB.P, pose = LP.pose;
  const K = { trouble: 0.2, cannot: 0.934, del: 1.268, desire: 1.735, passing: 2.302,
    law: 2.903, move: 4.271, somewhere: 4.638, else: 4.938 };
  const [DX, DY] = S14.DRAIN, HZ = S14.HZ, SEC = 1000;

  const g14 = T => smooth((T - S14.K.might + .1) / .6) * (.75 + .25 * Math.sin(T * 5));
  const BEATS = [.45, 1.0, 2.62];
  const beat = t => BEATS.reduce((a, b) => a + [[0, 1], [.235, .7]].reduce((s, [d, g]) => s + (t >= b + d ? g * Math.exp(-(t - b - d) / .1) : 0), 0), 0);
  const SCRUB = [K.del, K.passing - .05];
  function drainGlow(t) {
    const rubbed = smooth((t - SCRUB[0] - .1) / .4) * (1 - smooth((t - SCRUB[1] - .15) / .3));
    const gone = smooth((t - K.law) / .7);
    return (g14(T0 + t) + .9 * beat(t)) * (1 - .75 * rubbed) * (1 - gone);
  }

  const EK = [[SCRUB[0] - .35, [2700, 560], .5], [SCRUB[0], [DX + 10, DY - 6], -.18], [SCRUB[1], [DX + 10, DY - 6], -.18], [SCRUB[1] + .35, [2760, 540], .45]];
  function eraserAt(tp) {
    if (tp < EK[0][0] || tp > EK[EK.length - 1][0]) return null;
    const v = keyed(tp, EK.map(([t, p, r]) => [t, [p[0], p[1], r]]));
    const on = tp > SCRUB[0] && tp < SCRUB[1];
    return { p: [v[0] + (on ? 80 * Math.sin((tp - SCRUB[0]) * TAU * 3.2) : 0), v[1] + (on ? 6 * Math.cos((tp - SCRUB[0]) * TAU * 6.4) : 0)], r: v[2], down: on };
  }
  const CRUMBS = (() => { const g = rng(31); return Array.from({ length: 18 }, (_, i) => ({ p: [DX + (g() - .5) * 300, DY + (g() - .5) * 60], r: 1.8 + g() * 2.2, t: SCRUB[0] + .1 + i * (SCRUB[1] - SCRUB[0] - .1) / 18 })); })();
  function crumbs(x, tp, col) { x.fillStyle = col; for (const c of CRUMBS) if (tp > c.t) { x.beginPath(); x.ellipse(c.p[0], c.p[1], c.r * 1.4, c.r, hash(c.r, 3) * 3, 0, TAU); x.fill(); } }

  const TUN = { shaft: [[DX, DY + 12], [DX, 1300]], left: [[DX, 1300], [800, 1300]], right: [[DX, 1300], [3900, 1300]],
    downL: [[1450, 1300], [1450, 1560], [400, 1560]], downR: [[3050, 1300], [3050, 1540], [4200, 1540]] };
  const ROOM = { x: 2440, y: 1150, w: 240, h: 110 };
  const secAt = t => smooth((t - K.law + .05) / .6);
  const len = pts => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  function upTo(pts, d) {
    const out = [pts[0]]; let s = 0;
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (s + l <= d) { out.push(b); s += l; } else { const u = (d - s) / l; out.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u)]); break; } }
    return out;
  }
  const line = (x, pts, w, col) => { if (pts.length < 2) return; x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'butt'; x.lineJoin = 'miter'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); };
  const RUN = 1100, SHAFT = [K.law + .15, K.law + .95];
  function reach(t, name) {
    if (name === 'shaft') return len(TUN.shaft) * easeIn(clamp((t - SHAFT[0]) / (SHAFT[1] - SHAFT[0])), 1.4);
    const d = RUN * Math.max(0, t - SHAFT[1]);
    if (name === 'left' || name === 'right') return d;
    const at = name === 'downL' ? DX - 1450 : 3050 - DX; return Math.max(0, d - at);
  }
  const PAL = { paper: { earth: '#5e4632', strata: 'rgba(40,26,16,.25)', tun: '#2a2018', lining: '#8a6a4a', amber: P.amber, flow: '#f6cf7e' },
    lightbox: { earth: '#141230', strata: 'rgba(60,56,140,.35)', tun: '#07061a', lining: '#2e2a6e', amber: B.amber, flow: '#ffe0a0' } };
  function section(x, t, pal) {
    const a = secAt(t); if (a <= 0) return;
    x.save(); x.globalAlpha = a;
    x.fillStyle = pal.earth; x.fillRect(-900, SEC, 5600, 2000);
    x.fillStyle = pal.strata; for (let k = 0; k < 9; k++) { x.beginPath(); x.moveTo(-900, SEC + 90 + k * 110); for (let px = -900; px <= 4700; px += 100) x.lineTo(px, SEC + 90 + k * 110 + 14 * Math.sin(px * .006 + k)); x.lineTo(4700, SEC + 130 + k * 110); x.lineTo(-900, SEC + 130 + k * 110); x.fill(); }
    x.fillStyle = pal.lining; x.fillRect(-900, SEC - 6, 5600, 12);
    const tubes = [['shaft', 44], ['left', 84], ['right', 84], ['downL', 60], ['downR', 60]];
    for (const [n, w] of tubes) line(x, TUN[n], w + 16, pal.lining);
    x.fillStyle = pal.lining; x.fillRect(ROOM.x - ROOM.w / 2 - 8, ROOM.y - ROOM.h / 2 - 8, ROOM.w + 16, ROOM.h + 16); line(x, [[ROOM.x + 60, ROOM.y + ROOM.h / 2], [ROOM.x + 60, 1300]], 36, pal.lining);
    for (const [n, w] of tubes) line(x, TUN[n], w, pal.tun);
    x.fillStyle = pal.tun; x.fillRect(ROOM.x - ROOM.w / 2, ROOM.y - ROOM.h / 2, ROOM.w, ROOM.h); line(x, [[ROOM.x + 60, ROOM.y + ROOM.h / 2], [ROOM.x + 60, 1300]], 22, pal.tun);
    for (const [n, w] of tubes) line(x, upTo(TUN[n], reach(t, n)), w * .5, pal.amber);
    x.setLineDash([16, 26]); x.lineDashOffset = -t * 420;
    for (const [n, w] of tubes) line(x, upTo(TUN[n], reach(t, n)), w * .18, pal.flow);
    x.setLineDash([]);
    x.restore();
  }
  function streamGlows(ctx, t, cam, a) {
    FILM.sheet(ctx, cam, 1, W, H, R);
    const g = drainGlow(t); if (g > 0) PR.glow(ctx, DX, DY, 140, P.amber, .35 * g, 'lightbox');
    const s = secAt(t) * a; if (s <= 0) return;
    const d = reach(t, 'shaft'); if (d > 0) PR.glow(ctx, DX, DY + 12 + d, 160, B.amber, .45 * s, 'lightbox');
    for (const n of ['left', 'right', 'downL', 'downR']) { const r = reach(t, n); if (r <= 0) continue; const p = upTo(TUN[n], r).at(-1); PR.glow(ctx, p[0], p[1], 220, B.amber, .4 * s, 'lightbox'); }
    for (let k = 0; k < 7; k++) { const px = 1000 + k * 450; if (Math.abs(px - DX) <= reach(t, px < DX ? 'left' : 'right')) PR.glow(ctx, px, 1300, 260, B.amber, .22 * s, 'lightbox'); }
  }

  const Z = M45 ? { close: 2.3, mid: 1.2, wide: .66 } : { close: 3.2, mid: 1.6, wide: .74 };
  const END = M45 ? [2300, 1060] : [2350, 1000];
  const V0 = (() => { const c = S14.camera(T0); return [c.x, c.y, Math.log(c.z)]; })();
  const KEYS = [[0, V0], [1.15, [DX, DY + 2, Math.log(Z.close)]], [K.law, [DX + 4, DY + 4, Math.log(Z.close * 1.06)]], [K.move + .1, [DX, 1200, Math.log(Z.mid)]], [DUR + .8, [END[0], END[1], Math.log(Z.wide)]]];
  function camera(t) {
    const own = keyed(t, KEYS), c = S14.camera(T0 + t), s = [c.x, c.y, Math.log(c.z)], w = smooth(t / .9);
    const v = own.map((o, i) => lerp(s[i], o, w));
    return { x: v[0], y: v[1], z: Math.exp(v[2]) };
  }

  const NIGHT = t => smooth((t - K.law - .2) / 1.6);
  function scene(x, t, look) {
    const T = T0 + t, tp = pose(t);
    S14.street(x, T, pose(T));
    crumbs(x, tp, look === 'paper' ? P.eraser : B.eraser);
    if (look === 'lightbox') { x.fillStyle = 'rgba(8,8,34,.72)'; x.fillRect(-900, -900, 5600, SEC + 900); }
    section(x, t, PAL[look]);
  }
  function render(ctx, t, cam, look) {
    const L = look === 'paper' ? LP : LB;
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => scene(x, t, look), look === 'paper' ? { paperShadow: [4, 6, 5, .3] } : { glow: .35, glowBlur: 12 });
    streamGlows(ctx, t, cam, 1);
  }
  const [A1, a1] = FILM.canvas(W, H), [A2, a2] = FILM.canvas(W, H);
  function draw(ctx, t, cam = camera(t)) {
    const tp = pose(t), n = NIGHT(t);
    if (n <= 0) render(ctx, t, cam, 'paper');
    else if (n >= 1) render(ctx, t, cam, 'lightbox');
    else {
      for (const [c, x] of [[A1, a1], [A2, a2]]) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; x.clearRect(0, 0, W, H); }
      render(a1, t, cam, 'paper'); render(a2, t, cam, 'lightbox');
      ctx.drawImage(A1, 0, 0); ctx.globalAlpha = n; ctx.drawImage(A2, 0, 0); ctx.globalAlpha = 1;
    }
    const e = eraserAt(tp);
    if (e) LP.sheet(ctx, cam, 1, R, x => { x.save(); x.translate(e.p[0], e.p[1]); x.rotate(e.r); PR.eraser(x, P, 240); x.restore(); }, { paperShadow: e.down ? [4, 6, 4, .4] : [16, 22, 8, .3] });
    (n < .5 ? LP : LB).grade(ctx, T0 + t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.del, K.law, K.move, K.else],
    api: { DUR, camera, draw, render, scene, section, TUN, ROOM, SEC, K },
  });
})();
