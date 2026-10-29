# Ebraheem Hussain Productions website

Static site hosted on GitHub Pages: https://ebraheemhussain748.github.io/ehproductions/
Addresses work without `.html` (for example `/catalog`, `/product?id=logo-design`).

## Folders
- `index.html` home. Its top is a scroll story: `js/scrollcraft.js` + `css/scrollcraft.css` (the Scroll Craft engine, MIT, do not edit) and `js/story.js` (mounts it and runs the shop-name sign). Story clips and frames are in `assets/story/`.
- `catalog.html` catalog (search, filters, sort, quote list, print), `product.html` one product (`product?id=...`).
- `privacy.html`, `terms.html`, `licenses.html`, `404.html` legal pages. `admin.html` private page for enquiries and reviews (Google sign-in, admin email only).
- `css/styles.css` all styles.
- `js/` page scripts: `common.js` (header, quote list, clean URLs), `shop.js` (product cards, prices), `main.js` (home), `catalog.js`, `product.js`, `legal.js`, `admin.js`, `firebase.js`, `icons.js`.
- `js/data/` all editable content:
  - `catalog-data.js` every product/service with its average price (INR, and USD for online work) and price sources. `inr: null` shows "Price on quote".
  - `details.js` the description and "what you get" list on each product page.
  - `photos.js` sample product photos from Unsplash (Unsplash License) with photographer credits.
  - `site-data.js` contact details, portfolio videos, FAQ and certificates.
- `assets/img/` logo, icons, video posters. `assets/fonts/` web fonts and their licence.
- `firestore.rules` security rules to paste into the Firebase console. Enquiries are also emailed through FormSubmit.

## Adding things
- New product: add it to `ITEMS` in `catalog-data.js`, its text to `details.js`, photos to `photos.js`, and its URL to `sitemap.xml`.
- New video: add it to `WORK` in `site-data.js` and its poster to `assets/img/`.

## Admin page (admin.html)
Sign in with ebraheemhussain748@gmail.com. Sections:
- Dashboard: new leads, follow-ups due, open deals and their quoted value, what people ask for.
- Leads: stages (New → Contacted → Quote sent → Payment pending → In production → Delivered / Lost), quote amount, follow-up date, notes with history, WhatsApp reply templates, CSV download.
- Reviews: approve or hide, reply under a review, delete.
- Prices: change any price, unit or label, mark "price on request", or hide a product. Saved to Firestore `site/public`; the website reads it on every visit.
- Products: add extra products without editing code.
- Home & banner: announcement bar and the "Popular right now" picks.
The `site` rules in `firestore.rules` must be published in the Firebase console for Prices, Products and Home to save.

## Plan builder (plan.html, js/planner.js, js/quiz.js, js/plan.js)
"Build my plan" asks 6 questions (business, goals, where customers are, budget, timing, own words in Hindi or English).
`js/planner.js` scores every product: business and goal rules, offline/online reach, words the customer typed
(shared with the shop search in `js/search.js`), a rough first-order cost compared with the budget, and timing.
It picks 3 items from different categories that fit the budget together, plus up to 3 add-ons, each with a reason.
The plan page can send the plan on WhatsApp, add it to My list, or save it as a lead (service "Plan builder").
To tune suggestions, edit the RULES in `js/planner.js`.
