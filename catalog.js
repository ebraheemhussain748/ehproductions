import { CONTACT } from './site-data.js';
import { NOTE, DELIVERY, CHECKED, GROUPS, CATEGORIES, ITEMS, SOURCES } from './catalog-data.js';
import { icon } from './icons.js';

document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids.filter(k => k != null)); return n; };
const html = (tag, cls, markup) => { const n = document.createElement(tag); if (cls) n.className = cls; n.innerHTML = markup; return n; };
const wa = text => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };

const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
ITEMS.forEach(i => { i.id = slug(i.name); i.group = CAT[i.cat].group; });

// extra words people type (English + common Hinglish) so search finds the right thing
const KEYWORDS = {
  signage: 'board boards sign signs signage dukan dukaan shop hoarding billboard neon led acrylic 3d letters acp standee banner glow outdoor',
  banners: 'banner banners flex poster posters backdrop birthday wedding shaadi shadi event rally election political opening',
  business: 'print printing card cards visiting business pamphlet leaflet flyer brochure catalogue booklet letterhead bill invoice envelope invitation id lanyard',
  plates: 'name plate nameplate naam board direction reception sign door house ghar office',
  gifts: 'gift gifts corporate pen pens mug mugs calendar diary notebook bottle bag keychain trophy memento school coaching',
  uniforms: 'uniform uniforms dress school staff tshirt t-shirt tee polo cap caps hoodie jacket clothing kapde',
  retail: 'restaurant hotel cafe dhaba menu packaging box boxes bag bags carry label labels sticker stickers qr upi standee',
  social: 'social media instagram facebook post posts story stories reel creative ads festival diwali eid holi sale poster',
  video: 'video videos reel reels shorts youtube ad ads advertisement commercial ai animation animated explainer motion graphics logo reveal music',
  branding: 'brand branding logo logos kit identity guidelines card design campaign',
  websites: 'website websites site landing page portfolio lead leads web',
  webdev: 'website ecommerce e-commerce online store shop development maintenance custom',
  apps: 'app apps android ios iphone mobile application saas web app education school',
  digital: 'automation whatsapp bot chatbot ai tool tools software crm erp api integration seo google business profile maps',
};

/* ---------- static bits ---------- */
document.querySelectorAll('[data-icon]').forEach(n => { n.innerHTML = icon(n.dataset.icon); });
$('#item-count').textContent = ITEMS.length;
$('#note-text').textContent = NOTE;
$('#delivery-text').textContent = DELIVERY;
$('#checked').textContent = CHECKED;
$('#year').textContent = new Date().getFullYear();
$('#f-yt').href = CONTACT.youtube; $('#f-ig').href = CONTACT.instagram;
const tel = `tel:+${CONTACT.whatsapp}`;
$('#abar-wa').href = wa('Hi Ebraheem Hussain Productions, I saw your catalog and I would like a quote.');
$('#abar-call').href = tel;
$('#foot-contact').innerHTML = `WhatsApp / call <a href="${tel}">${CONTACT.whatsappDisplay}</a> · <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>`;
$('#print-contact').textContent = `WhatsApp ${CONTACT.whatsappDisplay} · ${CONTACT.email} · ${CONTACT.location} · ${DELIVERY}`;
$('#empty-wa').href = wa('Hi Ebraheem Hussain Productions, I need something that is not in your catalog: ');

const toggle = $('.nav__toggle'), links = $('#nav-links');
toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded', links.classList.toggle('open')));

/* ---------- state (kept in the URL so a filtered view can be shared) ---------- */
const params = new URLSearchParams(location.search);
const state = {
  q: params.get('q') || '',
  cat: CAT[params.get('cat')] ? params.get('cat') : 'all',
  group: ['offline', 'online'].includes(params.get('type')) ? params.get('type') : 'all',
  cur: store.get('cur', 0) ? 1 : 0,
};
const list = new Set(store.get('qlist', []).filter(id => ITEMS.some(i => i.id === id)));
$('#q').value = state.q;

