// src/pages/Quiz.tsx
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RotateCcw, ShieldCheck, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData, saveUserData, useContent, type QuizResult } from "@/lib/store";

export default function Quiz() {
  const { id } = useParams();
  const quizId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { quizzes, lessons } = useContent();
  const quiz = quizzes.find((q) => q.id === quizId);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  if (!quiz) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back to library</Link>
        <h1 className="mt-8 font-display text-3xl font-semibold">Quiz not found</h1>
      </main>
    );
  }

  const lesson = lessons.find((l) => l.id === quiz.lessonId);

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-5 py-16">
        <div className="rounded-[1.8rem] border bg-card p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary"><ShieldCheck className="h-6 w-6" /></div>
          <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight">Sign in to take this quiz</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Your answers and results are saved to your account.</p>
          <Link to="/auth" className="mt-7 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Sign in / Sign up</Link>
        </div>
      </main>
    );
  }

  const allAnswered = Object.keys(answers).length === quiz.questions.length;

  const handleSubmit = () => {
    const score = quiz.questions.filter((q, i) => answers[i] === q.correct).length;
    const res: QuizResult = {
      quizId: quiz.id, lessonId: quiz.lessonId, title: quiz.title,
      score, total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      date: new Date().toISOString(),
    };
    const data = getUserData(user.email);
    saveUserData(user.email, { ...data, results: [res, ...data.results] });
    setResult(res);
    window.scrollTo({ top: 0 });
  };

  if (result) {
    return (
      <main className="mx-auto max-w-4xl px-5 pb-20 pt-10 lg:px-8 lg:pt-14">
        <section className="mt-4">
          <div className="rounded-[2rem] bg-deep p-8 text-white sm:p-12">
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-deepsoft">Quiz complete</span>
            <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-7xl font-semibold tracking-[-0.08em] text-accent">{result.percentage}<span className="text-3xl">%</span></p>
                <p className="mt-2 text-sm text-white/60">{result.score} correct out of {result.total}</p>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-accent/40"><ShieldCheck className="h-9 w-9 text-accent" /></div>
            </div>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/75">
              {result.percentage >= 80 ? "Strong signal recognition. Keep using these habits when the moment feels urgent." : "You have a useful starting point. Revisit the explanations below and try again when you are ready."}
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {quiz.questions.map((q, index) => (
              <div key={index} className="rounded-[1.5rem] border bg-card p-5">
                <div className="flex gap-4">
                  <div className="mt-0.5">{answers[index] === q.correct ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <XCircle className="h-5 w-5 text-destructive" />}</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Question {index + 1}</p>
                    <p className="mt-2 text-sm font-semibold">{q.prompt}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{q.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => { setResult(null); setAnswers({}); }} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
              <RotateCcw className="h-4 w-4" />Try again
            </button>
            <button onClick={() => navigate("/profile")} className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-secondary-foreground">View quiz history</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 pb-20 pt-10 lg:px-8 lg:pt-14">
      <Link to={lesson ? `/learn/${lesson.id}` : "/learn"} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back to lesson</Link>
      <section className="mt-10">
        <span className="rounded-full bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-secondary-foreground">Signal check</span>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.06em] sm:text-6xl">{quiz.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{quiz.description} Answer each question, then submit for instant feedback.</p>
      </section>
      <div className="mt-12 space-y-5">
        {quiz.questions.map((question, index) => (
          <div key={index} className="rounded-[1.6rem] border bg-card p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Question {String(index + 1).padStart(2, "0")}</p>
              <span className="text-xs font-medium text-muted-foreground">{question.options.length} options</span>
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold leading-snug tracking-[-0.025em]">{question.prompt}</h2>
            <div className="mt-6 grid gap-3">
              {question.options.map((option, oi) => (
                <button key={oi} onClick={() => setAnswers((c) => ({ ...c, [index]: oi }))}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition-all ${
                    answers[index] === oi ? "border-primary bg-secondary text-secondary-foreground shadow-sm" : "bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/50"
                  }`}>
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${answers[index] === oi ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {answers[index] === oi && <CheckCircle2 className="h-3 w-3" />}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={!allAnswered}
        className={`mt-8 rounded-full px-8 py-3.5 text-sm font-semibold ${allAnswered ? "bg-primary text-primary-foreground hover:opacity-90" : "cursor-not-allowed bg-muted text-muted-foreground"}`}>
        {allAnswered ? "Submit answers" : `Answer all questions (${Object.keys(answers).length}/${quiz.questions.length})`}
      </button>
    </main>
  );
}