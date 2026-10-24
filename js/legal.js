// Legal pages (privacy, terms, licences, 404): shared header and footer, plus the photo credits list.
import { initChrome, el } from './common.js?v=88fcc63b';
import { PHOTOS, credit } from './data/photos.js?v=88fcc63b';

initChrome({ page: 'legal' });

const list = document.getElementById('photo-credits');
if (list) {
  const seen = new Map();
  for (const ps of Object.values(PHOTOS)) for (const p of ps) { const c = credit(p); if (!seen.has(c.href)) seen.set(c.href, c.by); }
  list.replaceChildren(...[...seen].sort((a, b) => a[1].localeCompare(b[1])).map(([href, by]) =>
    el('li', {}, el('a', { href, target: '_blank', rel: 'noopener', textContent: by }))));
}
