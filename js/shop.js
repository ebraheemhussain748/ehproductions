// Product cards and price formatting, shared by the home, catalog and product pages.
import { NOTE } from './data/catalog-data.js';
import { img } from './data/photos.js';
import { icon } from './icons.js';
import { el, wa, CAT, quote, productUrl, store, toast } from './common.js';

export const currency = {
  get: () => (store.get('cur', 0) ? 1 : 0),
  set: v => store.set('cur', v ? 1 : 0),
};
const inr = v => v >= 100000 ? `₹${(v / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })} lakh` : `₹${v.toLocaleString('en-IN')}`;
const usd = v => `$${v.toLocaleString('en-US')}`;

// { val: '₹50 – ₹150', unit: 'per sq ft', from: 50 }
export function price(i, cur = currency.get()) {
  if (!i.inr) return { val: 'Price on quote', unit: i.unit || 'Tell us what you need', from: Infinity };
  const useUsd = cur === 1 && i.usd;
  const [lo, hi] = useUsd ? i.usd : i.inr, f = useUsd ? usd : inr;
  return { val: `${f(lo)} – ${f(hi)}`, unit: i.unit + (cur === 1 && !i.usd ? ' · USD quote on request' : ''), from: i.inr[0] };
}

function paint(b) {
  const on = quote.has(b.dataset.id), name = b.dataset.name;
  b.innerHTML = `${icon(on ? 'check' : 'plus')}<span>${on ? 'In my list' : 'Add to my list'}</span><span class="short">${on ? 'Added' : 'Add'}</span>`;
  b.setAttribute('aria-pressed', on);
  b.setAttribute('aria-label', `${on ? 'Remove' : 'Add'} ${name} ${on ? 'from' : 'to'} my list`);
}
// one listener repaints every "Add to list" button on the page
quote.onChange(() => document.querySelectorAll('button.add[data-id]').forEach(paint));

export function addButton(i, { small = true } = {}) {
  const b = el('button', { type: 'button', className: `btn btn--outline add${small ? ' btn--sm' : ''}` });
  b.dataset.id = i.id; b.dataset.name = i.name;
  b.addEventListener('click', () => { const on = quote.toggle(i.id); toast(on ? `Added to my list: ${i.name}` : `Removed: ${i.name}`); });
  paint(b);
  return b;
}

export const askText = i => `Hi Ebraheem Hussain Productions, I'd like a quote for: ${i.name} (${CAT[i.cat].name}). [From your website]`;

export function card(i, { lazy = true } = {}) {
  const p = price(i), ph = i.photos[0], href = productUrl(i), online = i.group === 'online';
  const pic = el('a', { className: 'pcard__img', href, tabIndex: -1 },
    ph ? el('img', { src: img(ph, 480), srcset: `${img(ph, 320)} 320w, ${img(ph, 480)} 480w, ${img(ph, 720)} 720w`, sizes: '(max-width: 560px) 48vw, 260px', alt: '', loading: lazy ? 'lazy' : 'eager', decoding: 'async', width: 480, height: 480 }) : null,
    el('span', { className: `pcard__tag${online ? ' pcard__tag--online' : ''}`, textContent: online ? 'Online · delivered anywhere' : 'Courier all over India' }));
  pic.setAttribute('aria-hidden', 'true');
  const waBtn = el('a', { className: 'btn btn--wa btn--sm wa-ico', href: wa(askText(i)), target: '_blank', rel: 'noopener' });
  waBtn.innerHTML = icon('wa'); waBtn.setAttribute('aria-label', `Ask for a quote for ${i.name} on WhatsApp`);
  return el('article', { className: 'pcard' },
    pic,
    el('div', { className: 'pcard__body' },
      el('p', { className: 'pcard__cat', textContent: CAT[i.cat].name.replace(' & Landing-Page Packages', '') }),
      el('h3', { className: 'pcard__name' }, el('a', { href, textContent: i.name })),
      el('p', { className: 'pcard__what', textContent: i.what }),
      el('p', { className: 'pcard__price' }, el('b', { textContent: p.val }), el('span', { textContent: p.unit })),
      i.inr ? el('p', { className: 'pcard__avg', textContent: 'Average price*' }) : null,
      el('div', { className: 'pcard__actions' }, addButton(i), waBtn)));
}

export { NOTE };
