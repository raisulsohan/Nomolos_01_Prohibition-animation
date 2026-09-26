(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, polyPath } = FILM, PR = FILM.props;
  const ID = 'seq-08', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), P = L.P, pose = L.pose;
  const K = { paycheck: 1.134, vanish: 1.568, glass: 2.335, alcohol: 3.136,
    choice: 5.238, it: 6.139, direct: 6.54, threat: 7.04, survival: 7.741 };
  const hexA = (h, a) => FILM.rgba(FILM.hex(h), a);
  const PS = 1.9, TOP = -78, GX = -30, GH = 20, WIFE = 200;

  const DROPS = [K.paycheck, K.vanish, K.vanish + .4, K.glass, K.glass + .45, K.alcohol, K.alcohol + .5, K.alcohol + 1, K.alcohol + 1.6];
  const fillAt = tp => .18 + .07 * DROPS.filter(d => tp > d + .35).length;
  function glass(x, tp) {
    const f = fillAt(tp), w0 = 7.5, w1 = 9.5, top = TOP - GH;
    x.fillStyle = hexA('#8fa0d8', .28); polyPath(x, [[GX - w0, TOP], [GX + w0, TOP], [GX + w1, top], [GX - w1, top]]); x.fill();
    const lv = lerp(TOP - 1.2, top + 1, f), hw = lerp(w0, w1, (TOP - lv) / GH);
    x.fillStyle = P.amber; polyPath(x, [[GX - w0 + .7, TOP - 1.2], [GX + w0 - .7, TOP - 1.2], [GX + hw - .7, lv], [GX - hw + .7, lv]]); x.fill();
    x.fillStyle = hexA('#fff1c8', .7); x.fillRect(GX - hw + .8, lv - .25, 2 * hw - 1.6, .5);
    x.strokeStyle = hexA(P.rim, .8); x.lineWidth = .45; polyPath(x, [[GX - w0, TOP], [GX + w0, TOP], [GX + w1, top], [GX - w1, top]]); x.stroke();
    for (const d of DROPS) {
      const u = (tp - d) / .28; if (u < 0 || u > 2.2) continue;
      const y = u < 1 ? lerp(TOP - 34, lv - 1, u * u) : lv + (u - 1) * 3, fade = u < 1 ? 1 : 1 - (u - 1) / 1.2;
      x.fillStyle = hexA('#e8c35a', fade); x.beginPath(); x.ellipse(GX + 1.5 * Math.sin(d * 7), y, 2.2, u < 1 ? 2.2 * Math.abs(Math.cos(u * 8)) + .4 : .7, 0, 0, TAU); x.fill();
      if (u > 1 && u < 1.6) { x.strokeStyle = hexA('#fff1c8', 1.6 - u); x.lineWidth = .35; x.beginPath(); x.ellipse(GX, lv, (u - 1) * 9, (u - 1) * 1.6, 0, 0, TAU); x.stroke(); }
    }
  }
  function envelope(x, tp) {
    const tip = easeOut(clamp((tp - .2) / .7)), out = easeIn(clamp((tp - K.choice - .2) / .6));
    if (out >= 1) return;
    x.save(); x.translate(GX + 2 + 60 * out, TOP - 38 - 420 * out); x.rotate(-.2 - .75 * tip);
    x.fillStyle = P.coat; x.fillRect(4, -60, 12, 56);
    x.beginPath(); x.ellipse(8, -3, 7, 5, .3, 0, TAU); x.fill();
    x.fillStyle = '#b8a47a'; x.fillRect(-6, -2, 16, 10); x.fillStyle = '#8f7c55'; polyPath(x, [[-6, -2], [10, -2], [2, 4]]); x.fill();
    x.restore();
  }
  function room(x, tp, o = {}) {
    x.fillStyle = P.wall; x.fillRect(-1200, -1400, 2800, 1400); x.fillStyle = P.sheet2; x.fillRect(-1200, 0, 2800, 800);
    x.fillStyle = hexA(P.window, .5); x.fillRect(-420, -260, 120, 100); x.fillStyle = P.ink; x.fillRect(-362, -260, 4, 100); x.fillRect(-420, -212, 120, 4);
    threat(x, tp);
    if (!o.noFamily) family(x, tp);
    x.fillStyle = P.wood; x.fillRect(-150, TOP, 300, 10); x.fillRect(-140, TOP + 10, 10, -TOP - 10); x.fillRect(130, TOP + 10, 10, -TOP - 10);
  }
  function family(x, tp) {
    const fear = smooth((tp - K.direct) / .3), [wx, wr] = tremble(tp, 11, fear), [cx, cr] = tremble(tp, 23, fear * 1.2);
    const halo = x.createRadialGradient(WIFE - 10, -110, 10, WIFE - 10, -110, 190); halo.addColorStop(0, hexA(P.amber, .34)); halo.addColorStop(1, hexA(P.amber, 0));
    x.fillStyle = halo; x.fillRect(WIFE - 210, -310, 400, 400);
    const hold = { kind: 'woman', coat: '#3a3470', skirt: '#2c2858', skin: '#4a3f70', hat: 'none', hatColor: '#241f48', arms: HUG };
    x.save(); x.translate(WIFE + wx, 0); x.rotate(wr); x.scale(PS, PS); PR.person(x, P, hold); x.restore();
    x.save(); x.translate(WIFE - 22 + cx, 0); x.rotate(cr); x.scale(PS * .62, PS * .62);
    PR.person(x, P, { kind: 'man', coat: '#45407a', trouser: '#2c2858', skin: '#4a3f70', hat: 'none', arms: FACE }); x.restore();
    x.fillStyle = '#4a3f70'; for (const [, , h] of HUG) { x.beginPath(); x.arc(WIFE + wx + h[0] * PS, h[1] * PS, 2.8 * PS, 0, TAU); x.fill(); }
  }
  const HUG = [[[-8, -68], [-17, -55], [-16.5, -43]], [[8, -68], [4, -52], [-6.5, -43]]];
  const FACE = [[[-8, -70], [-14, -58], [-3.5, -83]], [[8, -70], [14, -58], [3.5, -83]]];
  const tremble = (tp, seed, a) => { const k = Math.round(tp * 15); return [a * (FILM.hash(k, seed, 1) - .5) * 3.2, a * (FILM.hash(k, seed, 2) - .5) * .035]; };
  const SH = [WIFE - 20, 30];
  function threat(x, tp) {
    const s = clamp((tp - K.it - .1) / .9), g = easeOut(clamp((tp - K.direct - .1) / 1.2)), top = TOP - GH;
    if (s <= 0) return;
    const p0 = [GX, top], c1 = [GX - 20, top - 160], c2 = [SH[0] - 40, -420], p3 = [SH[0], -260];
    const at = u => [0, 1].map(i => (1 - u) ** 3 * p0[i] + 3 * (1 - u) ** 2 * u * c1[i] + 3 * (1 - u) * u * u * c2[i] + u ** 3 * p3[i]);
    x.strokeStyle = hexA(P.amber, .85 * (1 - .8 * g)); x.lineCap = 'round'; x.lineWidth = lerp(5, 14, s) * (1 - .6 * g);
    x.beginPath(); for (let k = 0; k <= 30; k++) { const q = at(k / 30 * easeOut(s)); k ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); } x.stroke();
    if (g <= 0) return;
    const sc = PS * lerp(.6, 2.3, g), SIL = c => ({ kind: 'man', coat: c, trouser: c, skin: c, hat: 'bowler', hatColor: c });
    x.save(); x.translate(SH[0], SH[1]); x.scale(sc * 1.04, sc * 1.02); x.translate(0, 1); PR.person(x, P, SIL(hexA(P.amber, .55 * g))); x.restore();
    x.save(); x.translate(SH[0], SH[1]); x.scale(sc, sc); PR.person(x, P, SIL('#05041a')); x.restore();
  }

  const mz = M45 ? .75 : 1, BACK = K.survival - .1;
  function camera(t) {
    const u = easeIO(clamp((t - K.it) / (BACK - K.it))), l0 = Math.log(18) + .05 * Math.min(t, K.it);
    const ls = lerp(l0, Math.log(2.4), u) - .08 * Math.max(0, t - BACK);
    return { x: lerp(GX + 2, 110, u), y: lerp(TOP - 12, -190, u), z: Math.exp(ls) * mz };
  }

  function draw(ctx, t, cam = camera(t)) {
    const tp = pose(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { room(x, tp); glass(x, tp); envelope(x, tp); }, {});
    FILM.sheet(ctx, cam, 1, W, H, R);
    const f = fillAt(tp);
    PR.glow(ctx, GX, TOP - 10, 70 + 90 * f, P.amber, .1 + .14 * f, 'lightbox');
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.paycheck, K.alcohol, K.it, K.threat],
    api: { DUR, camera, room, glass, family, fillAt, WIFE, TOP, GX, PS, HUG },
  });
})();
