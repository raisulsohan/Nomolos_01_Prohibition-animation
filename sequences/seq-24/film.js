(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-24', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const LP = FILM.look('paper', W, H), PP = LP.P, pose = LP.pose;
  const S09 = FILM.getScene('seq-09').api;
  const K = { wipe: 1.301, corruption: 1.735, instead: 2.502, price: 3.47, every: 4.438,
    badge: 4.805, gavel: 5.338, country: 5.872, entire: 6.84, city: 7.474,
    quietly: 8.675, payroll: 9.342 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const LATE = 99;
  const CC = S09.CARDS.find(c => c.k === 'CORRUPTION'), PIN = [CC.x, CC.y - 66];

  const M = FILM.usmap({ width: 1400, cx: 2500, cy: -540 }), MH = M.height, SHEET = [2500 - 790, -540 - MH / 2 - 70, 1580, MH + 140];
  const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
  const PRICES = ['$500', '$200', '$1,000', '$50', '$300', '$100', '$2,000', '$250', '$75', '$400'];
  const ITEMS = (() => {
    const b = M.us.reduce((a, [x, y]) => [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)], [1e9, 1e9, -1e9, -1e9]), r = rng(83);
    const out = [{ p: M.cities.chicago, k: 'badge', t: K.corruption }];
    while (out.length < 26) { const p = [lerp(b[0], b[2], r()), lerp(b[1], b[3], r())]; if (inside(p, M.us) && inside([p[0], p[1] + 60], M.us) && out.every(q => Math.hypot(q.p[0] - p[0], q.p[1] - p[1]) > 150)) out.push({ p, k: out.length % 3 === 2 ? 'gavel' : 'badge' }); }
    const badges = out.filter((o, i) => i && o.k === 'badge'), gavels = out.filter(o => o.k === 'gavel');
    badges.forEach((o, i) => { o.t = K.every - .2 + i * (K.gavel - K.every) / badges.length; }); gavels.forEach((o, i) => { o.t = K.gavel - .1 + i * (K.country - K.gavel + .3) / gavels.length; });
    return out.map((o, i) => ({ ...o, price: PRICES[i % PRICES.length], sw: rng(i + 5)() - .5 }));
  })();
  const hole = o => [o.p[0] - 18, o.p[1] + 44];

  function wall(x) {
    x.fillStyle = '#5f7d78'; x.fillRect(-2000, -1400, 6600, 1400); x.fillStyle = '#465e5a'; x.fillRect(-2000, 0, 6600, 1200);
  }
  function map(x) {
    const [sx, sy, sw, sh] = SHEET;
    x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(sx + 8, sy + 10, sw, sh); x.fillStyle = '#efe4c8'; x.fillRect(sx, sy, sw, sh);
    x.fillStyle = '#e2d2a8'; polyPath(x, M.canada); x.save(); x.beginPath(); x.rect(sx, sy, sw, sh); x.clip(); x.fill(); polyPath(x, M.mexico); x.fill(); x.restore();
    x.fillStyle = '#d9c08a'; polyPath(x, M.us); x.fill(); x.strokeStyle = PP.ink; x.lineWidth = 2.5; x.stroke();
    x.fillStyle = '#efe4c8'; for (const l of Object.values(M.lakes)) { polyPath(x, l); x.fill(); }
    x.fillStyle = PP.red; for (const [px, py] of [[sx + 18, sy + 18], [sx + sw - 18, sy + 18]]) { x.beginPath(); x.arc(px, py, 8, 0, TAU); x.fill(); }
  }
  function badge(x) {
    x.fillStyle = 'rgba(0,0,0,.2)'; polyPath(x, [[-20, -24], [2, -30], [24, -24], [26, 6], [2, 32], [-22, 6]]); x.fill();
    x.fillStyle = '#c8a040'; polyPath(x, [[-22, -26], [0, -32], [22, -26], [24, 4], [0, 30], [-24, 4]]); x.fill();
    x.fillStyle = '#a8842c'; polyPath(x, [[-15, -18], [0, -22], [15, -18], [16, 2], [0, 20], [-16, 2]]); x.fill();
    x.fillStyle = '#ecd88a'; x.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 4.4 : 10; x.lineTo(rr * Math.cos(a), rr * Math.sin(a) - 1); } x.fill();
  }
  function gavel(x) {
    x.save(); x.rotate(-.5); x.fillStyle = 'rgba(0,0,0,.2)'; x.fillRect(-2, -2, 60, 10);
    x.fillStyle = '#6b4a30'; x.fillRect(-6, -4, 56, 8); x.fillStyle = '#8a603f'; x.beginPath(); x.roundRect(-30, -16, 30, 32, 5); x.fill();
    x.fillStyle = '#c8a040'; x.fillRect(-26, -16, 4, 32); x.fillRect(-8, -16, 4, 32); x.restore();
  }
  function tag(x, price, rot) {
    x.save(); x.rotate(rot);
    x.fillStyle = 'rgba(0,0,0,.18)'; polyPath(x, [[-6, 3], [8, -9], [66, -9], [66, 19], [8, 19]]); x.fill();
    x.fillStyle = '#e9d7a8'; polyPath(x, [[-8, 0], [6, -12], [64, -12], [64, 16], [6, 16]]); x.fill();
    x.strokeStyle = '#b89a60'; x.lineWidth = 2; x.beginPath(); x.arc(4, 2, 4, 0, TAU); x.stroke();
    x.fillStyle = '#2c2824'; x.font = '900 19px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(price, 37, 3);
    x.restore();
  }
  function item(x, o, tp) {
    const u = back((tp - o.t) / .3); if (u <= 0) return;
    x.save(); x.translate(o.p[0], o.p[1]); x.scale(u, u); (o.k === 'badge' ? badge : gavel)(x); x.restore();
    const g = smooth((tp - o.t - .15) / .3); if (g <= 0) return;
    const h = hole(o), rot = .35 + .12 * o.sw + .15 * Math.sin((tp - o.t) * 5) * Math.exp(-(tp - o.t) * 1.5);
    x.strokeStyle = PP.red; x.lineWidth = 2.5; x.beginPath(); x.moveTo(o.p[0] - 6, o.p[1] + 20); x.lineTo(h[0], h[1]); x.stroke();
    x.save(); x.globalAlpha = g; x.translate(h[0], h[1]); tag(x, o.price, rot); x.restore();
  }
  function strings(x, tp) {
    x.strokeStyle = PP.red; x.lineWidth = 3.5; x.lineCap = 'round';
    for (const o of ITEMS) {
      const d0 = o === ITEMS[0] ? .7 : .45, u = easeOut(clamp((tp - o.t - (o === ITEMS[0] ? 0 : .1)) / d0)); if (u <= 0) continue;
      const h = hole(o), sag = 90 * (1 - easeOut(clamp((tp - o.t - d0) / .25)));
      const m = [(PIN[0] + h[0]) / 2, (PIN[1] + h[1]) / 2 + sag + 40 * (1 - u)];
      x.beginPath(); for (let k = 0; k <= 30; k++) { const s = k / 30 * u, q = [(1 - s) ** 2 * PIN[0] + 2 * (1 - s) * s * m[0] + s * s * h[0], (1 - s) ** 2 * PIN[1] + 2 * (1 - s) * s * m[1] + s * s * h[1]]; k ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); } x.stroke();
    }
    x.fillStyle = PP.red; x.beginPath(); x.arc(PIN[0], PIN[1], 8, 0, TAU); x.fill();
  }

  const LED = { x: 2500, y: 480, pw: 520, ph: 660 };
  const ROWS = [['POLICE CAPTAIN', '$500'], ['JUDGE, CIRCUIT COURT', '$1,000'], ['ALDERMAN, 20TH WARD', '$300'], ['CITY PROSECUTOR', '$750'], ["MAYOR'S OFFICE", '$2,000'], ['PRECINCT SERGEANTS', '$1,200']];
  const INK = [K.city - .1, K.quietly - .15];
  function page(x, x0, y0, w, h) {
    x.fillStyle = '#f4ecd8'; x.fillRect(x0, y0, w, h);
    x.strokeStyle = 'rgba(80,120,170,.3)'; x.lineWidth = 1.5; for (let y = y0 + 110; y < y0 + h - 20; y += 44) { x.beginPath(); x.moveTo(x0 + 20, y); x.lineTo(x0 + w - 20, y); x.stroke(); }
  }
  function cityHall(x, u) {
    x.save(); x.beginPath(); x.rect(-260, 260 - 520 * u, 520, 520 * u + 10); x.clip();
    x.strokeStyle = '#2c2824'; x.lineWidth = 4; x.lineJoin = 'round';
    x.strokeRect(-190, 20, 380, 200); x.strokeRect(-60, -100, 120, 120); x.beginPath(); x.moveTo(-70, -100); x.lineTo(0, -170); x.lineTo(70, -100); x.stroke();
    x.beginPath(); x.arc(0, -40, 30, 0, TAU); x.stroke(); x.beginPath(); x.moveTo(0, -40); x.lineTo(0, -62); x.moveTo(0, -40); x.lineTo(14, -34); x.stroke();
    for (let k = 0; k < 7; k++) { x.beginPath(); x.moveTo(-162 + k * 54, 60); x.lineTo(-162 + k * 54, 200); x.stroke(); }
    x.beginPath(); x.moveTo(-210, 20); x.lineTo(210, 20); x.moveTo(-220, 220); x.lineTo(220, 220); x.stroke();
    x.fillStyle = '#2c2824'; x.font = '900 34px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('CITY HALL', 0, 262);
    x.restore();
  }
  function ledger(x, t) {
    const { x: lx, y: ly, pw, ph } = LED, close = easeIO(clamp((t - K.quietly) / .6)), f = Math.cos(Math.PI * close);
    const sl = (pw + 14) * Math.max(0, f); x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(lx - sl + 10, ly - ph / 2, sl + pw + 18, ph + 28);
    x.fillStyle = '#34463a'; x.fillRect(lx - 4, ly - ph / 2 - 14, pw + 18, ph + 28);
    page(x, lx, ly - ph / 2, pw, ph);
    x.fillStyle = '#2c2824'; x.font = '900 46px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('PAYROLL', lx + pw / 2, ly - ph / 2 + 56);
    ROWS.forEach(([who, amt], i) => {
      const u = clamp((t - INK[0] - i * (INK[1] - INK[0]) / ROWS.length) / .3); if (u <= 0) return;
      const y = ly - ph / 2 + 110 + 44 * i + 30;
      x.save(); x.beginPath(); x.rect(lx + 20, y - 30, (pw - 40) * u, 40); x.clip();
      x.fillStyle = '#2c2824'; x.font = '700 22px NSC'; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillText(who, lx + 30, y);
      x.textAlign = 'right'; x.fillStyle = '#8b2a22'; x.fillText(amt, lx + pw - 30, y); x.restore();
    });
    x.save(); x.translate(lx, ly); x.scale(f, 1);
    if (f > 0) { x.fillStyle = '#34463a'; x.fillRect(-pw - 14, -ph / 2 - 14, pw + 18, ph + 28); page(x, -pw, -ph / 2, pw, ph); x.translate(-pw / 2, -30); cityHall(x, smooth((t - K.city + .1) / .7)); }
    else {
      x.scale(-1, 1); x.translate(pw, 0);
      x.fillStyle = '#34463a'; x.fillRect(-pw - 14 + 4, -ph / 2 - 14, pw + 18, ph + 28);
      x.strokeStyle = '#c8a040'; x.lineWidth = 4; x.strokeRect(-pw + 30, -ph / 2 + 30, pw - 50, ph - 60);
      x.fillStyle = '#d8b050'; x.font = '900 64px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('PAYROLL', -pw / 2 + 5, -40);
      x.font = '900 26px NSC'; x.fillText('CITY OF CHICAGO', -pw / 2 + 5, 30);
    }
    x.restore();
    x.fillStyle = 'rgba(40,30,20,.35)'; if (close < .5) x.fillRect(lx - 3, ly - ph / 2, 6, ph);
  }
  function desk(x) {
    x.fillStyle = '#6b4a30'; x.fillRect(1300, 70, 2500, 1100); x.fillStyle = '#8a603f'; x.fillRect(1300, 70, 2500, 16);
    x.fillStyle = 'rgba(40,24,14,.15)'; for (let y = 120; y < 1100; y += 38) x.fillRect(1300, y, 2500, 3);
  }

  const CH = ITEMS[0].p;
  const KEYS = M45
    ? [[0, [820, -250, .9]], [K.corruption - .1, [840, -200, 1.05]], [K.instead - .2, [900, -200, 1.02]], [K.price + .05, [CH[0] + 10, CH[1] + 30, 1.55]], [K.every, [CH[0] + 20, CH[1] + 30, 1.58]],
      [K.country + .5, [2360, -520, .64]], [K.entire + .1, [2360, -515, .645]], [K.city + .3, [LED.x, LED.y, .88]], [K.quietly, [LED.x, LED.y, .9]], [K.payroll, [LED.x + 265, LED.y, 1.35]], [DUR, [LED.x + 265, LED.y, 1.4]]]
    : [[0, [820, -250, 1.45]], [K.corruption - .1, [840, -200, 1.75]], [K.instead - .2, [900, -200, 1.7]], [K.price + .05, [CH[0] + 10, CH[1] + 30, 2.4]], [K.every, [CH[0] + 20, CH[1] + 30, 2.45]],
      [K.country + .5, [1980, -450, .52]], [K.entire + .1, [1980, -445, .525]], [K.city + .3, [LED.x, LED.y, 1.25]], [K.quietly, [LED.x, LED.y, 1.27]], [K.payroll, [LED.x + 265, LED.y, 1.45]], [DUR, [LED.x + 265, LED.y, 1.5]]];
  const LK = KEYS.map(([t, v]) => [t, [v[0], v[1], Math.log(v[2])]]);
  function camera(t) { const v = keyed(t, LK); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    LP.background(ctx);
    LP.sheet(ctx, cam, 1, R, x => { wall(x); S09.reformers(x, LATE); map(x); desk(x); for (const o of ITEMS) item(x, o, tp); strings(x, tp); ledger(x, t); }, { paperShadow: [6, 8, 6, .35] });
    LP.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.corruption, K.price, K.every, K.gavel, K.country, K.city, K.quietly, K.payroll],
  });
})();
