// Mock API service layer — swap with real endpoints later.
// All methods simulate network latency and return JWT-ish tokens.

const TOKEN_KEY = "edu_auth_token";

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function fakeJwt(payload: Record<string, unknown>) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
  return `${header}.${body}.mock-signature`;
}

export type Role = "student" | "instructor";

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

export const authApi = {
  async login(input: LoginInput) {
    await delay(900);
    if (input.email === "fail@test.com") {
      throw new Error("Invalid email or password");
    }
    const token = fakeJwt({ sub: input.email, role: "student" });
    sessionStorage.setItem(TOKEN_KEY, token);
    return { token, user: { email: input.email } };
  },

  async signup(input: SignupInput) {
    await delay(1100);
    if (input.email === "taken@test.com") {
      throw new Error("An account with this email already exists");
    }
    const token = fakeJwt({ sub: input.email, role: input.role });
    sessionStorage.setItem(TOKEN_KEY, token);
    return { token, user: { email: input.email, role: input.role } };
  },

  async forgotPassword(email: string) {
    await delay(900);
    return { message: `Reset link sent to ${email}` };
  },

  async resetPassword(_token: string, _password: string) {
    await delay(900);
    return { message: "Password updated" };
  },

  async verifyEmail(code: string) {
    await delay(1200);
    if (code.length !== 6) throw new Error("Invalid verification code");
    return { verified: true };
  },

  async google() {
    await delay(700);
    const token = fakeJwt({ sub: "google-user@example.com", provider: "google" });
    sessionStorage.setItem(TOKEN_KEY, token);
    return { token };
  },

  logout() {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },
};
