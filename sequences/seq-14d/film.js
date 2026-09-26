(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, rng } = FILM, PR = FILM.props;
  const ID = 'seq-14d', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S14c = FILM.getScene('seq-14c').api, T0 = S14c.DUR, { MKT, CS } = S14c;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { plenty: 0, people: 0.501, willing: 1.001 };

  const EYES = (() => {
    const g = rng(56), out = [];
    while (out.length < 22) {
      const p = [480 + g() * 900, -640 + g() * 620];
      if (Math.abs(p[1] + 260) < 70 && p[0] < 1000) continue;
      if (out.some(e => Math.hypot(e.p[0] - p[0], e.p[1] - p[1]) < 120)) continue;
      out.push({ p, s: 1.6 + g() * .8, t: K.people - .15 + g() * .75, look: (g() - .5) * 4 });
    }
    return out;
  })();
  function dark(ctx, t) {
    const a = smooth((t - .1) / .6); if (a <= 0) return;
    const x0 = MKT[0] + 240 * CS, g = ctx.createLinearGradient(x0, 0, x0 + 260 * CS, 0); g.addColorStop(0, 'rgba(4,3,14,0)'); g.addColorStop(1, `rgba(4,3,14,${.94 * a})`);
    ctx.fillStyle = g; ctx.fillRect(x0, MKT[1] - 4000 * CS, 8000 * CS, 8000 * CS);
  }
  function eyes(ctx, c, tp, t) {
    FILM.sheet(ctx, c, 1, W, H, R); dark(ctx, t); ctx.save(); ctx.translate(MKT[0], MKT[1]); ctx.scale(CS, CS);
    for (const e of EYES) {
      const u = easeOut(clamp((tp - e.t) / .14), 2); if (u <= 0) continue;
      ctx.save(); ctx.translate(e.p[0], e.p[1]); ctx.scale(e.s, e.s);
      for (const d of [-1, 1]) {
        ctx.fillStyle = '#ffe9c0'; ctx.beginPath(); ctx.ellipse(d * 13, 0, 9, 5 * u, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#0a0a18'; ctx.beginPath(); ctx.arc(d * 13 + e.look, 0, 3 * u, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
    for (const e of EYES) { const u = smooth((tp - e.t) / .3); if (u > 0) PR.glow(ctx, MKT[0] + e.p[0] * CS, MKT[1] + e.p[1] * CS, 40 * CS * e.s, '#ffe0a8', .12 * u, 'lightbox'); }
  }

  const mz = M45 ? .72 : 1, at = (lx, ly, z) => [MKT[0] + lx * CS, MKT[1] + ly * CS, Math.log(z * mz / CS)];
  const V0 = (() => { const c = S14c.camera(T0); return [c.x, c.y, Math.log(c.z)]; })();
  const KEYS = [[0, V0], [K.willing + .1, at(700, -330, 1.5)], [DUR, at(720, -330, 1.48)]];
  function camera(t) {
    const own = keyed(t, KEYS), c = S14c.camera(T0 + t), s = [c.x, c.y, Math.log(c.z)], w = smooth(t / .5);
    const v = own.map((o, i) => lerp(s[i], o, w));
    return { x: v[0], y: v[1], z: Math.exp(v[2]) };
  }

  function draw(ctx, t) {
    const cam = camera(t);
    S14c.draw(ctx, T0 + t, cam, (ctx, c, tp) => eyes(ctx, c, pose(t), t));
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.people, K.willing],
  });
})();
