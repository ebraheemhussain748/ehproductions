// Catalog page: search, category and offline/online filters, sorting, currency, print.
import { NOTE, CHECKED, GROUPS, CATEGORIES, ITEMS, SOURCES } from './data/catalog-data.js';
import { $, $$, el, wa, initChrome, CAT, reduceMotion } from './common.js';
import { card, price, currency } from './shop.js';

initChrome({ page: 'catalog' });

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
  video: 'video videos reel reels shorts youtube ad ads advertisement commercial ai animation animated explainer motion graphics logo reveal',
  music: 'music song songs gaana gana mix mixing master mastering audio vocal vocals beat studio album ep nasheed recording sound',
  branding: 'brand branding logo logos kit identity guidelines card design campaign',
  websites: 'website websites site landing page portfolio lead leads web',
  webdev: 'website ecommerce e-commerce online store shop development maintenance custom',
  apps: 'app apps android ios iphone mobile application saas web app education school',
  digital: 'automation whatsapp bot chatbot ai tool tools software crm erp api integration seo google business profile maps',
};
const SYN = {
  shaadi: 'wedding', shadi: 'wedding', vivah: 'wedding', dukan: 'shop', dukaan: 'shop', naam: 'name', ghar: 'house',
  kapde: 'clothing', vardi: 'uniform', tshirt: 't-shirt', tee: 't-shirt', flyer: 'leaflets', handbill: 'pamphlets',
  hoarding: 'hoardings', billboard: 'billboards', reel: 'reels', short: 'shorts', ads: 'ad', advert: 'advertisements', commercial: 'ad',
  site: 'website', web: 'website', bot: 'chatbots', chatbot: 'chatbots', gmb: 'google', gaana: 'song', gana: 'song', mix: 'mixing', master: 'mastering',
};
const norm = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9₹ -]+/g, ' ');
ITEMS.forEach(i => { i.own = norm([i.name, i.what, i.tip || ''].join(' ')); i.wide = norm([i.own, CAT[i.cat].name, KEYWORDS[i.cat] || ''].join(' ')); });

/* ---------- state lives in the URL so a filtered view can be shared ---------- */
const params = new URLSearchParams(location.search);
const state = {
  q: params.get('q') || '',
  cat: CAT[params.get('cat')] ? params.get('cat') : 'all',
  group: ['offline', 'online'].includes(params.get('type')) ? params.get('type') : 'all',
  sort: ['low', 'high', 'az'].includes(params.get('sort')) ? params.get('sort') : '',
};
const hq = $('#hq'); hq.value = state.q;
$('#sort').value = state.sort;

function syncUrl() {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.cat !== 'all') p.set('cat', state.cat);
  if (state.group !== 'all') p.set('type', state.group);
  if (state.sort) p.set('sort', state.sort);
  history.replaceState(null, '', `${location.pathname}${p.toString() ? '?' + p : ''}`);
}

const words = () => norm(state.q).split(/\s+/).filter(w => w.length > 1);
const hit = (hay, w) => hay.includes(w) || hay.includes(w.replace(/s$/, '')) || (SYN[w] && hay.includes(SYN[w].replace(/s$/, '')));
function pool() {
  const inGroup = ITEMS.filter(i => state.group === 'all' || i.group === state.group);
  const ws = words(); if (!ws.length) return inGroup;
  const own = inGroup.filter(i => ws.every(w => hit(i.own, w)));
  return own.length ? own : inGroup.filter(i => ws.every(w => hit(i.wide, w)));
}
const score = i => words().reduce((n, w) => n + (hit(norm(i.name), w) ? 3 : hit(i.own, w) ? 1 : 0), 0);

/* ---------- render ---------- */
function renderFilters(all) {
  const counts = {}; all.forEach(i => { counts[i.cat] = (counts[i.cat] || 0) + 1; });
  const cats = CATEGORIES.filter(c => state.group === 'all' || c.group === state.group);
  const btn = (id, label, n) => {
    const b = el('button', { type: 'button' }, el('span', { textContent: label }), el('small', { textContent: n }));
    b.setAttribute('aria-pressed', state.cat === id);
    b.disabled = n === 0 && state.cat !== id;
    b.addEventListener('click', () => { state.cat = id; render(); $('.toolbar').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); });
    return el('li', {}, b);
  };
  $('#cat-filter').replaceChildren(btn('all', 'All categories', all.length), ...cats.map(c => btn(c.id, c.name, counts[c.id] || 0)));
  $$('#group-filter button').forEach(b => b.setAttribute('aria-pressed', b.dataset.group === state.group));
  $$('#currency button').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.cur) === currency.get()));
}

