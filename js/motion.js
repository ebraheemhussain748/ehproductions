// Motion for every page: scroll reveals, count-ups, a light that follows the pointer on the service
// tiles, and the nav shadow. No imports, so it runs even if a page script is slow. CSS does the moving;
// this file only switches classes. Under "reduce motion" everything is shown at once.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;
root.classList.add('motion');

function count(n) {
  if (n.dataset.counted) return;
  n.dataset.counted = '1';
  const end = parseInt(n.textContent.replace(/\D/g, ''), 10);
  if (!end || reduce) return;
  const t0 = performance.now(), dur = 1400;
  const tick = t => {
    const p = Math.min(1, (t - t0) / dur);
    n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  n.textContent = '0';
  requestAnimationFrame(tick);
}

function show(node) {
  const group = node.hasAttribute('data-stagger');
  if (group) [...node.children].forEach((c, i) => c.style.setProperty('--i', Math.min(i, 8)));
  node.classList.add('is-in');
  node.querySelectorAll('[data-count]').forEach(count);
  // Once the entrance is over, hand the element back to its own styles (hover lifts and so on).
  setTimeout(() => node.classList.add('is-done'), 1100 + (group ? Math.min(node.children.length, 9) * 80 : 0));
}

const targets = [...document.querySelectorAll('[data-in], [data-stagger]')];
if (reduce || !('IntersectionObserver' in window)) {
  targets.forEach(n => { n.classList.add('is-in', 'is-done'); n.querySelectorAll('[data-count]').forEach(count); });
} else {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { io.unobserve(e.target); show(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  targets.forEach(n => io.observe(n));
}

if (fine && !reduce) {
  document.addEventListener('pointermove', e => {
    const tile = e.target.closest?.('.svc');
    if (!tile) return;
    const r = tile.getBoundingClientRect();
    tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
    tile.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

const onScroll = () => document.body.classList.toggle('scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
