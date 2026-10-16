# Ebraheem Hussain Productions website

Static site hosted on GitHub Pages: https://ebraheemhussain748.github.io/ehproductions/

- `site-data.js` holds all editable content: contact details, portfolio videos, services and prices, FAQ, certificates.
- `firebase.js` holds the Firebase web config (Firestore stores enquiries and reviews).
- `admin.html` is the private page for enquiries and reviews (Google sign-in, admin email only).
- `firestore.rules` are the security rules to paste into the Firebase console.
- Enquiries are also emailed through FormSubmit to the address in `site-data.js`.
