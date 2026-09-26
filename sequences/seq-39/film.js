(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath } = FILM, PR = FILM.props;
  const ID = 'seq-39', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const S05 = FILM.getScene('seq-05').api;
  const K = { lesson: 0.701, prohibition: 1.868, dangerous: 3.17, vice: 4.905, good: 6.239,
    intention: 6.473, refuses: 7.24, understand: 8.041, behave: 9.543 };
  const TOP = 700, STRIP = [620, 672], GLASS = [1160, TOP], RIB = [1520, TOP];
  const grow = t => easeIO(clamp((t - K.good + .2) / 1.6)), beast = t => smooth((t - K.refuses) / 1.4);
  function room(x) {
    const g = x.createLinearGradient(0, -400, 0, TOP); g.addColorStop(0, '#e9c9a8'); g.addColorStop(1, '#f3dcc0'); x.fillStyle = g; x.fillRect(-800, -1200, 4400, TOP + 1200);
    x.fillStyle = '#5a3a26'; x.fillRect(80, 40, 440, 480); const s = x.createLinearGradient(0, 60, 0, 500); s.addColorStop(0, '#f7c9a0'); s.addColorStop(1, '#fbe3b8');
    x.fillStyle = s; x.fillRect(100, 60, 400, 440); x.fillStyle = '#5a3a26'; x.fillRect(292, 60, 16, 440); x.fillRect(100, 272, 400, 16);
    x.fillStyle = 'rgba(255,236,200,.35)'; polyPath(x, [[100, 60], [500, 60], [2600, 420], [2600, 700], [500, 500], [100, 500]]); x.fill();
    x.fillStyle = '#7a5436'; x.fillRect(-800, TOP, 4400, 50); x.fillStyle = '#5a3b25'; x.fillRect(-800, TOP + 50, 4400, 900);
  }
  const SH = '#b3927a';
  function shadow(x, t) {
    const gr = grow(t), bs = beast(t); if (gr <= 0) return;
    x.save(); x.globalAlpha = gr * (1 - bs); x.fillStyle = SH;
    x.translate(RIB[0], TOP); x.transform(1, 0, 1.4 * gr, 1, 0, 0); x.scale(1 + 2 * gr, 1 + 3 * gr);
    for (const b of [[[0, -80], [30, -98], [30, -62]], [[0, -80], [-30, -98], [-30, -62]], [[-3, -80], [-16, -20], [0, -32], [16, -20], [3, -80]]]) { polyPath(x, b); x.fill(); }
    x.restore();
    if (bs <= 0) return;
    const OC = [RIB[0] + 420, 230], tp = pose(t);
    x.save(); x.beginPath(); x.arc(RIB[0] + 60, TOP - 60, 1700 * easeOut(bs), 0, TAU); x.clip();
    x.fillStyle = SH; x.strokeStyle = SH; x.lineCap = 'round'; x.lineJoin = 'round';
    for (let i = 0; i < 8; i++) { const a0 = Math.PI * (.15 + .7 * i / 7); let prev = null;
      for (let k = 0; k <= 12; k++) { const s = k / 12, a = a0 + Math.sin(tp * 1.4 + i + s * 3) * .35 * s + (i < 4 ? -1 : 1) * s * s * .9, p = [OC[0] + Math.cos(a) * (110 + 470 * s), OC[1] + 50 + Math.sin(a) * (70 + 330 * s)];
        if (prev) { x.lineWidth = 80 - 68 * s; x.beginPath(); x.moveTo(prev[0], prev[1]); x.lineTo(p[0], p[1]); x.stroke(); } prev = p; } }
    x.beginPath(); x.ellipse(OC[0], OC[1] - 60, 170, 210, 0, 0, TAU); x.fill();
    x.lineWidth = 60; x.beginPath(); x.moveTo(RIB[0], TOP - 40); x.quadraticCurveTo(RIB[0] + 120, TOP - 160, OC[0] - 60, OC[1] + 120); x.stroke();
    x.fillStyle = '#e8c9a0'; for (const s of [-1, 1]) { x.beginPath(); x.ellipse(OC[0] + s * 62, OC[1] - 20, 20, 12, s * .25, 0, TAU); x.fill(); }
    x.restore();
  }

  function objects(x, t) {
    x.save(); x.translate(STRIP[0], STRIP[1]); x.rotate(-.04); x.scale(.5, .3); S05.strip(x); x.restore();
    x.save(); x.translate(GLASS[0], GLASS[1]);
    x.fillStyle = 'rgba(245,236,216,.5)'; polyPath(x, [[-48, -130], [48, -130], [40, 0], [-40, 0]]); x.fill(); x.fillStyle = FILM.rgba(FILM.hex(P.amber), .85); polyPath(x, [[-44, -70], [44, -70], [40, -4], [-40, -4]]); x.fill();
    x.strokeStyle = '#efe4c8'; x.lineWidth = 4; polyPath(x, [[-48, -130], [48, -130], [40, 0], [-40, 0]]); x.stroke(); x.fillStyle = 'rgba(255,255,255,.4)'; x.fillRect(-34, -120, 8, 110); x.restore();
    x.save(); x.translate(RIB[0], RIB[1]);
    x.fillStyle = '#5a3a22'; x.fillRect(-26, -8, 52, 8); x.fillRect(-3, -60, 6, 54);
    x.fillStyle = '#fbf7ee'; x.strokeStyle = 'rgba(80,60,40,.5)'; x.lineWidth = 1.5;
    for (const b of [[[0, -80], [30, -98], [30, -62]], [[0, -80], [-30, -98], [-30, -62]], [[-3, -80], [-16, -20], [0, -32], [16, -20], [3, -80]]]) { polyPath(x, b); x.fill(); x.stroke(); }
    x.restore();
  }
  const KEYS = [[0, [700, 560, 1.8]], [K.prohibition + .3, [740, 560, 1.75]], [K.vice - .2, [1160, 560, 1.6]], [K.good - .1, [1480, 560, 1.45]], [K.understand + .6, [1900, 360, .78]], [DUR, [1920, 350, .76]]]
    .map(([t, v]) => [t, [v[0], v[1] + (M45 ? 40 : 0), Math.log(v[2] * (M45 ? .75 : 1))]]);
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  function draw(ctx, t) {
    const cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { room(x); shadow(x, t); objects(x, t); }, { paperShadow: [10, 6, 6, .3] });
    const a = smooth((t - K.good + .05) / .35) * (1 - smooth((t - DUR + .1) / .3));
    if (a > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.font = `italic 900 ${M45 ? 70 : 76}px NSC`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#f3e6cc'; ctx.fillText('good intentions', W / 2, M45 ? H - 150 : H - 110); ctx.restore(); }
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.lesson, K.vice, K.good, K.refuses, K.behave],
  });
})();
