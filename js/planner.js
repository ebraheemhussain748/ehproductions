// Plan builder: the questions and the matching engine.
// The engine scores every product from the answers (business, goals, reach, budget, timing, own words),
// keeps a reason for every point it gives, and returns a short curated plan: 3 main picks + up to 3 add-ons.
import { words, hit, norm, index } from './search.js?v=928c1474';

export const STEPS = [
  { id: 'b', type: 'one', title: 'What do you do?', sub: 'Pick the closest one.', options: [
    { id: 'shop', label: 'Shop or showroom', hint: 'Kirana, boutique, salon, mobile shop' },
    { id: 'food', label: 'Restaurant, café or food brand', hint: 'Dhaba, bakery, sweets, cloud kitchen' },
    { id: 'school', label: 'School or coaching', hint: 'School, academy, tuition centre' },
    { id: 'clinic', label: 'Clinic or service business', hint: 'Doctor, lab, CA, lawyer, agency' },
    { id: 'startup', label: 'Startup or online brand', hint: 'D2C product, app, new brand' },
    { id: 'creator', label: 'Creator, artist or musician', hint: 'Singer, YouTuber, nasheed artist' },
    { id: 'property', label: 'Real estate or builder', hint: 'Plots, flats, projects' },
    { id: 'event', label: 'Event, wedding or campaign', hint: 'Wedding, rally, jagran, party' },
    { id: 'company', label: 'Company or factory', hint: 'Manufacturer, distributor, office' },
    { id: 'other', label: 'Something else', hint: 'Tell us at the end' },
  ] },
  { id: 'g', type: 'many', max: 3, title: 'What do you want to happen?', sub: 'Choose up to 3.', options: [
    { id: 'walkin', label: 'More customers at my door' },
    { id: 'premium', label: 'Look premium and trusted' },
    { id: 'online', label: 'Get enquiries or sell online' },
    { id: 'social', label: 'Grow on Instagram & YouTube' },
    { id: 'launch', label: 'Launch something new' },
    { id: 'event', label: 'Promote an event' },
    { id: 'music', label: 'Release my music' },
    { id: 'save', label: 'Save time with automation' },
  ] },
  { id: 'r', type: 'many', max: 5, title: 'Where are your customers?', sub: 'Choose all that apply.', options: [
    { id: 'street', label: 'On the street, near my shop' },
    { id: 'social', label: 'Instagram, Facebook, YouTube' },
    { id: 'google', label: 'Searching on Google' },
    { id: 'whatsapp', label: 'On WhatsApp' },
    { id: 'all', label: 'Everywhere' },
  ] },
  { id: 'm', type: 'one', title: 'What is your budget?', sub: 'For everything together. It only helps us suggest the right size.', options: [
    { id: 'b1', label: 'Under ₹5,000', max: 5000 },
    { id: 'b2', label: '₹5,000 to ₹20,000', max: 20000 },
    { id: 'b3', label: '₹20,000 to ₹50,000', max: 50000 },
    { id: 'b4', label: '₹50,000 to ₹2 lakh', max: 200000 },
    { id: 'b5', label: 'Above ₹2 lakh', max: 1e9 },
    { id: 'b0', label: 'Not sure yet', max: null },
  ] },
  { id: 't', type: 'one', title: 'When do you need it?', sub: '', options: [
    { id: 'week', label: 'Within a week' },
    { id: 'month', label: 'This month' },
    { id: 'flex', label: 'No hurry' },
  ] },
  { id: 'q', type: 'text', title: 'Anything else?', sub: 'In your own words, Hindi or English. Optional.',
    placeholder: 'For example: new café opening in Mathura next month, need a board, menu and Instagram reels' },
];

