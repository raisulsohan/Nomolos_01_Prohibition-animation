(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath } = FILM, PR = FILM.props;
  const ID = 'seq-06d', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { drank: 0.467, wages: 1.201, families: 1.868, needed: 2.302, eat: 2.802 };
  const HS = 1.3, SPOT = -50, SURF = -35;
  const WORKER = { skin: P.skin, sleeve: '#4d5b68', cuff: '#e9e2d0' }, BAR = { skin: '#e2b490', sleeve: '#e9e2d0', band: '#2c2824' };

  function set(x) {
    x.fillStyle = '#c9a27a'; x.fillRect(-900, -900, 1800, 900); x.fillStyle = 'rgba(120,70,40,.14)'; for (let px = -880; px < 900; px += 70) x.fillRect(px, -900, 30, 900);
    x.fillStyle = '#8a7a5e'; x.fillRect(-700, -640, 1400, 240); x.fillStyle = 'rgba(255,245,220,.35)'; x.fillRect(-680, -620, 1360, 200);
    x.fillStyle = '#3e2c1e'; x.fillRect(-720, -330, 1440, 18);
    for (let k = 0; k < 13; k++) { x.save(); x.translate(-640 + k * 108, -330); x.scale(.95, .95); PR.bottle(x, P, 100 + (k % 3) * 20); x.restore(); }
    x.fillStyle = '#a2744a'; x.fillRect(-900, -75, 1800, 75); x.fillStyle = 'rgba(80,50,28,.18)'; for (let py = -64; py < 0; py += 16) x.fillRect(-900, py, 1800, 2);
    x.fillStyle = '#8a5e3a'; x.fillRect(-900, -2, 1800, 16);
    x.fillStyle = '#6b4529'; x.fillRect(-900, 2, 1800, 700); x.fillStyle = '#5a3a22'; for (let k = 0; k < 8; k++) x.fillRect(-860 + k * 230, 40, 190, 220);
  }
  function arm(x, who, from, o) {
    const w = FILM.hand.wrist(o), dx = w.p[0] - from[0], dy = w.p[1] - from[1], n = Math.hypot(dx, dy), nx = -dy / n, ny = dx / n, hw = w.w / 2;
    x.fillStyle = who.sleeve; polyPath(x, [[from[0] + nx * hw * 1.5, from[1] + ny * hw * 1.5], [w.p[0] + nx * hw * 1.1, w.p[1] + ny * hw * 1.1], [w.p[0] - nx * hw * 1.1, w.p[1] - ny * hw * 1.1], [from[0] - nx * hw * 1.5, from[1] - ny * hw * 1.5]]); x.fill();
    const c = [w.p[0] - dx / n * 30, w.p[1] - dy / n * 30];
    x.fillStyle = who.band || who.cuff; polyPath(x, [[c[0] + nx * hw * 1.15, c[1] + ny * hw * 1.15], [c[0] + dx / n * 14 + nx * hw * 1.15, c[1] + dy / n * 14 + ny * hw * 1.15], [c[0] + dx / n * 14 - nx * hw * 1.15, c[1] + dy / n * 14 - ny * hw * 1.15], [c[0] - nx * hw * 1.15, c[1] - ny * hw * 1.15]]); x.fill();
  }
  const handOpts = (who, h, side, from, grip, r) => ({ h, side, r, grip, skin: who.skin, s: HS, arm: Math.atan2(from[1] - h[1], from[0] - h[0]) });
  const bill = (x, w, h) => { x.fillStyle = '#7f9c68'; x.fillRect(-w / 2, -h / 2, w, h); x.fillStyle = '#6a8656'; x.fillRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10); x.fillStyle = '#9ab784'; x.beginPath(); x.ellipse(0, 0, h * .28, h * .28, 0, 0, TAU); x.fill(); };
  function wagesHeld(x, h) {
    x.save(); x.translate(h[0], h[1]); x.rotate(-.12); x.save(); x.rotate(Math.PI / 2); bill(x, 190, 52); x.restore();
    x.fillStyle = '#e8c35a'; for (const [cx, cy] of [[-10, -100], [10, -96]]) { x.beginPath(); x.arc(cx, cy, 12, 0, TAU); x.fill(); }
    x.restore();
  }
  function wagesDown(x, at) {
    x.save(); x.translate(at, SURF);
    for (const [dx, dy, r] of [[-24, 4, -.12], [6, -2, .08], [30, 3, -.04]]) { x.save(); x.translate(dx, dy); x.rotate(r); x.scale(1, .5); bill(x, 130, 60); x.restore(); }
    x.fillStyle = '#e8c35a'; x.strokeStyle = '#b8913a'; x.lineWidth = 2;
    for (const [cx, cy] of [[-86, 8], [78, -6], [100, 10]]) { x.beginPath(); x.ellipse(cx, cy, 14, 8, 0, 0, TAU); x.fill(); x.stroke(); }
    x.restore();
  }

  const T = { in: .1, out: .55, lift: .95, down: K.wages, open: K.wages + .12, back: K.wages + .3, take: K.families - .2, sweep: K.families + .15, gone: K.needed + .1, push: K.needed + .2, set: K.eat, leave: K.eat + .1 };
  const WK = [[0, [-250, 40], .1], [T.in + .3, [-322, 118], .8], [T.out, [-322, 118], 1], [T.lift, [-210, -120], 1], [T.down - .06, [SPOT - 10, -120], 1], [T.down, [SPOT, -92], 1],
    [T.open + .15, [SPOT - 5, -98], 0], [T.back + .45, [-225, -78], .35], [DUR, [-220, -80], .35]];
  const BK = [[0, [760, -90], .2], [T.take, [760, -90], .2], [T.sweep - .05, [SPOT + 30, -85], .2], [T.gone, [600, -85], .2], [T.push, [600, -80], 1], [T.set, [SPOT + 5, -80], 1],
    [T.set + .12, [SPOT + 5, -80], 0], [DUR, [700, -80], 0]];
  const at = (keys, tp) => { const v = keyed(tp, keys.map(([t, h, g]) => [t, [h[0], h[1], g]])); return { h: [v[0], v[1]], g: v[2] }; };
  const glassAt = tp => tp < T.push ? null : [lerp(610, SPOT + 5, easeIO(clamp((tp - T.push) / (T.set - T.push)))), SURF];
  const ELBOW_W = [-560, -160], ELBOW_B = [1100, 40];

  function scene(x, tp) {
    set(x);
    const w = at(WK, tp), b = at(BK, tp), inPocket = tp > T.in + .15 && tp < T.out + .12, carried = tp > T.sweep && tp < T.gone;
    if (tp >= T.down && tp < T.sweep) wagesDown(x, SPOT);
    if (carried) wagesDown(x, b.h[0] - 20);
    const g = glassAt(tp);
    const bo = handOpts(BAR, b.h, 1, ELBOW_B, b.g, g && tp < T.set + .12 ? 36 : 9);
    arm(x, BAR, ELBOW_B, bo); FILM.hand.back(x, bo);
    if (g) PR.shotGlass(x, P, g[0], g[1], 1.7, .75);
    FILM.hand.front(x, bo);
    x.fillStyle = WORKER.sleeve; x.fillRect(-900, -700, 630, 1400); x.fillStyle = 'rgba(30,30,40,.25)'; x.fillRect(-278, -700, 8, 1400);
    x.fillStyle = '#e9e2d0'; x.beginPath(); x.arc(-420, -120, 9, 0, TAU); x.arc(-420, 20, 9, 0, TAU); x.fill();
    x.fillStyle = '#44525e'; x.fillRect(-384, 100, 124, 118); x.strokeStyle = 'rgba(233,226,208,.45)'; x.lineWidth = 2; x.setLineDash([7, 6]); x.strokeRect(-378, 106, 112, 106); x.setLineDash([]);
    x.fillStyle = '#2f3a44'; x.fillRect(-380, 100, 116, 7);
    const wo = handOpts(WORKER, w.h, -1, ELBOW_W, w.g, 14);
    arm(x, WORKER, ELBOW_W, wo); FILM.hand.back(x, wo);
    if (tp >= T.out - .05 && tp < T.down) wagesHeld(x, w.h);
    FILM.hand.front(x, wo);
    if (inPocket) { x.fillStyle = WORKER.sleeve; x.fillRect(-388, 108, 132, 110); x.fillStyle = 'rgba(30,30,40,.3)'; x.fillRect(-388, 108, 132, 5); }
  }

  function camera(t) {
    const u = easeIO(clamp(t / (DUR - .3)));
    return { x: lerp(-90, -60, u), y: lerp(-40, -45, u), z: lerp(2, 2.2, u) * (M45 ? .62 : 1) };
  }
  function draw(ctx, t) {
    const tp = pose(t);
    L.background(ctx);
    L.sheet(ctx, camera(t), 1, R, x => scene(x, tp), { paperShadow: [6, 8, 6, .35] });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [T.out, T.down, T.sweep, T.set],
  });
})();
