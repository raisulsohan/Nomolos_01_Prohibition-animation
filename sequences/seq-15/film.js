(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-15', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S14b = FILM.getScene('seq-14b').api, S14c = FILM.getScene('seq-14c').api, TUN = S14b.TUN, ROOM = S14b.ROOM;
  const L = FILM.look('lightbox', W, H), B = L.P, PP = FILM.PAL.paper, pose = L.pose;
  const K = { demand: 0.2, enormous: 0.901, never: 2.069, went: 2.336, anywhere: 2.569, industry: 4.705, sprang: 5.205,
    overnight: 5.773, licenses: 8.709, inspectors: 9.91, rules: 11.145, settle: 12.846,
    argument: 13.247, except: 13.681, gun: 14.348 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const LATE = 30;
  const line = (x, pts, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'butt'; x.lineJoin = 'miter'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); };

  const MAIN = [[800, 1300], [3900, 1300]];
  const swell = t => smooth((t - K.enormous + .2) / .8);
  const EXTRA = (() => {
    const g = rng(57), out = [], add = (x0, x1, y, n, s, skip = []) => { for (let i = 0; i < n; i++) { const x = lerp(x0, x1, (i + .5) / n) + (g() - .5) * 40; if (skip.some(([a, b]) => x > a && x < b)) continue; out.push({ x, y: y + (g() - .5) * 10, s: s * (.92 + g() * .16), woman: g() < .45, hat: ['bowler', 'cap', 'wide', 'none'][(g() * 4) | 0], flip: g() < .5, t: .25 + g() * 1.1 }); } };
    add(700, 1600, 700, 6, 1.3); add(740, 1580, 770, 5, 1.45); add(3280, 3760, 700, 4, 1.3); add(3300, 3740, 770, 3, 1.45);
    add(1650, 3350, 890, 11, 1.65, [[2110, 2310], [2640, 2860]]);
    return out.sort((a, b) => a.y - b.y);
  })();
  function moreCrowd(x, tp) {
    for (const p of EXTRA) {
      const u = back((tp - p.t) / .3); if (u <= 0) continue;
      x.save(); x.translate(p.x, p.y); x.scale(p.s * (p.flip ? -1 : 1), p.s * u);
      PR.person(x, B, { kind: p.woman ? 'woman' : 'man', coat: p.woman ? '#161338' : '#12112e', skirt: '#0e0c26', trouser: '#0e0c26', hat: p.woman ? 'none' : p.hat, hatColor: '#0b0a1c', skin: '#1c1838' });
      x.restore();
      x.fillStyle = FILM.rgba(FILM.hex(B.amber), smooth((tp - p.t - .1) / .3)); x.beginPath(); x.arc(p.x, p.y - 60 * p.s, 5.5 * p.s, 0, TAU); x.fill();
    }
  }
  const moreChests = tp => EXTRA.filter(p => tp > p.t).map(p => ({ c: [p.x, p.y - 60 * p.s], a: smooth((tp - p.t - .1) / .3), s: p.s }));
  const flare = t => 1 + .9 * Math.exp(-Math.pow((t - K.enormous - .15) / .22, 2));
  const CAL = { x: 1230, y: 505, w: 200, h: 250 }, FLIPS = [K.never, K.went, K.anywhere, K.anywhere + .3, K.anywhere + .52];
  function calPage(x, year) {
    x.fillStyle = '#e8dcc0'; x.fillRect(-CAL.w / 2, -CAL.h / 2, CAL.w, CAL.h); x.fillStyle = PP.red; x.fillRect(-CAL.w / 2, -CAL.h / 2, CAL.w, 34);
    x.fillStyle = '#2c2824'; x.font = '900 86px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(year), 0, -10);
    x.strokeStyle = 'rgba(44,40,36,.35)'; x.lineWidth = 2; for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) x.strokeRect(-78 + c * 40, 50 + r * 30, 34, 24);
  }
  function calendar(x, tp) {
    const n = FLIPS.filter(f => tp >= f).length;
    x.save(); x.translate(CAL.x, CAL.y);
    x.fillStyle = '#5a4a3a'; x.fillRect(-CAL.w / 2 - 3, -CAL.h / 2 + 5, CAL.w + 6, CAL.h + 4); calPage(x, 1920 + n);
    x.fillStyle = '#2a2420'; x.fillRect(-CAL.w / 2 - 5, -CAL.h / 2 - 10, CAL.w + 10, 16);
    FLIPS.forEach((f, i) => { const u = (tp - f) / .45; if (u <= 0 || u >= 1) return; const e = easeOut(u, 2);
      x.save(); x.translate(-120 * e, -260 * e); x.rotate(-1.2 * e); x.scale(1 + .2 * e, 1 - .4 * e); x.globalAlpha = 1 - easeIn(u, 3); calPage(x, 1920 + i); x.restore(); });
    x.restore();
  }
  function river(x, t) {
    const w = lerp(42, 64, swell(t));
    line(x, MAIN, w, B.amber);
    x.setLineDash([22, 30]); x.lineDashOffset = -t * 300; line(x, MAIN, w * .3, '#ffe0a0'); x.setLineDash([]); x.lineDashOffset = 0;
  }

  const ROOMS = [
    { name: 'still', x0: 1560, x1: 1900, y0: 1380, y1: 1540, t: K.sprang - .05 },
    { name: 'bottles', x0: 2560, x1: 2940, y0: 1380, y1: 1540, t: K.sprang + .2 },
    { name: 'barrels', x0: 1560, x1: 1960, y0: 1640, y1: 1800, t: K.overnight - .05 },
    { name: 'truck', x0: 2250, x1: 2900, y0: 1640, y1: 1800, t: K.overnight + .2 },
  ];
  function still(x) {
    x.fillStyle = '#ff9a3a'; polyPath(x, [[-50, 0], [-30, -26], [-14, -8], [0, -34], [14, -8], [30, -26], [50, 0]]); x.fill();
    x.fillStyle = '#a0643a'; x.beginPath(); x.ellipse(0, -70, 58, 44, 0, 0, TAU); x.fill(); x.fillRect(-10, -150, 20, 44); x.beginPath(); x.arc(0, -150, 18, Math.PI, TAU); x.fill();
    x.strokeStyle = '#a0643a'; x.lineWidth = 7; x.beginPath(); x.moveTo(12, -150); x.lineTo(90, -120); for (let k = 0; k < 4; k++) x.lineTo(k % 2 ? 76 : 104, -100 + k * 16); x.lineTo(96, -36); x.stroke();
    x.fillStyle = '#6a4a3a'; x.beginPath(); x.roundRect(80, -40, 36, 40, 6); x.fill(); x.fillStyle = B.amber; x.fillRect(86, -28, 24, 24);
  }
  function bottles(x) {
    x.fillStyle = '#3a2a30'; x.fillRect(-150, -46, 300, 12); x.fillRect(-140, -34, 12, 34); x.fillRect(128, -34, 12, 34);
    for (let k = 0; k < 8; k++) { x.save(); x.translate(-126 + k * 36, -46); PR.bottle(x, B, 62); x.restore(); }
  }
  function barrels(x) {
    for (const [bx, by] of [[-120, 0], [-40, 0], [40, 0], [120, 0], [-80, -72], [0, -72], [80, -72]]) {
      x.fillStyle = '#6a4630'; x.beginPath(); x.ellipse(bx, by - 36, 38, 36, 0, 0, TAU); x.fill();
      x.strokeStyle = '#2a2030'; x.lineWidth = 5; x.beginPath(); x.ellipse(bx, by - 36, 38, 36, 0, 0, TAU); x.stroke(); x.beginPath(); x.ellipse(bx, by - 36, 20, 19, 0, 0, TAU); x.stroke();
    }
  }
  function truck(x) {
    x.fillStyle = '#26264e'; x.fillRect(-260, -110, 330, 80); x.fillRect(70, -140, 120, 110); x.fillRect(190, -86, 60, 56);
    x.fillStyle = '#ffd690'; x.fillRect(90, -126, 60, 40);
    for (const [cx, cy] of [[-230, -150], [-150, -150], [-70, -150], [-190, -190], [-110, -190]]) { x.fillStyle = '#7a5530'; x.fillRect(cx, cy, 70, 40); x.fillStyle = '#5a3c22'; x.fillRect(cx, cy + 18, 70, 4); }
    x.fillStyle = '#0c0b1a'; for (const wx of [-190, 170]) { x.beginPath(); x.arc(wx, -28, 30, 0, TAU); x.fill(); }
    x.fillStyle = '#ffcf80'; x.beginPath(); x.arc(252, -64, 9, 0, TAU); x.fill();
  }
  const DRAW = { still, bottles, barrels, truck };
  function industry(x, tp) {
    for (const r of ROOMS) {
      const open = smooth((tp - r.t + .25) / .25); if (open <= 0) continue;
      const cx = (r.x0 + r.x1) / 2;
      x.save(); x.globalAlpha = open;
      x.fillStyle = '#2e2a6e'; x.fillRect(r.x0 - 8, r.y0 - 8, r.x1 - r.x0 + 16, r.y1 - r.y0 + 16);
      x.fillStyle = '#0c0a24'; x.fillRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
      line(x, [[cx + 60, r.y0], [cx + 60, 1300]], 26, '#2e2a6e'); line(x, [[cx + 60, r.y0], [cx + 60, 1300]], 14, '#0c0a24');
      const f = smooth((tp - r.t - .2) / .5); if (f > 0) line(x, [[cx + 60, r.y0], [cx + 60, lerp(r.y0, 1300, f)]], 8, B.amber);
      x.restore();
      const u = back((tp - r.t) / .35); if (u <= 0) continue;
      x.save(); x.beginPath(); x.rect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); x.clip(); x.translate(cx - 30, r.y1); x.scale(.82, .82 * u); DRAW[r.name](x); x.restore();
    }
  }

  const CARDS = [['LICENSE', 1650, K.licenses], ['INSPECTOR', 2250, K.inspectors], ['RULES', 2850, K.rules]];
  function cards(x, tp) {
    const off = 1 - smooth((tp - K.settle + .4) / .4);
    for (const [word, cx, t0] of CARDS) {
      const u = back((tp - t0 + .08) / .3); if (u <= 0 || off <= 0) continue;
      x.save(); x.translate(cx, 930); x.rotate(word === 'INSPECTOR' ? .02 : -.03); x.scale(u, u); x.globalAlpha = off;
      PR.card(x, PP, word, word === 'INSPECTOR' ? 500 : 420, 130, '900 72px NSC', clamp((tp - t0 - .3) / .25));
      x.restore();
    }
  }

  const TABLE = [ROOM.x, ROOM.y + ROOM.h / 2];
  function backRoom(x, tp) {
    const a = smooth((tp - K.settle + .8) / .5); if (a <= 0) return;
    x.save(); x.globalAlpha = a;
    x.fillStyle = '#2a1e2e'; x.fillRect(ROOM.x - ROOM.w / 2, ROOM.y - ROOM.h / 2, ROOM.w, ROOM.h);
    x.strokeStyle = '#141024'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(ROOM.x, ROOM.y - ROOM.h / 2); x.lineTo(ROOM.x, ROOM.y - 30); x.stroke();
    x.fillStyle = '#ffe6b0'; x.beginPath(); x.arc(ROOM.x, ROOM.y - 27, 4, 0, TAU); x.fill();
    const lean = smooth((tp - K.argument + .15) / .25) * (1 - .5 * smooth((tp - K.gun) / .3));
    for (const d of [-1, 1]) { x.save(); x.translate(TABLE[0] + d * 62, TABLE[1]); x.rotate(-d * .14 * lean); x.scale(-d * .72, .72); PR.person(x, B, { kind: 'man', hat: 'wide', hatColor: '#06060f', dark: 1, arm: d < 0 ? .7 * lean : 0 }); x.restore(); }
    x.fillStyle = '#3a2830'; x.fillRect(TABLE[0] - 34, TABLE[1] - 30, 68, 5); x.fillRect(TABLE[0] - 30, TABLE[1] - 25, 4, 25); x.fillRect(TABLE[0] + 26, TABLE[1] - 25, 4, 25);
    const gavel = smooth((tp - K.settle) / .4) * (1 - smooth((tp - K.gun + .05) / .15));
    if (gavel > 0) {
      x.save(); x.translate(TABLE[0], TABLE[1] - 30); x.scale(1.6, 1.6); x.globalAlpha = a * gavel * .8; x.strokeStyle = '#d8c89a'; x.lineWidth = 1.2; x.lineCap = 'butt'; x.lineJoin = 'miter'; x.setLineDash([2.5, 2]); x.lineDashOffset = 0;
      x.strokeRect(-12, -4, 24, 4); x.save(); x.translate(4, -12); x.rotate(-.35); x.strokeRect(-11, -5, 22, 10); x.strokeRect(-2, 5, 4, 16); x.restore(); x.restore();
    }
    const g = clamp((tp - K.gun + .12) / .12);
    if (g > 0) {
      x.save(); x.translate(TABLE[0] + 2, TABLE[1] - 30 - 18 * (1 - easeIn(g, 2))); x.rotate(-.04); x.scale(1.6, 1.6);
      x.fillStyle = '#0a0a18'; x.fillRect(-14, -9, 24, 4); x.fillRect(-2, -10, 10, 8); polyPath(x, [[4, -3], [10, -3], [14, 5], [8, 6]]); x.fill();
      x.strokeStyle = '#8a8fb8'; x.lineWidth = .8; x.lineCap = 'butt'; x.beginPath(); x.moveTo(-14, -9); x.lineTo(8, -9); x.stroke();
      x.restore();
    }
    x.restore();
  }

  const Z = M45 ? { wide: .52, under: .8, cards: .56, room: 5.4 } : { wide: .62, under: 1, cards: .72, room: 5.2 };
  const KEYS = [[0, [M45 ? 1950 : 2250, 800, Math.log(Z.wide * 1.1)]], [K.industry, [M45 ? 1980 : 2260, 830, Math.log(Z.wide * 1.13)]],
    [K.licenses - .05, [2250, 1330, Math.log(Z.cards)]], [K.settle - .5, [2255, 1320, Math.log(Z.cards * 1.03)]],
    [K.argument + .25, [ROOM.x, ROOM.y + (M45 ? -35 : 22), Math.log(Z.room)]], [DUR, [ROOM.x + 3, ROOM.y + (M45 ? -33 : 24), Math.log(Z.room * 1.03)]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t), tl = S14c.DUR + LATE + t;
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => {
      S14b.scene(x, S14b.DUR + LATE + t, 'lightbox');
      S14c.imprint(x, tl); calendar(x, tp); S14c.crowd(x, tl); moreCrowd(x, tp);
      river(x, t); industry(x, tp); backRoom(x, tp);
    }, { glow: .35, glowBlur: 12 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    for (const ch of [...S14c.chests(tl), ...moreChests(tp)]) PR.glow(ctx, ch.c[0], ch.c[1], 60 * ch.s * (1 + .3 * (flare(t) - 1)), B.amber, .5 * (ch.a ?? 1) * (1 + .25 * swell(t)) * flare(t), 'lightbox');
    for (let k = 0; k < 8; k++) PR.glow(ctx, 900 + k * 420, 1300, 300, B.amber, .2 + .12 * swell(t), 'lightbox');
    for (const r of ROOMS) { const u = smooth((tp - r.t) / .4); if (u > 0) PR.glow(ctx, (r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2, 200, B.amber, .25 * u, 'lightbox'); }
    const rm = smooth((tp - K.settle + .8) / .5); if (rm > 0) PR.glow(ctx, ROOM.x, ROOM.y - 27, 70, '#ffe0a8', .5 * rm, 'lightbox');
    L.sheet(ctx, cam, 1, R, x => cards(x, tp), { glow: .15, glowBlur: 8, rimColor: '#fff0cc' });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.enormous, K.sprang, K.overnight, K.licenses, K.inspectors, K.rules, K.argument, K.gun],
    api: { DUR, industry, river, ROOMS, LATE, moreCrowd, moreChests, calendar },
  });
})();
