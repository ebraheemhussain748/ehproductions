// Home page story. Mounts the scroll engine (js/scrollcraft.js, MIT, see js/scrollcraft-LICENSE.txt)
// and runs the one moment that is only on this site: the visitor's shop name on the sign in the film.
import { store } from './common.js?v=93ecf7ec';

const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };

function engine() {
  return new Promise(res => {
    if (window.ScrollCraft) return res(window.ScrollCraft);
    addEventListener('load', () => res(window.ScrollCraft));
  });
}

const SC = await engine();
const api = SC.mount(document.body);
const relayout = () => api.layout();
addEventListener('load', relayout);
document.fonts?.ready.then(relayout);
// main.js fills the sections below the story after the story has been measured.
addEventListener('eh:content', relayout);

/* ---------- chrome: solid bar and WhatsApp button only after the story ---------- */
const body = document.body, story = $('#story-end');
if (story && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => {
    const past = e.boundingClientRect.top < innerHeight * 0.5;
    body.classList.toggle('story-on', !past);
  }).observe(story);
}
body.classList.add('story-on');
// The bar steps out of the way while the reader scrolls down and comes back the moment they scroll up.
let lastY = scrollY;
addEventListener('scroll', () => {
  const y = scrollY, down = y > lastY + 2, up = y < lastY - 2;
  body.classList.toggle('scrolled', y > 40);
  if (down && y > 140 && !document.activeElement?.closest?.('.nav')) body.classList.add('nav-away');
  else if (up || y < 140) body.classList.remove('nav-away');
  lastY = y;
}, { passive: true });

/* ---------- the name on the board ---------- */
const act = $('#your-sign');
const plate = $('#sign-plate');
if (act && plate) {
  const lit = $('.plate__lit', plate), board = $('.board', plate), nameEl = $('#board-name');
  const amb = $('.amb--sign', act), stage = $('.stage', act), input = $('#shop-name');
  const field = input.closest('[data-sc-cue]');

  // Corners of the sign face in the film frame (720 x 1280), measured from the lit frame.
  const FACE = [[119, 325], [583, 287], [588, 590], [104, 613]];
  const BW = 1000, BH = 640; // the board element's own box, mapped onto the face

  // Homography from the board box to the face quad, as a CSS matrix3d.
  function solve(A, b) {
    const n = b.length;
    for (let i = 0; i < n; i++) {
      let m = i;
      for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[m][i])) m = r;
      [A[i], A[m]] = [A[m], A[i]]; [b[i], b[m]] = [b[m], b[i]];
      for (let r = i + 1; r < n; r++) {
        const f = A[r][i] / A[i][i];
        for (let c = i; c < n; c++) A[r][c] -= f * A[i][c];
        b[r] -= f * b[i];
      }
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let s = b[i];
      for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c];
      x[i] = s / A[i][i];
    }
    return x;
  }
  function homography(src, dst) {
    const A = [], b = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = src[i], [u, v] = dst[i];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    }
    const h = solve(A, b);
    return [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1];
  }
  function place() {
    const k = plate.offsetWidth / 720;
    if (!k) return;
    const dst = FACE.map(([x, y]) => [x * k, y * k]);
    const m = homography([[0, 0], [BW, 0], [BW, BH], [0, BH]], dst);
    board.style.transform = `matrix3d(${m.map(n => n.toFixed(6)).join(',')})`;
  }
  new ResizeObserver(place).observe(plate);
  place();

  // Fit the name on one line inside the face.
  const DEFAULT = 'Your shop';
  function fit() {
    nameEl.style.fontSize = '200px';
    const w = nameEl.scrollWidth || 1;
    nameEl.style.fontSize = `${Math.min(230, 200 * (BW * 0.84) / w)}px`;
  }
  function setName(raw, save) {
    const v = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, 28);
    nameEl.textContent = v || DEFAULT;
    fit();
    if (save) {
      store.set('eh-shop', v);
      dispatchEvent(new CustomEvent('eh:shop', { detail: v }));
    }
  }
  const saved = store.get('eh-shop', '');
  if (saved) input.value = saved;
  setName(saved, false);
  document.fonts?.ready.then(fit);
  input.addEventListener('input', () => setName(input.value, true));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); input.blur(); } });

  // A pinned stage holds one position for the whole act, so the browser's own
  // scroll-into-view cannot open the field's cue. Park the act where it is open.
  act.addEventListener('focusin', () => {
    if (parseFloat(getComputedStyle(field).opacity) > 0.85) return;
    const travel = act.offsetHeight - innerHeight;
    scrollTo({ top: act.offsetTop + travel * 0.74, behavior: 'instant' });
  });

  // Scroll switches the board on: silence, a quick rise with one flicker, then steady light.
  function light(p) {
    if (reduce) return smooth((p - 0.16) / 0.12);
    if (p < 0.16) return 0;
    if (p >= 0.28) return 1;
    const t = (p - 0.16) / 0.12;
    const rise = smooth(t / 0.32);
    const dip = t > 0.34 && t < 0.58 ? Math.sin(((t - 0.34) / 0.24) * Math.PI) * 0.7 : 0;
    return clamp(rise * (1 - dip));
  }
  let live = false, last = '';
  function frame() {
    if (!live) return;
    const p = parseFloat(act.style.getPropertyValue('--sc-p')) || 0;
    const L = light(p);
    const s = reduce ? 1 : 1 + 0.055 * p;
    const sig = `${L.toFixed(3)}|${s.toFixed(4)}`;
    if (sig !== last) {
      last = sig;
      lit.style.opacity = L.toFixed(3);
      board.style.opacity = L.toFixed(3); // the printed name only reads once the box is lit
      if (amb) amb.style.opacity = (0.18 + 0.5 * L).toFixed(3);
      plate.style.transform = s === 1 ? '' : `scale(${s.toFixed(4)})`;
      stage.dataset.scVerifyState = sig;
    }
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => {
    const on = e.isIntersecting;
    if (on && !live) { live = true; requestAnimationFrame(frame); }
    live = on;
  }, { rootMargin: '20% 0px' }).observe(act);
}
