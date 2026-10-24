// Studio admin: dashboard, leads pipeline, reviews, prices, extra products, home page settings.
// Data lives in Firestore: leads/*, reviews/*, and one public document site/public that the website reads.
import { fb, configured, ADMIN_EMAIL } from './firebase.js?v=26a14d8f';
import { CATEGORIES, ITEMS } from './data/catalog-data.js?v=26a14d8f';
import { icon } from './icons.js?v=26a14d8f';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids.filter(k => k != null && k !== false)); return n; };
const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const DEFAULTS = ITEMS.map(i => ({ ...i, id: slug(i.name), group: CAT[i.cat].group }));
const byId = id => DEFAULTS.find(i => i.id === id);
const inr = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const toDate = ts => ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
const when = ts => { const d = toDate(ts); return d ? d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''; };
const today = () => new Date().toISOString().slice(0, 10);
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

let msgTimer;
function msg(t, kind = '') { const m = $('#msg'); m.textContent = t; m.className = `msg ${kind}`; clearTimeout(msgTimer); if (t) msgTimer = setTimeout(() => { m.textContent = ''; }, kind === 'err' ? 8000 : 2600); }

// Lead stages follow the WhatsApp Business labels: New lead → Quote sent → Payment pending → In production → Delivered
const STAGES = [['new', 'New'], ['contacted', 'Contacted'], ['quoted', 'Quote sent'], ['payment', 'Payment pending'], ['production', 'In production'], ['won', 'Delivered'], ['lost', 'Lost']];
const OPEN = ['new', 'contacted', 'quoted', 'payment', 'production'];
const stageName = s => (STAGES.find(x => x[0] === s) || ['', s || 'New'])[1];
const REPLIES = [
  ['Thanks for your enquiry', n => `Hi ${n}, thank you for contacting Ebraheem Hussain Productions! Could you share the size, quantity and deadline so I can send you a fixed price?`],
  ['Send quote', n => `Hi ${n}, here is your quote: ₹____ for ____. It includes ____. Delivery in __ days after approval. Shall we go ahead?`],
  ['Follow up', n => `Hi ${n}, just checking in on the quote I sent. Happy to adjust anything. Shall we start?`],
  ['Payment reminder', n => `Hi ${n}, your order is ready to start. Please send the advance of ₹____ on UPI and share the screenshot here.`],
  ['Delivered + review', n => `Hi ${n}, your order is delivered. Thank you! If you liked it, please leave a short review here: https://ebraheemhussain748.github.io/ehproductions/#reviews`],
];

let api, view = 'dashboard', leads = [], reviews = [];
let site = { prices: {}, custom: [], featured: [], announcement: '' };
const filters = { stage: 'open', q: '', sort: 'new', rv: 'waiting', pq: '', pcat: 'all' };

$$('[data-icon]').forEach(n => { n.innerHTML = icon(n.dataset.icon); });
if (!configured) { $('#login-text').textContent = 'Firebase is not connected yet. Add the project config in js/firebase.js.'; }
else start();

async function start() {
  api = await fb();
  const { auth, app } = api;
  const a = auth.getAuth(app);
  $('#signin').onclick = () => auth.signInWithPopup(a, new auth.GoogleAuthProvider()).catch(e => msg(`Sign-in failed: ${e.code || e.message}`, 'err'));
  $('#signout').onclick = () => auth.signOut(a);
  $$('[data-view]').forEach(b => b.onclick = () => go(b.dataset.view));
  auth.onAuthStateChanged(a, async user => {
    const ok = user && user.email === ADMIN_EMAIL && user.emailVerified;
    $('#login').hidden = !!ok; $('#app').hidden = !ok; $('#signin').hidden = !!ok;
    if (!user) { $('#login-text').textContent = 'Sign in with the studio Google account to manage leads, reviews and prices.'; $('#signin').hidden = false; return; }
    if (!ok) { $('#login-text').textContent = `${user.email} does not have access. Sign in with ${ADMIN_EMAIL}.`; $('#signin').hidden = false; return; }
    $('#who').textContent = user.email;
    await load();
    go(location.hash.slice(1) || 'dashboard');
  });
}

