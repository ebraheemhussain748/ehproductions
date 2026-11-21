// Home hero: the visitor types a shop name and it appears on the lit board in the photo.
// The name is a real HTML element mapped onto the board's four corners, so it stays sharp at any size.
import { store } from './common.js?v=99dd314d';

const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const film = $('#hero-film'), plate = $('#sign-plate');

if (film && plate) {
  const board = $('.board', plate), nameEl = $('#board-name'), input = $('#shop-name'), lit = $('.plate__lit', plate);

  // Corners of the sign face in the photo (720 x 1280), measured from the lit frame.
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
  // A short flicker each time the name changes, like a tube catching.
  function buzz() {
    if (reduce || !film.classList.contains('is-on')) return;
    film.classList.remove('is-buzz');
    void film.offsetWidth;
    film.classList.add('is-buzz');
  }
  function setName(raw, save) {
    const v = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, 28);
    nameEl.textContent = v || DEFAULT;
    fit();
    if (save) {
      store.set('eh-shop', v);
      dispatchEvent(new CustomEvent('eh:shop', { detail: v }));
      buzz();
    }
  }
  const saved = store.get('eh-shop', '');
  if (saved) input.value = saved;
  setName(saved, false);
  document.fonts?.ready.then(fit);
  input.addEventListener('input', () => setName(input.value, true));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); input.blur(); } });
  film.addEventListener('click', () => input.focus());

  // Switch the board on once its photo is ready: a flicker, then steady light.
  film.addEventListener('animationend', e => {
    if (e.animationName === 'flick-on') { film.classList.add('is-on'); film.classList.remove('is-lit'); }
    if (e.animationName === 'buzz') film.classList.remove('is-buzz');
  });
  const on = () => setTimeout(() => film.classList.add(reduce ? 'is-on' : 'is-lit'), reduce ? 0 : 650);
  if (lit.complete && lit.naturalWidth) on(); else lit.addEventListener('load', on, { once: true });

  // The frame leans a little toward the pointer.
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hero = film.closest('.hero');
    let raf = 0;
    hero.addEventListener('pointermove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = hero.getBoundingClientRect();
        film.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 9).toFixed(2));
        film.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2));
      });
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { film.style.setProperty('--ry', 0); film.style.setProperty('--rx', 0); });
  }
}
