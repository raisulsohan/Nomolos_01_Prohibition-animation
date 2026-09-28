(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-29', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('flat', W, H), P = L.P, pose = L.pose;
  const K = { industrial: 1.268, kind: 2.902, factories: 3.536, government: 4.704, laced: 5.639,
    chemicals: 6.473, thinking: 8.041, horror: 9.109, scare: 9.943, away: 10.744,
    people: 11.945, drank: 12.312, anyway: 12.746, some1: 13.713, poor: 14.581, afford: 14.981, else1: 15.615,
    some2: 16.416, sold: 17.083, bootleggers: 17.55, stolen: 18.485, cleaned: 19.219, resell: 20.52 };
  const GREEN = '#8fc43a', TINT = '#cdd98e', INK = P.ink, back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };
  const mix = (a, b, k) => FILM.rgba(FILM.mixc(FILM.hex(a), FILM.hex(b), clamp(k)));
  const FY = 820;

  const BAR = [300, 480, 660].map((x, i) => ({ x, t: K.laced - .1 + i * .55 }));
  const DOCK = FY - 40;
  function factory(x, tp) {
    x.fillStyle = P.sheet2; x.fillRect(-500, 160, 1450, FY - 160);
    for (let k = 0; k < 6; k++) polyPath(x, [[-500 + k * 240, 160], [-500 + k * 240 + 240, 160], [-500 + k * 240 + 240, 60]]), x.fill();
    for (const [sx, top] of [[-40, -260], [200, -200], [760, -300]]) { x.fillRect(sx - 36, top, 72, 300); x.fillStyle = '#3a4660'; x.fillRect(sx - 42, top, 84, 22); x.fillStyle = P.sheet2; }
    x.fillStyle = FILM.rgba(FILM.hex(P.window), .8); for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) x.fillRect(-440 + c * 150, 250 + r * 130, 70, 80);
    for (const [sx, top, ph] of [[-40, -260, 0], [200, -200, .4], [760, -300, .7]]) for (let k = 0; k < 4; k++) {
      const u = ((tp * .25 + ph + k * .25) % 1); x.fillStyle = FILM.rgba(FILM.hex(P.sheetDim), .55 * (1 - u)); x.beginPath(); x.arc(sx + 90 * u, top - 40 - 260 * u, 40 + 50 * u, 0, TAU); x.fill();
    }
    x.fillStyle = P.wood; x.fillRect(60, DOCK, 880, 40); x.fillStyle = P.woodDark; x.fillRect(60, DOCK + 32, 880, 8);
  }
  function barrel(x, bx, by, green, stencil = 'INDUSTRIAL', painted = 0) {
    const bw = 150, bh = 220;
    x.fillStyle = '#8a5a36'; x.beginPath(); x.roundRect(bx - bw / 2, by - bh, bw, bh, 22); x.fill();
    x.fillStyle = 'rgba(40,24,14,.25)'; for (let k = 1; k < 5; k++) x.fillRect(bx - bw / 2 + k * bw / 5 - 1.5, by - bh + 8, 3, bh - 16);
    x.fillStyle = '#3a3a44'; for (const y of [by - bh + 26, by - bh / 2 - 6, by - 34]) x.fillRect(bx - bw / 2 - 3, y, bw + 6, 10);
    x.fillStyle = INK; x.font = '900 21px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(stencil, bx, by - bh / 2 + 30);
    if (painted > 0) { x.fillStyle = P.sheetShade; x.save(); x.beginPath(); x.rect(bx - bw / 2 + 6, by - bh / 2 + 12, (bw - 12) * painted, 36); x.clip(); x.beginPath(); x.roundRect(bx - bw / 2 + 6, by - bh / 2 + 12, bw - 12, 36, 10); x.fill(); x.restore(); }
    x.fillStyle = '#5a3a24'; x.beginPath(); x.ellipse(bx, by - bh, bw / 2 - 2, 14, 0, 0, TAU); x.fill();
    x.fillStyle = mix(P.amber, GREEN, green); x.beginPath(); x.ellipse(bx, by - bh + 2, bw / 2 - 12, 9, 0, 0, TAU); x.fill();
  }
  const handAt = t => {
    const inU = easeOut(clamp((t - K.government + .1) / .5)), outU = easeIO(clamp((t - K.chemicals - .6) / .5));
    const hx = t < BAR[0].t ? BAR[0].x + 90 : t < BAR[1].t ? lerp(BAR[0].x, BAR[1].x, easeIO(clamp((t - BAR[1].t + .3) / .3))) + 90 : lerp(BAR[1].x, BAR[2].x, easeIO(clamp((t - BAR[2].t + .3) / .3))) + 90;
    return [hx, lerp(-420, 300, inU) - 900 * outU];
  };
  const pourAt = t => Math.max(...BAR.map(b => { const u = (t - b.t) / .5; return u > 0 && u < 1 ? Math.sin(u * Math.PI) : 0; }));
  function governmentHand(x, t) {
    if (t < K.government - .15 || t > K.chemicals + 1.2) return;
    const [hx, hy] = handAt(t), tilt = -.95 * easeIO(clamp((t - BAR[0].t + .25) / .25)) * (1 - easeIO(clamp((t - BAR[2].t - .5) / .3)));
    const J = 1.4, NECK = [4, 17], o = { h: [0, 0], side: 1, r: 43, grip: 1, skin: P.skin, s: .7, arm: -Math.PI / 2 - tilt, style: 'fingers' };
    const wl = FILM.hand.wrist(o), jw = p => [hx + J * (Math.cos(tilt) * (NECK[0] + p[0]) - Math.sin(tilt) * (NECK[1] + p[1])), hy + J * (Math.sin(tilt) * (NECK[0] + p[0]) + Math.cos(tilt) * (NECK[1] + p[1]))];
    const w = { p: jw(wl.p), w: wl.w * J }, top = jw([wl.p[0], -31]);
    FILM.hand.arm(x, w, [w.p[0], hy - 1200], { sleeve: P.sleeve, cuff: '#f5ecd8', link: '#c8a040', cuffAt: Math.max(20, w.p[1] - top[1] + 8), taper: 1.15 });
    x.save(); x.translate(hx, hy); x.rotate(tilt); x.scale(J, J);
    x.save(); x.translate(NECK[0], NECK[1]); FILM.hand.back(x, o); x.restore();
    x.fillStyle = P.cream; x.beginPath(); x.moveTo(-50, 24); x.quadraticCurveTo(-64, 110, -30, 150); x.lineTo(40, 150); x.quadraticCurveTo(70, 110, 52, 24); x.closePath(); x.fill();
    x.fillRect(-26, 4, 60, 26); polyPath(x, [[-26, 6], [-54, -6], [-44, 16]]); x.fill();
    x.fillStyle = GREEN; x.fillRect(-44, 96, 88, 8);
    x.fillStyle = INK; x.font = '900 20px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('U.S.', 4, 76); x.fillText("GOV'T", 4, 100);
    x.translate(NECK[0], NECK[1]); FILM.hand.front(x, o);
    x.restore();
    const p = pourAt(t); if (p > 0) {
      const sp = [hx + 1.4 * (Math.cos(tilt) * -54 - Math.sin(tilt) * -6), hy + 1.4 * (Math.sin(tilt) * -54 + Math.cos(tilt) * -6)];
      x.save(); x.strokeStyle = GREEN; x.lineWidth = 12 * p; x.lineCap = 'round'; x.beginPath(); x.moveTo(sp[0], sp[1]); x.quadraticCurveTo(sp[0] - 30, sp[1] + 80, sp[0] - 34, DOCK - 220); x.stroke(); x.restore();
    }
  }

  const POST = [{ x: 1120, y: 360, kind: 'clip', head: 'POISON LIQUOR', sub: 'KILLS 12' }, { x: 1360, y: 330, kind: 'notice' }, { x: 1600, y: 370, kind: 'clip', head: 'BLINDED BY', sub: 'BAD GIN' }]
    .map((p, i) => ({ ...p, t: K.horror - .15 + i * .2 }));
  function wallB(x) { x.fillStyle = P.wall; x.fillRect(960, -600, 920, FY + 600); x.fillStyle = 'rgba(80,60,40,.08)'; for (let y = -600; y < FY; y += 60) x.fillRect(960, y, 920, 3); }
  function poster(x, p, tp) {
    const u = back((tp - p.t) / .3); if (u <= 0) return;
    x.save(); x.translate(p.x, p.y); x.scale(u, u); x.rotate(p.kind === 'notice' ? 0 : (p.x < 1300 ? -.04 : .05));
    x.fillStyle = 'rgba(0,0,0,.15)'; x.fillRect(-96, -126, 200, 260); x.fillStyle = P.card; x.fillRect(-100, -130, 200, 260);
    x.fillStyle = INK; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (p.kind === 'notice') {
      x.font = '900 40px NSC'; x.fillText('DANGER', 0, -92); drawSkull(x, 0, -10, 1.3); x.font = '900 24px NSC'; x.fillText('POISON', 0, 62); x.fillText('DO NOT DRINK', 0, 96);
    } else {
      x.font = '900 13px NSC'; x.fillText('THE DAILY NEWS', 0, -112); x.fillRect(-86, -102, 172, 2);
      x.font = '900 28px NSC'; x.fillText(p.head, 0, -76); x.fillText(p.sub, 0, -44);
      x.fillStyle = 'rgba(27,33,48,.35)'; for (let r = 0; r < 8; r++) x.fillRect(-84, -16 + r * 16, r % 3 === 2 ? 110 : 168, 6);
    }
    x.fillStyle = P.red; x.beginPath(); x.arc(0, -122, 5, 0, TAU); x.fill();
    x.restore();
  }
  function drawSkull(x, cx, cy, s) {
    x.save(); x.translate(cx, cy); x.scale(s, s); x.fillStyle = INK; x.strokeStyle = INK; x.lineWidth = 5; x.lineCap = 'round';
    x.beginPath(); x.moveTo(-24, 22); x.lineTo(24, 46); x.moveTo(24, 22); x.lineTo(-24, 46); x.stroke();
    x.beginPath(); x.arc(0, -4, 20, 0, TAU); x.fill(); x.fillRect(-11, 8, 22, 12);
    x.fillStyle = P.card; x.beginPath(); x.arc(-7, -6, 5.5, 0, TAU); x.arc(7, -6, 5.5, 0, TAU); x.fill(); x.restore();
  }
  const PLAN = [0, 1, 2].map(k => ({ k, x1: 1230 + k * 150, t0: K.thinking - .1 + k * .15 }));
  function dotted(x, face, look) {
    x.save(); x.scale(face, 1); x.setLineDash([4, 3]); x.lineDashOffset = 0; x.lineCap = 'butt'; x.lineJoin = 'miter'; x.strokeStyle = INK; x.lineWidth = 1.3;
    x.beginPath(); x.moveTo(-4, -36); x.lineTo(-6, 0); x.moveTo(4, -36); x.lineTo(6, 0);
    x.moveTo(-10, -73); x.lineTo(10, -73); x.lineTo(12, -36); x.lineTo(-12, -36); x.closePath();
    x.moveTo(-8, -71); x.lineTo(-11, -50); x.moveTo(8, -71); x.lineTo(11, -50);
    x.moveTo(6.5, -82 - 2 * look); x.arc(0, -82 - 2 * look, 6.5, 0, TAU); x.stroke(); x.setLineDash([]); x.restore();
  }
  function plan(x, t, tp) {
    for (const f of PLAN) {
      const come = easeOut(clamp((tp - f.t0) / 1.1)), go = easeIO(clamp((tp - K.scare - .2 - f.k * .12) / 1.2)), a = smooth((tp - f.t0) / .3) * (1 - smooth((tp - K.away - .2) / .5));
      if (a <= 0) continue; const px = lerp(1950 + f.k * 120, f.x1, come) + 700 * go, bob = (come > 0 && come < 1) || (go > 0 && go < 1) ? Math.abs(Math.sin(tp * 10 + f.k)) * 3 : 0;
      x.save(); x.globalAlpha = a; x.translate(px, FY - bob); x.scale(2.6, 2.6); dotted(x, go > .05 ? 1 : -1, smooth((tp - K.horror) / .3) * (1 - go)); x.restore();
    }
  }
  const CRATE = [860, FY];
  function crate(x, t) {
    x.fillStyle = P.wood; x.fillRect(CRATE[0] - 110, CRATE[1] - 80, 220, 80); x.fillStyle = P.woodDark; x.fillRect(CRATE[0] - 110, CRATE[1] - 46, 220, 6);
    const g = smooth((t - BAR[0].t) / 1.6);
    for (let k = 0; k < 5; k++) if (t < PEOPLE[Math.min(2, k)].grab || k > 2) { x.save(); x.translate(CRATE[0] - 84 + k * 42, CRATE[1] - 68); greenBottle(x, 110, g); x.restore(); }
  }
  function greenBottle(x, h, g) {
    const bw = h * .36;
    x.fillStyle = FILM.rgba(FILM.hex(P.glass), .9); x.beginPath(); x.roundRect(-bw / 2, -h * .62, bw, h * .62, 5); x.fill(); x.fillRect(-bw * .18, -h, bw * .36, h * .4);
    x.fillStyle = mix('#e8e4d0', GREEN, g); x.fillRect(-bw / 2 + 3, -h * .5, bw - 6, h * .5 - 3);
    x.fillStyle = P.woodDark; x.fillRect(-bw * .18, -h - 6, bw * .36, 8);
  }
  const PEOPLE = [0, 1, 2].map(k => ({ k, x: 990 + k * 130, t: K.people - .15 + k * .14, grab: K.drank + k * .15, hat: ['cap', 'wide', 'none'][k], kind: k === 2 ? 'woman' : 'man' }));
  function people(x, t, tp) {
    for (const p of PEOPLE) {
      const u = easeOut(clamp((tp - p.t) / .45)); if (u <= 0) continue;
      const px = lerp(p.x + 260, p.x, u), reach = easeIO(clamp((tp - p.grab + .2) / .35)), has = tp > p.grab + .15;
      x.save(); x.translate(px, FY); x.scale(-2.6, 2.6);
      PR.person(x, P, { kind: p.kind, hat: p.hat, coat: [P.coat, P.coat2, '#5a6a4a'][p.k], arm: has ? .75 : .35 * reach });
      if (has) { x.translate(16, -92); x.rotate(.35); greenBottle(x, 36, 1); }
      x.restore();
    }
  }

  const SHOP = { x0: 1880, x1: 2560 };
  function shop(x, t, tp) {
    x.fillStyle = '#c9b690'; x.fillRect(SHOP.x0, -600, SHOP.x1 - SHOP.x0 + 60, FY + 600);
    const rows = [[250, ['$5.00', '$4.00', '$4.50']], [430, ['$2.00', '$1.50', '$2.50']]];
    for (const [i, [y, tags]] of rows.entries()) {
      x.fillStyle = P.woodDark; x.fillRect(SHOP.x0 + 30, y, 420, 14);
      tags.forEach((tg, k) => {
        const bx = SHOP.x0 + 90 + k * 140;
        x.save(); x.translate(bx, y); PR.bottle(x, P, 120 - i * 10); x.restore();
        const lit = 1 - .45 * smooth((tp - K.afford) / .4);
        x.globalAlpha = lit; x.fillStyle = P.card; x.fillRect(bx - 38, y + 18, 76, 30); x.fillStyle = INK; x.font = '900 20px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(tg, bx, y + 34); x.globalAlpha = 1;
      });
    }
    x.fillStyle = P.wood; x.fillRect(SHOP.x0, 690, 560, FY - 690); x.fillStyle = P.woodDark; x.fillRect(SHOP.x0, 690, 560, 12);
    x.fillStyle = P.card; x.fillRect(CHEAP[0] - 34, 716, 68, 30); x.fillStyle = INK; x.font = '900 20px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('25¢', CHEAP[0], 732);
  }
  const POOR = [2420, FY], PS = 2.4, CHEAP = [2290, 690];
  function poorMan(x, t, tp) {
    const palm = easeOut(clamp((tp - K.poor + .3) / .35)), down = easeIO(clamp((tp - K.afford) / .45)), take = easeIO(clamp((tp - K.else1 + .05) / .5));
    const rest = [POOR[0] - 70, 640], drop = [2345, 676], neck = [CHEAP[0] + 6, 600], lift = [2330, 575], mv = clamp((tp - K.afford - .45) / .3);
    const H = take > 0 ? [lerp(neck[0], lift[0], take), lerp(neck[1], lift[1], take)] : down < 1 ? [lerp(rest[0], drop[0], down), lerp(rest[1], drop[1], down)] : [lerp(drop[0], neck[0], mv), lerp(drop[1], neck[1], mv)];
    const Hl = [(H[0] - POOR[0]) / -PS, (H[1] - POOR[1]) / PS], El = [(8 + Hl[0]) / 2 + 3, (-70 + Hl[1]) / 2 + 7];
    const bottleAt = take > 0 ? [H[0] - 6, H[1] + 90] : CHEAP; x.save(); x.translate(bottleAt[0], bottleAt[1]); greenBottle(x, 100, .35); x.restore();
    x.save(); x.translate(POOR[0], POOR[1]); x.scale(-PS, PS);
    PR.person(x, P, { kind: 'man', hat: 'cap', coat: '#6a5a48', trouser: '#3e3a36', look: .25 * (smooth((tp - K.some1) / .4) - smooth((tp - K.afford) / .3)), arms: [[[-8, -70], [-10, -60], [-11, -49]], [[8, -70], El, Hl]] });
    x.fillStyle = '#8a7a60'; x.fillRect(-9, -64, 6, 6); x.fillRect(4, -50, 5, 5);
    x.restore();
    for (const [k, col] of [[0, '#c8a040'], [1, '#b8b8c4']]) {
      if (palm <= 0) continue; const c = down < 1 ? [H[0] - 6 + k * 12, H[1] - 5 - k * 2] : [drop[0] - 6 + k * 16, 683];
      x.fillStyle = col; x.beginPath(); x.ellipse(c[0], c[1], 9 * palm, (down < 1 ? 9 : 3.5) * palm, 0, 0, TAU); x.fill(); x.strokeStyle = 'rgba(0,0,0,.3)'; x.lineWidth = 1.5; x.stroke();
    }
  }

  const STAND = { x0: 2470, x1: 2980, y: 620 }, TAB = { x0: 2960, x1: 3420, y: 760 }, FX = 3012, BX = 2870, MANX = 3350, MS = 3;
  const ROLL = [K.stolen - .35, K.stolen + .35], LAB = [0, 1, 2, 3].map(k => K.resell - .15 + k * .12);
  function bootleg(x, t, tp) {
    x.fillStyle = '#b8a47e'; x.fillRect(SHOP.x1 + 60, -600, 1100, FY + 600);
    const pour = clamp((tp - K.cleaned + .1) / 1.1), open = pour > 0 && pour < 1, lab = easeIO(clamp((tp - LAB[0] + .25) / .3)) * (1 - easeIO(clamp((tp - LAB[3] - .3) / .4)));
    x.save(); x.translate(MANX, FY); x.scale(-MS, MS); PR.person(x, P, { kind: 'man', hat: 'wide', coat: '#3a3246', trouser: '#26222e', hatColor: '#1a1620', arm: .45 * lab, look: .1 }); x.restore();
    x.fillStyle = P.woodDark; x.fillRect(STAND.x0, STAND.y, STAND.x1 - STAND.x0, 16);
    for (const lx of [STAND.x0 + 12, (STAND.x0 + STAND.x1) / 2, STAND.x1 - 26]) x.fillRect(lx, STAND.y + 16, 14, FY - STAND.y - 16);
    const drop = clamp((tp - ROLL[0]) / (ROLL[1] - ROLL[0])), by = STAND.y - 900 * (1 - back(drop)), here = drop >= 1;
    if (drop > 0) { x.fillStyle = '#3a3a44'; x.fillRect(BX - 3, -700, 6, by - 220 + 700); barrel(x, BX, by, 1, 'INDUSTRIAL', easeIO(clamp((tp - K.stolen - .4) / .4))); }
    if (here) { x.fillStyle = '#3a3a44'; x.fillRect(BX + 75, 560, FX + 8 - BX - 75, 12); x.fillRect(FX - 4, 560, 12, 36); x.fillRect(FX - 40, 546 - 10 * (open ? 1 : 0), 8, 18); }
    x.fillStyle = P.wood; x.fillRect(TAB.x0, TAB.y, TAB.x1 - TAB.x0, 18); x.fillStyle = P.woodDark; x.fillRect(TAB.x0 + 20, TAB.y + 18, 14, FY - TAB.y - 18); x.fillRect(TAB.x1 - 34, TAB.y + 18, 14, FY - TAB.y - 18);
    x.save(); x.translate(FX, TAB.y); greenBottle(x, 100, .25 * pour); x.restore();
    x.fillStyle = '#9a9aa6'; polyPath(x, [[FX - 44, 620], [FX + 44, 620], [FX + 8, 668], [FX - 8, 668]]); x.fill();
    x.fillStyle = P.cream; polyPath(x, [[FX - 54, 612], [FX + 54, 612], [FX + 40, 636], [FX - 40, 636]]); x.fill();
    x.fillStyle = FILM.rgba(FILM.hex(GREEN), .55 * smooth(pour / .3)); x.beginPath(); x.ellipse(FX, 620, 30, 6, 0, 0, TAU); x.fill();
    if (open) { x.save(); x.strokeStyle = GREEN; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(FX + 2, 598); x.lineTo(FX, 614); x.stroke(); x.restore(); }
    for (let k = 0; k < 4; k++) {
      const bxk = 3090 + k * 62; x.save(); x.translate(bxk, TAB.y); greenBottle(x, 100, .25);
      const lu = back((tp - LAB[k]) / .25); if (lu > 0) { x.translate(0, -40); x.scale(lu, lu); x.fillStyle = P.card; x.fillRect(-19, -20, 38, 40); x.fillStyle = INK; x.font = '900 10px NSC'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('FINE OLD', 0, -9); x.fillText('RYE', 0, 4); x.fillStyle = P.amber; x.fillRect(-13, 12, 26, 3); }
      x.restore();
    }
  }

  const S16 = [[0, [480, 640, 1.6]], [K.kind + .1, [480, 630, 1.5]], [K.factories + .6, [520, 420, .9]], [K.government + .3, [480, 520, 1.25]], [K.chemicals + .6, [490, 530, 1.25]],
    [K.thinking + .5, [1330, 560, 1.3]], [K.away + .4, [1330, 560, 1.3]], [K.drank, [1020, 600, 1.35]], [K.anyway + .6, [1020, 600, 1.38]], [K.some1 + .7, [2330, 600, 1.9]],
    [K.poor + .25, [2360, 640, 2.6]], [K.afford + .2, [2330, 640, 2.4]], [K.else1 + .5, [2160, 480, 1.3]], [K.sold + .4, [3000, 580, 1.5]], [K.stolen + .6, [2960, 580, 1.5]],
    [K.cleaned + .5, [3000, 630, 2.0]], [K.resell + .2, [3170, 650, 1.9]], [DUR, [3180, 650, 1.95]]];
  const KEYS = S16.map(([t, v]) => [t, M45 ? [v[0], v[1] - 40, Math.log(v[2] * .85)] : [v[0], v[1], Math.log(v[2])]]);
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }

  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => {
      factory(x, tp); wallB(x); shop(x, t, tp); bootleg(x, t, tp);
      x.fillStyle = '#2a3446'; x.fillRect(-600, FY, 4600, 900);
      for (const b of BAR) barrel(x, b.x, DOCK, smooth((tp - b.t - .1) / .5));
      for (const p of POST) poster(x, p, tp);
      crate(x, t); plan(x, t, tp); people(x, t, tp); poorMan(x, t, tp);
      governmentHand(x, t);
    }, {});
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.factories, K.laced, K.horror, K.scare, K.drank, K.poor, K.stolen, K.resell],
  });
})();
