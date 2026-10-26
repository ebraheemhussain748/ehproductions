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

// App Check: Google reCAPTCHA (Fraud Defense) proves requests come from this website, so bots cannot flood the database.
export const RECAPTCHA_SITE_KEY = '6LccJgEuAAAAAHb_lsDrDJbXg_Sh2mVZGJ05jlNz';

let base = null;
function core() {
  if (!base) base = (async () => {
    const [{ initializeApp, getApps }, ac] = await Promise.all([import(`${CDN}/firebase-app.js`), import(`${CDN}/firebase-app-check.js`)]);
    const app = getApps()[0] || initializeApp(firebaseConfig);
    const check = ac.initializeAppCheck(app, { provider: new ac.ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY), isTokenAutoRefreshEnabled: true });
    return { app, ac, check };
  })();
  return base;
}

// Header for plain REST calls (the website reads its settings without the full Firebase SDK).
export async function appCheckHeaders() {
  try { const { ac, check } = await core(); const { token } = await ac.getToken(check, false); return { 'X-Firebase-AppCheck': token }; }
  catch { return {}; }
}

let cache = null;
export async function fb() {
  if (!configured) throw new Error('Firebase is not configured yet');
  if (cache) return cache;
  const [{ app }, fs, auth] = await Promise.all([core(), import(`${CDN}/firebase-firestore.js`), import(`${CDN}/firebase-auth.js`)]);
  cache = { app, fs, auth, db: fs.getFirestore(app) };
  return cache;
}
