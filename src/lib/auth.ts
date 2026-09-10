// src/lib/auth.ts
export interface User { name: string; email: string; role: "admin" | "learner"; }

const USERS_KEY = "sw_users";
const SESSION_KEY = "sw_session";

interface StoredUser extends User { pass: string; }

async function hash(pwd: string): Promise<string> {
  if (crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pwd));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return `plain:${pwd}`;
}

function readUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]"); } catch { return []; }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Seed the admin account once (demo credentials — change these)
hash("admin123").then((h) => {
  const users = readUsers();
  if (!users.some((u) => u.email === "admin@signalwise.com")) {
    users.push({ name: "Signalwise Admin", email: "admin@signalwise.com", pass: h, role: "admin" });
    writeUsers(users);
  }
});

export async function signup(name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    return { ok: false, error: "An account with this email already exists." };
  users.push({ name, email, pass: await hash(password), role: "learner" });
  writeUsers(users);
  return { ok: true };
}

export async function login(email: string, password: string): Promise<{ ok: boolean; user?: User; error?: string }> {
  const found = readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!found) return { ok: false, error: "No account found for that email." };
  if (found.pass !== (await hash(password))) return { ok: false, error: "Incorrect password." };
  const user: User = { name: found.name, email: found.email, role: found.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function getSession(): User | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null"); } catch { return null; }
}
export function logout() { localStorage.removeItem(SESSION_KEY); }