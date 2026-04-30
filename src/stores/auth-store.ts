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

  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),

  initialize: () => {
    // Prevent multiple initializations
    if (useAuthStore.getState().initialized) return;

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(usersCollection, firebaseUser.uid));
          if (userDoc.exists()) {
            set({ 
              user: userDoc.data() as User, 
              firebaseUser, 
              initialized: true, 
              loading: false 
            });
          } else {
            // Handle case where auth user exists but Firestore doc doesn't yet
            set({ 
              user: null, 
              firebaseUser, 
              initialized: true, 
              loading: false 
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({ 
            user: null, 
            firebaseUser, 
            initialized: true, 
            loading: false 
            });
        }
      } else {
        set({ 
          user: null, 
          firebaseUser: null, 
          initialized: true, 
          loading: false 
        });
      }
    });
  },
}));
