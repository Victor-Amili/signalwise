// src/pages/Auth.tsx — NEW: signup finally exists
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "signup") {
      if (!name.trim()) return setError("Please enter your name.");
      if (password.length < 6) return setError("Password must be at least 6 characters.");
      if (password !== confirm) return setError("Passwords do not match.");
    }
    setBusy(true);
    const res = mode === "login" ? await login(email, password) : await signup(name, email, password);
    setBusy(false);
    if (!res.ok) return setError(res.error ?? "Something went wrong.");
    if (mode === "signup") {
      const l = await login(email, password);
      if (!l.ok) return setError(l.error ?? "Account created — please sign in.");
    }
    navigate("/learn");
  };

  const input = "w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60";

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-[1.8rem] border bg-card p-8 shadow-xl shadow-primary/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary"><ShieldCheck className="h-6 w-6" /></div>
        <h1 className="mt-6 text-center font-display text-2xl font-semibold tracking-tight">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "login" ? "Sign in to save your progress and quiz history." : "Sign up to track your learning trail."}
        </p>

        <div className="mt-7 grid grid-cols-2 rounded-full bg-muted p-1 text-sm font-semibold">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              className={`rounded-full py-2.5 transition-colors ${mode === m ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}>
              {m === "login" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={input} />}
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={input} />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={input} />
          {mode === "signup" && <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" className={input} />}
          {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          Demo build — accounts are stored locally in your browser only.
        </p>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/learn" className="font-semibold text-primary">Continue without an account →</Link>
      </p>
    </main>
  );
}