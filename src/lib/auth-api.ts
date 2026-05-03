import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  checkActionCode,
  applyActionCode,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth } from "./firebase";
import { useAuthStore } from "@/stores/auth-store";
import { User as DbUser } from "./db/schema";
import { usersCollection } from "./db/collections";

const TOKEN_KEY = "edu_auth_token";
const hasFirebaseCredentials =
  typeof import.meta.env.VITE_FIREBASE_API_KEY === "string" &&
  import.meta.env.VITE_FIREBASE_API_KEY.startsWith("AIza") &&
  Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

export type Role = "student" | "instructor" | "alumni" | "partner" | "admin";

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

function inferRole(email: string, password = ""): Role {
  const signal = `${email} ${password}`.toLowerCase();
  if (signal.includes("admin") || signal.includes("ust001")) return "admin";
  if (signal.includes("instructor") || signal.includes("teacher")) return "instructor";
  if (signal.includes("alumni")) return "alumni";
  if (signal.includes("partner")) return "partner";
  return "student";
}

function createLocalUser(email: string, role: Role, fullName?: string): DbUser {
  const normalizedEmail = email.trim().toLowerCase() || "demo@ust.local";
  const now = Timestamp.now();
  return {
    id: `demo-${role}-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
    email: normalizedEmail,
    displayName: fullName || normalizedEmail.split("@")[0].replace(/[._-]/g, " "),
    photoURL: null,
    role,
    status: "Active",
    createdAt: now,
    updatedAt: now,
  };
}

function completeLocalAuth(user: DbUser) {
  const token = `demo-token-${user.id}`;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
  useAuthStore.getState().setUser(user);
  return { token, user };
}

export const authApi = {
  async login(input: LoginInput) {
    if (!hasFirebaseCredentials) {
      return completeLocalAuth(createLocalUser(input.email, inferRole(input.email, input.password)));
    }

    const userCredential = await signInWithEmailAndPassword(auth, input.email, input.password);
    
    /* 
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      // Optional: resend verification email if they try to login without verification
      await sendEmailVerification(userCredential.user);
      throw new Error("Please verify your email address. A new verification link has been sent to your inbox.");
    }
    */

    const token = await userCredential.user.getIdToken();
    sessionStorage.setItem(TOKEN_KEY, token);

    // Fetch the user's role from Firestore
    const userDoc = await getDoc(doc(usersCollection, userCredential.user.uid));
    const userData = (userDoc.data() as DbUser | undefined) ?? createLocalUser(input.email, "student");
    
    // Update store immediately to avoid race conditions with onAuthStateChanged
    useAuthStore.getState().setUser(userData);

    return { token, user: userData };
  },

  async signup(input: SignupInput) {
    if (!hasFirebaseCredentials) {
      return completeLocalAuth(createLocalUser(input.email, input.role, input.fullName));
    }

    // 1. Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, input.email, input.password);
    
    // 2. Update their display name in Auth
    await updateProfile(userCredential.user, { displayName: input.fullName });

    // 3. Create the user document in Firestore
    await setDoc(doc(usersCollection, userCredential.user.uid), {
      id: userCredential.user.uid,
      email: input.email,
      displayName: input.fullName,
      photoURL: null,
      role: input.role,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    // 4. Send verification email
    await sendEmailVerification(userCredential.user);

    const token = await userCredential.user.getIdToken();
    sessionStorage.setItem(TOKEN_KEY, token);

    const userData: DbUser = {
      id: userCredential.user.uid,
      email: input.email,
      displayName: input.fullName,
      photoURL: null,
      role: input.role,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    useAuthStore.getState().setUser(userData);

    return { token, user: userData };
  },

  async forgotPassword(email: string) {
    if (!hasFirebaseCredentials) {
      return { message: `Reset link sent to ${email}` };
    }

    await sendPasswordResetEmail(auth, email);
    return { message: `Reset link sent to ${email}` };
  },

  async resetPassword(actionCode: string, password: string) {
    if (!hasFirebaseCredentials) {
      return { message: "Password updated" };
    }

    // Verify the code before confirming
    await verifyPasswordResetCode(auth, actionCode);
    await confirmPasswordReset(auth, actionCode, password);
    return { message: "Password updated" };
  },

  async verifyEmail(actionCode: string) {
    if (!hasFirebaseCredentials) {
      return { verified: true };
    }

    // Verify the email action code
    await checkActionCode(auth, actionCode);
    await applyActionCode(auth, actionCode);
    return { verified: true };
  },

  async google() {
    if (!hasFirebaseCredentials) {
      return completeLocalAuth(createLocalUser("google.user@ust.local", "student", "Google User"));
    }

    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user already exists in Firestore
    const userDocRef = doc(usersCollection, userCredential.user.uid);
    const userDocSnap = await getDoc(userDocRef);

    let role: Role = "student";

    // If it's a new Google user, create their document in Firestore
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        id: userCredential.user.uid,
        email: userCredential.user.email || "",
        displayName: userCredential.user.displayName || "Google User",
        photoURL: userCredential.user.photoURL || null,
        role: "student", // default role for social login
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } else {
      role = userDocSnap.data().role as Role;
    }

    const token = await userCredential.user.getIdToken();
    sessionStorage.setItem(TOKEN_KEY, token);

    const finalUserDoc = await getDoc(userDocRef);
    const userData = finalUserDoc.data() as DbUser;
    
    useAuthStore.getState().setUser(userData);

    return { token, user: userData };
  },

  async logout() {
    if (hasFirebaseCredentials) {
      await signOut(auth);
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(TOKEN_KEY);
    }
    useAuthStore.getState().setUser(null);
  },

  async resendVerificationEmail() {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      return { message: "Verification email resent" };
    }
    throw new Error("No user is currently signed in. Please sign in again to verify your email.");
  },

  getToken() {
    // Note: In a robust app, we'd rely on Firebase's auth state listener (onAuthStateChanged).
    // For synchronous router checks, we rely on the sessionStorage marker.
    return typeof window !== "undefined" ? sessionStorage.getItem(TOKEN_KEY) : null;
  },

  getDashboardRoute(role: Role): string {
    switch (role) {
      case "admin":
        return "/admin";
      case "instructor":
        return "/instructor";
      case "alumni":
        return "/alumni";
      case "partner":
        return "/partner";
      default:
        return "/dashboard";
    }
  },
};