function syncUrl() {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.cat !== 'all') p.set('cat', state.cat);
  if (state.group !== 'all') p.set('type', state.group);
  history.replaceState(null, '', `${location.pathname}${p.toString() ? '?' + p : ''}`);
}

/* ---------- search ---------- */
// common Hinglish / alternative words mapped to the words used in the catalog
const SYN = {
  shaadi: 'wedding', shadi: 'wedding', vivah: 'wedding', dukan: 'shop', dukaan: 'shop', naam: 'name', ghar: 'house',
  kapde: 'clothing', vardi: 'uniform', tshirt: 't-shirt', tee: 't-shirt', banner: 'banners', flyer: 'leaflets', handbill: 'pamphlets',
  card: 'cards', invitation: 'invitation', business: 'business', board: 'board', hoarding: 'hoardings', billboard: 'billboards',
  reel: 'reels', short: 'shorts', ad: 'ad', ads: 'ad', advert: 'advertisements', commercial: 'ad', app: 'app', apps: 'app',
  site: 'website', web: 'website', shop: 'shop', store: 'store', bot: 'chatbots', chatbot: 'chatbots', seo: 'seo', gmb: 'google',
};
const norm = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9₹ -]+/g, ' ');
ITEMS.forEach(i => { i.own = norm([i.name, i.what, i.tip || ''].join(' ')); i.wide = norm([i.own, CAT[i.cat].name, KEYWORDS[i.cat] || ''].join(' ')); });
const words = () => norm(state.q).split(/\s+/).filter(w => w.length > 1);
const hit = (hay, w) => hay.includes(w) || hay.includes(w.replace(/s$/, '')) || (SYN[w] && hay.includes(SYN[w].replace(/s$/, '')));
function searchPool() {
  const inGroup = ITEMS.filter(i => state.group === 'all' || i.group === state.group);
  const ws = words(); if (!ws.length) return inGroup;
  const own = inGroup.filter(i => ws.every(w => hit(i.own, w)));      // the item itself mentions it
  return own.length ? own : inGroup.filter(i => ws.every(w => hit(i.wide, w))); // else: whole category matches
}
const score = i => words().reduce((n, w) => n + (hit(norm(i.name), w) ? 3 : hit(i.own, w) ? 1 : 0), 0);

/* ---------- prices ---------- */
const inr = v => v >= 100000 ? `₹${(v / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })} lakh` : `₹${v.toLocaleString('en-IN')}`;
const usd = v => `$${v.toLocaleString('en-US')}`;
function priceNode(i) {
  const box = el('div', { className: 'price' });
  if (!i.inr) { box.append(el('span', { className: 'price__label', textContent: 'Price' }), el('span', { className: 'price__val', textContent: 'On quote' })); return box; }
  const useUsd = state.cur === 1 && i.usd;
  const [lo, hi] = useUsd ? i.usd : i.inr, f = useUsd ? usd : inr;
  box.append(
    el('span', { className: 'price__label', textContent: 'Average price*' }),
    el('span', { className: 'price__val', textContent: `${f(lo)} – ${f(hi)}` }),
    el('span', { className: 'price__unit', textContent: i.unit }));
  if (state.cur === 1 && !i.usd) box.append(el('span', { className: 'price__unit', textContent: 'USD quote on request' }));
  return box;
}

/* ---------- render ---------- */
const chipsBox = $('#chips'), results = $('#results');
function renderChips(pool) {
  const counts = {}; pool.forEach(i => { counts[i.cat] = (counts[i.cat] || 0) + 1; });
  const cats = CATEGORIES.filter(c => state.group === 'all' || c.group === state.group);
  const make = (id, label, n) => {
    const b = el('button', { type: 'button' }, label, el('span', { className: 'chip__n', textContent: n }));
    b.setAttribute('aria-pressed', state.cat === id);
    b.disabled = n === 0 && state.cat !== id;
    b.addEventListener('click', () => { state.cat = id; render(); results.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); });
    return b;
  };
  chipsBox.replaceChildren(make('all', 'All categories', pool.length), ...cats.map(c => make(c.id, c.name, counts[c.id] || 0)));
}

