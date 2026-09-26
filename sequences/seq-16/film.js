(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, clamp, lerp, polyPath } = FILM, PR = FILM.props;
  const ID = 'seq-16', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { word: 0 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const LEG = M45 ? [540, 1260] : [640, 1000], TOPB = -380;
  function leg(x) {
    x.save(); x.translate(LEG[0], LEG[1]);
    x.fillStyle = '#3a3a78'; polyPath(x, [[-72, -900], [72, -900], [66, TOPB + 20], [-68, TOPB + 20]]); x.fill();
    x.fillStyle = '#2c2c60'; polyPath(x, [[20, -900], [72, -900], [66, TOPB + 20], [30, TOPB + 20]]); x.fill();
    x.strokeStyle = '#26264e'; x.lineWidth = 4; x.beginPath(); x.moveTo(-40, -700); x.quadraticCurveTo(0, -660, 30, -690); x.moveTo(-50, -560); x.quadraticCurveTo(-10, -530, 24, -556); x.stroke();
    x.restore();
  }
  function boot(x) {
    x.save(); x.translate(LEG[0], LEG[1]);
    x.fillStyle = '#6a4434'; polyPath(x, [[-86, TOPB], [86, TOPB], [80, -60], [200, -40], [215, 0], [-90, 0]]); x.fill();
    x.fillStyle = '#7e5440'; x.fillRect(-92, TOPB - 6, 184, 26);
    x.fillStyle = '#241620'; x.fillRect(-90, -14, 310, 14); x.fillRect(-90, -30, 60, 16);
    x.strokeStyle = 'rgba(255,190,120,.25)'; x.lineWidth = 3; x.beginPath(); x.moveTo(-60, TOPB + 60); x.lineTo(-56, -70); x.stroke();
    x.restore();
  }
  function flask(x, t) {
    const u = easeIn(clamp((t - K.word + .05) / .45), 1.8), y = lerp(TOPB - 330, TOPB + 190, u);
    x.save(); x.translate(LEG[0] + 22, LEG[1]); x.beginPath(); x.rect(-300, -2000, 600, 2000 + TOPB + 4); x.clip(); x.translate(0, y); x.rotate(.06);
    x.fillStyle = '#9aa0c4'; x.beginPath(); x.roundRect(-44, -110, 88, 190, 16); x.fill();
    x.fillStyle = '#c8ccec'; x.fillRect(-30, -96, 12, 160);
    x.fillStyle = '#7a80a8'; x.fillRect(-14, -140, 28, 32); x.fillStyle = '#5a608a'; x.fillRect(-18, -150, 36, 14);
    x.fillStyle = 'rgba(255,179,77,.55)'; x.fillRect(-40, 10, 80, 64);
    x.restore();
  }
  function title(ctx, t) {
    const u = back((t - K.word - .02) / .28); if (u <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const cx = M45 ? W / 2 : 1330, cy = M45 ? 300 : H / 2;
    ctx.translate(cx, cy); ctx.scale(u, u); ctx.globalAlpha = clamp(u * 2);
    ctx.font = `900 ${M45 ? 124 : 132}px NSC`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,174,74,.55)'; ctx.shadowBlur = 36; ctx.fillStyle = '#ffe3b0'; ctx.fillText('BOOTLEGGING', 0, 0);
    ctx.restore();
  }

  const cam = t => ({ x: M45 ? 540 : 930, y: M45 ? 780 : 640, z: (M45 ? 1.05 : 1.12) + .04 * smooth(t / DUR) });
  function draw(ctx, t) {
    const c = cam(t);
    L.background(ctx);
    L.sheet(ctx, c, 1, R, x => { leg(x); flask(x, pose(t)); boot(x); }, { glow: .5, glowBlur: 16 });
    FILM.sheet(ctx, c, 1, W, H, R); PR.glow(ctx, LEG[0] + 20, LEG[1] + TOPB, 260, B.amber, .22, 'lightbox');
    title(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.word],
  });
})();
