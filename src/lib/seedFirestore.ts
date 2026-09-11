import { doc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { seedContent } from "../data/seed";

/**
 * One-time migration of the starter content into Firestore.
 * Run this from the admin dashboard after Firebase Authentication and
 * the first admin user have been configured.
 */
export async function seedFirestore() {
  const batch = writeBatch(db);

  for (const lesson of seedContent.lessons) {
    const { id, ...lessonData } = lesson;
    batch.set(doc(db, "lessons", String(id)), {
      ...lessonData,
      createdAt: new Date().toISOString(),
    });
  }

  for (const tip of seedContent.tips) {
    const { id, ...tipData } = tip;
    batch.set(doc(db, "tips", String(id)), {
      ...tipData,
      lessonId: String(tip.lessonId),
    });
  }

  for (const quiz of seedContent.quizzes) {
    const { id, ...quizData } = quiz;
    batch.set(doc(db, "quizzes", String(id)), {
      ...quizData,
      lessonId: String(quiz.lessonId),
      createdAt: new Date().toISOString(),
    });
  }

  for (const notice of seedContent.notices) {
    const { id, ...noticeData } = notice;
    batch.set(doc(db, "notices", String(id)), noticeData);
  }

  await batch.commit();
}