// category weights (w) and product weights (p) for each answer
const RULES = {
  b: {
    shop: { label: 'for your shop', w: { signage: 5, banners: 3, business: 2, retail: 2, social: 2, plates: 1 }, p: { 'local-seo-and-google-business-profile': 4, 'shop-signboards': 4, 'glow-sign-boards': 3, 'qr-code-standees': 2 } },
    food: { label: 'for a food business', w: { retail: 5, signage: 3, social: 3, video: 3 }, p: { 'menu-cards': 5, 'takeaway-packaging': 4, 'product-advertisements': 4, 'qr-code-standees': 3, 'led-neon-signs': 2 } },
    school: { label: 'for a school or coaching', w: { uniforms: 5, business: 3, banners: 3, gifts: 2, websites: 2, apps: 1 }, p: { 'school-uniforms': 5, 'id-cards-and-lanyards': 5, 'promotional-flex-boards': 3, 'promotional-banners': 3, 'diaries-and-notebooks': 3, 'educational-apps': 2 } },
    clinic: { label: 'for a service business', w: { plates: 4, signage: 3, business: 3, websites: 3, digital: 2 }, p: { 'local-seo-and-google-business-profile': 5, 'direction-boards': 3, 'reception-signs': 3, 'business-websites': 4, 'visiting-cards': 3 } },
    startup: { label: 'for a new brand', w: { branding: 5, websites: 4, social: 3, video: 3, webdev: 3, apps: 2, digital: 2 }, p: { 'logo-and-brand-kit': 5, 'product-landing-pages': 4, 'facebook-and-instagram-ad-creatives': 3, 'ai-generated-promotional-videos': 4 } },
    creator: { label: 'for a creator', w: { music: 6, video: 5, social: 3, branding: 2 }, p: { 'mixing-mastering-package': 4, 'music-and-lyric-videos': 4, 'logo-reveals-and-motion-graphics': 3, 'instagram-reels-and-youtube-shorts': 4, 'online-portfolios': 3 } },
    property: { label: 'for real estate', w: { signage: 3, business: 3, video: 3, websites: 3, social: 2 }, p: { 'hoardings-and-billboards': 5, 'brochures': 5, 'lead-generation-pages': 5, 'ai-generated-promotional-videos': 3 } },
    event: { label: 'for your event', w: { banners: 5, signage: 3, uniforms: 2, business: 2, social: 2 }, p: { 'birthday-and-wedding-backdrops': 5, 'wedding-and-invitation-cards': 5, 'political-and-event-banners': 5, 'standees': 3, 'promotional-t-shirts': 3, 'festival-and-sale-posters': 2 } },
    company: { label: 'for a company', w: { gifts: 4, business: 4, uniforms: 3, branding: 3, digital: 3, webdev: 2 }, p: { 'staff-uniforms': 4, 'catalogues-and-booklets': 4, 'custom-business-websites': 3, 'business-automation': 3, 'reception-signs': 3 } },
    other: { label: '', w: {}, p: {} },
  },
  g: {
    walkin: { label: 'to bring more customers in', w: { signage: 4, banners: 3 }, p: { 'local-seo-and-google-business-profile': 4, 'shop-signboards': 3, 'glow-sign-boards': 3, 'pamphlets-and-leaflets': 2 } },
    premium: { label: 'to look premium', w: { branding: 4 }, p: { 'logo-and-brand-kit': 4, '3d-led-letters': 3, 'premium-visiting-cards': 3, 'brand-guidelines': 2, 'product-advertisements': 2 } },
    online: { label: 'to get enquiries online', w: { websites: 4, webdev: 3 }, p: { 'e-commerce-websites': 4, 'lead-generation-pages': 4, 'product-landing-pages': 3, 'facebook-and-instagram-ad-creatives': 3 } },
    social: { label: 'to grow on social media', w: { social: 4, video: 4 }, p: { 'instagram-reels-and-youtube-shorts': 5, 'social-media-management': 3, 'business-promotion-graphics': 3, 'ai-generated-promotional-videos': 3 } },
    launch: { label: 'for your launch', w: { banners: 2, video: 2 }, p: { 'shop-opening-banners': 4, 'complete-offline-campaign': 4, 'product-advertisements': 3, 'standees': 2, 'pamphlets-and-leaflets': 2 } },
    event: { label: 'to promote your event', w: { banners: 4 }, p: { 'political-and-event-banners': 4, 'standees': 3, 'festival-and-sale-posters': 3, 'promotional-t-shirts': 2 } },
    music: { label: 'to release your music', w: { music: 6 }, p: { 'music-and-lyric-videos': 4, 'logo-reveals-and-motion-graphics': 1 } },
    save: { label: 'to save time', w: { digital: 5 }, p: { 'business-automation': 4, 'ai-powered-tools-and-chatbots': 3 } },
  },
  r: {
    street: { label: 'to reach people nearby', group: 'offline' },
    social: { label: 'for social media', w: { social: 3, video: 3 } },
    google: { label: 'to be found on Google', w: { websites: 3, webdev: 2 }, p: { 'local-seo-and-google-business-profile': 3 } },
    whatsapp: { label: 'for WhatsApp', p: { 'business-automation': 3, 'festival-and-sale-posters': 2 } },
    all: { label: '' },
  },
};

