// Home page.
import { CONTACT, WORK, FAQ, CREDENTIALS } from './data/site-data.js?v=e19716b7';
import { CATEGORIES, ITEMS } from './data/catalog-data.js?v=e19716b7';
import { img } from './data/photos.js?v=e19716b7';
import { icon } from './icons.js?v=e19716b7';
import { fb, configured } from './firebase.js?v=e19716b7';
import { $, el, initChrome, CAT, byId, site, ready, reveal } from './common.js?v=e19716b7';
import { card } from './shop.js?v=e19716b7';

await ready;

/* ---------- work: our own videos first ---------- */
const player = $('#player'), box = $('#player-box');
$('#work-list').replaceChildren(...WORK.map(w => {
  const b = el('button', { type: 'button', className: 'reel', ariaLabel: `Play ${w.title}` },
    el('img', { src: w.poster, alt: '', width: 400, height: 622 }),
    el('span', { className: 'reel__tag', textContent: `${w.kind} · AI-generated` }));
  b.insertAdjacentHTML('beforeend', `<span class="reel__play"><i>${icon('play')}</i>${w.title}</span>`);
  b.addEventListener('click', () => {
    box.replaceChildren(el('iframe', {
      src: `https://www.youtube-nocookie.com/embed/${w.id}?autoplay=1&rel=0&playsinline=1`,
      title: w.title, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowFullscreen: true,
    }));
    player.showModal();
  });
  return b;
}), el('div', { className: 'showcase__note' },
  el('h3', { textContent: 'Real ads. No camera crew.' }),
  el('p', { textContent: 'Every film is made in-house with AI video tools, editing and motion graphics. New work is on the way.' }),
  el('p', {}, el('a', { className: 'btn btn--ghost-light btn--sm', href: CONTACT.youtube, target: '_blank', rel: 'noopener', textContent: 'YouTube' }), ' ',
    el('a', { className: 'btn btn--ghost-light btn--sm', href: CONTACT.instagram, target: '_blank', rel: 'noopener', textContent: 'Instagram' }))));
player.addEventListener('close', () => box.replaceChildren());
player.addEventListener('click', e => { if (e.target === player) player.close(); });

/* ---------- services bento ---------- */
const TILES = [
  { cls: 'tile--a', title: 'Video & social ads', text: 'Reels, Shorts and cinematic AI commercials that stop the scroll.', photo: 'ai-generated-promotional-videos', href: 'catalog?cat=video' },
  { cls: 'tile--b', title: 'Print & signage', text: 'Glow signs, flex, cards, uniforms and gifts. Couriered across India.', photo: 'glow-sign-boards', href: 'catalog?type=offline' },
  { cls: 'tile--c', title: 'Branding', text: 'Logos and brand kits.', photo: 'logo-design', href: 'catalog?cat=branding' },
  { cls: 'tile--d', title: 'Websites & apps', text: 'Fast sites that bring in enquiries.', photo: 'business-websites', href: 'catalog?cat=websites' },
  { cls: 'tile--e', title: 'Music production', text: 'Mixing and mastering, release-ready.', photo: 'mixing-mastering-package', href: 'catalog?cat=music', isNew: true },
];
$('#item-total').textContent = ITEMS.length;
$('#fact-items').textContent = ITEMS.length;
$('#bento').replaceChildren(...TILES.map(t => {
  const ph = byId(t.photo)?.photos[0];
  return el('a', { className: `tile reveal ${t.cls}`, href: t.href },
    ph ? el('img', { src: img(ph, 1100, 800), alt: '', loading: 'lazy', width: 1100, height: 800 }) : null,
    t.isNew ? el('span', { className: 'tile__new', textContent: 'New' }) : null,
    el('h3', { textContent: t.title }), el('p', { textContent: t.text }),
    el('span', { className: 'go', innerHTML: `Explore ${icon('arrow')}` }));
}));

/* ---------- popular (chosen in the admin page, or a default mix) ---------- */
const DEFAULT = ['shop-signboards', 'ai-generated-promotional-videos', 'visiting-cards', 'logo-design', 'glow-sign-boards', 'business-websites', 'mixing-mastering-package', 'led-neon-signs'];
const picks = (site.featured.length ? site.featured : DEFAULT).map(byId).filter(Boolean).slice(0, 12);
$('#rail').replaceChildren(...picks.map(i => card(i)));

/* ---------- about + FAQ ---------- */
$('#creds').replaceChildren(...CREDENTIALS.map(c => el('li', { textContent: c })));
$('#faq-list').replaceChildren(...FAQ.map(f => el('details', {}, el('summary', { textContent: f.q }), el('p', { textContent: f.a }))));

/* ---------- enquiry form ---------- */
const sel = $('#service-select');
sel.append(el('option', { value: '', textContent: 'Choose a category (optional)' }));
for (const c of CATEGORIES) sel.append(el('option', { value: c.name, textContent: c.name }));
sel.append(el('option', { value: 'Something else', textContent: 'Something else' }));

