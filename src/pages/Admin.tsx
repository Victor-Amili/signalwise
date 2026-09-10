// src/pages/Admin.tsx — add/edit/publish/delete topics + notices
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Eye, EyeOff, Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
import { useContent, addLesson, updateLesson, deleteLesson, addNotice, deleteNotice, type Lesson } from "@/lib/store";

const emptyForm = { title: "", category: "", summary: "", estimatedMinutes: "5", content: "" };

export default function Admin() {
  const { lessons, quizzes, notices, tips } = useContent();
  const [tab, setTab] = useState<"topics" | "notices">("topics");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Lesson | null>(null);

  const submitTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title, category: form.category, summary: form.summary,
      content: form.content, estimatedMinutes: Number(form.estimatedMinutes) || 5,
    };
    if (editing) updateLesson(editing.id, payload);
    else addLesson(payload);
    setForm(emptyForm);
    setEditing(null);
  };

  const input = "w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60";

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 lg:px-8">
      <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back to site</Link>
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

      <div className="mt-10 flex gap-2">
        {(["topics", "notices"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold capitalize ${tab === t ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"}`}>
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
                  <p className="text-xs text-muted-foreground">{l.category} · {l.estimatedMinutes} min · {tips.filter((t) => t.lessonId === l.id).length} tips</p>
                </div>
                {!l.published && <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Draft</span>}
                <div className="flex gap-1">
                  <button onClick={() => updateLesson(l.id, { published: !l.published })} title={l.published ? "Unpublish" : "Publish"}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-secondary-foreground">
                    {l.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button onClick={() => { setEditing(l); setForm({ title: l.title, category: l.category, summary: l.summary, estimatedMinutes: String(l.estimatedMinutes), content: l.content }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-secondary-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${l.title}"? Its quiz and tips will also be removed.`)) deleteLesson(l.id); }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
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
              <button type="submit" className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                {editing ? "Save changes" : "Add topic"}
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
                <button onClick={() => { if (confirm("Delete this notice?")) deleteNotice(n.id); }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-destructive hover:bg-destructive/10">
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
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!title.trim() || !body.trim()) return; addNotice(title, body); setTitle(""); setBody(""); }}
      className="h-fit space-y-4 rounded-[1.6rem] border bg-card p-6 lg:sticky lg:top-28">
      <h2 className="font-display text-xl font-semibold">Post a notice</h2>
      <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice title"
        className="w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
      <textarea required rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Notice body…"
        className="w-full rounded-2xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
      <button type="submit" className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Publish notice</button>
    </form>
  );
}