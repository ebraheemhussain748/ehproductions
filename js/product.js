// Product page: product?id=<product id>
import { NOTE, DELIVERY, ITEMS, SOURCES } from './data/catalog-data.js';
import { DETAILS } from './data/details.js';
import { img, credit } from './data/photos.js';
import { icon } from './icons.js';
import { $, $$, el, wa, initChrome, CAT, byId, productUrl, quote } from './common.js';
import { card, price, currency, addButton, askText } from './shop.js';

initChrome({ page: 'product' });

const root = $('#pd-root');
const id = new URLSearchParams(location.search).get('id');
const i = id && byId(id);

if (!i) {
  document.title = 'Product not found | Ebraheem Hussain Productions';
  root.replaceChildren(
    el('ol', { className: 'crumbs' }, el('li', {}, el('a', { href: './', textContent: 'Home' })), el('li', {}, el('a', { href: 'catalog', textContent: 'Catalog' }))),
    el('div', { className: 'empty', style: 'margin:20px 0 60px' },
      el('p', { className: 'empty__big', textContent: 'This product is not here.' }),
      el('p', { textContent: 'The link may be old. Everything we make is in the catalog.' }),
      el('a', { className: 'btn btn--ink', href: 'catalog', textContent: 'Open the catalog' })));
} else {
  render();
}

