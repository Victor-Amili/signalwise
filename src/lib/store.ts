import { useSyncExternalStore } from "react";
import { seedContent, type Lesson, type Notice, type Quiz } from "@/data/seed";

interface Content { lessons: Lesson[]; tips: import("@/data/seed").Tip[]; quizzes: Quiz[]; notices: Notice[]; }

const KEY = "sw_content_v1";
let cache: Content = load();
const listeners = new Set<() => void>();

function load(): Content {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
  return structuredClone(seedContent);
}
function persist() {
  localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}
export const getContent = () => cache;
export const subscribeContent = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const useContent = () => useSyncExternalStore(subscribeContent, getContent);

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "topic";
const nextId = (list: { id: number }[]) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1;

export function addLesson(input: Omit<Lesson, "id" | "slug" | "published">) {
  cache.lessons.push({ ...input, id: nextId(cache.lessons), slug: slugify(input.title), published: true });
  persist();
}
export function updateLesson(id: number, patch: Partial<Lesson>) {
  cache.lessons = cache.lessons.map((l) => (l.id === id ? { ...l, ...patch } : l));
  persist();
}
export function deleteLesson(id: number) {
  cache.lessons = cache.lessons.filter((l) => l.id !== id);
  cache.quizzes = cache.quizzes.filter((q) => q.lessonId !== id);
  cache.tips = cache.tips.filter((t) => t.lessonId !== id);
  persist();
}
export function addNotice(title: string, body: string) {
  cache.notices.unshift({ id: nextId(cache.notices), title, body, createdAt: new Date().toISOString() });
  persist();
}
export function deleteNotice(id: number) {
  cache.notices = cache.notices.filter((n) => n.id !== id);
  persist();
}

// ---- per-user data ----
export interface QuizResult { quizId: number; lessonId: number; title: string; score: number; total: number; percentage: number; date: string; }
export interface UserData { completed: number[]; readNotices: number[]; results: QuizResult[]; }
const dataKey = (email: string) => `sw_data_${email}`;
export function getUserData(email: string): UserData {
  try { return JSON.parse(localStorage.getItem(dataKey(email)) ?? "") ?? { completed: [], readNotices: [], results: [] }; }
  catch { return { completed: [], readNotices: [], results: [] }; }
}
export function saveUserData(email: string, data: UserData) {
  localStorage.setItem(dataKey(email), JSON.stringify(data));
}