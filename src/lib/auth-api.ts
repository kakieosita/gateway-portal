import { supabase } from "@/integrations/supabase/client";

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

async function fetchUserRole(userId: string, fallback: Role = "student"): Promise<Role> {
  // Retry briefly to handle transient PGRST002/503 schema cache errors
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    if (!error) return (data?.role as Role) ?? fallback;
    await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
  }
  return fallback;
}

export const authApi = {
  async login(input: LoginInput) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Login failed");

    const role = await fetchUserRole(data.user.id);
    return {
      token: data.session?.access_token ?? "",
      user: { email: data.user.email, role },
    };
  },

  async signup(input: SignupInput) {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: input.fullName,
          full_name: input.fullName,
          role: input.role,
        },
      },
    });
    if (error) throw new Error(error.message);

    return {
      token: data.session?.access_token ?? "",
      user: { email: input.email, role: input.role },
    };
  },

  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
    return { message: `Reset link sent to ${email}` };
  },

  async resetPassword(_actionCode: string, password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
    return { message: "Password updated" };
  },

  async verifyEmail(_actionCode: string) {
    // Supabase verifies email via the link itself; nothing to do here.
    return { verified: true };
  },

  async resendVerification(email: string) {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(error.message);
    return { message: `Verification link resent to ${email}` };
  },

  async checkVerified() {
    const { data } = await supabase.auth.getUser();
    return Boolean(data.user?.email_confirmed_at);
  },

  async google() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(error.message);
    // OAuth redirects away; this return is rarely reached.
    return { token: "", user: { email: null, role: "student" as Role }, redirect: data.url };
  },

  async logout() {
    await supabase.auth.signOut();
  },

  getToken() {
    return null;
  },
};
