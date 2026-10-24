// Text understanding shared by the shop search and the plan builder (English + common Hinglish).
// extra words people type (English + common Hinglish) so search finds the right thing
export const KEYWORDS = {
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
export const SYN = {
  shaadi: 'wedding', shadi: 'wedding', vivah: 'wedding', dukan: 'shop', dukaan: 'shop', naam: 'name', ghar: 'house',
  kapde: 'clothing', vardi: 'uniform', tshirt: 't shirt', tee: 't shirt', tshirts: 't shirt', flyer: 'leaflets', handbill: 'pamphlets',
  hoarding: 'hoardings', billboard: 'billboards', reel: 'reels', short: 'shorts', ads: 'ad', advert: 'advertisements', commercial: 'ad',
  site: 'website', web: 'website', bot: 'chatbots', chatbot: 'chatbots', gmb: 'google', gaana: 'song', gana: 'song', mix: 'mixing', master: 'mastering',
};
export const norm = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9₹ ]+/g, ' ');
// filler words people type (English + Hinglish) that should not decide the results
export const STOP = new Set('i a an the for of and to in on my me we us our need needs want wants please plz pls price prices rate rates cost kitna kitne kya ka ki ke ko se me mein par ek hai hain ho chahiye chaiye chahie banana banwana banwani banani banao karna make get new naya nayi wala wali aur bhi mera meri mere hamara hamari apna apni liye chahta chahti hun hoon karni karwana next month week day days year budget around approx under above about also some'.split(' '));

export const words = q => norm(q || '').split(/\s+/).filter(w => w.length > 1 && !STOP.has(w));
export const starts = (hay, w) => (' ' + hay).includes(' ' + w); // match the start of a word, so “ad” finds “advert” but not “letterhead”
export const hit = (hay, w) => starts(hay, w) || starts(hay, w.replace(/s$/, '')) || (SYN[w] && starts(hay, SYN[w].replace(/s$/, '')));
export function index(items, CAT) {
  items.forEach(i => { i.own = norm([i.name, i.what, i.tip || ''].join(' ')); i.wide = norm([i.own, CAT[i.cat].name, KEYWORDS[i.cat] || ''].join(' ')); });
}
