import { useEffect, useState } from 'react';
import { AppShell, useSession } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { pagePaths } from '@/lib/routes';

const learningSteps = [
  {
    title: 'Study the mechanism',
    description: 'Use visualizers to see what each step changes before writing a solution.',
  },
  {
    title: 'Practice the pattern',
    description: 'Move into concise problem statements with relevant topics and difficulty filters.',
  },
  {
    title: 'Keep momentum',
    description: 'Return to a dashboard that makes the next useful action obvious.',
  },
] as const;

const practiceHighlights = [
  { title: 'Curated practice', description: 'Clear prompts and constraints.' },
  { title: 'Visual learning', description: 'Step through algorithm state.' },
  { title: 'Personal progress', description: 'Track work in one place.' },
] as const;

function LearningSequence() {
  const [activeStep, setActiveStep] = useState(0);
  const [typedTitle, setTypedTitle] = useState('');
  const [typedDescription, setTypedDescription] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedTitle(learningSteps[0].title);
      setTypedDescription(learningSteps[0].description);
      return;
    }

    let cancelled = false;
    const pause = (milliseconds: number) => new Promise(resolve => window.setTimeout(resolve, milliseconds));

    const playSequence = async () => {
      let stepIndex = 0;

      while (!cancelled) {
        const { title, description } = learningSteps[stepIndex];
        setActiveStep(stepIndex);
        setTypedTitle('');
        setTypedDescription('');

        for (let character = 0; character <= title.length && !cancelled; character += 1) {
          setTypedTitle(title.slice(0, character));
          await pause(34);
        }

        await pause(130);

        for (let character = 0; character <= description.length && !cancelled; character += 1) {
          setTypedDescription(description.slice(0, character));
          await pause(18);
        }

        await pause(2600);

        for (let character = description.length; character >= 0 && !cancelled; character -= 1) {
          setTypedDescription(description.slice(0, character));
          await pause(12);
        }

        for (let character = title.length; character >= 0 && !cancelled; character -= 1) {
          setTypedTitle(title.slice(0, character));
          await pause(16);
        }

        await pause(220);
        stepIndex = (stepIndex + 1) % learningSteps.length;
      }
    };

    void playSequence();
    return () => { cancelled = true; };
  }, []);

  const step = learningSteps[activeStep];

  return (
    <section className="landing-sequence" aria-label="CodeMagic learning flow">
      <div className="landing-sequence-window">
        <article key={activeStep} className="landing-sequence-item">
          <h2 aria-hidden="true"><span className="landing-sequence-prompt">$_</span>{typedTitle}<span className="landing-sequence-caret" /></h2>
          <p className="landing-sequence-description" aria-hidden="true">{typedDescription}</p>
          <p className="sr-only" aria-live="polite">{step.title}. {step.description}</p>
        </article>
      </div>
      <div className="landing-sequence-progress" aria-hidden="true">
        {learningSteps.map((_, index) => <span key={index} className={index === activeStep ? 'is-active' : undefined} />)}
      </div>
    </section>
  );
}

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
          <LearningSequence />
        </div>
        <aside className="landing-brand-stage" aria-label="CodeMagic official logo">
          <img src="/brand/codemagic-landing.png" alt="CodeMagic official logo" />
          <ul className="landing-checklist" aria-label="CodeMagic practice capabilities">
            {practiceHighlights.map(highlight => (
              <li key={highlight.title}>
                <span className="landing-checkmark" aria-hidden="true">&#10003;</span>
                <span><strong>{highlight.title}</strong><small>{highlight.description}</small></span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}

export default function LandingPage() {
  return <AppShell currentPage="home"><LandingContent /></AppShell>;
}
