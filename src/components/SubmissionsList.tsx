import React, { useState, useEffect } from 'react';
import { History, CheckCircle2, XCircle, Clock, Cpu, Code2 } from 'lucide-react';
import { Submission } from '../types';

export const SubmissionsList: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Recent Judge Submissions</h2>
          <p className="text-xs text-slate-400">Live feed of all evaluated code submissions</p>
        </div>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#131b2e] border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Problem</th>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Runtime</th>
              <th className="py-3.5 px-4">Memory</th>
              <th className="py-3.5 px-4">Language</th>
              <th className="py-3.5 px-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 text-xs font-sans">
                  Loading submissions...
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 text-xs font-sans">
                  No submissions yet. Solve a problem to submit your code!
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-4 font-sans font-bold">
                    <div className="flex items-center space-x-2">
                      {s.status === 'Accepted' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className={s.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}>
                        {s.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-sans font-medium text-slate-200">
                    {s.problemTitle}
                  </td>
                  <td className="py-4 px-4 font-sans text-slate-300">
                    {s.userName}
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {s.runtimeMs} ms
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {Math.round(s.memoryKb / 1024)} MB
                  </td>
                  <td className="py-4 px-4 uppercase text-purple-300">
                    {s.language}
                  </td>
                  <td className="py-4 px-4 text-right font-sans text-slate-500 text-[11px]">
                    {new Date(s.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
