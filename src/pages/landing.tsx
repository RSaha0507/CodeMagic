import { AppShell, useSession } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { pagePaths } from '@/lib/routes';

function LandingContent() {
  const { currentUser, openAuth } = useSession();
  const primaryAction = () => currentUser ? window.location.assign(pagePaths.dashboard) : openAuth();

  return (
    <div className="landing-page">
      <section className="landing-hero mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:px-8 lg:py-20">
        <div className="space-y-7">
          <p className="landing-eyebrow">CodeMagic practice environment</p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">Build the habit of thinking through code.</h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-400">A focused workspace for algorithms, visual walkthroughs, and deliberate technical practice. Learn the pattern, inspect the state, then solve the problem.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={primaryAction}>{currentUser ? 'Open dashboard' : 'Start practicing'}</Button>
            <Button asChild variant="outline" size="lg"><a href={pagePaths.problems}>Browse problems</a></Button>
          </div>
          <dl className="grid max-w-2xl gap-3 sm:grid-cols-3">
            <div><dt>Curated practice</dt><dd>Clear prompts and constraints.</dd></div>
            <div><dt>Visual learning</dt><dd>Step through algorithm state.</dd></div>
            <div><dt>Personal progress</dt><dd>Track work in one place.</dd></div>
          </dl>
        </div>
        <aside className="landing-brand-stage" aria-label="CodeMagic official logo">
          <img src="/brand/codemagic-landing.png" alt="CodeMagic official logo" />
          <p>Focused practice for technical interviews and durable fundamentals.</p>
        </aside>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 md:grid-cols-3 lg:px-8 lg:pb-20">
        <article className="landing-feature"><span>01</span><h2>Study the mechanism</h2><p>Use visualizers to see what each step changes before writing a solution.</p></article>
        <article className="landing-feature"><span>02</span><h2>Practice the pattern</h2><p>Move into concise problem statements with relevant topics and difficulty filters.</p></article>
        <article className="landing-feature"><span>03</span><h2>Keep momentum</h2><p>Return to a dashboard that makes the next useful action obvious.</p></article>
      </section>
    </div>
  );
}

export default function LandingPage() {
  return <AppShell currentPage="home"><LandingContent /></AppShell>;
}
