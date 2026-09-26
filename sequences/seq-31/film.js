(() => {
  'use strict';
  const { TAU, smooth, easeOut, clamp, lerp, polyPath } = FILM;
  const ID = 'seq-31', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { violence: 1.368, corruption: 2.168, bodies: 3.103, drink: 4.704, less: 5.105 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const land = (t, t0) => clamp((t - t0) / .35);
  const PIV = [960, 250], ARM = 390, DROP = 250;
  const ITEMS = [{ k: 'gun', t: K.violence - .2, dx: -60, w: .09 }, { k: 'tag', t: K.corruption - .2, dx: -40, w: .07 }, { k: 'coffin', t: K.bodies - .2, dx: 72, w: .11 }];
  function tilt(t) {
    let a = 0; for (const it of ITEMS) { const u = (t - it.t - .35); if (u > 0) a += it.w * (1 + .35 * Math.exp(-u * 6) * Math.sin(u * 18)); } return a;
  }
  function gun(x) {
    x.fillStyle = '#2c2824'; polyPath(x, [[-70, -18], [30, -18], [34, -8], [-60, -8]]); x.fill(); x.beginPath(); x.roundRect(-22, -26, 56, 24, 6); x.fill();
    polyPath(x, [[20, -6], [44, -6], [58, 30], [36, 34]]); x.fill(); x.beginPath(); x.arc(12, 2, 10, 0, Math.PI); x.lineWidth = 4; x.strokeStyle = '#2c2824'; x.stroke();
  }
  function tag(x) {
    x.fillStyle = '#e9d7a8'; polyPath(x, [[-50, -2], [-34, -24], [44, -24], [44, 20], [-34, 20]]); x.fill(); x.strokeStyle = '#b89a60'; x.lineWidth = 3; x.beginPath(); x.arc(-32, -2, 6, 0, TAU); x.stroke();
    x.fillStyle = '#2c2824'; x.font = '900 26px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('$', 6, -1);
  }
  function coffin(x) { x.fillStyle = '#4a3226'; polyPath(x, [[-80, 0], [-96, -26], [-60, -44], [80, -44], [96, -22], [80, 0]]); x.fill(); x.fillStyle = '#6b4a34'; x.fillRect(-50, -30, 100, 6); }
  function coffinUp(x) { x.fillStyle = '#4a3226'; polyPath(x, [[-24, 0], [-44, -128], [-28, -196], [28, -196], [44, -128], [24, 0]]); x.fill(); x.fillStyle = '#6b4a34'; x.fillRect(-4, -170, 8, 140); }
  function glass(x, u) {
    x.save(); x.scale(u, u); x.fillStyle = 'rgba(245,236,216,.55)'; polyPath(x, [[-36, -80], [36, -80], [28, 0], [-28, 0]]); x.fill();
    x.strokeStyle = '#efe4c8'; x.lineWidth = 4; x.stroke(); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(-26, -72, 8, 60); x.restore();
  }
  function scale(x, t, tp) {
    const a = tilt(t), c = Math.cos(a), s = Math.sin(a), Lp = [PIV[0] - ARM * c, PIV[1] + ARM * s], Rp = [PIV[0] + ARM * c, PIV[1] - ARM * s];
    x.fillStyle = '#5a3a22'; x.fillRect(PIV[0] - 16, PIV[1], 32, 560); x.fillRect(PIV[0] - 150, PIV[1] + 540, 300, 36);
    x.fillStyle = '#c8a050'; x.save(); x.translate(PIV[0], PIV[1]); x.rotate(-a); x.fillRect(-ARM - 10, -9, 2 * ARM + 20, 18); x.restore();
    x.beginPath(); x.arc(PIV[0], PIV[1], 18, 0, TAU); x.fill();
    for (const [e, side] of [[Lp, -1], [Rp, 1]]) {
      const pan = [e[0], e[1] + DROP];
      x.strokeStyle = '#8a7048'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); for (const dx of [-110, 0, 110]) { x.moveTo(e[0], e[1]); x.lineTo(pan[0] + dx, pan[1] - 6); } x.stroke();
      x.fillStyle = '#c8a050'; x.beginPath(); x.moveTo(pan[0] - 130, pan[1] - 6); x.quadraticCurveTo(pan[0], pan[1] + 50, pan[0] + 130, pan[1] - 6); x.closePath(); x.fill();
      if (side < 0) for (const it of ITEMS) {
        const u = land(t, it.t); if (u <= 0) continue; const y = lerp(pan[1] - 700, pan[1] - 8, u * u);
        x.save(); x.translate(pan[0] + it.dx, y - (it.k === 'coffin' ? 0 : it.k === 'tag' ? 48 : 10)); if (it.k === 'gun') gun(x); else if (it.k === 'tag') { x.rotate(-.18); tag(x); } else coffinUp(x); x.restore();
      } else {
        x.save(); x.translate(pan[0], pan[1] - 8); glass(x, back((t - K.drink + .1) / .3)); x.restore();
        const q = back((t - K.less + .05) / .3); if (q > 0) { x.save(); x.translate(pan[0] + 95, pan[1] - 120 + 6 * Math.sin(tp * 3)); x.scale(q, q); x.fillStyle = '#2c2824'; x.font = '900 170px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('?', 0, 0); x.restore(); }
      }
    }
  }
  const camera = t => ({ x: 960, y: M45 ? 480 : 440, z: (M45 ? .92 : 1.3) * (1 + .06 * smooth(t / DUR)) });
  function draw(ctx, t) {
    const cam = camera(t), tp = pose(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => scale(x, t, tp), { paperShadow: [8, 10, 6, .35] });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.violence, K.corruption, K.bodies, K.drink, K.less],
  });
})();
