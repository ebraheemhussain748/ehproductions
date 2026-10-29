// Home page.
import { CONTACT, WORK, FAQ, CREDENTIALS } from './data/site-data.js?v=928c1474';
import { CATEGORIES, ITEMS } from './data/catalog-data.js?v=928c1474';
import { icon } from './icons.js?v=928c1474';
import { fb, configured } from './firebase.js?v=928c1474';
import { $, $$, el, initChrome, CAT, byId, site, ready, reveal, store, recentlySent, markSent, cleanName, cleanPhone, cleanEmail } from './common.js?v=928c1474';
import { card, price } from './shop.js?v=928c1474';

await ready;

/* ---------- work: our own films ---------- */
const player = $('#player'), box = $('#player-box');
$('#work-list').replaceChildren(...WORK.map(w => {
  const b = el('button', { type: 'button', className: 'reel', ariaLabel: `Play ${w.title}` },
    el('span', { className: 'reel__frame' }, el('img', { src: w.poster, alt: '', width: 540, height: 960, loading: 'lazy' })),
    el('span', { className: 'reel__tag', textContent: 'AI-generated' }));
  b.insertAdjacentHTML('beforeend', `<span class="reel__play"><i>${icon('play')}</i><span><b>${w.title}</b><small>${w.kind}</small></span></span>`);
  b.addEventListener('click', () => {
    box.replaceChildren(el('iframe', {
      src: `https://www.youtube-nocookie.com/embed/${w.id}?autoplay=1&rel=0&playsinline=1`,
      title: w.title, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowFullscreen: true,
    }));
    player.showModal();
  });
  return b;
}));
player.addEventListener('close', () => box.replaceChildren());
player.addEventListener('click', e => { if (e.target === player) player.close(); });

/* ---------- live starting prices in the story (the admin can change them) ---------- */
$$('[data-from]').forEach(n => {
  const i = byId(n.dataset.from); if (!i || !i.inr) return;
  const lo = price(i, 0).from.replace(/^From /, '');
  n.textContent = n.classList.contains('svc__price') ? `From ${lo} ${i.unit}` : `${lo} ${i.unit}`;
});
$('#fact-items').textContent = ITEMS.length;

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

/* ---------- the shop name typed on the sign ---------- */
const leadMsg = $('#lead-form').message;
let prefilled = '';
function useShop(v) {
  v = String(v || '').trim();
  $('#close-name').textContent = v || 'your business';
  const line = v ? `Business: ${v}\n\n` : '';
  if (!leadMsg.value || leadMsg.value === prefilled) { leadMsg.value = line; prefilled = line; }
}
if (!enquiry) useShop(store.get('eh-shop', ''));
addEventListener('eh:shop', e => useShop(e.detail));

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
const fieldErr = (form, name, text) => {
  const s = form.querySelector(`.form__err[data-for="${name}"]`);
  form[name].setAttribute('aria-invalid', Boolean(text)); if (s) s.textContent = text || '';
  return !text;
};
function checkLead(f) {
  const name = cleanName(f.name.value), phone = cleanPhone(f.phone.value), raw = f.email.value.trim();
  const email = raw ? cleanEmail(raw) : '', message = f.message.value.trim();
  const ok = [
    fieldErr(f, 'name', name ? '' : 'Write your name in letters, for example Rahul Sharma.'),
    fieldErr(f, 'phone', phone ? '' : 'Enter a 10-digit mobile number. From outside India, start with + and the country code.'),
    fieldErr(f, 'email', email !== null ? '' : 'This email address does not look right. You can also leave it empty.'),
    fieldErr(f, 'message', message.length >= 10 ? '' : 'Tell us a little more about the work (at least 10 letters).'),
  ];
  const bad = ['name', 'phone', 'email', 'message'][ok.indexOf(false)];
  if (bad) { f[bad].focus(); return null; }
  return { name, contact: email ? `${phone}, ${email}` : phone, message };
}
['name', 'phone', 'email', 'message'].forEach(k => leadForm[k].addEventListener('input', () => fieldErr(leadForm, k, '')));
leadForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (leadForm.website.value) return; // bot trap
  if (recentlySent('lead')) { say(leadForm, 'Your enquiry was just sent. Please wait a minute before sending another.', 'err'); return; }
  const checked = checkLead(leadForm);
  if (!checked) { say(leadForm, 'Please fix the field marked in red.', 'err'); return; }
  const data = { name: checked.name, contact: checked.contact, service: leadForm.service.value, budget: leadForm.budget.value || 'Not sure yet', message: checked.message };
  if (!data.service) data.service = 'Not chosen';
  const btn = $('button[type=submit]', leadForm); btn.disabled = true; btn.textContent = 'Sending…'; say(leadForm, '');
  const results = await Promise.allSettled([saveLead(data), emailLead(data)]);
  btn.disabled = false; btn.textContent = 'Send enquiry';
  if (results.some(r => r.status === 'fulfilled')) {
    markSent('lead');
    leadForm.reset(); prefilled = '';
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
  if (recentlySent('review', 600)) { say(rForm, 'Thank you, we already have your review. You can send another one later.', 'err'); return; }
  const btn = $('button[type=submit]', rForm); btn.disabled = true;
  try {
    const { db, fs } = await fb();
    await fs.addDoc(fs.collection(db, 'reviews'), {
      name: rForm.name.value.trim(), business: rForm.business.value.trim(), text: rForm.text.value.trim(),
      rating: Number(rForm.rating.value), approved: false, createdAt: fs.serverTimestamp(),
    });
    markSent('review'); rForm.reset(); say(rForm, 'Thank you. Your review will appear here after it is approved.', 'ok');
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
new IntersectionObserver((es, o) => { if (es.some(e => e.isIntersecting)) { o.disconnect(); loadReviews().then(() => dispatchEvent(new Event('eh:content'))); } }, { rootMargin: '400px' }).observe($('#reviews'));

await initChrome();
reveal();
// The story measured the page before these sections were filled in.
dispatchEvent(new Event('eh:content'));
