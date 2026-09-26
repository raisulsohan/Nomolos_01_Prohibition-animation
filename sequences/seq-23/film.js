(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-23', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('lightbox', W, H), B = L.P, pose = L.pose;
  const K = { illegal: 0.934, empire: 1.268, requires: 1.735, protection: 2.202,
    gangs: 3.704, bought: 4.438, police: 5.339, judges: 6.507, city: 7.307,
    congress: 9.276, took: 9.843, looked: 10.744 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const line = (x, pts, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'butt'; x.lineJoin = 'miter'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); };

  const GY = 600, SP = M45 ? 265 : 480, BW = M45 ? 250 : 400, RW = BW - 30, RH = 260, UH = 170, FS = 1.7;
  const KINDS = ['police', 'judge', 'official', 'congress'], SIGN = { police: 'POLICE', judge: 'COURT', official: 'CITY HALL', congress: 'CONGRESS' };
  const VAULT = { x: 960, y: 1080, w: 420, h: 200 };
  const BLD = KINDS.map((kind, i) => {
    const bx = 960 + (i - 1.5) * SP, fx = bx - (M45 ? 18 : 30), mx = fx + 30 * FS, my = GY - 42 * FS, vx = 960 + (i - 1.5) * 44, ty = i === 0 || i === 3 ? 820 : 760;
    const path = [[vx, VAULT.y - VAULT.h / 2], [vx, ty], [mx, ty], [mx, my + 6]];
    const lens = path.slice(1).map((p, k) => Math.hypot(p[0] - path[k][0], p[1] - path[k][1])), len = lens.reduce((a, b) => a + b, 0);
    const launch = K.gangs - .15 + i * .16, take = [K.police, K.judges, K.city, K.congress][i] + .04;
    return { kind, bx, fx, mx, my, path, lens, len, launch, arrive: launch + .9, take, turn: K.looked - .1 + i * .14, pan: (bx - 960) / 800 };
  });
  const along = (b, u) => { let d = u * b.len; for (let k = 0; k < b.lens.length; k++) { if (d <= b.lens[k] || k === b.lens.length - 1) { const s = clamp(d / b.lens[k]), p = b.path[k], q = b.path[k + 1]; return [lerp(p[0], q[0], s), lerp(p[1], q[1], s), Math.atan2(q[1] - p[1], q[0] - p[0])]; } d -= b.lens[k]; } };
  const SPEAK = (M45 ? [560, 1360] : [220, 520, 1400, 1700]).map((x, i) => ({ x, y: 1150, seed: 11 + i }));

  function ground(x, tp) {
    x.fillStyle = '#0e0c28'; x.fillRect(-1600, -900, 5200, GY + 900);
    x.fillStyle = '#141232'; x.fillRect(-1600, GY, 5200, 1400);
    x.fillStyle = '#2a2656'; x.fillRect(-1600, GY, 5200, 40); x.fillStyle = '#3a3670'; x.fillRect(-1600, GY, 5200, 6);
    x.fillStyle = '#2e2a6e'; x.fillRect(-1600, 1122, 5200, 56); x.fillStyle = '#0c0a24'; x.fillRect(-1600, 1130, 5200, 40);
    line(x, [[-1600, 1160], [3600, 1160]], 7, B.amber);
    for (const s of SPEAK) speakeasy(x, s, tp);
  }
  function speakeasy(x, s, tp) {
    const w = 170, h = 96, cx = s.x, cy = s.y - 70;
    x.fillStyle = '#2e2a6e'; x.fillRect(cx - w / 2 - 8, cy - h / 2 - 8, w + 16, h + 16); x.fillStyle = '#6a4636'; x.fillRect(cx - w / 2, cy - h / 2, w, h);
    x.fillStyle = '#2a1a1a'; x.fillRect(cx + w * .15, cy + h / 2 - 32, w * .3, 32);
    const g = rng(s.seed);
    for (let k = 0; k < 3; k++) { const px = cx - w * .35 + k * w * .2 + (g() - .5) * 10, bob = Math.abs(Math.sin(tp * 4 + k + s.seed)) * 2; x.save(); x.translate(px, cy + h / 2 - bob); x.scale(g() < .5 ? .5 : -.5, .5); PR.person(x, B, { kind: g() < .4 ? 'woman' : 'man', hat: g() < .5 ? 'wide' : 'none', hatColor: '#06060f', dark: 1, arm: .8 }); x.restore(); }
  }
  function vault(x, t, tp) {
    const { x: vx, y: vy, w, h } = VAULT;
    x.fillStyle = '#2e2a6e'; x.fillRect(vx - w / 2 - 10, vy - h / 2 - 10, w + 20, h + 20); x.fillStyle = '#5a3a2a'; x.fillRect(vx - w / 2, vy - h / 2, w, h);
    for (const [sx, n] of [[-150, 5], [-95, 4], [120, 5], [165, 3]]) for (let k = 0; k < n; k++) {
      x.fillStyle = k % 2 ? '#5f8a4a' : '#6f9a58'; x.fillRect(vx + sx - 24, vy + h / 2 - 14 - k * 14, 48, 13); x.fillStyle = '#e8e0c0'; x.fillRect(vx + sx - 4, vy + h / 2 - 14 - k * 14, 8, 13);
    }
    x.fillStyle = '#3a2418'; x.fillRect(vx - 40, vy + 30, 120, 12); x.fillRect(vx - 32, vy + 42, 8, 58); x.fillRect(vx + 64, vy + 42, 8, 58);
    const pump = Math.max(0, ...BLD.map(b => { const u = (t - b.launch + .2) / .35; return u > 0 && u < 1 ? Math.sin(u * Math.PI) : 0; }));
    x.save(); x.translate(vx - 70, vy + h / 2); x.scale(1.2, 1.2); PR.person(x, B, { kind: 'man', hat: 'wide', hatColor: '#06060f', dark: .75, arm: .3 + .6 * pump }); x.restore();
    x.fillStyle = '#9a7a44'; x.fillRect(vx - 110, vy - h / 2, 220, 12);
  }
  function tubes(x, t) {
    for (const b of BLD) {
      line(x, b.path, 16, '#9a7a44'); line(x, b.path, 8, '#1a1636');
      x.fillStyle = '#b8924c'; polyPath(x, [[b.mx - 13, b.my - 4], [b.mx + 13, b.my - 4], [b.mx + 8, b.my + 10], [b.mx - 8, b.my + 10]]); x.fill();
      const u = (t - b.launch) / (b.arrive - b.launch); if (u <= 0 || u >= 1) continue;
      const e = easeIO(u), p = along(b, e), q = along(b, Math.max(0, e - .12));
      x.strokeStyle = 'rgba(255,179,77,.8)'; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(q[0], q[1]); x.lineTo(p[0], p[1]); x.stroke();
      x.save(); x.translate(p[0], p[1]); x.rotate(p[2]); x.fillStyle = '#ffe3b0'; x.beginPath(); x.roundRect(-10, -5, 20, 10, 4); x.fill(); x.restore();
    }
  }
  function windows(x, x0, y0, w, h, seed) {
    const g = rng(seed), cols = Math.max(2, Math.floor(w / 70)), rows = Math.max(1, Math.floor(h / 70)), cw = w / cols, rh = h / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { x.fillStyle = g() < .6 ? 'rgba(255,207,128,.6)' : '#0c0a24'; x.fillRect(x0 + c * cw + cw / 2 - 13, y0 + r * rh + rh / 2 - 20, 26, 40); }
  }
  function flag(x, fx, fy, w, h) {
    x.fillStyle = '#a8a0c0'; x.fillRect(fx - 3, fy - 6, 4, h + 70);
    for (let k = 0; k < 7; k++) { x.fillStyle = k % 2 ? '#e8e4ec' : '#b23a3a'; x.fillRect(fx, fy + k * h / 7, w, h / 7 + .5); }
    x.fillStyle = '#2c3a78'; x.fillRect(fx, fy, w * .42, h * 4 / 7);
  }
  function building(x, b, i) {
    const { bx, kind } = b, top = GY - RH - UH, L0 = bx - BW / 2;
    x.fillStyle = '#1c1a44'; x.fillRect(L0, top, BW, UH + RH);
    windows(x, L0 + 10, top + 12, BW - 20, UH - 64, 40 + i);
    x.fillStyle = '#2e2a6e'; x.fillRect(L0, GY - RH - 48, BW, 44);
    x.fillStyle = '#ffe3b0'; x.font = `900 ${M45 ? 30 : 38}px NSC`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(SIGN[kind], bx, GY - RH - 25);
    if (kind === 'police') { x.fillStyle = '#2e2a6e'; x.fillRect(L0 - 10, top - 16, BW + 20, 16); for (const s of [-1, 1]) { x.fillStyle = '#a8a0c0'; x.fillRect(bx + s * (RW / 2 + 7) - 2, GY - RH + 4, 4, 14); x.fillStyle = '#8ab4ff'; x.beginPath(); x.arc(bx + s * (RW / 2 + 7), GY - RH + 26, 9, 0, TAU); x.fill(); } }
    if (kind === 'judge') {
      x.fillStyle = '#2e2a6e'; polyPath(x, [[L0 - 12, top], [bx, top - 70], [L0 + BW + 12, top]]); x.fill();
      x.fillStyle = '#3a3670'; const n = M45 ? 4 : 6; for (let k = 0; k < n; k++) x.fillRect(L0 + 14 + k * (BW - 42) / (n - 1), top + 6, 14, UH - 58);
      x.strokeStyle = '#ffcf80'; x.lineWidth = 3; x.beginPath(); x.moveTo(bx, top - 52); x.lineTo(bx, top - 14); x.moveTo(bx - 22, top - 42); x.lineTo(bx + 22, top - 42);
      for (const s of [-1, 1]) { x.moveTo(bx + s * 22, top - 42); x.lineTo(bx + s * 28, top - 26); x.moveTo(bx + s * 22, top - 42); x.lineTo(bx + s * 16, top - 26); } x.stroke();
    }
    if (kind === 'official') {
      x.fillStyle = '#1c1a44'; x.fillRect(bx - 40, top - 150, 80, 150); x.fillStyle = '#2e2a6e'; polyPath(x, [[bx - 48, top - 150], [bx, top - 200], [bx + 48, top - 150]]); x.fill();
      x.fillStyle = '#ffe3b0'; x.beginPath(); x.arc(bx, top - 95, 26, 0, TAU); x.fill();
      x.strokeStyle = '#1c1a44'; x.lineWidth = 4; x.beginPath(); x.moveTo(bx, top - 95); x.lineTo(bx, top - 113); x.moveTo(bx, top - 95); x.lineTo(bx + 12, top - 89); x.stroke();
    }
    if (kind === 'congress') {
      const rx = M45 ? 80 : 96; x.fillStyle = '#2e2a6e'; x.fillRect(bx - rx - 6, top - 40, 2 * rx + 12, 40);
      x.fillStyle = '#e8e4ec'; x.beginPath(); x.ellipse(bx, top - 40, rx, rx * .85, 0, Math.PI, TAU); x.fill();
      x.fillStyle = '#c8c4d8'; for (let k = -2; k <= 2; k++) x.fillRect(bx + k * rx * .36 - 2, top - 40 - rx * .8 * Math.cos(k * .36), 4, rx * .8 * Math.cos(k * .36));
      x.fillStyle = '#e8e4ec'; x.fillRect(bx - 9, top - 40 - rx * .85 - 34, 18, 36);
    }
    const r0 = bx - RW / 2; x.fillStyle = '#6a4636'; x.fillRect(r0, GY - RH, RW, RH); x.fillStyle = '#5a3a2e'; x.fillRect(r0, GY - 70, RW, 70);
    x.fillStyle = '#3a2830'; x.fillRect(r0, GY - 8, RW, 8);
    x.strokeStyle = '#a8a0c0'; x.lineWidth = 2; x.beginPath(); x.moveTo(bx - 50, GY - RH); x.lineTo(bx - 50, GY - RH + 40); x.stroke(); x.fillStyle = '#ffe3b0'; x.beginPath(); x.arc(bx - 50, GY - RH + 46, 7, 0, TAU); x.fill();
    if (kind === 'police') { x.fillStyle = '#3a2830'; x.fillRect(r0 + 22, GY - RH + 70, 60, 70); x.strokeStyle = '#6a4636'; x.lineWidth = 3; for (let k = 1; k < 4; k++) { x.beginPath(); x.moveTo(r0 + 22 + k * 15, GY - RH + 70); x.lineTo(r0 + 22 + k * 15, GY - RH + 140); x.stroke(); } }
    if (kind === 'judge') { x.fillStyle = '#4a2f1b'; x.fillRect(r0 + 14, GY - RH + 50, 70, RH - 58); x.fillStyle = '#5a3a22'; x.fillRect(r0 + 20, GY - RH + 60, 58, 60); }
    if (kind === 'official') { x.fillStyle = '#c8a050'; x.fillRect(r0 + 20, GY - RH + 60, 64, 80); x.fillStyle = '#3a2830'; x.fillRect(r0 + 26, GY - RH + 66, 52, 68); x.fillStyle = '#6a5a4a'; x.beginPath(); x.arc(r0 + 52, GY - RH + 92, 11, 0, TAU); x.fill(); x.fillRect(r0 + 38, GY - RH + 104, 28, 30); }
    if (kind === 'congress') flag(x, r0 + 24, GY - RH + 56, 58, 38);
  }

  const SKIN = '#e0b48c';
  const DRESS = { police: { coat: '#26325e', low: '#1e2848' }, judge: { coat: '#15131c', low: '#15131c' }, official: { coat: '#4a4038', low: '#3a322c' }, congress: { coat: '#2c2a34', low: '#24222a' } };
  function man(x, kind, f, take, away, rise) {
    const d = DRESS[kind], rest = [12, -50], env = [30, -46 - 6 * rise], pocket = [-2, -62];
    if (away >= .5) return backView(x, kind, d);
    if (kind === 'judge') { x.fillStyle = d.coat; polyPath(x, [[-9, -73], [9, -73], [15, 0], [-15, 0]]); x.fill(); x.fillStyle = '#0a0a18'; x.beginPath(); x.ellipse(-6, -.8, 4.6, 2, 0, 0, TAU); x.ellipse(6, -.8, 4.6, 2, 0, 0, TAU); x.fill(); }
    else {
      line(x, [[-4, -45], [-5, -1]], 6.5, d.low); line(x, [[4, -45], [5, -1]], 6.5, d.low);
      x.fillStyle = '#0a0a18'; x.beginPath(); x.ellipse(-6, -.8, 4.6, 2, 0, 0, TAU); x.ellipse(6, -.8, 4.6, 2, 0, 0, TAU); x.fill();
      x.fillStyle = d.coat; polyPath(x, [[-10, -73], [10, -73], [12, -36], [-12, -36]]); x.fill();
    }
    if (kind === 'police') { x.fillStyle = '#0a0a18'; x.fillRect(-12, -42, 24, 4); x.fillStyle = '#c8a040'; for (const y of [-67, -59, -51]) x.fillRect(-.8, y, 1.6, 1.6); star(x, -5, -63, 2.6); }
    if (kind === 'judge') { x.fillStyle = '#f4f0f8'; x.fillRect(-2.2, -71, 1.8, 6); x.fillRect(.4, -71, 1.8, 6); }
    if (kind === 'official' || kind === 'congress') { x.fillStyle = '#f0ece4'; polyPath(x, [[-4, -73], [4, -73], [0, -62]]); x.fill(); }
    if (kind === 'official') { x.fillStyle = '#6a2a2a'; polyPath(x, [[-1, -71], [1, -71], [1.4, -63], [0, -61], [-1.4, -63]]); x.fill(); x.strokeStyle = '#c8a040'; x.lineWidth = .8; x.beginPath(); x.moveTo(-8, -46); x.quadraticCurveTo(-2, -41, 5, -46); x.stroke(); }
    if (kind === 'congress') { x.fillStyle = '#b23a3a'; polyPath(x, [[0, -71], [-3.5, -73], [-3.5, -69]]); x.fill(); polyPath(x, [[0, -71], [3.5, -73], [3.5, -69]]); x.fill(); x.fillStyle = '#e8e4ec'; x.fillRect(-7, -66, 2.2, 1.4); x.fillStyle = '#2c3a78'; x.fillRect(-7, -66, 1, .8); }
    const aw = kind === 'judge' ? 5.4 : 4.4;
    line(x, [[-8, -70], [-11, -49]], aw, d.coat);
    const u1 = easeIO(clamp(take / .45)), u2 = easeIO(clamp((take - .45) / .55));
    const hand = take <= .45 ? [lerp(rest[0], env[0] - 3, u1), lerp(rest[1], env[1] + 2, u1)] : [lerp(env[0] - 3, pocket[0], u2), lerp(env[1] + 2, pocket[1], u2)];
    const sh = [8, -70], mid = [(sh[0] + hand[0]) / 2, (sh[1] + hand[1]) / 2], el = [mid[0] + 3, mid[1] + 6];
    const ea = take < .9 ? 1 : 1 - smooth((take - .9) / .1), ep = take <= .45 ? env : [hand[0] + 3, hand[1] - 2];
    if (rise > 0 && ea > 0) { x.save(); x.globalAlpha = ea; x.translate(ep[0], ep[1]); x.rotate(take <= .45 ? -.25 : -.6 * u2); envelope(x); x.restore(); }
    x.strokeStyle = d.coat; x.lineWidth = aw; x.lineCap = 'round'; x.beginPath(); x.moveTo(sh[0], sh[1]); x.lineTo(el[0], el[1]); x.lineTo(hand[0], hand[1]); x.stroke();
    x.fillStyle = SKIN; x.beginPath(); x.arc(hand[0], hand[1], 2.8, 0, TAU); x.fill();
    x.fillStyle = SKIN; x.fillRect(-2, -77, 4, 7);
    x.save(); x.translate(0, -82);
    x.fillStyle = SKIN; x.beginPath(); x.arc(0, 0, 6.5, 0, TAU); x.fill();
    const s = Math.sign(f) || 1, af = Math.abs(f);
    if (af > .15) { x.beginPath(); x.moveTo(f * 5.6, -1.6); x.lineTo(f * 5.6 + s * 2.6 * af, 1.2); x.lineTo(f * 5.6, 1.8); x.fill(); }
    x.fillStyle = '#2a2024'; x.beginPath(); x.arc(f * 3.2, -1.2, .95, 0, TAU); x.fill();
    if (af > .4) { x.fillStyle = '#c89a74'; x.beginPath(); x.ellipse(-f * 1.6, .4, 1.3, 1.9, 0, 0, TAU); x.fill(); }
    if (kind === 'police') {
      x.fillStyle = '#1e2848'; polyPath(x, [[-7, -4.5], [7, -4.5], [9, -10.5], [-9, -10.5]]); x.fill(); x.fillStyle = '#0a0a18'; x.fillRect(-7, -5, 14, 1.8);
      x.beginPath(); x.ellipse(f * 6.5, -3.6, 1.2 + 4 * af, 1.3, 0, 0, TAU); x.fill(); star(x, f * 2.5, -7.6, 1.4);
    } else if (kind === 'official') { x.fillStyle = '#0a0a18'; x.beginPath(); x.ellipse(0, -5, 10.5, 2.3, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(0, -5.5, 7, 6.5, 0, Math.PI, TAU); x.fill(); }
    else {
      x.fillStyle = kind === 'judge' ? '#a8a4b4' : '#ece8f0'; x.beginPath(); x.arc(0, 0, 6.9, Math.PI * 1.08, Math.PI * 1.92); x.fill();
      x.beginPath(); x.ellipse(-f * 4.4, 0, 2.6, 5, 0, 0, TAU); x.fill();
    }
    x.restore();
  }
  const HAIR = { police: '#2a2024', judge: '#a8a4b4', official: '#4a3424', congress: '#ece8f0' };
  function backView(x, kind, d) {
    if (kind === 'judge') { x.fillStyle = d.coat; polyPath(x, [[-9, -73], [9, -73], [15, 0], [-15, 0]]); x.fill(); }
    else { line(x, [[-4, -45], [-5, -1]], 6.5, d.low); line(x, [[4, -45], [5, -1]], 6.5, d.low); x.fillStyle = d.coat; polyPath(x, [[-10, -73], [10, -73], [12, -36], [-12, -36]]); x.fill(); }
    x.fillStyle = '#0a0a18'; x.beginPath(); x.ellipse(-6, -.8, 4.6, 2, 0, 0, TAU); x.ellipse(6, -.8, 4.6, 2, 0, 0, TAU); x.fill();
    if (kind === 'police') { x.fillStyle = '#0a0a18'; x.fillRect(-12, -42, 24, 4); }
    const aw = kind === 'judge' ? 5.4 : 4.4; line(x, [[-8, -70], [-11, -49]], aw, d.coat); line(x, [[8, -70], [11, -49]], aw, d.coat);
    x.fillStyle = SKIN; x.fillRect(-2, -77, 4, 7); x.beginPath(); x.ellipse(-6.3, -82, 1.3, 1.9, 0, 0, TAU); x.ellipse(6.3, -82, 1.3, 1.9, 0, 0, TAU); x.fill();
    x.fillStyle = HAIR[kind]; x.beginPath(); x.arc(0, -82.4, 6.6, 0, TAU); x.fill();
    x.save(); x.translate(0, -82);
    if (kind === 'police') { x.fillStyle = '#1e2848'; polyPath(x, [[-7, -4.5], [7, -4.5], [9, -10.5], [-9, -10.5]]); x.fill(); x.fillStyle = '#0a0a18'; x.fillRect(-7, -5, 14, 1.8); }
    if (kind === 'official') { x.fillStyle = '#0a0a18'; x.beginPath(); x.ellipse(0, -5, 10.5, 2.3, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(0, -5.5, 7, 6.5, 0, Math.PI, TAU); x.fill(); }
    x.restore();
  }
  function star(x, cx, cy, r) { x.fillStyle = '#c8a040'; x.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * .45 : r; x.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); } x.fill(); }
  function envelope(x) {
    x.fillStyle = '#6f9a58'; x.fillRect(-6, -10, 10, 5);
    x.fillStyle = '#f4ecd8'; x.fillRect(-9, -6, 18, 12); x.strokeStyle = '#b8a888'; x.lineWidth = .7; x.beginPath(); x.moveTo(-9, -6); x.lineTo(0, 1); x.lineTo(9, -6); x.stroke();
  }
  function people(x, t) {
    for (const b of BLD) {
      const rise = back((t - b.arrive) / .25), look = smooth((t - b.arrive + .1) / .3), turn = easeIO(clamp((t - b.turn) / .45));
      const f = lerp(.5, 1, look), k = Math.max(.2, Math.abs(Math.cos(Math.PI * turn)));
      x.save(); x.translate(b.fx, GY - 8); x.scale(FS * k, FS); man(x, b.kind, f, clamp((t - b.take) / .6), turn, rise); x.restore();
    }
  }

  const KEYS = M45
    ? [[0, [960, 1110, 1.25]], [K.illegal + .2, [960, 1100, 1.3]], [K.protection + .9, [960, 575, .96]], [K.police - .45, [960, 560, .98]], [K.police + .35, [700, 450, 1.75]],
      [K.judges + .5, [740, 450, 1.75]], [K.city + .6, [960, 450, 1.75]], [K.congress - .2, [1220, 450, 1.75]], [K.took + .4, [960, 430, 1]], [DUR, [960, 430, 1.02]]]
    : [[0, [960, 1090, 1.25]], [K.illegal + .2, [960, 1080, 1.3]], [K.protection + .9, [960, 560, .8]], [K.police - .45, [960, 540, .84]], [K.police + .35, [480, 450, 1.6]],
      [K.judges + .5, [540, 450, 1.6]], [K.city + .6, [1000, 450, 1.6]], [K.congress - .2, [1440, 450, 1.6]], [K.took + .4, [960, 450, 1.03]], [DUR, [960, 452, 1.04]]];
  const LK = KEYS.map(([t, v]) => [t, [v[0], v[1], Math.log(v[2])]]);
  function camera(t) { const v = keyed(t, LK); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { ground(x, tp); vault(x, t, tp); BLD.forEach((b, i) => building(x, b, i)); tubes(x, t); people(x, t); }, { glow: .35, glowBlur: 12 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    PR.glow(ctx, VAULT.x, VAULT.y, 320, B.amber, .4, 'lightbox');
    for (const s of SPEAK) PR.glow(ctx, s.x, s.y - 70, 150, '#ffcf80', .3, 'lightbox');
    for (const b of BLD) {
      PR.glow(ctx, b.bx - 50, GY - RH + 46, 200, '#ffd9a0', .35, 'lightbox');
      if (b.kind === 'police') for (const s of [-1, 1]) PR.glow(ctx, b.bx + s * (RW / 2 + 7), GY - RH + 26, 60, '#8ab4ff', .6, 'lightbox');
      if (b.kind === 'official') PR.glow(ctx, b.bx, GY - RH - UH - 95, 80, '#ffe3b0', .45, 'lightbox');
      const u = (t - b.launch) / (b.arrive - b.launch); if (u > 0 && u < 1) { const p = along(b, easeIO(u)); PR.glow(ctx, p[0], p[1], 70, B.amber, .7, 'lightbox'); }
      const pop = 1 - smooth((t - b.arrive) / .5); if (t > b.arrive && pop > 0) PR.glow(ctx, b.mx, b.my - 20, 90, '#ffe3b0', .6 * pop, 'lightbox');
    }
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.protection, K.gangs, K.police, K.judges, K.city, K.congress, K.looked],
  });
})();
