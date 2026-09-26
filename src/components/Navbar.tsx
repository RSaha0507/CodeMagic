import React from 'react';
import { Sparkles, Code2, Trophy, History, PlusCircle, LogIn, LogOut, Flame, Compass } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: 'problems' | 'roadmap' | 'leaderboard' | 'submissions';
  onSelectTab: (tab: 'problems' | 'roadmap' | 'leaderboard' | 'submissions') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenCreateProblem: () => void;
  onLogout: () => void;
  solvedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onOpenCreateProblem,
  onLogout,
  solvedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0d1322]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-6 sm:space-x-8">
          <button
            onClick={() => onSelectTab('problems')}
            className="flex items-center space-x-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
              <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
                CodeMagic
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                Online Judge & Practice
              </span>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('problems')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                currentTab === 'problems'
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Problems</span>
            </button>

            <button
              onClick={() => onSelectTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                currentTab === 'roadmap'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Visual Roadmap</span>
              <span className="text-[9px] uppercase font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full border border-purple-500/30">
                New
              </span>
            </button>

            <button
              onClick={() => onSelectTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                currentTab === 'leaderboard'
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => onSelectTab('submissions')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                currentTab === 'submissions'
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Submissions</span>
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCreateProblem}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 rounded-lg transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Contribute Problem</span>
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
              <div className="flex items-center space-x-2 text-xs">
                <span className="flex items-center text-amber-400 font-bold">
                  <Flame className="w-4 h-4 mr-0.5 text-amber-500 fill-amber-500 animate-pulse" />
                  {currentUser.score} pts
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-medium">
                  {solvedCount} Solved
                </span>
              </div>

              <div className="h-4 w-px bg-slate-800" />

              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-300 hidden lg:inline max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="p-1 hover:text-rose-400 text-slate-500 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
