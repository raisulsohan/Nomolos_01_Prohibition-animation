(() => {
  'use strict';
  const { TAU, keyed, smooth, easeOut, easeIn, easeOutBack, env, clamp, lerp, cutPoly, polyPath, rng, noise1 } = FILM, PR = FILM.props;
  const ID = 'seq-01', { W, H, id: FMT } = FILM.format(), R = [W / 2, H / 2];
  const LAY = FMT === '4x5' ? {
    page: [[70, 62], [1012, 72], [1008, 1292], [66, 1282]], date: [540, 190], blot: { x: 540, y: 565, r: 190 },
    slots: { a: [300, 905], b: [780, 905], del: [540, 1092] }, hover: [1010, 600], enterX: 1500, exitTo: [1400, -250],
    scrub: [[720, 380], [380, 440], [720, 540], [370, 630], [710, 720], [400, 770]], pool: [540, 740], cam: [[540, 675], [545, 690]],
  } : {
    page: [[150, 58], [1770, 72], [1766, 1046], [146, 1032]], date: [960, 200], blot: { x: 1160, y: 600, r: 215 },
    slots: { a: [540, 420], b: [540, 600], del: [540, 790] }, hover: [1600, 690], enterX: 2350, exitTo: [2300, -250],
    scrub: [[1440, 340], [960, 410], [1420, 530], [940, 630], [1400, 740], [980, 860]], pool: [880, 590], cam: [[960, 540], [1010, 560]],
  };
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;

  const K = {
    y1920: 0.233,
    cardA: C.s('S002').t0, reduce: 4.17, reduceEnd: 4.671,
    cardB: C.s('S003').t0, manage: 5.872, manageEnd: 6.373,
    del: 7.14,
  };
  K.sweep = [K.del + .06, K.del + .72];
  K.exit = [K.sweep[1], K.sweep[1] + .3];

  const PAGE = cutPoly(LAY.page, 9, 1.6, 5);
  const BLOT = LAY.blot;
  const DROPS = Array.from({ length: 8 }, (_, i) => { const r = rng(60 + i * 11), a = r() * TAU, d = 1.15 + r() * .25; return [Math.cos(a) * d, Math.sin(a) * d * .9, .03 + r() * .07]; });
  const beat = t => { const ph = (t * .85) % 1; return Math.exp(-ph * ph * 140) + .6 * Math.exp(-(ph - .2) * (ph - .2) * 140); };
  const grow = t => lerp(.84, 1, smooth(t / DUR));
  function blot(x, t) {
    const g = grow(t), pts = [];
    for (let i = 0; i < 140; i++) {
      const a = i / 140 * TAU, n = noise1(a * 1.9 + 3, 11) * .16 + noise1(a * 5.3, 12) * .07 + Math.sin(t * 1.6 + a * 2) * .025;
      const spike = Math.max(0, noise1(a * 9, 13) - .5) * 1.1;
      const r = BLOT.r * g * (1 + n + spike);
      pts.push([BLOT.x + Math.cos(a) * r, BLOT.y + Math.sin(a) * r * .9]);
    }
    x.fillStyle = '#1c1612'; polyPath(x, pts); x.fill();
    for (const [dx, dy, s] of DROPS) { x.beginPath(); x.arc(BLOT.x + dx * BLOT.r * g, BLOT.y + dy * BLOT.r * g, s * BLOT.r, 0, TAU); x.fill(); }
    x.save(); x.globalCompositeOperation = 'source-atop';
    const gl = x.createRadialGradient(BLOT.x, BLOT.y, 0, BLOT.x, BLOT.y, BLOT.r * g * .9);
    gl.addColorStop(0, `rgba(227,158,55,${.28 + .3 * beat(t)})`); gl.addColorStop(1, 'rgba(227,158,55,0)');
    x.fillStyle = gl; x.fillRect(BLOT.x - 300, BLOT.y - 300, 600, 600); x.restore();
  }
  const CARD = { w: 420, h: 128, font: '900 82px NSC' };
  const SLOTS = LAY.slots;
  let INK_DEL = null;

  const HOVER = LAY.hover, ROT = -.28, EW = 400;
  const SCRUB = LAY.scrub;
  const along = (pts, u) => {
    const n = pts.length - 1, s = clamp(u) * n, i = Math.min(n - 1, Math.floor(s)), f = s - i;
    return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
  };
  const CRUMBS = Array.from({ length: 24 }, (_, i) => { const r = rng(900 + i * 17); return { u: r(), dx: (r() - .5) * 120, dy: (r() - .5) * 70, s: 4 + r() * 6, a: r() * TAU, fall: 18 + r() * 30, dark: r() < .4 }; });

  function camera(t) {
    const k = smooth(t / DUR);
    const [a, b] = LAY.cam;
    return { x: lerp(a[0], b[0], k), y: lerp(a[1], b[1], k), z: Math.pow(1.075, k) };
  }
  function shake(t) {
    const d = t - K.del; if (d < 0 || d > .35) return [0, 0];
    const a = 6 * Math.exp(-d * 14); return [a * Math.sin(d * 70), a * .6 * Math.sin(d * 53 + 1)];
  }

  function draw(ctx, t) {
    const cam = camera(t), sh = shake(t), tp = pose(t);
    const erase = clamp((tp - K.sweep[0]) / (K.sweep[1] - K.sweep[0]));
    L.background(ctx);

    L.sheet(ctx, cam, .98, R, x => {
      polyPath(x, PAGE); x.fillStyle = P.sheet; x.fill();
      const a1920 = env(t, K.y1920 - .1, K.y1920 + .35);
      if (a1920 > 0) { x.save(); x.globalAlpha = a1920; x.fillStyle = P.ink; x.font = '900 150px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('1920', LAY.date[0], LAY.date[1] + (1 - easeOut(clamp((t - K.y1920 + .1) / .45))) * 14); x.restore(); }
      if (erase > 0) {
        const g = x.createRadialGradient(BLOT.x, BLOT.y, 20, BLOT.x, BLOT.y, BLOT.r * 1.35);
        g.addColorStop(0, `rgba(70,60,52,${.2 * erase})`); g.addColorStop(1, 'rgba(70,60,52,0)');
        x.fillStyle = g; x.fillRect(BLOT.x - 320, BLOT.y - 320, 640, 640);
      }
      if (INK_DEL && tp >= K.del) {
        const k = 1 + .22 * (1 - easeOut(clamp((tp - K.del) / .14)));
        x.save(); x.translate(SLOTS.del[0], SLOTS.del[1]); x.rotate(-.05); x.scale(k, k); x.globalCompositeOperation = 'multiply';
        x.drawImage(INK_DEL, -215, -75, 430, 150); x.restore();
      }
    }, { shake: sh, paperShadow: [4, 6, 6, .3] });

    const cardIn = (t0) => clamp((tp - t0) / .3);
    if (tp >= K.cardA) L.sheet(ctx, cam, 1, R, x => {
      for (const [slot, t0, s0, s1, word, id] of [[SLOTS.a, K.cardA, K.reduce, K.reduceEnd, 'REDUCE', 1], [SLOTS.b, K.cardB, K.manage, K.manageEnd, 'MANAGE', 2]]) {
        if (tp < t0) continue;
        const k = easeOutBack(cardIn(t0), 1.2), b = L.boil(t, id);
        x.save(); x.translate(slot[0] + b[0], slot[1] - (1 - k) * 70 + b[1]); x.rotate((id === 1 ? -.03 : .025) + (1 - k) * .12 + b[2]);
        PR.card(x, P, word, CARD.w, CARD.h, CARD.font, clamp((tp - s0 - .05) / (s1 - s0 + .1)));
        x.restore();
      }
    }, { shake: sh });

    if (erase < 1) L.sheet(ctx, cam, 1, R, x => {
      blot(x, t);
      if (erase > 0) {
        x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000';
        const n = Math.ceil(erase * 60);
        for (let i = 0; i <= n; i++) { const [px, py] = along(SCRUB, erase * i / Math.max(1, n)); x.save(); x.translate(px, py); x.rotate(ROT); x.fillRect(-EW / 2 - 10, -EW * .3, EW * .75, EW * .6); x.restore(); }
        x.restore();
      }
    }, { shake: sh, shadow: false, rim: false, fibre: .6 });
    if (erase > 0) L.sheet(ctx, cam, 1.02, R, x => {
      for (const c of CRUMBS) {
        if (c.u > erase) continue;
        const born = K.sweep[0] + c.u * (K.sweep[1] - K.sweep[0]), [px, py] = along(SCRUB, c.u);
        const f = easeOut(clamp((tp - born) / .3));
        x.save(); x.translate(px - EW * .3 + c.dx, py + c.dy + f * c.fall); x.rotate(c.a); x.fillStyle = c.dark ? '#4e4540' : '#857870';
        x.beginPath(); x.ellipse(0, 0, c.s, c.s * .45, 0, 0, TAU); x.fill(); x.restore();
      }
    }, { shake: sh, rim: false, paperShadow: [2, 3, 2, .3] });

    const inK = easeOut(clamp((tp - .9) / 2.2), 2);
    if (tp < K.exit[1]) L.sheet(ctx, cam, 1.06, R, x => {
      let [ex, ey] = [lerp(LAY.enterX, HOVER[0], inK), HOVER[1] + Math.sin(t * 1.7) * 8];
      let rot = ROT, lift = 1;
      if (tp >= K.sweep[0] - .12 && tp < K.sweep[0]) { ey -= 30 * smooth((tp - K.sweep[0] + .12) / .12); }
      if (tp >= K.sweep[0]) {
        const [sx, sy] = along(SCRUB, erase);
        const k0 = smooth(clamp((tp - K.sweep[0]) / .08));
        ex = lerp(HOVER[0], sx, k0); ey = lerp(HOVER[1] - 30, sy, k0); rot = ROT + Math.sin(erase * 18) * .05;
      }
      if (tp >= K.exit[0]) { const k = easeIn(clamp((tp - K.exit[0]) / (K.exit[1] - K.exit[0])), 2); ex = lerp(ex, LAY.exitTo[0], k); ey = lerp(ey, LAY.exitTo[1], k); lift = 1 + .25 * k; }
      const b = L.boil(t, 9, .6);
      x.save(); x.translate(ex + b[0], ey + b[1]); x.rotate(rot + b[2]); x.scale(lift, lift); PR.eraser(x, P, EW); x.restore();
    }, { shake: sh, paperShadow: [10, 16, 10, .32] });

    const lamp = smooth((t - .1) / 2.2), s0 = cam.z;
    const px = W / 2 + s0 * (LAY.pool[0] - cam.x), py = H / 2 + s0 * (LAY.pool[1] - cam.y);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dk = ctx.createRadialGradient(px, py, 80, px, py, 1250);
    dk.addColorStop(0, `rgba(10,7,4,${1 - lamp})`); dk.addColorStop(.45, `rgba(10,7,4,${lerp(1, .42, lamp)})`); dk.addColorStop(1, `rgba(10,7,4,${lerp(1, .9, lamp)})`);
    ctx.fillStyle = dk; ctx.fillRect(0, 0, W, H); ctx.restore();
    FILM.sheet(ctx, cam, 1, W, H, R, sh);
    const alive = (.22 + .38 * beat(t)) * (1 - erase) * smooth((t - .4) / 1.2);
    const after = smooth((t - K.exit[0] - .05) / .2) * (.1 + .34 * (1 - smooth((t - K.exit[1]) / (DUR - .12 - K.exit[1]))));
    PR.glow(ctx, BLOT.x, BLOT.y, 170 * grow(t), P.amber, alive + after, 'lightbox');
    L.grade(ctx, t);
    const black = 1 - smooth(t / .35);
    if (black > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(0,0,0,${black})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }

  const ready = FILM.fonts('NSC').then(() => { INK_DEL = PR.inkSprite('DELETE', 380, 132, P.red, 'NSC', 31); });
  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready, grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.y1920, K.reduce, K.manage, K.del],
  });
})();
