// Home page.
import { CONTACT, WORK, FAQ, CREDENTIALS } from './data/site-data.js';
import { CATEGORIES, ITEMS } from './data/catalog-data.js';
import { img } from './data/photos.js';
import { icon } from './icons.js';
import { fb, configured } from './firebase.js';
import { $, el, initChrome, CAT, byId, productUrl, catPhoto } from './common.js';
import { card, price } from './shop.js';

initChrome({ page: 'home' });

/* ---------- hero mosaic ---------- */
const MOSAIC = [['glow-sign-boards', 'Signboards'], ['ai-generated-promotional-videos', 'AI video ads'], ['song-mixing', 'Music mixing']];
$('#mosaic').replaceChildren(...MOSAIC.map(([id, label], n) => {
  const i = byId(id), ph = i?.photos[0];
  const a = el('a', { href: `catalog?cat=${i.cat}` },
    ph ? el('img', { src: img(ph, n === 0 ? 720 : 480, n === 0 ? 980 : 480), alt: '', loading: 'eager', width: 480, height: 480 }) : null,
    el('span', {}, label, el('small', { textContent: `from ${price(i).val.split(' – ')[0]}` })));
  return a;
}));

/* ---------- shop by category ---------- */
$('#cats-sub').textContent = `${ITEMS.length} products and services, each with an average price.`;
$('#cats').replaceChildren(...CATEGORIES.map(c => {
  const ph = catPhoto(c), n = ITEMS.filter(i => i.cat === c.id).length;
  return el('li', {}, el('a', { href: `catalog?cat=${c.id}` },
    ph ? el('img', { src: img(ph, 168), alt: '', loading: 'lazy', width: 84, height: 84 }) : null,
    el('b', { textContent: c.name }), el('small', { textContent: `${n} ${n === 1 ? 'item' : 'items'}` })));
}));

/* ---------- product rails ---------- */
const OFF = ['shop-signboards', 'glow-sign-boards', 'led-neon-signs', 'visiting-cards', 'standees', 'printed-mugs', 'school-uniforms', 'menu-cards'];
const ON = ['ai-generated-promotional-videos', 'instagram-reels-and-youtube-shorts', 'logo-design', 'business-websites', 'festival-and-sale-posters', 'mixing-mastering-package', 'e-commerce-websites', 'local-seo-and-google-business-profile'];
$('#rail-offline').replaceChildren(...OFF.map(byId).filter(Boolean).map(i => card(i)));
$('#rail-online').replaceChildren(...ON.map(byId).filter(Boolean).map(i => card(i)));

/* ---------- music promo ---------- */
const music = ITEMS.filter(i => i.cat === 'music');
$('#music-list').replaceChildren(...music.map(i => el('li', {}, el('a', { href: productUrl(i), textContent: i.name, style: 'text-decoration:none' }))));
const mph = byId('mixing-mastering-package')?.photos[0];
if (mph) { $('#music-img').src = img(mph, 900, 700); }

/* ---------- work + player ---------- */
const player = $('#player'), box = $('#player-box');
$('#work-list').replaceChildren(...WORK.map(w => {
  const b = el('button', { type: 'button', ariaLabel: `Play ${w.title}` },
    el('img', { src: w.poster, alt: '', loading: 'lazy', width: 400, height: 622 }),
    el('span', { className: 'work__tag', textContent: `${w.kind} · AI-generated` }));
  b.insertAdjacentHTML('beforeend', `<span class="work__play">${icon('play')}</span>`);
  b.append(el('span', { className: 'work__cap' }, el('b', { textContent: w.title }), el('span', { textContent: w.note })));
  b.addEventListener('click', () => {
    box.replaceChildren(el('iframe', {
      src: `https://www.youtube-nocookie.com/embed/${w.id}?autoplay=1&rel=0&playsinline=1`,
      title: w.title, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowFullscreen: true,
    }));
    player.showModal();
  });
  return el('div', { className: 'work__item' }, b);
}), el('div', { className: 'work__soon' },
  el('h3', { textContent: 'New videos are on the way' }),
  el('p', { textContent: 'We are making fresh ads and music videos for this website. Until then, see everything we post on YouTube and Instagram.' }),
  el('p', {}, el('a', { className: 'btn btn--line btn--sm', href: CONTACT.youtube, target: '_blank', rel: 'noopener', textContent: 'YouTube' }), ' ',
    el('a', { className: 'btn btn--line btn--sm', href: CONTACT.instagram, target: '_blank', rel: 'noopener', textContent: 'Instagram' }))));
player.addEventListener('close', () => box.replaceChildren());
player.addEventListener('click', e => { if (e.target === player) player.close(); });

/* ---------- credentials + FAQ ---------- */
$('#creds').replaceChildren(...CREDENTIALS.map(c => el('li', { textContent: c })));
$('#faq-list').replaceChildren(...FAQ.map(f => el('details', {}, el('summary', { textContent: f.q }), el('p', { textContent: f.a }))));

/* ---------- enquiry form ---------- */
const sel = $('#service-select');
sel.append(el('option', { value: '', textContent: 'Choose a category' }));
for (const c of CATEGORIES) sel.append(el('option', { value: c.name, textContent: c.name }));
sel.append(el('option', { value: 'Something else', textContent: 'Something else' }));

// coming from the quote list or a product page: prefill the form
const enquiry = new URLSearchParams(location.search).get('enquiry');
if (enquiry) {
  const names = enquiry.split(', ').slice(0, 30);
  const cats = [...new Set(names.map(n => ITEMS.find(i => i.name === n)?.cat).filter(Boolean))];
  sel.value = cats.length === 1 ? CAT[cats[0]].name : 'Something else';
  $('#lead-form').message.value = `I'd like a quote for: ${names.join(', ')}.\n\nDetails (sizes, quantity, deadline): `;
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
  if (!check(leadForm)) { say(leadForm, 'Fill in your name, a phone number or email, the service and a few project details.', 'err'); return; }
  const data = Object.fromEntries(['name', 'contact', 'service', 'budget', 'message'].map(k => [k, leadForm[k].value.trim()]));
  const btn = $('button[type=submit]', leadForm); btn.disabled = true; btn.textContent = 'Sending…'; say(leadForm, '');
  const results = await Promise.allSettled([saveLead(data), emailLead(data)]);
  btn.disabled = false; btn.textContent = 'Send enquiry';
  if (results.some(r => r.status === 'fulfilled')) {
    leadForm.reset();
    say(leadForm, 'Enquiry sent. We will reply on WhatsApp or email within 24 hours.', 'ok');
  } else {
    say(leadForm, 'The enquiry could not be sent. Check your internet connection and try again, or message us on WhatsApp.', 'err');
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

/* ---------- reviews (real reviews only, shown after approval) ---------- */
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
    $('#review-list').replaceChildren(...rows.map(r => el('figure', { className: 'review' },
      el('p', { className: 'review__stars', textContent: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating), ariaLabel: `${r.rating} out of 5` }),
      el('blockquote', { textContent: r.text, style: 'margin:0 0 12px' }),
      el('figcaption', { className: 'review__by', textContent: r.business ? `${r.name}, ${r.business}` : r.name }))));
  } catch { /* keep the empty state */ }
}
// load reviews only when the section comes into view (saves Firebase reads)
new IntersectionObserver((es, o) => { if (es.some(e => e.isIntersecting)) { o.disconnect(); loadReviews(); } }, { rootMargin: '400px' }).observe($('#reviews'));
