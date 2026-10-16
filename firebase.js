// Firebase (free Spark plan): Firestore stores enquiries and reviews, Google sign-in protects the admin page.
// The web config below is public by design; access is controlled by the Firestore security rules.
export const firebaseConfig = {
  apiKey: 'AIzaSyDoUVgknXFXlMt3DvpGGfPfEv1mKMAIjl8',
  authDomain: 'ehproductions-f0c49.firebaseapp.com',
  projectId: 'ehproductions-f0c49',
  storageBucket: 'ehproductions-f0c49.firebasestorage.app',
  messagingSenderId: '876425405711',
  appId: '1:876425405711:web:5d91dd1e117bf236a0ca7a',
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
