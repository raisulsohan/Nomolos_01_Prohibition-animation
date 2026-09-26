(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-37b', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const LP = FILM.look('paper', W, H), LB = FILM.look('lightbox', W, H), P = LP.P, B = LB.P, pose = LP.pose;
  const S37 = FILM.getScene('seq-37').api, T0 = S37.DUR, SAL = S37.SAL, HZ = S37.HZ;
  const K = { empire: 0.367, disappear: 2.069, syndicates: 3.504, changed: 6.34, product: 6.74,
    gambling: 7.975, narcotics: 9.543, labor: 11.145 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const UG = HZ + 260, ROOM = [SAL.x - 1100, HZ + 480, 2400, 620], BELT = HZ + 960, ARM = SAL.x + 60;

  function under(x, tp) {
    x.fillStyle = '#141232'; x.fillRect(SAL.x - 2400, UG, 4800, 2000);
    x.fillStyle = 'rgba(46,42,110,.5)'; for (let k = 0; k < 40; k++) { const g = rng(k + 3); x.fillRect(SAL.x - 2400 + g() * 4800, UG + 20 + g() * 180, 60 + g() * 90, 5); }
    const [rx, ry, rw, rh] = ROOM; x.fillStyle = '#2e2a6e'; x.fillRect(rx - 14, ry - 14, rw + 28, rh + 28); x.fillStyle = '#3e2c3c'; x.fillRect(rx, ry, rw, rh);
    for (const py of [ry + 40, ry + 80]) {
      x.strokeStyle = '#2e2a6e'; x.lineWidth = 26; x.lineCap = 'butt'; x.setLineDash([]); x.beginPath(); x.moveTo(rx - 800, py); x.lineTo(rx + rw + 800, py); x.stroke();
      x.strokeStyle = B.amber; x.lineWidth = 12; x.beginPath(); x.moveTo(rx - 800, py); x.lineTo(rx + rw + 800, py); x.stroke();
      x.save(); x.setLineDash([14, 22]); x.lineDashOffset = -tp * 160; x.strokeStyle = '#ffe3b0'; x.lineWidth = 4; x.beginPath(); x.moveTo(rx - 800, py); x.lineTo(rx + rw + 800, py); x.stroke(); x.restore();
    }
    x.strokeStyle = '#2e2a6e'; x.lineWidth = 22; x.beginPath(); x.moveTo(SAL.x - 300, UG + 20); x.lineTo(SAL.x - 300, ry + 40); x.stroke();
    x.fillStyle = '#1a1628'; x.fillRect(rx, BELT, rw, 40); x.fillStyle = '#3a3670'; for (let k = 0; k < rw / 60; k++) x.fillRect(rx + ((k * 60 + tp * 90) % rw), BELT + 4, 30, 6);
    for (let k = 0; k < rw / 200; k++) { x.fillStyle = '#0c0a24'; x.beginPath(); x.arc(rx + 100 + k * 200, BELT + 30, 14, 0, TAU); x.fill(); }
  }
  const STEPS = [K.changed - .8, K.gambling - .75, K.narcotics - .75, K.labor - .75], STAMPS = [K.syndicates + .3, K.changed + .1, K.gambling + .05, K.narcotics + .05, K.labor + .05];
  const shift = t => STEPS.reduce((a, s) => a + easeIO(clamp((t - s) / .6)), 0);
  const KIND = ['goods', 'goods', 'gambling', 'narcotics', 'labor', 'goods', 'goods'];
  function crate(x, k, t, tp) {
    const cx = ARM - (k - shift(t)) * 300, stamped = t > STAMPS[k], kind = KIND[k];
    x.save(); x.translate(cx, BELT);
    x.fillStyle = '#8a603f'; x.fillRect(-100, -150, 200, 150); x.fillStyle = 'rgba(40,24,14,.35)'; for (let s = 1; s < 4; s++) x.fillRect(-100, -150 + s * 37, 200, 4); x.fillRect(-100, -150, 6, 150); x.fillRect(94, -150, 6, 150);
    if (!stamped || kind === 'goods') {
      const open = kind === 'gambling' ? smooth((t - STAMPS[k] - .1) / .4) : 0; if (open < 1) for (let b = 0; b < 4; b++) { x.fillStyle = '#5a7a4a'; x.fillRect(-70 + b * 44, -178, 14, 30); }
    }
    x.fillStyle = '#e8d8b0'; x.fillRect(-64, -112, 128, 44); x.fillStyle = '#2c2824'; x.font = '900 22px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (!stamped) x.fillText(k % 2 ? 'GIN' : 'WHISKEY', 0, -90);
    else if (kind === 'goods') x.fillText('GOODS', 0, -90);
    else if (kind === 'gambling') x.fillText('DICE', 0, -90);
    else if (kind === 'narcotics') { x.fillStyle = '#8a603f'; x.fillRect(-66, -140, 132, 124); x.fillStyle = '#e8e4ec'; for (let p = 0; p < 5; p++) { const a = p / 5 * TAU - Math.PI / 2; x.beginPath(); x.ellipse(Math.cos(a) * 30, -80 + Math.sin(a) * 30, 28, 17, a, 0, TAU); x.fill(); } x.fillStyle = '#2c2824'; x.beginPath(); x.arc(0, -80, 15, 0, TAU); x.fill(); }
    else { x.fillStyle = '#8a603f'; x.fillRect(-66, -140, 132, 124); x.fillStyle = '#c8a040'; x.beginPath(); x.arc(0, -84, 50, 0, TAU); x.fill(); x.fillStyle = '#2c2824'; x.font = '900 20px NSC'; x.fillText('UNION', 0, -104); x.fillStyle = '#5a5a64'; x.fillRect(-26, -84, 52, 40); x.strokeStyle = '#5a5a64'; x.lineWidth = 9; x.beginPath(); x.arc(0, -84, 17, Math.PI, TAU); x.stroke(); x.fillStyle = '#1a1414'; x.fillRect(-3, -70, 6, 12); }
    if (kind === 'gambling' && stamped) {
      const u = back((t - STAMPS[k] - .1) / .45); if (u > 0) {
        for (const [dx, dy, r] of [[-40, -210, -.2], [36, -236, .25]]) { x.save(); x.translate(dx, dy * u); x.rotate(r); x.scale(u, u); x.fillStyle = '#f4f0e6'; x.beginPath(); x.roundRect(-30, -30, 60, 60, 10); x.fill(); x.fillStyle = '#1a1414'; for (const [px, py] of [[-14, -14], [0, 0], [14, 14], [14, -14], [-14, 14]]) { x.beginPath(); x.arc(px, py, 5, 0, TAU); x.fill(); } x.restore(); }
        for (const [dx, r, suit] of [[-90, -.4, '♠'], [-60, -.15, '♥'], [80, .3, '♣']]) { x.save(); x.translate(dx, -170 - 60 * u); x.rotate(r * u); x.scale(u, u); x.fillStyle = '#f4f0e6'; x.fillRect(-24, -34, 48, 68); x.fillStyle = suit === '♥' ? '#c9352b' : '#1a1414'; x.font = '900 30px NS'; x.fillText(suit, 0, 2); x.restore(); }
      }
    }
    x.restore();
  }
  function arm(x, t) {
    const press = Math.max(...STAMPS.map(s => { const u = (t - s + .15) / .35; return u > 0 && u < 1 ? Math.sin(u * Math.PI) : 0; }));
    x.fillStyle = '#2e2a6e'; x.fillRect(ARM - 20, ROOM[1], 40, BELT - 380 - ROOM[1] + 160 * press);
    x.fillStyle = '#5a5a74'; x.fillRect(ARM - 80, BELT - 240 + 160 * press - 60, 160, 60); x.fillStyle = '#ffcf80'; x.fillRect(ARM - 70, BELT - 240 + 160 * press - 6, 140, 6);
  }
  function crates(x, t, tp) { for (let k = 6; k >= 0; k--) crate(x, k, t, tp); arm(x, t); }

  const DOWN = M45 ? [ARM - 60, BELT - 260, 1.0] : [ARM - 80, BELT - 250, 1.2], FIN = M45 ? [ARM, BELT - 200, 1.4] : [ARM + 20, BELT - 190, 1.75];
  function camera(t) {
    const a = S37.streetCam(T0 + t), w = easeIO(clamp(t / 1.9)), u = easeIO(clamp((t - K.product) / (K.gambling - .3 - K.product)));
    const b = [lerp(DOWN[0], FIN[0], u), lerp(DOWN[1], FIN[1], u), Math.exp(lerp(Math.log(DOWN[2]), Math.log(FIN[2]), u))];
    return { x: lerp(a.x, b[0], w), y: lerp(a.y, b[1], w), z: Math.exp(lerp(Math.log(a.z), Math.log(b[2]), w)) };
  }
  const blend = t => smooth((t - .5) / 1.1);
  function paperFrame(ctx, t, cam) {
    const T = T0 + t, a = S37.t14(T), lit = clamp((S37.SHUT + .2 - a) / .5), tp = pose(t);
    LP.background(ctx);
    LP.sheet(ctx, cam, 1, R, x => { S37.street(x, T); if (t > 0) { under(x, tp); crates(x, t, tp); } }, { paperShadow: [4, 6, 5, .3], alpha: 1 });
    FILM.sheet(ctx, cam, 1, W, H, R); PR.glow(ctx, SAL.x, HZ - 80, 260, P.amber, .3 * lit, 'lightbox'); ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  function lightFrame(ctx, t, cam) {
    const tp = pose(t);
    LB.background(ctx);
    LB.sheet(ctx, cam, 1, R, x => { S37.street(x, T0 + t); under(x, tp); crates(x, t, tp); }, { glow: .35, glowBlur: 12 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    for (const px of [ROOM[0] + 300, ARM, ROOM[0] + ROOM[2] - 300]) PR.glow(ctx, px, ROOM[1] + 60, 360, B.amber, .35, 'lightbox');
    PR.glow(ctx, ARM, BELT - 180, 300, '#ffcf80', .3, 'lightbox');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  const NAMES = [['Gambling', K.gambling], ['Narcotics', K.narcotics], ['Labor racketeering', K.labor]];
  function names(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.textAlign = M45 ? 'center' : 'left'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 60 : 64}px NSC`;
    NAMES.forEach(([s, t0], i) => { const u = back((t - t0 + .05) / .3); if (u <= 0) return; const px = M45 ? W / 2 : 110, py = (M45 ? 130 : 130) + i * (M45 ? 78 : 84);
      ctx.save(); ctx.translate(px, py); ctx.scale(u, u); ctx.shadowColor = 'rgba(255,174,74,.5)'; ctx.shadowBlur = 24; ctx.fillStyle = '#ffe3b0'; ctx.fillText(s, 0, 0); ctx.restore(); });
    ctx.restore();
  }
  const [A1, a1] = FILM.canvas(W, H), [A2, a2] = FILM.canvas(W, H);
  function draw(ctx, t) {
    const cam = camera(t), u = blend(t);
    if (u <= 0) paperFrame(ctx, t, cam); else if (u >= 1) lightFrame(ctx, t, cam);
    else {
      for (const [, x] of [[A1, a1], [A2, a2]]) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; x.clearRect(0, 0, W, H); }
      paperFrame(a1, t, cam); lightFrame(a2, t, cam); ctx.drawImage(A1, 0, 0); ctx.globalAlpha = u; ctx.drawImage(A2, 0, 0); ctx.globalAlpha = 1;
    }
    names(ctx, t);
    (u < .5 ? LP : LB).grade(ctx, T0 + t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.disappear, K.changed, K.gambling, K.narcotics, K.labor],
  });
})();