function render() {
  const c = CAT[i.cat], d = DETAILS[i.id] || {}, online = i.group === 'online';
  document.title = `${i.name}: price and details | Ebraheem Hussain Productions`;
  const p0 = price(i, 0);
  const desc = `${i.name}${i.inr ? `, average price ${p0.val} ${p0.unit}` : ''}. ${i.what} ${online ? 'Delivered online, anywhere.' : DELIVERY}`;
  $('meta[name="description"]').content = desc;
  $('link[rel="canonical"]').href = `https://ebraheemhussain748.github.io/ehproductions/${productUrl(i)}`;

  /* gallery */
  const photos = i.photos;
  const main = el('div', { className: 'gallery__main' });
  const credLine = el('p', { className: 'gallery__credit' });
  const show = n => {
    const ph = photos[n]; if (!ph) return;
    main.replaceChildren(
      el('img', { src: img(ph, 900), srcset: `${img(ph, 600)} 600w, ${img(ph, 900)} 900w, ${img(ph, 1200)} 1200w`, sizes: '(max-width: 860px) 94vw, 560px', alt: `Sample photo for ${i.name}`, width: 900, height: 900 }),
      el('span', { className: 'gallery__label', textContent: 'Sample photo' }));
    const cr = credit(ph);
    credLine.replaceChildren('Sample photo by ', el('a', { href: cr.href, target: '_blank', rel: 'noopener', textContent: cr.by }), ' on ',
      el('a', { href: 'https://unsplash.com/?utm_source=ehproductions&utm_medium=referral', target: '_blank', rel: 'noopener', textContent: 'Unsplash' }),
      '. It shows the kind of product, not our finished work.');
    $$('.gallery__thumbs button', gallery).forEach((b, k) => b.setAttribute('aria-pressed', k === n));
  };
  const thumbs = photos.length > 1 ? el('div', { className: 'gallery__thumbs' }, ...photos.map((ph, n) => {
    const b = el('button', { type: 'button', ariaLabel: `Show photo ${n + 1} of ${photos.length}` }, el('img', { src: img(ph, 152), alt: '', width: 76, height: 76, loading: 'lazy' }));
    b.addEventListener('click', () => show(n));
    return b;
  })) : null;
  const gallery = el('div', { className: 'gallery' }, main, thumbs, credLine);

  /* price box */
  const pbox = el('div', { className: 'pricebox' });
  const paintPrice = () => {
    const p = price(i), cur = currency.get();
    const seg = el('div', { className: 'seg', role: 'group', ariaLabel: 'Currency' },
      ...[['₹ INR', 0], ['$ USD', 1]].map(([t, v]) => {
        const b = el('button', { type: 'button', textContent: t }); b.setAttribute('aria-pressed', cur === v);
        b.addEventListener('click', () => { currency.set(v); paintPrice(); }); return b;
      }));
    pbox.replaceChildren(
      el('div', { className: 'pricebox__top' }, el('span', { className: 'pricebox__label', textContent: i.inr ? 'Average price*' : 'Price' }), i.usd ? seg : null),
      el('span', { className: 'pricebox__val', textContent: p.val }),
      el('span', { className: 'pricebox__unit', textContent: p.unit }),
      el('p', { className: 'pricebox__note', textContent: i.inr ? `* ${NOTE} You get a fixed quote before any work starts.` : 'Tell us what you need and we send a fixed quote.' }));
  };
  paintPrice();

  const buyWa = el('a', { className: 'btn btn--wa', href: wa(askText(i)), target: '_blank', rel: 'noopener' });
  buyWa.innerHTML = `${icon('wa')}<span>Get a quote on WhatsApp</span>`;
  const form = el('a', { className: 'btn btn--outline', href: `./?enquiry=${encodeURIComponent(i.name)}#contact`, textContent: 'Enquiry form' });
  const info = el('div', { className: 'pd__info' },
    el('a', { className: 'pd__cat', href: `catalog?cat=${c.id}` }, el('span', { innerHTML: icon(c.icon) }), c.name),
    el('h1', { textContent: i.name }),
    el('p', { className: 'pd__what', textContent: i.what }),
    pbox,
    el('div', { className: 'pd__buy' }, buyWa, addButton(i, { small: false }), form),
    el('ul', { className: 'perks' },
      el('li', { innerHTML: `${icon(online ? 'bolt' : 'truck')}<span>${online ? 'Online work, delivered anywhere by link' : DELIVERY}</span>` }),
      el('li', { innerHTML: `${icon('shield')}<span>Fixed quote before any work starts</span>` }),
      el('li', { innerHTML: `${icon('chat')}<span>Reply on WhatsApp within 24 hours</span>` })),
    d.good ? el('p', { className: 'pd__good' }, el('strong', { textContent: 'Good for: ' }), d.good) : null,
    i.tip ? el('p', { className: 'pd__tip' }, el('strong', { textContent: 'Tip: ' }), i.tip) : null);

  /* details */
  const srcs = (i.src || []).filter(k => SOURCES[k]);
  const blocks = el('div', { className: 'pinfo' },
    el('div', {}, el('h2', { textContent: 'About this' }), el('p', { textContent: d.about || i.what })),
    el('div', {}, el('h2', { textContent: 'What you get' }), el('ul', {}, ...(d.points || [i.what]).map(t => el('li', { textContent: t })))),
    el('div', {}, el('h2', { textContent: 'How to order' }), el('ol', {},
      el('li', { textContent: 'Tap “Get a quote on WhatsApp” or add it to your list.' }),
      el('li', { textContent: online ? 'Share your idea, examples and deadline.' : 'Share size, quantity, design and deadline.' }),
      el('li', { textContent: 'Approve the fixed quote and the design or concept.' }),
      el('li', { textContent: online ? 'Get your files by link.' : 'We print, make and courier it to you.' })),
      srcs.length ? el('p', { className: 'small', style: 'margin-top:14px' }, 'Average price checked from: ',
        ...srcs.flatMap((k, n) => [n ? ', ' : '', el('a', { href: SOURCES[k][1], target: '_blank', rel: 'noopener', textContent: SOURCES[k][0] })])) : null));

  const same = ITEMS.filter(x => x.cat === i.cat && x.id !== i.id);
  const more = ITEMS.filter(x => x.group === i.group && x.cat !== i.cat);
  const pick = more.filter((_, n) => n % Math.max(1, Math.floor(more.length / 8)) === 0).slice(0, 8);
  root.replaceChildren(...[
    el('ol', { className: 'crumbs' },
      el('li', {}, el('a', { href: './', textContent: 'Home' })),
      el('li', {}, el('a', { href: 'catalog', textContent: 'Catalog' })),
      el('li', {}, el('a', { href: `catalog?cat=${c.id}`, textContent: c.name })),
      el('li', { textContent: i.name })),
    el('div', { className: 'pd' }, gallery, info),
    blocks,
    same.length ? el('section', { className: 'related' }, el('h2', { textContent: `More in ${c.name}` }), el('div', { className: 'rail' }, ...same.map(x => card(x)))) : null,
    pick.length ? el('section', { className: 'related' }, el('h2', { textContent: 'You may also need' }), el('div', { className: 'rail' }, ...pick.map(x => card(x)))) : null].filter(Boolean));
  show(0);

  // phones: keep the two actions on screen while the customer reads
  const bar = $('.abar');
  if (bar) {
    const w = el('a', { className: 'btn btn--wa', href: wa(askText(i)), target: '_blank', rel: 'noopener' });
    w.innerHTML = `${icon('wa')}<span>Get price on WhatsApp</span>`;
    bar.classList.add('abar--buy');
    bar.setAttribute('aria-label', 'Order this product');
    bar.replaceChildren(addButton(i, { small: false }), w);
  }

  // structured data for search engines (real prices only, no ratings)
  const ld = { '@context': 'https://schema.org', '@type': 'Product', name: i.name, description: d.about || i.what, category: c.name,
    brand: { '@type': 'Brand', name: 'Ebraheem Hussain Productions' }, url: `https://ebraheemhussain748.github.io/ehproductions/${productUrl(i)}` };
  if (photos[0]) ld.image = img(photos[0], 1200);
  if (i.inr) ld.offers = { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: i.inr[0], highPrice: i.inr[1], availability: 'https://schema.org/InStock' };
  document.head.append(el('script', { type: 'application/ld+json', textContent: JSON.stringify(ld) }));
}
