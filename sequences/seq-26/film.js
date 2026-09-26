(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, polyPath, rng } = FILM;
  const ID = 'seq-26', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('flat', W, H), P = L.P;
  const K = { gangs: 0, fought: 0.568, wars: 1.268, territory: 1.769, supply: 2.503, routes: 2.903 };
  const RED = '#c9352b', back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const SHORE = [[1290, -500], [1330, 60], [1300, 300], [1335, 470], [1360, 760], [1400, 1100], [1440, 1600]];
  const LAND = [[-600, -500], ...SHORE, [-600, 1600]];
  const FORK = [1010, 480], MOUTH = [1318, 470], NB = [[FORK[0], FORK[1]], [960, 300], [900, 60], [870, -500]], SB = [[FORK[0], FORK[1]], [930, 620], [860, 820], [800, 1600]];
  const TER = [
    { name: 'NORTH SIDE', col: '#4f7a8a', at: [1120, 170], poly: [[870, -500], [900, 60], [960, 300], FORK, MOUTH, [1340, 470], [1340, -500]] },
    { name: 'WEST SIDE', col: '#7a6a9a', at: [560, 380], poly: [[-600, -500], [870, -500], [900, 60], [960, 300], FORK, [930, 620], [860, 820], [-600, 820]] },
    { name: 'SOUTH SIDE', col: '#d69a3a', at: [1150, 760], poly: [FORK, MOUTH, [1340, 470], [1460, 1600], [800, 1600], [860, 820], [930, 620]] },
    { name: '', col: '#8a9a5a', at: [470, 1060], poly: [[-600, 820], [860, 820], [800, 1600], [-600, 1600]] }];
  TER.forEach((r, i) => { r.t = K.gangs - .05 + i * .16; });

  const ROUTES = [{ c: 0, pts: [[1220, 60], [760, 520], [700, 980]] }, { c: 2, pts: [[1300, 1000], [1080, 680], [880, 180]] }, { c: 1, pts: [[380, 330], [1160, 880]] }, { c: 3, pts: [[520, 1080], [1060, 250]] }];
  ROUTES.forEach((r, i) => { r.t = K.supply - .15 + i * .14; r.len = r.pts.slice(1).reduce((a, p, k) => a + Math.hypot(p[0] - r.pts[k][0], p[1] - r.pts[k][1]), 0); });
  const segs = ROUTES.flatMap((r, i) => r.pts.slice(1).map((p, k) => ({ r: i, a: r.pts[k], b: p })));
  const CROSS = (() => {
    const out = [];
    for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
      const s = segs[i], q = segs[j]; if (s.r === q.r) continue;
      const d = (s.b[0] - s.a[0]) * (q.b[1] - q.a[1]) - (s.b[1] - s.a[1]) * (q.b[0] - q.a[0]); if (!d) continue;
      const u = ((q.a[0] - s.a[0]) * (q.b[1] - q.a[1]) - (q.a[1] - s.a[1]) * (q.b[0] - q.a[0])) / d, v = ((q.a[0] - s.a[0]) * (s.b[1] - s.a[1]) - (q.a[1] - s.a[1]) * (s.b[0] - s.a[0])) / d;
      if (u > 0 && u < 1 && v > 0 && v < 1) out.push({ p: [lerp(s.a[0], s.b[0], u), lerp(s.a[1], s.b[1], u)] });
    }
    return out.map((c, i) => ({ ...c, t: K.routes + .15 + i * .09 }));
  })();
  const BORDER = (() => { const g = rng(26), pts = [...NB, ...SB, [FORK[0] - 10, FORK[1]], [930, 820], [500, 820], [200, 820]]; return [0, 1, 2, 3, 4, 5].map(k => ({ p: pts[Math.floor(g() * pts.length)], t: K.fought + .15 + k * .12 })); })();

  function map(x, t) {
    x.fillStyle = '#0c1422'; x.fillRect(-3000, -3000, 8000, 8000);
    x.fillStyle = P.sheet; polyPath(x, LAND); x.fill();
    x.save(); polyPath(x, LAND); x.clip();
    x.strokeStyle = 'rgba(40,50,70,.12)'; x.lineWidth = 2; x.lineCap = 'butt';
    for (let gx = -600; gx < 1500; gx += 80) { x.beginPath(); x.moveTo(gx, -600); x.lineTo(gx, 1700); x.stroke(); }
    for (let gy = -600; gy < 1700; gy += 80) { x.beginPath(); x.moveTo(-700, gy); x.lineTo(1500, gy); x.stroke(); }
    for (const r of TER) {
      const u = easeOut(clamp((t - r.t) / .35)); if (u <= 0) continue;
      x.save(); polyPath(x, r.poly); x.clip(); x.beginPath(); x.arc(r.at[0], r.at[1], 1400 * u, 0, TAU); x.fillStyle = FILM.rgba(FILM.hex(r.col), .82); x.fill(); x.restore();
    }
    x.restore();
    x.strokeStyle = '#0c1422'; x.lineWidth = 16; x.lineCap = 'round'; x.lineJoin = 'round';
    for (const b of [[MOUTH, FORK], NB, SB]) { x.beginPath(); x.moveTo(b[0][0], b[0][1]); for (const p of b.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); }
    x.strokeStyle = 'rgba(12,20,34,.55)'; x.lineWidth = 4; x.setLineDash([14, 10]); x.lineDashOffset = 0;
    x.beginPath(); x.moveTo(-600, 820); x.lineTo(860, 820); x.stroke(); x.setLineDash([]);
    x.save(); x.translate(M45 ? 1462 : 1560, 560); x.rotate(Math.PI / 2); x.fillStyle = 'rgba(243,234,214,.55)'; x.font = '900 40px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('L A K E   M I C H I G A N', 0, 0); x.restore();
  }
  function arrows(x, t) {
    for (const r of ROUTES) {
      const u = easeIO(clamp((t - r.t) / .55)); if (u <= 0) continue;
      const col = FILM.hex(TER[r.c].col).map(v => v * .7), d = r.len * u;
      let s = 0, tip = r.pts[0], dir = 0; x.strokeStyle = 'rgba(12,20,34,.9)'; x.lineWidth = 34; x.lineCap = 'round'; x.lineJoin = 'round';
      const path = () => { x.beginPath(); x.moveTo(r.pts[0][0], r.pts[0][1]); s = 0; for (let k = 1; k < r.pts.length; k++) { const a = r.pts[k - 1], b = r.pts[k], l = Math.hypot(b[0] - a[0], b[1] - a[1]); dir = Math.atan2(b[1] - a[1], b[0] - a[0]); if (s + l >= d) { tip = [lerp(a[0], b[0], (d - s) / l), lerp(a[1], b[1], (d - s) / l)]; x.lineTo(tip[0], tip[1]); return; } x.lineTo(b[0], b[1]); s += l; } };
      path(); x.stroke(); path(); x.strokeStyle = FILM.rgba(col); x.lineWidth = 22; x.stroke();
      x.save(); x.translate(tip[0], tip[1]); x.rotate(dir); x.fillStyle = 'rgba(12,20,34,.9)'; polyPath(x, [[40, 0], [-20, -34], [-20, 34]]); x.fill(); x.fillStyle = FILM.rgba(col); polyPath(x, [[30, 0], [-12, -24], [-12, 24]]); x.fill(); x.restore();
    }
  }
  function burst(x, p, u, s) {
    const a = 1 - smooth((u - .5) / .5), k = back(u / .4) * s; if (a <= 0) return;
    x.save(); x.translate(p[0], p[1]); x.globalAlpha = a; x.fillStyle = RED; x.beginPath();
    for (let i = 0; i < 16; i++) { const q = i / 16 * TAU, rr = (i % 2 ? 22 : 54) * k; x.lineTo(rr * Math.cos(q), rr * Math.sin(q)); } x.fill();
    x.fillStyle = '#ffe0b0'; x.beginPath(); x.arc(0, 0, 14 * k, 0, TAU); x.fill(); x.restore();
  }
  function labels(ctx, x, t) {
    for (const r of TER) {
      if (!r.name) continue; const u = back((t - K.territory + .1 - (r.name === 'WEST SIDE' ? .1 : r.name === 'SOUTH SIDE' ? .2 : 0)) / .25); if (u <= 0) continue;
      x.save(); x.translate(r.at[0], r.at[1]); x.scale(u, u); x.font = '900 46px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle';
      const w = x.measureText(r.name).width + 40; x.fillStyle = 'rgba(12,20,34,.85)'; x.beginPath(); x.roundRect(-w / 2, -34, w, 68, 6); x.fill();
      x.fillStyle = '#f3ead6'; x.fillText(r.name, 0, 2); x.restore();
    }
  }

  const camera = t => ({ x: M45 ? 900 : 930, y: M45 ? 560 : 520, z: (M45 ? .78 : 1) * (1 + .06 * smooth(t / DUR)) });
  function draw(ctx, t) {
    const cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => {
      map(x, t); arrows(x, t); labels(ctx, x, t);
      for (const b of BORDER) burst(x, b.p, (t - b.t) / .45, .8);
      for (const c of CROSS) burst(x, c.p, (t - c.t) / .5, 1.2);
    }, {});
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.gangs, K.wars, K.territory, K.supply, K.routes],
  });
})();
