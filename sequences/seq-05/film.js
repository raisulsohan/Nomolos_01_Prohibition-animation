(() => {
  'use strict';
  const { TAU, keyed, smooth, easeOut, easeIn, easeIO, easeOutBack, env, clamp, lerp, polyPath, rng, hash, noise1, cutPoly } = FILM, PR = FILM.props;
  const ID = 'seq-05', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const LP = FILM.look('paper', W, H), LB = FILM.look('lightbox', W, H), P = LP.P, B = LB.P, pose = LP.pose;

  const K = {
    thirteen: 0, later: 0.868, gave: 2.57,
    tore: 3.871, constitution: 6.04, s14: C.s('S014').t0,
    built: 9.61, powerful: 10.21, empire: 11.245, nation: 11.879, seen: 12.68,
  };
  K.tears = Array.from({ length: 13 }, (_, i) => lerp(K.thirteen + .12, K.later + .45, 1 - Math.pow(1 - i / 12, 1.5)));
  K.pan = [K.tears[12] + .25, K.gave + .55];
  K.tear = [K.tore - .05, K.tore + .65]; K.lift = [K.tear[1], K.constitution - .05];
  K.dissolve = [K.s14, K.s14 + 1.4];
  K.fall = [K.s14, K.empire + .2];
  K.rise = [K.built - .75, K.built + .75];
  K.lights = [K.powerful - .2, K.empire + .5];
  K.window = K.nation - .1; K.ember = K.seen;

  const CAL = { x: 560, y: 560, w: 380, h: 460 }, DOC = { x: 1400, y: 560, w: 760, h: 940 };
  const BAND = { y0: 60, y1: 190 };
  const EDGE = (seed, y) => Array.from({ length: 41 }, (_, i) => [-DOC.w / 2 - 10 + i * (DOC.w + 20) / 40, y + (hash(i, seed) - .5) * 14 + noise1(i * .5, seed) * 5]);
  const TOP = EDGE(3, BAND.y0), BOT = EDGE(4, BAND.y1);
  const STRIP_W = DOC.w + 20, STRIP_H = BAND.y1 - BAND.y0, LIFT_S = 1.15, LIFT_Y = 70;
  const HAND = (() => { const r = rng(41), out = []; for (let c = 0; c < 2; c++) for (let i = 0; i < 11; i++) out.push({ x0: -320 + c * 330 + r() * 10, x1: -320 + c * 330 + 280 + r() * 20 - (i === 10 ? 120 : 0), y: -290 + i * 27, seed: c * 40 + i, amp: 3 + r() * 2 }); return out; })();
  const INK = '#3a2818';
  const handLine = (x, l) => { x.beginPath(); for (let px = l.x0; px <= l.x1; px += 3) { const u = (px - l.x0) / 9, y = l.y + Math.sin(u * 2.1) * l.amp * .7 + noise1(u * .9, l.seed) * l.amp; px === l.x0 ? x.moveTo(px, y) : x.lineTo(px, y); } x.stroke(); };
  function xviii(x) {
    x.strokeStyle = INK; x.lineCap = 'round'; x.lineWidth = 15;
    const y0 = BAND.y0 + 22, y1 = BAND.y1 - 22, X = [[-186, 0], [-96, 0]];
    const strokes = [[[-190, y0], [-100, y1]], [[-100, y0], [-190, y1]], [[-66, y0], [-22, y1]], [[-22, y1], [22, y0]], [[60, y0], [60, y1]], [[100, y0], [100, y1]], [[140, y0], [140, y1]]];
    for (const [a, b] of strokes) { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
    x.lineWidth = 7; for (const [a, b] of strokes) for (const p of [a, b]) { if (p[0] === -22 && p[1] === y1) continue; x.beginPath(); x.moveTo(p[0] - 14, p[1]); x.lineTo(p[0] + 14, p[1]); x.stroke(); }
    x.lineWidth = 2.4; handLine(x, { x0: 190, x1: 330, y: (y0 + y1) / 2, seed: 99, amp: 3 });
  }
  const bandPath = (x, begin = true) => { if (begin) x.beginPath(); x.moveTo(TOP[0][0], TOP[0][1]); for (const p of TOP) x.lineTo(p[0], p[1]); for (const p of [...BOT].reverse()) x.lineTo(p[0], p[1]); x.closePath(); };
  function page(x, torn) {
    const pts = cutPoly([[-DOC.w / 2, -DOC.h / 2], [DOC.w / 2, -DOC.h / 2 + 8], [DOC.w / 2 + 6, DOC.h / 2], [-DOC.w / 2 - 4, DOC.h / 2 - 6]], 10, 2.4, 9);
    x.save();
    if (torn) { x.beginPath(); x.rect(-2000, -2000, 4000, 4000); bandPath(x, false); x.clip('evenodd'); }
    polyPath(x, pts); x.fillStyle = P.parchment; x.fill();
    x.save(); polyPath(x, pts); x.clip();
    const g = x.createRadialGradient(0, 0, 250, 0, 60, 700); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(120,80,30,.45)'); x.fillStyle = g; x.fillRect(-500, -600, 1000, 1200);
    x.strokeStyle = INK; x.lineCap = 'round'; x.globalAlpha = .8; x.lineWidth = 6;
    x.beginPath(); for (let u = 0; u <= 38; u += .05) { const px = -300 + u * 15 - 18 * Math.sin(u), py = -380 - 26 * Math.cos(u); u === 0 ? x.moveTo(px, py) : x.lineTo(px, py); } x.stroke();
    x.globalAlpha = .62; x.lineWidth = 2.4; for (const l of HAND) handLine(x, l); x.globalAlpha = 1;
    if (!torn) xviii(x);
    x.restore(); x.restore();
    if (torn) {
      x.strokeStyle = 'rgba(250,240,215,.85)'; x.lineWidth = 3;
      for (const E of [TOP, BOT]) { x.beginPath(); E.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke(); }
    }
  }
  function strip(x) {
    x.save(); x.translate(0, -(BAND.y0 + BAND.y1) / 2);
    bandPath(x); x.fillStyle = P.parchment; x.fill();
    x.save(); bandPath(x); x.clip(); xviii(x); x.restore();
    x.strokeStyle = 'rgba(250,240,215,.9)'; x.lineWidth = 3; for (const E of [TOP, BOT]) { x.beginPath(); E.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke(); }
    x.restore();
  }
  function calPage(x, year) {
    x.fillStyle = '#efe5cf'; x.fillRect(-CAL.w / 2, -CAL.h / 2, CAL.w, CAL.h);
    x.fillStyle = P.red; x.fillRect(-CAL.w / 2, -CAL.h / 2, CAL.w, 44);
    x.fillStyle = P.ink; x.font = '900 150px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(year), 0, -40);
    x.strokeStyle = 'rgba(44,40,36,.35)'; x.lineWidth = 1.5;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) x.strokeRect(-150 + c * 76, 70 + r * 44, 66, 36);
  }
  function calendar(x, tp) {
    x.fillStyle = '#7d6a55'; x.fillRect(-CAL.w / 2 - 4, -CAL.h / 2 + 8, CAL.w + 8, CAL.h + 6);
    const left = K.tears.filter(tt => tp < tt).length;
    x.save(); calPage(x, 1933 - left); x.restore();
    x.fillStyle = '#2a2420'; x.fillRect(-CAL.w / 2 - 8, -CAL.h / 2 - 16, CAL.w + 16, 26);
    for (const rx of [-110, 110]) { x.fillStyle = '#8a8a86'; x.beginPath(); x.arc(rx, -CAL.h / 2 - 3, 9, 0, TAU); x.fill(); }
  }
  function flyingPages(x, tp) {
    K.tears.forEach((tt, i) => {
      const u = (tp - tt) / .55; if (u <= 0 || u >= 1) return;
      const e = easeOut(u, 2), dir = hash(i, 5) - .5;
      x.save(); x.translate(CAL.x - 40 * e + dir * 380 * e, CAL.y - 620 * e); x.rotate(e * (1.2 + dir)); x.scale(1 + .25 * e, 1 - .45 * e);
      x.globalAlpha = 1 - easeIn(u, 3); calPage(x, 1920 + i); x.restore();
    });
  }

  const GROUND = 1000;
  const TOWERS = (() => {
    const kinds = ['crates', 'bottle', 'cash', 'barrels', 'crates', 'bottle', 'cash', 'deco', 'crates', 'barrels', 'bottle', 'cash', 'crates'];
    const xs = [-260, -40, 170, 360, 560, 760, 960, 1250, 1500, 1690, 1880, 2080, 2280];
    const hs = [420, 640, 520, 360, 700, 820, 560, 1080, 610, 420, 760, 520, 380];
    return xs.map((x, i) => ({ x, h: hs[i], kind: kinds[i], w: kinds[i] === 'deco' ? 230 : 130 + hash(i, 2) * 70, seed: i }));
  })();
  const riseOrder = TOWERS.map((t, i) => [Math.abs(t.x - 1150), i]).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
  const riseAt = i => lerp(K.rise[0], K.rise[1] - .5, riseOrder.indexOf(i) / (TOWERS.length - 1));
  const WIN = { x: 1250, y: GROUND - 1080 + 150, w: 84, h: 104 }, FIG_DX = 18;
  const FAR = (() => { const r = rng(12), out = []; for (let x = -1400; x < 3400;) { const w = 50 + r() * 110, h = 80 + r() * 260; out.push({ x, w, h, lit: Array.from({ length: 6 }, () => r() < .25) }); x += w + r() * 10; } return out; })();

  function windowsGrid(x, t, w, h, top, seed, lit) {
    const cols = Math.max(2, Math.floor(w / 26)), rows = Math.floor((h - 30) / 34);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const on = hash(r * 31 + c, seed + 17) < .5 && lit > hash(r * 7 + c * 13, seed + 29);
      x.fillStyle = on ? '#ffc56a' : 'rgba(10,10,30,.55)';
      x.fillRect(-w / 2 + 10 + c * (w - 20) / cols, top + 20 + r * 34, (w - 20) / cols - 8, 18);
    }
  }
  function tower(x, T, t, k, lit) {
    const h = T.h * k, w = T.w, top = GROUND - h, col = '#0c0c22', dark = '#07071a';
    x.save(); x.beginPath(); x.rect(T.x - w, top - 200, w * 2, h + 200); x.clip();
    x.translate(T.x, 0);
    if (T.kind === 'crates') {
      const n = Math.max(1, Math.round(T.h / 110));
      for (let i = 0; i < n; i++) { const cw = w * (.8 + hash(i, T.seed) * .25), y = GROUND - (i + 1) * (T.h / n) + (1 - k) * T.h;
        x.fillStyle = i % 2 ? col : dark; x.fillRect(-cw / 2, y, cw, T.h / n - 4);
        x.strokeStyle = 'rgba(255,200,120,.12)'; x.lineWidth = 2; for (let s = 1; s < 4; s++) { x.beginPath(); x.moveTo(-cw / 2, y + s * (T.h / n) / 4); x.lineTo(cw / 2, y + s * (T.h / n) / 4); x.stroke(); }
        x.fillStyle = `rgba(255,197,106,${.8 * lit * (hash(i, T.seed, 5) < .5 ? 1 : 0)})`; x.fillRect(-12, y + 20, 24, 16); }
    } else if (T.kind === 'bottle') {
      const bt = GROUND - T.h + (1 - k) * T.h, bw = w, neck = w * .34;
      x.fillStyle = col; x.beginPath(); x.moveTo(-bw / 2, GROUND); x.lineTo(-bw / 2, bt + T.h * .42); x.quadraticCurveTo(-bw / 2, bt + T.h * .27, -neck / 2, bt + T.h * .2);
      x.lineTo(-neck / 2, bt + 18); x.lineTo(neck / 2, bt + 18); x.lineTo(neck / 2, bt + T.h * .2); x.quadraticCurveTo(bw / 2, bt + T.h * .27, bw / 2, bt + T.h * .42); x.lineTo(bw / 2, GROUND); x.closePath(); x.fill();
      x.fillStyle = dark; x.fillRect(-neck / 2 - 4, bt, neck + 8, 20);
      windowsGrid(x, t, bw * .8, T.h * .52, bt + T.h * .44, T.seed, lit);
    } else if (T.kind === 'cash') {
      const n = Math.max(2, Math.round(T.h / 70));
      for (let i = 0; i < n; i++) { const cw = w * (.85 + hash(i, T.seed) * .2), y = GROUND - (i + 1) * (T.h / n) + (1 - k) * T.h, off = (hash(i, T.seed, 2) - .5) * 16;
        x.fillStyle = '#1d2a3a'; x.fillRect(-cw / 2 + off, y, cw, T.h / n - 3);
        x.fillStyle = `rgba(120,170,110,${.35 + .4 * lit})`; x.fillRect(-10 + off, y, 20, T.h / n - 3); }
    } else if (T.kind === 'barrels') {
      const n = Math.max(1, Math.round(T.h / 95));
      for (let i = 0; i < n; i++) { const y = GROUND - (i + 1) * (T.h / n) + (1 - k) * T.h, bh = T.h / n - 4;
        x.fillStyle = i % 2 ? dark : col; x.beginPath(); x.ellipse(0, y + bh / 2, w * .45, bh / 2, 0, 0, TAU); x.fill();
        x.fillStyle = 'rgba(255,200,120,.14)'; x.fillRect(-w * .45, y + bh * .25, w * .9, 3); x.fillRect(-w * .45, y + bh * .72, w * .9, 3); }
    } else {
      const top0 = GROUND - T.h + (1 - k) * T.h, steps = [[1, .0], [.8, .38], [.6, .62], [.42, .8]];
      for (const [f, y] of steps) { x.fillStyle = col; x.fillRect(-w * f / 2, top0 + T.h * y, w * f, T.h * (1 - y)); }
      x.fillStyle = dark; polyPath(x, [[-10, top0 + T.h * .8], [10, top0 + T.h * .8], [0, top0 - 90]]); x.fill();
      windowsGrid(x, t, w * .9, T.h * .55, top0 + T.h * .42, T.seed, lit);
      x.fillStyle = `rgba(120,170,110,${.25 + .35 * lit})`; for (const [f, y] of steps) x.fillRect(-w * f / 2, top0 + T.h * y, w * f, 5);
    }
    x.restore();
  }
  function caponeWindow(x, t, tp, fig = {}) {
    const on = smooth((tp - K.window) / .25); if (on <= 0) return;
    const { x: wx, y: wy, w, h } = WIN;
    x.save(); x.beginPath(); x.rect(wx - w / 2, wy, w, h); x.clip(); x.globalAlpha = on;
    const g = x.createRadialGradient(wx + 12, wy + 30, 4, wx, wy + 50, 80); g.addColorStop(0, '#ffd690'); g.addColorStop(1, '#d98a3a');
    x.fillStyle = g; x.fillRect(wx - w / 2, wy, w, h);
    x.fillStyle = 'rgba(120,60,20,.28)'; for (let k = -2; k < 16; k++) { x.save(); x.translate(wx - w / 2, wy + k * 8); x.rotate(-.18); x.fillRect(-20, 0, w + 60, 3.4); x.restore(); }
    x.translate(wx + FIG_DX, wy + h);
    const tip = PR.caponeProfile(x, B, { ember: fig.ember ?? .6, face: fig.face ?? 0, hand: fig.hand, holding: fig.holding });
    x.save(); x.translate(tip[0], tip[1]); PR.smoke(x, t, fig.puff || 0, 1); x.restore();
    if (fig.exhale !== undefined) PR.exhale(x, t, fig.exhale);
    x.restore();
    return [wx + FIG_DX + tip[0], wy + h + tip[1]];
    x.strokeStyle = '#07071a'; x.lineWidth = 3; x.strokeRect(wx - w / 2, wy, w, h);
  }

  const DZ = M45 ? [1.3, 1.36, 1.08, 1.1, 1.05] : [1.35, 1.42, 1.3, 1.33, 1.35];
  const DESK_CAM = [[0, [560, 560], DZ[0]], [K.tears[12] + .1, [560, 560], DZ[1]], [K.pan[1], [1400, M45 ? 600 : 640], DZ[2]], [K.tear[0], [1400, M45 ? 620 : 650], DZ[3]], [K.lift[1], [1400, DOC.y + (BAND.y0 + BAND.y1) / 2 - LIFT_Y], DZ[4]]];
  const deskCam = t => { const xy = keyed(t, DESK_CAM.map(k => [k[0], k[1]])), z = keyed(t, DESK_CAM.map(k => [k[0], k[2]]), true); return { x: xy[0], y: xy[1], z }; };
  const CZ0 = DZ[4];
  const S0 = [960, -760];
  function stripCity(t) {
    const u = clamp((t - K.fall[0]) / (K.fall[1] - K.fall[0])), e = lerp(u, easeIn(u, 1.4), .5);
    return { x: lerp(S0[0], 1120, e) + Math.sin(u * TAU * 1.6) * 70 * (1 - u), y: lerp(S0[1], GROUND - 26, e), rot: -.1 + Math.sin(u * TAU * 1.6 + .6) * .32 * (1 - u) + u * .12, s: lerp(1, .32, easeOut(u, 1.5)) };
  }
  const CITY_CAM = M45
    ? [[K.s14, S0, CZ0], [K.s14 + 1.6, [960, -420], 1.0], [K.built + .3, [1000, 330], .72], [K.empire + .2, [1150, 500], .78], [K.nation + .2, [1230, 280], .95], [DUR + 1.6, [1250, WIN.y + 60], 1.9]]
    : [[K.s14, S0, CZ0], [K.s14 + 1.6, [960, -420], 1.25], [K.built + .3, [1000, 330], .88], [K.empire + .2, [1150, 520], .92], [K.nation + .2, [1230, 300], 1.1], [DUR + 1.6, [1250, WIN.y + 60], 2.2]];
  const cityCam = t => { const xy = keyed(t, CITY_CAM.map(k => [k[0], k[1]])), z = keyed(t, CITY_CAM.map(k => [k[0], k[2]]), true); return { x: xy[0], y: xy[1], z }; };

  function desk(ctx, t, withStrip) {
    const cam = deskCam(t), tp = pose(t);
    LP.background(ctx);
    LP.sheet(ctx, cam, .98, R, x => {
      x.fillStyle = '#4a3526'; x.fillRect(-1000, -1000, 4000, 3000);
      x.strokeStyle = 'rgba(20,12,6,.25)'; x.lineWidth = 3; for (let y = -900; y < 2000; y += 38) { x.beginPath(); x.moveTo(-1000, y); for (let px = -1000; px <= 3000; px += 80) x.lineTo(px, y + Math.sin(px / 300 + y) * 6); x.stroke(); }
    }, { shadow: false, rim: false, fibre: .4 });
    const torn = tp >= K.lift[0];
    LP.sheet(ctx, cam, 1, R, x => { x.save(); x.translate(DOC.x, DOC.y); x.rotate(.02); page(x, torn); x.restore(); }, { paperShadow: [6, 9, 7, .45] });
    LP.sheet(ctx, cam, 1, R, x => { x.save(); x.translate(CAL.x, CAL.y); x.rotate(-.03); calendar(x, tp); x.restore(); }, { paperShadow: [6, 9, 7, .45] });
    if (tp < K.tears[12] + .6) LP.sheet(ctx, cam, 1.08, R, x => flyingPages(x, tp), { paperShadow: [14, 20, 10, .3] });
    if (withStrip && torn) {
      const k = easeIO(clamp((tp - K.lift[0]) / (K.lift[1] - K.lift[0])));
      LP.sheet(ctx, cam, 1, R, x => { x.save(); x.translate(DOC.x, DOC.y + (BAND.y0 + BAND.y1) / 2 - LIFT_Y * k); x.rotate(.02 - .12 * k); x.scale(1 + (LIFT_S - 1) * k, 1 + (LIFT_S - 1) * k); strip(x); x.restore(); },
        { paperShadow: [6 + 26 * k, 9 + 34 * k, 6 + 14 * k, .45 - .15 * k] });
    } else if (withStrip && tp >= K.tear[0]) {
      const k = clamp((tp - K.tear[0]) / (K.tear[1] - K.tear[0]));
      LP.sheet(ctx, cam, 1, R, x => {
        x.save(); x.translate(DOC.x, DOC.y); x.rotate(.02); x.strokeStyle = 'rgba(250,240,215,.95)'; x.lineWidth = 4;
        for (const E of [TOP, BOT]) { const n = Math.round(k * (E.length - 1)); x.beginPath(); for (let i = E.length - 1; i >= E.length - 1 - n; i--) i === E.length - 1 ? x.moveTo(E[i][0], E[i][1]) : x.lineTo(E[i][0], E[i][1]); x.stroke(); }
        x.restore();
      }, { shadow: false, rim: false });
    }
    const pc = [W / 2 + cam.z * (980 - cam.x), H / 2 + cam.z * (560 - cam.y)];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dk = ctx.createRadialGradient(pc[0], pc[1], 120, pc[0], pc[1], 1400); dk.addColorStop(0, 'rgba(10,7,4,0)'); dk.addColorStop(.5, 'rgba(10,7,4,.35)'); dk.addColorStop(1, 'rgba(10,7,4,.88)');
    ctx.fillStyle = dk; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  function cityStrip(ctx, t, cam) {
    const s = stripCity(t);
    LB.sheet(ctx, cam, 1, R, x => { x.save(); x.translate(s.x, s.y); x.rotate(s.rot); x.scale(s.s * LIFT_S, s.s * LIFT_S); strip(x); x.restore(); },
      { glow: .45, glowBlur: 10, glowColor: '#ffe6b8', rimColor: '#fff0cc', rimAlpha: .6, fibre: .3 });
  }
  function city(ctx, t, withStrip, camOverride, fig = {}) {
    const cam = camOverride || cityCam(t), tp = pose(t);
    LB.background(ctx);
    LB.sheet(ctx, cam, .3, R, x => { x.fillStyle = '#e8e2d0'; x.beginPath(); x.arc(1170, 165, 250, 0, TAU); x.fill(); }, { glow: .7, glowBlur: 40, glowColor: '#fff1cf', rimAlpha: .2 });
    FILM.sheet(ctx, cam, .3, W, H, R); PR.glow(ctx, 1170, 165, 700, '#b9b4ff', .2, 'lightbox');
    LB.sheet(ctx, cam, .55, R, x => {
      for (const b of FAR) { x.fillStyle = '#12123a'; x.fillRect(b.x, GROUND - b.h, b.w, b.h + 600); b.lit.forEach((on, i) => { if (on) { x.fillStyle = 'rgba(255,197,106,.6)'; x.fillRect(b.x + 10 + (i % 2) * (b.w - 30), GROUND - b.h + 20 + Math.floor(i / 2) * 40, 12, 14); } }); }
    }, { glow: .3, glowBlur: 16 });
    const lit = smooth((tp - K.lights[0]) / (K.lights[1] - K.lights[0]));
    let emberAt = [WIN.x + FIG_DX + PR.CAPONE_EMBER[0], WIN.y + WIN.h + PR.CAPONE_EMBER[1]];
    LB.sheet(ctx, cam, 1, R, x => {
      TOWERS.forEach((T, i) => { const k = easeOutBack(clamp((tp - riseAt(i)) / .5), 1.1); if (k > 0) tower(x, T, t, k, lit); });
      emberAt = caponeWindow(x, t, tp, fig) || emberAt;
      x.fillStyle = '#07071a'; x.fillRect(-1500, GROUND, 5000, 1200);
    }, { glow: .55, glowBlur: 14 });
    if (tp >= K.window) { FILM.sheet(ctx, cam, 1, W, H, R); const e = .55 + .45 * smooth((tp - K.ember) / .3) * (.8 + .2 * Math.sin(t * 7)); ctx.save(); ctx.beginPath(); ctx.rect(WIN.x - WIN.w / 2, WIN.y, WIN.w, WIN.h); ctx.clip(); PR.glow(ctx, emberAt[0], emberAt[1], 18, '#ff6a2a', e * (.6 + .4 * (fig.ember ?? .6) / .6), 'lightbox'); ctx.restore(); }
    if (withStrip && tp >= K.fall[0]) cityStrip(ctx, t, cam);
  }

  const [A1, a1] = FILM.canvas(W, H), [A2, a2] = FILM.canvas(W, H);
  function draw(ctx, t) {
    const tp = pose(t), d = smooth((t - K.dissolve[0]) / (K.dissolve[1] - K.dissolve[0]));
    if (d <= 0) desk(ctx, t, true);
    else if (d >= 1) city(ctx, t, true);
    else {
      for (const [c, x] of [[A1, a1], [A2, a2]]) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; x.clearRect(0, 0, W, H); }
      desk(a1, t, false); city(a2, t, false);
      ctx.drawImage(A1, 0, 0); ctx.globalAlpha = d; ctx.drawImage(A2, 0, 0); ctx.globalAlpha = 1;
      cityStrip(ctx, t, cityCam(t));
    }
    (d < .5 ? LP : LB).grade(ctx, t);
  }

  const ready = FILM.fonts('NSC');
  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready, grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.later, K.tore, K.s14, K.built, K.nation],
    api: { city, cityCam, WIN, K, DUR, page, strip, DOC, BAND },
  });
})();
