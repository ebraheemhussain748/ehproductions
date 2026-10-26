// Shared by every page: clean URLs, nav (search, menu), live prices from the admin, my list drawer, toast.
import './guard.js?v=77a24b5e';
import { CONTACT } from './data/site-data.js?v=77a24b5e';
import { CATEGORIES, ITEMS } from './data/catalog-data.js?v=77a24b5e';
import { PHOTOS, img } from './data/photos.js?v=77a24b5e';
import { icon } from './icons.js?v=77a24b5e';

// Show addresses without ".html" (GitHub Pages serves /catalog from catalog.html).
if (/\.html$/.test(location.pathname)) {
  const clean = location.pathname.replace(/index\.html$/, '').replace(/\.html$/, '');
  history.replaceState(history.state, '', clean + location.search + location.hash);
}

document.documentElement.classList.add('js');
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...kids.filter(k => k != null && k !== false));
  return n;
};
export const wa = (text = '') => `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};
export const fillIcons = (root = document) => $$('[data-icon]', root).forEach(n => { if (!n.firstChild) n.innerHTML = icon(n.dataset.icon); });
fillIcons(); // draw nav and button icons straight away

/* ---------- catalog items ---------- */
export const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
ITEMS.forEach(i => { i.id = slug(i.name); i.group = CAT[i.cat].group; i.photos = PHOTOS[i.id] || []; });
export const byId = id => ITEMS.find(i => i.id === id);
export const productUrl = i => `product?id=${encodeURIComponent(i.id)}`;
export const catPhoto = c => ITEMS.find(i => i.cat === c.id && i.photos.length)?.photos[0];

/* ---------- live settings from the admin page (Firestore document site/public) ----------
   Read through the public REST API so visitors do not need to download Firebase. */
export const site = { announcement: '', featured: [] };
const REST = 'https://firestore.googleapis.com/v1/projects/ehproductions-f0c49/databases/(default)/documents/site/public';
const decode = v => {
  if (!v) return null;
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, decode(x)]));
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode);
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('stringValue' in v) return v.stringValue;
  return null;
};
const range = v => Array.isArray(v) && v.length === 2 && v.every(n => Number.isFinite(n) && n >= 0) ? v : undefined;
function applySite(d = {}) {
  for (const [id, o] of Object.entries(d.prices || {})) {
    const i = byId(id); if (!i || !o) continue;
    if (o.quote) i.inr = null; else if (range(o.inr)) i.inr = range(o.inr);
    if (range(o.usd)) i.usd = range(o.usd);
    if (typeof o.unit === 'string' && o.unit) i.unit = o.unit;
    if (typeof o.badge === 'string') i.badge = o.badge;
    if (o.hidden) i.hidden = true;
  }
  for (const c of d.custom || []) {
    if (!c || !c.name || !CAT[c.cat] || byId(slug(c.name))) continue;
    ITEMS.push({ cat: c.cat, name: String(c.name).slice(0, 80), what: String(c.what || '').slice(0, 300), inr: c.quote ? null : range(c.inr) || null,
      usd: range(c.usd), unit: String(c.unit || ''), src: [], badge: c.badge || '', custom: true,
      id: slug(c.name), group: CAT[c.cat].group,
      photos: /^photo-[\w-]+$/.test(c.photo || '') ? [{ photo: c.photo, by: '', user: '' }] : [] });
  }
  for (let k = ITEMS.length - 1; k >= 0; k--) if (ITEMS[k].hidden) ITEMS.splice(k, 1);
  site.announcement = typeof d.announcement === 'string' ? d.announcement.slice(0, 200) : '';
  site.featured = Array.isArray(d.featured) ? d.featured.filter(id => byId(id)) : [];
}
export const ready = (async () => {
  let data = store.get('site-public', null);
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 2500);
    const headers = await Promise.race([import('./firebase.js?v=77a24b5e').then(m => m.appCheckHeaders()), new Promise(r => setTimeout(() => r({}), 1500))]);
    const r = await fetch(REST, { signal: ctl.signal, cache: 'no-store', headers }); clearTimeout(t);
    if (r.ok) { const j = await r.json(); data = decode({ mapValue: { fields: j.fields || {} } }); store.set('site-public', data); }
    else if (r.status === 404) { data = {}; store.set('site-public', data); }
  } catch { /* offline or slow: use the last copy, or the built-in prices */ }
  applySite(data || {});
})();

/* ---------- my list (sent on WhatsApp) ---------- */
const listeners = new Set();
let ids = new Set(store.get('qlist', []));
export const quote = {
  has: id => ids.has(id),
  get size() { return [...ids].filter(byId).length; },
  items: () => [...ids].map(byId).filter(Boolean),
  toggle(id) { ids.has(id) ? ids.delete(id) : ids.add(id); this.save(); return ids.has(id); },
  remove(id) { ids.delete(id); this.save(); },
  clear() { ids.clear(); this.save(); },
  save() { store.set('qlist', [...ids]); listeners.forEach(f => f()); },
  onChange: f => listeners.add(f),
  text(note = '') {
    const rows = this.items().map((i, n) => `${n + 1}. ${i.name} (${CAT[i.cat].name})`);
    return `Hi Ebraheem Hussain Productions, I'd like a quote for:\n${rows.join('\n')}${note.trim() ? `\n\nDetails: ${note.trim()}` : ''}\n\n[From your website]`;
  },
  formUrl() { return `./?enquiry=${encodeURIComponent(this.items().map(i => i.name).join(', '))}#contact`; },
};

