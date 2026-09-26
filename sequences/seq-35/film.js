(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-35', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { handed: 1.935, charter: 3.971, m2: 5.105, corruption: 6.64, sale: 9.376,
    m3: 9.943, families: 11.612, poisoned: 12.112, everything: 14.214, aimed: 15.749,
    hitting: 17.017, reverse: 17.551 };
  const INK = P.ink, back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const SC = [960, 440], SS = 2.9;

  const frame = (x, bg) => { x.fillStyle = P.card; x.fillRect(-150, -110, 300, 220); x.fillStyle = bg; x.fillRect(-140, -100, 280, 200); x.strokeStyle = INK; x.lineWidth = 2.2; x.strokeRect(-141, -101, 282, 202); };
  function crown(x, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); x.fillStyle = '#c8a040'; polyPath(x, [[-30, 14], [-34, -14], [-16, 0], [0, -22], [16, 0], [34, -14], [30, 14]]); x.fill(); x.fillStyle = '#8a2a22'; for (const px of [-16, 0, 16]) { x.beginPath(); x.arc(px, 8, 3.5, 0, TAU); x.fill(); } x.restore(); }
  function charter(x) {
    frame(x, '#3a3230'); x.fillStyle = '#e6cf9f'; x.fillRect(-92, -58, 184, 150); x.fillStyle = '#c9ad78'; x.fillRect(-92, -58, 184, 8); x.fillRect(-92, 84, 184, 8);
    crown(x, 0, -76, 1.2);
    x.fillStyle = INK; x.font = '900 26px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('CHARTER', 0, -30); x.font = '900 11px NSC'; x.fillText('OF ORGANIZED CRIME', 0, -10);
    x.fillStyle = 'rgba(27,33,48,.45)'; for (let r = 0; r < 5; r++) x.fillRect(-70, 6 + r * 12, r === 4 ? 70 : 140, 4);
    x.fillStyle = '#6a1e18'; x.beginPath(); x.arc(58, 70, 13, 0, TAU); x.fill();
  }
  function badgeSale(x) {
    frame(x, '#cdbd9a');
    x.save(); x.translate(-20, -6); x.scale(2.1, 2.1); x.fillStyle = '#c8a040'; polyPath(x, [[-22, -26], [0, -32], [22, -26], [24, 4], [0, 30], [-24, 4]]); x.fill();
    x.fillStyle = '#a8842c'; polyPath(x, [[-15, -18], [0, -22], [15, -18], [16, 2], [0, 20], [-16, 2]]); x.fill(); x.restore();
    x.strokeStyle = '#8a2a22'; x.lineWidth = 2; x.beginPath(); x.moveTo(10, 30); x.quadraticCurveTo(40, 40, 58, 30); x.stroke();
    x.save(); x.translate(58, 30); x.rotate(.35); x.fillStyle = '#e9d7a8'; polyPath(x, [[-8, 0], [6, -14], [70, -14], [70, 16], [6, 16]]); x.fill();
    x.fillStyle = INK; x.font = '900 13px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('FOR SALE', 38, 1); x.restore();
  }
  function poisonTable(x) {
    frame(x, '#4a4238'); x.fillStyle = '#2e2a36'; x.fillRect(60, -80, 60, 70); x.fillStyle = '#e8d8a8'; x.beginPath(); x.arc(92, -60, 8, 0, TAU); x.fill();
    x.fillStyle = '#6a5040'; for (const cx of [-96, 96]) { x.fillRect(cx - 14, -10, 6, 80); x.fillRect(cx - 14, 26, 28, 6); x.fillRect(cx + 8 * Math.sign(cx), 26, 6, 44); }
    x.fillStyle = '#efe6d2'; x.fillRect(-78, 20, 156, 16); x.fillStyle = '#5a4030'; x.fillRect(-70, 36, 8, 40); x.fillRect(62, 36, 8, 40);
    x.fillStyle = '#e8e2d4'; for (const px of [-50, 44]) { x.beginPath(); x.ellipse(px, 18, 16, 4, 0, 0, TAU); x.fill(); }
    x.fillStyle = '#3a5a2e'; x.beginPath(); x.roundRect(-10, -26, 22, 46, 4); x.fill(); x.fillRect(-4, -40, 10, 16);
    x.fillStyle = '#e6d8b0'; x.fillRect(-8, -14, 18, 18); x.fillStyle = INK; x.beginPath(); x.arc(1, -7, 4, 0, TAU); x.fill(); x.fillRect(-2, -3, 6, 4);
  }
  function arrowSlide(x, t) {
    frame(x, '#dcccaa');
    const hit = clamp((t - K.hitting + .05) / .25), shake = hit > 0 ? 3 * Math.sin((t - K.hitting) * 40) * Math.exp(-(t - K.hitting) * 6) : 0;
    x.save(); x.translate(-88 + shake, -4); x.fillStyle = '#5a3a22'; x.fillRect(-4, -80, 5, 160); x.fillStyle = '#f4f0e6'; x.fillRect(1, -74, 64, 88);
    x.fillStyle = INK; x.font = '900 12px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('W.C.T.U.', 33, -60);
    x.fillStyle = '#ffffff'; x.strokeStyle = '#8a8070'; x.lineWidth = 1; for (const b of [[[33, -30], [45, -38], [45, -22]], [[33, -30], [21, -38], [21, -22]], [[32, -30], [26, -8], [33, -12], [40, -8], [34, -30]]]) { polyPath(x, b); x.fill(); x.stroke(); }
    x.restore();
    x.save(); x.translate(92, 0); for (const [r, c] of [[44, '#8a2a22'], [32, '#f4f0e6'], [20, '#8a2a22'], [9, '#f4f0e6']]) { x.fillStyle = c; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill(); } x.restore();
    const u = clamp((t - K.aimed + .3) / (K.hitting - K.aimed + .35)); if (u <= 0) return;
    const P3 = s => {
      if (s < .45) return [lerp(-50, 44, s / .45), -10]; if (s < .65) { const a = -Math.PI / 2 + (s - .45) / .2 * Math.PI; return [44 + 13 * Math.cos(a), 3 + 13 * Math.sin(a)]; }
      return [lerp(44, -40, (s - .65) / .35), 16];
    };
    const p = P3(u), q = P3(Math.max(0, u - .02)), a = Math.atan2(p[1] - q[1], p[0] - q[0]);
    x.save(); x.translate(p[0], p[1]); x.rotate(a); x.fillStyle = INK; x.fillRect(-34, -1.5, 34, 3); polyPath(x, [[6, 0], [-4, -5], [-4, 5]]); x.fill();
    x.fillStyle = '#f4f0e6'; polyPath(x, [[-34, 0], [-40, -6], [-28, 0], [-40, 6]]); x.fill(); x.restore();
  }

  const PUSH = [K.handed, K.handed + .55], DROP = [K.m2 - .05, K.m2 + .45], BACK = [K.m3 - .1, K.m3 + .35], FLIP = [K.poisoned - .15, K.poisoned + .35], ARROW = [K.everything - .05, K.everything + .45], TRI = [K.reverse - .15, K.reverse + .45];
  function onScreen(x, t, tp) {
    const card = (fn, dx = 0, dy = 0, sx = 1) => { x.save(); x.translate(dx, dy); x.scale(sx, 1); fn(x); x.restore(); };
    if (t < PUSH[1]) { const u = easeIO(clamp((t - PUSH[0]) / (PUSH[1] - PUSH[0]))); card(ip => PR.promisePrison(ip, P, 1), 300 * u); if (u > 0) card(charter, -300 + 300 * u); return; }
    if (t < DROP[0]) { card(charter); return; }
    if (t < BACK[0]) { const u = easeOut(clamp((t - DROP[0]) / (DROP[1] - DROP[0]))); card(charter, 0, 220 * u); card(badgeSale, 0, -220 + 220 * u); return; }
    if (t < ARROW[0]) {
      const u = easeOut(clamp((t - BACK[0]) / (BACK[1] - BACK[0]))), f = clamp((t - FLIP[0]) / (FLIP[1] - FLIP[0])), sx = Math.abs(Math.cos(f * Math.PI));
      if (u < 1) card(badgeSale, 0, 220 * u);
      card(f < .5 ? (ip => PR.promiseHome(ip, P, 1, 1, tp)) : poisonTable, 0, -220 + 220 * u, Math.max(.02, sx)); return;
    }
    if (t < TRI[0]) { const u = easeIO(clamp((t - ARROW[0]) / (ARROW[1] - ARROW[0]))); if (u < 1) card(poisonTable, -300 * u); card(ip => arrowSlide(ip, t), 300 - 300 * u); return; }
    const u = easeIO(clamp((t - TRI[0]) / (TRI[1] - TRI[0])));
    if (u < 1) { x.save(); x.globalAlpha = 1 - u; arrowSlide(x, t); x.restore(); }
    x.save(); x.globalAlpha = u; x.fillStyle = '#2a2420'; x.fillRect(-150, -110, 300, 220);
    [charter, badgeSale, poisonTable].forEach((fn, i) => { x.save(); x.translate(-98 + i * 98, 0); x.scale(.31, .31); fn(x); x.restore(); }); x.restore();
  }
  function tent(x, t, tp) {
    x.fillStyle = '#231e1a'; x.fillRect(-1200, -900, 4400, 2700);
    x.fillStyle = 'rgba(80,64,48,.35)'; for (let k = -12; k < 26; k++) { polyPath(x, [[k * 120, -900], [k * 120 + 60, -900], [k * 120 + 110, 1400], [k * 120 + 40, 1400]]); x.fill(); }
    x.fillStyle = '#4a3a2c'; x.fillRect(SC[0] - 470, SC[1] - 350, 940, 700);
    x.save(); x.translate(SC[0], SC[1]); x.beginPath(); x.rect(-450, -330, 900, 660); x.clip();
    x.fillStyle = '#f4ead4'; x.fillRect(-450, -330, 900, 660); x.scale(SS, SS);
    x.beginPath(); x.rect(-150, -110, 300, 220); x.clip(); onScreen(x, t, tp);
    x.restore();
    x.fillStyle = 'rgba(255,236,190,.1)'; x.fillRect(SC[0] - 450, SC[1] - 330, 900, 660);
    const g = rng(35); for (let r = 0; r < 3; r++) for (let k = 0; k < 16; k++) {
      const hx = -200 + k * 150 + (r % 2) * 75 + (g() - .5) * 30, hy = 1000 + r * 110, s = 1.3 + r * .35;
      x.fillStyle = r === 2 ? '#0e0b0a' : '#17120f'; x.beginPath(); x.ellipse(hx, hy + 60 * s, 46 * s, 40 * s, 0, Math.PI, TAU); x.fill(); x.beginPath(); x.arc(hx, hy, 17 * s, 0, TAU); x.fill();
      if (g() < .5) { x.beginPath(); x.ellipse(hx, hy - 12 * s, 26 * s, 6 * s, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(hx, hy - 18 * s, 13 * s, 10 * s, 0, Math.PI, TAU); x.fill(); }
    }
  }
  const KEYS = [[0, [960, 440, 1.12]], [K.reverse - .2, [960, 450, 1.15]], [DUR, [960, 560, .86]]].map(([t, v]) => [t, [v[0], v[1] + (M45 ? 120 : 0), Math.log(v[2] * (M45 ? .95 : 1))]]);
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => tent(x, t, tp), { paperShadow: [4, 6, 5, .3] });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.handed, K.m2, K.poisoned, K.aimed, K.hitting, K.reverse],
  });
})();
