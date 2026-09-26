(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, rng, hash } = FILM, PR = FILM.props;
  const ID = 'seq-12', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { january: 0.234, year: 0.968, they: 1.936, won: 2.336 };

  const CAL = { x: 960, y: 330, w: 380, h: 460 };
  function calPage(x, month, year) {
    x.fillStyle = '#efe5cf'; x.fillRect(-CAL.w / 2, -CAL.h / 2, CAL.w, CAL.h);
    x.fillStyle = P.red; x.fillRect(-CAL.w / 2, -CAL.h / 2, CAL.w, 64);
    x.fillStyle = '#f6ecd5'; x.font = '900 46px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(month, 0, -CAL.h / 2 + 34);
    x.fillStyle = P.ink; x.font = '900 150px NSC'; x.fillText(String(year), 0, -30);
    x.strokeStyle = 'rgba(44,40,36,.35)'; x.lineWidth = 1.5;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) x.strokeRect(-150 + c * 76, 70 + r * 44, 66, 36);
  }
  function calendar(x, tp) {
    x.save(); x.translate(CAL.x, CAL.y);
    x.fillStyle = '#7d6a55'; x.fillRect(-CAL.w / 2 - 4, -CAL.h / 2 + 8, CAL.w + 8, CAL.h + 6);
    const pop = 1 + .05 * Math.exp(-Math.pow((tp - K.year - .1) / .12, 2));
    x.save(); x.scale(pop, pop); calPage(x, 'JANUARY', 1920); x.restore();
    if (tp < K.january) calPage(x, 'DECEMBER', 1919);
    x.fillStyle = '#2a2420'; x.fillRect(-CAL.w / 2 - 8, -CAL.h / 2 - 16, CAL.w + 16, 26);
    for (const rx of [-110, 110]) { x.fillStyle = '#8a8a86'; x.beginPath(); x.arc(rx, -CAL.h / 2 - 3, 9, 0, TAU); x.fill(); }
    x.restore();
  }
  function flyingPage(x, tp) {
    const u = (tp - K.january) / .55; if (u <= 0 || u >= 1) return;
    const e = easeOut(u, 2);
    x.save(); x.translate(CAL.x - 300 * e, CAL.y - 560 * e); x.rotate(-1.3 * e); x.scale(1 + .2 * e, 1 - .4 * e);
    x.globalAlpha = 1 - easeIn(u, 3); calPage(x, 'DECEMBER', 1919); x.restore();
  }
  function wall(x) {
    x.fillStyle = P.wall; x.fillRect(-1400, -900, 4700, 2600);
    x.fillStyle = 'rgba(154,82,56,.08)'; for (let px = -1380; px < 3300; px += 90) x.fillRect(px, -900, 34, 1600);
    x.fillStyle = P.woodDark; x.fillRect(-1400, 20, 4700, 16); x.fillStyle = P.wood; x.fillRect(-1400, 700, 4700, 900); x.fillStyle = P.woodDark; x.fillRect(-1400, 700, 4700, 18);
  }

  const COATS = ['#4d5b68', '#8a6044', '#5b7079', '#6b5a7a', '#7a4f3a', '#56604a'], SKIRTS = ['#3a3a40', '#4a3a30', '#3d4a52', '#463a52'];
  const ROWS = [{ y: 1150, s: 4.2, n: 8, dark: .3, seed: 3 }, { y: 1300, s: 5, n: 7, dark: .15, seed: 7 }, { y: 1480, s: 6, n: 5, dark: 0, seed: 11 }];
  const CROWD = ROWS.map(r => { const g = rng(r.seed); return Array.from({ length: r.n }, (_, i) => ({ x: -260 + (i + .5) * 2440 / r.n + (g() - .5) * 90, woman: g() < .8, coat: COATS[(g() * 6) | 0], skirt: SKIRTS[(g() * 4) | 0], hair: g() < .5 ? '#3a3a40' : '#5a3e2c', one: g() < .3, lag: g() * .15, ph: g() * TAU })); });
  const UP = [[[-8, -68], [-17, -88], [-20, -110]], [[8, -68], [17, -88], [20, -110]]];
  function crowd(x, tp) {
    ROWS.forEach((r, ri) => CROWD[ri].forEach((p, i) => {
      const up = easeOut(clamp((tp - K.won + .1 - p.lag) / .25), 2), bob = up > 0 ? Math.abs(Math.sin((tp - K.won) * 7 + p.ph)) * 5 * up : 0;
      const arms = p.one ? null : UP.map(a => a.map(([ax, ay], k) => k ? [lerp(ax * .6, ax, up), lerp(-40 - 8 * k, ay, up)] : [ax, ay]));
      x.save(); x.translate(p.x, r.y - bob); x.scale(r.s, r.s);
      PR.person(x, P, { kind: p.woman ? 'woman' : 'man', coat: p.coat, skirt: p.skirt, trouser: p.skirt, hat: p.woman ? 'none' : 'bowler', hatColor: p.hair, ribbon: true, dark: r.dark, arm: p.one ? up : 0, arms: up > 0 ? arms : null, look: .4 * up });
      x.restore();
    }));
  }
  const RIBBONS = (() => { const g = rng(21); return Array.from({ length: 46 }, () => ({ x: -150 + g() * 2200, y0: -150 - g() * 650, v: 650 + g() * 300, sw: 20 + g() * 30, ph: g() * TAU, s: .55 + g() * .4, spin: (g() - .5) * 5 })); })();
  function bow(x) {
    x.fillStyle = '#fbf7ee';
    x.beginPath(); x.moveTo(0, 0); x.lineTo(-40, -24); x.lineTo(-36, 20); x.fill(); x.beginPath(); x.moveTo(0, 0); x.lineTo(40, -24); x.lineTo(36, 20); x.fill();
    x.beginPath(); x.moveTo(-4, 0); x.lineTo(-22, 56); x.lineTo(-12, 50); x.lineTo(-5, 62); x.lineTo(6, 2); x.fill();
    x.beginPath(); x.moveTo(4, 0); x.lineTo(20, 52); x.lineTo(10, 47); x.lineTo(3, 58); x.lineTo(-4, 2); x.fill();
    x.fillStyle = '#e6dfcf'; x.beginPath(); x.arc(0, 0, 8, 0, TAU); x.fill();
  }
  function rain(x, tp) {
    const t0 = K.won - .25; if (tp < t0) return;
    for (const r of RIBBONS) {
      const u = tp - t0, y = r.y0 + r.v * u; if (y > 1500) continue;
      x.save(); x.translate(r.x + Math.sin(u * 3 + r.ph) * r.sw, y); x.rotate(Math.sin(u * 2.4 + r.ph) * .6 + r.spin * u * .2); x.scale(r.s, r.s * (.75 + .25 * Math.cos(u * 5 + r.ph))); bow(x); x.restore();
    }
  }

  const Z = M45 ? [1.7, .85] : [2.1, 1.02], CY = M45 ? 640 : 560;
  const KEYS = [[0, [960, 330, Math.log(Z[0])]], [K.year + .3, [960, 332, Math.log(Z[0] * 1.04)]], [K.they - .15, [960, 332, Math.log(Z[0] * 1.05)]], [K.won + .55, [960, CY, Math.log(Z[1])]], [DUR, [960, CY, Math.log(Z[1] * .99)]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { wall(x); calendar(x, tp); }, { paperShadow: [5, 7, 5, .3] });
    L.sheet(ctx, cam, 1, R, x => flyingPage(x, tp), { paperShadow: [14, 18, 8, .3] });
    L.sheet(ctx, cam, 1.12, R, x => crowd(x, tp), { paperShadow: [6, 8, 6, .35] });
    L.sheet(ctx, cam, 1.2, R, x => rain(x, tp), { paperShadow: [10, 14, 6, .25] });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.january, K.year, K.won],
  });
})();
