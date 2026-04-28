import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const configuredApiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;

// A real Firebase web API key starts with "AIza". If the env var is missing
// or clearly invalid, fall back to a syntactically valid demo key so the SDK
// initializes without throwing `auth/invalid-api-key` at import time.
const isValidApiKey =
  typeof configuredApiKey === "string" &&
  configuredApiKey.startsWith("AIza") &&
  configuredApiKey.length >= 30;

export const isFirebaseConfigured = isValidApiKey;

const firebaseConfig = {
  apiKey: isValidApiKey ? configuredApiKey! : "AIzaSyDemoDemoDemoDemoDemoDemoDemoDemoDemo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
};

const appName = "upskill-school-ui";

function getOrCreateApp(): FirebaseApp {
  const existing = getApps().find((a) => a.name === appName);
  if (existing) return existing;
  return initializeApp(firebaseConfig, appName);
}

const app: FirebaseApp = getOrCreateApp();

export { app };
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