// words in the customer's own text that tell us the business type
const BUSINESS_WORDS = {
  food: 'restaurant cafe café dhaba hotel food bakery sweets mithai cloud kitchen biryani pizza juice tea chai',
  school: 'school coaching academy tuition institute classes college',
  clinic: 'clinic hospital doctor dental dentist pharmacy medical lab ca lawyer advocate agency salon',
  startup: 'startup brand d2c ecommerce online store app',
  creator: 'singer rapper music song youtuber creator artist nasheed band studio gaana',
  property: 'builder real estate property plot plots flat flats colony township',
  event: 'wedding shaadi shadi event rally election party birthday jagran mela function',
  company: 'company factory office corporate manufacturer industry distributor wholesale',
  shop: 'shop store dukan dukaan showroom boutique mart kirana',
};

// rough order size for a typical first order, so per-unit prices can be compared with the budget
export function typical(i) {
  const u = (i.unit || '').toLowerCase();
  let q = 1, basis = '';
  if (u.includes('sq ft')) { q = 32; basis = 'about 32 sq ft'; }
  else if (u.includes('inch')) { q = 80; basis = 'about 8 letters, 10 inch'; }
  else if (u.includes('per 100')) { q = 2; basis = '200 cards'; }
  else if (u.includes('per 1,000')) { q = 1; basis = '1,000 pieces'; }
  else if (i.cat === 'gifts') { q = 50; basis = '50 pieces'; }
  else if (i.cat === 'uniforms') { q = 25; basis = '25 pieces'; }
  else if (/per (box|bag)/.test(u)) { q = 200; basis = '200 pieces'; }
  else if (u.includes('per card')) { q = 100; basis = '100 cards'; }
  else if (u.includes('per book')) { q = 5; basis = '5 books'; }
  else if (u.includes('per copy')) { q = 50; basis = '50 copies'; }
  else if (u.includes('per piece (bulk)')) { q = 300; basis = '300 pieces'; }
  else if (u.includes('per piece (100+)')) { q = 100; basis = '100 pieces'; }
  else if (/per (reel|creative|poster)/.test(u)) { q = 3; basis = '3 pieces'; }
  else if (u.includes('per piece') && ['retail'].includes(i.cat)) { q = 10; basis = '10 pieces'; }
  else if (u.includes('per month')) { basis = 'first month'; }
  if (!i.inr) return null;
  return { lo: Math.round(i.inr[0] * q), hi: Math.round(i.inr[1] * q), basis };
}

const SLOW = new Set(['android-apps', 'ios-apps', 'business-management-apps', 'educational-apps', 'web-apps-and-saas-products', 'website-app-package', 'custom-software', 'e-commerce-websites', 'custom-business-websites', 'ai-powered-tools-and-chatbots', 'api-and-system-integrations']);

// money in the customer's text: "10k", "₹15,000", "1 lakh", "5 hazar"
function moneyIn(text) {
  const t = String(text || '').toLowerCase().replace(/,/g, '');
  const m = t.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(k|thousand|hazar|hajar|lakh|lac|l\b)?/g) || [];
  let best = null;
  for (const s of m) {
    const x = s.match(/(\d+(?:\.\d+)?)\s*(k|thousand|hazar|hajar|lakh|lac|l\b)?/);
    let n = Number(x[1]); const u = x[2] || '';
    if (/^(k|thousand|hazar|hajar)$/.test(u)) n *= 1000; else if (/^(lakh|lac|l)$/.test(u)) n *= 100000;
    if (n >= 1000 && (!best || n > best)) best = n; // ignore small numbers like sizes or "10x3"
  }
  return best;
}

