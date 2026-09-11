// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  login as doLogin,
  loginWithGoogle as doGoogleLogin,
  logout as doLogout,
  signup as doSignup,
  watchAuthState,
  type User,
} from "../lib/auth";
import { loadUserData } from "../lib/store";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>(null as never);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = watchAuthState(
      async (nextUser) => {
        setUser(nextUser);

        if (nextUser) {
          try {
            await loadUserData(nextUser.uid);
          } catch (error) {
            console.error("Could not load user progress:", error);
          }
        }

        setLoading(false);
      },
      (error) => {
        console.error("Firebase auth state error:", error);
        setUser(null);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login: async (email, password) => {
          const res = await doLogin(email, password);
          if (res.ok && res.user) {
            setUser(res.user);
            await loadUserData(res.user.uid);
          }
          return res;
        },

        signup: async (name, email, password) => {
          const res = await doSignup(name, email, password);
          if (res.ok && res.user) {
            setUser(res.user);
            await loadUserData(res.user.uid);
          }
          return res;
        },

        loginWithGoogle: async () => {
          const res = await doGoogleLogin();
          if (res.ok && res.user) {
            setUser(res.user);
            await loadUserData(res.user.uid);
          }
          return res;
        },

        logout: async () => {
          await doLogout();
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
