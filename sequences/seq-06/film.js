(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-06', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues('seq-06'), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { one: 2.035, known: 3.27, you: 4.605, how: 6.039,
    drinking: 6.707, was: 7.975 };
  const HO = [K.one, K.known, K.you];
  const ERA = [
    { skin: '#a8714a', side: -1, year: -3000 },
    { skin: '#c48c62', side: 1, year: -500 },
    { skin: '#d6a27c', side: -1, year: 1400 },
    { skin: '#e2b28c', side: 1, year: 1800 },
  ];
  const HS = 1.35, AW = 1.3;
  const GRIP0 = [960, 520], TOP = 1340, GO = 44 * HS;
  const TILT = [K.you + .1, K.you + 1.3], DROP = 520;
  const SLAM = [K.how - .12, K.how + .05];

  function camera(t) {
    const d = easeIO(clamp((t - TILT[0]) / (TILT[1] - TILT[0]))), push = easeIO(clamp((t - TILT[1] + .2) / (DUR - .3 - TILT[1] + .2)));
    const gs = gripAt(t, t), zc = lerp(1.5, 1.85, easeOut(clamp(t / TILT[0]), 1.8));
    const q = easeIO(clamp((t - K.drinking + .1) / (K.was - K.drinking + .2))), bx = M45 ? 200 : 0, qx = M45 ? 310 : 360;
    return { x: lerp(lerp(960, gs[0], .75), 960 + 30 * push + bx, d) + qx * q, y: lerp(gs[1] - 30, 540 + DROP * d + 15 * push, d) + 230 * q,
      z: (M45 ? .92 : 1) * lerp(zc, 1 + .09 * push, d) * (1 + .35 * q) };
  }

  const V = 70, STOP = 1.3;
  const drift = t => { const u = Math.min(Math.max(t - HO[2], 0), STOP); return V * Math.min(t, HO[2]) + V * u * (1 - u / (2 * STOP)); };
  const HZ = 640;
  const hexA = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;
  function palm(x, px, h) {
    x.strokeStyle = '#6a4a2a'; x.lineWidth = 12; x.beginPath(); x.moveTo(px, HZ); x.quadraticCurveTo(px + 20, HZ - h * .6, px + 10, HZ - h); x.stroke();
    x.fillStyle = '#4f6a3a'; for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .5; x.save(); x.translate(px + 10, HZ - h); x.rotate(a); x.beginPath(); x.ellipse(40, 0, 44, 10, .25 * Math.sign(k - 3), 0, TAU); x.fill(); x.restore(); }
  }
  const cypress = (x, px, h) => { x.fillStyle = '#3f5a3a'; x.beginPath(); x.ellipse(px, HZ - h / 2, 20, h / 2, 0, 0, TAU); x.fill(); };
  const olive = (x, px) => { x.fillStyle = '#5a4a30'; x.fillRect(px - 5, HZ - 60, 10, 60); x.fillStyle = '#7d8a5a'; x.beginPath(); x.ellipse(px, HZ - 80, 58, 36, 0, 0, TAU); x.fill(); };
  const BD = [
    { sky: ['#f0d29a', '#e2b878'], hills: '#b98e5c', ground: '#c9a066', at: 1520, draw(x, c) {
      x.fillStyle = '#9c7046'; for (let k = 0; k < 3; k++) { const w = 560 - k * 150; x.fillRect(c - w / 2, HZ - 95 * (k + 1), w, 95); }
      x.fillStyle = '#b88a58'; for (let k = 0; k < 3; k++) { const w = 560 - k * 150; x.fillRect(c - w / 2, HZ - 95 * (k + 1), w * .62, 95); }
      x.fillStyle = '#8a6040'; x.fillRect(c - 32, HZ - 285, 64, 285); x.fillStyle = '#7a5236'; for (let y = HZ - 275; y < HZ; y += 22) x.fillRect(c - 32, y, 64, 5);
      x.fillStyle = '#a87a4c'; x.fillRect(c - 55, HZ - 345, 110, 60);
      palm(x, c - 420, 230); palm(x, c + 400, 260); palm(x, c + 490, 200); palm(x, c - 640, 250); palm(x, c - 1020, 220);
      x.fillStyle = '#c29a62'; for (const hx of [c - 820, c - 735, c + 660, c + 745]) { x.beginPath(); x.ellipse(hx, HZ, 50, 60, 0, Math.PI, TAU); x.fill(); }
    } },
    { sky: ['#dfeaec', '#bcd2d8'], hills: '#98a07a', ground: '#b6aa7c', at: 1240, draw(x, c) {
      x.fillStyle = '#a89a70'; x.beginPath(); x.ellipse(c, HZ + 20, 440, 115, 0, Math.PI, TAU); x.fill();
      x.fillStyle = '#d9d0bc'; x.fillRect(c - 240, HZ - 118, 480, 28); x.fillRect(c - 222, HZ - 136, 444, 18);
      x.fillStyle = '#ebe4d4'; for (let k = 0; k < 8; k++) x.fillRect(c - 205 + k * 56, HZ - 290, 26, 154);
      x.fillStyle = '#e3dccb'; x.fillRect(c - 230, HZ - 322, 460, 34); polyPath(x, [[c - 240, HZ - 322], [c + 240, HZ - 322], [c, HZ - 395]]); x.fill();
      x.fillStyle = 'rgba(80,70,60,.18)'; polyPath(x, [[c - 200, HZ - 330], [c + 200, HZ - 330], [c, HZ - 382]]); x.fill();
      cypress(x, c - 340, 190); cypress(x, c - 298, 150); olive(x, c + 340); olive(x, c + 440); cypress(x, c + 545, 170);
      olive(x, c - 760); cypress(x, c - 900, 200); olive(x, c - 1060);
    } },
    { sky: ['#b8c0c2', '#8f9a9e'], hills: '#6c7866', ground: '#7f8a6c', at: 1560, draw(x, c) {
      x.fillStyle = '#8d8e8a'; x.fillRect(c - 230, HZ - 180, 460, 180);
      for (let k = 0; k < 12; k++) x.fillRect(c - 230 + k * 40, HZ - 204, 22, 26);
      for (const tx of [c - 250, c + 190]) { x.fillStyle = '#8d8e8a'; x.fillRect(tx - 10, HZ - 300, 80, 300); x.fillStyle = '#6a4a3a'; polyPath(x, [[tx - 20, HZ - 300], [tx + 80, HZ - 300], [tx + 30, HZ - 395]]); x.fill(); }
      x.fillStyle = '#5a5654'; x.beginPath(); x.roundRect(c - 30, HZ - 110, 60, 110, [30, 30, 0, 0]); x.fill();
      x.fillStyle = '#7d7a74'; x.fillRect(c - 700, HZ - 210, 64, 210); polyPath(x, [[c - 710, HZ - 210], [c - 626, HZ - 210], [c - 668, HZ - 370]]); x.fill();
      const tv = c - 1000; x.fillStyle = '#e6dcc4'; x.fillRect(tv - 100, HZ - 160, 200, 160); x.fillStyle = '#4a3322';
      for (const bx of [-100, -34, 30, 94]) x.fillRect(tv + bx, HZ - 160, 6, 160); x.fillRect(tv - 100, HZ - 86, 200, 6); polyPath(x, [[tv - 122, HZ - 160], [tv + 122, HZ - 160], [tv, HZ - 245]]); x.fill();
      x.fillRect(tv + 100, HZ - 140, 56, 5); x.fillStyle = '#8a6a3a'; x.fillRect(tv + 128, HZ - 135, 36, 32);
      x.fillStyle = '#f2c46e'; x.fillRect(tv - 70, HZ - 130, 34, 30); x.fillRect(tv + 36, HZ - 130, 34, 30);
    } },
    { sky: ['#e2a468', '#b8683e'], hills: '#7a5a40', ground: '#96714c', at: 960 + V * (HO[2] + STOP / 2), draw(x, c) {
      const fronts = [[-640, 250, 250, '#6b4e36'], [-360, 290, 330, '#7a5a3e'], [-40, 280, 300, '#5e4632'], [270, 240, 260, '#6e5038'], [560, 270, 310, '#644834']];
      for (const [dx, w, h, col] of fronts) {
        x.fillStyle = col; x.fillRect(c + dx - w / 2, HZ - h, w, h); x.fillStyle = 'rgba(30,18,10,.35)'; x.fillRect(c + dx - w / 2, HZ - h, w, 14);
        x.fillStyle = '#f2c46e'; for (const wx of [-w * .3, w * .1]) x.fillRect(c + dx + wx, HZ - h * .55, w * .2, h * .28);
      }
      x.fillStyle = '#3e2c1e'; x.fillRect(c - 800, HZ - 120, 1600, 14); for (let k = 0; k < 17; k++) x.fillRect(c - 790 + k * 100, HZ - 120, 10, 120);
      x.fillStyle = '#2e2218'; x.fillRect(c + 820, HZ - 330, 12, 330); x.fillRect(c + 780, HZ - 320, 92, 8);
    } },
  ];
  function backdrop(x, b, s) {
    const g = x.createLinearGradient(0, -300, 0, HZ); g.addColorStop(0, b.sky[1]); g.addColorStop(1, b.sky[0]);
    x.fillStyle = g; x.fillRect(-900, -900, 3800, HZ + 900);
    const s2 = s * .5; x.fillStyle = b.hills;
    x.beginPath(); x.moveTo(-900, HZ); for (let px = -900; px <= 2900; px += 40) x.lineTo(px, HZ - 60 - 40 * Math.sin((px + s2) * .004) - 25 * Math.sin((px + s2) * .011 + 1)); x.lineTo(2900, HZ); x.closePath(); x.fill();
    x.fillStyle = b.ground; x.fillRect(-900, HZ, 3800, 1400);
    b.draw(x, b.at - s);
  }
  function panorama(x, t) {
    const s = drift(t), a = [1, ...HO.map(h => smooth((t - h + .25) / .6))];
    let first = 0; for (let i = 3; i >= 0; i--) if (a[i] >= 1) { first = i; break; }
    for (let i = first; i < 4; i++) { if (a[i] <= 0) continue; x.globalAlpha = a[i]; backdrop(x, BD[i], s); }
    x.globalAlpha = 1;
    const dusk = smooth((t - HO[2]) / 1.6);
    if (dusk > 0) { x.fillStyle = `rgba(40,22,14,${.34 * dusk})`; x.fillRect(-900, -900, 3800, 3000); }
  }

  const SL_W = TAU / .55, SL_Z = .3, SL_WD = SL_W * Math.sqrt(1 - SL_Z * SL_Z), SL_G = 8000;
  function slosh(t) {
    const d = .04, gx = u => gripAt(u, u)[0];
    let s = 0;
    for (let j = 0; j < 28; j++) {
      const u = t - j * d, a = (gx(u - d) - 2 * gx(u) + gx(u + d)) / (d * d);
      s += a * Math.exp(-SL_Z * SL_W * j * d) * Math.sin(SL_WD * j * d) * d;
    }
    return clamp(s * SL_W * SL_W / SL_WD / SL_G + .012 * Math.sin(t * 5.3), -.3, .3);
  }
  const FOAM_R = (() => { const r = rng(7); return Array.from({ length: 9 }, () => .13 + .05 * r()); })();
  function foam(x, y, hw, h, s, col, hi) {
    x.save(); x.translate(0, y); x.rotate(s * .6);
    const top = u => [lerp(-hw, hw, u) + s * 25 * Math.sin(Math.PI * u), -h * Math.pow(Math.sin(Math.PI * u), .55)];
    x.fillStyle = col; x.beginPath(); x.moveTo(-hw, 2);
    for (let k = 0; k <= 20; k++) { const p = top(k / 20); x.lineTo(p[0], p[1]); }
    x.lineTo(hw, 2); x.closePath(); x.fill();
    FOAM_R.forEach((f, k) => { const p = top((k + .5) / 9), r = hw * f; x.beginPath(); x.arc(p[0], p[1] + r * .45, r, 0, TAU); x.fill(); });
    x.fillStyle = hi;
    FOAM_R.forEach((f, k) => { if (k > 5) return; const p = top((k + .5) / 9), r = hw * f; x.beginPath(); x.arc(p[0] - r * .3, p[1] + r * .3, r * .42, 0, TAU); x.fill(); });
    x.restore();
  }
  function drip(x, x0, y0, x1, y1, L, col) {
    if (L <= 1) return;
    const n = Math.hypot(x1 - x0, y1 - y0), ex = x0 + (x1 - x0) * L / n, ey = y0 + (y1 - y0) * L / n, o = Math.sign(x0) * 2;
    x.strokeStyle = col; x.fillStyle = col; x.lineWidth = 6; x.lineCap = 'round';
    x.beginPath(); x.moveTo(x0 + o, y0); x.lineTo(ex + o, ey); x.stroke(); x.beginPath(); x.arc(ex + o, ey + 2, 5.5, 0, TAU); x.fill();
  }
  function wineCrest(x, s) {
    const lv = -147.5, tn = clamp(Math.tan(s) * .4, -11.5 / 130, 11.5 / 130); if (Math.abs(tn) < .022) return;
    const e = s > 0 ? -1 : 1, xe = 130 * e, ye = lv + xe * tn, xc = -2.5 / tn;
    x.fillStyle = '#6b1024'; x.beginPath(); x.moveTo(xc, -150); x.lineTo(xe, ye); x.quadraticCurveTo(xe + 7 * e, ye, xe + 5 * e, -149); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(214,120,130,.7)'; x.lineWidth = 2; x.beginPath(); x.moveTo(xc, -150.5); x.lineTo(xe, ye - .5); x.stroke();
  }
  function wineDrops(x, tp, g) {
    const tau = tp - (HO[0] + .04); if (tau <= 0 || tau > .7) return;
    const r = rng(12); x.fillStyle = hexA('#6b1024', 1 - tau / .7);
    for (let k = 0; k < 7; k++) {
      const e = k % 2 ? 1 : -1, vx = e * (60 + 140 * r()), vy = -(260 + 220 * r()), x0 = g[0] + e * (80 + 40 * r()) * HS, y0 = g[1] + GO - 150 * HS;
      x.beginPath(); x.arc(x0 + vx * tau, y0 + vy * tau + 1200 * tau * tau, 7 * (1 - tau * .6), 0, TAU); x.fill();
    }
  }
  function whiskey(x, s, tp) {
    const glass = [[-22, 0], [22, 0], [28, -60], [-28, -60]], inner = [[-20, -4], [20, -4], [25.5, -57], [-25.5, -57]], lv = tp > SLAM[1] ? -33 : -41;
    x.save(); x.scale(2.2, 2.2);
    x.fillStyle = 'rgba(220,235,240,.75)'; polyPath(x, glass); x.fill();
    x.save(); polyPath(x, inner); x.clip();
    x.save(); x.translate(0, lv); x.rotate(s); x.beginPath(); x.rect(-60, 0, 120, 80); x.restore(); x.clip();
    x.fillStyle = P.amber; x.fillRect(-30, -70, 60, 75);
    x.fillStyle = hexA(P.amberDark, .45); x.fillRect(9, -70, 9, 75);
    x.restore();
    x.save(); polyPath(x, inner); x.clip(); x.translate(0, lv); x.rotate(s);
    x.strokeStyle = 'rgba(255,241,200,.8)'; x.lineWidth = 2.2; x.beginPath(); x.moveTo(-40, .6); x.lineTo(40, .6); x.stroke();
    x.restore();
    x.fillStyle = 'rgba(255,255,255,.45)'; polyPath(x, [[-19, -6], [-15, -6], [-20, -54], [-24, -54]]); x.fill();
    x.strokeStyle = 'rgba(40,40,40,.5)'; x.lineWidth = 2; polyPath(x, glass); x.stroke();
    x.restore();
  }

  function vessel(x, v, s, tp) {
    if (v === 0) {
      x.strokeStyle = '#d8b36a'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(10, -120); x.lineTo(-46, -211); x.stroke();
      x.fillStyle = '#a0603a'; polyPath(x, [[-38, 0], [38, 0], [58, -150], [-58, -150]]); x.fill();
      x.fillStyle = '#7f4a2c'; x.fillRect(-60, -156, 120, 12); x.strokeStyle = 'rgba(60,30,15,.5)'; x.lineWidth = 4;
      for (const y of [-110, -92]) { x.beginPath(); x.moveTo(-52, y); x.lineTo(52, y); x.stroke(); }
      x.fillStyle = 'rgba(255,220,170,.2)'; polyPath(x, [[-30, -10], [-20, -10], [-34, -140], [-46, -140]]); x.fill();
      drip(x, 58, -150, 38, 0, 58 * smooth(tp / 1.8), '#b5823a');
      foam(x, -154, 61, 18, s, '#e6d2a2', '#f7ecd2');
    } else if (v === 1) {
      x.fillStyle = '#1c1614'; x.beginPath(); x.ellipse(0, -6, 52, 10, 0, 0, TAU); x.fill(); x.fillRect(-9, -80, 18, 76);
      x.beginPath(); x.moveTo(-130, -150); x.quadraticCurveTo(-110, -78, 0, -76); x.quadraticCurveTo(110, -78, 130, -150); x.closePath(); x.fill();
      x.fillStyle = '#c56a3a'; x.fillRect(-126, -150, 252, 9); x.beginPath(); x.moveTo(-96, -116); x.quadraticCurveTo(0, -96, 96, -116); x.lineTo(90, -104); x.quadraticCurveTo(0, -86, -90, -104); x.closePath(); x.fill();
      x.strokeStyle = '#1c1614'; x.lineWidth = 8; x.beginPath(); x.arc(-132, -128, 16, Math.PI * .5, Math.PI * 1.5); x.moveTo(132, -144); x.arc(132, -128, 16, -Math.PI * .5, Math.PI * .5); x.stroke();
      wineCrest(x, s);
    } else if (v === 2) {
      x.save(); x.translate(44, -148); x.rotate(2.3); x.translate(-44, 148);
      x.fillStyle = '#6f7478'; x.beginPath(); x.ellipse(0, -150, 50, 14, 0, Math.PI, TAU); x.fill(); x.fillRect(38, -176, 14, 28);
      x.restore();
      x.fillStyle = '#8e9296'; polyPath(x, [[-50, 0], [50, 0], [44, -140], [-44, -140]]); x.fill();
      x.fillStyle = '#6f7478'; x.fillRect(-54, -12, 108, 12); x.fillRect(-48, -146, 96, 10);
      x.strokeStyle = '#6f7478'; x.lineWidth = 14; x.beginPath(); x.arc(52, -76, 42, -1.3, 1.3); x.stroke();
      x.fillStyle = 'rgba(255,255,255,.3)'; x.fillRect(-32, -130, 12, 116);
      drip(x, -44, -140, -50, 0, 46 * smooth((tp - HO[1]) / 1.1), P.cream);
      foam(x, -145, 50, 22, s, P.cream, '#fffaf0');
    } else whiskey(x, s, tp);
  }

  function arm(x, e, i, b, h) {
    const dx = h[0] - b[0], dy = h[1] - b[1], n = Math.hypot(dx, dy), nx = -dy / n, ny = dx / n;
    const at = (u, w) => [[b[0] + dx * u + nx * w * AW, b[1] + dy * u + ny * w * AW], [b[0] + dx * u - nx * w * AW, b[1] + dy * u - ny * w * AW]];
    const seg = (u0, u1, w0, w1, col) => { const [a0, a1] = at(u0, w0), [c0, c1] = at(u1, w1); x.fillStyle = col; polyPath(x, [a0, c0, c1, a1]); x.fill(); };
    const ring = (u, w, th, col) => seg(u - th / n / 2, u + th / n / 2, w, w, col);
    const wAt = u => lerp(58, 25, u);
    seg(0, 1, 58, 25, e.skin);
    if (i === 0) {
      ring(.74, wAt(.74) + 3, 16, '#d9a93a'); ring(.78, wAt(.78) + 2, 6, '#b8862a');
    } else if (i === 1) {
      seg(0, .44, 96, 72, '#efe8d8'); x.strokeStyle = 'rgba(120,100,80,.35)'; x.lineWidth = 4;
      for (const w of [-40, -10, 22, 50]) { const [p0] = at(.02, w), [p1] = at(.42, w * .8); x.beginPath(); x.moveTo(p0[0], p0[1]); x.lineTo(p1[0], p1[1]); x.stroke(); }
      ring(.43, 74, 14, '#1f4f7a');
    } else if (i === 2) {
      seg(0, .84, 74, 40, '#6b5234'); ring(.8, 44, 30, '#8a6e48'); x.strokeStyle = 'rgba(40,26,14,.4)'; x.lineWidth = 4;
      for (const u of [.3, .5, .66]) { const [p0, p1] = at(u, 50); x.beginPath(); x.moveTo(p0[0], p0[1]); x.quadraticCurveTo((p0[0] + p1[0]) / 2 + dx / n * 14, (p0[1] + p1[1]) / 2 + dy / n * 14, p1[0], p1[1]); x.stroke(); }
    } else {
      seg(0, .86, 72, 40, e.sleeve || '#ece4d4'); ring(.83, 42, 26, e.cuff || '#f6f1e6');
      if (e.garter !== false) ring(.46, wAt(.46) + 8, 18, e.garter || '#8a1f1f');
    }
  }
  const RV = [44, 9, 48, 53], R_GLASS = 47, R_BOTTLE = 34;
  const handOpts = h => ({ h: h.h, side: h.e.side, r: h.r, grip: h.grip, skin: h.e.skin, s: HS, arm: Math.atan2(h.base[1] - h.h[1], h.base[0] - h.h[0]),
    style: !h.extra && h.e.side > 0 ? 'thumb' : 'fingers' });

  function gripAt(t, tp) {
    const calm = 1 - smooth((t - SLAM[0] + .7) / .5);
    let gx = GRIP0[0] + 16 * Math.sin(t * .9) * calm, gy = GRIP0[1] + 9 * Math.sin(t * 1.3 + .5) * calm;
    for (let i = 0; i < 3; i++) { const b = smooth((t - HO[i] + .4) / .4) * (1 - smooth((t - HO[i] - .15) / .9)); gx += ERA[i + 1].side * 46 * b; }
    if (t > HO[2]) {
      const low = easeIO(clamp((t - TILT[0]) / (TILT[1] - TILT[0]))), lift = easeOut(clamp((tp - SLAM[0] + .5) / .42)) * 90, slam = easeIn(clamp((tp - SLAM[0]) / (SLAM[1] - SLAM[0])), 2);
      gy = lerp(gy + DROP * low - lift, TOP - 4 - GO, slam); gx = lerp(gx, 930, slam);
    }
    return [gx, gy];
  }
  function handOf(i, t, g) {
    const e = ERA[i], a = i ? HO[i - 1] : -9, b = i < 3 ? HO[i] : SLAM[1] + .25;
    const inU = i ? easeOut(clamp((t - (a - .55)) / .45)) : 1, outU = easeIn(clamp((t - (b + .06)) / .5));
    if (inU <= 0 || outU >= 1) return null;
    const grip = Math.min(i ? smooth((t - (a - .24)) / .2) : 1, 1 - smooth((t - (b - .02)) / .2));
    const off = Math.max(1 - smooth((t - (a - .17)) / .1), smooth((t - (b + .03)) / .12));
    const base = [GRIP0[0] + e.side * 380, 1560];
    let h = [g[0] + e.side * 100 * off, g[1] - 6 * off];
    const k = inU * (1 - outU); h = [lerp(base[0] + (h[0] - base[0]) * .3, h[0], k), lerp(base[1] + (h[1] - base[1]) * .3, h[1], k)];
    return { e, i, base, h, grip, r: RV[i] };
  }

  const EXTRA = [
    { dt: .34, dx: -440, side: -1, sleeve: '#2c2a2e', cuff: '#efe9dc', garter: false, skin: '#d8a882' },
    { dt: .6, dx: 330, side: 1, sleeve: '#5a4632', cuff: '#e8e0cc', garter: false, skin: '#c89468' },
    { dt: .84, dx: -200, side: -1, tip: 1, sleeve: '#ece4d4', skin: '#e0b08a' },
    { dt: 1.04, dx: 470, side: 1, sleeve: '#3a3440', cuff: '#efe9dc', garter: false, skin: '#b88660' },
    { dt: 1.22, dx: 140, side: 1, bottle: 1, sleeve: '#ece4d4', garter: '#1f3a6a', skin: '#dcae88' },
    { dt: 1.38, dx: -640, side: -1, sleeve: '#5a4632', cuff: '#e8e0cc', garter: false, skin: '#d2a07a' },
    { dt: 1.5, dx: 250, side: 1, tip: 1, sleeve: '#2c2a2e', cuff: '#efe9dc', garter: false, skin: '#e2b490' },
  ];
  const DRUNK = [K.drinking + .2, K.drinking + .75], DX = 1660;
  function counter(x) {
    x.fillStyle = '#5a3a22'; x.fillRect(330, TOP, 3000, 600);
    x.fillStyle = '#4a2f1b'; for (let k = 0; k < 14; k++) x.fillRect(360 + k * 210, TOP + 60, 170, 220);
    x.fillStyle = '#6b4529'; for (let k = 0; k < 14; k++) x.fillRect(372 + k * 210, TOP + 72, 146, 196);
    x.fillStyle = '#8a5e3a'; x.fillRect(310, TOP - 26, 3040, 30); x.fillStyle = '#a2744a'; x.fillRect(310, TOP - 26, 3040, 7);
    x.fillStyle = '#c8a050'; x.fillRect(330, TOP + 320, 3000, 12);
  }
  function drunk(x, tp) { x.save(); x.translate(DX, TOP); x.scale(1.15, 1.15); x.translate(-DX, -TOP); drunkBody(x, tp); x.restore(); }
  function drunkBody(x, tp) {
    const u = easeIn(clamp((tp - DRUNK[0]) / (DRUNK[1] - DRUNK[0])), 2.2), sway = Math.sin(tp * 2.6) * .05 * (1 - u) + .05 * u;
    const hatU = clamp((tp - DRUNK[1] + .15) / .45), sy = TOP + 200, bar = TOP - sy;
    PR.shotGlass(x, P, DX + 150, TOP - 4, 2, .15);
    x.fillStyle = '#2e1e12'; x.fillRect(DX - 80, sy, 160, 24); x.fillRect(DX - 66, sy + 24, 16, 400); x.fillRect(DX + 50, sy + 24, 16, 400); x.fillRect(DX - 66, sy + 200, 132, 12);
    x.save(); x.translate(DX, sy); x.rotate(sway);
    const sh = lerp(-322, -236, u), hy = lerp(sh - 42, sh + 10, u);
    const head = () => {
      x.fillStyle = '#b8845e'; x.beginPath(); x.arc(-40, hy + 6, 9, 0, TAU); x.arc(40, hy + 6, 9, 0, TAU); x.fill();
      x.fillStyle = '#c89468'; x.fillRect(-16, hy + 20, 32, 26);
      x.fillStyle = '#2a1e18'; x.beginPath(); x.ellipse(0, hy, 40, 40, 0, 0, TAU); x.fill();
    };
    if (u > .45) head();
    x.fillStyle = '#2e241c';
    for (const d of [-1, 1]) { polyPath(x, [[d * 58, sh + 18], [d * 90, sh + 44], [d * lerp(98, 128, u), bar + 4], [d * lerp(66, 94, u), bar - 4]]); x.fill(); }
    x.fillStyle = '#3a2c24'; polyPath(x, [[-86, 0], [86, 0], [92, sh + 36], [66, sh], [-66, sh], [-92, sh + 36]]); x.fill();
    x.fillStyle = '#2a2018'; x.fillRect(-3, sh + 30, 6, -sh - 30); x.fillStyle = '#e6dcc4'; x.fillRect(-26, sh - 4, 52, 10);
    if (u <= .45) head();
    x.restore();
    const h0 = [DX + Math.sin(sway) * -(hy - 38), sy + Math.cos(sway) * (hy - 38)], h1 = [DX - 190, TOP - 12];
    const hx = lerp(h0[0], h1[0], easeIO(hatU)), hyw = lerp(h0[1], h1[1], easeIn(hatU, 1.6)) - 70 * Math.sin(Math.PI * Math.min(1, hatU * 1.2));
    x.save(); x.translate(hx, hyw); x.rotate(lerp(sway, -.35 - TAU, easeIO(hatU)));
    x.fillStyle = '#1e1818'; x.beginPath(); x.ellipse(0, 0, 54, 12, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(0, -10, 34, 32, 0, Math.PI, TAU); x.fill();
    x.fillStyle = '#4a2a1e'; x.fillRect(-34, -14, 68, 8); x.restore();
  }
  function extraGlass(x, tp, g) {
    const land = K.how + g.dt, gx = 960 + g.dx, gy = TOP - 4;
    if (tp < land - .32) return null;
    const drop = easeIn(clamp((tp - (land - .32)) / .32), 2);
    const tipU = g.tip ? easeIn(clamp((tp - land - .04) / .18), 1.5) : 0, y = lerp(gy - 240, gy, drop);
    if (g.tip && tipU >= 1) { const sp = easeOut(clamp((tp - land - .22) / .6)); x.fillStyle = hexA(P.amber, .75); x.beginPath(); x.ellipse(gx - g.side * (230 + 40 * sp), gy - 2, 30 + 110 * sp, 5 + 4 * sp, 0, 0, TAU); x.fill(); }
    x.save(); x.translate(gx, y);
    if (tipU > 0) { const pv = -g.side * 57; x.translate(pv, 0); x.rotate(-g.side * Math.PI / 2 * tipU); x.translate(-pv, 0); }
    if (g.bottle) { x.save(); x.scale(1.2, 1.2); PR.bottle(x, P, 210); x.restore(); } else PR.shotGlass(x, P, 0, 0, 2.6, g.tip ? .6 * (1 - tipU) : .65);
    x.restore();
    const out = easeIn(clamp((tp - land - .08) / .32));
    if (out >= 1) return null;
    const hgy = y - (g.bottle ? 170 : GO), base = [gx + g.side * 440, TOP + 560];
    const h = [lerp(gx, base[0] + (gx - base[0]) * .3, out), lerp(hgy, base[1] + (hgy - base[1]) * .3, out)];
    return { e: g, i: 3, base, h, grip: 1 - smooth((tp - land - .02) / .16), r: g.bottle ? R_BOTTLE : R_GLASS, extra: true };
  }
  const POPS = [[1025], [545], [1310], [735], [450], [1215, 1], [830], [1405], [640, 1], [1120]]
    .map(([x, bottle], k, a) => ({ x, bottle, t: SLAM[1] + .3 + .62 * Math.pow(k / (a.length - 1), .6) }));
  function popDrinks(x, tp) {
    const y0 = TOP - 20;
    x.save(); x.filter = 'brightness(.82)';
    for (const p of POPS) {
      if (tp < p.t - .2) continue;
      const fall = easeIn(clamp((tp - (p.t - .2)) / .2), 2), sq = tp > p.t ? .1 * (1 - smooth((tp - p.t) / .14)) : 0;
      x.save(); x.translate(p.x, lerp(y0 - 70, y0, fall)); x.scale(1 + sq * .6, 1 - sq);
      if (p.bottle) PR.bottle(x, P, 200); else PR.shotGlass(x, P, 0, 0, 2, .7);
      x.restore();
    }
    x.restore();
  }

  const ready = FILM.fonts('NSC');
  function yearLabel(ctx, t, a = 1) {
    let y = ERA[0].year, done = false;
    for (let i = 2; i >= 0; i--) if (t >= HO[i] - .2) { const u = easeIO(clamp((t - HO[i] + .2) / .55)); y = lerp(ERA[i].year, ERA[i + 1].year, u); done = i === 2 && u >= 1; break; }
    const v = Math.round(y / 10) * 10, s = done ? '1800s' : v < 0 ? `${-v} BC` : v === 0 ? '1 BC' : v < 1000 ? `AD ${v}` : `${v}`;
    const am = smooth((t - HO[2] - .5) / .5);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
    const cx = W / 2, cy = M45 ? 120 : 100, w = 330, h = lerp(92, 140, am);
    ctx.fillStyle = 'rgba(30,20,12,.25)'; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 5, cy - 46 + 7, w, h, 8); ctx.fill();
    ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - 46, w, h, 8); ctx.fill();
    ctx.fillStyle = '#2c2824'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 58px NSC'; ctx.fillText(s, cx, cy);
    if (am > 0) { ctx.globalAlpha = am; ctx.font = '900 36px NSC'; ctx.fillText('AMERICA', cx, cy + 52); }
    ctx.restore();
  }

  function draw(ctx, t, cam = camera(t), o = {}) {
    const tp = pose(t), g = gripAt(t, tp), sl = slosh(tp);
    L.background(ctx);
    L.sheet(ctx, cam, .4, R, x => (o.backdrop ? o.backdrop(x) : panorama(x, t)), { shadow: false, rimAlpha: .25 });
    const hands = [];
    L.sheet(ctx, cam, 1, R, x => {
      {
        counter(x);
        popDrinks(x, tp);
        for (const e of EXTRA) { const h = extraGlass(x, tp, e); if (h) hands.push(h); }
        drunk(x, tp);
      }
    }, { paperShadow: [6, 8, 6, .35] });
    const am = smooth((tp - HO[2]) / .3);
    if (am > 0) { FILM.sheet(ctx, cam, 1, W, H, R); PR.glow(ctx, g[0], g[1] - 6, 250, P.amber, am * (.14 + .24 * Math.exp(-Math.pow((tp - HO[2] - .3) / .15, 2))), 'lightbox'); }
    L.sheet(ctx, cam, 1, R, x => {
      let v = 0, sx = 1;
      for (let i = 0; i < 3; i++) { const u = clamp((tp - (HO[i] - .12)) / .24); if (u > 0) { v = u < .5 ? i : i + 1; sx = Math.abs(Math.cos(Math.PI * u)); } }
      const all = [...[0, 1, 2, 3].map(i => handOf(i, tp, g)).filter(Boolean), ...hands];
      for (const h of all) { if (!h.extra) h.r = RV[v]; h.o = handOpts(h); arm(x, h.e, h.i, h.base, FILM.hand.wrist(h.o).p); if (!h.extra) FILM.hand.back(x, h.o); }
      const shake = tp > SLAM[1] ? Math.sin((tp - SLAM[1]) * 60) * 6 * Math.max(0, 1 - (tp - SLAM[1]) / .2) : 0;
      x.save(); x.translate(g[0], g[1] + GO + shake); x.scale(Math.max(sx, .04) * HS, HS); vessel(x, v, sl, tp); x.restore();
      wineDrops(x, tp, g);
      for (const h of all) FILM.hand.front(x, h.o);
      const sp = clamp((tp - SLAM[1]) / .35);
      if (sp > 0 && sp < 1) { x.fillStyle = hexA(P.amber, .85 * (1 - sp)); const r = rng(33); for (let k = 0; k < 9; k++) { const a = -Math.PI * (.15 + .7 * r()), d = 50 + 190 * sp * (.6 + .6 * r()); x.beginPath(); x.arc(g[0] + Math.cos(a) * d, g[1] - 110 + Math.sin(a) * d + 260 * sp * sp, 9 * (1 - sp * .5), 0, TAU); x.fill(); } }
    }, { paperShadow: [8, 10, 8, .4] });
    FILM.sheet(ctx, cam, 1, W, H, R);
    const lit = smooth((t - TILT[0]) / 1.2);
    if (lit > 0) PR.glow(ctx, 1420, TOP - 480, 880, '#ffb05a', .22 * lit, 'paper');
    if (o.label !== 0) yearLabel(ctx, t, o.label ?? 1);
    if (!o.noGrade) L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready, grain: 'none', label: C.label,
    api: { DUR, camera, draw, backdrop, BD, HZ, TOP, DX, drift },
    shots: [{ id: 'S016', start: 0, end: DUR }], marks: [...HO, K.how, K.drinking],
  });
})();
