// Shared by every page: clean URLs, header (menu, category bar, search), footer links, quote list drawer, toast.
import { CONTACT } from './data/site-data.js';
import { CATEGORIES, ITEMS } from './data/catalog-data.js';
import { PHOTOS, img } from './data/photos.js';
import { icon } from './icons.js';

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

/* ---------- catalog items, shared by home, catalog and product pages ---------- */
export const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
ITEMS.forEach(i => { i.id = slug(i.name); i.group = CAT[i.cat].group; i.photos = PHOTOS[i.id] || []; });
export const byId = id => ITEMS.find(i => i.id === id);
export const productUrl = i => `product?id=${encodeURIComponent(i.id)}`;
export const catPhoto = c => ITEMS.find(i => i.cat === c.id && i.photos.length)?.photos[0];

/* ---------- quote list (like a cart, sent on WhatsApp) ---------- */
const listeners = new Set();
const ids = new Set(store.get('qlist', []).filter(id => byId(id)));
export const quote = {
  has: id => ids.has(id),
  get size() { return ids.size; },
  items: () => [...ids].map(byId),
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

function buildDrawer() {
  const d = el('dialog', { className: 'drawer', id: 'qdrawer' });
  d.setAttribute('aria-labelledby', 'qd-title');
  d.innerHTML = `
    <div class="drawer__head"><h2 id="qd-title">My list</h2><button class="drawer__close" type="button" aria-label="Close">${icon('close')}</button></div>
    <ul class="drawer__list" id="qd-list"></ul>
    <p class="drawer__empty" id="qd-empty">Your list is empty. Tap “Add” on any product, then send the whole list to us in one WhatsApp message.</p>
    <div class="drawer__foot" id="qd-foot">
      <label class="drawer__note">Details (optional)<textarea id="qd-note" rows="2" maxlength="500" placeholder="Size, quantity, deadline…"></textarea></label>
      <a class="btn btn--wa btn--block" id="qd-wa" target="_blank" rel="noopener">${icon('wa')}<span>Send list on WhatsApp</span></a>
      <a class="btn btn--outline btn--block" id="qd-form">Use the enquiry form</a>
      <p class="small">Prices are averages. You get a fixed quote before any work starts. <button class="linkbtn" type="button" id="qd-clear">Clear list</button></p>
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
    $('#qd-wa', d).href = wa(quote.text($('#qd-note', d).value));
    $('#qd-form', d).href = quote.formUrl();
    $('#qd-list', d).replaceChildren(...items.map(i => {
      const rm = el('button', { type: 'button', className: 'linkbtn', textContent: 'Remove' });
      rm.setAttribute('aria-label', `Remove ${i.name}`);
      rm.addEventListener('click', () => quote.remove(i.id));
      const ph = i.photos[0];
      return el('li', {},
        ph ? el('img', { src: img(ph, 112), alt: '', loading: 'lazy', width: 56, height: 56 }) : el('span'),
        el('div', {}, el('a', { href: productUrl(i), textContent: i.name }), el('small', { textContent: CAT[i.cat].name })),
        rm);
    }));
  };
  quote.onChange(render); render();
  return d;
}

export function openQuote() { ($('#qdrawer') || buildDrawer()).showModal(); }

/* ---------- header + footer ---------- */
export function initChrome({ page } = {}) {
  fillIcons();
  const toggle = $('.nav__toggle'), links = $('#nav-links');
  toggle?.addEventListener('click', () => toggle.setAttribute('aria-expanded', links.classList.toggle('open')));
  links?.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); } });

  const params = new URLSearchParams(location.search);
  const bar = $('#catbar');
  if (bar) bar.replaceChildren(...CATEGORIES.map(c => {
    const a = el('a', { href: `catalog?cat=${c.id}`, textContent: c.name.replace(' & Landing-Page Packages', ' Packages') });
    if (c.id === 'music') a.classList.add('is-new');
    if (page === 'catalog' && params.get('cat') === c.id) a.setAttribute('aria-current', 'true');
    return el('li', {}, a);
  }));
  const hq = $('#hq'); if (hq && params.get('q')) hq.value = params.get('q');

  // quote list button + count
  const drawer = $('#qdrawer') || buildDrawer();
  const count = () => { $$('.qcount').forEach(n => { n.textContent = quote.size; }); };
  quote.onChange(count); count();
  $$('[data-open-quote]').forEach(b => b.addEventListener('click', () => drawer.showModal()));

  // contact links everywhere
  const hello = wa('Hi Ebraheem Hussain Productions, I would like a quote for ');
  $$('[data-link="whatsapp"]').forEach(a => { a.href = hello; });
  $$('[data-link="call"]').forEach(a => { a.href = `tel:+${CONTACT.whatsapp}`; });
  $$('[data-link="youtube"]').forEach(a => { a.href = CONTACT.youtube; });
  $$('[data-link="instagram"]').forEach(a => { a.href = CONTACT.instagram; });
  $$('[data-link="email"]').forEach(a => { a.href = `mailto:${CONTACT.email}`; if (!a.textContent.trim()) a.textContent = CONTACT.email; });
  $$('.year').forEach(n => { n.textContent = new Date().getFullYear(); });
}
