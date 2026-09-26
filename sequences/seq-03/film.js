(() => {
  'use strict';
  const { TAU, smooth, easeOut, easeIO, clamp, lerp, cutPoly, polyPath, rng, noise1 } = FILM, PR = FILM.props;
  const ID = 'seq-03', { W, H, id: FMT } = FILM.format(), R = [960, 540];
  const C = FILM.cues(ID), DUR = C.duration;
  const L = FILM.look('paper', W, H), P = L.P, pose = L.pose;
  const INK = '#3a2818';

  const SHEET = cutPoly([[150, 34], [1774, 46], [1790, 1400], [134, 1390]], 10, 2.6, 9);
  const HAND = (() => {
    const r = rng(41), lines = [];
    for (let c = 0; c < 3; c++) for (let i = 0; i < 12; i++) {
      const x0 = 230 + c * 500 + r() * 20, x1 = x0 + 400 + r() * 50 - (i === 11 ? 180 : 0), y = 270 + i * 26;
      lines.push({ x0, x1, y, seed: c * 50 + i, amp: 3 + r() * 2.5 });
    }
    return lines;
  })();
  function handLine(x, l) {
    x.beginPath();
    for (let px = l.x0; px <= l.x1; px += 3) {
      const u = (px - l.x0) / 9, y = l.y + Math.sin(u * 2.1) * l.amp * .7 + noise1(u * .9, l.seed) * l.amp;
      px === l.x0 ? x.moveTo(px, y) : x.lineTo(px, y);
    }
    x.stroke();
  }
  function heading(x) {
    x.beginPath();
    for (let u = 0; u <= 52; u += .05) {
      const px = 300 + u * 17 - 21 * Math.sin(u), py = 172 - 30 * Math.cos(u) * (.7 + .3 * noise1(u * .4, 3)) + noise1(u * .7, 8) * 5;
      u === 0 ? x.moveTo(px, py) : x.lineTo(px, py);
    }
    x.stroke();
  }

  const Y0 = 628, Y1 = 778;
  const STROKES = [
    [[742, Y0], [846, Y1]], [[846, Y0], [742, Y1]],
    [[884, Y0], [934, Y1]], [[934, Y1], [984, Y0]],
    [[1026, Y0], [1026, Y1]], [[1070, Y0], [1070, Y1]], [[1114, Y0], [1114, Y1]],
  ];
  const T0 = 0 + .1, T1 = 1.568 + .05;
  const PER = (T1 - T0) / (STROKES.length + (STROKES.length - 1) * .35);
  const strokeTime = i => T0 + i * PER * 1.35;
  const GLOW = 1.568;

  function quillTip(t) {
    for (let i = 0; i < STROKES.length; i++) {
      const s0 = strokeTime(i), s1 = s0 + PER, [a, b] = STROKES[i];
      if (t < s0) {
        const prev = i ? STROKES[i - 1][1] : [a[0] + 140, a[1] - 90], p0 = i ? strokeTime(i - 1) + PER : T0 - .5;
        const k = smooth((t - p0) / (s0 - p0));
        return { p: [lerp(prev[0], a[0], k), lerp(prev[1], a[1], k) - Math.sin(k * Math.PI) * 26], lift: Math.sin(k * Math.PI) };
      }
      if (t < s1) { const k = easeIO((t - s0) / PER); return { p: [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], lift: 0 }; }
    }
    const last = STROKES.at(-1)[1], k = smooth((t - T1) / .5);
    return { p: [last[0] + k * 160, last[1] - k * 140], lift: k };
  }

  function camera(t) {
    const k = smooth(t / DUR);
    if (FMT === '4x5') return { x: lerp(960, 935, k), y: lerp(560, 690, k), z: .74 * Math.pow(1.12 / .74, k) };
    return { x: lerp(960, 935, k), y: lerp(540, 660, k), z: Math.pow(1.36, k) };
  }

  function draw(ctx, t) {
    const cam = camera(t), tp = pose(t);
    L.background(ctx);
    L.sheet(ctx, cam, 1, R, x => {
      polyPath(x, SHEET); x.fillStyle = P.parchment; x.fill();
      x.save(); polyPath(x, SHEET); x.clip();
      const g = x.createRadialGradient(960, 620, 380, 960, 700, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(120,80,30,.45)');
      x.fillStyle = g; x.fillRect(0, 0, W, 1500); x.restore();
      x.strokeStyle = INK; x.lineCap = 'round'; x.lineJoin = 'round';
      x.globalAlpha = .8; x.lineWidth = 7; heading(x);
      x.globalAlpha = .62; x.lineWidth = 2.6; for (const l of HAND) handLine(x, l);
      x.globalAlpha = 1;
      x.lineWidth = 17;
      STROKES.forEach(([a, b], i) => {
        const k = clamp((tp - strokeTime(i)) / PER); if (k <= 0) return;
        const e = easeIO(k), wet = 1 - smooth((tp - strokeTime(i) - PER) / 1.2);
        x.strokeStyle = INK; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(lerp(a[0], b[0], e), lerp(a[1], b[1], e)); x.stroke();
        x.save(); x.lineWidth = 8;
        for (const [p, due] of [[a, 0], [b, 1]]) {
          if ((p[1] !== Y0 && p[1] !== Y1) || (p[0] === 934 && p[1] === Y1) || k < (due ? 1 : .02)) continue;
          x.beginPath(); x.moveTo(p[0] - 16, p[1]); x.lineTo(p[0] + 16, p[1]); x.stroke();
        }
        x.restore();
        if (wet > 0) {
          x.save(); x.strokeStyle = `rgba(255,236,200,${.35 * wet})`; x.lineWidth = 4; x.beginPath();
          x.moveTo(a[0] - 3, a[1] - 2); x.lineTo(lerp(a[0], b[0], e) - 3, lerp(a[1], b[1], e) - 2); x.stroke(); x.restore(); x.lineWidth = 17;
        }
      });
    }, { rimAlpha: .3 });
    FILM.sheet(ctx, cam, 1, W, H, R);
    PR.glow(ctx, 928, 703, 320, '#ffcf80', .22 * smooth((t - GLOW + .2) / .6), 'lightbox');
    const q = quillTip(tp), b = L.boil(t, 5, .5);
    L.sheet(ctx, cam, 1.08, R, x => {
      x.save(); x.translate(q.p[0] + b[0], q.p[1] + b[1] - q.lift * 10); x.rotate(b[2] + q.lift * .05); PR.quill(x, P, 420); x.restore();
    }, { paperShadow: [14 + q.lift * 12, 18 + q.lift * 14, 8 + q.lift * 6, .3] });
    L.grade(ctx, t);
  }

  FILM.scene(ID, {
    W, H, duration: DUR, draw, ready: Promise.resolve(), grain: 'none', label: C.label,
    shots: [{ id: 'S009', start: 0, end: DUR }], marks: [T0, T1, GLOW],
  });
})();
