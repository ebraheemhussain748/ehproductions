// Ready-made ads page: shared header and footer, plus a sound toggle on each sample video.
// Videos autoplay muted (browsers block sound until a tap); the button turns sound on for that clip only.
import { initChrome } from './common.js?v=99dd314d';

initChrome({ page: 'ads' });

for (const btn of document.querySelectorAll('.ads-sound')) {
  const video = btn.closest('figure').querySelector('video');
  btn.addEventListener('click', () => {
    const on = video.muted;
    for (const v of document.querySelectorAll('.ads-sample video')) v.muted = true;
    for (const b of document.querySelectorAll('.ads-sound')) { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Sound on'; }
    if (on) {
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(() => {});
      btn.setAttribute('aria-pressed', 'true');
      btn.textContent = 'Sound off';
    }
  });
}

// Card samples: the file is attached at once but, with preload="none", only downloads when it plays.
// They play while on screen (IntersectionObserver) and a tap toggles play/pause as a fallback.
const cardVideos = document.querySelectorAll('.ads-card__clip video');
const watcher = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
  for (const { target: v, isIntersecting } of entries) isIntersecting ? v.play().catch(() => {}) : v.pause();
}, { rootMargin: '120px' });
for (const v of cardVideos) {
  v.src = v.dataset.src;
  v.addEventListener('click', () => (v.paused ? v.play().catch(() => {}) : v.pause()));
  if (watcher) watcher.observe(v);
}
