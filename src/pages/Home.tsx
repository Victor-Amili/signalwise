// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronRight, Clock3, LockKeyhole, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useContent } from "../lib/store";

const principles = [
  { icon: LockKeyhole, number: "01", title: "Pause and verify", copy: "Build a calm verification habit before you click, reply, or pay." },
  { icon: ShieldCheck, number: "02", title: "Protect access", copy: "Layer strong, unique credentials with multi-factor authentication." },
  { icon: Sparkles, number: "03", title: "Share intentionally", copy: "Treat personal information as valuable and privacy as a daily practice." },
];

export default function Home() {
  const { user } = useAuth();
  const { lessons } = useContent();
  const featured = lessons.filter((l) => l.published).slice(0, 4);

  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-16 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-24">
        <div className="animate-float-in">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />Digital confidence, one habit at a time
          </div>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.04] tracking-[-0.06em] sm:text-6xl lg:text-[5.55rem]">
            Make safer choices in a noisy digital world.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
            Signalwise turns cybersecurity advice into short lessons, practical habits, and quick checks you can actually remember.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/learn" className="inline-flex h-13 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20 hover:opacity-90">
              Explore the library <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a href="#principles" className="inline-flex h-13 items-center justify-center rounded-full border bg-card px-6 text-base font-semibold text-secondary-foreground hover:bg-secondary">
              See the approach <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Beginner-friendly</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Topic-based quizzes</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Free to explore</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] animate-float-in [animation-delay:120ms]">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-accent/40 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative rounded-[2.2rem] border bg-deep p-4 shadow-2xl">
            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-6 text-white sm:p-8">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-deepsoft">
                <span>Signal check</span><span className="font-mono text-accent">01 / 07</span>
              </div>
              <div className="mt-12 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent text-accent-foreground shadow-lg">
                <Zap className="h-9 w-9" />
              </div>
              <h2 className="mt-8 max-w-sm font-display text-3xl font-semibold leading-tight tracking-tight">Would you trust this message?</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">A simple pause can be the difference between a useful update and a convincing trap.</p>
              <div className="mt-8 space-y-3">
                {["Check the sender", "Verify the request", "Protect your codes"].map((s, i) => (
                  <div key={s} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    <span>{s}</span><span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-accent" : "bg-deepsoft"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="principles" className="border-y bg-card/60">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">The signalwise method</p>
              <h2 className="mt-4 max-w-md font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Security is a practice, not a panic button.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">Good security education should feel clear and usable. Each topic starts with the signal, turns it into a decision, and leaves you with one habit worth keeping.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.number} className="rounded-[1.6rem] border bg-background p-6 transition-transform duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <p.icon className="h-6 w-6 text-primary" /><span className="font-mono text-xs text-muted-foreground">{p.number}</span>
                </div>
                <h3 className="mt-12 font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="library" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Learning library</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Know the pattern.<br /><span className="text-primary">Change the outcome.</span>
            </h2>
          </div>
          <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Browse all topics <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {featured.map((lesson, index) => (
            <Link key={lesson.id} to={`/learn/${lesson.id}`} className="group">
              <div className="h-full rounded-[1.6rem] border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-secondary-foreground">0{index + 1} / topic</span>
                    <h3 className="mt-5 max-w-sm font-display text-2xl tracking-[-0.035em]">{lesson.title}</h3>
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
        <div className="mt-16 text-center">
          <Link to={user ? "/learn" : "/auth"} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20 hover:opacity-90">
            {user ? "Continue learning" : "Start learning — it's free"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}