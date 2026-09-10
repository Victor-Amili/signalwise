// src/pages/Lesson.tsx
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData, saveUserData, useContent } from "@/lib/store";

export default function Lesson() {
  const { id } = useParams();
  const lessonId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lessons, tips, quizzes } = useContent();
  const lesson = lessons.find((l) => l.id === lessonId && l.published);
  const [data, setData] = useState(user ? getUserData(user.email) : null);

  if (!lesson) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back to library</Link>
        <h1 className="mt-8 font-display text-3xl font-semibold">We could not find that module</h1>
        <p className="mt-3 text-muted-foreground">Return to the library and choose another topic.</p>
      </main>
    );
  }

  const quiz = quizzes.find((q) => q.lessonId === lesson.id);
  const lessonTips = tips.filter((t) => t.lessonId === lesson.id);
  const completed = data?.completed.includes(lesson.id) ?? false;

  const markComplete = () => {
    if (!user || !data) return navigate("/auth");
    const next = { ...data, completed: completed ? data.completed.filter((c) => c !== lesson.id) : [...data.completed, lesson.id] };
    saveUserData(user.email, next);
    setData(next);
  };

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 lg:px-8 lg:pt-14">
      <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back to library</Link>

      <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <span className="rounded-full bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-secondary-foreground">{lesson.category}</span>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.06em] sm:text-6xl">{lesson.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{lesson.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{lesson.estimatedMinutes} min read</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5 text-primary">{completed && <><CheckCircle2 className="h-4 w-4" />Completed</>}</span>
          </div>
        </div>
        <div className="rounded-[1.6rem] bg-deep p-6 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Sparkles className="h-5 w-5" /></div>
            <div><p className="font-display text-sm font-semibold">One useful outcome</p><p className="mt-1 text-xs text-deepsoft">Leave with a repeatable habit</p></div>
          </div>
          <p className="mt-8 text-sm leading-6 text-white/70">Read the signal, slow the moment down, and make the safer choice feel automatic.</p>
        </div>
      </section>

      <section className="mt-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <article className="max-w-3xl">
          <p className="whitespace-pre-line text-lg leading-9">{lesson.content}</p>
          <div className="mt-12 rounded-[1.7rem] border border-primary/25 bg-secondary p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">Remember this</p>
            <p className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.035em] text-secondary-foreground">When a digital request creates pressure, make verification your first response.</p>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button onClick={markComplete} className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${completed ? "border border-border bg-card" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
              <CheckCircle2 className="h-4 w-4" />{completed ? "Completed — undo" : "Mark as complete"}
            </button>
            {quiz && (
              <Link to={`/quiz/${quiz.id}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary">
                Take the quiz <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </article>
        <aside>
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">Quick safety tips</p>
            <div className="mt-4 space-y-3">
              {lessonTips.map((tip) => (
                <div key={tip.id} className="rounded-[1.4rem] border bg-card p-5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <h3 className="mt-3 font-display text-base font-semibold">{tip.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}