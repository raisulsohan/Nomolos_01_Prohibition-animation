(() => {
  'use strict';
  const { smooth, easeIO, clamp, lerp } = FILM, PR = FILM.props;
  const ID = 'seq-33', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose, PP = FILM.look('paper', W, H).P;
  const K = { fail: 1.502, badly: 2.136, opposite: 3.37, promised: 4.438 };
  const SL = M45 ? [[960, 150], [960, 470], [960, 790]] : [[450, 520], [960, 520], [1470, 520]], SS = M45 ? 1.1 : 1.3;
  const away = t => easeIO(clamp((t - K.fail + .1) / 1.4));
  function slide(x, i, t, tp) {
    const [cx, cy] = SL[i], a = away(t), dir = i === 1 ? (M45 ? 1 : -1) : i === 0 ? -1 : 1;
    x.save(); x.translate(cx, cy); x.transform(1 - .22 * a, .06 * a * dir, 0, 1, 0, 0); x.scale(SS, SS);
    x.fillStyle = '#1a1210'; x.fillRect(-172, -132, 344, 264);
    if (i === 0) PR.promisePrison(x, PP, 1); else if (i === 1) PR.promiseSlum(x, PP, 1); else PR.promiseHome(x, PP, 1, 1, tp);
    x.fillStyle = `rgba(6,4,16,${.1 + .45 * a})`; x.fillRect(-150, -110, 300, 220);
    x.restore();
  }
  const camera = t => ({ x: 960, y: M45 ? 520 : 540, z: (M45 ? 1 : 1) * lerp(.95, 1.04, smooth(t / DUR)) });
  function draw(ctx, t) {
    const cam = camera(t), tp = pose(t), up = smooth(t / .6), a = away(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { x.fillStyle = '#05040c'; x.fillRect(-1000, -1000, 4000, 3000); x.globalAlpha = up; for (let i = 0; i < 3; i++) slide(x, i, t, tp); x.globalAlpha = 1; }, { glow: .5, glowBlur: 16 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    for (const [cx, cy] of SL) PR.glow(ctx, cx, cy, 330 * SS, '#ffcf80', (.45 - .25 * a) * up, 'lightbox');
    const o = smooth((t - K.opposite + .05) / .35); if (o > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = o; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 96 : 104}px NSC`;
      ctx.shadowColor = 'rgba(255,174,74,.5)'; ctx.shadowBlur = 28; ctx.fillStyle = '#ffe3b0'; ctx.fillText('The opposite', W / 2, M45 ? H - 110 : H - 120); ctx.restore();
    }
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.fail, K.opposite],
  });
})();
