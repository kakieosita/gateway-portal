import { create } from "zustand";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "alumni" | "partner" | "student" | "instructor";

export interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

async function loadProfile(userId: string, email: string): Promise<AppUser | null> {
  const [{ data: profile }, { data: roleRow }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId).limit(1).maybeSingle(),
  ]);

  return {
    id: userId,
    email: profile?.email ?? email,
    displayName: profile?.display_name ?? null,
    photoURL: profile?.photo_url ?? null,
    role: (roleRow?.role as UserRole) ?? "student",
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  supabaseUser: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  initialize: () => {
    if (get().initialized) return;
    set({ initialized: true });

    // Listener first, then session check
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, supabaseUser: session?.user ?? null });
      if (session?.user) {
        // Defer Supabase calls to avoid deadlock in callback
        setTimeout(async () => {
          const appUser = await loadProfile(session.user.id, session.user.email ?? "");
          set({ user: appUser, loading: false });
        }, 0);
      } else {
        set({ user: null, loading: false });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, supabaseUser: session?.user ?? null });
      if (!session) set({ loading: false });
    });
  },
}));
