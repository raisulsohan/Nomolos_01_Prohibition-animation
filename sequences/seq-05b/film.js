(() => {
  'use strict';
  const { smooth, easeOut, easeIO, clamp, lerp } = FILM, PR = FILM.props;
  const ID = 'seq-05b', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S5 = FILM.getScene('seq-05').api, T0 = S5.DUR;
  const LB = FILM.look('lightbox', W, H);

  const K = { story: 0.534, how: 1.035, war: 1.368, created: 2.203, al: 2.737, capone: 2.937 };
  K.raise = [K.story - .2, K.how - .1]; K.out = [K.how - .05, K.war]; K.breath = K.war + .05; K.back = [K.created + .15, K.al + .02];
  K.draw = K.capone + .1; K.lower = [K.al + .2, K.al + .75];
  const REST = [-30, 16], GRIP = [-22.9, -47.1], AWAY = [-34, -37];
  const WORDS = [['HOW', 1.035], ['A', 1.202], ['WAR', 1.368], ['ON', 1.602], ['ALCOHOL', 1.736]];

  const T1 = 1.9;
  const TARGET = M45 ? { x: 1247, y: 91, z: 7.2 } : { x: 1218, y: 112, z: 10.5 };
  const c0 = S5.cityCam(T0), cm = S5.cityCam(T0 - 1 / 120);
  const v0 = { x: (c0.x - cm.x) * 120, y: (c0.y - cm.y) * 120, lz: (Math.log(c0.z) - Math.log(cm.z)) * 120 };
  const herm = (p0, v, p1, u) => { const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * T1 * v + (-2 * u3 + 3 * u2) * p1; };
  function camera(t) {
    const u = clamp(t / T1);
    return { x: herm(c0.x, v0.x, TARGET.x, u), y: herm(c0.y, v0.y, TARGET.y, u), z: Math.exp(herm(Math.log(c0.z), v0.lz, Math.log(TARGET.z), u)) };
  }

  const TITLE = M45
    ? { x: 540, y1: 200, y2: 262, y3: 395, f1: '900 50px NSC', f3: '900 140px NSC' }
    : { x: 470, y1: 404, y2: 472, y3: 600, f1: '900 58px NSC', f3: '900 150px NSC' };
  function title(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.font = TITLE.f1; ctx.fillStyle = '#efe2c6'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 12;
    const space = ctx.measureText(' ').width, widths = WORDS.map(([w]) => ctx.measureText(w).width), total = widths.reduce((a, b) => a + b, 0) + space * (WORDS.length - 1);
    let x = TITLE.x - total / 2;
    WORDS.forEach(([w, cue], i) => { const a = smooth((t - cue + .02) / .25); if (a > 0) { ctx.globalAlpha = a; ctx.fillText(w, x, TITLE.y1 + (1 - a) * 10); } x += widths[i] + space; });
    const ac = smooth((t - K.created + .02) / .25);
    if (ac > 0) { ctx.globalAlpha = ac; ctx.textAlign = 'center'; ctx.fillText('CREATED', TITLE.x, TITLE.y2 + (1 - ac) * 10); }
    const al = smooth((t - K.al + .02) / .3);
    if (al > 0) {
      const s = 1 + .06 * (1 - easeOut(clamp((t - K.al) / .45)));
      ctx.globalAlpha = al; ctx.textAlign = 'center'; ctx.font = TITLE.f3; ctx.fillStyle = '#ffc36a';
      ctx.shadowColor = 'rgba(255,150,40,.55)'; ctx.shadowBlur = 30;
      ctx.translate(TITLE.x, TITLE.y3); ctx.scale(s, s); ctx.fillText('AL CAPONE', 0, 0);
    }
    ctx.restore();
  }

  function draw(ctx, t) {
    const cam = camera(t), T = T0 + t;
    const tp = FILM.pose(t), mv = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
    let hand = null, holding = false;
    if (tp >= K.raise[0] && tp < K.lower[1]) {
      if (tp < K.raise[1]) hand = mv(REST, GRIP, easeIO((tp - K.raise[0]) / (K.raise[1] - K.raise[0])));
      else if (tp < K.out[0]) hand = GRIP;
      else if (tp < K.back[0]) { hand = mv(GRIP, AWAY, easeIO((tp - K.out[0]) / (K.out[1] - K.out[0]))); holding = true; }
      else if (tp < K.back[1]) { hand = mv(AWAY, GRIP, easeIO((tp - K.back[0]) / (K.back[1] - K.back[0]))); holding = true; }
      else if (tp < K.lower[0]) hand = GRIP;
      else hand = mv(GRIP, REST, easeIO((tp - K.lower[0]) / (K.lower[1] - K.lower[0])));
    }
    const puff = Math.exp(-(((t - K.draw - .15) / .28) ** 2)), ember = .6 + .4 * Math.max(puff, smooth((t - K.draw) / .4) * .4), face = .25 + .75 * Math.max(puff, smooth((t - K.draw) / .5) * .45);
    S5.city(ctx, T, true, cam, { ember, face, hand, holding, exhale: T0 + K.breath, puff });
    title(ctx, t);
    LB.grade(ctx, t);
  }

  const ready = FILM.fonts('NSC');
  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready, grain: 'none', label: C.label,
    shots: [{ id: 'S015', start: 0, end: DUR }], marks: [K.how, K.created, K.al],
  });
})();
