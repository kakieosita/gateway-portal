import { create } from "zustand";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/lib/db/schema";

interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
}

async function buildAppUser(su: SupabaseUser): Promise<User> {
  let role: UserRole = (su.user_metadata?.role as UserRole) ?? "student";
  let displayName: string | null =
    (su.user_metadata?.display_name as string) ??
    (su.user_metadata?.full_name as string) ??
    su.email ??
    null;
  let photoURL: string | null = (su.user_metadata?.avatar_url as string) ?? null;
  let bio: string | undefined;
  let phoneNumber: string | undefined;
  let createdAt = su.created_at ?? new Date().toISOString();
  let updatedAt = new Date().toISOString();

  try {
    const [{ data: profile }, { data: roleRow }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", su.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", su.id).maybeSingle(),
    ]);
    if (profile) {
      displayName = profile.display_name ?? displayName;
      photoURL = (profile as any).photo_url ?? (profile as any).avatar_url ?? photoURL;
      bio = (profile as any).bio ?? undefined;
      phoneNumber = (profile as any).phone_number ?? undefined;
      createdAt = (profile as any).created_at ?? createdAt;
      updatedAt = (profile as any).updated_at ?? updatedAt;
    }
    if (roleRow?.role) role = roleRow.role as UserRole;
  } catch (e) {
    console.warn("buildAppUser: profile/role fetch failed, using metadata", e);
  }

  return {
    id: su.id,
    email: su.email ?? "",
    displayName,
    photoURL,
    role,
    createdAt,
    updatedAt,
    bio,
    phoneNumber,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  supabaseUser: null,
  session: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),

  initialize: () => {
    if (useAuthStore.getState().initialized) return;
    set({ initialized: true });

    // Listen first to avoid missing events
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({ supabaseUser: session.user, session, loading: true });
        // Defer to avoid deadlock inside the callback
        setTimeout(async () => {
          const appUser = await buildAppUser(session.user);
          set({ user: appUser, loading: false });
        }, 0);
      } else {
        set({ user: null, supabaseUser: null, session: null, loading: false });
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await buildAppUser(session.user);
        set({ user: appUser, supabaseUser: session.user, session, loading: false });
      } else {
        set({ loading: false });
      }
    });
  },
}));
