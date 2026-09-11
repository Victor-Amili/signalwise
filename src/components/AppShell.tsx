import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Bell, LogOut, Menu, Moon, ShieldCheck, Sun, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../lib/store";
import { useUserData } from "../lib/store";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notices } = useContent();
  const data = useUserData(user?.uid ?? null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const unread = user ? notices.filter((n) => !data.readNotices.includes(n.id)).length : 0;

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-primary"}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">signalwise</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/learn" className={linkCls}>Library</NavLink>
            <NavLink to="/notices" className={linkCls}>Notices</NavLink>
            {user?.role === "admin" && <NavLink to="/admin" className={linkCls}>Admin</NavLink>}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-primary">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/notices" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-primary">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />}
                </Link>
                <Link to="/profile" className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 hover:border-primary/40">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    {(user.name || "L").charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-24 truncate text-xs font-semibold lg:block">{user.name}</span>
                </Link>
                <button onClick={() => { logout(); navigate("/"); }} aria-label="Log out"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 md:block">
                Sign in
              </Link>
            )}

            <button onClick={() => setOpen(!open)} aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card md:hidden">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t bg-background px-5 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              <Link to="/learn" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-secondary"><BookOpen className="h-4 w-4" />Library</Link>
              <Link to="/notices" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-secondary"><Bell className="h-4 w-4" />Notices</Link>
              {user?.role === "admin" && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-secondary">Admin</Link>}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-secondary">Profile ({user.name})</Link>
                  <button onClick={() => { logout(); setOpen(false); navigate("/"); }} className="rounded-xl px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-secondary">Log out</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">Sign in / Sign up</Link>
              )}
            </div>
          </nav>
        )}
      </header>
      {children}
    </div>
  );
}