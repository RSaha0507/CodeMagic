import { AppShell } from '@/components/AppShell';
import { Leaderboard } from '@/components/Leaderboard';
import { MemberGate } from '@/components/MemberGate';

export default function LeaderboardPage() {
  return (
    <AppShell currentPage="leaderboard">
      <MemberGate
        title="Sign in to view the leaderboard"
        description="Community progress is available after you enter the practice workspace."
      >
        <Leaderboard />
      </MemberGate>
    </AppShell>
  );
}
