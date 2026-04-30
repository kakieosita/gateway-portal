import { create } from "zustand";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserRole, User } from "@/lib/db/schema";
import { usersCollection } from "@/lib/db/collections";

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  initialize: () => {
    // Prevent multiple initializations
    if (useAuthStore.getState().initialized) return;

    onAuthStateChanged(auth, async (firebaseUser) => {
      set({ firebaseUser, initialized: true });

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(usersCollection, firebaseUser.uid));
          if (userDoc.exists()) {
            set({ user: userDoc.data() as User, loading: false });
          } else {
            // Handle case where auth user exists but Firestore doc doesn't yet
            // This could happen during signup before the doc is created
            set({ user: null, loading: false });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({ user: null, loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    });
  },
}));