async function load() {
  const { db, fs } = api;
  try {
    const [l, r, s] = await Promise.all([
      fs.getDocs(fs.query(fs.collection(db, 'leads'), fs.orderBy('createdAt', 'desc'), fs.limit(1000))),
      fs.getDocs(fs.query(fs.collection(db, 'reviews'), fs.orderBy('createdAt', 'desc'), fs.limit(300))),
      fs.getDoc(fs.doc(db, 'site', 'public')).catch(e => { msg('Prices and home settings need the new Firestore rules (see firestore.rules).', 'err'); return null; }),
    ]);
    leads = l.docs.map(d => ({ id: d.id, ...d.data() }));
    reviews = r.docs.map(d => ({ id: d.id, ...d.data() }));
    if (s?.exists()) site = { prices: {}, custom: [], featured: [], announcement: '', ...s.data() };
    counts();
  } catch (e) { msg(`Could not load data: ${e.code || e.message}`, 'err'); }
}

function counts() {
  const n = leads.filter(l => (l.status || 'new') === 'new').length, w = reviews.filter(r => !r.approved).length;
  $('#n-leads').textContent = n; $('#n-leads').hidden = !n;
  $('#n-reviews').textContent = w; $('#n-reviews').hidden = !w;
}

function go(v) {
  if (!VIEWS[v]) v = 'dashboard';
  view = v; history.replaceState(null, '', `#${v}`);
  $$('[data-view]').forEach(b => b.setAttribute('aria-current', b.dataset.view === v));
  $('#view-title').textContent = { dashboard: 'Dashboard', leads: 'Leads', reviews: 'Reviews', prices: 'Prices', products: 'Products', home: 'Home & banner' }[v];
  $('#view').replaceChildren(VIEWS[v]());
  scrollTo(0, 0);
}
const rerender = () => { counts(); $('#view').replaceChildren(VIEWS[view]()); };

