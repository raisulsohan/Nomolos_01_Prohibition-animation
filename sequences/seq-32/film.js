(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath } = FILM;
  const ID = 'seq-32', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('flat', W, H), P = L.P, pose = L.pose;
  const K = { yes: 1.101, fell: 4.738, sharply: 5.072, climbed: 6.139, up: 6.974,
    end: 8.108, decade: 8.475, before: 11.745, dangerous: 13.947, murderers: 16.016,
    tax: 18.852, single: 20.754, could: 23.557, hold: 24.258 };
  const INK = P.ink, AMB = P.amber, back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const G = M45 ? { card: [380, -140, 1160, 1320], x0: 480, x1: 1460, y1: 1000, dy: 760 } : { card: [200, 110, 1520, 850], x0: 360, x1: 1620, y1: 820, dy: 470 };
  const X = yr => G.x0 + (yr - 1915) * (G.x1 - G.x0) / 16, Y = v => G.y1 - G.dy * v;
  const DATA = [[1915, 1], [1916, 1], [1917, .97], [1918, .93], [1919, .86], [1920, .52], [1921, .3], [1922, .31], [1923, .38], [1924, .45], [1925, .52], [1926, .58], [1927, .62], [1928, .66], [1929, .7], [1930, .71]];
  const level = yr => { for (let i = 1; i < DATA.length; i++) if (yr <= DATA[i][0]) return lerp(DATA[i - 1][1], DATA[i][1], (yr - DATA[i - 1][0]) / (DATA[i][0] - DATA[i - 1][0])); return DATA[DATA.length - 1][1]; };
  const PEN = [[0, 1915], [1.0, 1919], [K.fell - .8, 1919], [K.sharply + .15, 1921], [K.climbed - .15, 1921], [K.up + .35, 1925], [K.end - .15, 1925], [K.decade + .5, 1930]];
  const pen = t => keyed(t, PEN.map(([a, b]) => [a, [b]]), false, easeIO)[0];
  function chart(x) {
    const [cx, cy, cw, chh] = G.card;
    x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(cx + 10, cy + 14, cw, chh); x.fillStyle = P.sheet; x.fillRect(cx, cy, cw, chh);
    x.fillStyle = INK; x.font = '900 34px NSC'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('HOW MUCH AMERICA DRANK', cx + 40, cy + 50);
    x.fillRect(G.x0, G.y1, G.x1 - G.x0 + 20, 4); x.fillRect(G.x0 - 4, Y(1.15), 4, G.y1 - Y(1.15) + 4);
    x.font = '900 28px NSC'; x.textAlign = 'center'; x.textBaseline = 'top';
    for (const yr of [1915, 1920, 1925, 1930]) { x.fillRect(X(yr) - 2, G.y1, 4, 14); x.fillText(String(yr), X(yr), G.y1 + 22); }
    x.save(); x.setLineDash([12, 10]); x.lineDashOffset = 0; x.strokeStyle = 'rgba(27,33,48,.55)'; x.lineWidth = 3; x.lineCap = 'butt'; x.beginPath(); x.moveTo(X(1920), G.y1); x.lineTo(X(1920), Y(1.12)); x.stroke(); x.restore();
    x.fillStyle = INK; x.font = '900 24px NSC'; x.textBaseline = 'bottom'; x.fillText('PROHIBITION', X(1920), Y(1.12) - 6);
  }
  function line(x, t) {
    const p = pen(t), pts = DATA.filter(d => d[0] < p).map(d => [X(d[0]), Y(d[1])]); pts.push([X(p), Y(level(p))]);
    x.fillStyle = FILM.rgba(FILM.hex(AMB), .16); x.beginPath(); x.moveTo(pts[0][0], G.y1); for (const q of pts) x.lineTo(q[0], q[1]); x.lineTo(pts[pts.length - 1][0], G.y1); x.fill();
    x.strokeStyle = AMB; x.lineWidth = 10; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const q of pts.slice(1)) x.lineTo(q[0], q[1]); x.stroke();
    const tip = pts[pts.length - 1]; x.fillStyle = P.amberDark; x.beginPath(); x.arc(tip[0], tip[1], 11, 0, TAU); x.fill();
    const b = smooth((t - K.before + .5) / .6); if (b > 0) {
      x.save(); x.globalAlpha = b; x.setLineDash([6, 12]); x.lineDashOffset = 0; x.strokeStyle = INK; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(X(1919), Y(1)); x.lineTo(lerp(X(1919), X(1930), b), Y(1)); x.stroke(); x.restore();
      x.globalAlpha = b; x.fillStyle = INK; x.font = '900 26px NSC'; x.textAlign = 'right'; x.textBaseline = 'bottom'; x.fillText('BEFORE', X(1930), Y(1) - 10); x.globalAlpha = 1;
    }
  }
  const TW = M45 ? 92 : 110, TAGS = [{ k: 'skull', yr: 1926.3, t: K.dangerous - .15, hang: 90 }, { k: 'pistol', yr: 1928, t: K.murderers - .1, hang: 200 }, { k: 'jar', yr: 1929.6, t: K.tax - .35, hang: 90 }];
  function icon(x, k) {
    x.fillStyle = INK; x.strokeStyle = INK; x.lineCap = 'round';
    if (k === 'skull') { x.beginPath(); x.arc(0, -6, 20, 0, TAU); x.fill(); x.fillRect(-11, 8, 22, 12); x.fillStyle = P.card; x.beginPath(); x.arc(-7, -8, 5.5, 0, TAU); x.arc(7, -8, 5.5, 0, TAU); x.fill(); }
    else if (k === 'pistol') { polyPath(x, [[-34, -12], [26, -12], [26, 0], [-34, 0]]); x.fill(); polyPath(x, [[8, -2], [26, -2], [34, 24], [18, 26]]); x.fill(); x.lineWidth = 3; x.beginPath(); x.arc(4, 4, 8, 0, Math.PI); x.stroke(); }
    else { x.lineWidth = 4; x.beginPath(); x.moveTo(-22, -22); x.lineTo(-24, 22); x.quadraticCurveTo(0, 30, 24, 22); x.lineTo(22, -22); x.stroke(); x.fillRect(-26, -30, 52, 8); x.font = '900 14px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TAX', 0, 4); }
  }
  function tags(x, t, tp) {
    for (const g of TAGS) {
      const u = back((tp - g.t) / .35); if (u <= 0) continue;
      const top = [X(g.yr), Y(level(g.yr))], sw = .08 * Math.sin((tp - g.t) * 4) * Math.exp(-(tp - g.t) * 1.2);
      x.save(); x.translate(top[0], top[1]); x.rotate(sw); x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, g.hang * u); x.stroke();
      x.translate(0, g.hang * u); x.scale(u, u); x.fillStyle = 'rgba(0,0,0,.2)'; x.fillRect(-TW / 2 + 5, 6, TW, TW * .82); x.fillStyle = P.card; x.fillRect(-TW / 2, 0, TW, TW * .82);
      x.strokeStyle = INK; x.lineWidth = 2; x.strokeRect(-TW / 2 + 5, 5, TW - 10, TW * .82 - 10); x.translate(0, TW * .41); x.scale(TW / 110, TW / 110); icon(x, g.k); x.restore();
    }
    const z = back((tp - K.tax) / .35); if (z > 0) {
      const g = TAGS[2]; x.save(); x.translate(X(g.yr), Y(level(g.yr)) + g.hang + TW * .82 + 40); x.scale(z, z);
      x.fillStyle = INK; x.font = `900 ${M45 ? 34 : 38}px NSC`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Tax: $0', 0, 0); x.restore();
    }
  }
  const FLAG = [X(1921.2), G.y1];
  function flag(x, t, tp) {
    const u = back((tp - K.single + .1) / .35); if (u <= 0) return;
    const gust = smooth((tp - K.could + .05) / .5), fly = clamp((tp - K.hold + .1) / .8), fall = easeIO(clamp((tp - K.hold) / .5));
    x.save(); x.translate(FLAG[0], FLAG[1]); x.rotate(1.25 * fall); x.scale(u, u);
    x.fillStyle = INK; x.fillRect(-3, -150, 6, 150);
    if (fly <= 0) {
      const f = tp * (6 + 10 * gust), wv = k => (4 + 8 * gust) * Math.sin(f + k * 1.4);
      x.fillStyle = AMB; x.beginPath(); x.moveTo(3, -150); x.lineTo(110, -130 + wv(2)); x.lineTo(3, -100); x.closePath(); x.fill();
      x.fillStyle = INK; x.font = '900 20px NSC'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('GOAL', 14, -128 + wv(1) * .4);
    }
    x.restore();
    if (fly > 0) {
      x.save(); x.translate(FLAG[0] + 900 * fly * fly + 60 * fly, FLAG[1] - 130 - 420 * fly); x.rotate(fly * 7); x.globalAlpha = 1 - smooth((fly - .7) / .3);
      x.fillStyle = AMB; x.beginPath(); x.moveTo(-50, -25); x.lineTo(57, -5); x.lineTo(-50, 25); x.closePath(); x.fill();
      x.fillStyle = INK; x.font = '900 20px NSC'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('GOAL', -39, -3); x.restore();
    }
  }

  const CC = [G.card[0] + G.card[2] / 2, G.card[1] + G.card[3] / 2], zf = M45 ? .88 : 1;
  const KEYS = [[0, [X(1916.5), Y(.75), 1.45]], [1.0, [X(1917.5), Y(.75), 1.45]], [K.fell - .8, [X(1918), Y(.72), 1.45]], [K.sharply + .3, [X(1920), Y(.6), 1.35]],
    [K.up + .4, [X(1923), Y(.55), 1.2]], [K.decade + .7, [CC[0], CC[1], 1.12]], [K.dangerous - .7, [CC[0], CC[1], 1.12]], [K.dangerous + .2, [X(1927.2), Y(.42), 1.5]],
    [K.tax + .9, [X(1927.6), Y(.4), 1.5]], [K.single - .4, [X(1924), Y(.45), 1.2]], [K.single + .6, [X(1921.8), Y(.12), 1.6]], [DUR, [X(1922.2), Y(.13), 1.65]]]
    .map(([t, v]) => [t, [v[0], v[1], Math.log(v[2] * zf)]]);
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  function yes(ctx, t) {
    const a = back((t - K.yes + .05) / .3) * (1 - smooth((t - K.fell + .9) / .4)); if (a <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(M45 ? W * .66 : W * .72, M45 ? H * .5 : H * .56); ctx.scale(a, a);
    ctx.fillStyle = INK; ctx.font = '900 130px NSC'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Yes', 0, 0); ctx.restore();
  }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { chart(x); line(x, t); tags(x, t, tp); flag(x, t, tp); }, {});
    yes(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.yes, K.sharply, K.up, K.before, K.dangerous, K.murderers, K.tax, K.hold],
  });
})();
