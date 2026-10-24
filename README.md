# Ebraheem Hussain Productions website

Static site hosted on GitHub Pages: https://ebraheemhussain748.github.io/ehproductions/
Addresses work without `.html` (for example `/catalog`, `/product?id=logo-design`).

## Folders
- `index.html` home, `catalog.html` catalog (search, filters, sort, quote list, print), `product.html` one product (`product?id=...`).
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
