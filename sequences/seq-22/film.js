(() => {
  'use strict';
  const { TAU, smooth, easeIn, easeOut, easeIO, clamp, lerp, keyed, polyPath, rng } = FILM, PR = FILM.props;
  const ID = 'seq-22', { W, H, id: FMT } = FILM.format(), R = [960, 540], M45 = FMT === '4x5';
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const K = { hiding: 0.768, dark: 1.368, celebrity: 2.469, gave: 3.637, interviews: 3.938,
    opened: 5.139, soup: 5.472, depression: 6.607, liked: 7.575, businessman: 8.609,
    giving: 9.243, wanted: 10.311, infuriating: 11.445, wrong: 13.814 };
  const back = u => { if (u <= 0) return 0; u = clamp(u) - 1; return 1 + u * u * (2.7 * u + 1.7); };

  const CAP = [1000, -200], FS = 1.3;
  function capone(x, tp, grin) {
    x.save(); x.translate(CAP[0], 0);
    x.fillStyle = '#3a3846'; polyPath(x, [[-64, CAP[1] + 3], [64, CAP[1] + 3], [58, -84], [-58, -84]]); x.fill();
    x.fillStyle = '#2e2c38'; x.fillRect(-40, -86, 34, 82); x.fillRect(6, -86, 34, 82); x.fillStyle = '#1a1614'; x.fillRect(-50, -8, 44, 8); x.fillRect(2, -8, 44, 8);
    x.restore();
    x.save(); x.translate(CAP[0], CAP[1]); x.scale(FS, FS); PR.caponeLit(x, P, { grin, ember: .6 }); x.restore();
  }
  const DOOR = [1000, 0];
  function kitchen(x, tp) {
    x.fillStyle = '#6e5a48'; x.fillRect(-2600, -2200, 7000, 2200);
    x.fillStyle = 'rgba(40,24,14,.12)'; for (let y = -2180; y < 0; y += 46) x.fillRect(-2600, y, 7000, 4);
    x.save(); x.translate(1000, 0); x.scale(.55, .55); x.translate(-1000, 0);
    x.fillStyle = '#e2cfa8'; x.fillRect(560, -900, 900, 900);
    x.fillStyle = '#f3c264'; x.fillRect(620, -560, 250, 380); x.fillRect(1150, -560, 250, 380);
    x.fillStyle = '#3a2a1c'; x.fillRect(880, -600, 240, 600);
    x.fillStyle = '#f2e6cc'; x.fillRect(520, -860, 980, 170); x.strokeStyle = '#2c2824'; x.lineWidth = 6; x.strokeRect(530, -850, 960, 150);
    x.fillStyle = '#2c2824'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 64px NSC'; x.fillText('FREE SOUP, COFFEE & DOUGHNUTS', 1010, -800); x.font = '900 44px NSC'; x.fillText('FOR THE UNEMPLOYED', 1010, -735);
    x.restore();
    x.fillStyle = '#9a8a74'; x.fillRect(-2600, 0, 7000, 900); x.fillStyle = '#8a7a64'; x.fillRect(-2600, 0, 7000, 14);
  }
  const LINE = (() => { const g = rng(78), out = []; for (let i = 0; i < 16; i++) out.push({ x: 820 - i * 115 - g() * 24, s: 2.3 + g() * .25, coat: ['#4d5b68', '#5a4a3e', '#6a5a4a', '#4a4a52'][(g() * 4) | 0], hat: g() < .6 ? 'cap' : 'bowler', t: K.businessman - .2 + i * .06 }); return out; })();
  function queue(x, tp) {
    for (const p of LINE) {
      x.save(); x.translate(p.x, 0); x.scale(p.s, p.s); PR.person(x, P, { kind: 'man', coat: p.coat, trouser: P.trouser, hat: p.hat, hatColor: P.cap, look: .1 }); x.restore();
      const g = smooth((tp - p.t) / .3); if (g > 0) { x.fillStyle = FILM.rgba(FILM.hex(P.amber), g); x.beginPath(); x.arc(p.x, -60 * p.s, 6 * p.s, 0, TAU); x.fill(); }
    }
  }
  function counter(x, tp) {
    const u = back((tp - K.businessman + .1) / .4); if (u <= 0) return;
    x.save(); x.translate(CAP[0] - 70, 0); x.scale(1, u);
    x.fillStyle = '#8a603f'; x.fillRect(-120, -130, 200, 130); x.fillStyle = '#6b4a30'; x.fillRect(-130, -142, 220, 14);
    for (let k = 0; k < 5; k++) { x.save(); x.translate(-105 + k * 38, -142); PR.bottle(x, P, 48); x.restore(); }
    x.restore();
    const hand = smooth((tp - K.wanted + .3) / .3) * (1 - smooth((tp - K.wanted - .5) / .3));
    if (hand > 0) { x.save(); x.translate(lerp(CAP[0] - 80, LINE[0].x + 40, hand), -170); PR.bottle(x, P, 48); x.restore(); }
  }
  const FLASH = [K.dark - .15, K.dark + .1, K.dark + .35, K.celebrity - .1, K.gave];
  const flashAt = t => FLASH.reduce((a, f) => a + Math.exp(-Math.pow((t - f) / .05, 2)) * (t > f - .1 ? 1 : 0), 0);
  function press(x, tp) {
    const a = 1 - smooth((tp - K.opened) / .4); if (a <= 0) return; x.save(); x.globalAlpha = a;
    for (const [px, fl] of [[640, 0], [500, 2]]) {
      x.save(); x.translate(px, 0); x.scale(2.3, 2.3); PR.person(x, P, { kind: 'man', coat: '#5a5a62', hat: 'wide', hatColor: P.cap, arm: .8 }); x.restore();
      x.fillStyle = '#2c2824'; x.fillRect(px + 14, -196, 34, 26); x.fillStyle = '#c8c0b0'; x.fillRect(px + 24, -230, 6, 34);
      x.fillStyle = '#e8e0d0'; x.beginPath(); x.moveTo(px + 27, -230); x.lineTo(px + 13, -246); x.lineTo(px + 41, -246); x.fill();
    }
    x.restore();
  }
  function mics(x, tp) {
    const u = easeOut(clamp((tp - K.gave + .1) / .5), 2) * (1 - smooth((tp - K.opened - .2) / .4)); if (u <= 0) return;
    const mouth = [CAP[0] + PR.CAPONE_MOUTH[0] * FS, CAP[1] + PR.CAPONE_MOUTH[1] * FS], k = .32;
    [[-.5, 0], [-.35, 40], [-.62, -36]].forEach(([a, dy], i) => {
      const base = [mouth[0] - 300, 0], tip = [lerp(mouth[0] - 300, mouth[0] - 22 - i * 5, u), mouth[1] + dy * k];
      x.strokeStyle = '#3a3a40'; x.lineWidth = 8 * k; x.beginPath(); x.moveTo(base[0] - i * 40, base[1]); x.lineTo(tip[0], tip[1]); x.stroke();
      x.fillStyle = '#2c2c34'; x.beginPath(); x.ellipse(tip[0] + 14 * k, tip[1], 24 * k, 18 * k, 0, 0, TAU); x.fill(); x.fillStyle = '#8a8a96'; x.beginPath(); x.ellipse(tip[0] + 14 * k, tip[1], 16 * k, 12 * k, 0, 0, TAU); x.fill();
    });
    for (let j = 0; j < 2; j++) { const nx = lerp(mouth[0] - 300, mouth[0] - 64 - j * 30, u), ny = mouth[1] + 50 + j * 18; x.save(); x.translate(nx, ny); x.scale(k, k); x.fillStyle = '#f6ecd5'; x.fillRect(-40, -50, 80, 100); x.strokeStyle = 'rgba(44,40,36,.4)'; x.lineWidth = 2; for (let r = 0; r < 6; r++) { x.beginPath(); x.moveTo(-30, -36 + r * 14); x.lineTo(30, -36 + r * 14); x.stroke(); } x.fillStyle = P.skin; x.beginPath(); x.ellipse(-44, 30, 16, 12, 0, 0, TAU); x.fill(); x.restore(); }
  }
  const PAPERS = [['THE DAILY NEWS', -1, K.celebrity - .35], ['EVENING HERALD', 0, K.celebrity - .15], ['THE MORNING POST', 1, K.celebrity + .05]];
  function papers(ctx, t) {
    const out = smooth((t - K.gave + .25) / .3); if (out >= 1) return;
    PAPERS.forEach(([name, d, t0]) => {
      const u = easeOut(clamp((t - t0) / .45), 3); if (u <= 0) return;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(W / 2 + d * (M45 ? 240 : 420) + out * d * 900, H / 2 + (M45 ? d * 180 : 0) - out * 900); ctx.rotate((1 - u) * 8 + d * .08); ctx.scale(u * (M45 ? .95 : 1), u * (M45 ? .95 : 1));
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-206, -266, 420, 540); ctx.fillStyle = '#efe6d2'; ctx.fillRect(-210, -270, 420, 540);
      ctx.fillStyle = '#2c2824'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 34px NSC'; ctx.fillText(name, 0, -232); ctx.fillRect(-190, -210, 380, 4);
      ctx.font = '900 86px NSC'; ctx.fillText('CAPONE', 0, -150);
      ctx.save(); ctx.beginPath(); ctx.rect(-190, -100, 200, 240); ctx.clip(); ctx.fillStyle = '#d8ccb4'; ctx.fillRect(-190, -100, 200, 240); ctx.translate(-80, 150); ctx.scale(2.6, 2.6); PR.caponeLit(ctx, P, { grin: .6 }); ctx.restore();
      ctx.fillStyle = 'rgba(44,40,36,.55)'; for (let r = 0; r < 14; r++) ctx.fillRect(30, -96 + r * 17, r % 5 === 4 ? 100 : 160, 6); for (let r = 0; r < 6; r++) ctx.fillRect(-190, 160 + r * 17, r % 3 === 2 ? 240 : 380, 6);
      ctx.restore();
    });
  }
  function quote(ctx, t) {
    const a = smooth((t - K.businessman + .1) / .3) * (1 - smooth((t - K.infuriating - .3) / .4)); if (a <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
    const cx = W / 2, cy = M45 ? 150 : 96, w = M45 ? 760 : 760, h = M45 ? 110 : 100;
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.roundRect(cx - w / 2 + 6, cy - h / 2 + 8, w, h, 8); ctx.fill();
    ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 8); ctx.fill();
    ctx.fillStyle = '#2c2824'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `900 ${M45 ? 62 : 60}px NSC`; ctx.fillText('“Just a businessman”', cx, cy + 2); ctx.restore();
  }

  const mz = M45 ? .62 : 1, lz = z => Math.log(z * mz), lzw = z => Math.log(z * (M45 ? .82 : 1)), FACE = [CAP[0] - 14, CAP[1] - 72];
  const KEYS = [[0, [FACE[0], FACE[1], lz(4.6)]], [K.interviews, [FACE[0] - 40, FACE[1] + 6, lz(4)]], [K.opened, [FACE[0] - 50, FACE[1] + 10, lz(3.6)]], [K.depression + .3, [M45 ? 640 : 380, -300, lzw(.95)]],
    [K.giving, [M45 ? 660 : 420, -300, lzw(1)]], [K.infuriating, [M45 ? 760 : 650, -290, lzw(1.4)]], [K.wrong + .3, [FACE[0] - 6, FACE[1], lz(4.8)]], [DUR, [FACE[0] - 5, FACE[1], lz(4.9)]]];
  function camera(t) { const v = keyed(t, KEYS); return { x: v[0], y: v[1], z: Math.exp(v[2]) }; }
  function draw(ctx, t) {
    const tp = pose(t), cam = camera(t), grin = smooth((tp - K.gave) / .4) * .7 + .3 * smooth((tp - K.infuriating) / 1.5);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => { kitchen(x, tp); queue(x, tp); press(x, tp); capone(x, tp, grin); counter(x, tp); mics(x, tp); }, { paperShadow: [5, 7, 5, .3] });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dark = 1 - smooth((t - FLASH[0] + .05) / .25); if (dark > 0) { ctx.fillStyle = `rgba(8,6,4,${dark})`; ctx.fillRect(0, 0, W, H); }
    const f = Math.min(1, flashAt(t)); if (f > .01) { ctx.fillStyle = `rgba(255,252,240,${.85 * f})`; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
    papers(ctx, t); quote(ctx, t);
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: FILM.fonts('NSC', 'NS'), grain: 'none', label: C.label,
    shots: C.T.sentences.map(s => ({ id: s.id, start: s.t0, end: s.t1 })), marks: [K.dark, K.celebrity, K.interviews, K.soup, K.businessman, K.wanted, K.wrong],
  });
})();
