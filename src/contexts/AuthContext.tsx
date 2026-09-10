// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import { getSession, login as doLogin, logout as doLogout, signup as doSignup, type User } from "@/lib/auth";

const AuthContext = createContext<{ user: User | null; login: (e: string, p: string) => Promise<{ ok: boolean; error?: string }>; signup: (n: string, e: string, p: string) => Promise<{ ok: boolean; error?: string }>; logout: () => void; }>(null as never);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getSession());
  return (
    <AuthContext.Provider value={{
      user,
      login: async (email, password) => {
        const res = await doLogin(email, password);
        if (res.ok && res.user) setUser(res.user);
        return res;
      },
      signup: (name, email, password) => doSignup(name, email, password),
      logout: () => { doLogout(); setUser(null); },
    }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);