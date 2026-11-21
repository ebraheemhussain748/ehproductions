// Ready-made ads page: shared header and footer, plus a sound toggle on each sample video.
// Videos autoplay muted (browsers block sound until a tap); the button turns sound on for that clip only.
import { initChrome } from './common.js?v=4ce2a9ae';

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
