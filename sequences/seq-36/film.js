(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-36', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { y1933: 0.3, enough: 2.702, depression: 4.337, tax: 5.472, ignore: 6.873,
    pouring: 8.241, gangsters: 8.875, budgets: 10.176, bringing: 10.877, back: 11.778,
    jobs: 12.312, revenue: 12.846, desperate: 15.015 };
  const INK = P.ink, GREEN = '#6f9a58', back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const GY = 820, CH = [880, 930];

  const CALP = [400, 420];
  const yearAt = t => t < K.y1933 - .45 ? 1930 : t < K.y1933 - .3 ? 1931 : t < K.y1933 - .12 ? 1932 : 1933;
  function calendar(x, t) {
    x.fillStyle = '#b8a582'; x.fillRect(-900, -900, 1500, GY + 900);
    const [cx, cy] = CALP; x.save(); x.translate(cx, cy);
    x.fillStyle = '#6a4a30'; x.fillRect(-150, -210, 300, 40); x.fillStyle = P.card; x.fillRect(-140, -170, 280, 360);
    x.fillStyle = INK; x.font = '900 118px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(yearAt(t)), 0, -30);
    x.font = '900 34px NSC'; x.fillText('MARCH', 0, 80); x.fillStyle = 'rgba(27,33,48,.25)'; for (let k = 0; k < 7; k++) x.fillRect(-110 + k * 32, 120, 20, 20);
    const fl = [K.y1933 - .45, K.y1933 - .3, K.y1933 - .12].map(f => clamp((t - f) / .35));
    for (const u of fl) if (u > 0 && u < 1) { x.save(); x.translate(160 * u, -80 - 240 * u); x.rotate(.9 * u); x.globalAlpha = 1 - u; x.fillStyle = P.card; x.fillRect(-140, -170, 280, 360); x.restore(); }
    x.restore();
  }
  const JAR = [1660, 700], VAULT = [2480, 700], GATE = [1150, GY];
  const FACT = [[900, 250, 'BREWERY'], [1350, 180, ''], [1950, 230, 'BOTTLING'], [2300, 200, '']];
  const smokeOn = t => smooth((t - K.jobs + .3) / .8);
  function street(x, t, tp) {
    x.fillStyle = '#d8d0bc'; x.fillRect(600, -900, 2700, GY + 900);
    for (const [fx, fh, name] of FACT) {
      x.fillStyle = '#8f8a80'; x.fillRect(fx - 170, GY - 520 - fh, 340, fh + 100); x.fillRect(fx + 90, GY - 520 - fh - 240, 46, 250);
      if (name) { x.fillStyle = P.card; x.fillRect(fx - 110, GY - 500 - fh, 220, 40); x.fillStyle = INK; x.font = '900 26px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(name, fx, GY - 480 - fh); }
      const on = smokeOn(t); for (let k = 0; k < 5; k++) { const u = ((tp * .3 + k * .2 + fx * .001) % 1); if (on <= 0) break;
        x.fillStyle = `rgba(120,116,108,${.5 * on * (1 - u)})`; x.beginPath(); x.arc(fx + 113 + 60 * u, GY - 520 - fh - 260 - 200 * u, 26 + 40 * u, 0, TAU); x.fill(); }
      x.fillStyle = FILM.rgba(FILM.hex('#f6c66e'), .85 * on); for (let k = 0; k < 4; k++) x.fillRect(fx - 140 + k * 76, GY - 480 - fh + 70, 40, 34);
    }
    x.fillStyle = '#a0826a'; x.fillRect(600, GY - 420, 2700, 420); x.fillStyle = 'rgba(60,40,30,.12)'; for (let y = GY - 420; y < GY; y += 30) x.fillRect(600, y, 2700, 3);
    const op = easeIO(clamp((t - K.jobs + .2) / .6));
    x.fillStyle = '#3e3028'; x.fillRect(GATE[0] - 110, GY - 300, 220, 300); x.fillStyle = '#6a5040'; x.fillRect(GATE[0] - 110, GY - 300, 110 * (1 - .85 * op), 300); x.fillRect(GATE[0] + 110 - 110 * (1 - .85 * op), GY - 300, 110 * (1 - .85 * op), 300);
    const hi = back((t - K.jobs + .05) / .35); if (hi > 0) { x.save(); x.translate(GATE[0], GY - 340); x.scale(hi, hi); x.fillStyle = P.card; x.fillRect(-120, -26, 240, 52); x.fillStyle = INK; x.font = '900 30px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('NOW HIRING', 0, 2); x.restore(); }
    x.fillStyle = '#6e6a62'; x.fillRect(-900, GY, 4200, 1800);
  }
  const LINE = Array.from({ length: 9 }, (_, i) => ({ i, x: 760 + i * 70 }));
  function breadline(x, t, tp) {
    for (const m of LINE) {
      const go = clamp((tp - K.jobs - .3 - (LINE.length - 1 - m.i) * .22) / 1.2), e = easeIO(go);
      if (go >= 1) continue;
      const px = lerp(m.x, GATE[0], e), py = lerp(GY + 10, GY - 20, e), s = lerp(2.3, 1.9, e), bob = go > 0 ? Math.abs(Math.sin(tp * 10 + m.i)) * 3 : 0;
      x.save(); x.translate(px, py - bob); x.scale((go > 0 && px < GATE[0] ? -1 : 1) * s, s); x.globalAlpha = 1 - smooth((go - .8) / .2);
      PR.person(x, P, { kind: 'man', hat: 'cap', coat: ['#5a5046', '#4a4a50', '#62564a'][m.i % 3], trouser: '#3a3632', look: -.25 * (1 - e) });
      x.restore();
    }
  }
  const turn = t => easeIO(clamp((t - K.bringing - .25) / .7)), fill = t => easeIO(clamp((t - K.back) / 3.2));
  function channel(x, t, tp) {
    x.fillStyle = '#4a4640'; x.fillRect(560, CH[0] - 8, 2020, CH[1] - CH[0] + 16); x.fillStyle = '#2e2a26'; x.fillRect(560, CH[0], 2020, CH[1] - CH[0]);
    const tn = turn(t), g = rng(36);
    for (let k = 0; k < 60; k++) {
      const ph = g(), sp = 220 + g() * 80, xx = 560 + ((ph * 2020 + tp * sp) % 2020), yy = CH[0] + 8 + g() * 30;
      if (xx > JAR[0] - 10 && tn > .5) continue;
      x.save(); x.translate(xx, yy); x.rotate((g() - .5) * .6); x.fillStyle = k % 3 ? GREEN : '#86ad6a'; x.fillRect(-18, -8, 36, 16); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(-6, -5, 12, 10); x.restore();
    }
    x.fillStyle = '#5a5a64'; x.fillRect(JAR[0] + 10, lerp(CH[0] - 70, CH[0] - 2, tn), 16, 70);
    x.fillStyle = '#6a6a74'; x.fillRect(JAR[0] - 40, JAR[1] + 40, 24, CH[0] - JAR[1] - 40);
    x.save(); x.translate(JAR[0] + 18, CH[0] - 92); x.rotate(tn * Math.PI / 3); x.strokeStyle = '#8a3a2a'; x.lineWidth = 8; x.beginPath(); x.arc(0, 0, 26, 0, TAU); x.stroke(); x.beginPath(); x.moveTo(-26, 0); x.lineTo(26, 0); x.moveTo(0, -26); x.lineTo(0, 26); x.stroke(); x.restore();
    if (tn > .5) { const g2 = rng(37); for (let k = 0; k < 8; k++) { const u = ((tp * 1.4 + g2()) % 1); x.fillStyle = GREEN; x.fillRect(JAR[0] - 38, CH[0] - 20 - u * (CH[0] - JAR[1] - 20), 20, 12); } }
  }
  function jar(x, t) {
    const [jx, jy] = JAR, f = fill(t);
    x.fillStyle = '#9a948a'; x.fillRect(jx - 130, jy + 40, 260, GY - jy - 40); x.fillStyle = '#b4aea2'; x.fillRect(jx - 140, jy + 40, 280, 20);
    x.fillStyle = 'rgba(200,225,235,.45)'; x.beginPath(); x.roundRect(jx - 100, jy - 250, 200, 290, 30); x.fill();
    x.save(); x.beginPath(); x.roundRect(jx - 96, jy - 246, 192, 282, 28); x.clip();
    const top = lerp(jy + 30, jy - 200, f); x.fillStyle = GREEN; x.fillRect(jx - 100, top, 200, jy + 40 - top);
    const g = rng(38); for (let k = 0; k < 40; k++) { const px = jx - 90 + g() * 180, py = top + g() * (jy + 40 - top); x.fillStyle = k % 4 ? '#86ad6a' : '#c8a040'; x.fillRect(px - 10, py - 5, 20, 10); }
    x.restore();
    x.strokeStyle = 'rgba(80,100,110,.6)'; x.lineWidth = 5; x.beginPath(); x.roundRect(jx - 100, jy - 250, 200, 290, 30); x.stroke();
    x.fillStyle = '#6a6a74'; x.fillRect(jx - 70, jy - 270, 140, 24);
    x.fillStyle = P.card; x.fillRect(jx - 88, jy - 150, 176, 70); x.fillStyle = INK; x.font = '900 24px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('U.S.', jx, jy - 132); x.fillText('TREASURY', jx, jy - 102);
  }
  function vault(x, t, tp) {
    const [vx, vy] = VAULT, shut = smooth((t - K.back - .2) / .8);
    x.fillStyle = '#5a4036'; x.fillRect(vx - 190, GY - 420, 380, 420);
    x.fillStyle = '#1c1612'; x.beginPath(); x.arc(vx, GY - 180, 140, 0, TAU); x.fill();
    x.fillStyle = GREEN; for (let k = 0; k < 5; k++) x.fillRect(vx - 90 + k * 36, GY - 120 - (k % 2) * 30, 30, 70 + (k % 2) * 30);
    x.fillStyle = '#8a8a94'; x.save(); x.translate(vx + 140, GY - 180); x.scale(lerp(.25, 1, shut), 1); x.beginPath(); x.arc(-140 * shut, 0, 140, 0, TAU); x.fill(); x.restore();
    x.save(); x.translate(vx + 230, GY + 10); x.scale(-2.6, 2.6); PR.person(x, P, { kind: 'man', hat: 'wide', coat: '#2c2a30', trouser: '#222024', hatColor: '#141218', dark: .3, look: -.1 }); x.restore();
    x.fillStyle = '#e8d8b0'; x.fillRect(vx + 205, GY - 186, 22, 5);
  }
  function hand(x, t) {
    const inU = easeOut(clamp((t - K.bringing + .15) / .45)), outU = easeIO(clamp((t - K.back - .5) / .6)); if (inU <= 0 || outU >= 1) return;
    const wheel = [JAR[0] + 18, CH[0] - 92], tn = turn(t), th = -.35 + tn * Math.PI / 3, rim = [wheel[0] + 26 * Math.cos(th), wheel[1] + 26 * Math.sin(th)];
    const cam = camera(t), below = cam.y + H / (2 * cam.z);
    const h = [lerp(rim[0] + 120, rim[0], inU) + 200 * outU, lerp(below + 260, rim[1], inU) + 700 * outU], rot = tn * Math.PI / 3, elbow = [h[0] + 60, below + 200];
    const o = { h, side: 1, r: 10, grip: 1, skin: P.skin, s: .8, arm: Math.atan2(elbow[1] - h[1], elbow[0] - h[0]), style: 'fingers' }, w = FILM.hand.wristAt(o, rot);
    FILM.hand.arm(x, w, elbow, { sleeve: '#35516b', cuff: '#f5ecd8', link: '#c8a040' });
    FILM.hand.turned(x, o, rot, o2 => { FILM.hand.back(x, o2); FILM.hand.front(x, o2); });
  }

  const KEYS = [[0, [420, 420, 1.55]], [K.enough + .5, [440, 420, 1.5]], [K.depression + .8, [1500, 560, .8]], [K.pouring - .2, [1700, 580, .85]], [K.budgets, [1950, 600, .9]],
    [K.bringing + .3, [1680, 720, 1.25]], [K.back + .4, [1680, 720, 1.3]], [K.jobs + .8, [1520, 520, .8]], [DUR, [1540, 520, .78]]]
    .map(([t, v]) => [t, [v[0], v[1] + (M45 ? 40 : 0), Math.log(v[2] * (M45 ? .66 : 1))]]);
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { street(x, t, tp); calendar(x, t); vault(x, t, tp); jar(x, t); breadline(x, t, tp); channel(x, t, tp); hand(x, t); }, { paperShadow: [5, 7, 5, .3] });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.y1933, K.depression, K.pouring, K.bringing, K.jobs],
  });
})();
