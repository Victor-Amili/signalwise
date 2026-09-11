import { useSyncExternalStore } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Lesson, Notice, Quiz, Tip } from "../data/seed";

export type { Lesson, Notice, Quiz, Tip };

export interface Content {
  lessons: Lesson[];
  tips: Tip[];
  quizzes: Quiz[];
  notices: Notice[];
}

const emptyContent: Content = {
  lessons: [],
  tips: [],
  quizzes: [],
  notices: [],
};

let cache: Content = emptyContent;
const listeners = new Set<() => void>();
let contentSyncStarted = false;

function notify() {
  listeners.forEach((listener) => listener());
}

export const getContent = () => cache;

export const subscribeContent = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useContent = () =>
  useSyncExternalStore(subscribeContent, getContent, getContent);

function startContentSync() {
  if (contentSyncStarted) return;
  contentSyncStarted = true;

  onSnapshot(
    collection(db, "lessons"),
    (snapshot) => {
      cache = {
        ...cache,
        lessons: snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Lesson[],
      };
      notify();
    },
    (error) => console.error("Signalwise lessons listener failed:", error)
  );

  onSnapshot(
    collection(db, "tips"),
    (snapshot) => {
      cache = {
        ...cache,
        tips: snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Tip[],
      };
      notify();
    },
    (error) => console.error("Signalwise tips listener failed:", error)
  );

  onSnapshot(
    collection(db, "quizzes"),
    (snapshot) => {
      cache = {
        ...cache,
        quizzes: snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Quiz[],
      };
      notify();
    },
    (error) => console.error("Signalwise quizzes listener failed:", error)
  );

  onSnapshot(
    collection(db, "notices"),
    (snapshot) => {
      cache = {
        ...cache,
        notices: snapshot.docs
          .map((item) => {
            const data = item.data();
            return {
              id: item.id,
              ...data,
              createdAt:
                typeof data.createdAt === "string"
                  ? data.createdAt
                  : data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
            };
          })
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) as Notice[],
      };
      notify();
    },
    (error) => console.error("Signalwise notices listener failed:", error)
  );
}

startContentSync();

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "topic";

export async function addLesson(
  input: Omit<Lesson, "id" | "slug" | "published">
) {
  const docRef = await addDoc(collection(db, "lessons"), {
    ...input,
    slug: slugify(input.title),
    published: true,
    createdAt: new Date().toISOString(),
  });

  // Automatically create a notice when a new topic is added.
  await addNotice(
    "New topic added",
    `A new topic, "${input.title}", has been added to the learning library.`
  );

  return docRef.id;
}

export async function updateLesson(id: string, patch: Partial<Lesson>) {
  const lessonRef = doc(db, "lessons", id);

  // Get the existing lesson so we can detect a draft → published change.
  const existingSnapshot = await getDoc(lessonRef);

  if (!existingSnapshot.exists()) {
    throw new Error("Lesson not found.");
  }

  const existingLesson = existingSnapshot.data() as Lesson;

  const { id: _id, ...safePatch } = patch as Partial<Lesson> & {
    id?: string;
  };

  await updateDoc(lessonRef, safePatch);

  // Notify users when an existing draft becomes published.
  if (existingLesson.published === false && patch.published === true) {
    await addNotice(
      "New topic published",
      `A new topic, "${patch.title ?? existingLesson.title}", is now available in the learning library.`
    );
  }
}

export async function deleteLesson(id: string) {
  const batch = writeBatch(db);

  batch.delete(doc(db, "lessons", id));

  const quizSnapshot = await getDocs(query(collection(db, "quizzes"), where("lessonId", "==", id)));
  quizSnapshot.forEach((item) => batch.delete(item.ref));

  const tipSnapshot = await getDocs(query(collection(db, "tips"), where("lessonId", "==", id)));
  tipSnapshot.forEach((item) => batch.delete(item.ref));

  await batch.commit();
}

export async function addQuiz(input: Omit<Quiz, "id">) {
  const docRef = await addDoc(collection(db, "quizzes"), {
    ...input,
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

export async function updateQuiz(id: string, patch: Partial<Quiz>) {
  const { id: _id, ...safePatch } = patch as Partial<Quiz> & { id?: string };
  await updateDoc(doc(db, "quizzes", id), safePatch);
}

export async function deleteQuiz(id: string) {
  await deleteDoc(doc(db, "quizzes", id));
}

export async function addNotice(title: string, body: string) {
  const docRef = await addDoc(collection(db, "notices"), {
    title,
    body,
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

export async function deleteNotice(id: string) {
  await deleteDoc(doc(db, "notices", id));
}

// ---------------- USER PROGRESS ----------------

export interface QuizResult {
  quizId: string;
  lessonId: string;
  title: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export interface UserData {
  completed: string[];
  readNotices: string[];
  results: QuizResult[];
}

const emptyUserData: UserData = {
  completed: [],
  readNotices: [],
  results: [],
};

const userDataCache = new Map<string, UserData>();
const userDataListeners = new Map<string, Set<() => void>>();
const userDataUnsubscribers = new Map<string, () => void>();

function notifyUserData(uid: string) {
  userDataListeners.get(uid)?.forEach((listener) => listener());
}

function subscribeUserData(uid: string, listener: () => void) {
  if (!userDataListeners.has(uid)) userDataListeners.set(uid, new Set());
  userDataListeners.get(uid)!.add(listener);

  return () => {
    const listenersForUser = userDataListeners.get(uid);
    listenersForUser?.delete(listener);
    if (listenersForUser?.size === 0) userDataListeners.delete(uid);
  };
}

function getUserDataSnapshot(uid: string | null) {
  if (!uid) return emptyUserData;
  return userDataCache.get(uid) ?? emptyUserData;
}

export function useUserData(uid: string | null) {
  return useSyncExternalStore(
    (listener) => (uid ? subscribeUserData(uid, listener) : () => undefined),
    () => getUserDataSnapshot(uid),
    () => getUserDataSnapshot(uid)
  );
}

export async function loadUserData(uid: string) {
  if (!userDataUnsubscribers.has(uid)) {
    const unsubscribe = onSnapshot(
      doc(db, "userProgress", uid),
      (snapshot) => {
        const data = snapshot.data();
        userDataCache.set(uid, {
          completed: Array.isArray(data?.completed) ? data.completed : [],
          readNotices: Array.isArray(data?.readNotices) ? data.readNotices : [],
          results: Array.isArray(data?.results) ? data.results : [],
        });
        notifyUserData(uid);
      },
      (error) => console.error("Signalwise user progress listener failed:", error)
    );

    userDataUnsubscribers.set(uid, unsubscribe);
  }

  const snapshot = await getDoc(doc(db, "userProgress", uid));
  if (!snapshot.exists()) {
    await setDoc(doc(db, "userProgress", uid), {
      ...emptyUserData,
      updatedAt: new Date().toISOString(),
    });
    userDataCache.set(uid, emptyUserData);
    notifyUserData(uid);
  }

  return getUserDataSnapshot(uid);
}

export function getUserData(uid: string): UserData {
  return userDataCache.get(uid) ?? emptyUserData;
}

export async function saveUserData(uid: string, data: UserData) {
  userDataCache.set(uid, data);
  notifyUserData(uid);

  await setDoc(
    doc(db, "userProgress", uid),
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