function card(i) {
  const added = list.has(i.id);
  const add = el('button', { type: 'button', className: 'btn btn--outline btn--sm add' });
  add.innerHTML = `${icon(added ? 'check' : 'plus')}<span>${added ? 'In your list' : 'Add to list'}</span>`;
  add.setAttribute('aria-pressed', added);
  add.setAttribute('aria-label', `${added ? 'Remove' : 'Add'} ${i.name} ${added ? 'from' : 'to'} your quote list`);
  add.addEventListener('click', () => { list.has(i.id) ? list.delete(i.id) : list.add(i.id); saveList(); render(); });
  const ask = el('a', { className: 'btn btn--wa btn--sm', href: wa(`Hi Ebraheem Hussain Productions, I'd like a quote for: ${i.name} (${CAT[i.cat].name}). [From your catalog]`), target: '_blank', rel: 'noopener', textContent: 'Get quote' });
  ask.setAttribute('aria-label', `Get a quote for ${i.name} on WhatsApp`);
  return el('article', { className: 'item', id: i.id },
    el('h3', { className: 'item__name', textContent: i.name }),
    el('p', { className: 'item__what', textContent: i.what }),
    priceNode(i),
    i.tip ? el('p', { className: 'item__tip', textContent: i.tip }) : null,
    el('div', { className: 'item__actions' }, ask, add));
}

function render() {
  const pool = searchPool();
  if (state.cat !== 'all' && !pool.some(i => i.cat === state.cat) && !state.q) state.cat = 'all';
  renderChips(pool);
  const shown = pool.filter(i => state.cat === 'all' || i.cat === state.cat);
  const sections = [];
  const order = state.q ? [...new Set(shown.slice().sort((a, b) => score(b) - score(a)).map(i => i.cat))] : CATEGORIES.map(c => c.id);
  for (const id of order) {
    const items = shown.filter(i => i.cat === id);
    if (!items.length) continue;
    if (state.q) items.sort((a, b) => score(b) - score(a));
    const c = CAT[id];
    const head = el('div', { className: 'group__head' });
    head.innerHTML = `<span class="group__icon">${icon(c.icon)}</span><div><p class="group__tag">${GROUPS.find(g => g.id === c.group).name}</p><h2 class="group__title"></h2><p class="group__blurb"></p></div>`;
    $('.group__title', head).textContent = c.name; $('.group__blurb', head).textContent = c.blurb;
    sections.push(el('section', { className: 'group', id: `cat-${id}` }, head, el('div', { className: 'items' }, ...items.map(card)), el('p', { className: 'group__note', textContent: `* ${NOTE}` })));
  }
  results.replaceChildren(...sections);
  $('#empty').hidden = shown.length > 0;
  const where = state.cat !== 'all' ? ` in ${CAT[state.cat].name}` : state.group !== 'all' ? ` (${state.group})` : '';
  $('#result-count').textContent = state.q ? `${shown.length} ${shown.length === 1 ? 'item' : 'items'} for “${state.q}”${where}` : `Showing ${shown.length} ${shown.length === 1 ? 'item' : 'items'}${where}`;
  $('#clear').hidden = !(state.q || state.cat !== 'all' || state.group !== 'all');
  document.querySelectorAll('#group-filter button').forEach(b => b.setAttribute('aria-pressed', b.dataset.group === state.group));
  document.querySelectorAll('.currency button').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.cur) === state.cur));
  renderList();
  syncUrl();
}

