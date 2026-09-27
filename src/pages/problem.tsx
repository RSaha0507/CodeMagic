import { AppShell, useSession } from '@/components/AppShell';
import { MemberGate } from '@/components/MemberGate';
import { ProblemWorkspace } from '@/components/ProblemWorkspace';
import { pagePaths } from '@/lib/routes';

function ProblemContent() {
  const { csrfToken, refreshProfile } = useSession();
  const problemId = new URLSearchParams(window.location.search).get('id');

  if (!problemId) {
    window.location.replace(pagePaths.problems);
    return null;
  }

  return (
    <ProblemWorkspace
      problemId={problemId}
      onBack={() => window.location.assign(pagePaths.problems)}
      csrfToken={csrfToken}
      onSolveSuccess={() => void refreshProfile()}
      onRequireAuth={() => window.location.assign(`${pagePaths.problems}#sign-in`)}
    />
  );
}

export default function ProblemPage() {
  return (
    <AppShell currentPage="problems">
      <MemberGate
        title="Sign in to open the workspace"
        description="Problem statements, solutions, and submissions are available to signed-in members."
      >
        <ProblemContent />
      </MemberGate>
    </AppShell>
  );
}
