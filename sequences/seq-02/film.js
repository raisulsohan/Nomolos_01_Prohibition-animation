(() => {
  'use strict';
  const { TAU, keyed, smooth, easeIO, easeOut, easeIn, easeOutBack, env, clamp, lerp, hash, polyPath, hex, rgba } = FILM, PR = FILM.props;
  const ID = 'seq-02', { W, H, id: FMT } = FILM.format(), R = [960, 545];
  const ZF = z => FMT === '4x5' ? z * lerp(.68, .9, clamp((z - 1) / 2)) : z;
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('flat', W, H), P = L.P, pose = L.pose;
  const M = FILM.usmap({ width: 1420, cx: 960, cy: 555 }), CT = M.cities;

  const K = {
    alcohol: 1.435, drunk: 2.536, broken: 3.471, homes: 3.871,
    crime: 4.538, pull: 6.04 - .1, nation: 7.842, no: 6.907, tried: 8.742,
    illegal: 10.511, s7: C.s('S007'), s8: C.s('S008'),
  };
  K.impact = K.illegal + .08;
  K.stampIn = [K.impact - .42, K.impact]; K.lift = [K.impact + .3, K.impact + .72];
  K.pop = { drunk: [K.drunk - .45, K.drunk - .05], house: [K.broken - .3, K.broken + .1], shop: [K.crime - .5, K.crime - .15] };
  K.crack = [K.homes - .1, K.homes + .7];
  K.brick = [K.crime - .05, K.crime + .25];
  K.fold = [K.pull, K.pull + .5];
  K.light = [K.no - .2, K.tried + .1];
  K.push8 = [K.s8.t0, K.s8.t0 + .3]; K.whip = [K.push8[1], K.push8[1] + .8];

  const A = { drunk: CT.chicago, house: M.proj([-82.6, 39.9]), shop: CT.newyork };
  const STAMP = { at: M.proj([-98.2, 38.9]), rot: -.06, w: 360, h: 160 };
  const ICONS = ['seattle', 'sanfrancisco', 'losangeles', 'phoenix', 'saltlake', 'denver', 'dallas', 'houston', 'neworleans', 'minneapolis',
    'kansascity', 'stlouis', 'detroit', 'atlanta', 'miami', 'washington', 'philadelphia', 'boston', 'omaha', 'nashville', 'cleveland']
    .map((k, i) => ({ p: CT[k], kind: ['bottle', 'barrel', 'mug'][i % 3], ph: hash(i, 3) * TAU, pop: hash(i, 5) }));
  ICONS.map((ic, i) => [Math.hypot(ic.p[0] - STAMP.at[0], ic.p[1] - STAMP.at[1]), i]).sort((a, b) => a[0] - b[0])
    .forEach(([, i], r) => { ICONS[i].mark = lerp(K.s7.t0 + .05, K.s7.t1 - .2, r / (ICONS.length - 1)); });
  const VS = 1.5;
  const WASH = '#7e1410';
  let INK = null;

  const at = (p, dy = -40) => [p[0], p[1] + dy];
  const PATH = [
    [0, [1150, 470], 1.55],
    [K.alcohol + .3, [1110, 460], 1.62],
    [K.drunk + .35, at([A.drunk[0] + 25, A.drunk[1]]), 3.0],
    [K.homes + .15, at(A.house), 2.9],
    [K.crime + .2, at([A.shop[0] + 15, A.shop[1]], -38), 2.8],
    [K.pull, at([A.shop[0] + 10, A.shop[1]], -38), 2.8],
    [K.nation + .1, R, 1.0],
    [K.push8[0], R, 1.035],
    [K.push8[1], [CT.newyork[0] - 60, CT.newyork[1] - 10], 1.7],
    [K.whip[1], [CT.sanfrancisco[0] + 90, 470], 1.7],
  ];
  function camera(t) {
    const xy = keyed(t, PATH.map(k => [k[0], k[1]]));
    const z = keyed(t, PATH.map(k => [k[0], k[2]]), true);
    if (t > K.whip[0]) {
      const k = easeIO(clamp((t - K.whip[0]) / (K.whip[1] - K.whip[0])));
      const a = PATH[8][1], b = PATH[9][1];
      return { x: lerp(a[0], b[0], k), y: lerp(a[1], b[1], k), z: ZF(1.7) };
    }
    return { x: xy[0], y: xy[1], z: ZF(z) };
  }
  function shake(t) {
    const d = t - K.impact; if (d < 0 || d > .6) return [0, 0];
    const a = 10 * Math.exp(-d * 8); return [a * Math.sin(d * 57), a * .7 * Math.sin(d * 43 + 1)];
  }

  function land(ctx, t, cam, sh) {
    const lit = smooth((t - K.light[0]) / (K.light[1] - K.light[0]));
    const b = FILM.bounds(M.us);
    L.sheet(ctx, cam, 1, R, x => {
      x.fillStyle = P.sheet2; for (const k of ['canada', 'mexico']) { polyPath(x, M[k]); x.fill(); }
      const lg = x.createLinearGradient(b.x0, b.y0, b.x1, b.y1); lg.addColorStop(0, P.sheet); lg.addColorStop(1, P.sheetShade);
      polyPath(x, M.us); x.fillStyle = lg; x.fill();
      if (lit < 1) {
        const sx = lerp(b.x0 - 320, b.x1 + 20, lit), g = x.createLinearGradient(sx, 0, sx + 300, 0);
        g.addColorStop(0, rgba(hex(P.sheetDim), 0)); g.addColorStop(1, rgba(hex(P.sheetDim), 1));
        polyPath(x, M.us); x.fillStyle = g; x.fill();
      }
      if (t > K.whip[0]) {
        const wx = camera(t).x - 260, g = x.createLinearGradient(wx - 120, 0, wx, 0);
        g.addColorStop(0, rgba(hex(WASH), 0)); g.addColorStop(1, rgba(hex(WASH), .74));
        x.save(); polyPath(x, M.us); x.clip(); x.fillStyle = g; x.fillRect(wx - 120, b.y0 - 50, b.x1 - wx + 320, b.h + 100); x.restore();
      }
      x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; for (const l of Object.values(M.lakes)) { polyPath(x, l); x.fill(); } x.globalCompositeOperation = 'source-over';
      if (INK && t >= K.impact) { x.save(); x.translate(STAMP.at[0], STAMP.at[1]); x.rotate(STAMP.rot); x.globalAlpha = .93; x.drawImage(INK, -STAMP.w / 2, -STAMP.h / 2, STAMP.w, STAMP.h); x.restore(); }
    }, { shake: sh });
    return lit;
  }

  function icons(ctx, t, cam, sh) {
    const tp = pose(t);
    FILM.sheet(ctx, cam, 1, W, H, R, sh);
    for (const ic of ICONS) {
      const k = easeOutBack(clamp((tp - K.alcohol + .15 - ic.pop * .5) / .3), 1.6); if (k <= 0) continue;
      PR.glow(ctx, ic.p[0], ic.p[1] - 7, 18, P.amber, .45 * k * (.75 + .25 * Math.sin(t * 2.2 + ic.ph)), 'flat');
    }
    L.sheet(ctx, cam, 1, R, x => {
      for (const ic of ICONS) {
        const k = easeOutBack(clamp((tp - K.alcohol + .15 - ic.pop * .5) / .3), 1.6); if (k <= 0) continue;
        const m = ic.mark !== undefined ? clamp((tp - ic.mark) / .12) : 0, hop = m > 0 && m < 1 ? -Math.sin(m * Math.PI) * 4 : 0;
        x.save(); x.translate(ic.p[0], ic.p[1] + hop); x.scale(k, k);
        PR[ic.kind === 'bottle' ? 'miniBottle' : ic.kind === 'barrel' ? 'miniBarrel' : 'miniMug'](x, P, 14);
        x.restore();
        if (m > 0) {
          const s = 11 * (1 + .5 * (1 - easeOut(m)));
          x.save(); x.translate(ic.p[0], ic.p[1] - 7); x.rotate(-.1); x.strokeStyle = P.red; x.lineWidth = 3.2; x.lineCap = 'round';
          x.beginPath(); x.moveTo(-s, -s); x.lineTo(s, s); x.moveTo(s, -s); x.lineTo(-s, s); x.stroke(); x.restore();
        }
      }
    }, { shake: sh, flatShadow: [3, 4, 3, .4] });
  }

  function vignettes(ctx, t, cam, sh) {
    const tp = pose(t), fold = 1 - easeIn(clamp((tp - K.fold[0]) / (K.fold[1] - K.fold[0])), 2);
    if (fold <= .01) return;
    const up = w => easeOutBack(clamp((tp - w[0]) / (w[1] - w[0])), 1.4) * fold;
    const list = [
      { id: 1, at: A.drunk, k: up(K.pop.drunk), draw: x => PR.drunk(x, P, tp) },
      { id: 2, at: A.house, k: up(K.pop.house), draw: x => PR.house(x, P, clamp((tp - K.crack[0]) / (K.crack[1] - K.crack[0])), clamp((tp - K.crack[1]) / .35)) },
      { id: 3, at: A.shop, k: up(K.pop.shop), draw: x => PR.shop(x, P, clamp((tp - K.brick[0]) / (K.brick[1] - K.brick[0])), tp - K.brick[1], 'flat') },
    ];
    L.sheet(ctx, cam, 1.04, R, x => {
      for (const v of list) {
        if (v.k <= .01) continue;
        const b = L.boil(t, v.id);
        x.save(); x.translate(v.at[0] + b[0], v.at[1] + b[1]); x.rotate(b[2]); x.scale(VS, VS * v.k); v.draw(x); x.restore();
      }
    }, { shake: sh, flatShadow: [10, 6, 8, .4] });
    const k = list[0].k;
    if (k > .01) { FILM.sheet(ctx, cam, 1.04, W, H, R, sh); PR.glow(ctx, A.drunk[0] + 12 * VS, A.drunk[1] - 96 * VS * k, 60 * VS, P.lampGlass, .35, 'flat'); }
  }

  function stampHeight(t) {
    if (t < K.stampIn[0]) return null;
    if (t < K.impact) return 1 - easeIn((t - K.stampIn[0]) / (K.impact - K.stampIn[0]), 2.2);
    if (t < K.lift[0]) return 0;
    if (t < K.lift[1]) return easeIn((t - K.lift[0]) / (K.lift[1] - K.lift[0]), 1.6) * 1.3;
    return null;
  }
  function stamp(ctx, t, cam, sh) {
    const h = stampHeight(pose(t)); if (h === null) return;
    FILM.sheet(ctx, cam, 1, W, H, R, sh);
    ctx.save(); ctx.translate(STAMP.at[0] + h * 60, STAMP.at[1] + h * 80); ctx.rotate(STAMP.rot);
    ctx.filter = `blur(${2 + h * 22}px)`; ctx.fillStyle = `rgba(0,0,0,${.35 * (1 - h * .5)})`; ctx.fillRect(-STAMP.w / 2, -STAMP.h / 2, STAMP.w, STAMP.h); ctx.restore();
    const sc = 1 + h * 1.6;
    ctx.save(); ctx.translate(STAMP.at[0] - h * 170, STAMP.at[1] - h * 210); ctx.rotate(STAMP.rot - h * .12); ctx.scale(sc, sc);
    if (h > .05) ctx.filter = `blur(${h * 5}px)`;
    PR.rubberStamp(ctx, P, STAMP.w, STAMP.h, 'flat');
    ctx.restore();
  }

  function frame(ctx, t) {
    const cam = camera(t), sh = shake(t);
    L.background(ctx);
    land(ctx, t, cam, sh);
    icons(ctx, t, cam, sh);
    vignettes(ctx, t, cam, sh);
    stamp(ctx, t, cam, sh);
  }
  function draw(ctx, t) {
    const speed = t > K.whip[0] + .1 && t < K.whip[1] - .1 ? 1 : 0;
    if (speed) FILM.motionBlur(ctx, t, 1 / 60, 7, frame); else frame(ctx, t);
    L.grade(ctx, t);
  }

  const ready = FILM.fonts('NSC').then(() => { INK = PR.inkSprite('ILLEGAL', STAMP.w, STAMP.h, P.red, 'NSC', 77); });
  const PANX = x => Math.max(-.8, Math.min(.8, (x - 960) / 900));
  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready, grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.drunk, K.homes, K.crime, K.pull, K.impact, K.s7.t0, K.whip[0]],
  });
})();
