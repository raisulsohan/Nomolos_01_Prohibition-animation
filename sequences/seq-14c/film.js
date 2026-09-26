(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng, hash } = FILM, PR = FILM.props;
  const ID = 'seq-14c', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const S14 = FILM.getScene('seq-14').api, S14b = FILM.getScene('seq-14b').api, T0 = S14b.DUR, G0 = S14.DUR + S14b.DUR;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { americans: 1.335, wanting: 2.135, drink: 2.603, only: 3.437, illegal: 4.271,
    moment: 5.606, millions: 6.373, want: 7.674, becomes: 7.975, closed: 9.643, market: 10.11,
    handed: 11.411, untaxed: 12.212, unregulated: 13.213, whoever: 14.514, willing: 14.948,
    break: 15.349, law: 15.716, supply: 16.116 };
  const HZ = S14.HZ;
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const CROWD = (() => {
    const g = rng(52), out = [];
    for (let i = 0; i < 17; i++) {
      const row = i % 2, x = 1640 + i * 92 + (g() - .5) * 40, woman = g() < .45;
      if (Math.abs(x - 2720) < 70 || Math.abs(x - 2800) < 50) continue;
      out.push({ x, y: HZ + 60 + row * 70, s: 1.25 + row * .25, woman, hat: woman ? 'none' : ['bowler', 'cap', 'wide'][(g() * 3) | 0], t: .45 + g() * 1.3, flip: g() < .5 });
    }
    return out.sort((a, b) => a.y - b.y);
  })();
  const FAMILY = [[2720, HZ + 110 - 90], [2800, HZ + 110 - 57], [3120, HZ - 57]];
  const chests = tp => [...CROWD.filter(p => tp > p.t).map(p => ({ c: [p.x, p.y - 60 * p.s], a: smooth((tp - p.t - .1) / .3), s: p.s })), ...FAMILY.map(c => ({ c, a: smooth((tp - .9) / .5), s: 1.2 }))];
  function crowd(x, tp) {
    for (const p of CROWD) {
      const u = back((tp - p.t) / .3); if (u <= 0) continue;
      x.save(); x.translate(p.x, p.y); x.scale(p.s * (p.flip ? -1 : 1), p.s * u);
      PR.person(x, B, { kind: p.woman ? 'woman' : 'man', coat: p.woman ? '#161338' : '#12112e', skirt: '#0e0c26', trouser: '#0e0c26', hat: p.hat, hatColor: '#0b0a1c', skin: '#1c1838' });
      x.restore();
    }
    for (const c of chests(tp)) { x.fillStyle = FILM.rgba(FILM.hex(B.amber), c.a); x.beginPath(); x.arc(c.c[0], c.c[1], 5.5 * c.s, 0, TAU); x.fill(); }
  }
  const glowBeat = tp => 1 + .5 * Math.exp(-Math.pow((tp - K.wanting - .1) / .15, 2));

  const STAMP = { at: [2450, 430], rot: -.05, w: 900, h: 400 };
  let INK = null;
  function stampHeight(tp) {
    const inT = K.only + .05, hit = K.illegal, up = [hit + .35, hit + .8];
    if (tp < inT || tp > up[1]) return null;
    if (tp < hit) return 1 - easeIn((tp - inT) / (hit - inT), 2.2);
    if (tp < up[0]) return 0;
    return easeIn((tp - up[0]) / (up[1] - up[0]), 1.6) * 1.3;
  }
  function imprint(x, tp) { if (!INK || tp < K.illegal) return; x.save(); x.translate(STAMP.at[0], STAMP.at[1]); x.rotate(STAMP.rot); x.globalAlpha = .95; x.drawImage(INK, -STAMP.w / 2, -STAMP.h / 2, STAMP.w, STAMP.h); x.restore(); }
  function stamp(ctx, tp, cam) {
    const h = stampHeight(tp); if (h === null) return;
    FILM.sheet(ctx, cam, 1, W, H, R);
    ctx.save(); ctx.translate(STAMP.at[0] + h * 150, STAMP.at[1] + h * 200); ctx.rotate(STAMP.rot);
    ctx.filter = `blur(${4 + h * 40}px)`; ctx.fillStyle = `rgba(0,0,0,${.5 * (1 - h * .5)})`; ctx.fillRect(-STAMP.w / 2, -STAMP.h / 2, STAMP.w, STAMP.h); ctx.restore();
    const sc = 1 + h * 1.6;
    ctx.save(); ctx.translate(STAMP.at[0] - h * 420, STAMP.at[1] - h * 520); ctx.rotate(STAMP.rot - h * .12); ctx.scale(sc, sc);
    if (h > .05) ctx.filter = `blur(${h * 5}px)`;
    PR.rubberStamp(ctx, B, STAMP.w, STAMP.h, 'lightbox');
    ctx.restore();
  }
  const shake = tp => { const u = tp - K.illegal; return u < 0 || u > .35 ? [0, 0] : [Math.sin(u * 90) * 14 * (1 - u / .35), Math.cos(u * 70) * 10 * (1 - u / .35)]; };

  const SM = 50, CHI = [2450, 600];
  const M = (() => { const m0 = FILM.usmap({ width: 1320 * SM, cx: 0, cy: 0 }), p = m0.proj([-87.63, 41.88]); return FILM.usmap({ width: 1320 * SM, cx: CHI[0] - p[0], cy: CHI[1] - p[1] }); })();
  const MAPC = M.proj([-97.5, 39.2]);
  const RECT = [-900, -900, 5500, 3900];
  const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
  const DOTS = (() => {
    const g = rng(54), b = M.us.reduce((a, [x, y]) => [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)], [1e12, 1e12, -1e12, -1e12]), out = [];
    const gauss = () => { let s = 0; for (let k = 0; k < 4; k++) s += g(); return (s - 2) / .58; };
    const cities = Object.values(M.cities);
    while (out.length < 1500) {
      const r = g(); let p;
      if (r < .1) p = [CHI[0] + gauss() * 3200, CHI[1] + gauss() * 2400];
      else if (r < .65) { const c = cities[(g() * cities.length) | 0]; p = [c[0] + gauss() * 2200, c[1] + gauss() * 1800]; }
      else p = [lerp(b[0], b[2], g()), lerp(b[1], b[3], g())];
      if (!inside(p, M.us)) continue;
      out.push({ p, s: 3 + g() * 3.5, ph: g() * TAU, inRect: p[0] > RECT[0] && p[0] < RECT[0] + RECT[2] && p[1] > RECT[1] && p[1] < RECT[1] + RECT[3] });
    }
    const far = Math.max(...out.map(d => Math.hypot(d.p[0] - CHI[0], d.p[1] - CHI[1])));
    out.forEach(d => { d.t = K.moment + .15 + 2 * Math.pow(Math.hypot(d.p[0] - CHI[0], d.p[1] - CHI[1]) / far, .6); });
    return out;
  })();
  const GLOW = (() => { const [c, x] = FILM.canvas(64, 64), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,214,140,1)'); g.addColorStop(.25, 'rgba(255,179,77,.8)'); g.addColorStop(1, 'rgba(255,179,77,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return c; })();
  const pull = t => .18 * easeOut(clamp((t - K.want) / 3.2), 2);
  const dotAt = (d, t) => { const u = pull(t); return [lerp(d.p[0], GAPW[0], u), lerp(d.p[1], GAPW[1], u)]; };
  const streetFade = cam => 1 - smooth((Math.log(cam.z) - Math.log(.5)) / (Math.log(.2) - Math.log(.5)));
  function mapLayer(x, t, cam, sv) {
    x.save(); x.beginPath(); x.rect(-1e6, -1e6, 2e6, 2e6); x.rect(...RECT); x.clip('evenodd');
    land(x); x.restore();
    if (sv < 1) { x.save(); x.globalAlpha = 1 - sv; x.beginPath(); x.rect(...RECT); x.clip(); land(x); x.restore(); }
  }
  function land(x) {
    x.fillStyle = B.sheet2; polyPath(x, M.canada); x.fill(); polyPath(x, M.mexico); x.fill();
    x.fillStyle = '#2c3378'; polyPath(x, M.us); x.fill();
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; for (const l of Object.values(M.lakes)) { polyPath(x, l); x.fill(); } x.globalCompositeOperation = 'source-over';
  }
  function dots(ctx, t, cam, sv) {
    FILM.sheet(ctx, cam, 1, W, H, R); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const lines = smooth((t - K.want - .2) / .8);
    for (let i = 0; i < DOTS.length; i++) {
      const d = DOTS[i], a = smooth((t - d.t) / .35) * (d.inRect ? 1 - sv : 1); if (a <= 0) continue;
      const p = dotAt(d, t), r = d.s * (1 + .25 * Math.sin(t * 3 + d.ph)) / cam.z;
      ctx.globalAlpha = a; ctx.drawImage(GLOW, p[0] - r * 2, p[1] - r * 2, r * 4, r * 4);
      if (lines > 0 && i % 9 === 0) {
        const q = GAPW, f = lines * (.35 + .25 * Math.sin(t * 2 + d.ph));
        ctx.strokeStyle = 'rgba(255,179,77,.16)'; ctx.lineWidth = 1.4 / cam.z; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], q[0], f), lerp(p[1], q[1], f)); ctx.stroke();
      }
    }
    ctx.restore();
  }

  const CS = 15, MKT = [MAPC[0], MAPC[1] + 3000];
  const rise = t => back((t - K.want - .15) / .45), SHUT = t => easeIn(clamp((t - K.closed + .35) / .35), 2);
  const TOP = -210, WALL = [200, 226], OPENING = [-520, TOP], SB = TOP - 140;
  const GAPL = [250, (SB + TOP) / 2], GAPW = [MKT[0] + GAPL[0] * CS, MKT[1] + GAPL[1] * CS];
  function market(x, t, tp) {
    const u = rise(t); if (u <= 0) return;
    x.save(); x.translate(MKT[0], MKT[1]); x.scale(CS, CS * u);
    const g = x.createLinearGradient(-360, 0, WALL[0], 0); g.addColorStop(0, '#d89a4a'); g.addColorStop(1, '#ffd690'); x.fillStyle = g; x.fillRect(-360, -580, WALL[0] + 360, 580);
    x.fillStyle = '#b86a1c'; for (const sy of [-460, -360]) { x.fillRect(-350, sy, 290, 10); for (let k = 0; k < 5; k++) { x.save(); x.translate(-325 + k * 56, sy); PR.bottle(x, B, 70); x.restore(); } }
    x.fillStyle = '#8a5a2c'; for (const [cx, cy] of [[-280, 0], [-150, 0], [-215, -100]]) { x.fillRect(cx - 60, cy - 100, 120, 100); x.fillStyle = '#6a4424'; x.fillRect(cx - 60, cy - 55, 120, 5); x.fillStyle = '#8a5a2c'; }
    x.fillStyle = '#5a3a24'; x.fillRect(-40, TOP, WALL[0] + 40, -TOP);
    x.fillStyle = '#1a1840'; x.fillRect(-400, -600, 40, 600); x.fillRect(-400, -20, WALL[1] + 400, 20);
    x.fillRect(WALL[0], -600, WALL[1] - WALL[0], OPENING[0] + 600); x.fillRect(WALL[0], TOP + 22, WALL[1] - WALL[0], -TOP - 22);
    x.fillStyle = '#231f4a'; polyPath(x, [[-430, -575], [300, -615], [300, -645], [-430, -605]]); x.fill();
    x.fillStyle = '#2e2960'; x.fillRect(-50, TOP, 480, 22); x.fillStyle = '#231f4a'; polyPath(x, [[WALL[1], TOP + 22], [380, TOP + 22], [WALL[1], TOP + 110]]); x.fill();
    const sb = lerp(OPENING[0], SB, SHUT(t));
    x.fillStyle = '#3a3e66'; x.fillRect(WALL[0] - 8, OPENING[0] - 40, WALL[1] - WALL[0] + 30, 44);
    x.fillStyle = '#7a80b0'; x.fillRect(WALL[0] - 4, OPENING[0], 48, sb - OPENING[0]);
    x.fillStyle = '#50557f'; for (let y = OPENING[0] + 10; y < sb - 4; y += 14) x.fillRect(WALL[0] - 4, y, 48, 5);
    x.fillStyle = '#2a2d52'; x.fillRect(WALL[0] - 8, sb - 12, 60, 12);
    x.fillStyle = '#12102e'; x.fillRect(-200, -655, 12, 40); x.fillRect(80, -660, 12, 44);
    x.fillStyle = '#e8dcc0'; x.fillRect(-310, -770, 500, 110); x.strokeStyle = '#0a0a18'; x.lineWidth = 6; x.strokeRect(-304, -764, 488, 98);
    x.fillStyle = '#0a0a18'; x.font = '900 86px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('MARKET', -60, -714);
    x.restore();
  }
  function marketGlow(ctx, t, cam) {
    const u = rise(t); if (u <= 0) return;
    FILM.sheet(ctx, cam, 1, W, H, R); const s = SHUT(t);
    PR.glow(ctx, MKT[0] + 60 * CS, MKT[1] - 380 * CS * u, 560 * CS, B.amber, .28 * clamp(u) * (1 - .6 * s), 'lightbox');
    if (s > 0) PR.glow(ctx, GAPW[0], GAPW[1], 300 * CS, B.amber, .3 * s, 'lightbox');
    const sb = lerp(OPENING[0], SB, s), x0 = MKT[0] + WALL[1] * CS, y0 = MKT[1] + sb * CS * u, y1 = MKT[1] + TOP * CS * u, far = 1100 * CS;
    const g = ctx.createLinearGradient(x0, 0, x0 + far, 0); g.addColorStop(0, 'rgba(255,205,130,.26)'); g.addColorStop(1, 'rgba(255,205,130,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; polyPath(ctx, [[x0, y0], [x0 + far, y0 - (y1 - y0) * .8], [x0 + far, y1 + (y1 - y0) * 1.2], [x0, y1]]); ctx.fill(); ctx.restore();
  }

  const CR = { w: 170, h: 100 }, OUT = [K.handed - .35, K.handed + .45], PULL = K.supply;
  const away = tp => tp > DUR ? 1100 * easeIn(clamp((tp - DUR) / .9), 2) : 0;
  const crateX = tp => lerp(40, 330, easeIO(clamp((tp - OUT[0]) / (OUT[1] - OUT[0])))) + 60 * easeIn(clamp((tp - PULL) / .9), 2) + away(tp);
  const rope = tp => [crateX(tp) + CR.w / 2 + 34, TOP - 50];
  function crate(x, tp) {
    if (tp < OUT[0] - .3) return;
    const cx = crateX(tp);
    x.save(); x.translate(MKT[0], MKT[1]); x.scale(CS, CS); x.translate(cx, TOP);
    x.fillStyle = '#e39e37'; for (let k = 0; k < 4; k++) { x.beginPath(); x.arc(-54 + k * 36, -CR.h - 4, 8, Math.PI, TAU); x.fill(); }
    x.fillStyle = '#7a5530'; x.fillRect(-CR.w / 2, -CR.h, CR.w, CR.h); x.fillStyle = '#5a3c22'; for (const y of [-CR.h + 32, -CR.h + 66]) x.fillRect(-CR.w / 2, y, CR.w, 4);
    x.strokeStyle = '#3e2a16'; x.lineWidth = 5; x.strokeRect(-CR.w / 2 + 3, -CR.h + 3, CR.w - 6, CR.h - 6);
    x.strokeStyle = '#a08c64'; x.lineWidth = 11; x.lineJoin = 'round'; x.beginPath(); x.moveTo(CR.w / 2 - 4, -70); x.lineTo(CR.w / 2 + 34, -70); x.lineTo(CR.w / 2 + 34, -30); x.lineTo(CR.w / 2 - 4, -30); x.stroke();
    x.strokeStyle = '#6e5e40'; x.lineWidth = 2; for (let k = 0; k < 6; k++) { x.beginPath(); x.moveTo(CR.w / 2 + 30, -66 + k * 7); x.lineTo(CR.w / 2 + 38, -62 + k * 7); x.stroke(); }
    x.fillStyle = '#3e2a16'; for (const y of [-70, -30]) { x.beginPath(); x.arc(CR.w / 2 - 2, y, 7, 0, TAU); x.fill(); }
    const ts = clamp((tp - K.untaxed) / .7), tg = clamp((tp - K.unregulated) / .7);
    if (ts < 1) {
      x.save(); x.translate(-10 * ts, -CR.h / 2 + 220 * ts * ts); x.rotate(-.8 * ts); x.globalAlpha = 1 - easeIn(ts, 3);
      x.fillStyle = '#e8dcc0'; x.fillRect(-80, -19, 160, 38); x.fillStyle = '#1c3a5a'; x.fillRect(-74, -13, 148, 26);
      x.fillStyle = '#e8dcc0'; x.font = '900 19px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('U.S. TAX PAID', 0, 1); x.restore();
    }
    if (tg < 1) {
      x.save(); x.translate(-CR.w / 2 + 16 - 20 * tg, -CR.h + 4 + 220 * tg * tg); x.rotate(.2 + 2 * tg); x.globalAlpha = 1 - easeIn(tg, 3);
      x.strokeStyle = '#d8d0b8'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(-18, 26); x.stroke();
      x.fillStyle = '#e8dcc0'; x.fillRect(-44, 26, 52, 32); x.fillStyle = '#1c3a5a'; x.font = '900 10px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('INSPECTED', -18, 42); x.restore();
    }
    x.restore();
  }
  const ELBOW = [860, 220], GLOVE = '#16141f', REACH = [K.whoever, K.willing + .15];
  function hand(x, tp) {
    if (tp < REACH[0]) return;
    const a = easeOut(clamp((tp - REACH[0]) / (REACH[1] - REACH[0])), 2), r = rope(tp), h = [lerp(760, r[0], a), lerp(160, r[1], a)];
    const E = [ELBOW[0] + away(tp), ELBOW[1]];
    const o = { h, side: 1, r: 7, grip: smooth((tp - REACH[1]) / (K.break - REACH[1])), skin: GLOVE, s: .85, arm: Math.atan2(E[1] - h[1], E[0] - h[0]), style: 'fingers' };
    x.save(); x.translate(MKT[0], MKT[1]); x.scale(CS, CS);
    const w = FILM.hand.wrist(o), dx = w.p[0] - E[0], dy = w.p[1] - E[1], n = Math.hypot(dx, dy), nx = -dy / n, ny = dx / n, hw = w.w / 2;
    x.fillStyle = '#0c0b1a'; polyPath(x, [[E[0] + nx * hw * 2.4, E[1] + ny * hw * 2.4], [w.p[0] + nx * hw * 1.3, w.p[1] + ny * hw * 1.3], [w.p[0] - nx * hw * 1.3, w.p[1] - ny * hw * 1.3], [E[0] - nx * hw * 2.4, E[1] - ny * hw * 2.4]]); x.fill();
    FILM.hand.back(x, o); FILM.hand.front(x, o);
    x.restore();
  }

  const V0 = (() => { const c = S14b.camera(T0); return [c.x, c.y, Math.log(c.z)]; })(), mz = M45 ? .72 : 1;
  const MW = (M.us.reduce((a, [x]) => Math.max(a, x), -1e12) - M.us.reduce((a, [x]) => Math.min(a, x), 1e12));
  const MB = M.us.reduce((a, [x, y]) => [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)], [1e12, 1e12, -1e12, -1e12]), MID = [(MB[0] + MB[2]) / 2, (MB[1] + MB[3]) / 2];
  const ZFIT = (M45 ? 940 : 1700) / MW;
  const KEYS = [[0, V0], [2.3, [2450, 580, Math.log(1.3 * mz)]], [K.only, [2450, 570, Math.log(1.32 * mz)]], [K.illegal + .2, [2450, 520, Math.log(1.02 * mz)]], [K.moment, [2450, 530, Math.log(.95 * mz)]],
    [K.millions + .35, [CHI[0], CHI[1], Math.log(.1 * mz)]], [K.want + .25, [MID[0], MID[1], Math.log(ZFIT)]], [K.closed - .45, [MKT[0] + 20 * CS, MKT[1] - 380 * CS, Math.log(.09 * mz)]], [K.market + .3, [MKT[0] + 60 * CS, MKT[1] - 360 * CS, Math.log(.1 * mz)]],
    [K.handed + .15, [MKT[0] + 250 * CS, MKT[1] - 275 * CS, Math.log(2.3 * mz / CS)]], [DUR, [MKT[0] + 300 * CS, MKT[1] - 270 * CS, Math.log(2.45 * mz / CS)]]];
  function camera(t) {
    const own = keyed(t, KEYS), c = S14b.camera(T0 + t), s = [c.x, c.y, Math.log(c.z)], w = smooth(t / .9);
    const v = own.map((o, i) => lerp(s[i], o, w));
    return { x: v[0], y: v[1], z: Math.exp(v[2]) };
  }

  function draw(ctx, t, cam = camera(t), extra) {
    const tp = pose(t), sh = shake(tp), c = { ...cam, x: cam.x - sh[0] / cam.z, y: cam.y - sh[1] / cam.z }, sv = streetFade(c);
    if (sv > 0) {
      S14b.render(ctx, T0 + t, c, 'lightbox');
      L.sheet(ctx, c, 1, R, x => { imprint(x, tp); crowd(x, tp); }, { glow: .35, glowBlur: 12 });
      FILM.sheet(ctx, c, 1, W, H, R);
      for (const ch of chests(tp)) PR.glow(ctx, ch.c[0], ch.c[1], 60 * ch.s, B.amber, .55 * ch.a * glowBeat(tp), 'lightbox');
    } else L.background(ctx);
    if (sv < 1 || t > K.moment) L.sheet(ctx, c, 1, R, x => mapLayer(x, t, c, sv), { glow: .25, glowBlur: 10 });
    dots(ctx, t, c, sv);
    if (t > K.want) { L.sheet(ctx, c, 1, R, x => { market(x, t, tp); crate(x, tp); hand(x, tp); }, { glow: .35, glowBlur: 12 }); marketGlow(ctx, t, c); }
    stamp(ctx, tp, c);
    if (extra) extra(ctx, c, tp);
    L.grade(ctx, G0 + t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS').then(() => { INK = PR.inkSprite('ILLEGAL', STAMP.w, STAMP.h, B.red, 'NSC', 77); }), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.americans, K.wanting, K.illegal, K.millions, K.closed, K.untaxed, K.unregulated, K.willing],
    api: { DUR, camera, draw, K, MKT, CS, rope, G0, crowd, chests, imprint },
  });
})();
