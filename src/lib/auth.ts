// src/lib/auth.ts
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "learner";
}

function friendlyError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export async function getUserProfile(firebaseUser: FirebaseUser): Promise<User> {
  const userRef = doc(db, "users", firebaseUser.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    return {
      uid: firebaseUser.uid,
      name: String(data.name ?? firebaseUser.displayName ?? "Learner"),
      email: firebaseUser.email ?? "",
      role: data.role === "admin" ? "admin" : "learner",
    };
  }

  const profile: User = {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName ?? "Learner",
    email: firebaseUser.email ?? "",
    role: "learner",
  };

  await setDoc(userRef, {
    name: profile.name,
    email: profile.email,
    role: profile.role,
    createdAt: new Date().toISOString(),
  });

  return profile;
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const profile: User = {
      uid: credential.user.uid,
      name: name.trim(),
      email: credential.user.email ?? email.trim(),
      role: "learner",
    };

    await setDoc(doc(db, "users", credential.user.uid), {
      name: profile.name,
      email: profile.email,
      role: profile.role,
      createdAt: new Date().toISOString(),
    });

    return { ok: true, user: profile };
  } catch (error) {
    console.error("Signup failed:", error);
    return { ok: false, error: friendlyError(error) };
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = await getUserProfile(credential.user);
    return { ok: true, user };
  } catch (error) {
    console.error("Login failed:", error);
    return { ok: false, error: friendlyError(error) };
  }
}

export async function loginWithGoogle(): Promise<{
  ok: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const credential = await signInWithPopup(auth, provider);
    const user = await getUserProfile(credential.user);

    return { ok: true, user };
  } catch (error) {
    console.error("Google login failed:", error);
    return { ok: false, error: friendlyError(error) };
  }
}

export async function logout() {
  await signOut(auth);
}

export function watchAuthState(
  callback: (user: User | null) => void,
  onError?: (error: unknown) => void
) {
  return onAuthStateChanged(
    auth,
    async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      try {
        const user = await getUserProfile(firebaseUser);
        callback(user);
      } catch (error) {
        console.error("Could not load user profile:", error);
        onError?.(error);
        callback(null);
      }
    },
    onError
  );
}
