// src/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { useAuth } from "./contexts/AuthContext";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Lesson from "./pages/Lesson";
import NotFound from "./pages/NotFound";
import Notices from "./pages/Notices";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto max-w-3xl px-5 py-20 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") return <Navigate to="/learn" replace />;
  return <Admin />;
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:id" element={<Lesson />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
