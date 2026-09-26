import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Circle,
  TrendingUp,
  Tag,
  Shuffle,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react';
import { ProblemSummary, Difficulty, User } from '../types';

interface ProblemListProps {
  problems: ProblemSummary[];
  onSelectProblem: (id: string) => void;
  currentUser: User | null;
  solvedIds: string[];
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  onSelectProblem,
  currentUser,
  solvedIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Todo'>('All');

  // Extract all unique tags
  const allTags = Array.from(new Set(problems.flatMap((p) => p.tags))).sort();

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'All' ||
      p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesTag =
      selectedTag === 'All' || p.tags.includes(selectedTag);

    const isSolved = solvedIds.includes(p.id);
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Solved' && isSolved) ||
      (selectedStatus === 'Todo' && !isSolved);

    return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
  });

  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;

  const solvedEasy = problems.filter(
    (p) => p.difficulty === 'Easy' && solvedIds.includes(p.id)
  ).length;
  const solvedMedium = problems.filter(
    (p) => p.difficulty === 'Medium' && solvedIds.includes(p.id)
  ).length;
  const solvedHard = problems.filter(
    (p) => p.difficulty === 'Hard' && solvedIds.includes(p.id)
  ).length;

  const handlePickRandom = () => {
    if (problems.length === 0) return;
    const randomIdx = Math.floor(Math.random() * problems.length);
    onSelectProblem(problems[randomIdx].id);
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome & Quick Action Card */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#131b2e] via-[#0f172a] to-[#18182f] border border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AlgoWizard & CodeMagic Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Master Algorithms & Data Structures
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Sharpen your coding skills with curated problem sets, instant code execution judge, multi-language support, and comprehensive testcases.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handlePickRandom}
                className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02]"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Pick Random Problem</span>
              </button>

              <button
                onClick={() => onSelectProblem('two-sum')}
                className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition"
              >
                <span>Daily Challenge: Two Sum</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* User Progress Stats Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Your Progress</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {solvedIds.length} / {problems.length} Solved
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-6 flex">
              <div
                style={{ width: `${(solvedEasy / (problems.length || 1)) * 100}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`Easy: ${solvedEasy}`}
              />
              <div
                style={{ width: `${(solvedMedium / (problems.length || 1)) * 100}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`Medium: ${solvedMedium}`}
              />
              <div
                style={{ width: `${(solvedHard / (problems.length || 1)) * 100}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
                title={`Hard: ${solvedHard}`}
              />
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-2.5">
                <div className="text-xs font-semibold text-emerald-400">Easy</div>
                <div className="text-sm font-mono font-bold text-emerald-300 mt-0.5">
                  {solvedEasy}/{easyCount}
                </div>
              </div>
              <div className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-2.5">
                <div className="text-xs font-semibold text-amber-400">Medium</div>
                <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">
                  {solvedMedium}/{mediumCount}
                </div>
              </div>
              <div className="bg-rose-950/30 border border-rose-900/40 rounded-xl p-2.5">
                <div className="text-xs font-semibold text-rose-400">Hard</div>
                <div className="text-sm font-mono font-bold text-rose-300 mt-0.5">
                  {solvedHard}/{hardCount}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Score: <strong className="text-purple-300">{currentUser?.score || 0} pts</strong></span>
            <span>Solved Rate: <strong className="text-purple-300">{problems.length ? Math.round((solvedIds.length / problems.length) * 100) : 0}%</strong></span>
          </div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, tag, or algorithm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 transition"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Difficulty Filter */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    selectedDifficulty === diff
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              {(['All', 'Solved', 'Todo'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    selectedStatus === status
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tag pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-500 font-medium flex items-center space-x-1 pl-1 pr-2">
            <Tag className="w-3 h-3" />
            <span>Tags:</span>
          </span>
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
              selectedTag === 'All'
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Topics
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t === selectedTag ? 'All' : t)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                selectedTag === t
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#131b2e] border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Category / Tags</th>
                <th className="py-3.5 px-4 w-28">Difficulty</th>
                <th className="py-3.5 px-4 w-28">Acceptance</th>
                <th className="py-3.5 px-4 w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                    No problems match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((p, index) => {
                  const isSolved = solvedIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectProblem(p.id)}
                      className="group hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      {/* Solved Status */}
                      <td className="py-4 px-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 inline" />
                        )}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-4 font-medium text-slate-200 group-hover:text-purple-400 transition">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500 text-xs font-mono">
                            {index + 1}.
                          </span>
                          <span>{p.title}</span>
                        </div>
                      </td>

                      {/* Category & Tags */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                            {p.category}
                          </span>
                          {p.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getDifficultyColor(
                            p.difficulty
                          )}`}
                        >
                          {p.difficulty}
                        </span>
                      </td>

                      {/* Acceptance */}
                      <td className="py-4 px-4 text-xs font-mono text-slate-400">
                        {p.acceptanceRate || '52.4%'}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProblem(p.id);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/50 group-hover:bg-purple-600 group-hover:text-white border border-purple-800/60 rounded-lg transition"
                        >
                          Solve
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