export function plan(ans, ITEMS, CAT) {
  index(ITEMS, CAT);
  const S = new Map(ITEMS.map(i => [i.id, { i, s: 0, why: new Map() }]));
  const add = (id, n, why) => { const x = S.get(id); if (!x || !n) return; x.s += n; if (why) x.why.set(why, (x.why.get(why) || 0) + n); };
  const addCat = (cat, n, why) => { for (const x of S.values()) if (x.i.cat === cat) add(x.i.id, n, why); };
  const apply = (r, k = 1) => { if (!r) return; for (const [c, n] of Object.entries(r.w || {})) addCat(c, n * k, r.label); for (const [id, n] of Object.entries(r.p || {})) add(id, n * k, r.label); };

  // 1. business, also guessed from the customer's words
  apply(RULES.b[ans.b]);
  const text = norm(ans.q || '');
  const guessed = Object.entries(BUSINESS_WORDS).filter(([, ws]) => ws.split(' ').some(w => (' ' + text + ' ').includes(' ' + w + ' ') || (w.length > 4 && text.includes(w)))).map(([k]) => k);
  for (const b of guessed) if (b !== ans.b) apply({ ...RULES.b[b], label: RULES.b[b].label }, ans.b && ans.b !== 'other' ? 0.5 : 1);

  // 2. goals and 3. where customers are
  for (const g of ans.g || []) apply(RULES.g[g]);
  const reach = ans.r || [];
  for (const r of reach) apply(RULES.r[r]);
  const offline = reach.includes('street'), online = reach.some(r => ['social', 'google', 'whatsapp'].includes(r));
  if (offline && !online) for (const x of S.values()) x.s *= x.i.group === 'offline' ? 1.3 : 0.75;
  if (online && !offline) for (const x of S.values()) x.s *= x.i.group === 'online' ? 1.3 : 0.75;

  // 4. the customer's own words: products they name get a strong push
  const ws = words(ans.q || '').filter(w => !/\d/.test(w));
  for (const x of S.values()) {
    const name = norm(x.i.name);
    const inName = ws.filter(w => hit(name, w)).length, own = ws.filter(w => hit(x.i.own, w)).length, wide = ws.filter(w => hit(x.i.wide, w)).length;
    const ctx = x.s > 0 || !(ans.b && ans.b !== 'other') && !guessed.length ? 1 : 0.4; // a "card" for a wedding is a wedding card, not a menu card
    if (inName) add(x.i.id, 7 * inName * ctx, 'you asked for it');
    else if (own) add(x.i.id, 3 * own * ctx, 'matches what you wrote');
    else if (wide) add(x.i.id, 1.5 * wide, '');
  }

  // 5. budget (from the answer, or a number written in the text) and timing
  const budgetOpt = STEPS[3].options.find(o => o.id === ans.m);
  const max = moneyIn(ans.q) || budgetOpt?.max || null;
  for (const x of S.values()) {
    const t = typical(x.i);
    if (max && t) {
      if (t.lo > max * 1.25) x.s *= 0.3;
      else if (t.lo > max) x.s *= 0.7;
      else if (t.hi <= max) add(x.i.id, 1.5, 'fits your budget');
      if (max >= 200000 && t.lo > 20000) add(x.i.id, 1, '');
    }
    if (ans.t === 'week' && SLOW.has(x.i.id)) x.s -= 6;
    if (ans.t === 'week' && ['social', 'business', 'banners'].includes(x.i.cat)) add(x.i.id, 0.5, '');
  }

  // pick: 3 main items from different categories, then up to 3 smaller add-ons
  const ranked = [...S.values()].filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  const main = [], cats = new Set();
  let spent = 0;
  const fits = x => { const t = typical(x.i); return !max || !t || !main.length || spent + t.lo <= max * 1.2; };
  const take = x => { main.push(x); cats.add(x.i.cat); spent += typical(x.i)?.lo || 0; };
  for (const x of ranked) { if (main.length === 3) break; if (!cats.has(x.i.cat) && fits(x)) take(x); }
  for (const x of ranked) { if (main.length === 3) break; if (!main.includes(x) && fits(x)) take(x); }
  const top = main[0]?.s || 1;
  const extra = ranked.filter(x => !main.includes(x) && x.s >= top * 0.35)
    .filter((x, k, arr) => arr.findIndex(y => y.i.cat === x.i.cat) === k).slice(0, 3);
  const reasons = x => [...x.why.entries()].filter(([k]) => k).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k);
  const out = x => ({ item: x.i, score: Math.round(x.s * 10) / 10, reasons: reasons(x), cost: typical(x.i) });
  const picks = main.map(out), addons = extra.map(out);
  const total = picks.reduce((t, p) => p.cost ? { lo: t.lo + p.cost.lo, hi: t.hi + p.cost.hi } : t, { lo: 0, hi: 0 });
  return { picks, addons, total, max, guessed, onRequest: picks.filter(p => !p.cost).length };
}

export const labelOf = (step, id) => STEPS.find(s => s.id === step)?.options?.find(o => o.id === id)?.label || '';
