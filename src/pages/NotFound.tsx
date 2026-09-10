// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Page not found</h1>
      <p className="mt-4 text-muted-foreground">This page moved or never existed.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground">Back home</Link>
    </main>
  );
}