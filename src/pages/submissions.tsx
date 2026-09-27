import { AppShell, useSession } from '@/components/AppShell';
import { MemberGate } from '@/components/MemberGate';
import { SubmissionsList } from '@/components/SubmissionsList';

function SubmissionsContent() {
  const { currentUser, csrfToken } = useSession();
  return <SubmissionsList isAuthenticated={Boolean(currentUser && csrfToken)} />;
}

export default function SubmissionsPage() {
  return (
    <AppShell currentPage="submissions">
      <MemberGate
        title="Sign in to view submissions"
        description="Your attempts and solved work are kept in your signed-in workspace."
      >
        <SubmissionsContent />
      </MemberGate>
    </AppShell>
  );
}
