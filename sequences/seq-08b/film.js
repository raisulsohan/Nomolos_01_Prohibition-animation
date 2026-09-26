(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath } = FILM, PR = FILM.props;
  const ID = 'seq-08b', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S8 = FILM.getScene('seq-08').api, T8 = S8.DUR, L = FILM.look('lightbox', W, H), P = L.P, pose = L.pose;
  const K = { movement: 0.434, rose: 0.868, part: 3.403, forget: 4.204, crusade: 5.906,
    scolds: 6.607, tyrants: 7.307, led: 8.709, women: 10.577 };
  const hexA = (h, a) => FILM.rgba(FILM.hex(h), a), PS = S8.PS;
  const tremble = (tp, seed, a) => { const k = Math.round(tp * 15); return [a * (FILM.hash(k, seed, 1) - .5) * 3.2, a * (FILM.hash(k, seed, 2) - .5) * .035]; };

  const V = 200, HOOK = [575, -150], WALL = 600, START = S8.WIFE;
  const wifeX = tp => tp < .45 ? START : tp < 1.5 ? lerp(START, 640, easeIO((tp - .45) / 1.05)) : 640 + V * (Math.min(tp, K.part) - 1.5);
  const GAP = 130, OUT = [1.7, 1.98, 2.26, 2.54, 2.82, 3.1];
  const DOORS = OUT.map((o, i) => 640 + V * (o - 1.5) + GAP * (i + 1));
  const WOMEN = DOORS.map((d, i) => ({ d, out: OUT[i], coat: ['#3a3470', '#40386e', '#35305e', '#443c74', '#3c3666', '#38325f'][i], skirt: ['#2c2858', '#2a2450', '#302a5a', '#262048', '#2e2856', '#29244e'][i],
    hat: ['wide', 'none', 'wide', 'none', 'wide', 'none'][i] }));
  const womanX = (w, tp) => w.d + V * Math.max(0, Math.min(tp, K.part) - w.out);
  const walking = tp => tp > .45 && tp < K.part;
  const step = (tp, seed) => { const k = Math.round(Math.min(tp, K.part) * 15) + seed; return walking(tp) ? [-2.5 * (k % 2), (k % 2 ? .03 : -.03)] : [0, 0]; };
  const LAMP_ARM = [[[-8, -68], [-11, -57.5], [-11, -47]], [[8, -68], [14, -60], [17, -50]]];
  function lamp(x, hx, hy, lit) {
    x.save(); x.translate(hx, hy); x.fillStyle = P.ink; x.fillRect(-1, 0, 2, 5);
    x.fillStyle = lit ? '#ffd98a' : '#3a3050'; x.fillRect(-5, 5, 10, 13); x.fillStyle = P.ink; x.fillRect(-6, 4, 12, 2); x.fillRect(-6, 17, 12, 2); x.fillRect(-1, 5, 2, 13);
    x.restore();
  }
  function person(x, px, o, s, rot = 0, lampLit = -1) {
    x.save(); x.translate(px, 0); x.rotate(rot); x.scale(s, s); PR.person(x, P, o);
    if (lampLit >= 0) lamp(x, o.arms[1][2][0], o.arms[1][2][1], lampLit);
    x.restore();
  }
  const LAMPS = [];
  const raised = tp => easeOut(clamp((tp - K.women + .15) / .3));
  const lampArm = tp => { const r = raised(tp); return [LAMP_ARM[0], [[8, -68], [lerp(14, 17, r), lerp(-60, -76, r)], [lerp(17, 19, r), lerp(-50, -84, r)]]]; };
  function walkers(x, tp) {
    LAMPS.length = 0;
    if (tp < .35) { S8.family(x, T8 + tp); } else {
      const fade = 1 - smooth((tp - .35) / .5);
      if (fade > 0) { const g = x.createRadialGradient(START - 10, -110, 10, START - 10, -110, 190); g.addColorStop(0, hexA(P.amber, .34 * fade)); g.addColorStop(1, hexA(P.amber, 0)); x.fillStyle = g; x.fillRect(START - 210, -310, 400, 400); }
      const wx = wifeX(tp), [by, br] = step(tp, 0), has = tp > 1.05;
      const arms = has ? lampArm(tp) : [LAMP_ARM[0], [[8, -68], [lerp(14, 16, clamp((tp - .85) / .2)), -76], [lerp(17, (HOOK[0] - wx) / PS, clamp((tp - .85) / .2)), lerp(-50, HOOK[1] / PS + 4, clamp((tp - .85) / .2))]]];
      women(x, 0, wx, { kind: 'woman', coat: '#3a3470', skirt: '#2c2858', skin: '#4a3f70', hat: 'none', hatColor: '#241f48', ribbon: true, arms }, br, has, tp);
      const [cy2, cr2] = step(tp, 1);
      person(x, wx - 48, { kind: 'man', coat: '#45407a', trouser: '#2c2858', skin: '#4a3f70', hat: 'none', arms: [[[-8, -70], [-11, -59], [-11, -48]], [[8, -70], [16, -62], [24, -58]]] }, PS * .62, cr2);
    }
    if (tp < 1.05) lamp(x, HOOK[0], HOOK[1], 0);
    WOMEN.forEach((w, i) => {
      if (tp < w.out) return;
      const u = easeOut(clamp((tp - w.out) / .25)), [by, br] = step(tp, i + 2), px = womanX(w, tp);
      x.save(); x.translate(0, -18 * (1 - u)); x.globalAlpha = u;
      women(x, i + 1, px, { kind: 'woman', coat: w.coat, skirt: w.skirt, skin: '#4a3f70', hat: w.hat, hatColor: '#241f48', ribbon: true, arms: lampArm(tp) }, br, true, tp);
      x.restore();
    });
    banner(x, tp);
  }
  function women(x, i, px, o, rot, lit, tp) {
    const f = clamp((tp - (K.crusade - .15 + .05 * i)) / .25), c = clamp((tp - (K.led - .1 + .05 * i)) / .5);
    const real = f < .5 || c > .15, s = Math.max(.04, Math.abs(Math.cos(Math.PI * f)));
    if (real) {
      x.save(); x.translate(px, 0); x.scale(c > 0 ? 1 : s, 1); x.translate(-px, 0); person(x, px, o, PS, rot, lit ? 1 : -1); x.restore();
      if (lit) LAMPS.push([px + o.arms[1][2][0] * PS, (o.arms[1][2][1] + 11) * PS]);
    }
    if (f >= .5 && c < 1) {
      x.save(); x.translate(px + 30 * c * (i % 2 ? 1 : -1), 120 * c * c); x.rotate((i % 2 ? .7 : -.7) * c); x.scale((c > 0 ? 1 - .75 * c : s) * PS, (1 - .75 * c) * PS);
      x.globalAlpha *= 1 - c; caricature(x, i, tp, c); x.restore();
    }
  }
  function caricature(x, i, tp, c) {
    const INK = '#07060d', wag = tp > K.scolds ? (Math.round(tp * 15) % 2 ? .35 : -.35) : 0, up = easeOut(clamp((tp - K.tyrants - .02 * i) / .2));
    x.fillStyle = INK; polyPath(x, [[-17, 0], [17, 0], [10, -58], [-10, -58]]); x.fill(); polyPath(x, [[-10, -58], [10, -58], [9, -74], [-9, -74]]); x.fill();
    x.beginPath(); x.arc(0, -84, 7.5, 0, TAU); x.fill(); polyPath(x, [[-14, -78], [-11, -81], [-9, -95], [0, -100], [9, -95], [11, -81], [14, -78]]); x.fill();
    if (c > 0) { x.fillStyle = hexA('#8f8aa8', .5); for (let k = 0; k < 5; k++) { x.fillRect(-12 + k * 5, -70 + (k % 2) * 30, 1.5, 22); } }
    const line = (a, b, w) => { x.strokeStyle = INK; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); };
    x.save(); x.translate(-16, -80); x.rotate(wag); line([0, 0], [2, -14], 4.2); line([2, -14], [2, -22], 1.8); x.restore(); line([-9, -72], [-16, -80], 4.4);
    const e = [lerp(15, 17, up), lerp(-64, -86, up)], h = [lerp(17, 20, up), lerp(-54, -104, up)];
    line([9, -72], e, 4.4); line(e, h, 4.2);
    x.save(); x.translate(h[0], h[1]); x.rotate(lerp(.4, -.15, up)); line([0, 6], [0, -20], 2.6); x.fillStyle = '#8f8aa8'; polyPath(x, [[0, -20], [9, -24], [11, -14], [0, -13]]); x.fill(); x.restore();
  }
  function banner(x, tp) {
    const u = easeOut(clamp((tp - K.led - .45) / .5)); if (u <= 0) return;
    const a = womanX(WOMEN[1], tp) + 10, b = womanX(WOMEN[4], tp) - 10, top = -lerp(90, 140, u) * PS, h = 36 * PS;
    x.fillStyle = P.wood; x.fillRect(a - 3, top - 10, 6, -top + 10); x.fillRect(b - 3, top - 10, 6, -top + 10);
    x.fillStyle = '#e8dcc0'; x.fillRect(a, top, b - a, h); x.fillStyle = '#c9b98f'; x.fillRect(a, top + h - 8, b - a, 8);
    x.fillStyle = '#fbf7ee'; const m = (a + b) / 2, y = top + h / 2 - 4;
    polyPath(x, [[m, y], [m + 22, y - 12], [m + 22, y + 12]]); x.fill(); polyPath(x, [[m, y], [m - 22, y - 12], [m - 22, y + 12]]); x.fill(); polyPath(x, [[m - 2, y], [m - 12, y + 30], [m, y + 24], [m + 12, y + 30], [m + 2, y]]); x.fill();
    x.strokeStyle = '#b8ab8c'; x.lineWidth = 2; x.beginPath(); x.moveTo(m, y); x.lineTo(m + 22, y - 12); x.lineTo(m + 22, y + 12); x.closePath(); x.stroke();
  }

  function street(x, tp) {
    const g = x.createLinearGradient(0, -900, 0, 0); g.addColorStop(0, '#05051a'); g.addColorStop(1, '#141238');
    x.fillStyle = g; x.fillRect(WALL, -1400, 4000, 1400); x.fillStyle = P.sheet2; x.fillRect(WALL, 0, 4000, 800);
    for (let k = 0; k < 12; k++) {
      const cx = 810 + k * 186, h = 290 + (k % 3) * 30, door = DOORS.findIndex(d => Math.abs(d - cx) < 1), open = door >= 0 ? easeOut(clamp((tp - OUT[door] + .35) / .3)) : 0;
      x.fillStyle = k % 2 ? P.facade : P.wall; x.fillRect(cx - 88, -h, 176, h);
      polyPath(x, [[cx - 96, -h], [cx, -h - 70], [cx + 96, -h]]); x.fillStyle = P.roof; x.fill();
      x.fillStyle = (k * 7) % 3 ? P.window : '#2a2550'; x.fillRect(cx - 60, -h + 50, 36, 34); x.fillRect(cx + 24, -h + 50, 36, 34);
      x.fillStyle = open > 0 ? hexA(P.window, .9) : P.door; x.fillRect(cx - 24, -150, 48, 150);
      if (open > 0) { x.fillStyle = P.door; x.fillRect(cx + 24 - 48 * (1 - .8 * open), -150, 48 * (1 - .8 * open), 150); }
    }
    x.fillStyle = P.roof; x.fillRect(WALL, -1400, 40, 1170); x.fillRect(WALL, -250, 40, 20);
  }

  const c8 = S8.camera(T8), l8 = Math.log(c8.z);
  const mz = M45 ? .6 : 1, lz = z => Math.log(z * mz);
  const KEYS = [[0, [c8.x, c8.y, l8]], [1.3, [470, -180, lz(1.9)]], [K.part, [1360, -165, lz(1.5)]], [K.forget + .3, [1360, -160, lz(1.7)]], [K.crusade, [1380, -170, lz(1.95)]],
    [K.led, [1380, -175, lz(2.1)]], [K.women + .2, [1360, -190, lz(1.6)]]];
  function camera(t) {
    const v = keyed(t, KEYS), drift = t < .8 ? -.08 * (t - t * t / 1.6) : -.032;
    return { x: v[0], y: v[1], z: Math.exp(v[2] + drift) };
  }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { S8.room(x, T8, { noFamily: true }); street(x, tp); S8.glass(x, T8); walkers(x, tp); }, {});
    FILM.sheet(ctx, cam, 1, W, H, R);
    PR.glow(ctx, S8.GX, S8.TOP - 10, 70 + 90 * S8.fillAt(T8), P.amber, .1 + .14 * S8.fillAt(T8), 'lightbox');
    for (const [lx, ly] of LAMPS) PR.glow(ctx, lx, ly, 120 + 50 * raised(tp), P.glow, .35 + .2 * raised(tp), 'lightbox');
    const spot = smooth((t - K.part) / .7) * (1 - smooth((t - K.women + .3) / .8));
    if (spot > 0) {
      ctx.save(); ctx.fillStyle = hexA('#02020a', .72 * spot); ctx.beginPath(); ctx.rect(-5000, -5000, 12000, 12000);
      ctx.ellipse(1390, -150, lerp(2600, 560, easeOut(clamp((t - K.part) / .7))), lerp(1800, 330, easeOut(clamp((t - K.part) / .7))), 0, 0, TAU); ctx.fill('evenodd'); ctx.restore();
    }
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.movement, K.part, K.crusade, K.led, K.women],
  });
})();
