(() => {
  'use strict';
  const { TAU, smooth, easeOut, clamp, lerp, rng } = FILM, PR = FILM.props;
  const ID = 'seq-20', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { face: 0.267, al: 1.268, capone: 1.502 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const AT = M45 ? [620, 1180] : [760, 1010], S = M45 ? 9.5 : 9.2;
  const lit = t => smooth((t - K.face) / .8);
  function scene(x, t, tp) {
    x.fillStyle = '#0e0c28'; x.fillRect(-500, -500, 3000, 2500);
    x.fillStyle = FILM.rgba(FILM.hex('#ffcf80'), .55 * (1 - .5 * lit(t))); x.fillRect(AT[0] - 330, AT[1] - 760, 660, 700);
    x.fillStyle = '#0e0c28'; x.fillRect(AT[0] - 12, AT[1] - 760, 24, 700); x.fillRect(AT[0] - 330, AT[1] - 420, 660, 20);
    x.fillStyle = 'rgba(14,12,40,.35)'; for (let k = 0; k < 14; k++) x.fillRect(AT[0] - 330, AT[1] - 740 + k * 50, 660, 8);
    x.save(); x.translate(AT[0], AT[1]); x.scale(S, S); PR.caponeLit(x, B, { lit: lit(t), ember: .6 + .3 * Math.sin(t * 3), grin: .3 * lit(t) });
    const e = PR.CAPONE_EMBER; x.translate(e[0], e[1]); PR.smoke(x, t, 0, .09); x.restore();
  }
  function title(ctx, t) {
    const u = back((t - K.al + .02) / .3); if (u <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(M45 ? W / 2 : 1505, M45 ? 170 : H / 2 - 20); ctx.scale(u, u); ctx.globalAlpha = clamp(u * 2);
    ctx.font = `900 ${M45 ? 110 : 110}px NSC`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,174,74,.5)'; ctx.shadowBlur = 30; ctx.fillStyle = '#ffe3b0'; ctx.fillText('AL CAPONE', 0, 0); ctx.restore();
  }
  const cam = t => ({ x: M45 ? 560 : 900, y: M45 ? 700 : 560, z: (M45 ? 1 : 1) * (1 + .05 * smooth(t / DUR)) });
  function draw(ctx, t) {
    const c = cam(t), tp = pose(t);
    L.background(ctx);
    L.sheet(ctx, c, 1, R, x => scene(x, t, tp), { glow: .45, glowBlur: 16 });
    FILM.sheet(ctx, c, 1, W, H, R);
    PR.glow(ctx, AT[0] - 400, AT[1] - 500, 700, '#ffd9a0', .3 * lit(t), 'lightbox');
    const e = [AT[0] + PR.CAPONE_EMBER[0] * S, AT[1] + PR.CAPONE_EMBER[1] * S]; PR.glow(ctx, e[0], e[1], 60, '#ff8a3a', .5, 'lightbox');
    title(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.face, K.al],
  });
})();
