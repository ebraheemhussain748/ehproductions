// Product cards and prices, shared by the home, shop and product pages.
import { img } from './data/photos.js?v=e19716b7';
import { icon } from './icons.js?v=e19716b7';
import { el, wa, CAT, quote, productUrl, store, toast } from './common.js?v=e19716b7';

export const currency = {
  get: () => (store.get('cur', 0) ? 1 : 0),
  set: v => store.set('cur', v ? 1 : 0),
};
const inr = v => v >= 100000 ? `₹${(v / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })} lakh` : `₹${v.toLocaleString('en-IN')}`;
const usd = v => `$${v.toLocaleString('en-US')}`;

// { val: '₹50 – ₹150', from: 'From ₹50', unit: 'per sq ft', low: 50 }
export function price(i, cur = currency.get()) {
  if (!i.inr) return { val: 'Price on request', from: 'Price on request', unit: '', low: Infinity };
  const useUsd = cur === 1 && i.usd;
  const [lo, hi] = useUsd ? i.usd : i.inr, f = useUsd ? usd : inr;
  return { val: lo === hi ? f(lo) : `${f(lo)} – ${f(hi)}`, from: `From ${f(lo)}`, unit: i.unit + (cur === 1 && !i.usd ? ' · USD on request' : ''), low: i.inr[0] };
}

function paint(b) {
  const on = quote.has(b.dataset.id), name = b.dataset.name;
  b.innerHTML = `${icon(on ? 'check' : 'plus')}<span>${on ? 'In my list' : 'Add to list'}</span><span class="short">${on ? 'Added' : 'Add'}</span>`;
  b.setAttribute('aria-pressed', on);
  b.setAttribute('aria-label', `${on ? 'Remove' : 'Add'} ${name} ${on ? 'from' : 'to'} my list`);
}
quote.onChange(() => document.querySelectorAll('button.add[data-id]').forEach(paint));

export function addButton(i, { small = true } = {}) {
  const b = el('button', { type: 'button', className: `btn btn--outline add${small ? ' btn--sm' : ''}` });
  b.dataset.id = i.id; b.dataset.name = i.name;
  b.addEventListener('click', () => { const on = quote.toggle(i.id); toast(on ? `Added to my list: ${i.name}` : `Removed: ${i.name}`); });
  paint(b);
  return b;
}

export const askText = i => `Hi Ebraheem Hussain Productions, I'd like a price for: ${i.name} (${CAT[i.cat].name}). [From your website]`;

export function card(i, { lazy = true } = {}) {
  const p = price(i), ph = i.photos[0], href = productUrl(i);
  const pic = el('a', { className: 'pcard__img', href, tabIndex: -1 },
    ph ? el('img', { src: img(ph, 480), srcset: `${img(ph, 320)} 320w, ${img(ph, 480)} 480w, ${img(ph, 720)} 720w`, sizes: '(max-width: 600px) 48vw, 280px', alt: '', loading: lazy ? 'lazy' : 'eager', decoding: 'async', width: 480, height: 480 })
      : el('span', { className: 'ph', innerHTML: icon(CAT[i.cat].icon) }),
    i.badge ? el('span', { className: 'pcard__tag pcard__tag--gold', textContent: i.badge }) : null);
  pic.setAttribute('aria-hidden', 'true');
  const waBtn = el('a', { className: 'btn btn--wa btn--sm wa-ico', href: wa(askText(i)), target: '_blank', rel: 'noopener' });
  waBtn.innerHTML = icon('wa'); waBtn.setAttribute('aria-label', `Ask the price of ${i.name} on WhatsApp`);
  return el('article', { className: 'pcard' },
    pic,
    el('div', { className: 'pcard__body' },
      el('p', { className: 'pcard__cat', textContent: CAT[i.cat].name.replace(' & Landing-Page Packages', '') }),
      el('h3', { className: 'pcard__name' }, el('a', { href, textContent: i.name })),
      el('p', { className: 'pcard__what', textContent: i.what }),
      el('p', { className: 'pcard__price' }, el('b', { textContent: p.from }), p.unit ? el('span', { textContent: ` ${p.unit}` }) : null),
      el('div', { className: 'pcard__actions' }, addButton(i), waBtn)));
}
