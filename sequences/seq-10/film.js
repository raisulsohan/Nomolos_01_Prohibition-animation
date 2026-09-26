(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-10', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('flat', W, H), P = L.P, pose = L.pose;
  const K = { machine: 1.268, league: 2.069, disciplined: 3.17, single: 4.438,
    ruthlessly: 5.306, effective: 6.04, they: 7.207, politician: 8.442, drank: 9.043,
    private: 9.543, cared: 10.744, voted: 11.545, backed: 12.913, ban: 14.448,
    destroyed: 15.282, not: 16.55, process: 17.851, more: 18.686, modern: 19.887, campaign: 21.355 };
  const hexA = (h, a) => FILM.rgba(FILM.hex(h), a);
  const PS = 1.9, BRASS = '#c8a050', BRASS2 = '#a8842f', STEEL = '#8f98a8', IRON = '#3a4458', NAVY = P.sheet2;

  const beatAt = t => t < K.single + .3 ? .5 : .32;
  function steps(t) {
    const t1 = K.single + .3, n0 = Math.floor(Math.min(t, t1) / .5), f0 = (Math.min(t, t1) - n0 * .5) / .5;
    let s = n0 + easeIO(clamp(f0 / .35));
    if (t > t1) { const u = t - t1, n1 = Math.floor(u / .32), f1 = (u - n1 * .32) / .32; s = Math.floor(t1 / .5) + ((t1 / .5) % 1 > .35 ? 1 : easeIO(((t1 / .5) % 1) / .35)) + n1 + easeIO(clamp(f1 / .35)); }
    return s;
  }
  const pulse = t => { const b = beatAt(t), f = ((t < K.single + .3 ? t : t - (K.single + .3)) % b) / b; return 1 - easeOut(clamp(f / .3)); };

  function gear(x, cx, cy, r, n, a, col, hole) {
    const p = TAU / n, tooth = r * .13;
    x.save(); x.translate(cx, cy); x.rotate(a); x.fillStyle = col; x.beginPath();
    for (let k = 0; k < n; k++) for (const [da, rr] of [[-.27, r], [-.16, r + tooth], [.16, r + tooth], [.27, r]]) { const aa = (k + da) * p; x.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); }
    x.closePath(); x.fill();
    x.fillStyle = hole; for (let k = 0; k < 5; k++) { const a0 = k / 5 * TAU + .15; x.beginPath(); x.arc(0, 0, r * .74, a0, a0 + .95); x.arc(0, 0, r * .3, a0 + .95, a0, true); x.closePath(); x.fill(); }
    x.fillStyle = IRON; x.beginPath(); x.arc(0, 0, r * .16, 0, TAU); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(0, 0, r * .06, 0, TAU); x.fill();
    x.restore();
  }
  const TRAIN = (() => {
    const g = [{ c: [0, -360], r: 200, n: 24, col: BRASS }];
    const add = (i, r, n, ang, col) => { const q = g[i], d = q.r + r + q.r * .06; g.push({ c: [q.c[0] + Math.cos(ang) * d, q.c[1] + Math.sin(ang) * d], r, n, col, parent: i }); };
    add(0, 120, 14, -.35, STEEL); add(0, 100, 12, 3.55, STEEL); add(1, 70, 9, -1.2, BRASS); add(2, 62, 8, -1.9, BRASS); add(0, 80, 10, 1.75, IRON);
    return g;
  })();
  function angles(t) {
    const a = [steps(t) * TAU / TRAIN[0].n];
    for (let i = 1; i < TRAIN.length; i++) { const g = TRAIN[i], q = TRAIN[g.parent]; a[i] = -a[g.parent] * q.n / g.n + Math.PI / g.n; }
    return a;
  }
  const BOXES = [-500, -300, -100, 100, 300, 500];
  function machine(x, t, tp) {
    x.fillStyle = NAVY; x.fillRect(-1300, -1100, 2700, 1100); x.fillStyle = '#1f2a3c'; x.fillRect(-1300, 0, 2700, 500);
    x.fillStyle = '#34425a'; x.fillRect(-640, -760, 1280, 700); x.fillStyle = IRON; x.fillRect(-660, -780, 1320, 30); x.fillRect(-660, -80, 1320, 30);
    const a = angles(tp); TRAIN.forEach((g, i) => gear(x, g.c[0], g.c[1], g.r, g.n, a[i], g.col, '#2a3548'));
    const p = pulse(tp), by = -150 + 46 * p;
    x.fillStyle = STEEL; x.fillRect(-560, by - 14, 1120, 18);
    for (const bx of BOXES) {
      x.fillStyle = STEEL; x.fillRect(bx - 5, by, 10, 40); x.fillStyle = IRON; x.fillRect(bx - 30, by + 40, 60, 14);
      x.fillStyle = P.wood; x.fillRect(bx - 55, -40 + 0, 110, 80); x.fillStyle = P.woodDark; x.fillRect(bx - 55, -40, 110, 10); x.fillStyle = '#1b2130'; x.fillRect(bx - 22, -41, 44, 5);
      x.fillStyle = P.card; x.fillRect(bx - 16, by + 54 - 30 * (1 - p), 32, 22 * (1 - p * .6));
    }
    x.fillStyle = BRASS2; x.fillRect(-380, -905, 760, 110); x.fillStyle = BRASS; x.fillRect(-372, -897, 744, 94);
    x.fillStyle = P.ink; x.font = '900 60px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('ANTI-SALOON LEAGUE', 0, -848);
    const pull = easeIO(clamp((tp - K.single) / .3));
    x.fillStyle = IRON; x.fillRect(-900, -120, 190, 120); x.fillStyle = '#2a3548'; x.fillRect(-890, -110, 170, 100);
    for (const [k, lx] of [[0, -870], [1, -805], [2, -740]]) { x.save(); x.translate(lx, -120); x.rotate(k === 1 ? lerp(-.5, .5, pull) : -.5); x.fillStyle = STEEL; x.fillRect(-3, -70, 6, 70); x.fillStyle = P.red; x.beginPath(); x.arc(0, -72, 9, 0, TAU); x.fill(); x.restore(); }
    x.save(); x.translate(-780, 0); x.scale(PS, PS); PR.person(x, P, { kind: 'man', coat: '#1b2130', trouser: '#141a26', hat: 'bowler', hatColor: '#0e121a', arm: .15 + .35 * (1 - pull) }); x.restore();
  }
  const BOOTH = 1600, GLASS = [BOOTH - 150, -150], HAND = [BOOTH + 175, -170], BBOX = [BOOTH + 205, -40];
  function room(x) { x.fillStyle = '#223047'; x.fillRect(1400, -1100, 2900, 1100); x.fillStyle = '#1f2a3c'; x.fillRect(1400, 0, 2900, 500); }
  function booth(x, t, tp) {
    const drop = easeIn(clamp((tp - K.voted) / .35), 1.6);
    x.save(); x.beginPath(); x.rect(BOOTH - 130, -1000, 260, 1000); x.clip();
    x.save(); x.translate(BOOTH, 0); x.scale(PS, PS); PR.person(x, P, { kind: 'man', coat: P.coat, trouser: P.trouser, hat: 'bowler', hatColor: P.cap }); x.restore(); x.restore();
    x.fillStyle = P.wood; x.fillRect(BOOTH - 140, -360, 280, 22); x.fillRect(BOOTH - 140, -360, 14, 360); x.fillRect(BOOTH + 126, -360, 14, 360);
    x.fillStyle = '#efe3c6'; x.fillRect(BOOTH - 126, -338, 252, 260); x.fillStyle = 'rgba(95,111,134,.35)'; for (let k = 0; k < 7; k++) x.fillRect(BOOTH - 118 + k * 36, -338, 6, 260);
    x.fillStyle = P.coat; x.fillRect(GLASS[0] + 8, GLASS[1] - 6, 26, 16); x.fillStyle = P.skin; x.beginPath(); x.ellipse(GLASS[0] + 4, GLASS[1] + 2, 11, 9, 0, 0, TAU); x.fill();
    PR.shotGlass(x, P, GLASS[0] - 2, GLASS[1] - 6, .6, .7);
    x.fillStyle = P.coat; x.fillRect(BOOTH + 126, HAND[1] - 6, HAND[0] - BOOTH - 136, 16); x.fillStyle = P.skin; x.beginPath(); x.ellipse(HAND[0], HAND[1] + 2, 11, 9, 0, 0, TAU); x.fill();
    x.fillStyle = P.woodDark; x.fillRect(BBOX[0] - 50, BBOX[1] - 70, 100, 70); x.fillRect(BBOX[0] - 8, BBOX[1], 16, 40); x.fillStyle = P.wood; x.fillRect(BBOX[0] - 50, BBOX[1] - 70, 100, 12);
    x.fillStyle = '#141a26'; x.fillRect(BBOX[0] - 24, BBOX[1] - 72, 48, 6);
    if (drop < 1) { x.save(); x.translate(lerp(HAND[0] + 12, BBOX[0], drop), lerp(HAND[1] + 14, BBOX[1] - 70, drop)); x.rotate(.3 - .3 * drop); x.fillStyle = P.card; x.fillRect(-14, -9, 28, 18); x.strokeStyle = P.ink; x.lineWidth = 2; x.beginPath(); x.moveTo(-6, 0); x.lineTo(-1, 5); x.lineTo(8, -5); x.stroke(); x.restore(); }
  }
  const LAMP = [620, -760];
  const spotAt = t => { const v = keyed(t, [[K.they, [900, -300]], [K.drank + .2, [GLASS[0] - 60, GLASS[1]]], [K.private + .6, [BOOTH + 60, -230]], [K.voted - .25, [HAND[0] + 20, HAND[1] + 30]]]); return [v[0], v[1]]; };
  const spotOn = t => smooth((t - K.they) / .4) * (1 - smooth((t - K.backed + .4) / .5));
  function searchlight(ctx, t) {
    const on = spotOn(t); if (on <= 0) return;
    const s = spotAt(t), r = lerp(130, 95, smooth((t - K.voted + .3) / .4));
    ctx.save(); ctx.fillStyle = hexA('#05080f', .55 * on); ctx.beginPath(); ctx.rect(-5000, -5000, 14000, 10000); ctx.ellipse(s[0], s[1], r, r * .8, 0, 0, TAU); ctx.fill('evenodd');
    ctx.fillStyle = hexA('#fff1d0', .12 * on); ctx.beginPath(); ctx.moveTo(LAMP[0], LAMP[1]); ctx.lineTo(s[0] - r * .7, s[1] - r * .5); ctx.lineTo(s[0] + r * .7, s[1] + r * .5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = hexA('#fff1d0', .16 * on); ctx.beginPath(); ctx.ellipse(s[0], s[1], r, r * .8, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  function lamp(x) { x.save(); x.translate(LAMP[0], LAMP[1]); x.rotate(.6); x.fillStyle = IRON; x.fillRect(-40, -26, 80, 52); x.fillStyle = '#fff1d0'; x.fillRect(38, -20, 10, 40); x.restore(); }

  const figure = (x, px, py, s, dry, rot = 0, arm = dry ? 0 : .45) => {
    x.save(); x.translate(px, py); x.rotate(rot); x.scale(s, s);
    PR.person(x, P, { kind: 'man', coat: dry ? '#44536b' : '#7a4f3a', trouser: P.trouser, hat: dry ? 'bowler' : 'wide', hatColor: P.cap, ribbon: dry, arm });
    if (!dry) PR.shotGlass(x, P, 16, -84, .22, .7);
    x.restore();
  };
  const glowAt = (x, cx, cy, r, a) => { const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, hexA('#ffd08a', .5 * a)); g.addColorStop(1, hexA('#ffd08a', 0)); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill(); };

  const STAMPS = [K.backed + .3, K.destroyed, K.ban - .2, K.not - .15];
  const CARDS = M45 ? [[2981, -678, 1], [3279, -678, 0], [3279, -194, 1], [2981, -194, 0]]
    : [[2700, -440, 1], [2985, -440, 0], [3270, -440, 1], [3555, -440, 0]];
  const RAILS = (M45 ? [[-998, 2500, 3760, [0, 1]], [-514, 2500, 3760, [2, 3]]] : [[-760, 2400, 3900, [0, 1, 2, 3]]]).map(([y, x0, x1, cards]) => {
    const order = [...cards].sort((a, b) => STAMPS[a] - STAMPS[b]), path = [[K.backed - .2, x0 + 50]];
    order.forEach((i, n) => { const [cx, , dry] = CARDS[i]; path.push([STAMPS[i] - (dry ? .15 : .2), cx], [STAMPS[i] + (n === order.length - 1 ? .3 : .25), cx]); });
    path.push([K.not + .9, x1 - 50]);
    return { y, x0, x1, cards, path };
  });
  function portrait(x, cx, cy, dry, frame) {
    x.fillStyle = frame; x.fillRect(cx - 104, cy - 134, 208, 268); x.fillStyle = '#d9cdb0'; x.fillRect(cx - 92, cy - 122, 184, 244);
    x.save(); x.beginPath(); x.rect(cx - 92, cy - 122, 184, 244); x.clip(); figure(x, cx, cy + 230, 3.1, dry); x.restore();
  }
  function wallStage(x, t, tp) {
    x.fillStyle = IRON; for (const r of RAILS) x.fillRect(r.x0, r.y, r.x1 - r.x0, 16);
    const falling = [];
    CARDS.forEach(([cx, cy, dry], i) => {
      const s = STAMPS[i], hit = tp - s;
      if (dry) {
        const gold = smooth(hit / .15);
        if (gold > 0) glowAt(x, cx, cy, 240, gold);
        portrait(x, cx, cy, true, gold > .5 ? BRASS : P.woodDark);
        if (gold > 0) { x.fillStyle = BRASS; x.save(); x.translate(cx, cy - 134); x.scale(gold, gold); polyPath(x, [...Array(10).keys()].map(k => { const a = k / 10 * TAU - Math.PI / 2, r = k % 2 ? 17 : 40; return [Math.cos(a) * r, Math.sin(a) * r]; })); x.fill(); x.restore(); }
      } else {
        const tear = easeIn(clamp((hit - .4) / .7), 1.6), crossed = () => { portrait(x, cx, cy, false, P.woodDark); if (hit > 0) { x.strokeStyle = P.ink; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx - 66, cy - 90); x.lineTo(cx + 66, cy + 90); x.moveTo(cx + 66, cy - 90); x.lineTo(cx - 66, cy + 90); x.stroke(); x.lineCap = 'butt'; } };
        if (tear <= 0) crossed();
        else if (tear < 1) falling.push(() => { for (const d of [-1, 1]) { x.save(); x.translate(cx + d * 30 * tear, cy + 700 * tear * tear); x.rotate(d * .5 * tear); x.translate(-cx, -cy); x.beginPath(); x.rect(d < 0 ? cx - 110 : cx, cy - 140, 110, 280); x.clip(); crossed(); x.restore(); } });
      }
    });
    for (const f of falling) f();
    for (const r of RAILS) {
      const sx = keyed(tp, r.path), press = Math.max(...r.cards.map(i => { const h = tp - STAMPS[i]; return h > -.12 && h < .2 ? (h < 0 ? easeIn(1 + h / .12, 2) : 1 - smooth(h / .2)) : 0; }));
      x.fillStyle = '#2a3548'; x.fillRect(sx - 40, r.y, 80, 40); x.fillStyle = STEEL; x.fillRect(sx - 8, r.y + 40, 16, 70 + 200 * press); x.fillStyle = IRON; x.fillRect(sx - 46, r.y + 110 + 200 * press, 92, 26);
    }
  }

  const SM = 122, CENTER = [1450, -300], M = (() => { const m0 = FILM.usmap({ width: 1320 * SM, cx: 0, cy: 0 }), p = m0.proj([-82.93, 40.13]); return FILM.usmap({ width: 1320 * SM, cx: CENTER[0] - p[0], cy: CENTER[1] - p[1] }); })();
  const MAPC = M.proj([-96.5, 38.6]);
  function statesFor(map, center, sm) {
    const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
    const b = map.us.reduce((a, [x, y]) => [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)], [1e12, 1e12, -1e12, -1e12]), r = rng(48);
    const out = Object.values(map.cities).filter(p => Math.hypot(p[0] - center[0], p[1] - center[1]) > 60 * sm);
    while (out.length < 44) { const p = [lerp(b[0], b[2], r()), lerp(b[1], b[3], r())]; if (inside(p, map.us) && out.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > 95 * sm) && Math.hypot(p[0] - center[0], p[1] - center[1]) > 70 * sm) out.push(p); }
    const far = Math.max(...out.map(p => Math.hypot(p[0] - center[0], p[1] - center[1])));
    return out.map(p => ({ p, t: K.more + (K.modern + .5 - K.more) * Math.hypot(p[0] - center[0], p[1] - center[1]) / far }));
  }
  const STATES = statesFor(M, CENTER, SM);
  function mapLayer(x, t, tp) {
    if (t < K.process - .2) return;
    x.fillStyle = '#1b2638'; polyPath(x, M.canada); x.fill(); polyPath(x, M.mexico); x.fill();
    x.fillStyle = P.sheet; polyPath(x, M.us); x.fill();
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; for (const l of Object.values(M.lakes)) { polyPath(x, l); x.fill(); } x.globalCompositeOperation = 'source-over';
  }
  function mapGears(x, t, tp) {
    const hub = smooth((t - K.more + .2) / .4); if (hub <= 0) return;
    const a = angles(tp)[0];
    x.strokeStyle = hexA(BRASS2, .9); x.lineWidth = 2.2 * SM;
    for (const s of STATES) { const u = clamp((tp - s.t + .35) / .35); if (u <= 0) continue; x.beginPath(); x.moveTo(CENTER[0], CENTER[1]); x.lineTo(lerp(CENTER[0], s.p[0], u), lerp(CENTER[1], s.p[1], u)); x.stroke(); }
    x.globalAlpha = hub; gear(x, CENTER[0], CENTER[1], 22 * SM, 16, a, BRASS, IRON); x.globalAlpha = 1;
    for (const s of STATES) { const u = back((tp - s.t) / .25); if (u > 0) gear(x, s.p[0], s.p[1], 10 * u * SM, 10, -a * 1.6, STEEL, IRON); }
  }
  const back = u => { u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  function title(ctx, t) {
    const a = smooth((t - K.modern) / .3); if (a <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
    const cx = W / 2, cy = M45 ? 150 : 96, w = M45 ? 900 : 1100, h = M45 ? 150 : 96;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 6, cy - h / 2 + 8, w, h, 8); ctx.fill();
    ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 8); ctx.fill();
    ctx.fillStyle = '#2c2824'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 52 : 58}px NSC`;
    if (M45) { ctx.fillText('SINGLE-ISSUE', cx, cy - 30); ctx.fillText('PRESSURE CAMPAIGN', cx, cy + 30); } else ctx.fillText('SINGLE-ISSUE PRESSURE CAMPAIGN', cx, cy + 2);
    ctx.restore();
  }

  const mz = M45 ? .62 : 1, lz = z => Math.log(z * mz);
  const KEYS = [[0, [70, -380, lz(3.4)]], [K.machine + .2, [60, -370, lz(3)]], [K.league + .9, [-120, -380, lz(.95)]], [K.they + .1, [-100, -380, lz(1)]],
    [K.politician, [1480, -260, lz(1.5)]], [K.private + .6, [1560, -230, lz(1.55)]], [K.voted, [1720, -200, lz(1.9)]], [K.cared + 1.8, [1720, -200, lz(1.9)]],
    ...(M45 ? [[K.backed + .2, [3130, -520, Math.log(1.2)]], [K.process, [3130, -520, Math.log(1.16)]]]
      : [[K.backed + .2, [3125, -430, lz(1.5)]], [K.process, [3130, -430, lz(1.45)]]]), [K.more + .3, [CENTER[0], CENTER[1], lz(.02)]], [K.modern + .6, [MAPC[0], MAPC[1] + 60 * SM, lz(1.25 / SM)]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t), tiny = 1 - smooth((t - K.more) / .5);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => {
      mapLayer(x, t, tp);
      if (tiny > 0) { x.globalAlpha = tiny; room(x); machine(x, t, tp); lamp(x); booth(x, t, tp); wallStage(x, t, tp); x.globalAlpha = 1; }
      mapGears(x, t, tp);
    }, {});
    FILM.sheet(ctx, cam, 1, W, H, R); searchlight(ctx, t);
    title(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.machine, K.league, K.single, K.drank, K.voted, K.backed, K.destroyed, K.modern],
  });
})();
