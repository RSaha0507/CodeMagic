import { AppShell, useSession } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { pagePaths } from '@/lib/routes';

function DashboardContent() {
  const { currentUser, isSessionLoading, openAuth } = useSession();

  if (isSessionLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-zinc-400 sm:px-6 lg:px-8">Loading your workspace...</div>;
  }

  if (!currentUser) {
    return <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6"><section className="dashboard-access"><p className="landing-eyebrow">Private workspace</p><h1>Sign in to open your dashboard.</h1><p>Your progress and practice history are available after you sign in.</p><Button onClick={openAuth}>Sign in</Button></section></div>;
  }

  const solvedCount = currentUser.solvedProblemIds.length;
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
    <section className="dashboard-hero">
      <div><p className="landing-eyebrow">Personal dashboard</p><h1>Welcome back, {currentUser.name}.</h1><p>Choose a focused next step and keep your technical practice moving.</p></div>
      <Button asChild><a href={pagePaths.problems}>Continue practice</a></Button>
    </section>
    <section className="grid gap-4 md:grid-cols-3" aria-label="Progress summary">
      <article className="dashboard-stat"><span>Problems solved</span><strong>{solvedCount}</strong><p>Across your active practice set.</p></article>
      <article className="dashboard-stat"><span>Practice score</span><strong>{currentUser.score}</strong><p>Earned from verified work.</p></article>
      <article className="dashboard-stat"><span>Next destination</span><strong className="text-2xl">Problem library</strong><p>Filter by topic or choose a daily problem.</p></article>
    </section>
    <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <article className="dashboard-panel"><span className="landing-eyebrow">Recommended next</span><h2>Choose your next practice session.</h2><p>Use the catalog to work through problems deliberately, or open the visual roadmap before starting a new pattern.</p><div className="flex flex-wrap gap-3"><Button asChild><a href={pagePaths.problems}>Open problems</a></Button><Button asChild variant="outline"><a href={pagePaths.roadmap}>Explore roadmap</a></Button></div></article>
      <article className="dashboard-panel"><span className="landing-eyebrow">Your activity</span><h2>{solvedCount ? 'Progress is recorded.' : 'Your first solution starts here.'}</h2><p>{solvedCount ? `You have completed ${solvedCount} problem${solvedCount === 1 ? '' : 's'}. Keep the next task narrow and intentional.` : 'Open a problem, review its constraints, and use the workspace to establish your baseline.'}</p><a href={pagePaths.submissions}>View submission history</a></article>
    </section>
  </div>;
}

export default function DashboardPage() {
  return <AppShell currentPage="dashboard"><DashboardContent /></AppShell>;
}