/* ---------- quote list ---------- */
function saveList() { store.set('qlist', [...list]); }
function listText() {
  const rows = [...list].map((id, n) => { const i = ITEMS.find(x => x.id === id); return `${n + 1}. ${i.name} (${CAT[i.cat].name})`; });
  return `Hi Ebraheem Hussain Productions, I'd like a quote for:\n${rows.join('\n')}\n\n[From your catalog]`;
}
function renderList() {
  const n = list.size;
  $('#qbar').hidden = n === 0;
  document.body.classList.toggle('has-qbar', n > 0);
  if (!n) { $('#qlist').hidden = true; $('#qbar-toggle').setAttribute('aria-expanded', 'false'); return; }
  $('#qbar-n').textContent = `${n} ${n === 1 ? 'item' : 'items'}`;
  $('#qbar-wa').href = wa(listText());
  $('#qbar-form').href = `index.html?enquiry=${encodeURIComponent([...list].map(id => ITEMS.find(x => x.id === id).name).join(', '))}#contact`;
  $('#qlist-items').replaceChildren(...[...list].map(id => {
    const i = ITEMS.find(x => x.id === id);
    const rm = el('button', { type: 'button', className: 'linkbtn', textContent: 'Remove' });
    rm.setAttribute('aria-label', `Remove ${i.name}`);
    rm.addEventListener('click', () => { list.delete(id); saveList(); render(); });
    return el('li', {}, el('span', { textContent: i.name }), rm);
  }));
}
$('#qbar-toggle').addEventListener('click', () => {
  const open = $('#qlist').hidden; $('#qlist').hidden = !open; $('#qbar-toggle').setAttribute('aria-expanded', open);
});
$('#qbar-clear').addEventListener('click', () => { list.clear(); saveList(); render(); });

/* ---------- controls ---------- */
let t;
$('#q').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 160); });
$('#find').addEventListener('submit', e => { e.preventDefault(); state.q = $('#q').value.trim(); render(); results.scrollIntoView({ block: 'start' }); });
document.querySelectorAll('#group-filter button').forEach(b => b.addEventListener('click', () => { state.group = b.dataset.group; if (state.cat !== 'all' && CAT[state.cat].group !== state.group && state.group !== 'all') state.cat = 'all'; render(); }));
document.querySelectorAll('.currency button').forEach(b => b.addEventListener('click', () => { state.cur = Number(b.dataset.cur); store.set('cur', state.cur); render(); }));
const reset = () => { state.q = ''; state.cat = 'all'; state.group = 'all'; $('#q').value = ''; render(); };
$('#clear').addEventListener('click', reset);
$('#empty-clear').addEventListener('click', reset);
$('#print').addEventListener('click', () => window.print());
// show the source list on paper / PDF too
let wasOpen; const det = $('.sources');
addEventListener('beforeprint', () => { wasOpen = det.open; det.open = true; });
addEventListener('afterprint', () => { det.open = wasOpen; });

/* ---------- jump list (desktop hero) ---------- */
$('#jump').replaceChildren(...CATEGORIES.map(c => {
  const a = el('a', { href: `#cat-${c.id}` }, el('span', { textContent: c.name }), el('span', { textContent: ITEMS.filter(i => i.cat === c.id).length }));
  a.addEventListener('click', e => { if (state.cat !== 'all' || state.q || state.group !== 'all') { e.preventDefault(); reset(); requestAnimationFrame(() => document.getElementById(`cat-${c.id}`)?.scrollIntoView()); } });
  return el('li', {}, a);
}));

/* ---------- sources ---------- */
const used = [...new Set(ITEMS.flatMap(i => i.src))].filter(k => SOURCES[k]).sort((a, b) => SOURCES[a][0].localeCompare(SOURCES[b][0]));
$('#source-list').replaceChildren(...used.map(k => el('li', {}, el('a', { href: SOURCES[k][1], target: '_blank', rel: 'noopener', textContent: SOURCES[k][0] }))));

render();
if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
