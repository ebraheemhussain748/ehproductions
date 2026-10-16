# Ebraheem Hussain Productions website

Static site hosted on GitHub Pages: https://ebraheemhussain748.github.io/ehproductions/

- `index.html` home page. `catalog.html` is the full catalog with search, filters, quote list and print view.
- `catalog-data.js` holds every product/service with its average price (INR, and USD for online work), the note
  "This is an average price and depends on your specified work.", the delivery line and the price sources.
  To change a price edit `inr: [low, high]`; `inr: null` shows "On quote". The printed PDF updates by itself.
- The catalog prints as a clean A4 document: the "Save as PDF or print" button opens the browser's print window,
  so the PDF always shows the latest prices.
- `site-data.js` holds contact details, portfolio videos, FAQ and certificates.
- `icons.js` holds the small category icons.
- `firebase.js` holds the Firebase web config (Firestore stores enquiries and reviews).
- `admin.html` is the private page for enquiries and reviews (Google sign-in, admin email only).
- `firestore.rules` are the security rules to paste into the Firebase console.
- Enquiries are also emailed through FormSubmit to the address in `site-data.js`.
