import React, { useEffect, useState } from 'react';
import type { Submission } from '../types';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface SubmissionsListProps { isAuthenticated: boolean; }

export function SubmissionsList({ isAuthenticated }: SubmissionsListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) { setSubmissions([]); setLoading(false); return; }
    setLoading(true);
    void fetch('/api/submissions', { credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : [])
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
    <div><h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Submission history</h1><p className="mt-1 text-sm text-zinc-400">Your private record of verified practice attempts.</p></div>
    <Card className="overflow-hidden"><CardHeader className="border-b border-zinc-800 bg-zinc-900/40 py-4"><CardTitle className="text-sm">Your attempts</CardTitle><CardDescription className="text-xs">The current development build does not execute code; future verified results will appear here.</CardDescription></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500"><tr><th className="px-5 py-3">Status</th><th className="px-5 py-3">Problem</th><th className="px-5 py-3">Language</th><th className="px-5 py-3">Runtime</th><th className="px-5 py-3">Memory</th><th className="px-5 py-3 text-right">Submitted</th></tr></thead><tbody className="divide-y divide-zinc-800/80">{loading ? <tr><td colSpan={6} className="px-5 py-14 text-center text-zinc-500">Loading submissions...</td></tr> : !isAuthenticated ? <tr><td colSpan={6} className="px-5 py-14 text-center text-zinc-500">Sign in to view your submission history.</td></tr> : submissions.length === 0 ? <tr><td colSpan={6} className="px-5 py-14 text-center text-zinc-500">No verified submissions yet.</td></tr> : submissions.map(submission => <tr key={submission.id} className="hover:bg-zinc-900/50"><td className="px-5 py-4"><Badge variant={submission.status === 'Accepted' ? 'success' : 'danger'}>{submission.status}</Badge></td><td className="px-5 py-4 font-medium text-zinc-200">{submission.problemTitle}</td><td className="px-5 py-4 font-mono text-xs uppercase text-zinc-300">{submission.language}</td><td className="px-5 py-4 font-mono text-xs text-zinc-400">{submission.runtimeMs} ms</td><td className="px-5 py-4 font-mono text-xs text-zinc-400">{Math.round(submission.memoryKb / 1024)} MB</td><td className="px-5 py-4 text-right text-xs text-zinc-500">{new Date(submission.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div></CardContent></Card>
  </div>;
}
