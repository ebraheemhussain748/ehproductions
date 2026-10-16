// Firebase (free Spark plan): Firestore stores enquiries and reviews, Google sign-in protects the admin page.
// The web config below is public by design; access is controlled by the Firestore security rules.
export const firebaseConfig = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME',
  projectId: 'REPLACE_ME',
  storageBucket: 'REPLACE_ME',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME',
};

export const ADMIN_EMAIL = 'ebraheemhussain748@gmail.com';

const V = '10.12.2';
const CDN = `https://www.gstatic.com/firebasejs/${V}`;
export const configured = !String(firebaseConfig.apiKey).startsWith('REPLACE');

let cache = null;
export async function fb() {
  if (!configured) throw new Error('Firebase is not configured yet');
  if (cache) return cache;
  const [{ initializeApp }, fs, auth] = await Promise.all([
    import(`${CDN}/firebase-app.js`),
    import(`${CDN}/firebase-firestore.js`),
    import(`${CDN}/firebase-auth.js`),
  ]);
  const app = initializeApp(firebaseConfig);
  cache = { app, fs, auth, db: fs.getFirestore(app) };
  return cache;
}
