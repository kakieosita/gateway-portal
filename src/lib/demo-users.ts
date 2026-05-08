import { User as DbUser } from "./db/schema";

const KEY = "demo_users";

export interface DemoRecord {
  user: DbUser;
  password: string;
}

function read(): DemoRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(records: DemoRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(records));
}

export const demoUserStore = {
  add(user: DbUser, password: string) {
    const records = read().filter((r) => r.user.email.toLowerCase() !== user.email.toLowerCase());
    records.push({ user, password });
    write(records);
  },
  findByEmail(email: string): DemoRecord | undefined {
    const e = email.trim().toLowerCase();
    return read().find((r) => r.user.email.toLowerCase() === e);
  },
  all(): DbUser[] {
    return read().map((r) => r.user);
  },
};