function render() {
  const all = pool();
  if (state.cat !== 'all' && !all.some(i => i.cat === state.cat) && !state.q) state.cat = 'all';
  renderFilters(all);
  let shown = all.filter(i => state.cat === 'all' || i.cat === state.cat);
  const sorted = state.sort || state.q;
  if (state.sort === 'low') shown = shown.slice().sort((a, b) => price(a).from - price(b).from);
  else if (state.sort === 'high') shown = shown.slice().sort((a, b) => (b.inr ? b.inr[1] : -1) - (a.inr ? a.inr[1] : -1));
  else if (state.sort === 'az') shown = shown.slice().sort((a, b) => a.name.localeCompare(b.name));
  else if (state.q) shown = shown.slice().sort((a, b) => score(b) - score(a));

  const nodes = [];
  if (sorted || state.cat !== 'all') {
    nodes.push(...shown.map((i, n) => card(i, { lazy: n > 5 })));
  } else {
    let n = 0;
    for (const c of CATEGORIES) {
      const items = shown.filter(i => i.cat === c.id);
      if (!items.length) continue;
      const head = el('div', { className: 'group-title', id: `cat-${c.id}` },
        el('h2', { textContent: c.name }), el('p', { textContent: `${GROUPS.find(g => g.id === c.group).name} · ${c.blurb}` }));
      nodes.push(head, ...items.map(i => card(i, { lazy: n++ > 5 })));
    }
  }
  $('#results').replaceChildren(...nodes);
  $('#empty').hidden = shown.length > 0;

  const c = state.cat !== 'all' ? CAT[state.cat] : null;
  $('#shop-title').textContent = c ? c.name : state.group === 'offline' ? 'Offline products' : state.group === 'online' ? 'Online services' : 'Catalog';
  $('#shop-sub').textContent = c ? c.blurb : 'Everything we make, with average prices. Add things to your quote list and send it in one WhatsApp message.';
  document.title = `${c ? c.name : 'Catalog and prices'} | Ebraheem Hussain Productions`;
  $('#crumbs').replaceChildren(...[el('li', {}, el('a', { href: './', textContent: 'Home' })),
    c ? el('li', {}, el('a', { href: 'catalog', textContent: 'Catalog' })) : el('li', { textContent: 'Catalog' }),
    c ? el('li', { textContent: c.name }) : null].filter(Boolean));
  $$('#catbar a').forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === `catalog?cat=${state.cat}`)));

  const where = c ? ` in ${c.name}` : state.group !== 'all' ? ` (${state.group})` : '';
  $('#result-count').textContent = state.q ? `${shown.length} ${shown.length === 1 ? 'result' : 'results'} for “${state.q}”${where}` : `${shown.length} ${shown.length === 1 ? 'item' : 'items'}${where}`;
  $('#clear').hidden = !(state.q || state.cat !== 'all' || state.group !== 'all' || state.sort);
  $('#empty-wa').href = wa(`Hi Ebraheem Hussain Productions, I need something that is not in your catalog: ${state.q}`);
  syncUrl();
}

/* ---------- controls ---------- */
let t;
hq.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = hq.value.trim(); render(); }, 160); });
hq.form.addEventListener('submit', e => { e.preventDefault(); state.q = hq.value.trim(); render(); $('.toolbar').scrollIntoView({ block: 'start' }); });
$$('#group-filter button').forEach(b => b.addEventListener('click', () => {
  state.group = b.dataset.group;
  if (state.cat !== 'all' && state.group !== 'all' && CAT[state.cat].group !== state.group) state.cat = 'all';
  render();
}));
$$('#currency button').forEach(b => b.addEventListener('click', () => { currency.set(Number(b.dataset.cur)); render(); }));
$('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
const reset = () => { state.q = ''; state.cat = 'all'; state.group = 'all'; state.sort = ''; hq.value = ''; $('#sort').value = ''; render(); };
$('#clear').addEventListener('click', reset);
$('#empty-clear').addEventListener('click', reset);
// category bar links: filter in place instead of reloading
$('#catbar').addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a) return;
  const id = new URL(a.href).searchParams.get('cat'); if (!id || !CAT[id]) return;
  e.preventDefault(); state.cat = id; state.q = ''; hq.value = ''; render(); scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

$('#note-text').textContent = NOTE;
$('#checked').textContent = CHECKED;
$('#print').addEventListener('click', () => window.print());
const det = $('.sources'); let wasOpen;
addEventListener('beforeprint', () => { wasOpen = det.open; det.open = true; });
addEventListener('afterprint', () => { det.open = wasOpen; });
const used = [...new Set(ITEMS.flatMap(i => i.src))].filter(k => SOURCES[k]).sort((a, b) => SOURCES[a][0].localeCompare(SOURCES[b][0]));
$('#source-list').replaceChildren(...used.map(k => el('li', {}, el('a', { href: SOURCES[k][1], target: '_blank', rel: 'noopener', textContent: SOURCES[k][0] }))));

render();
