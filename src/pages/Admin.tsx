// src/pages/Admin.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Database,
  Eye,
  EyeOff,
  Megaphone,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  useContent,
  addLesson,
  updateLesson,
  deleteLesson,
  addQuiz,
  deleteQuiz,
  addNotice,
  deleteNotice,
  type Lesson,
} from "../lib/store";
import { seedFirestore } from "../lib/seedFirestore";

const emptyForm = {
  title: "",
  category: "",
  summary: "",
  estimatedMinutes: "5",
  content: "",
};

const emptyQuestion = () => ({
  prompt: "",
  options: ["", "", "", ""],
  correct: 0,
  explanation: "",
});

export default function Admin() {
  const { lessons, quizzes, notices, tips } = useContent();
  const [tab, setTab] = useState<"topics" | "quizzes" | "notices">("topics");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [busy, setBusy] = useState(false);

  const submitTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      const payload = {
        title: form.title.trim(),
        category: form.category.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        estimatedMinutes: Number(form.estimatedMinutes) || 5,
      };

      if (editing) await updateLesson(editing.id, payload);
      else await addLesson(payload);

      setForm(emptyForm);
      setEditing(null);
    } catch (error) {
      console.error("Could not save topic:", error);
      alert("Could not save the topic. Check the browser console and Firebase rules.");
    } finally {
      setBusy(false);
    }
  };

  const updateQuestion = (
    questionIndex: number,
    field: "prompt" | "correct" | "explanation",
    value: string | number
  ) => {
    setQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex ? { ...question, [field]: value } : question
      )
    );
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex) return question;

        const options = [...question.options];
        options[optionIndex] = value;

        return { ...question, options };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, emptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions((current) => current.filter((_, i) => i !== index));
  };

  const resetQuizForm = () => {
    setSelectedLessonId("");
    setQuizTitle("");
    setQuizDescription("");
    setQuestions([emptyQuestion()]);
  };

  const submitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLessonId) {
      alert("Please select a topic.");
      return;
    }

    if (!quizTitle.trim()) {
      alert("Please enter a quiz title.");
      return;
    }

    for (const [index, question] of questions.entries()) {
      if (!question.prompt.trim()) {
        alert(`Question ${index + 1} needs a question.`);
        return;
      }

      if (question.options.some((option) => !option.trim())) {
        alert(`Question ${index + 1} needs all four options.`);
        return;
      }

      if (!question.explanation.trim()) {
        alert(`Question ${index + 1} needs an explanation.`);
        return;
      }
    }

    setBusy(true);

    try {
      await addQuiz({
        lessonId: selectedLessonId,
        title: quizTitle.trim(),
        description: quizDescription.trim(),
        questions: questions.map((question) => ({
          prompt: question.prompt.trim(),
          options: question.options.map((option) => option.trim()),
          correct: question.correct,
          explanation: question.explanation.trim(),
        })),
      });

      alert("Quiz created successfully.");
      resetQuizForm();
    } catch (error) {
      console.error("Could not create quiz:", error);
      alert("Could not save the quiz. Check the browser console and Firebase rules.");
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60";

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 lg:px-8">
      <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" />Back to site
      </Link>

      <h1 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em]">Admin dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Topics", value: lessons.length },
          { label: "Published", value: lessons.filter((l) => l.published).length },
          { label: "Quizzes", value: quizzes.length },
          { label: "Notices", value: notices.length },
        ].map((s) => (
          <div key={s.label} className="rounded-[1.4rem] border bg-card p-5">
            <p className="font-display text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {(["topics", "quizzes", "notices"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold capitalize ${tab === t ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "topics" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.9fr]">
          <div className="space-y-3">
            {lessons.map((l) => (
              <div key={l.id} className="flex flex-wrap items-center gap-3 rounded-[1.4rem] border bg-card p-5">
                <BookOpen className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.category} · {l.estimatedMinutes} min · {tips.filter((t) => t.lessonId === l.id).length} tips
                  </p>
                </div>
                {!l.published && <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Draft</span>}
                <div className="flex gap-1">
                  <button
                    onClick={async () => {
                      try {
                        await updateLesson(l.id, { published: !l.published });
                      } catch (error) {
                        console.error(error);
                        alert("Could not change publication status.");
                      }
                    }}
                    title={l.published ? "Unpublish" : "Publish"}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  >
                    {l.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => {
                      setEditing(l);
                      setForm({
                        title: l.title,
                        category: l.category,
                        summary: l.summary,
                        estimatedMinutes: String(l.estimatedMinutes),
                        content: l.content,
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${l.title}"? Its quiz and tips will also be removed.`)) return;

                      try {
                        await deleteLesson(l.id);
                      } catch (error) {
                        console.error(error);
                        alert("Could not delete the topic.");
                      }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {lessons.length === 0 && (
              <div className="rounded-[1.5rem] border border-dashed p-10 text-center text-sm text-muted-foreground">
                No topics in Firestore yet.
              </div>
            )}
          </div>

          <form onSubmit={submitTopic} className="h-fit space-y-4 rounded-[1.6rem] border bg-card p-6 lg:sticky lg:top-28">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              {editing ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              {editing ? "Edit topic" : "Add a new topic"}
            </h2>

            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Topic title" className={input} />
            <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (e.g. Password security)" className={input} />
            <input required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Short summary" className={input} />
            <input type="number" min={1} value={form.estimatedMinutes} onChange={(e) => setForm({ ...form, estimatedMinutes: e.target.value })} placeholder="Estimated minutes" className={input} />
            <textarea required rows={7} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Lesson content…" className={input} />

            <div className="flex gap-2">
              <button type="submit" disabled={busy} className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                {busy ? "Saving…" : editing ? "Save changes" : "Add topic"}
              </button>

              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }} className="rounded-full border border-border px-5 text-sm font-semibold text-muted-foreground">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {tab === "quizzes" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.95fr]">
          <div className="space-y-3">
            {quizzes.map((quiz) => {
              const lesson = lessons.find((l) => l.id === quiz.lessonId);

              return (
                <div key={quiz.id} className="rounded-[1.4rem] border bg-card p-5">
                  <div className="flex items-start gap-4">
                    <ClipboardList className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{quiz.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{lesson?.title ?? "Unknown topic"}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{quiz.questions.length} questions</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete "${quiz.title}"?`)) return;

                        try {
                          await deleteQuiz(quiz.id);
                        } catch (error) {
                          console.error(error);
                          alert("Could not delete the quiz.");
                        }
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {quizzes.length === 0 && (
              <div className="rounded-[1.5rem] border border-dashed p-10 text-center text-sm text-muted-foreground">
                No quizzes in Firestore yet.
              </div>
            )}

            <div className="rounded-[1.5rem] border border-dashed bg-card p-5">
              <div className="flex items-start gap-3">
                <Database className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Import the starter content</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    This copies the existing sample lessons, tips, quizzes and notices from seed.ts into Firestore. Use it once on your empty database.
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      if (!confirm("Import the starter content into Firestore? Existing documents with IDs 1–7 will be overwritten.")) return;

                      setBusy(true);
                      try {
                        await seedFirestore();
                        alert("Starter content imported successfully.");
                      } catch (error) {
                        console.error("Seed failed:", error);
                        alert("Import failed. Make sure you are signed in as an admin and your Firestore rules allow admin writes.");
                      } finally {
                        setBusy(false);
                      }
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
                  >
                    <Database className="h-4 w-4" />
                    {busy ? "Importing…" : "Import starter content"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={submitQuiz} className="h-fit space-y-5 rounded-[1.6rem] border bg-card p-6 lg:sticky lg:top-28">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <ClipboardList className="h-5 w-5 text-primary" />
                Create a quiz
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Attach the quiz to one existing topic.</p>
            </div>

            <select required value={selectedLessonId} onChange={(e) => setSelectedLessonId(e.target.value)} className={input}>
              <option value="">Select a topic</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
              ))}
            </select>

            <input required value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Quiz title" className={input} />

            <textarea required value={quizDescription} onChange={(e) => setQuizDescription(e.target.value)} placeholder="Quiz description" rows={3} className={input} />

            <div className="space-y-5">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="rounded-[1.3rem] border p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Question {questionIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(questionIndex)} className="text-destructive" title="Remove question">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <textarea
                    required
                    value={question.prompt}
                    onChange={(e) => updateQuestion(questionIndex, "prompt", e.target.value)}
                    placeholder="Question"
                    rows={3}
                    className={`${input} mt-4`}
                  />

                  <div className="mt-4 space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <span className="w-6 text-xs font-semibold text-muted-foreground">{String.fromCharCode(65 + optionIndex)}</span>
                        <input
                          required
                          value={option}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          className={input}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label className="text-xs font-semibold text-muted-foreground">Correct answer</label>
                    <select
                      value={question.correct}
                      onChange={(e) => updateQuestion(questionIndex, "correct", Number(e.target.value))}
                      className={`${input} mt-2`}
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>

                  <textarea
                    required
                    value={question.explanation}
                    onChange={(e) => updateQuestion(questionIndex, "explanation", e.target.value)}
                    placeholder="Explanation shown after the quiz"
                    rows={3}
                    className={`${input} mt-4`}
                  />
                </div>
              ))}
            </div>

            <button type="button" onClick={addQuestion} className="w-full rounded-full border border-border py-3 text-sm font-semibold hover:bg-secondary">
              + Add another question
            </button>

            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
              <Save className="h-4 w-4" />
              {busy ? "Saving…" : "Save quiz"}
            </button>
          </form>
        </div>
      )}

      {tab === "notices" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.9fr]">
          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n.id} className="flex items-center gap-3 rounded-[1.4rem] border bg-card p-5">
                <Megaphone className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                </div>
                <button
                  onClick={async () => {
                    if (!confirm("Delete this notice?")) return;
                    try {
                      await deleteNotice(n.id);
                    } catch (error) {
                      console.error(error);
                      alert("Could not delete the notice.");
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <NoticeForm />
        </div>
      )}
    </main>
  );
}

function NoticeForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;

        setBusy(true);
        try {
          await addNotice(title.trim(), body.trim());
          setTitle("");
          setBody("");
        } catch (error) {
          console.error("Could not create notice:", error);
          alert("Could not publish the notice.");
        } finally {
          setBusy(false);
        }
      }}
      className="h-fit space-y-4 rounded-[1.6rem] border bg-card p-6 lg:sticky lg:top-28"
    >
      <h2 className="font-display text-xl font-semibold">Post a notice</h2>
      <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice title" className="w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
      <textarea required rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Notice body…" className="w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
      <button disabled={busy} type="submit" className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
        {busy ? "Publishing…" : "Publish notice"}
      </button>
    </form>
  );
}
