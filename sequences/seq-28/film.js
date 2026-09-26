(() => {
  'use strict';
  const { TAU, smooth, easeIO, clamp, lerp, rng } = FILM, PR = FILM.props;
  const ID = 'seq-28', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P;
  const K = { darkest: 0.868, era: 2.403, the: 3.404, poison: 3.571 };

  const TOP = -300, CORD = 620, BOT = [960, 860], BH = 360, BR = 78;
  const swing = t => .2 * Math.sin(t * 1.9 + .6);
  const bulbAt = t => [960 + CORD * Math.sin(swing(t)), TOP + CORD * Math.cos(swing(t))];
  const turn = t => Math.PI / 2 * (1 - easeIO(clamp((t - K.the + .05) / .6)));

  function skull(x, s) {
    x.save(); x.scale(s, s); x.fillStyle = '#1a1414'; x.strokeStyle = '#1a1414'; x.lineWidth = 5; x.lineCap = 'round';
    x.beginPath(); x.moveTo(-26, 30); x.lineTo(26, 58); x.moveTo(26, 30); x.lineTo(-26, 58); x.stroke();
    for (const [bx, by] of [[-26, 30], [26, 58], [26, 30], [-26, 58]]) { x.beginPath(); x.arc(bx + Math.sign(bx) * 2, by - 3, 4, 0, TAU); x.arc(bx + Math.sign(bx) * 2, by + 3, 4, 0, TAU); x.fill(); }
    x.beginPath(); x.arc(0, 0, 22, 0, TAU); x.fill(); x.fillRect(-12, 14, 24, 14);
    x.fillStyle = '#efe4c8'; x.beginPath(); x.arc(-8, -2, 6, 0, TAU); x.arc(8, -2, 6, 0, TAU); x.fill(); x.beginPath(); x.moveTo(0, 6); x.lineTo(-3, 12); x.lineTo(3, 12); x.fill();
    for (let k = -1; k <= 1; k++) x.fillRect(k * 6 - 1, 18, 2, 8);
    x.restore();
  }
  function bottle(x, t) {
    const [bx, by] = BOT, top = by - BH;
    x.fillStyle = '#16100e'; x.fillRect(-600, by, 3200, 40); x.fillStyle = '#0e0a0a'; x.fillRect(-600, by + 40, 3200, 700);
    x.fillStyle = '#2e2218'; x.beginPath(); x.moveTo(bx - BR, by); x.lineTo(bx - BR, top + 130); x.quadraticCurveTo(bx - BR, top + 80, bx - 24, top + 64); x.lineTo(bx - 22, top + 10);
    x.lineTo(bx + 22, top + 10); x.lineTo(bx + 24, top + 64); x.quadraticCurveTo(bx + BR, top + 80, bx + BR, top + 130); x.lineTo(bx + BR, by); x.closePath(); x.fill();
    x.fillStyle = '#6a4a30'; x.fillRect(bx - 20, top - 16, 40, 30);
    const th = turn(t), c = Math.cos(th), lw = 136, lh = 172, ly = by - 150;
    if (c > .02) {
      x.save(); x.translate(bx + BR * Math.sin(th) * .92, ly); x.scale(c, 1);
      x.fillStyle = '#d6c8a8'; x.fillRect(-lw / 2, -lh / 2, lw, lh); x.strokeStyle = '#1a1414'; x.lineWidth = 3; x.strokeRect(-lw / 2 + 8, -lh / 2 + 8, lw - 16, lh - 16);
      x.translate(0, -28); skull(x, .9); x.translate(0, 28);
      x.fillStyle = '#1a1414'; x.font = '900 34px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('POISON', 0, 56);
      x.restore();
    }
    const lx = bx + (bulbAt(t)[0] - 960) * .35;
    x.fillStyle = 'rgba(255,220,170,.22)'; x.fillRect(lx - 40, top + 120, 14, BH - 150);
  }
  function scene(x, t) {
    x.fillStyle = '#07060e'; x.fillRect(-1000, -1200, 4000, 3000);
    const b = bulbAt(t); x.strokeStyle = '#1a1628'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(960, TOP - 600); x.lineTo(b[0], b[1]); x.stroke();
    x.fillStyle = '#2a2436'; x.fillRect(b[0] - 12, b[1] - 6, 24, 20); x.fillStyle = '#ffe3b0'; x.beginPath(); x.ellipse(b[0], b[1] + 34, 20, 26, 0, 0, TAU); x.fill();
    bottle(x, t);
  }
  const camera = t => { const u = easeIO(clamp(t / DUR)); return { x: 960, y: lerp(M45 ? 520 : 470, M45 ? 640 : 610, u), z: (M45 ? .85 : 1) * lerp(.95, 1.45, u) }; };
  function draw(ctx, t) {
    const cam = camera(t), b = bulbAt(t), up = smooth((t - K.the) / .5);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => scene(x, t), { glow: .4, glowBlur: 14 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    PR.glow(ctx, b[0], b[1] + 34, 520, '#ffcf80', .5 + .15 * up, 'lightbox');
    PR.glow(ctx, BOT[0], BOT[1] - 150, 220, '#ffd9a0', .1 * up, 'lightbox');
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.darkest, K.the, K.poison],
  });
})();
