// Plan page: plan?b=…&g=…&r=…&m=…&t=…&q=…  Shows the curated plan, or the questions when there are no answers yet.
import { CONTACT } from './data/site-data.js?v=e19716b7';
import { ITEMS } from './data/catalog-data.js?v=e19716b7';
import { img } from './data/photos.js?v=e19716b7';
import { icon } from './icons.js?v=e19716b7';
import { fb } from './firebase.js?v=e19716b7';
import { $, el, wa, initChrome, CAT, byId, productUrl, quote, ready, toast, store } from './common.js?v=e19716b7';
import { card, addButton } from './shop.js?v=e19716b7';
import { plan, labelOf, STEPS } from './planner.js?v=e19716b7';
import { openQuiz, fromQuery } from './quiz.js?v=e19716b7';

await ready;
initChrome();

const root = $('#plan-root');
const ans = fromQuery(location.search);
const rupee = n => n >= 100000 ? `₹${(n / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })} lakh` : `₹${Math.round(n).toLocaleString('en-IN')}`;

if (!ans) {
  root.replaceChildren(el('div', { className: 'plan-quiz', id: 'quiz-inline' }));
  openQuiz({ inline: $('#quiz-inline') });
} else {
  store.set('plan-answers', ans);
  render(ans);
}

function render(a) {
  const r = plan(a, ITEMS, CAT);
  let picks = r.picks, addons = r.addons;
  const empty = !picks.length;
  if (empty) { // nothing to go on: a safe starter set
    picks = ['visiting-cards', 'shop-signboards', 'instagram-reels-and-youtube-shorts'].map(byId).filter(Boolean).map(item => ({ item, reasons: ['popular first order'], cost: null }));
    addons = [];
  }
  const chips = [labelOf('b', a.b), ...a.g.map(g => labelOf('g', g)), labelOf('m', a.m), labelOf('t', a.t)].filter(x => x && x !== 'Something else');
  const head = el('div', { className: 'plan-head' },
    el('p', { className: 'kicker', textContent: 'Your plan' }),
    el('h1', { textContent: empty ? 'A good place to start.' : 'Here is what we would do.' }),
    el('p', { className: 'lede', textContent: empty ? 'Tell us a little more and we can make this exact.' : `${picks.length} things, chosen from ${ITEMS.length}, for what you told us.` }),
    el('ul', { className: 'plan-chips' }, ...chips.map(c => el('li', { textContent: c })), a.q ? el('li', { textContent: `“${a.q.slice(0, 60)}${a.q.length > 60 ? '…' : ''}”` }) : null),
    el('button', { type: 'button', className: 'linkbtn', textContent: 'Change my answers', onclick: () => openQuiz({ start: a }) }));

  const pick = (p, n) => {
    const i = p.item, ph = i.photos[0];
    return el('article', { className: 'pick reveal' },
      el('a', { className: 'pick__img', href: productUrl(i), tabIndex: -1 }, ph ? el('img', { src: img(ph, 720, 540), alt: '', width: 720, height: 540, loading: n ? 'lazy' : 'eager' }) : el('span', { className: 'ph', innerHTML: icon(CAT[i.cat].icon) }),
        el('span', { className: 'pick__n', textContent: `0${n + 1}` })),
      el('div', { className: 'pick__body' },
        el('p', { className: 'pcard__cat', textContent: CAT[i.cat].name }),
        el('h3', {}, el('a', { href: productUrl(i), textContent: i.name })),
        el('p', { className: 'pick__what', textContent: i.what }),
        p.reasons.length ? el('p', { className: 'pick__why' }, el('span', { innerHTML: icon('check') }), `Why: ${p.reasons.join(', ')}.`) : null,
        el('p', { className: 'pick__cost' }, p.cost ? el('b', { textContent: `${rupee(p.cost.lo)} – ${rupee(p.cost.hi)}` }) : el('b', { textContent: 'Price on request' }),
          p.cost?.basis ? el('span', { textContent: ` for ${p.cost.basis}` }) : null),
        el('div', { className: 'pick__actions' }, addButton(i), el('a', { className: 'btn btn--outline btn--sm', href: productUrl(i), textContent: 'Details' }))));
  };

  const t = r.total, over = r.max && r.max < 1e9 && t.lo > r.max;
  const planText = () => {
    const lines = picks.map((p, n) => `${n + 1}. ${p.item.name}${p.cost ? ` (${rupee(p.cost.lo)}–${rupee(p.cost.hi)})` : ''}`);
    const about = [labelOf('b', a.b), a.g.map(g => labelOf('g', g)).join(', '), labelOf('m', a.m) && `Budget: ${labelOf('m', a.m)}`, labelOf('t', a.t) && `Needed: ${labelOf('t', a.t)}`].filter(Boolean).join(' · ');
    return `Hi Ebraheem Hussain Productions, I built a plan on your website:\n${lines.join('\n')}\n\nAbout me: ${about}${a.q ? `\nMy words: ${a.q}` : ''}\n\nPlease send me an exact quote.`;
  };
  const sendWa = el('a', { className: 'btn btn--wa btn--block', href: wa(planText()), target: '_blank', rel: 'noopener', innerHTML: `${icon('wa')}<span>Send this plan on WhatsApp</span>` });
  const addAll = el('button', { type: 'button', className: 'btn btn--outline btn--block', textContent: 'Add all to my list' });
  addAll.onclick = () => { picks.forEach(p => { if (!quote.has(p.item.id)) quote.toggle(p.item.id); }); toast('Added to my list'); };

  // quote request saved as a lead (shows up in the admin page)
  const form = el('form', { className: 'form plan-form', noValidate: true });
  form.innerHTML = `<h3>Get the exact price</h3><p class="small">We reply within 24 hours on WhatsApp.</p>
    <label>Your name<input name="name" required maxlength="80" autocomplete="name"></label>
    <label>Phone or email<input name="contact" required maxlength="120" autocomplete="tel"></label>
    <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button class="btn btn--dark btn--block" type="submit">Send my plan</button><p class="form__msg" role="status"></p>
    <p class="small">We use these details only to reply to you. See our <a href="privacy">Privacy Policy</a>.</p>`;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = form.querySelector('.form__msg');
    if (form.website.value) return;
    const name = form.name.value.trim(), contact = form.contact.value.trim();
    if (!name || !contact) { msg.textContent = 'Add your name and a phone number or email.'; msg.className = 'form__msg err'; return; }
    const btn = form.querySelector('button'); btn.disabled = true; btn.textContent = 'Sending…';
    const data = { name, contact, service: 'Plan builder', budget: labelOf('m', a.m).slice(0, 60), message: planText().slice(0, 2000) };
    const res = await Promise.allSettled([
      fb().then(({ db, fs }) => fs.addDoc(fs.collection(db, 'leads'), { ...data, status: 'new', source: location.href.slice(0, 300), createdAt: fs.serverTimestamp() })),
      fetch(`https://formsubmit.co/ajax/${CONTACT.email}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: 'New plan from the website', _template: 'table', _captcha: 'false', ...data }) }).then(r => { if (!r.ok) throw 0; }),
    ]);
    btn.disabled = false; btn.textContent = 'Send my plan';
    if (res.some(x => x.status === 'fulfilled')) { form.reset(); msg.textContent = 'Sent. We will reply within 24 hours.'; msg.className = 'form__msg ok'; }
    else { msg.textContent = 'It could not be sent. Please use the WhatsApp button.'; msg.className = 'form__msg err'; }
  });

  const side = el('aside', { className: 'plan-side' },
    el('div', { className: 'plan-total' },
      el('p', { className: 'pricebox__label', textContent: 'Estimated for this plan' }),
      t.hi ? el('p', { className: 'plan-total__val', textContent: `${rupee(t.lo)} – ${rupee(t.hi)}` }) : el('p', { className: 'plan-total__val', textContent: 'On request' }),
      el('p', { className: 'small', textContent: `${r.onRequest ? 'Some items are priced on request. ' : ''}Rough estimate for a typical first order. You get a fixed price before we start.` }),
      over ? el('p', { className: 'plan-note', textContent: `This is above your budget. Start with 01 and add the rest later, or tell us and we will fit it to ${labelOf('m', a.m)}.` }) : null,
      sendWa, addAll),
    form);

  root.replaceChildren(
    head,
    el('div', { className: 'plan-grid' }, el('div', { className: 'plan-picks' }, ...picks.map(pick)), side),
    addons.length ? el('section', { className: 'related' }, el('h2', { textContent: 'Worth adding later' }), el('div', { className: 'rail' }, ...addons.map(p => card(p.item)))) : null,
    el('p', { className: 'plan-human' }, 'Not quite right? ', el('a', { href: wa('Hi Ebraheem Hussain Productions, I need help choosing what to order.'), target: '_blank', rel: 'noopener', textContent: 'Talk to a person on WhatsApp' }), ' or ', el('a', { href: 'catalog', textContent: 'see everything' }), '.'));
  root.querySelectorAll('.reveal').forEach(e => e.classList.add('in'));
  document.title = 'Your plan | Ebraheem Hussain Productions';
}
