// Catalog page: search, category and offline/online filters, sorting, currency, print.
import { GROUPS, CATEGORIES, ITEMS, SOURCES } from './data/catalog-data.js?v=3a74d31a';
import { $, $$, el, wa, initChrome, CAT, ready } from './common.js?v=3a74d31a';
import { card, price, currency } from './shop.js?v=3a74d31a';
import { index, words as toWords, hit, norm } from './search.js?v=3a74d31a';

await ready;
initChrome();

index(ITEMS, CAT);

/* ---------- state lives in the URL so a filtered view can be shared ---------- */
const params = new URLSearchParams(location.search);
const state = {
  q: params.get('q') || '',
  cat: CAT[params.get('cat')] ? params.get('cat') : 'all',
  group: ['offline', 'online'].includes(params.get('type')) ? params.get('type') : 'all',
  sort: ['low', 'high', 'az'].includes(params.get('sort')) ? params.get('sort') : '',
};
const hq = $('#cq'); hq.value = state.q;
$('#sort').value = state.sort;

function syncUrl() {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.cat !== 'all') p.set('cat', state.cat);
  if (state.group !== 'all') p.set('type', state.group);
  if (state.sort) p.set('sort', state.sort);
  history.replaceState(null, '', `${location.pathname}${p.toString() ? '?' + p : ''}`);
}

const words = () => toWords(state.q);
function pool() {
  const inGroup = ITEMS.filter(i => state.group === 'all' || i.group === state.group);
  const ws = words(); if (!ws.length) return inGroup;
  const own = inGroup.filter(i => ws.every(w => hit(i.own, w)));              // the product itself mentions every word
  const wide = inGroup.filter(i => !own.includes(i) && ws.every(w => hit(i.wide, w))); // or its category does
  if (own.length >= 4) return own;
  if (own.length || wide.length) return [...own, ...wide];
  return inGroup.filter(i => ws.some(w => hit(i.wide, w)));                    // last try: any word
}
const score = i => words().reduce((n, w) => n + (norm(i.name).startsWith(w) ? 5 : hit(norm(i.name), w) ? 3 : hit(i.own, w) ? 1 : 0), 0);

/* ---------- render ---------- */
function renderFilters(all) {
  const counts = {}; all.forEach(i => { counts[i.cat] = (counts[i.cat] || 0) + 1; });
  const cats = CATEGORIES.filter(c => (state.group === 'all' || c.group === state.group) && (counts[c.id] || c.id === state.cat));
  const btn = (id, label, n) => {
    const b = el('button', { type: 'button' }, el('span', { textContent: label }), el('small', { textContent: n }));
    b.setAttribute('aria-pressed', state.cat === id);
    b.disabled = n === 0 && state.cat !== id;
    b.addEventListener('click', () => { state.cat = id; render();  });
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
  if (state.sort === 'low') shown = shown.slice().sort((a, b) => price(a).low - price(b).low);
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
  $('#shop-title').textContent = c ? `${c.name}.` : state.group === 'offline' ? 'Print & signage.' : state.group === 'online' ? 'Digital services.' : 'Shop.';
  $('#shop-sub').textContent = c ? c.blurb : 'Everything we make, with prices. Add what you need to your list and send it in one WhatsApp message.';
  document.title = `${c ? c.name : 'Shop'} | Ebraheem Hussain Productions`;
  $('#crumbs').replaceChildren(...[el('li', {}, el('a', { href: './', textContent: 'Home' })),
    c ? el('li', {}, el('a', { href: 'catalog', textContent: 'Shop' })) : el('li', { textContent: 'Shop' }),
    c ? el('li', { textContent: c.name }) : null].filter(Boolean));

  const where = c ? ` in ${c.name}` : state.group !== 'all' ? ` (${state.group})` : '';
  $('#result-count').textContent = state.q ? `${shown.length} ${shown.length === 1 ? 'result' : 'results'} for “${state.q}”${where}` : `${shown.length} ${shown.length === 1 ? 'item' : 'items'}${where}`;
  $('#clear').hidden = !(state.q || state.cat !== 'all' || state.group !== 'all' || state.sort);
  $('#empty-wa').href = wa(`Hi Ebraheem Hussain Productions, I need something that is not in your catalog: ${state.q}`);
  syncUrl();
}

/* ---------- controls ---------- */
let t;
hq.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = hq.value.trim(); render(); }, 160); });
hq.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); state.q = hq.value.trim(); render(); hq.blur(); } });
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

$('#print').addEventListener('click', () => window.print());
const det = $('.sources'); let wasOpen;
addEventListener('beforeprint', () => { wasOpen = det.open; det.open = true; });
addEventListener('afterprint', () => { det.open = wasOpen; });
const used = [...new Set(ITEMS.flatMap(i => i.src))].filter(k => SOURCES[k]).sort((a, b) => SOURCES[a][0].localeCompare(SOURCES[b][0]));
$('#source-list').replaceChildren(...used.map(k => el('li', {}, el('a', { href: SOURCES[k][1], target: '_blank', rel: 'noopener', textContent: SOURCES[k][0] }))));

render();
