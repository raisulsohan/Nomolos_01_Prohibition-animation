(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, polyPath } = FILM, PR = FILM.props;
  const ID = 'seq-07', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), P = L.P, pose = L.pose;
  const K = { drunk: 0.767, angry: 1.368, and: 2.302, legal: 4.204, violent: 5.405,
    husband: 5.806, earn: 7.908, money: 8.175, own: 8.742 };
  const hexA = (h, a) => FILM.rgba(FILM.hex(h), a);
  const PS = 1.9, SHADOW = '#05041a';
  const person = (x, px, py, o, s = PS, rot = 0) => { x.save(); x.translate(px, py); x.rotate(rot); x.scale(s, s); PR.person(x, P, o); x.restore(); };
  const HIM = { kind: 'man', coat: P.coat, trouser: P.trouser, skin: P.skin, hat: 'bowler', hatColor: P.cap };
  const SIL = c => ({ kind: 'man', coat: c, trouser: c, skin: c, hat: 'bowler', hatColor: c });

  const LAMP = [170, -300], FAC = [560, 1160, -330], DOOR = [820, 900, -170], WIN = [960, 1060, -215, -135];
  const walkX = tp => lerp(250, 770, easeOut(clamp(tp / (K.angry + .5)), 1.3));
  const sway = tp => .09 * Math.sin(tp * TAU * .8) + .035 * Math.sin(tp * TAU * 2.1 + 1);
  function street(x, tp) {
    x.fillStyle = P.sheet2; x.fillRect(-1200, 0, 3600, 900);
    x.fillStyle = P.facade; x.fillRect(-900, -260, 420, 260); x.fillRect(1260, -290, 520, 290);
    x.fillStyle = P.window; x.fillRect(-800, -190, 60, 50); x.fillRect(1400, -210, 60, 50);
    x.fillStyle = P.wall; x.fillRect(FAC[0], FAC[2], FAC[1] - FAC[0], -FAC[2]);
    polyPath(x, [[FAC[0] - 30, FAC[2]], [(FAC[0] + FAC[1]) / 2, FAC[2] - 150], [FAC[1] + 30, FAC[2]]]); x.fillStyle = P.roof; x.fill();
    x.fillStyle = P.door; x.fillRect(DOOR[0], DOOR[2], DOOR[1] - DOOR[0], -DOOR[2]);
    x.fillStyle = P.window; x.fillRect(WIN[0], WIN[2], WIN[1] - WIN[0], WIN[3] - WIN[2]);
    x.fillStyle = P.ink; x.fillRect((WIN[0] + WIN[1]) / 2 - 2, WIN[2], 4, WIN[3] - WIN[2]); x.fillRect(WIN[0], (WIN[2] + WIN[3]) / 2 - 2, WIN[1] - WIN[0], 4);
    x.fillStyle = P.ink; x.fillRect(LAMP[0] - 5, LAMP[1], 10, -LAMP[1]); x.fillStyle = P.lampGlass; polyPath(x, [[LAMP[0] - 18, LAMP[1]], [LAMP[0] + 18, LAMP[1]], [LAMP[0] + 12, LAMP[1] - 34], [LAMP[0] - 12, LAMP[1] - 34]]); x.fill();
    const mx = walkX(tp), sw = sway(tp), g = smooth((mx - 380) / 300);
    if (g > 0) {
      x.save(); x.beginPath(); x.rect(FAC[0], FAC[2], FAC[1] - FAC[0], -FAC[2]); x.clip();
      x.translate(mx + (mx - LAMP[0]) * .15, 0); x.scale(lerp(1, .9, g), lerp(1.1, 1.45, g));
      person(x, 0, 0, SIL(SHADOW), PS * lerp(1.05, 1.4, g), sw * 1.3); x.restore();
    }
    person(x, mx, 0, HIM, PS, sw);
  }
  const RM = { x0: 2300, x1: 3700, top: -360 }, WIFE = 3000;
  const LIGHT = [[2875, 0], [3125, 0], [3100, -345], [2900, -345]];
  function lockOn(x, d0, d1, u, word) {
    const cx = (d0 + d1) / 2;
    x.fillStyle = P.wood; x.fillRect(d0, -250, d1 - d0, 250); x.fillStyle = P.woodDark; x.fillRect(d0 + 10, -240, d1 - d0 - 20, 60);
    x.fillStyle = P.amber; x.font = '900 34px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(word, cx, -209);
    x.fillStyle = P.lampGlass; x.beginPath(); x.arc(d1 - 16, -120, 5, 0, TAU); x.fill();
    if (u <= 0) return;
    const s = lerp(1.5, 1, easeOut(u)); x.save(); x.globalAlpha = clamp(u * 3); x.translate(cx, -125); x.scale(s, s);
    x.strokeStyle = '#8f8aa8'; x.lineWidth = 7; x.setLineDash([12, 6]);
    x.beginPath(); x.moveTo(-(d1 - d0) / 2 - 6, -60); x.lineTo((d1 - d0) / 2 + 6, 40); x.moveTo((d1 - d0) / 2 + 6, -60); x.lineTo(-(d1 - d0) / 2 - 6, 40); x.stroke(); x.setLineDash([]);
    x.fillStyle = '#b8b2cc'; x.beginPath(); x.roundRect(-20, -4, 40, 34, 5); x.fill(); x.strokeStyle = '#b8b2cc'; x.lineWidth = 6; x.beginPath(); x.arc(0, -4, 13, Math.PI, TAU); x.stroke();
    x.fillStyle = P.ink; x.fillRect(-2.5, 8, 5, 12);
    x.restore();
  }
  function room(x, tp) {
    x.fillStyle = P.wall; x.fillRect(RM.x0, RM.top, RM.x1 - RM.x0, -RM.top); x.fillStyle = P.sheet2; x.fillRect(RM.x0 - 400, 0, 1600, 600);
    x.fillStyle = P.roof; x.fillRect(RM.x0 - 400, RM.top - 1000, RM.x1 - RM.x0 + 800, 1000);
    const open = smooth((tp - K.and - .3) / .6);
    x.save(); polyPath(x, LIGHT); x.clip();
    x.fillStyle = hexA(P.lampGlass, .3 * open); x.fillRect(2800, -360, 400, 370);
    const rise = easeOut(clamp((tp - K.violent + .45) / 1.3));
    if (rise > 0) person(x, WIFE + 15, 90 - 70 * rise, SIL(SHADOW), PS * lerp(1.2, 1.85, rise), sway(tp) * .8);
    x.restore();
    lockOn(x, 2650, 2790, clamp((tp - K.legal - .15) / .25), 'LAW');
    lockOn(x, 3210, 3350, clamp((tp - K.earn - .1) / .25), 'WORK');
    const fear = smooth((tp - K.violent + .25) / .25), [jx, jr] = tremble(tp, 7, fear);
    person(x, WIFE + jx, 30, { kind: 'woman', coat: P.coat2, skirt: P.coat, skin: P.skin, hat: 'none', hatColor: P.coat, arms: fear > 0 ? armsTo(fear, HEAD) : undefined }, PS * 1.08, jr);
  }
  const REST = [[[-8, -68], [-9.5, -57.5], [-11, -47]], [[8, -68], [9.5, -57.5], [11, -47]]];
  const HEAD = [[[-8, -68], [-16, -77], [-7, -87]], [[8, -68], [16, -77], [7, -87]]];
  const armsTo = (u, to) => REST.map((a, i) => a.map((p, j) => [lerp(p[0], to[i][j][0], u), lerp(p[1], to[i][j][1], u)]));
  const tremble = (tp, seed, a) => { const k = Math.round(tp * 15); return [a * (FILM.hash(k, seed, 1) - .5) * 3.2, a * (FILM.hash(k, seed, 2) - .5) * .035]; };

  const T_IN = 2.536 - .05;
  const DIVE = K.angry + .5;
  const OUT = [[0, [560, -180, Math.log(1.15)]], [DIVE, [800, -175, Math.log(1.55)]], [T_IN, [(WIN[0] + WIN[1]) / 2, (WIN[2] + WIN[3]) / 2, Math.log(22)]]];
  const IN = M45 ? [[T_IN, [WIFE, -165, Math.log(1.1)]], [K.own + .2, [WIFE, -175, Math.log(1.32)]]] : [[T_IN, [WIFE, -165, Math.log(1.8)]], [K.own + .2, [WIFE, -175, Math.log(2.25)]]];
  function camera(t) {
    const inside = t >= T_IN;
    const v = FILM.keyed(t, inside ? IN : OUT, false, !inside && t > DIVE ? u => easeIn(u, 3) : easeIO);
    return { x: v[0], y: v[1], z: Math.exp(v[2]) * (M45 && !inside ? .88 : 1) };
  }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    if (t < T_IN) {
      L.sheet(ctx, cam, 1, R, x => street(x, tp), {});
      FILM.sheet(ctx, cam, 1, W, H, R);
      PR.glow(ctx, LAMP[0], LAMP[1] - 17, 420, P.glow, .5, 'lightbox'); PR.glow(ctx, (WIN[0] + WIN[1]) / 2, (WIN[2] + WIN[3]) / 2, 160, P.window, .45, 'lightbox');
      const f = smooth((t - (T_IN - .3)) / .3);
      if (f > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = hexA(P.window, f); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    } else {
      L.sheet(ctx, cam, 1, R, x => room(x, tp), {});
      FILM.sheet(ctx, cam, 1, W, H, R);
      PR.glow(ctx, WIFE, -150, 360, P.glow, .22 * smooth((tp - K.and - .3) / .6), 'lightbox');
      const haze = 1 - smooth((t - T_IN) / .4);
      if (haze > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = hexA(P.window, haze); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    }
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.angry, T_IN, K.legal, K.violent, K.earn],
  });
})();
