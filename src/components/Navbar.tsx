import type { User } from '@/types';
import { pagePaths, type PageName } from '@/lib/routes';
import { ThemeToggle } from './ThemeToggle';
import { Button, buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  currentPage: PageName;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenCreateProblem: () => void;
  onLogout: () => void;
  solvedCount: number;
}

const publicNavigation: Array<{ id: PageName; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'problems', label: 'Problems' },
  { id: 'roadmap', label: 'Roadmap' },
];

const memberNavigation: Array<{ id: PageName; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'problems', label: 'Problems' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'submissions', label: 'Submissions' },
];

export function Navbar({
  currentPage,
  currentUser,
  onOpenAuth,
  onOpenCreateProblem,
  onLogout,
  solvedCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex min-h-24 max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <a href={pagePaths.home} className="brand-lockup shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400" aria-label="CodeMagic home">
          <span className="brand-mark" aria-hidden="true"><img src="/brand/codemagic-official.png" alt="" /></span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 lg:inline">Practice lab</span>
        </a>
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" aria-label="Primary navigation">
          {(currentUser ? memberNavigation : publicNavigation).map(({ id, label }) => (
            <a
              key={id}
              href={pagePaths[id]}
              aria-current={currentPage === id ? 'page' : undefined}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'tab-button shrink-0',
                currentPage === id && 'nav-active bg-zinc-800 text-zinc-100 hover:bg-zinc-800'
              )}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />
          {currentUser && <Button variant="outline" size="sm" onClick={onOpenCreateProblem} className="hidden sm:inline-flex">Contribute</Button>}
          {currentUser ? (
            <div className="hidden items-center gap-2 text-xs text-zinc-400 md:flex">
              <span>{currentUser.score} points</span>
              <span>{solvedCount} solved</span>
              <Button variant="ghost" size="sm" onClick={onLogout}>Log out</Button>
            </div>
          ) : (
            <Button size="sm" onClick={onOpenAuth}>Sign in</Button>
          )}
        </div>
      </div>
    </header>
  );
}
