// src/pages/Profile.tsx
import { Link } from "react-router-dom";
import { ArrowRight, Award, BookOpen, CheckCircle2, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useContent, useUserData } from "@/lib/store";

export default function Profile() {
  const { user, logout } = useAuth();
  const { lessons, quizzes } = useContent();

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">Sign in to view your profile</h1>
        <Link to="/auth" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Sign in / Sign up</Link>
      </main>
    );
  }

  const data = useUserData(user.uid);
  const published = lessons.filter((l) => l.published);
  const avg = data.results.length ? Math.round(data.results.reduce((s, r) => s + r.percentage, 0) / data.results.length) : 0;

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-12 lg:px-8">
      <section className="flex flex-col gap-6 rounded-[1.8rem] border bg-card p-7 sm:flex-row sm:items-center sm:p-9">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-2xl font-bold text-secondary-foreground">{(user.name || "L").charAt(0).toUpperCase()}</span>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email} · {user.role === "admin" ? "Administrator" : "Learner"}</p>
        </div>
        <button onClick={logout} className="inline-flex items-center gap-2 self-start rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-destructive hover:bg-muted sm:self-center">
          <LogOut className="h-4 w-4" />Log out
        </button>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: BookOpen, label: "Modules completed", value: `${data.completed.length} / ${published.length}` },
          { icon: Award, label: "Quizzes taken", value: String(data.results.length) },
          { icon: ShieldCheck, label: "Average score", value: data.results.length ? `${avg}%` : "—" },
        ].map((s) => (
          <div key={s.label} className="rounded-[1.5rem] border bg-card p-6">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 font-display text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Quiz history</h2>
        {data.results.length === 0 ? (
          <div className="mt-5 rounded-[1.5rem] border border-dashed p-10 text-center text-sm text-muted-foreground">
            No quizzes yet. <Link to="/learn" className="font-semibold text-primary">Pick a topic →</Link>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {data.results.map((r, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem] border bg-card p-5">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()} · {r.score}/{r.total} correct</p>
                  </div>
                </div>
                <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${r.percentage >= 80 ? "bg-secondary text-secondary-foreground" : "bg-accent/20 text-accent-foreground"}`}>{r.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <Link to="/learn" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary">Back to the library <ArrowRight className="h-4 w-4" /></Link>
    </main>
  );
}