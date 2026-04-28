import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const configuredApiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;

// A valid Firebase web API key starts with "AIza" and is ~39 chars long.
const isValidApiKey =
  typeof configuredApiKey === "string" &&
  configuredApiKey.startsWith("AIza") &&
  configuredApiKey.length >= 30;

export const isFirebaseConfigured = isValidApiKey;

const firebaseConfig = {
  apiKey: isValidApiKey ? configuredApiKey! : "AIzaSyDemoDemoDemoDemoDemoDemoDemoDemoDemo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
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

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!_app) _app = getOrCreateApp();
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    try {
      _auth = getAuth(getFirebaseApp());
    } catch (err) {
      console.warn("[firebase] getAuth failed — Firebase not configured.", err);
      throw err;
    }
  }
  return _auth;
}

export function getDb(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getFirebaseApp());
  return _storage;
}

// Backwards-compatible exports using lazy proxies so importing this module
// never throws even when Firebase env vars are missing or invalid.
export const auth = new Proxy({} as Auth, {
  get(_t, prop) {
    const target = getFirebaseAuth() as unknown as Record<string | symbol, unknown>;
    const value = target[prop];
    return typeof value === "function" ? (value as Function).bind(target) : value;
  },
});

export const db = new Proxy({} as Firestore, {
  get(_t, prop) {
    const target = getDb() as unknown as Record<string | symbol, unknown>;
    const value = target[prop];
    return typeof value === "function" ? (value as Function).bind(target) : value;
  },
});

export const storage = new Proxy({} as FirebaseStorage, {
  get(_t, prop) {
    const target = getFirebaseStorage() as unknown as Record<string | symbol, unknown>;
    const value = target[prop];
    return typeof value === "function" ? (value as Function).bind(target) : value;
  },
});

export default { getFirebaseApp, getFirebaseAuth, getDb, getFirebaseStorage };
