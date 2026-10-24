import { fb, configured, ADMIN_EMAIL } from './firebase.js';

const $ = s => document.querySelector(s);
const el = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids); return n; };
const msg = (t, kind = '') => { $('#msg').textContent = t; $('#msg').className = `form__msg ${kind}`; };
const when = ts => ts?.toDate ? ts.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '';
let tab = 'leads', leads = [], reviews = [], api;

if (!configured) msg('Firebase is not connected yet. Add the project config in firebase.js.', 'err');
else start();

async function start() {
  api = await fb();
  const { auth, app } = api;
  const a = auth.getAuth(app);
  $('#signin').onclick = () => auth.signInWithPopup(a, new auth.GoogleAuthProvider()).catch(e => msg(`Sign-in failed: ${e.code || e.message}`, 'err'));
  $('#signout').onclick = () => auth.signOut(a);
  auth.onAuthStateChanged(a, async user => {
    const isAdmin = user && user.email === ADMIN_EMAIL && user.emailVerified;
    $('#signin-bar').hidden = !!user; $('#signout').hidden = !user; $('#panel').hidden = !isAdmin;
    if (!user) { $('#who').textContent = 'Sign in with your Google account to see enquiries from the website.'; return; }
    if (!isAdmin) { $('#who').textContent = `${user.email} does not have access. Sign in with ${ADMIN_EMAIL}.`; return; }
    $('#who').textContent = `Signed in as ${user.email}`; msg('');
    await load();
  });
  document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => {
    tab = b.dataset.tab; document.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === b)); render();
  });
  $('#csv').onclick = downloadCsv;
}

async function load() {
  const { db, fs } = api;
  try {
    const [l, r] = await Promise.all([
      fs.getDocs(fs.query(fs.collection(db, 'leads'), fs.orderBy('createdAt', 'desc'), fs.limit(500))),
      fs.getDocs(fs.query(fs.collection(db, 'reviews'), fs.orderBy('createdAt', 'desc'), fs.limit(200))),
    ]);
    leads = l.docs.map(d => ({ id: d.id, ...d.data() }));
    reviews = r.docs.map(d => ({ id: d.id, ...d.data() }));
    render();
  } catch (e) { msg(`Could not load data: ${e.code || e.message}`, 'err'); }
}

function render() {
  const list = $('#list');
  if (tab === 'leads') {
    const fresh = leads.filter(l => l.status === 'new').length;
    $('#count').textContent = `${leads.length} enquiries, ${fresh} new`;
    $('#csv').hidden = false;
    if (!leads.length) { list.replaceChildren(el('p', { textContent: 'No enquiries yet. They will appear here as soon as someone sends the form.' })); return; }
    list.replaceChildren(...leads.map(leadCard));
  } else {
    $('#count').textContent = `${reviews.length} reviews, ${reviews.filter(r => !r.approved).length} waiting for approval`;
    $('#csv').hidden = true;
    if (!reviews.length) { list.replaceChildren(el('p', { textContent: 'No reviews yet. Clients can send one from the Reviews section of the website.' })); return; }
    list.replaceChildren(...reviews.map(reviewCard));
  }
}

function leadCard(l) {
  const { db, fs } = api;
  const status = el('select', { ariaLabel: 'Status' }, ...['new', 'contacted', 'won', 'lost'].map(s => el('option', { value: s, textContent: s, selected: l.status === s })));
  status.onchange = async () => { await fs.updateDoc(fs.doc(db, 'leads', l.id), { status: status.value }); l.status = status.value; render(); };
  const del = el('button', { className: 'linkbtn', textContent: 'Delete' });
  del.onclick = async () => { if (!confirm(`Delete the enquiry from ${l.name}?`)) return; await fs.deleteDoc(fs.doc(db, 'leads', l.id)); leads = leads.filter(x => x.id !== l.id); render(); };
  const c = l.contact || '';
  const digits = c.replace(/\D/g, '');
  const reach = c.includes('@') ? el('a', { href: `mailto:${c}`, textContent: 'Email' })
    : digits.length >= 10 ? el('a', { href: `https://wa.me/${digits.length === 10 ? '91' + digits : digits}`, target: '_blank', rel: 'noopener', textContent: 'WhatsApp' }) : '';
  return el('article', { className: 'card' },
    el('div', { className: 'card__top' }, el('span', { className: 'card__name', textContent: l.name }), el('span', { className: 'card__meta', textContent: when(l.createdAt) })),
    el('span', { className: 'card__meta', textContent: [l.service, l.budget && `Budget: ${l.budget}`, c].filter(Boolean).join('  |  ') }),
    el('p', { className: 'card__msg', textContent: l.message }),
    el('div', { className: 'card__actions' }, status, reach, del));
}

function reviewCard(r) {
  const { db, fs } = api;
  const approve = el('button', { className: 'btn btn--ink btn--sm', textContent: r.approved ? 'Hide from website' : 'Approve and show' });
  approve.onclick = async () => { await fs.updateDoc(fs.doc(db, 'reviews', r.id), { approved: !r.approved }); r.approved = !r.approved; render(); };
  const del = el('button', { className: 'linkbtn', textContent: 'Delete' });
  del.onclick = async () => { if (!confirm('Delete this review?')) return; await fs.deleteDoc(fs.doc(db, 'reviews', r.id)); reviews = reviews.filter(x => x.id !== r.id); render(); };
  return el('article', { className: 'card' },
    el('div', { className: 'card__top' }, el('span', { className: 'card__name', textContent: `${r.name}${r.business ? ', ' + r.business : ''}` }), el('span', { className: 'card__meta', textContent: when(r.createdAt) })),
    el('span', { className: r.approved ? 'card__meta' : 'card__meta status-new', textContent: `${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}  ${r.approved ? 'Shown on website' : 'Waiting for approval'}` }),
    el('p', { className: 'card__msg', textContent: r.text }),
    el('div', { className: 'card__actions' }, approve, del));
}

function downloadCsv() {
  const cols = ['createdAt', 'name', 'contact', 'service', 'budget', 'message', 'status'];
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [cols.join(','), ...leads.map(l => cols.map(c => esc(c === 'createdAt' ? when(l.createdAt) : l[c])).join(','))];
  const a = el('a', { href: URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' })), download: 'enquiries.csv' });
  a.click(); URL.revokeObjectURL(a.href);
}
