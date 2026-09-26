(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIn, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-41', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { india: 1.602, invented: 4.671, city: 5.639, overrun: 6.073, cobras: 7.307,
    government: 8.876, offered: 9.309, reward: 9.71, dead: 10.644, simple: 12.713,
    pay: 13.881, solve: 14.681, you: 15.649, what: 16.283, turned: 17.517, inside: 18.552,
    handed: 19.887, trap: 22.356, that: 23.29, next: 23.69 };
  const INK = '#2c2420', back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const GY = 820;

  function city(x, tp) {
    const g = x.createLinearGradient(0, -600, 0, GY); g.addColorStop(0, '#b8583a'); g.addColorStop(.6, '#e8964c'); g.addColorStop(1, '#f6c47a'); x.fillStyle = g; x.fillRect(-800, -1200, 4800, GY + 1200);
    x.fillStyle = '#f9dc9a'; x.beginPath(); x.arc(2300, 180, 70, 0, TAU); x.fill();
    x.fillStyle = '#a4553a';
    for (const [dx, r, h] of [[-300, 110, 260], [240, 140, 300], [760, 90, 220], [2050, 120, 280], [2700, 100, 240], [3200, 130, 260]]) { x.fillRect(dx - r, GY - 180 - h, 2 * r, h); x.beginPath(); x.ellipse(dx, GY - 180 - h, r, r * .9, 0, Math.PI, TAU); x.fill(); x.fillRect(dx - 4, GY - 180 - h - r - 50, 8, 50); }
    x.fillStyle = '#8f4530'; x.fillRect(1080, GY - 760, 150, 600); polyPath(x, [[1060, GY - 760], [1155, GY - 880], [1250, GY - 760]]); x.fill();
    x.fillStyle = '#f4e4c0'; x.beginPath(); x.arc(1155, GY - 680, 46, 0, TAU); x.fill(); x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.moveTo(1155, GY - 680); x.lineTo(1155, GY - 712); x.moveTo(1155, GY - 680); x.lineTo(1178, GY - 668); x.stroke();
    x.fillStyle = '#d99a62'; x.fillRect(-800, GY - 200, 4800, 200);
    x.fillStyle = 'rgba(90,40,24,.18)'; for (let k = 0; k < 60; k++) x.fillRect(-800 + k * 80, GY - 200, 4, 200);
    x.fillStyle = '#c9a070'; x.fillRect(-800, GY, 4800, 900);
    for (let k = 0; k < 4; k++) { x.fillStyle = k % 2 ? '#b98f60' : '#c49a68'; x.fillRect(1120 - k * 30, GY - 20 * (4 - k), 280 + k * 60, 20); }
    x.fillStyle = '#3a2a20'; x.fillRect(820, GY + 30, 120, 22); x.fillStyle = '#6a5040'; for (let k = 0; k < 5; k++) x.fillRect(826 + k * 24, GY + 30, 6, 22);
  }
  const COBRAS = [{ x: 420, y: GY + 10, basket: true }, { x: 880, y: GY + 40 }, { x: 1250, y: GY - 60 }, { x: 640, y: GY + 60, basket: true }, { x: 1420, y: GY - 40 }].map((c, i) => ({ ...c, t: K.city - .1 + i * .32, s: 1 + .15 * (i % 2) }));
  function basket(x, bx, by, s, lid = 0) {
    x.save(); x.translate(bx, by); x.scale(s, s); x.fillStyle = '#a8844a'; x.beginPath(); x.moveTo(-50, 0); x.quadraticCurveTo(-58, -60, -40, -76); x.lineTo(40, -76); x.quadraticCurveTo(58, -60, 50, 0); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(80,50,20,.45)'; x.lineWidth = 3; for (let k = 1; k < 5; k++) { x.beginPath(); x.moveTo(-52, -k * 15); x.lineTo(52, -k * 15); x.stroke(); }
    if (lid >= 0) { x.save(); x.translate(-44, -76); x.rotate(-lid); x.fillStyle = '#8a6a38'; x.beginPath(); x.ellipse(44, -4, 48, 12, 0, 0, TAU); x.fill(); x.fillRect(38, -20, 12, 14); x.restore(); }
    x.restore();
  }
  function cobra(x, c, tp) {
    const u = easeOut(clamp((tp - c.t) / .7)), hood = smooth((tp - c.t - .4) / .4); if (u <= 0) return;
    const sw = Math.sin(tp * 2.4 + c.x) * 10 * u, hgt = 170 * c.s * u, pts = [];
    for (let k = 0; k <= 12; k++) { const s = k / 12; pts.push([c.x + Math.sin(s * 5 + tp * 1.5) * 16 * (1 - s) + sw * s, c.y - hgt * s]); }
    x.strokeStyle = '#3a3226'; x.lineCap = 'round'; x.lineJoin = 'round'; for (let k = 1; k < pts.length; k++) { x.lineWidth = (26 - 8 * k / 12) * c.s; x.beginPath(); x.moveTo(pts[k - 1][0], pts[k - 1][1]); x.lineTo(pts[k][0], pts[k][1]); x.stroke(); }
    const hd = pts[pts.length - 1]; x.fillStyle = '#3a3226'; x.beginPath(); x.ellipse(hd[0], hd[1] + 10 * c.s, (16 + 26 * hood) * c.s, 38 * c.s, 0, 0, TAU); x.fill();
    if (hood > 0) { x.strokeStyle = `rgba(232,208,160,${.7 * hood})`; x.lineWidth = 3; x.beginPath(); x.arc(hd[0] - 8 * c.s, hd[1] + 14 * c.s, 7 * c.s, 0, TAU); x.arc(hd[0] + 8 * c.s, hd[1] + 14 * c.s, 7 * c.s, 0, TAU); x.stroke(); }
    x.fillStyle = '#3a3226'; x.beginPath(); x.ellipse(hd[0], hd[1] - 22 * c.s, 13 * c.s, 10 * c.s, 0, 0, TAU); x.fill(); x.fillStyle = '#f0c040'; x.beginPath(); x.arc(hd[0] - 5 * c.s, hd[1] - 24 * c.s, 2.4 * c.s, 0, TAU); x.arc(hd[0] + 5 * c.s, hd[1] - 24 * c.s, 2.4 * c.s, 0, TAU); x.fill();
  }
  const DESK = [1780, GY], NOTE = [1980, GY - 330];
  function arcade(x) {
    x.fillStyle = '#e8d2a8'; x.fillRect(1580, GY - 520, 700, 520); x.fillStyle = '#c9a070';
    for (const ax of [1650, 1850, 2050]) { x.beginPath(); x.moveTo(ax - 70, GY); x.lineTo(ax - 70, GY - 300); x.arc(ax, GY - 300, 70, Math.PI, TAU); x.lineTo(ax + 70, GY); x.closePath(); x.fill(); }
    x.fillStyle = '#b88a5a'; x.fillRect(1560, GY - 540, 740, 30);
  }
  function official(x, tp) {
    x.fillStyle = '#6a4a30'; x.fillRect(DESK[0] - 130, DESK[1] - 110, 260, 20); x.fillRect(DESK[0] - 120, DESK[1] - 90, 14, 90); x.fillRect(DESK[0] + 106, DESK[1] - 90, 14, 90);
    x.fillStyle = '#e8e0cc'; x.fillRect(DESK[0] - 60, DESK[1] - 116, 70, 6);
    x.save(); x.translate(DESK[0] + 40, DESK[1]); x.scale(-2.2, 2.2); PR.person(x, P, { kind: 'man', hat: 'none', coat: '#f0ead8', trouser: '#e0d8c4', arm: .2 * Math.sin(tp * 2) ** 2 });
    x.fillStyle = '#f4f0e2'; x.beginPath(); x.ellipse(0, -92, 12, 3, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(0, -93, 8, 8, 0, Math.PI, TAU); x.fill(); x.restore();
  }
  function notice(x, t) {
    const u = back((t - K.offered + .05) / .35); if (u <= 0) return;
    x.save(); x.translate(NOTE[0], NOTE[1]); x.scale(u, u); x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(-106, -126, 220, 260); x.fillStyle = '#f4ecd8'; x.fillRect(-110, -130, 220, 260);
    x.fillStyle = INK; x.font = '900 40px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('REWARD', 0, -92);
    x.strokeStyle = '#3a3226'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(-70, 20); x.quadraticCurveTo(-50, -10, -40, 20); x.quadraticCurveTo(-30, 50, -20, 10); x.stroke();
    x.font = '900 44px NSC'; x.fillText('=', 12, 16); x.fillStyle = '#c8a040'; x.beginPath(); x.arc(66, 16, 26, 0, TAU); x.fill(); x.strokeStyle = '#8a6a28'; x.lineWidth = 3; x.beginPath(); x.arc(66, 16, 18, 0, TAU); x.stroke();
    x.fillStyle = INK; x.font = '700 18px NSC'; x.fillText('FOR EVERY DEAD COBRA', 0, 96); x.restore();
  }
  function coin(x, cx, cy, s = 1) { x.fillStyle = '#c8a040'; x.beginPath(); x.ellipse(cx, cy, 14 * s, 14 * s, 0, 0, TAU); x.fill(); x.strokeStyle = '#8a6a28'; x.lineWidth = 2; x.beginPath(); x.ellipse(cx, cy, 9 * s, 9 * s, 0, 0, TAU); x.stroke(); }
  function simpleCoin(x, t) {
    const u = clamp((t - K.simple + .3) / .45); if (u <= 0) return; const y = u < 1 ? lerp(DESK[1] - 420, DESK[1] - 124, u * u) : DESK[1] - 124 - 8 * Math.abs(Math.sin((t - K.simple - .15) * 18)) * Math.exp(-(t - K.simple - .15) * 5);
    coin(x, DESK[0] - 80, y, 1.2);
  }
  const LINE = [0, 1, 2].map(k => ({ k, x: DESK[0] - 240 - k * 110, t: K.pay - .3 + k * .15, pay: K.solve - .4 + k * .55, coat: ['#6a4a5a', '#4a5a6a', '#7a5a3a'][k] }));
  const HOME = [2900, GY];
  function walker(p, t) {
    const go = clamp((t - K.turned + .9) / 2.2); return { go, x: lerp(p.x, HOME[0] - 130, easeIO(go)) };
  }
  function townspeople(x, t, tp) {
    for (const p of LINE) {
      const u = easeOut(clamp((tp - p.t) / .6)); if (u <= 0) continue; const wk = p.k === 0 ? walker(p, tp) : { go: 0, x: p.x };
      if (p.k === 0 && wk.go > 0) { const bob = wk.go < 1 ? Math.abs(Math.sin(tp * 10)) * 3 : 0; x.save(); x.translate(wk.x, GY + 20 - bob); x.scale(2.2, 2.2); PR.person(x, P, { kind: 'man', hat: 'cap', coat: p.coat, trouser: '#4a3a30', hatColor: '#e8dcc0' }); x.restore(); continue; }
      x.save(); x.translate(lerp(p.x - 300, p.x, u), GY + 20); x.scale(2.2, 2.2); PR.person(x, P, { kind: 'man', hat: 'cap', coat: p.coat, trouser: '#4a3a30', hatColor: '#e8dcc0', arm: .35 }); x.restore();
      basket(x, lerp(p.x - 300, p.x, u) + 36, GY - 60, .55, 0);
      const c = clamp((tp - p.pay) / .5); if (c > 0 && c < 1) coin(x, lerp(DESK[0] - 20, p.x + 20, c), GY - 190 - 120 * Math.sin(c * Math.PI), .9);
    }
  }
  const YB = [HOME[0] + 60, GY + 40];
  const lid = t => .32 * smooth((t - K.inside + .1) / .8) * (1 - easeIn(clamp((t - K.that + .1) / .2), 2));
  function yard(x, t, tp) {
    x.fillStyle = '#b8764a'; x.fillRect(HOME[0] - 380, GY - 360, 900, 360); x.fillStyle = 'rgba(80,40,20,.2)'; for (let k = 0; k < 12; k++) x.fillRect(HOME[0] - 380, GY - 360 + k * 30, 900, 3);
    x.fillStyle = '#5a3a24'; x.fillRect(HOME[0] + 200, GY - 240, 120, 240);
    const l = lid(t); basket(x, YB[0], YB[1], 1.8, l);
    if (l > .02) {
      x.save(); x.translate(YB[0], YB[1]); x.scale(1.8, 1.8); x.fillStyle = '#120c08'; x.beginPath(); x.moveTo(-44, -76); x.lineTo(44 * Math.cos(l) - 44, -76 - 88 * Math.sin(l)); x.lineTo(44, -76); x.closePath(); x.fill();
      const g = rng(41); for (let k = 0; k < 14; k++) { const ex = -30 + g() * 64, ey = -78 - g() * 22 * (l / .32), on = smooth((t - K.inside - .2 - g() * 1.2) / .2) * (.6 + .4 * Math.sin(tp * 3 + k)); if (on <= 0 || ex > 44 * Math.cos(l) - 44 + 70 * (l / .32)) continue;
        x.fillStyle = `rgba(240,200,64,${on})`; x.beginPath(); x.arc(ex, ey, 1.3, 0, TAU); x.arc(ex + 3.4, ey, 1.3, 0, TAU); x.fill(); }
      x.restore();
    }
  }
  function frame(ctx, t) {
    const f = easeIO(clamp((t - K.inside + .3) / 3.2));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const b = M45 ? 40 : 46; ctx.fillStyle = '#efe0bc'; ctx.fillRect(0, 0, W, b); ctx.fillRect(0, H - b, W, b); ctx.fillRect(0, 0, b, H); ctx.fillRect(W - b, 0, b, H);
    ctx.strokeStyle = '#8a4a2a'; ctx.lineWidth = 4; ctx.strokeRect(b - 10, b - 10, W - 2 * b + 20, H - 2 * b + 20); ctx.lineWidth = 2; ctx.strokeRect(b - 20, b - 20, W - 2 * b + 40, H - 2 * b + 40);
    for (const [cx, cy, sx, sy] of [[b, b, 1, 1], [W - b, b, -1, 1], [b, H - b, 1, -1], [W - b, H - b, -1, -1]]) {
      ctx.fillStyle = '#8a4a2a'; ctx.beginPath(); ctx.arc(cx - sx * 16, cy - sy * 16, 12, 0, TAU); ctx.fill();
      if (f > 0) { const d = (M45 ? 280 : 240) * f; ctx.fillStyle = 'rgba(0,0,0,.2)'; polyPath(ctx, [[cx - sx * b, cy - sy * b], [cx - sx * b + sx * (d + 18), cy - sy * b], [cx - sx * b, cy - sy * b + sy * (d + 18)]]); ctx.fill();
        ctx.fillStyle = '#c89a68'; polyPath(ctx, [[cx - sx * b + sx * d, cy - sy * b], [cx - sx * b, cy - sy * b + sy * d], [cx - sx * b + sx * d * .7, cy - sy * b + sy * d * .7]]); ctx.fill();
        ctx.fillStyle = '#efe0bc'; polyPath(ctx, [[cx - sx * b, cy - sy * b], [cx - sx * b + sx * d, cy - sy * b], [cx - sx * b, cy - sy * b + sy * d]]); ctx.fill(); }
    }
    ctx.restore();
  }
  function words(ctx, t) {
    const plate = (text, t0, t1, y, size) => { const a = smooth((t - t0) / .3) * (1 - smooth((t - t1) / .4)); if (a <= 0) return;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.font = `900 ${size}px NSC`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(text).width + 70;
      ctx.fillStyle = '#efe0bc'; ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, y - size * .75, w, size * 1.5, 10); ctx.fill(); ctx.strokeStyle = '#8a4a2a'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = INK; ctx.fillText(text, W / 2, y + 2); ctx.restore(); };
    plate('Colonial India', K.india - .05, K.city - .3, M45 ? H - 150 : H - 120, M45 ? 56 : 60);
    plate('Simple.', K.simple - .05, K.pay + .4, M45 ? 170 : 130, M45 ? 64 : 70);
    const f = smooth((t - K.that - .05) / .5); if (f > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(10,6,4,${.92 * f})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    const n = smooth((t - K.next + .05) / .3); if (n > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = n; ctx.font = `900 ${M45 ? 110 : 120}px NSC`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#f6c47a'; ctx.fillText('Next', W / 2, H / 2); ctx.restore(); }
  }

  const KEYS = [[0, [1250, 420, .72]], [K.invented, [1150, 470, .78]], [K.overrun, [900, 640, 1.15]], [K.cobras + .5, [900, 640, 1.18]], [K.offered - .2, [1800, 560, 1.2]],
    [K.dead + .3, [1830, 560, 1.22]], [K.simple + .1, [1720, 660, 2.0]], [K.pay + .3, [1640, 600, 1.1]], [K.you + .2, [1600, 600, 1.1]], [K.turned + 1.3, [2600, 620, 1.1]],
    [K.inside + .5, [YB[0], YB[1] - 160, 2.0]], [DUR, [YB[0], YB[1] - 150, 2.15]]].map(([t, v]) => [t, [v[0], v[1] + (M45 ? 30 : 0), Math.log(v[2] * (M45 ? .7 : 1))]]);
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => {
      x.lineCap = 'butt'; x.lineJoin = 'miter'; x.setLineDash([]); x.lineDashOffset = 0;
      city(x, tp); arcade(x); yard(x, t, tp);
      for (const c of COBRAS) { if (c.basket) basket(x, c.x, c.y + 4, 1, -1); cobra(x, c, tp); if (c.basket) { x.save(); x.translate(c.x, c.y + 4); x.fillStyle = '#a8844a'; x.fillRect(-52, -30, 104, 30); x.restore(); } }
      official(x, tp); notice(x, t); simpleCoin(x, t); townspeople(x, t, tp);
    }, { paperShadow: [6, 8, 6, .3] });
    frame(ctx, t); words(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.india, K.city, K.offered, K.simple, K.pay, K.turned, K.inside, K.that],
  });
})();
