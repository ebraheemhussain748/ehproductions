import { CONTACT, WORK, SERVICES, FAQ, CREDENTIALS } from './site-data.js';
import { fb, configured } from './firebase.js';

document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  for (const k of kids) n.append(k);
  return n;
};
const wa = (text = '') => `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- contact links ---------- */
const hello = 'Hi Ebraheem Hussain Productions, I would like a quote for ';
for (const id of ['hero-wa', 'contact-wa', 'f-wa', 'fab-wa']) $('#' + id).href = wa(hello);
$('#wa-number').textContent = CONTACT.whatsappDisplay;
$('#contact-mail').href = `mailto:${CONTACT.email}`;
$('#contact-mail').textContent = CONTACT.email;
$('#contact-loc').textContent = CONTACT.location;
$('#yt-link').href = $('#f-yt').href = CONTACT.youtube;
$('#f-ig').href = CONTACT.instagram;
$('#year').textContent = new Date().getFullYear();

/* ---------- nav (mobile) ---------- */
const toggle = $('.nav__toggle'), links = $('#nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); } });

/* ---------- viewfinder: timecode follows the reel ---------- */
const reel = $('#reel'), tc = $('#tc'), vf = $('.vf');
requestAnimationFrame(() => setTimeout(() => vf.classList.add('ready'), 60));
if (reduceMotion) { reel.removeAttribute('autoplay'); reel.pause(); }
const pad = n => String(n).padStart(2, '0');
let tcBase = 0, lastT = 0;
reel.addEventListener('timeupdate', () => {
  if (reel.currentTime < lastT) tcBase += reel.duration || 0; // keeps counting across loops
  lastT = reel.currentTime;
  const t = tcBase + reel.currentTime, f = Math.floor((t % 1) * 24);
  tc.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(f)}`;
});

/* ---------- credentials ---------- */
for (const c of CREDENTIALS) { $('#creds').append(el('li', { textContent: c })); $('#creds-about').append(el('li', { textContent: c })); }

/* ---------- work strip + player ---------- */
const list = $('#work-list'), player = $('#player'), box = $('#player-box');
WORK.forEach(w => {
  const btn = el('button', { type: 'button', ariaLabel: `Play ${w.title}` },
    el('img', { src: w.poster, alt: '', loading: 'lazy', width: w.shape === 'wide' ? 782 : 248, height: 440 }),
    el('span', { className: 'frame__cap' },
      el('span', { className: 'frame__title', textContent: w.title }),
      el('span', { className: 'frame__kind', textContent: `${w.kind}. ${w.note}` })));
  btn.addEventListener('click', () => openPlayer(w));
  const li = el('li', { className: `frame frame--${w.shape}` }, btn);
  li.dataset.kind = w.kind;
  list.append(li);
});
function openPlayer(w) {
  box.className = `player__box ${w.shape}`;
  box.replaceChildren(el('iframe', {
    src: `https://www.youtube-nocookie.com/embed/${w.id}?autoplay=1&rel=0&playsinline=1`,
    title: w.title, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowFullscreen: true,
  }));
  reel.pause();
  player.showModal();
}
player.addEventListener('close', () => { box.replaceChildren(); if (!reduceMotion) reel.play().catch(() => {}); });
player.addEventListener('click', e => { if (e.target === player) player.close(); });

const kinds = ['All', ...new Set(WORK.map(w => w.kind))];
kinds.forEach((k, i) => {
  const b = el('button', { type: 'button', textContent: k });
  b.setAttribute('aria-pressed', i === 0);
  b.addEventListener('click', () => {
    $('#filters').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    list.querySelectorAll('.frame').forEach(f => { f.hidden = k !== 'All' && f.dataset.kind !== k; });
    list.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  $('#filters').append(b);
});

/* ---------- services + currency ---------- */
let cur = 0;
try { cur = Number(localStorage.getItem('cur') || 0) ? 1 : 0; } catch {}
const money = (v, c) => c ? `$${v.toLocaleString('en-US')}` : `₹${v.toLocaleString('en-IN')}`;
function renderServices() {
  for (const [key, id] of [['screen', '#svc-screen'], ['street', '#svc-street']]) {
    $(id).replaceChildren(...SERVICES[key].map(s => el('li', { className: 'svc__item' },
      el('span', { className: 'svc__name', textContent: s.name }),
      el('span', { className: 'svc__price' }, ...(s.price
        ? [el('small', { textContent: 'from' }), money(s.price[cur], cur)]
        : [el('small', { textContent: 'priced' }), 'on quote'])),
      el('span', { className: 'svc__what', textContent: s.what }))));
  }
  document.querySelectorAll('.currency button').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.cur) === cur));
}
document.querySelectorAll('.currency button').forEach(b => b.addEventListener('click', () => {
  cur = Number(b.dataset.cur); try { localStorage.setItem('cur', cur); } catch {} renderServices();
}));
renderServices();

const sel = $('#service-select');
sel.append(el('option', { value: '', textContent: 'Choose a service' }));
for (const s of [...SERVICES.screen, ...SERVICES.street]) sel.append(el('option', { value: s.name, textContent: s.name }));
sel.append(el('option', { value: 'Something else', textContent: 'Something else' }));

/* ---------- FAQ ---------- */
for (const f of FAQ) $('#faq-list').append(el('details', {}, el('summary', { textContent: f.q }), el('p', { textContent: f.a })));

/* ---------- forms ---------- */
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

/* ---------- reviews ---------- */
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
      el('blockquote', { textContent: r.text, style: 'margin:0 0 14px' }),
      el('figcaption', { className: 'review__by', textContent: r.business ? `${r.name}, ${r.business}` : r.name }))));
  } catch { /* keep the empty state */ }
}
loadReviews();
