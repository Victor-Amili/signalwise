// src/pages/Notices.tsx
import { Megaphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData, saveUserData, useContent } from "@/lib/store";

export default function Notices() {
  const { user } = useAuth();
  const { notices } = useContent();
  const read = user ? getUserData(user.email).readNotices : [];

  const open = (id: number) => {
    if (!user) return;
    const data = getUserData(user.email);
    if (!data.readNotices.includes(id)) saveUserData(user.email, { ...data, readNotices: [...data.readNotices, id] });
  };

  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-12 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Announcements</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Notices</h1>
      <div className="mt-10 space-y-4">
        {notices.map((n) => (
          <details key={n.id} onToggle={() => open(n.id)} className="group rounded-[1.5rem] border bg-card p-6">
            <summary className="flex cursor-pointer list-none items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Megaphone className="h-5 w-5" /></span>
              <div className="flex-1">
                <p className="font-display text-lg font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
              {!read.includes(n.id) && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </summary>
            <p className="mt-4 pl-14 text-sm leading-7 text-muted-foreground">{n.body}</p>
          </details>
        ))}
        {notices.length === 0 && <p className="rounded-[1.5rem] border border-dashed p-10 text-center text-sm text-muted-foreground">No notices yet.</p>}
      </div>
    </main>
  );
}