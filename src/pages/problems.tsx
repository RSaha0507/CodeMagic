import { useEffect, useState } from 'react';
import { AppShell, useSession } from '@/components/AppShell';
import { ProblemList } from '@/components/ProblemList';
import { MemberGate } from '@/components/MemberGate';
import { problemPath } from '@/lib/routes';
import type { ProblemSummary } from '@/types';

function ProblemsContent() {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const { currentUser } = useSession();

  useEffect(() => {
    void fetch('/api/problems', { credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : [])
      .then(setProblems)
      .catch(error => console.error(error));
  }, []);

  return (
    <ProblemList
      problems={problems}
      onSelectProblem={problemId => window.location.assign(problemPath(problemId))}
      currentUser={currentUser}
      solvedIds={currentUser?.solvedProblemIds ?? []}
    />
  );
}

export default function ProblemsPage() {
  return <AppShell currentPage="problems"><MemberGate title="Sign in to access the problem library." description="Your practice catalog, workspace, and progress are available after you sign in."><ProblemsContent /></MemberGate></AppShell>;
}