const enquiry = new URLSearchParams(location.search).get('enquiry');
if (enquiry) {
  const names = enquiry.split(', ').slice(0, 30);
  const cats = [...new Set(names.map(n => ITEMS.find(i => i.name === n)?.cat).filter(Boolean))];
  sel.value = cats.length === 1 ? CAT[cats[0]].name : 'Something else';
  $('#lead-form').message.value = `I'd like a price for: ${names.join(', ')}.\n\nDetails (size, quantity, deadline): `;
}

function check(form) {
  let ok = true;
  form.querySelectorAll('[required]').forEach(i => {
    const bad = !String(i.value).trim();
    i.setAttribute('aria-invalid', bad); if (bad && ok) { i.focus(); ok = false; }
  });
  return ok;
}
function say(form, text, kind) { const m = $('.form__msg', form); m.textContent = text; m.className = `form__msg ${kind || ''}`; }

const leadForm = $('#lead-form');
leadForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (leadForm.website.value) return; // bot trap
  if (!check(leadForm)) { say(leadForm, 'Add your name, a phone number or email, and a few words about the project.', 'err'); return; }
  const data = Object.fromEntries(['name', 'contact', 'service', 'budget', 'message'].map(k => [k, leadForm[k].value.trim()]));
  if (!data.service) data.service = 'Not chosen';
  const btn = $('button[type=submit]', leadForm); btn.disabled = true; btn.textContent = 'Sending…'; say(leadForm, '');
  const results = await Promise.allSettled([saveLead(data), emailLead(data)]);
  btn.disabled = false; btn.textContent = 'Send enquiry';
  if (results.some(r => r.status === 'fulfilled')) {
    leadForm.reset();
    say(leadForm, 'Sent. We will reply on WhatsApp or email within 24 hours.', 'ok');
  } else {
    say(leadForm, 'It could not be sent. Check your internet and try again, or message us on WhatsApp.', 'err');
  }
});
async function saveLead(d) {
  const { db, fs } = await fb();
  await fs.addDoc(fs.collection(db, 'leads'), { ...d, status: 'new', source: location.href.slice(0, 300), createdAt: fs.serverTimestamp() });
}
async function emailLead(d) {
  const r = await fetch(`https://formsubmit.co/ajax/${CONTACT.email}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ _subject: `New website enquiry: ${d.service}`, _template: 'table', _captcha: 'false', ...d }),
  });
  if (!r.ok) throw new Error('email failed');
}

/* ---------- reviews: real ones only, shown after approval ---------- */
const rForm = $('#review-form'), rOpen = $('#review-open');
rOpen.addEventListener('click', () => { rForm.hidden = !rForm.hidden; rOpen.setAttribute('aria-expanded', !rForm.hidden); if (!rForm.hidden) rForm.name.focus(); });
rForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!check(rForm)) { say(rForm, 'Add your name and a few words about working with us.', 'err'); return; }
  const btn = $('button[type=submit]', rForm); btn.disabled = true;
  try {
    const { db, fs } = await fb();
    await fs.addDoc(fs.collection(db, 'reviews'), {
      name: rForm.name.value.trim(), business: rForm.business.value.trim(), text: rForm.text.value.trim(),
      rating: Number(rForm.rating.value), approved: false, createdAt: fs.serverTimestamp(),
    });
    rForm.reset(); say(rForm, 'Thank you. Your review will appear here after it is approved.', 'ok');
  } catch { say(rForm, 'The review could not be sent. Try again in a minute.', 'err'); }
  btn.disabled = false;
});
async function loadReviews() {
  if (!configured) return;
  try {
    const { db, fs } = await fb();
    const snap = await fs.getDocs(fs.query(fs.collection(db, 'reviews'), fs.where('approved', '==', true), fs.limit(30)));
    const rows = snap.docs.map(d => d.data()).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    if (!rows.length) return;
    $('#reviews-h').textContent = 'What clients say.';
    $('#review-list').hidden = false;
    $('#review-list').replaceChildren(...rows.map(r => el('figure', { className: 'review' },
      el('p', { className: 'review__stars', textContent: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating), ariaLabel: `${r.rating} out of 5` }),
      el('blockquote', { textContent: r.text, style: 'margin:0 0 14px' }),
      el('figcaption', { className: 'review__by', textContent: r.business ? `${r.name}, ${r.business}` : r.name }),
      r.reply ? el('p', { className: 'review__reply' }, el('strong', { textContent: 'Reply from the studio: ' }), r.reply) : null)));
  } catch { /* keep the quiet state */ }
}
new IntersectionObserver((es, o) => { if (es.some(e => e.isIntersecting)) { o.disconnect(); loadReviews(); } }, { rootMargin: '400px' }).observe($('#reviews'));

await initChrome();
reveal();
