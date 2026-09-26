(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-19', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const LB = FILM.look('lightbox', W, H), LP = FILM.look('paper', W, H), B = LB.P, pose = LB.pose;
  const K = { moment: 0.6, crooks: 1.701, kings: 2.769, before: 3.737, local: 7.274, petty: 8.441,
    handed: 10.11, bottomless: 11.244, profit: 13.213, protection: 14.581, law: 16.616,
    honest: 18.151, undercut: 19.085, shut: 21.821 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const WASH = [K.before - .15, K.before + .55], BACK = [K.handed - .75, K.handed - .1];

  const NIGHT = { sky: '#0e0c28', wall: '#191a44', wall2: '#141338', win: '#ffcf80', winOff: '#0e0e2a', street: '#0c0b22', kerb: '#23224e', coat: ['#2a2658', '#34306a', '#26224e'], skin: '#4a4070', dark: .25, sign: '#e8dcc0', ink: '#0a0a18' };
  const SEPIA = { sky: '#d9c4a0', wall: '#a8865e', wall2: '#9a7a54', win: '#e8d2a4', winOff: '#6e5238', street: '#8a6c4a', kerb: '#6e5438', coat: ['#5a4430', '#6a5038', '#4e3a28'], skin: '#c8a882', dark: 0, sign: '#e8d8b8', ink: '#3a2a1c' };

  const SHOPS = [['BREWERY', 1950, 420], ['WINE & SPIRITS', 2420, 440], ['GROCER', 2880, 380], ['BAR', 3280, 400]];
  const DOOR = 3640;
  function street(x, pal, tp) {
    x.fillStyle = pal.sky; x.fillRect(-1200, -2400, 6000, 2400);
    const g = rng(19);
    for (let bx = -1100; bx < 1800; bx += 260) { const h = 600 + g() * 500; x.fillStyle = g() < .5 ? pal.wall : pal.wall2; x.fillRect(bx, -h, 250, h); for (let wy = -h + 60; wy < -120; wy += 110) for (let wx = bx + 30; wx < bx + 220; wx += 80) { x.fillStyle = g() < .2 ? pal.win : pal.winOff; x.fillRect(wx, wy, 40, 60); } }
    for (const [name, sx, h] of SHOPS) {
      x.fillStyle = pal.wall2; x.fillRect(sx - 210, -h, 420, h); x.fillStyle = pal.winOff; x.fillRect(sx - 170, -230, 150, 200); x.fillRect(sx + 20, -230, 150, 200);
      x.fillStyle = pal.sign; x.fillRect(sx - 180, -h + 30, 360, 70); x.fillStyle = pal.ink; x.font = `900 ${name.length > 8 ? 42 : 54}px NSC`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(name, sx, -h + 66);
      const last = name === 'BAR', u = pal === SEPIA ? 0 : last ? easeIn(clamp((tp - K.shut + .12) / .12), 2) : 1;
      for (const [cx, cw] of [[sx - 95, 150], [sx + 95, 150]]) { if (u <= 0) continue; x.save(); x.translate(cx, -130 - 40 * (1 - u)); x.globalAlpha = clamp(u * 3); x.fillStyle = '#7a5a3a'; for (const r of [.55, -.55]) { x.save(); x.rotate(r); x.fillRect(-cw * .62, -10, cw * 1.24, 20); x.restore(); } x.restore(); }
    }
    x.fillStyle = pal.wall; x.fillRect(DOOR - 160, -520, 320, 520);
    x.fillStyle = '#05040f'; x.fillRect(DOOR - 55, -230, 110, 230); x.fillStyle = '#3a2418'; polyPath(x, [[DOOR - 55, -230], [DOOR - 12, -214], [DOOR - 12, -12], [DOOR - 55, 0]]); x.fill();
    x.fillStyle = FILM.rgba(FILM.hex('#ffb34d'), .8); x.fillRect(DOOR + 40, -220, 6, 210);
    x.fillStyle = pal.street; x.fillRect(-1200, 0, 6000, 1400); x.fillStyle = pal.kerb; x.fillRect(-1200, 0, 6000, 10);
    for (const lx of [CROOK + 60, 1000]) { const g2 = x.createRadialGradient(lx, -260, 20, lx, -260, 560); g2.addColorStop(0, pal === NIGHT ? 'rgba(120,110,200,.55)' : 'rgba(255,240,210,.35)'); g2.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g2; x.fillRect(lx - 600, -900, 1200, 900); }
    x.fillStyle = pal.ink; x.fillRect(1560, -560, 12, 560); x.fillRect(1520, -566, 60, 10); x.fillStyle = pal.win; x.fillRect(1528, -556, 22, 18);
  }
  const person = (x, px, py, s, o, pal) => { x.save(); x.translate(px, py); x.scale(s * (o.flip ? -1 : 1), s); PR.person(x, B, { kind: 'man', trouser: pal.coat[2], skin: pal.skin, hatColor: pal.ink, dark: pal.dark, ...o }); x.restore(); };

  const CROOK = 900, PILE = t => 300 * easeOut(clamp((t - K.moment - .4) / (K.kings - K.moment - .6)), 2);
  function crowned(x, t, tp) {
    const pal = NIGHT, ph = PILE(tp), g = rng(68);
    for (let k = 0; k < 70; k++) {
      const u = tp - .1 - k * .018; if (u < 0) continue; const px = lerp(2200, CROOK + (g() - .5) * 300, clamp(u / .7)), py = -8 - g() * 14; if (u > .7) continue;
      x.fillStyle = k % 3 ? '#7f9c68' : '#e8c35a'; x.save(); x.translate(px, py); x.rotate(g() * 2); x.fillRect(-18, -8, 36, 16); x.restore();
    }
    if (ph > 0) {
      x.fillStyle = '#6a8656'; polyPath(x, [[CROOK - 260, 0], [CROOK - 80, -ph], [CROOK + 80, -ph], [CROOK + 260, 0]]); x.fill();
      for (let k = 0; k < 40; k++) { const fy = g(), fx = (g() - .5) * 2 * (260 - 180 * fy); x.fillStyle = k % 4 ? '#9ab784' : '#e8c35a'; x.save(); x.translate(CROOK + fx, -fy * ph); x.rotate(g() * 3); x.fillRect(-16, -7, 32, 14); x.restore(); }
    }
    const up = smooth((tp - K.kings + .05) / .3);
    person(x, CROOK, -ph, 2.6, { coat: '#2a2650', hat: 'cap', arm: .9 * up }, pal);
    const c = clamp((tp - K.kings + .3) / .3);
    if (c > 0) { x.save(); x.translate(CROOK, -ph - 2.6 * 92 - 180 * (1 - easeIn(c, 2))); for (let k = 0; k < 7; k++) { const a = (k / 6 - .5) * 1.4; x.fillStyle = '#e8c35a'; x.beginPath(); x.arc(Math.sin(a) * 30, -Math.cos(a) * 9 - 6, 12, 0, TAU); x.fill(); x.fillStyle = '#b8913a'; x.beginPath(); x.arc(Math.sin(a) * 30, -Math.cos(a) * 9 - 6, 6, 0, TAU); x.fill(); } x.restore(); }
  }

  const DICE = 200, PICK = 640, THUG = 1340, CRATE = 990, SC = 1.9;
  const TAGS = [[K.bottomless - .1, 'DEMAND'], [K.profit - .1, 'PROFIT'], [K.protection, 'PROTECTION']];
  const grow = tp => SC * TAGS.reduce((s, [t0]) => s * (1 + .2 * back((tp - t0) / .35)), 1);
  function corner(x, tp, pal, now) {
    const victims = now ? 1 - smooth((tp - K.handed + .2) / .4) : 1, gs = now ? grow(tp) : SC;
    if (victims > 0) { x.save(); x.globalAlpha = victims;
      for (const d of [-1, 1]) person(x, DICE + d * 110, 0, SC * .9, { coat: pal.coat[1], hat: 'cap', flip: d > 0, arms: [[[-8, -68], [-2, -48], [10, -30]], [[8, -68], [14, -50], [20, -32]]] }, pal);
      x.fillStyle = pal.sign; x.fillRect(DICE - 6, -10, 10, 10); x.fillRect(DICE + 8, -8, 10, 10);
      person(x, PICK + 130, 0, SC * 1.05, { coat: pal.coat[0], hat: 'bowler' }, pal);
      x.fillStyle = pal.wall2; x.fillRect(THUG + 80, -380, 240, 380); x.fillStyle = pal.winOff; x.fillRect(THUG + 150, -290, 110, 290);
      person(x, THUG + 150, 0, SC, { coat: '#6a6a6a', hat: 'none', arm: .5 }, pal);
      x.restore(); }
    person(x, DICE, 0, gs, { coat: pal.coat[2], hat: 'cap', arm: now ? .3 : 0 }, pal);
    person(x, PICK, 0, gs, { coat: pal.coat[1], hat: 'cap', arm: now ? .3 : .6 }, pal);
    if (!now || victims > 0) { x.save(); x.globalAlpha = victims; x.fillStyle = '#5a3a24'; x.fillRect(PICK + 38, -115, 30, 18); x.restore(); }
    person(x, THUG, 0, gs, { coat: pal.coat[0], hat: 'wide', arm: now ? .3 : .4 }, pal);
    if (!now) return;
    const cu = easeOut(clamp((tp - K.handed + .3) / .45), 2); if (cu <= 0) return;
    x.save(); x.translate(lerp(2200, CRATE, cu), 0);
    x.fillStyle = '#e39e37'; for (let k = 0; k < 4; k++) { x.beginPath(); x.arc(-60 + k * 40, -150, 10, Math.PI, TAU); x.fill(); }
    x.fillStyle = '#7a5530'; x.fillRect(-100, -146, 200, 146); x.fillStyle = '#5a3c22'; x.fillRect(-100, -98, 200, 6); x.fillRect(-100, -50, 200, 6); x.strokeStyle = '#3e2a16'; x.lineWidth = 6; x.strokeRect(-97, -143, 194, 140);
    TAGS.forEach(([t0, word], i) => {
      const u = back((tp - t0) / .3); if (u <= 0) return;
      const ax = -70 + i * 70; x.strokeStyle = '#d8d0b8'; x.lineWidth = 2; x.beginPath(); x.moveTo(ax, -146); x.lineTo(ax + (i - 1) * 120, -260); x.stroke();
      x.save(); x.translate(ax + (i - 1) * 120, -300); x.scale(u, u); x.rotate((i - 1) * .08);
      x.fillStyle = '#e8dcc0'; x.beginPath(); x.roundRect(-70, -60, 140, 120, 8); x.fill(); x.fillStyle = '#0a0a18'; x.beginPath(); x.arc(0, -48, 5, 0, TAU); x.fill();
      x.fillStyle = '#2c2824'; x.strokeStyle = '#2c2824'; x.lineWidth = 4;
      if (i === 0) { polyPath(x, [[-30, -32], [30, -32], [6, 0], [6, 14], [-6, 14], [-6, 0]]); x.stroke(); x.fillStyle = '#e39e37'; x.fillRect(-3, -44, 6, 12); x.fillRect(-3, 16, 6, 14); }
      else if (i === 1) { const bh = 12 + 40 * clamp((tp - t0) / .6); x.fillRect(-30, 24 - 10, 14, 10); x.fillRect(-10, 24 - 18, 14, 18); x.fillStyle = '#7f9c68'; x.fillRect(10, 24 - bh - 4, 18, bh + 4); }
      else { x.beginPath(); x.moveTo(-24, -34); x.lineTo(24, -34); x.lineTo(24, 0); x.quadraticCurveTo(24, 22, 0, 32); x.quadraticCurveTo(-24, 22, -24, 0); x.closePath(); x.fill(); x.fillStyle = '#e8dcc0'; x.fillRect(-12, -24, 24, 4); x.fillRect(-12, -14, 24, 4); x.fillRect(-12, -4, 24, 4); }
      x.fillStyle = '#2c2824'; x.font = '900 22px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(word, 0, 46); x.restore();
    });
    x.restore();
  }
  function title(ctx, t) {
    const a = smooth((t - K.before - .3) / .3) * (1 - smooth((t - BACK[0]) / .4)); if (a <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
    const cx = W / 2, cy = M45 ? 150 : 96, w = M45 ? 660 : 620, h = M45 ? 110 : 96;
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 6, cy - h / 2 + 8, w, h, 8); ctx.fill();
    ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 8); ctx.fill();
    ctx.fillStyle = '#2c2824'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 66 : 60}px NSC`; ctx.fillText('BEFORE 1920', cx, cy + 2); ctx.restore();
  }

  const mz = M45 ? .66 : 1, lz = z => Math.log(z * mz);
  const KEYS = [[0, [CROOK, -330, lz(1.4)]], [K.kings, [CROOK, -470, lz(1.3)]], [WASH[0], [CROOK, -470, lz(1.3)]], [WASH[1] + .3, [DICE + 60, -190, lz(1.6)]], [K.local - 1.2, [DICE + 120, -190, lz(1.62)]], [K.local, [PICK + 60, -190, lz(1.62)]], [K.petty + .45, [THUG + 120, -200, lz(1.58)]],
    [K.handed + .3, [800, -260, lz(1.15)]], [K.law + .4, [820, -330, lz(1.02)]], [K.honest + .1, [860, -300, lz(1)]], [K.shut - .2, [2900, -260, lz(1)]], [DUR, [3380, -250, lz(1.12)]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function render(ctx, t, cam, which) {
    const tp = pose(t);
    if (which === 'past') { LP.background(ctx); LP.sheet(ctx, cam, 1, R, x => { street(x, SEPIA, tp); corner(x, tp, SEPIA, false); }, { paperShadow: [4, 6, 5, .3] }); return; }
    LB.background(ctx);
    LB.sheet(ctx, cam, 1, R, x => { street(x, NIGHT, tp); if (which === 'king') crowned(x, t, tp); else corner(x, tp, NIGHT, true); }, { glow: .35, glowBlur: 12 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    if (which === 'king') PR.glow(ctx, CROOK, -PILE(tp) - 60, 380, '#d8e0a0', .25 * smooth(tp / .8), 'lightbox');
    PR.glow(ctx, DOOR + 40, -120, 160, B.amber, .3, 'lightbox');
  }
  const [A1, a1] = FILM.canvas(W, H), [A2, a2] = FILM.canvas(W, H);
  function draw(ctx, t) {
    const cam = camera(t), w1 = smooth((t - WASH[0]) / (WASH[1] - WASH[0])), w2 = smooth((t - BACK[0]) / (BACK[1] - BACK[0]));
    const [from, to, u] = t < BACK[0] ? ['king', 'past', w1] : ['past', 'now', w2];
    if (u <= 0) render(ctx, t, cam, from); else if (u >= 1) render(ctx, t, cam, to);
    else {
      for (const [c, x] of [[A1, a1], [A2, a2]]) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; x.clearRect(0, 0, W, H); }
      render(a1, t, cam, from); render(a2, t, cam, to); ctx.drawImage(A1, 0, 0); ctx.globalAlpha = u; ctx.drawImage(A2, 0, 0); ctx.globalAlpha = 1;
    }
    title(ctx, t);
    ((t > WASH[0] + .35 && t < BACK[0] + .3) ? LP : LB).grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.kings, K.before, K.handed, K.bottomless, K.profit, K.protection, K.shut],
  });
})();