let toastTimer;
export function toast(msg) {
  let t = $('#toast');
  if (!t) { t = el('div', { id: 'toast', className: 'toast', role: 'status' }); document.body.append(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

export const thumb = (i, w = 120) => i.photos[0] ? el('img', { src: img(i.photos[0], w), alt: '', loading: 'lazy', width: w / 2, height: w / 2 }) : el('span', { className: 'ph', innerHTML: icon(CAT[i.cat].icon) });

function buildDrawer() {
  const d = el('dialog', { className: 'drawer', id: 'qdrawer' });
  d.setAttribute('aria-labelledby', 'qd-title');
  d.innerHTML = `
    <div class="drawer__head"><h2 id="qd-title">My list</h2><button class="drawer__close" type="button" aria-label="Close">${icon('close')}</button></div>
    <ul class="drawer__list" id="qd-list"></ul>
    <p class="drawer__empty" id="qd-empty">Your list is empty. Tap “Add” on anything in the shop, then send the whole list to us in one WhatsApp message.</p>
    <div class="drawer__foot" id="qd-foot">
      <label class="drawer__note">Details (optional)<textarea id="qd-note" rows="2" maxlength="500" placeholder="Size, quantity, deadline…"></textarea></label>
      <a class="btn btn--wa btn--block" id="qd-wa" target="_blank" rel="noopener">${icon('wa')}<span>Send list on WhatsApp</span></a>
      <a class="btn btn--outline btn--block" id="qd-form">Use the enquiry form</a>
      <p class="small"><button class="linkbtn" type="button" id="qd-clear">Clear list</button></p>
    </div>`;
  document.body.append(d);
  $('.drawer__close', d).addEventListener('click', () => d.close());
  d.addEventListener('click', e => { if (e.target === d) d.close(); });
  $('#qd-clear', d).addEventListener('click', () => quote.clear());
  const note = $('#qd-note', d);
  note.addEventListener('input', () => { $('#qd-wa', d).href = wa(quote.text(note.value)); });
  const render = () => {
    const items = quote.items();
    $('#qd-empty', d).hidden = items.length > 0;
    $('#qd-foot', d).hidden = items.length === 0;
    $('#qd-wa', d).href = wa(quote.text(note.value));
    $('#qd-form', d).href = quote.formUrl();
    $('#qd-list', d).replaceChildren(...items.map(i => {
      const rm = el('button', { type: 'button', className: 'linkbtn', textContent: 'Remove' });
      rm.setAttribute('aria-label', `Remove ${i.name}`);
      rm.addEventListener('click', () => quote.remove(i.id));
      return el('li', {}, thumb(i), el('div', {}, el('a', { href: productUrl(i), textContent: i.name }), el('small', { textContent: CAT[i.cat].name })), rm);
    }));
  };
  quote.onChange(render); render();
  return d;
}

/* ---------- nav, footer, reveal ---------- */
export async function initChrome() {
  fillIcons();
  await ready;

  const a = $('#announce');
  if (a && site.announcement) { a.textContent = site.announcement; a.hidden = false; }

  // search panel
  const sp = $('#searchpanel'), so = $('#search-open');
  so?.addEventListener('click', () => {
    const open = sp.hidden; sp.hidden = !open; so.setAttribute('aria-expanded', open);
    if (open) $('#hq').focus();
  });
  const sug = $('#suggest');
  if (sug) sug.replaceChildren(...['Visiting cards', 'Glow sign board', 'Flex banner', 'AI video ad', 'Logo', 'Website', 'Song mixing'].map(q =>
    el('li', {}, el('a', { href: `catalog?q=${encodeURIComponent(q)}`, textContent: q }))));
  const params = new URLSearchParams(location.search);
  if ($('#hq') && params.get('q')) $('#hq').value = params.get('q');

  // phone menu
  $('#menu-open')?.addEventListener('click', () => {
    const m = el('div', { className: 'mobilemenu', role: 'dialog', ariaLabel: 'Menu' });
    m.innerHTML = `<div class="mobilemenu__top"><a class="brand" href="./"><img src="assets/img/logo-mark-96.png" alt="" width="62" height="32"><span>Ebraheem Hussain<small>Productions</small></span></a><button class="iconbtn" type="button" aria-label="Close menu">${icon('close')}</button></div>`;
    m.append(el('ul', {}, ...$$('#nav-links a').map(x => el('li', {}, el('a', { href: x.getAttribute('href'), textContent: x.textContent })))),
      el('a', { className: 'btn btn--dark btn--block', href: './#contact', textContent: 'Get a quote' }));
    const close = () => { m.remove(); document.body.style.overflow = ''; };
    m.addEventListener('click', e => { if (e.target.closest('a, .iconbtn')) close(); });
    document.body.append(m); document.body.style.overflow = 'hidden';
  });

  // my list
  const drawer = $('#qdrawer') || buildDrawer();
  const count = () => $$('.qcount').forEach(n => { n.textContent = quote.size; n.dataset.n = quote.size; });
  quote.onChange(count); count();
  $$('[data-open-quote]').forEach(b => b.addEventListener('click', () => drawer.showModal()));

  // contact links
  const hello = wa('Hi Ebraheem Hussain Productions, I would like a quote for ');
  $$('[data-link="whatsapp"]').forEach(x => { x.href = hello; });
  $$('[data-link="call"]').forEach(x => { x.href = `tel:+${CONTACT.whatsapp}`; });
  $$('[data-link="youtube"]').forEach(x => { x.href = CONTACT.youtube; });
  $$('[data-link="instagram"]').forEach(x => { x.href = CONTACT.instagram; });
  $$('[data-link="email"]').forEach(x => { x.href = `mailto:${CONTACT.email}`; });
  $$('.year').forEach(n => { n.textContent = new Date().getFullYear(); });
  // "Build my plan" opens the questions in place (the link still works without JavaScript)
  $$('[data-open-plan]').forEach(a => a.addEventListener('click', async e => { e.preventDefault(); (await import('./quiz.js?v=77a24b5e')).openQuiz(); }));
  reveal();
}

export function reveal(root = document) {
  const els = $$('.reveal:not(.in)', root);
  if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
}

// Stops the same browser from sending a form again and again (accidental double taps and simple spam).
export const recentlySent = (key, seconds = 60) => Date.now() - Number(store.get(`sent-${key}`, 0)) < seconds * 1000;
export const markSent = key => store.set(`sent-${key}`, Date.now());

// Contact checks shared by the forms. Indian mobile numbers need 10 digits (6 to 9 first);
// numbers from other countries must start with + and the country code.
export function cleanPhone(v) {
  const raw = String(v || '').trim();
  if (!raw || /[^\d\s+\-().]/.test(raw)) return null;
  let d = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) {
    if (d.startsWith('91')) d = d.slice(2); else return d.length >= 8 && d.length <= 15 ? `+${d}` : null;
  } else if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : null;
}
export const cleanEmail = v => { const e = String(v || '').trim().toLowerCase(); return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(e) ? e : null; };
export const cleanName = v => { const n = String(v || '').trim().replace(/\s+/g, ' '); return /^[\p{L}][\p{L}\p{M} .'-]{1,79}$/u.test(n) ? n : null; };
