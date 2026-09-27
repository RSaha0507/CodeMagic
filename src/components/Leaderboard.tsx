import React, { useEffect, useState } from 'react';
import type { LeaderboardUser } from '../types';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch('/api/leaderboard', { credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : [])
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const tier = (score: number) => score >= 200 ? 'Grandmaster' : score >= 100 ? 'Master' : score >= 50 ? 'Knight' : 'Apprentice';

  return <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
    <div><h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Leaderboard</h1><p className="mt-1 text-sm text-zinc-400">Progress is ranked by completed practice problems and verified score.</p></div>
    <Card className="overflow-hidden"><CardHeader className="border-b border-zinc-800 bg-zinc-900/40 py-4"><CardTitle className="text-sm">Rankings</CardTitle><CardDescription className="text-xs">Scores update when the future isolated judge verifies submissions.</CardDescription></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500"><tr><th className="w-20 px-5 py-3 text-center">Rank</th><th className="px-5 py-3">Learner</th><th className="px-5 py-3">Tier</th><th className="px-5 py-3 text-center">Solved</th><th className="px-5 py-3 text-right">Score</th></tr></thead><tbody className="divide-y divide-zinc-800/80">{loading ? <tr><td colSpan={5} className="px-5 py-14 text-center text-zinc-500">Loading rankings...</td></tr> : users.length === 0 ? <tr><td colSpan={5} className="px-5 py-14 text-center text-zinc-500">No ranked users yet.</td></tr> : users.map((user, index) => <tr key={user.id} className="hover:bg-zinc-900/50"><td className="px-5 py-4 text-center font-mono text-zinc-400">{index + 1}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-md bg-zinc-800 text-xs font-semibold text-zinc-300">{user.name.charAt(0).toUpperCase()}</span><span className="font-medium text-zinc-200">{user.name}</span></div></td><td className="px-5 py-4"><Badge variant="secondary">{tier(user.score)}</Badge></td><td className="px-5 py-4 text-center font-mono text-zinc-300">{user.solvedCount}</td><td className="px-5 py-4 text-right font-mono font-medium text-zinc-200">{user.score}</td></tr>)}</tbody></table></div></CardContent></Card>
  </div>;
}
