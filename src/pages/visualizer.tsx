import { AppShell } from '@/components/AppShell';
import { MemberGate } from '@/components/MemberGate';
import { VisualizerStudio } from '@/components/visualizer/VisualizerStudio';
import { algorithmsCatalog } from '@/data/algorithmsData';
import { pagePaths, problemPath } from '@/lib/routes';

function VisualizerContent() {
  const algorithmId = new URLSearchParams(window.location.search).get('algorithm');
  const algorithm = algorithmId ? algorithmsCatalog[algorithmId] : undefined;

  if (!algorithm) {
    window.location.replace(pagePaths.roadmap);
    return null;
  }

  return (
    <VisualizerStudio
      algorithm={algorithm}
      onBack={() => window.location.assign(pagePaths.roadmap)}
      onSolveProblem={problemId => window.location.assign(problemPath(problemId))}
    />
  );
}

export default function VisualizerPage() {
  return (
    <AppShell currentPage="roadmap">
      <MemberGate
        title="Sign in to use the visualizer"
        description="Interactive walkthroughs are part of the signed-in learning workspace."
      >
        <VisualizerContent />
      </MemberGate>
    </AppShell>
  );
}
