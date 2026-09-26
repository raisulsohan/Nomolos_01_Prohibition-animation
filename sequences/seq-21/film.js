(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath } = FILM, PR = FILM.props;
  const ID = 'seq-21', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('flat', W, H), P = L.P, pose = L.pose;
  const K = { chicago: 0.233, capone: 0.968, bootlegging: 1.768, height: 3.704, sixty: 6.44,
    million: 7.007, year: 7.741, twenties: 8.942, money: 9.977 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const WIDE = 1320 * 5.5;
  const M = (() => { const m0 = FILM.usmap({ width: WIDE, cx: 0, cy: 0 }), p = m0.proj([-87.63, 41.88]); return FILM.usmap({ width: WIDE, cx: 960 - p[0], cy: 540 - p[1] }); })();
  const CHI = M.proj([-87.63, 41.88]);
  function map(x) {
    x.fillStyle = '#0c1422'; x.fillRect(-6000, -6000, 14000, 14000);
    x.fillStyle = '#1b2638'; polyPath(x, M.canada); x.fill(); polyPath(x, M.mexico); x.fill();
    x.fillStyle = P.sheet; polyPath(x, M.us); x.fill();
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; for (const l of Object.values(M.lakes)) { polyPath(x, l); x.fill(); } x.globalCompositeOperation = 'source-over';
  }
  const ROUTES = [[[-83.0, 42.4], [-85.4, 41.9], [-87.63, 41.88]], [[-79.9, 43.3], [-83.5, 41.6], [-86.9, 41.6], [-87.63, 41.88]], [[-90.2, 38.6], [-89.0, 40.2], [-87.63, 41.88]],
    [[-94.6, 39.1], [-91.0, 41.3], [-87.63, 41.88]], [[-93.3, 45.0], [-89.4, 43.1], [-87.63, 41.88]], [[-84.5, 39.1], [-86.3, 40.4], [-87.63, 41.88]]]
    .map((pts, i) => ({ pts: pts.map(p => M.proj(p)), t0: K.capone + .1 + i * .3 }));
  const len = pts => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  function along(pts, u) { const L0 = len(pts) * u; let s = 0; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (s + l >= L0) { const k = (L0 - s) / l; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])]; } s += l; } const b = pts[pts.length - 1]; return [b[0], b[1], 0]; }
  function routes(x, t, cam) {
    const s = 1 / cam.z;
    for (const r of ROUTES) {
      const u = easeIO(clamp((t - r.t0) / 2.2)); if (u <= 0) continue;
      x.strokeStyle = 'rgba(242,163,58,.85)'; x.lineWidth = 6 * s; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
      const L0 = len(r.pts) * u; let d = 0; x.moveTo(r.pts[0][0], r.pts[0][1]);
      for (let i = 1; i < r.pts.length; i++) { const a = r.pts[i - 1], b = r.pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d + l <= L0) { x.lineTo(b[0], b[1]); d += l; } else { const k = (L0 - d) / l; x.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); break; } }
      x.stroke();
      for (let k = 0; k < 3; k++) {
        const v = ((t - r.t0) * .35 + k / 3) % 1; if (v > u) continue; const [px, py, a] = along(r.pts, v);
        x.save(); x.translate(px, py); x.rotate(a); x.scale(2.4 * s, 2.4 * s); x.fillStyle = '#0c1422'; x.fillRect(-12, -6, 16, 12); x.fillRect(4, -4, 8, 9); x.fillStyle = '#ffd48a'; x.fillRect(11, -2, 2, 3); x.restore();
      }
    }
    const lab = back((t - K.chicago - .02) / .3);
    if (lab > 0) { x.save(); x.translate(CHI[0] + 70 * s, CHI[1] - 40 * s); x.scale(lab * s, lab * s); x.font = '900 46px NSC'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillStyle = '#1b2130'; x.fillText('CHICAGO', 3, 3); x.fillStyle = '#f5ecd8'; x.fillText('CHICAGO', 0, 0); x.restore(); }
    x.fillStyle = '#f2a33a'; x.beginPath(); x.arc(CHI[0], CHI[1], 12 * s * (1 + .25 * Math.sin(t * 4)), 0, TAU); x.fill();
  }

  const ROLL = [K.sixty - .1, K.million + .55];
  function counter(ctx, t) {
    const a = smooth((t - ROLL[0] + .1) / .25); if (a <= 0) return;
    const v = Math.round(60000000 * easeOut(clamp((t - ROLL[0]) / (ROLL[1] - ROLL[0])), 3)), txt = '$' + v.toLocaleString('en-US');
    const gold = smooth((t - K.twenties + .1) / .5);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
    const cx = W / 2, cy = M45 ? H - 380 : H - 280, w = M45 ? 960 : 1060, h = M45 ? 250 : 220;
    ctx.fillStyle = 'rgba(8,12,22,.82)'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 12); ctx.fill();
    ctx.strokeStyle = FILM.rgba(FILM.hex('#c8a050'), .4 + .6 * gold); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 8, cy - h / 2 + 8, w - 16, h - 16, 8); ctx.stroke();
    const col = FILM.hex('#f5ecd8').map((c, i) => Math.round(lerp(c, FILM.hex('#d4a84a')[i], gold)));
    ctx.fillStyle = FILM.rgba(col, 1); ctx.font = `900 ${M45 ? 116 : 120}px NSC`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, cx, cy - 22);
    const yr = smooth((t - K.year + .05) / .3); if (yr > 0) { ctx.globalAlpha = a * yr; ctx.font = '600 38px NS'; ctx.fillText('A YEAR', cx, cy + 66); }
    const st = clamp((t - K.money + .1) / .15);
    if (st > 0) {
      ctx.globalAlpha = 1; ctx.translate(cx, cy + h / 2 + 62); ctx.rotate(-.05); ctx.scale(lerp(1.6, 1, easeIn(st, 2)), lerp(1.6, 1, easeIn(st, 2)));
      ctx.fillStyle = 'rgba(8,12,22,.75)'; ctx.fillRect(-230, -40, 460, 80); ctx.strokeStyle = '#d4a84a'; ctx.lineWidth = 5; ctx.strokeRect(-222, -32, 444, 64); ctx.fillStyle = '#d4a84a'; ctx.font = '900 48px NSC'; ctx.fillText('IN 1920s MONEY', 0, 3);
    }
    ctx.restore();
  }

  const mz = M45 ? .72 : 1;
  const KEYS = [[0, [CHI[0] + 300, CHI[1] + 250, Math.log(.4 * mz)]], [K.height, [CHI[0] + 250, CHI[1] + 250, Math.log(.44 * mz)]], [K.sixty, [CHI[0] + 100, CHI[1] + 260, Math.log(.62 * mz)]], [DUR, [CHI[0] + 80, CHI[1] + 250, Math.log(.68 * mz)]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  function draw(ctx, t) {
    const cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { map(x); routes(x, t, cam); }, {});
    FILM.sheet(ctx, cam, 1, W, H, R); PR.glow(ctx, CHI[0], CHI[1], 260, '#f2a33a', .35 * smooth((t - K.capone) / 1.5), 'flat');
    counter(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.chicago, K.sixty, K.year, K.money],
  });
})();
