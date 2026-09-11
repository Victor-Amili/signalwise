// src/pages/Learn.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Search, ShieldAlert, Sparkles } from "lucide-react";
import { useContent } from "../lib/store";

export default function Learn() {
  const { lessons, tips } = useContent();
  const [query, setQuery] = useState("");
  const published = lessons.filter((l) => l.published);
  const filtered = useMemo(() => published.filter((l) => `${l.title} ${l.category} ${l.summary}`.toLowerCase().includes(query.toLowerCase())), [published, query]);

  return (
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-12 lg:px-8 lg:pt-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_.5fr] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Your learning library</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-[-0.06em] sm:text-6xl">
            Learn the signal.<br /><span className="text-primary">Keep the habit.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">Short, focused modules for the decisions you make every day: opening an email, choosing a password, sharing a post, or connecting to a network.</p>
        </div>
        <div className="rounded-[1.6rem] border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary"><Sparkles className="h-5 w-5" /></div>
            <div><p className="font-display text-sm font-semibold">A simple rhythm</p><p className="mt-1 text-xs text-muted-foreground">Read → notice → practise</p></div>
          </div>
        </div>
      </section>

      <section className="mt-14 flex flex-col gap-4 border-y py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold"><BookOpen className="h-4 w-4 text-primary" />{published.length} guided modules</div>
        <label className="flex items-center gap-3 rounded-full border bg-card px-4 py-2.5 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a topic" className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60" />
        </label>
      </section>

      <section className="mt-10">
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((lesson, index) => (
            <Link key={lesson.id} to={`/learn/${lesson.id}`} className="group">
              <div className="h-full rounded-[1.6rem] border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-secondary-foreground">{String(index + 1).padStart(2, "0")} / module</span>
                    <h3 className="mt-5 max-w-md font-display text-2xl leading-tight tracking-[-0.035em]">{lesson.title}</h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
                <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{lesson.estimatedMinutes} minutes</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span className="text-primary">{lesson.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="rounded-[1.6rem] border border-dashed bg-card/60 px-6 py-14 text-center">
            <Search className="mx-auto h-7 w-7 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-semibold">No topic found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try a different phrase or clear the search.</p>
          </div>
        )}
      </section>

      <section className="mt-20 grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-[1.8rem] bg-deep p-7 text-white sm:p-9">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><ShieldAlert className="h-5 w-5" /></div>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-deepsoft">Quick reminders</p>
          <h2 className="mt-4 max-w-sm font-display text-3xl font-semibold tracking-[-0.04em]">Small moves. Less exposure.</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">Keep the basics close when the day gets busy.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {tips.slice(0, 4).map((tip) => (
            <div key={tip.id} className="rounded-[1.5rem] border bg-card p-6">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{tip.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}