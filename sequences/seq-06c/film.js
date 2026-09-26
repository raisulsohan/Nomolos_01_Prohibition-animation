(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, polyPath } = FILM, PR = FILM.props;
  const ID = 'seq-06c', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const SB = FILM.getScene('seq-06b').api, L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { bar: 1.368, towns: 2.903, political: 3.637, gambling: 5.038,
    brothel: 6.874 };
  const hexA = (h, a) => FILM.rgba(FILM.hex(h), a);

  const T_IN = .9, HZ = SB.HZ, SAL = SB.SAL, vb = SB.V.door;
  const ls0 = vb[2] + SB.push(SB.DUR, SB.K.saloon - .6, 1, .15), v0 = .15;
  function outsideCam(t) {
    const u = clamp(t / T_IN), ls = ls0 + v0 * t + (Math.log(22) - ls0 - v0 * T_IN) * u * u * u;
    return SB.toCam(vb[0], lerp(vb[1], HZ - 70, easeIO(u)), ls);
  }
  function doors(x, t) {
    const a = smooth(t / .2), open = easeOut(clamp((t - .12) / .45));
    x.globalAlpha = a; x.fillStyle = hexA('#f6c268', 1); x.fillRect(SAL.x - 50, HZ - 140, 100, 140);
    for (const d of [-1, 1]) {
      x.save(); x.translate(SAL.x + d * 47, 0); x.scale(1 - .85 * open, 1);
      x.fillStyle = '#b88a58'; x.fillRect(d < 0 ? 0 : -45, HZ - 112, 45, 70);
      x.fillStyle = 'rgba(60,36,20,.55)'; for (let k = 0; k < 4; k++) x.fillRect((d < 0 ? 6 : -39) + k * 9, HZ - 104, 4, 54);
      x.restore();
    }
    x.globalAlpha = 1;
  }

  const PS = 1.9, UP = -316;
  const WALL = '#c9a27a', PAPER2 = '#b98e66', FLOOR = '#6b4529', BEAM = '#3e2c1e';
  const man = (x, px, py, o, s = PS) => { x.save(); x.translate(px, py); x.scale(s, s); PR.person(x, P, { kind: 'man', ...o }); x.restore(); };
  const woman = (x, px, py, o, s = PS) => { x.save(); x.translate(px, py); x.scale(s, s); PR.person(x, P, { kind: 'woman', ...o }); x.restore(); };
  const seated = (x, floor, fn) => { x.save(); x.beginPath(); x.rect(-1e4, -1e4, 2e4, 1e4 + floor); x.clip(); fn(); x.restore(); };
  function shell(x) {
    x.fillStyle = WALL; x.fillRect(0, -600, 1800, 600);
    x.fillStyle = 'rgba(120,70,40,.14)'; for (let px = 30; px < 1800; px += 60) x.fillRect(px, -600, 26, 600);
    x.fillStyle = PAPER2; x.fillRect(16, -300, 1768, 16);
    x.fillStyle = FLOOR; x.fillRect(0, -14, 1800, 14); x.fillRect(0, UP, 1800, 16);
    x.fillStyle = BEAM; x.fillRect(0, -600, 1800, 18); x.fillRect(0, -616, 1800, 16); x.fillRect(0, UP - 4, 1800, 8);
    x.fillRect(0, -616, 16, 616); x.fillRect(1784, -616, 16, 616);
    x.fillRect(560, UP, 16, UP * -1 - 150); x.fillRect(880, -600, 16, 284);
    polyPath(x, [[-20, -616], [900, -700], [1820, -616]]); x.fill();
  }
  function backRoom(x, tp) {
    x.fillStyle = '#e8d9b8'; x.fillRect(80, -250, 90, 120); x.fillStyle = BEAM; x.fillRect(84, -246, 82, 6);
    polyPath(x, [[125, -222], [131, -205], [149, -205], [135, -194], [140, -176], [125, -187], [110, -176], [115, -194], [101, -205], [119, -205]]); x.fillStyle = P.red; x.fill();
    man(x, 210, 0, { coat: '#262327', trouser: '#1e1c20', hat: 'bowler', hatColor: '#1a1818', arm: .6 });
    x.fillStyle = '#5a3a22'; x.fillRect(120, -92, 330, 16); x.fillRect(140, -76, 14, 76); x.fillRect(420, -76, 14, 76);
    x.fillStyle = '#d8c9a4'; x.fillRect(300, -150, 80, 58); x.fillStyle = BEAM; x.fillRect(318, -152, 44, 6);
    man(x, 480, 0, { coat: '#6d6a5e', trouser: '#3a3a40', hat: 'cap', hatColor: '#3a342e' });
    const cash = easeIO(clamp((tp - K.political + .1) / .45)), bal = easeIn(clamp((tp - K.political - .55) / .4), 1.6);
    if (cash > 0 && bal < 1) { x.save(); x.translate(lerp(250, 452, cash), lerp(-178, -120, cash) - 40 * Math.sin(Math.PI * cash)); x.rotate(-.3 + .5 * cash); x.fillStyle = '#6f8f5a'; x.fillRect(-20, -9, 40, 18); x.fillStyle = '#4e6a3e'; x.fillRect(-13, -5, 26, 10); x.restore(); }
    if (bal > 0 && bal < 1) { x.fillStyle = '#f7f1e2'; x.save(); x.translate(lerp(455, 340, bal), lerp(-130, -150, bal) - 30 * Math.sin(Math.PI * bal)); x.rotate(-1.4 * bal); x.fillRect(-12, -8, 24, 16); x.restore(); }
  }
  function barRoom(x, tp) {
    x.fillStyle = '#8a7a5e'; x.fillRect(780, -275, 740, 110); x.fillStyle = 'rgba(255,245,220,.35)'; x.fillRect(790, -265, 720, 90);
    x.fillStyle = BEAM; x.fillRect(770, -160, 760, 10);
    for (let k = 0; k < 18; k++) { x.save(); x.translate(800 + k * 40, -160); x.scale(.38, .38); PR.bottle(x, P, 100 + (k % 3) * 18); x.restore(); }
    man(x, 1150, 0, { coat: '#e9e2d0', trouser: '#3a3a40', hat: 'none' });
    x.fillStyle = '#6b4529'; x.fillRect(760, -96, 780, 96); x.fillStyle = '#8a5e3a'; x.fillRect(750, -106, 800, 14);
    x.fillStyle = '#5a3a22'; for (let k = 0; k < 7; k++) x.fillRect(790 + k * 108, -78, 80, 64);
    for (const gx of [880, 1010, 1300, 1450]) PR.shotGlass(x, P, gx, -106, .55, .6);
    man(x, 930, 0, { coat: '#5a4632', trouser: '#3a3a40', hat: 'cap', hatColor: '#2e2a26' });
    man(x, 1380, 0, { coat: '#4d5b68', trouser: '#3a3a40', hat: 'bowler', hatColor: '#2c2824' });
  }
  function gameRoom(x, tp) {
    seated(x, UP, () => { man(x, 270, UP + 12, { coat: '#2c2a2e', hat: 'wide', hatColor: '#2a2420' }); man(x, 450, UP + 12, { coat: '#5a4632', hat: 'bowler', hatColor: '#1e1818' }); man(x, 630, UP + 12, { coat: '#e9e2d0', hat: 'none' }); });
    x.fillStyle = '#2e5a3c'; x.fillRect(215, UP - 78, 470, 78); x.fillStyle = '#3e6b4a'; x.beginPath(); x.ellipse(450, UP - 78, 245, 18, 0, 0, TAU); x.fill();
    const chip = ['#e8d9b8', '#b5372b', '#2c2824'], bet = easeIO(clamp((tp - K.gambling - .05) / .45));
    for (let k = 0; k < 5; k++) for (let j = 0; j < 3 + k % 3; j++) { x.fillStyle = chip[(k + j) % 3]; x.fillRect(360 + k * 40 + (k === 4 ? 70 * (1 - bet) : 0), UP - 92 - j * 5, 26, 5); }
    x.fillStyle = '#f2e6cc'; for (const cx of [300, 590]) { x.save(); x.translate(cx, UP - 88); x.rotate(cx < 400 ? -.2 : .2); x.fillRect(-10, -14, 20, 28); x.restore(); }
    x.fillStyle = BEAM; x.fillRect(448, -600, 4, 90); x.fillStyle = '#3e6b4a'; polyPath(x, [[410, -506], [490, -506], [470, -530], [430, -530]]); x.fill();
  }
  function upperRoom(x, tp) {
    for (const [dx, rose] of [[1000, 0], [1330, 1], [1600, 0]]) {
      x.fillStyle = BEAM; x.fillRect(dx - 6, UP - 230, 122, 230); x.fillStyle = rose ? '#5a3226' : '#6b4529'; x.fillRect(dx, UP - 224, 110, 224);
      x.fillStyle = '#c8a050'; x.beginPath(); x.arc(dx + 92, UP - 110, 5, 0, TAU); x.fill();
      if (rose) { x.fillStyle = '#e0806a'; x.beginPath(); x.arc(dx + 55, UP - 262, 16, 0, TAU); x.fill(); x.fillStyle = BEAM; x.fillRect(dx + 49, UP - 250, 12, 12); }
    }
    x.fillStyle = BEAM; x.fillRect(1470, UP - 200, 30, 6); x.fillStyle = '#2c2a2e'; x.beginPath(); x.ellipse(1486, UP - 206, 20, 5, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(1486, UP - 210, 13, 11, 0, Math.PI, TAU); x.fill();
  }
  function home(x, tp) {
    x.fillStyle = '#b8ad96'; x.fillRect(1816, -330, 700, 330); x.fillStyle = FLOOR; x.fillRect(1816, -14, 700, 14);
    x.fillStyle = BEAM; x.fillRect(2500, -346, 16, 346); x.fillRect(1800, -346, 716, 16); polyPath(x, [[1790, -346], [2158, -520], [2526, -346]]); x.fill();
    x.fillStyle = '#3a4050'; x.fillRect(2330, -250, 110, 100); x.fillStyle = BEAM; x.fillRect(2383, -250, 4, 100); x.fillRect(2330, -202, 110, 4);
  }
  function inside(x, tp) {
    x.fillStyle = '#5c4430'; x.fillRect(-1000, 0, 4600, 800);
    shell(x); backRoom(x, tp); barRoom(x, tp); gameRoom(x, tp); upperRoom(x, tp); home(x, tp);
  }
  const vz = (x, y, z) => [x, y, Math.log(z * (M45 ? .72 : 1))];
  const KEYS = [[T_IN, vz(1150, -150, 2.5)], [1.1, vz(1150, -150, 2.5)], [2.5, vz(1000, -300, .92)], [K.towns + .3, vz(1000, -300, .92)],
    [K.political + .25, vz(310, -150, 2.1)], [K.gambling - .2, vz(310, -150, 2.1)], [K.gambling + .4, vz(450, -430, 2.1)], [K.brothel - .7, vz(450, -430, 2.1)],
    [K.brothel + .1, vz(1370, -440, 2)], [DUR - .4, vz(1375, -445, 2.15)]];
  function insideCam(t) { const v = FILM.keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t);
    if (t < T_IN) {
      const cam = outsideCam(t);
      SB.draw(ctx, SB.DUR, cam);
      L.sheet(ctx, cam, .4, R, x => doors(x, t), { shadow: false, rim: false, fibre: 0 });
      const f = smooth((t - .6) / (T_IN - .6));
      if (f > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = hexA('#f6c268', f); ctx.fillRect(0, 0, W, H); ctx.restore(); }
      return;
    }
    const cam = insideCam(t);
    L.background(ctx);
    L.sheet(ctx, cam, .3, R, x => { const g = x.createLinearGradient(0, -1600, 0, 400); g.addColorStop(0, '#6e3e28'); g.addColorStop(1, '#a8704a'); x.fillStyle = g; x.fillRect(-3000, -3000, 9000, 6000); }, { shadow: false, rim: false });
    L.sheet(ctx, cam, 1, R, x => inside(x, tp), { paperShadow: [6, 8, 6, .35] });
    FILM.sheet(ctx, cam, 1, W, H, R);
    PR.glow(ctx, 1150, -250, 420, '#ffb05a', .16, 'paper'); PR.glow(ctx, 450, -500, 300, '#ffd98a', .14, 'paper');
    PR.glow(ctx, 1385, UP - 262, 150, '#e0806a', .18 + .3 * smooth((tp - K.brothel + .2) / .4), 'lightbox');
    const haze = 1 - smooth((t - T_IN) / .45);
    if (haze > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = hexA('#f6c268', haze); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [T_IN, K.bar, K.political, K.gambling, K.brothel],
  });
})();
