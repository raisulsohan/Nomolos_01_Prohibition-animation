(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, rng } = FILM, PR = FILM.props;
  const ID = 'seq-18b', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S18 = FILM.getScene('seq-18').api, T0 = S18.DUR, { RS, RX, RY } = S18, L = S18.L, B = L.P, pose = L.pose;
  const K = { whoever: 0.201, controlled: 0.534, supply: 1.102, river: 2.203, cash: 2.57 };
  const K2 = [0.534,1.602];
  const TURN = K2[1] || K.controlled + 1;

  const PIPE_Y = 1400, VALVE = [-350, 1285];
  const line = (x, pts, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'butt'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); };
  const cashAt = t => smooth((t - TURN + .1) / .3);
  function under(x, t, tp) {
    x.fillStyle = '#140f22'; x.fillRect(-1600, 1060, 3800, 1000);
    x.fillStyle = 'rgba(60,56,140,.25)'; for (let k = 0; k < 6; k++) x.fillRect(-1600, 1120 + k * 130, 3800, 18);
    x.fillStyle = '#3a2418'; x.fillRect(-1600, 1000, 3800, 60);
    line(x, [[-1600, PIPE_Y], [2200, PIPE_Y]], 100, '#2e2a6e'); line(x, [[-1600, PIPE_Y], [2200, PIPE_Y]], 70, '#0c0a24');
    line(x, [[-1600, PIPE_Y], [VALVE[0], PIPE_Y]], 44, B.amber);
    x.setLineDash([26, 34]); x.lineDashOffset = -t * 320; line(x, [[-1600, PIPE_Y], [VALVE[0], PIPE_Y]], 12, '#ffe0a0'); x.setLineDash([]); x.lineDashOffset = 0;
    const c = cashAt(t);
    if (c < 1) line(x, [[VALVE[0], PIPE_Y], [2200, PIPE_Y]], 44 * (1 - c), B.amber);
    if (c > 0) {
      const g = rng(67);
      for (let k = 0; k < 150; k++) {
        const born = TURN + k * .022, u = t - born, jx = g() * 30, jy = (g() - .5) * 80, rot = (g() - .5) * .8; if (u < 0) continue;
        const px = VALVE[0] + 30 + u * 620 + jx, py = PIPE_Y + jy * Math.min(1, u * 3) + Math.sin(u * 6 + k) * 5; if (px > 2200) continue;
        x.save(); x.translate(px, py); x.rotate(rot + Math.sin(u * 3 + k) * .2); x.scale(1.3, 1.3);
        if (k % 3) { x.fillStyle = '#7f9c68'; x.fillRect(-26, -13, 52, 26); x.fillStyle = '#6a8656'; x.fillRect(-21, -8, 42, 16); x.fillStyle = '#9ab784'; x.beginPath(); x.arc(0, 0, 6, 0, TAU); x.fill(); }
        else { x.fillStyle = '#e8c35a'; x.beginPath(); x.arc(0, 0, 13, 0, TAU); x.fill(); x.strokeStyle = '#b8913a'; x.lineWidth = 2.5; x.beginPath(); x.arc(0, 0, 9, 0, TAU); x.stroke(); }
        x.restore();
      }
    }
    x.fillStyle = '#6a5a3a'; x.fillRect(VALVE[0] - 26, PIPE_Y - 70, 52, 40); x.fillRect(VALVE[0] - 8, VALVE[1], 16, PIPE_Y - 70 - VALVE[1]);
    const a = 1.2 * easeIO(clamp((t - TURN + .5) / .6));
    x.save(); x.translate(VALVE[0], VALVE[1]); x.rotate(a); x.strokeStyle = '#c8a050'; x.lineWidth = 14; x.beginPath(); x.arc(0, 0, 70, 0, TAU); x.stroke();
    x.lineWidth = 9; for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(k * Math.PI / 2) * 68, Math.sin(k * Math.PI / 2) * 68); x.stroke(); }
    x.fillStyle = '#a8842f'; x.beginPath(); x.arc(0, 0, 14, 0, TAU); x.fill(); x.restore();
    hand(x, t, tp);
  }
  const ELBOW = [380, 1760], RIM = [VALVE[0] + 70, VALVE[1]];
  function hand(x, t, tp) {
    const a = easeOut(clamp((tp - K.whoever - .1) / .7), 2); if (a <= 0) return;
    const h = [lerp(300, RIM[0], a), lerp(1650, RIM[1], a)];
    const o = { h, side: 1, r: 7, grip: .15 + .85 * smooth((tp - K.whoever - .7) / .3), skin: '#caa07a', s: .75, arm: Math.atan2(ELBOW[1] - h[1], ELBOW[0] - h[0]), style: 'fingers' };
    const w = FILM.hand.wrist(o), dx = w.p[0] - ELBOW[0], dy = w.p[1] - ELBOW[1], n = Math.hypot(dx, dy), nx = -dy / n, ny = dx / n, hw = w.w / 2;
    x.fillStyle = '#0c0b1a'; x.beginPath(); x.moveTo(ELBOW[0] + nx * hw * 2.4, ELBOW[1] + ny * hw * 2.4); x.lineTo(w.p[0] + nx * hw * 1.3, w.p[1] + ny * hw * 1.3); x.lineTo(w.p[0] - nx * hw * 1.3, w.p[1] - ny * hw * 1.3); x.lineTo(ELBOW[0] - nx * hw * 2.4, ELBOW[1] - ny * hw * 2.4); x.fill();
    const cf = [w.p[0] - dx / n * 26, w.p[1] - dy / n * 26];
    x.fillStyle = '#f0e8d6'; x.beginPath(); x.arc(cf[0], cf[1], hw * 1.25, 0, TAU); x.fill(); x.fillStyle = '#e8c35a'; x.beginPath(); x.arc(cf[0], cf[1], 5, 0, TAU); x.fill();
    FILM.hand.back(x, o); FILM.hand.front(x, o);
  }
  function glows(ctx, t) {
    const at = (lx, ly) => [RX + lx * RS, RY + ly * RS];
    for (let k = 0; k < 5; k++) { const p = at(-1400 + k * 260, PIPE_Y); PR.glow(ctx, p[0], p[1], 240 * RS, B.amber, .28, 'lightbox'); }
    const c = cashAt(t); if (c > 0) for (let k = 0; k < 6; k++) { const p = at(VALVE[0] + 200 + k * 360, PIPE_Y); PR.glow(ctx, p[0], p[1], 260 * RS, '#d8e0a0', .22 * c, 'lightbox'); }
  }

  const IN = (lx, ly, z) => [RX + lx * RS, RY + ly * RS, Math.log(z * (M45 ? .8 : 1) / RS)];
  const V0 = (() => { const c = S18.camera(T0); return [c.x, c.y, Math.log(c.z)]; })();
  const KEYS = [[0, V0], [K.supply - .1, IN(-340, 1330, 1.45)], [TURN + .2, IN(-250, 1350, 1.4)], [DUR, IN(300, 1390, 1.15)]];
  function camera(t) {
    const own = keyed(t, KEYS), c = S18.camera(T0 + t), s = [c.x, c.y, Math.log(c.z)], w = smooth(t / .5);
    const v = own.map((o, i) => lerp(s[i], o, w));
    return { x: v[0], y: v[1], z: Math.exp(v[2]) };
  }
  function draw(ctx, t) {
    const cam = camera(t), tp = pose(t);
    S18.draw(ctx, T0 + t, cam, t <= 0 ? undefined : (ctx, c) => {
      L.sheet(ctx, c, 1, R, x => { x.translate(RX, RY); x.scale(RS, RS); under(x, t, tp); }, { glow: .3, glowBlur: 12 });
      FILM.sheet(ctx, c, 1, W, H, R); glows(ctx, t);
    });
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.controlled, TURN, K.river],
  });
})();