/* ================= dashboard ================= */
const isDue = l => OPEN.includes(l.status || 'new') && l.followUp && l.followUp <= today();
function dashboard() {
  const open = leads.filter(l => OPEN.includes(l.status || 'new'));
  const weekAgo = Date.now() - 7 * 864e5;
  const month = new Date(); month.setDate(1); month.setHours(0, 0, 0, 0);
  const stat = (n, label, cls = '') => el('div', { className: `stat ${cls}` }, el('b', { textContent: n }), el('span', { textContent: label }));
  const top = Object.entries(leads.reduce((m, l) => { const k = l.service || 'Not chosen'; m[k] = (m[k] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = top[0]?.[1] || 1;
  const due = leads.filter(isDue), fresh = leads.filter(l => (l.status || 'new') === 'new');
  const attention = [...due, ...fresh.filter(l => !due.includes(l))].slice(0, 8);
  return el('div', {},
    el('div', { className: 'stats' },
      stat(fresh.length, 'New leads to answer', fresh.length ? 'stat--alert' : ''),
      stat(due.length, 'Follow-ups due', due.length ? 'stat--alert' : ''),
      stat(open.length, 'Open deals'),
      stat(inr(open.reduce((s, l) => s + (Number(l.quote) || 0), 0)), 'Value of open quotes'),
      stat(leads.filter(l => l.status === 'won' && (toDate(l.updatedAt || l.createdAt) || 0) >= month).length, 'Delivered this month'),
      stat(leads.filter(l => (toDate(l.createdAt) || 0) >= weekAgo).length, 'Leads in the last 7 days'),
      stat(reviews.filter(r => !r.approved).length, 'Reviews waiting')),
    el('div', { className: 'box' }, el('h2', { textContent: 'Needs your attention' }),
      attention.length ? el('div', {}, ...attention.map(l => leadCard(l, true))) : el('p', { className: 'small', textContent: 'All clear. New enquiries and due follow-ups show up here.' })),
    el('div', { className: 'box' }, el('h2', { textContent: 'What people ask for' }),
      top.length ? el('div', { className: 'bars' }, ...top.map(([k, n]) => el('div', {}, el('span', { textContent: k }), el('i', { style: `width:${Math.max(4, n / max * 100)}%` }), el('b', { textContent: n }))))
        : el('p', { className: 'small', textContent: 'No enquiries yet.' })));
}

/* ================= leads ================= */
function leads_() {
  const countBy = s => s === 'all' ? leads.length : s === 'open' ? leads.filter(l => OPEN.includes(l.status || 'new')).length : leads.filter(l => (l.status || 'new') === s).length;
  const chips = el('ul', { className: 'pills' }, ...[['open', 'Open'], ['all', 'All'], ...STAGES].map(([k, label]) => {
    const b = el('button', { type: 'button' }, label, el('small', { textContent: countBy(k) }));
    b.setAttribute('aria-pressed', filters.stage === k); b.onclick = () => { filters.stage = k; rerender(); };
    return el('li', {}, b);
  }));
  const search = el('label', { className: 'searchbox' }); search.innerHTML = icon('search');
  const q = el('input', { type: 'search', placeholder: 'Search name, phone, service…', value: filters.q });
  q.oninput = () => { filters.q = q.value; renderList(); };
  search.append(q);
  const sort = el('select', { ariaLabel: 'Sort' }, el('option', { value: 'new', textContent: 'Newest first' }), el('option', { value: 'follow', textContent: 'Follow-up date' }));
  sort.value = filters.sort; sort.onchange = () => { filters.sort = sort.value; renderList(); };
  const csv = el('button', { className: 'btn btn--outline btn--sm', textContent: 'Download CSV' }); csv.onclick = downloadCsv;
  const list = el('div');
  function renderList() {
    const s = filters.q.toLowerCase().trim();
    let rows = leads.filter(l => filters.stage === 'all' || (filters.stage === 'open' ? OPEN.includes(l.status || 'new') : (l.status || 'new') === filters.stage))
      .filter(l => !s || [l.name, l.contact, l.service, l.message, l.budget].join(' ').toLowerCase().includes(s));
    if (filters.sort === 'follow') rows = rows.slice().sort((a, b) => (a.followUp || '9999').localeCompare(b.followUp || '9999'));
    else rows = rows.slice().sort((a, b) => Number(isDue(b)) - Number(isDue(a)));
    list.replaceChildren(...(rows.length ? rows.map(l => leadCard(l)) : [el('p', { className: 'small', textContent: leads.length ? 'No leads match.' : 'No enquiries yet. They appear here as soon as someone sends the form on the website.' })]));
  }
  renderList();
  return el('div', {}, el('div', { className: 'toolrow' }, chips), el('div', { className: 'toolrow' }, search, sort, csv), list);
}

function leadCard(l, compact = false) {
  const { db, fs } = api;
  const ref = fs.doc(db, 'leads', l.id);
  const save = async (data, note) => {
    try {
      const upd = { ...data, updatedAt: fs.serverTimestamp() };
      if (note) upd.log = fs.arrayUnion({ at: new Date().toISOString(), text: note });
      await fs.updateDoc(ref, upd);
      Object.assign(l, data, { updatedAt: new Date() });
      if (note) l.log = [...(l.log || []), { at: new Date().toISOString(), text: note }];
      msg('Saved'); rerender();
    } catch (e) { msg(`Could not save: ${e.code || e.message}`, 'err'); }
  };
  const status = l.status || 'new';
  const c = l.contact || '', digits = c.replace(/\D/g, '');
  const phone = digits.length >= 10 ? (digits.length === 10 ? '91' + digits : digits) : '';
  const first = String(l.name || '').split(' ')[0];
  const reach = [];
  if (phone) {
    const tpl = el('select', { ariaLabel: 'WhatsApp reply' }, el('option', { value: '', textContent: 'WhatsApp reply…' }), ...REPLIES.map(([t], k) => el('option', { value: k, textContent: t })));
    tpl.onchange = () => { if (tpl.value === '') return; window.open(`https://wa.me/${phone}?text=${encodeURIComponent(REPLIES[tpl.value][1](first))}`, '_blank', 'noopener'); tpl.value = ''; if (status === 'new') save({ status: 'contacted' }, 'Replied on WhatsApp'); };
    reach.push(el('a', { className: 'btn btn--wa btn--sm', href: `https://wa.me/${phone}`, target: '_blank', rel: 'noopener', innerHTML: `${icon('wa')} WhatsApp` }), tpl,
      el('a', { className: 'btn btn--outline btn--sm', href: `tel:+${phone}`, textContent: 'Call' }));
  }
  if (c.includes('@')) reach.push(el('a', { className: 'btn btn--outline btn--sm', href: `mailto:${c}?subject=${encodeURIComponent('Your enquiry with Ebraheem Hussain Productions')}`, textContent: 'Email' }));

  const head = el('div', { className: 'lead__top' },
    el('span', { className: 'lead__name', textContent: l.name || 'No name' }),
    el('span', { className: 'lead__meta' },
      isDue(l) ? el('span', { className: 'flag flag--due', textContent: `Follow up ${l.followUp === today() ? 'today' : 'overdue'}` }) : null, ' ',
      status === 'new' ? el('span', { className: 'flag flag--new', textContent: 'New' }) : el('span', { className: 'flag', textContent: stageName(status) }), ' ',
      when(l.createdAt)));
  const meta = el('p', { className: 'lead__meta', textContent: [l.service, l.budget && `Budget: ${l.budget}`, c, l.quote && `Quote: ${inr(l.quote)}`].filter(Boolean).join('  ·  ') });
  const cls = `lead${status === 'new' ? ' lead--new' : ''}${isDue(l) ? ' lead--due' : ''}`;
  if (compact) {
    const open = el('button', { className: 'btn btn--outline btn--sm', textContent: 'Open in Leads' });
    open.onclick = () => { filters.stage = 'all'; filters.q = l.contact || l.name || ''; go('leads'); };
    return el('article', { className: cls }, head, meta, el('p', { className: 'lead__msg', textContent: String(l.message || '').slice(0, 220) }), el('div', { className: 'lead__actions' }, ...reach, open));
  }

  const stage = el('select', {}, ...STAGES.map(([k, t]) => el('option', { value: k, textContent: t, selected: status === k })));
  stage.onchange = () => save({ status: stage.value }, `Stage → ${stageName(stage.value)}`);
  const quoteIn = el('input', { type: 'number', min: 0, step: 100, value: l.quote || '', placeholder: '₹' });
  quoteIn.onchange = () => save({ quote: Number(quoteIn.value) || 0 }, `Quote set to ${inr(quoteIn.value)}`);
  const fu = el('input', { type: 'date', value: l.followUp || '' });
  fu.onchange = () => save({ followUp: fu.value }, fu.value ? `Follow-up set for ${fu.value}` : 'Follow-up cleared');
  const quick = (label, n) => { const b = el('button', { className: 'btn btn--outline btn--sm', type: 'button', textContent: label }); b.onclick = () => save({ followUp: addDays(n) }, `Follow-up set for ${addDays(n)}`); return b; };
  const note = el('input', { type: 'text', placeholder: 'Add a note (call done, sent quote…)' });
  const addNote = el('button', { className: 'btn btn--dark btn--sm', type: 'button', textContent: 'Add note' });
  addNote.onclick = () => { const t = note.value.trim(); if (t) save({}, t); };
  note.onkeydown = e => { if (e.key === 'Enter') addNote.click(); };
  const del = el('button', { className: 'linkbtn', type: 'button', textContent: 'Delete', style: 'color:var(--red)' });
  del.onclick = async () => { if (!confirm(`Delete the enquiry from ${l.name}? This cannot be undone.`)) return; try { await fs.deleteDoc(ref); leads = leads.filter(x => x.id !== l.id); msg('Deleted'); rerender(); } catch (e) { msg(`Could not delete: ${e.code || e.message}`, 'err'); } };
  const log = (l.log || []).slice(-6).reverse();
  return el('article', { className: cls }, head, meta,
    el('p', { className: 'lead__msg', textContent: l.message || '' }),
    el('div', { className: 'lead__grid' },
      el('label', {}, 'Stage', stage), el('label', {}, 'Quote amount (₹)', quoteIn), el('label', {}, 'Follow up on', fu),
      el('div', { className: 'fld' }, 'Quick follow-up', el('div', { style: 'display:flex;gap:6px' }, quick('Tomorrow', 1), quick('3 days', 3), quick('1 week', 7)))),
    el('div', { className: 'lead__actions' }, el('div', { style: 'flex:1 1 260px;display:flex;gap:8px' }, note, addNote)),
    el('div', { className: 'lead__actions' }, ...reach, del),
    log.length ? el('ul', { className: 'lead__log' }, ...log.map(x => el('li', { textContent: `${new Date(x.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} — ${x.text}` }))) : null);
}

function downloadCsv() {
  const cols = ['createdAt', 'name', 'contact', 'service', 'budget', 'message', 'status', 'quote', 'followUp'];
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [cols.join(','), ...leads.map(l => cols.map(c => esc(c === 'createdAt' ? when(l.createdAt) : c === 'status' ? stageName(l.status || 'new') : l[c])).join(','))];
  const a = el('a', { href: URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' })), download: `leads-${today()}.csv` });
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ================= reviews ================= */
function reviews_() {
  const { db, fs } = api;
  const chips = el('ul', { className: 'pills' }, ...[['waiting', 'Waiting'], ['shown', 'Shown on website'], ['all', 'All']].map(([k, t]) => {
    const n = k === 'all' ? reviews.length : reviews.filter(r => (k === 'shown') === !!r.approved).length;
    const b = el('button', { type: 'button' }, t, el('small', { textContent: n })); b.setAttribute('aria-pressed', filters.rv === k);
    b.onclick = () => { filters.rv = k; rerender(); }; return el('li', {}, b);
  }));
  const rows = reviews.filter(r => filters.rv === 'all' || (filters.rv === 'shown') === !!r.approved);
  const card = r => {
    const ref = fs.doc(db, 'reviews', r.id);
    const toggle = el('button', { className: `btn btn--sm ${r.approved ? 'btn--outline' : 'btn--dark'}`, textContent: r.approved ? 'Hide from website' : 'Approve and show' });
    toggle.onclick = async () => { try { await fs.updateDoc(ref, { approved: !r.approved }); r.approved = !r.approved; msg(r.approved ? 'Shown on the website' : 'Hidden'); rerender(); } catch (e) { msg(e.code || e.message, 'err'); } };
    const reply = el('textarea', { placeholder: 'Reply shown under the review (optional)', value: r.reply || '', maxLength: 400 });
    const saveReply = el('button', { className: 'btn btn--outline btn--sm', textContent: 'Save reply' });
    saveReply.onclick = async () => { try { await fs.updateDoc(ref, { reply: reply.value.trim() }); r.reply = reply.value.trim(); msg('Reply saved'); } catch (e) { msg(e.code || e.message, 'err'); } };
    const del = el('button', { className: 'linkbtn', textContent: 'Delete', style: 'color:var(--red)' });
    del.onclick = async () => { if (!confirm('Delete this review? This cannot be undone.')) return; try { await fs.deleteDoc(ref); reviews = reviews.filter(x => x.id !== r.id); rerender(); } catch (e) { msg(e.code || e.message, 'err'); } };
    return el('article', { className: `lead${r.approved ? '' : ' lead--new'}` },
      el('div', { className: 'lead__top' }, el('span', { className: 'lead__name', textContent: `${r.name}${r.business ? ', ' + r.business : ''}` }), el('span', { className: 'lead__meta', textContent: when(r.createdAt) })),
      el('p', { className: 'lead__meta', textContent: `${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)} · ${r.approved ? 'Shown on website' : 'Waiting for approval'}` }),
      el('p', { className: 'lead__msg', textContent: r.text }),
      reply, el('div', { className: 'lead__actions' }, toggle, saveReply, del));
  };
  return el('div', {}, el('div', { className: 'toolrow' }, chips),
    rows.length ? el('div', {}, ...rows.map(card)) : el('p', { className: 'small', textContent: 'No reviews here. Ask happy clients to write one from the website (the “Delivered + review” WhatsApp reply has the link).' }));
}

/* ================= site document (prices, products, home) ================= */
async function saveSite(note = 'Saved. The website shows it within a minute.') {
  const { db, fs } = api;
  try {
    await fs.setDoc(fs.doc(db, 'site', 'public'), { prices: site.prices || {}, custom: site.custom || [], featured: site.featured || [], announcement: site.announcement || '', updatedAt: fs.serverTimestamp() });
    msg(note); return true;
  } catch (e) { msg(`Could not save: ${e.code || e.message}. Publish the new Firestore rules first.`, 'err'); return false; }
}
const num = v => v === '' || v == null ? null : Math.max(0, Math.round(Number(v)));
const BADGES = ['', 'Popular', 'New', 'Best value', 'Offer'];

function prices() {
  const draft = JSON.parse(JSON.stringify(site.prices || {}));
  const search = el('label', { className: 'searchbox' }); search.innerHTML = icon('search');
  const q = el('input', { type: 'search', placeholder: 'Search products…', value: filters.pq }); search.append(q);
  const cat = el('select', {}, el('option', { value: 'all', textContent: 'All categories' }), ...CATEGORIES.map(c => el('option', { value: c.id, textContent: c.name })));
  cat.value = filters.pcat;
  const body = el('tbody');
  const changed = el('span', { textContent: '' });
  const row = i => {
    const o = draft[i.id] || {};
    const cur = { lo: o.inr?.[0] ?? i.inr?.[0] ?? '', hi: o.inr?.[1] ?? i.inr?.[1] ?? '', ulo: o.usd?.[0] ?? i.usd?.[0] ?? '', uhi: o.usd?.[1] ?? i.usd?.[1] ?? '' };
    const f = (v, ph) => el('input', { type: 'number', min: 0, value: v, placeholder: ph });
    const lo = f(cur.lo, 'from'), hi = f(cur.hi, 'to'), ulo = f(cur.ulo, '$'), uhi = f(cur.uhi, '$');
    const unit = el('input', { type: 'text', value: o.unit ?? i.unit ?? '' });
    const quoteBox = el('input', { type: 'checkbox', checked: o.quote ?? !i.inr });
    const hidden = el('input', { type: 'checkbox', checked: !!o.hidden });
    const badge = el('select', {}, ...BADGES.map(b => el('option', { value: b, textContent: b || '—' }))); badge.value = o.badge || '';
    const tr = el('tr', { className: `${draft[i.id] ? 'changed' : ''}${o.hidden ? ' off' : ''}` },
      el('td', {}, el('b', { textContent: i.name }), el('br'), el('span', { className: 'small', textContent: CAT[i.cat].name })),
      el('td', {}, lo), el('td', {}, hi), el('td', {}, unit),
      el('td', {}, i.group === 'online' ? ulo : el('span', { className: 'small', textContent: '—' })), el('td', {}, i.group === 'online' ? uhi : ''),
      el('td', {}, el('label', { className: 'check' }, quoteBox, 'On request')), el('td', {}, badge), el('td', {}, el('label', { className: 'check' }, hidden, 'Hide')));
    const update = () => {
      const d = {};
      const vlo = num(lo.value), vhi = num(hi.value);
      if (quoteBox.checked !== !i.inr) d.quote = quoteBox.checked;
      if (!quoteBox.checked && vlo != null && vhi != null && (!i.inr || vlo !== i.inr[0] || vhi !== i.inr[1])) d.inr = [Math.min(vlo, vhi), Math.max(vlo, vhi)];
      const ul = num(ulo.value), uh = num(uhi.value);
      if (i.group === 'online' && ul != null && uh != null && (!i.usd || ul !== i.usd[0] || uh !== i.usd[1])) d.usd = [Math.min(ul, uh), Math.max(ul, uh)];
      if (unit.value.trim() && unit.value.trim() !== i.unit) d.unit = unit.value.trim().slice(0, 40);
      if (badge.value) d.badge = badge.value;
      if (hidden.checked) d.hidden = true;
      if (Object.keys(d).length) draft[i.id] = d; else delete draft[i.id];
      tr.className = `${draft[i.id] ? 'changed' : ''}${hidden.checked ? ' off' : ''}`;
      changed.textContent = `${Object.keys(draft).length} products differ from the standard price list`;
    };
    [lo, hi, ulo, uhi, unit].forEach(x => x.oninput = update);
    [quoteBox, hidden, badge].forEach(x => x.onchange = update);
    return tr;
  };
  const renderRows = () => {
    const s = q.value.toLowerCase().trim(); filters.pq = q.value; filters.pcat = cat.value;
    body.replaceChildren(...DEFAULTS.filter(i => (cat.value === 'all' || i.cat === cat.value) && (!s || i.name.toLowerCase().includes(s))).map(row));
  };
  q.oninput = renderRows; cat.onchange = renderRows; renderRows();
  changed.textContent = `${Object.keys(draft).length} products differ from the standard price list`;
  const save = el('button', { className: 'btn btn--light btn--sm', textContent: 'Save prices' });
  save.onclick = async () => { site.prices = draft; if (await saveSite('Prices saved. The website updates within a minute.')) rerender(); };
  const reset = el('button', { className: 'btn btn--outline btn--sm', textContent: 'Undo changes' }); reset.onclick = rerender;
  return el('div', {},
    el('p', { className: 'small', textContent: 'Change a price, unit or label, tick “On request” to hide the price, or “Hide” to take a product off the website. Leave a row as it is to keep the standard price.' }),
    el('div', { className: 'toolrow' }, search, cat),
    el('div', { className: 'box', style: 'padding:8px' }, el('div', { className: 'tablewrap' }, el('table', { className: 'ptable' },
      el('thead', {}, el('tr', {}, ...['Product', '₹ from', '₹ to', 'Unit', '$ from', '$ to', 'Price', 'Label', 'Show'].map(t => el('th', { textContent: t })))), body))),
    el('div', { className: 'savebar' }, changed, el('div', { style: 'display:flex;gap:8px' }, reset, save)));
}

function products() {
  const list = site.custom || [];
  const form = el('form', { className: 'box form', style: 'gap:12px' });
  form.innerHTML = `<h2>Add a product</h2>
    <div class="form__row"><label>Name<input name="name" required maxlength="80" placeholder="For example: Acrylic photo frame"></label>
    <label>Category<select name="cat">${CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></label></div>
    <label>Short description<input name="what" maxlength="300" placeholder="One line customers see on the card"></label>
    <div class="form__row"><label>₹ from<input name="lo" type="number" min="0"></label><label>₹ to<input name="hi" type="number" min="0"></label></div>
    <div class="form__row"><label>Unit<input name="unit" maxlength="40" placeholder="per piece, per sq ft, per song…"></label>
    <label>Label<select name="badge">${BADGES.map(b => `<option value="${b}">${b || '—'}</option>`).join('')}</select></label></div>
    <label>Photo (optional): Unsplash image address<input name="photo" placeholder="https://images.unsplash.com/photo-…"></label>
    <label class="check"><input type="checkbox" name="quote"> Price on request</label>
    <div class="form__foot"><button class="btn btn--dark" type="submit">Add to the website</button></div>`;
  form.onsubmit = async e => {
    e.preventDefault();
    const f = form.elements, name = f.name.value.trim();
    if (!name) return;
    if (DEFAULTS.some(i => i.id === slug(name)) || list.some(c => slug(c.name) === slug(name))) { msg('A product with this name already exists.', 'err'); return; }
    const lo = num(f.lo.value), hi = num(f.hi.value);
    const photo = (f.photo.value.match(/(photo-[\w-]+)/) || [])[1] || '';
    const item = { name, cat: f.cat.value, what: f.what.value.trim(), unit: f.unit.value.trim(), badge: f.badge.value, photo, quote: f.quote.checked || lo == null || hi == null };
    if (!item.quote) item.inr = [Math.min(lo, hi), Math.max(lo, hi)];
    site.custom = [...list, item];
    if (await saveSite('Product added. It shows in the shop within a minute.')) rerender(); else site.custom = list;
  };
  const card = (c, k) => {
    const del = el('button', { className: 'linkbtn', textContent: 'Remove', style: 'color:var(--red)' });
    del.onclick = async () => { if (!confirm(`Remove ${c.name} from the website?`)) return; site.custom = list.filter((_, j) => j !== k); if (await saveSite('Removed.')) rerender(); };
    return el('article', { className: 'lead' },
      el('div', { className: 'lead__top' }, el('span', { className: 'lead__name', textContent: c.name }), el('span', { className: 'lead__meta', textContent: CAT[c.cat]?.name || c.cat })),
      el('p', { className: 'lead__meta', textContent: [c.quote ? 'Price on request' : `${inr(c.inr?.[0])} – ${inr(c.inr?.[1])} ${c.unit || ''}`, c.badge, c.photo ? 'Has photo' : 'No photo'].filter(Boolean).join(' · ') }),
      c.what ? el('p', { className: 'lead__msg', textContent: c.what }) : null,
      el('div', { className: 'lead__actions' }, el('a', { className: 'btn btn--outline btn--sm', href: `product?id=${slug(c.name)}`, target: '_blank', rel: 'noopener', textContent: 'View' }), del));
  };
  return el('div', {}, form,
    el('div', { className: 'box' }, el('h2', { textContent: `Your added products (${list.length})` }),
      list.length ? el('div', {}, ...list.map(card)) : el('p', { className: 'small', textContent: 'Products you add here appear in the shop next to the standard ones. To change a standard product, use Prices.' })));
}

function home() {
  const ann = el('input', { type: 'text', maxLength: 200, value: site.announcement || '', placeholder: 'For example: Diwali offer — 10% off visiting cards till 30 Oct' });
  const chosen = new Set(site.featured || []);
  const all = [...DEFAULTS, ...(site.custom || []).map(c => ({ ...c, id: slug(c.name) }))];
  const q = el('input', { type: 'search', placeholder: 'Search products…' });
  const grid = el('div', { className: 'pickgrid' });
  const count = el('span', { className: 'small' });
  const paint = () => {
    count.textContent = `${chosen.size} chosen (up to 12). Leave empty for the standard mix.`;
    const s = q.value.toLowerCase();
    grid.replaceChildren(...all.filter(i => !s || i.name.toLowerCase().includes(s)).map(i => {
      const cb = el('input', { type: 'checkbox', checked: chosen.has(i.id) });
      cb.onchange = () => { if (cb.checked && chosen.size >= 12) { cb.checked = false; msg('Choose up to 12', 'err'); return; } cb.checked ? chosen.add(i.id) : chosen.delete(i.id); count.textContent = `${chosen.size} chosen (up to 12). Leave empty for the standard mix.`; };
      return el('label', { className: 'check' }, cb, i.name);
    }));
  };
  q.oninput = paint; paint();
  const save = el('button', { className: 'btn btn--dark', textContent: 'Save home settings' });
  save.onclick = async () => { site.announcement = ann.value.trim(); site.featured = [...chosen]; await saveSite(); };
  return el('div', {},
    el('div', { className: 'box' }, el('h2', { textContent: 'Announcement bar' }),
      el('p', { className: 'small', textContent: 'A thin line at the top of every page. Use it for offers, festival timings or news. Leave empty to turn it off.' }), ann),
    el('div', { className: 'box' }, el('h2', { textContent: '“Popular right now” on the home page' }), count, el('div', { className: 'toolrow', style: 'margin-top:10px' }, el('label', { className: 'searchbox' }, q)), grid),
    el('div', { className: 'savebar' }, el('span', { textContent: 'Changes go live within a minute of saving.' }), save));
}

const VIEWS = { dashboard, leads: leads_, reviews: reviews_, prices, products, home };
