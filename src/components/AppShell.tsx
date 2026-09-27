import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AuthModal } from './AuthModal';
import { CreateProblemModal } from './CreateProblemModal';
import { Navbar } from './Navbar';
import { pagePaths, type PageName } from '@/lib/routes';
import type { User } from '@/types';

interface SessionState {
  currentUser: User | null;
  csrfToken: string | null;
  isSessionLoading: boolean;
  refreshProfile: () => Promise<void>;
  openAuth: () => void;
}

const SessionContext = createContext<SessionState | null>(null);

export function useSession(): SessionState {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used inside AppShell.');
  return session;
}

interface AppShellProps {
  currentPage: PageName;
  children: ReactNode;
}

export function AppShell({ currentPage, children }: AppShellProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateProblemOpen, setIsCreateProblemOpen] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'same-origin' });
      if (!response.ok) return;
      const data = await response.json();
      setCurrentUser(data.user);
      setCsrfToken(data.csrfToken);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSessionLoading(false);
    }
  };

  useEffect(() => {
    void refreshProfile();
  }, []);

  const handleLogout = async () => {
    try {
      if (csrfToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'X-CSRF-Token': csrfToken },
        });
      }
    } finally {
      setCurrentUser(null);
      setCsrfToken(null);
    }
  };

  return (
    <SessionContext.Provider value={{ currentUser, csrfToken, isSessionLoading, refreshProfile, openAuth: () => setIsAuthOpen(true) }}>
      <div className="app-shell flex min-h-screen flex-col bg-background text-foreground">
        <Navbar
          currentPage={currentPage}
          currentUser={currentUser}
          solvedCount={currentUser?.solvedProblemIds.length ?? 0}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenCreateProblem={() => currentUser && csrfToken ? setIsCreateProblemOpen(true) : setIsAuthOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 bg-zinc-950 py-5 text-xs text-zinc-500">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
            <a href={pagePaths.home} className="footer-brand" aria-label="CodeMagic home">
              <span className="footer-brand-mark" aria-hidden="true"><img src="/brand/codemagic-official.png" alt="" /></span>
              <span><strong className="block text-sm text-zinc-200">CodeMagic</strong><span>Visual coding practice platform. 2026.</span></span>
            </a>
            <nav className="flex items-center gap-4" aria-label="Footer navigation">
              <a href={pagePaths.roadmap} className="hover:text-zinc-200">Roadmap</a>
              <a href={pagePaths.problems} className="hover:text-zinc-200">Problems</a>
              <a href={pagePaths.leaderboard} className="hover:text-zinc-200">Rankings</a>
            </nav>
          </div>
        </footer>
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user, token) => {
            setCurrentUser(user);
            setCsrfToken(token);
            window.location.assign(pagePaths.dashboard);
          }}
        />
        <CreateProblemModal
          isOpen={isCreateProblemOpen}
          onClose={() => setIsCreateProblemOpen(false)}
          onProblemCreated={() => window.location.assign(pagePaths.problems)}
          csrfToken={csrfToken}
        />
      </div>
    </SessionContext.Provider>
  );
}
