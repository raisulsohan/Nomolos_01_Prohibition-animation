(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, rng } = FILM, PR = FILM.props;
  const ID = 'seq-30', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { died: 0.701, historians: 1.668, ten: 5.038, people: 5.839, policy: 6.974,
    protect: 7.674, killing: 9.276, enforce: 10.644 };
  const WALL = 520;

  const CANDLES = (() => {
    const g = rng(99), out = [];
    for (let r = 0; r < 11; r++) {
      const v = r / 10, y = WALL + 30 + 610 * Math.pow(v, 1.35), s = .35 + .95 * v, dx = 115 * s;
      for (let x = -500 + (r % 2) * dx / 2; x < 2420; x += dx) out.push({ x: x + (g() - .5) * dx * .4, y: y + (g() - .5) * 8 * s, s, ph: g() * TAU, k: g() });
    }
    const score = c => c.k * .75 + .25 * Math.min(1, Math.hypot(c.x - 960, (c.y - 1000) * 2) / 900);
    const sorted = [...out].sort((a, b) => score(b) - score(a)), n = sorted.length, keep = Math.round(n * .07);
    const F = [[0, .15], [.1, K.died], [.5, K.ten - 1.1], [.8, K.ten + .5], [1, K.policy + .3]];
    const tAt = f => { for (let i = 1; i < F.length; i++) if (f <= F[i][0]) return lerp(F[i - 1][1], F[i][1], (f - F[i - 1][0]) / (F[i][0] - F[i - 1][0])); return F[F.length - 1][1]; };
    sorted.forEach((c, i) => { c.out = i < n - keep ? tAt(i / (n - keep)) : Infinity; });
    return out;
  })();
  function candles(x, t, tp) {
    for (const c of CANDLES) {
      const s = c.s, lit = 1 - smooth((t - c.out) / .25), fade = smooth(t / .35);
      x.fillStyle = '#4a4258'; x.fillRect(c.x - 5 * s, c.y - 26 * s, 10 * s, 26 * s);
      if (lit > 0) { const fl = 1 + .12 * Math.sin(tp * 9 + c.ph); x.fillStyle = `rgba(255,190,90,${lit * fade})`; x.beginPath(); x.ellipse(c.x, c.y - 33 * s, 4.5 * s * lit, 9 * s * lit * fl, 0, 0, TAU); x.fill();
        x.fillStyle = `rgba(255,240,200,${lit * fade})`; x.beginPath(); x.ellipse(c.x, c.y - 31 * s, 2 * s * lit, 4 * s * lit, 0, 0, TAU); x.fill(); }
      const age = t - c.out; if (age > 0 && age < 1.4) {
        x.strokeStyle = `rgba(190,180,200,${.45 * (1 - age / 1.4)})`; x.lineWidth = 1.6 * s; x.lineCap = 'round'; x.beginPath(); x.moveTo(c.x, c.y - 30 * s);
        for (let k = 1; k <= 6; k++) x.lineTo(c.x + 5 * s * Math.sin(k * 1.3 + age * 3 + c.ph), c.y - 30 * s - k * 9 * s * (.4 + age)); x.stroke();
      }
    }
  }
  const litFrac = t => CANDLES.reduce((a, c) => a + (t < c.out ? 1 : 0), 0) / CANDLES.length;

  const SH = [960, 330], SHH = 300;
  const rise = t => easeOut(clamp((t - K.policy + .05) / .9), 2.4);
  const morph = t => smooth((t - K.killing + .05) / .7);
  function shieldPath(x, s) { x.beginPath(); x.moveTo(-130 * s, -150 * s); x.lineTo(130 * s, -150 * s); x.bezierCurveTo(130 * s, 10 * s, 90 * s, 100 * s, 0, 150 * s); x.bezierCurveTo(-90 * s, 100 * s, -130 * s, 10 * s, -130 * s, -150 * s); x.closePath(); }
  function wall(x, t) {
    x.fillStyle = '#100e2a'; x.fillRect(-1200, -1600, 4400, WALL + 1600); x.fillStyle = '#0a0918'; x.fillRect(-1200, WALL, 4400, 1400);
    x.fillStyle = 'rgba(46,42,110,.35)'; for (let y = -1600; y < WALL; y += 70) x.fillRect(-1200, y, 4400, 3);
    const u = rise(t); if (u <= 0) return;
    const wl = x.createRadialGradient(960, 300, 50, 960, 300, 950); wl.addColorStop(0, `rgba(255,190,120,${.3 * u})`); wl.addColorStop(1, 'rgba(255,190,120,0)');
    x.fillStyle = wl; x.fillRect(-1200, -1600, 4400, WALL + 1600);
    const m = morph(t), cy = lerp(700, 60, u), sc = 1.6;
    x.save(); x.translate(SH[0], cy); x.fillStyle = `rgba(3,2,10,${.75 * (1 - m)})`; shieldPath(x, sc); x.fill(); x.restore();
    if (m > 0) {
      x.save(); x.translate(SH[0], cy); x.scale(1.5 * (.9 + .1 * m), 1.5 * (.9 + .1 * m)); x.fillStyle = `rgba(3,2,10,${.8 * m})`;
      x.beginPath(); x.arc(0, -30, 120, 0, TAU); x.roundRect(-70, 40, 140, 90, 18);
      x.moveTo(-14, -20); x.ellipse(-44, -20, 30, 36, .15, 0, TAU, true); x.moveTo(74, -20); x.ellipse(44, -20, 30, 36, -.15, 0, TAU, true);
      x.moveTo(0, 26); x.lineTo(-16, 58); x.lineTo(16, 58); x.closePath();
      for (let k = -2; k <= 2; k++) { x.moveTo(k * 24 - 4, 96); x.lineTo(k * 24 - 4, 126); x.lineTo(k * 24 + 4, 126); x.lineTo(k * 24 + 4, 96); x.closePath(); }
      x.fill();
      x.restore();
    }
  }
  function shield(x, t) {
    const u = rise(t); if (u <= 0) return; const cy = lerp(1100, SH[1], u);
    const grip = [SH[0] + 148, cy + 50];
    x.strokeStyle = '#2a2f52'; x.lineWidth = 92; x.lineCap = 'butt'; x.beginPath(); x.moveTo(1460, cy + 900); x.lineTo(grip[0] + 30, grip[1] + 80); x.stroke();
    x.save(); x.translate(grip[0] + 34, grip[1] + 86); x.rotate(Math.atan2(-(grip[1] + 80 - cy - 900), grip[0] + 30 - 1460) + Math.PI / 2);
    x.fillStyle = '#e8e4ec'; x.fillRect(-48, -10, 96, 28); x.fillStyle = '#c8a040'; x.beginPath(); x.arc(26, 4, 8, 0, TAU); x.fill(); x.restore();
    x.save(); x.translate(SH[0], cy); x.scale(1.25, 1.25);
    const g = x.createLinearGradient(0, -150, 0, 150); g.addColorStop(0, '#8c8aa6'); g.addColorStop(1, '#e6dccb');
    x.fillStyle = g; shieldPath(x, 1); x.fill(); x.fillStyle = '#3a3860'; shieldPath(x, .88); x.fill(); x.fillStyle = g; shieldPath(x, .8); x.fill();
    x.fillStyle = '#1a1830'; x.font = '900 52px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('PROTECT', 0, -62);
    x.fillStyle = '#3a3860'; x.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 16 : 38; x.lineTo(r * Math.cos(a), 20 + r * Math.sin(a)); } x.fill();
    x.restore();
    x.fillStyle = '#d8b08a'; for (let k = 0; k < 4; k++) { x.beginPath(); x.roundRect(grip[0] - 12, grip[1] - 44 + k * 26, 36, 22, 10); x.fill(); }
  }

  const KEYS = [[0, [960, 760, 1.05]], [K.died + .3, [960, 760, 1.05]], [K.ten - .3, [960, 740, .95]], [K.policy - .1, [960, 720, .95]], [K.protect + .2, [960, 380, 1.0]],
    [K.killing, [960, 340, 1.0]], [DUR, [960, 320, 1.03]]].map(([t, v]) => [t, [v[0], v[1], Math.log(v[2] * (M45 ? .9 : 1))]]);
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  function count(ctx, t) {
    const a = smooth((t - K.historians + .2) / .3) * (1 - smooth((t - K.policy - .2) / .4)); if (a <= 0) return;
    const u = clamp((t - K.historians) / (K.ten + .45 - K.historians)), n = Math.floor(10000 * easeIO(u) / 100) * 100;
    const txt = u >= 1 ? '10,000+' : n.toLocaleString('en-US');
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 140 : 150}px NSC`;
    ctx.shadowColor = 'rgba(255,174,74,.45)'; ctx.shadowBlur = 30; ctx.fillStyle = '#ffe3b0'; ctx.fillText(txt, W / 2, M45 ? 230 : 170); ctx.restore();
  }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t), lf = litFrac(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { wall(x, t); candles(x, t, tp); shield(x, t); }, { glow: .45, glowBlur: 12 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    PR.glow(ctx, 960, 900, 1300, '#ffb870', .35 * lf * smooth(t / .4), 'lightbox');
    PR.glow(ctx, 960, 760, 520, '#ffcf80', .3 * rise(t), 'lightbox');
    for (const c of CANDLES) { const lit = 1 - smooth((t - c.out) / .25); if (lit > 0) PR.glow(ctx, c.x, c.y - 33 * c.s, 34 * c.s, '#ffb45a', .6 * lit * smooth(t / .35), 'lightbox'); }
    count(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.died, K.ten, K.protect, K.killing],
  });
})();
