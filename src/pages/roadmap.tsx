import { AppShell, useSession } from '@/components/AppShell';
import { VisualRoadmapView } from '@/components/VisualRoadmapView';
import { MemberGate } from '@/components/MemberGate';
import { visualizerPath } from '@/lib/routes';

function RoadmapContent() {
  const { currentUser } = useSession();
  return <VisualRoadmapView onSelectAlgorithm={algorithmId => window.location.assign(visualizerPath(algorithmId))} completedAlgorithms={currentUser?.solvedProblemIds ?? []} />;
}

export default function RoadmapPage() {
  return <AppShell currentPage="roadmap"><MemberGate title="Sign in to open the visual roadmap." description="The roadmap and interactive algorithm visualizers are available to members after sign-in."><RoadmapContent /></MemberGate></AppShell>;
}
