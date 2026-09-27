import type { ReactNode } from 'react';
import { useSession } from './AppShell';
import { Button } from './ui/button';

interface MemberGateProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function MemberGate({ title, description, children }: MemberGateProps) {
  const { currentUser, isSessionLoading, openAuth } = useSession();

  if (isSessionLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-zinc-400 sm:px-6 lg:px-8">Checking your session...</div>;
  }

  if (!currentUser) {
    return <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6"><section className="member-gate"><p className="landing-eyebrow">Member access</p><h1>{title}</h1><p>{description}</p><Button onClick={openAuth}>Sign in to continue</Button></section></div>;
  }

  return <>{children}</>;
}
