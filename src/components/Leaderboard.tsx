import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Star, ShieldCheck } from 'lucide-react';
import { LeaderboardUser } from '../types';

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-amber-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-slate-500 font-mono text-sm">#{rank}</span>;
    }
  };

  const getTier = (score: number) => {
    if (score >= 200) return { title: 'Grandmaster', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    if (score >= 100) return { title: 'Master', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    if (score >= 50) return { title: 'Knight', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    return { title: 'Apprentice', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Global Leaderboard</h2>
        <p className="text-xs text-slate-400">Top competitive programmers on CodeMagic ranked by score & accuracy</p>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#131b2e] border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-16 text-center">Rank</th>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Tier</th>
              <th className="py-3.5 px-4 text-center">Solved</th>
              <th className="py-3.5 px-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                  Loading rankings...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                  No ranked users yet.
                </td>
              </tr>
            ) : (
              users.map((u, idx) => {
                const tier = getTier(u.score);
                return (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 px-4 text-center font-bold">
                      <div className="flex items-center justify-center">
                        {getRankBadge(idx + 1)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-200 block">{u.name}</span>
                          <span className="text-[11px] text-slate-500">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tier.color}`}>
                        {tier.title}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-emerald-400">
                      {u.solvedCount}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-amber-400">
                      <span className="inline-flex items-center space-x-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{u.score} pts</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
