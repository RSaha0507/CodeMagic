import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProblemList } from './components/ProblemList';
import { ProblemWorkspace } from './components/ProblemWorkspace';
import { Leaderboard } from './components/Leaderboard';
import { SubmissionsList } from './components/SubmissionsList';
import { AuthModal } from './components/AuthModal';
import { CreateProblemModal } from './components/CreateProblemModal';
import { VisualRoadmapView } from './components/roadmap/VisualRoadmapView';
import { VisualizerStudio } from './components/visualizer/VisualizerStudio';
import { algorithmsCatalog } from './data/algorithmsData';
import { ProblemSummary, User } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'problems' | 'roadmap' | 'leaderboard' | 'submissions'>('roadmap');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<string | null>(null);
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateProblemOpen, setIsCreateProblemOpen] = useState(false);

  // Initialize with saved or demo user
  useEffect(() => {
    const savedToken = localStorage.getItem('codemagic_token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      // Default to demo user for a great zero-friction out-of-the-box experience
      setCurrentUser({
        id: 'usr-1',
        email: 'coder@codemagic.io',
        name: 'CodeWizard',
        score: 120,
        solvedProblemIds: ['two-sum', 'valid-parentheses'],
      });
    }
    fetchProblems();
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProblems = async () => {
    try {
      const res = await fetch('/api/problems');
      if (res.ok) {
        const data = await res.json();
        setProblems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user: User, authToken: string) => {
    setCurrentUser(user);
    setToken(authToken);
    localStorage.setItem('codemagic_token', authToken);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('codemagic_token');
  };

  const handleSolveSuccess = (problemId: string) => {
    if (currentUser) {
      if (!currentUser.solvedProblemIds.includes(problemId)) {
        setCurrentUser({
          ...currentUser,
          solvedProblemIds: [...currentUser.solvedProblemIds, problemId],
          score: currentUser.score + 50,
        });
      }
    }
    fetchProblems();
  };

  const handleSelectProblemFromVisualizer = (problemId: string) => {
    setSelectedAlgorithmId(null);
    setSelectedProblemId(problemId);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedProblemId(null);
          setSelectedAlgorithmId(null);
          setCurrentTab(tab);
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreateProblem={() => setIsCreateProblemOpen(true)}
        onLogout={handleLogout}
        solvedCount={currentUser?.solvedProblemIds.length || 0}
      />

      <main className="flex-1">
        {selectedAlgorithmId && algorithmsCatalog[selectedAlgorithmId] ? (
          <VisualizerStudio
            algorithm={algorithmsCatalog[selectedAlgorithmId]}
            onBack={() => setSelectedAlgorithmId(null)}
            onSolveProblem={handleSelectProblemFromVisualizer}
          />
        ) : selectedProblemId ? (
          <ProblemWorkspace
            problemId={selectedProblemId}
            onBack={() => setSelectedProblemId(null)}
            token={token}
            onSolveSuccess={handleSolveSuccess}
            onRequireAuth={() => setIsAuthOpen(true)}
          />
        ) : currentTab === 'roadmap' ? (
          <VisualRoadmapView
            onSelectAlgorithm={(algoId) => setSelectedAlgorithmId(algoId)}
            completedAlgorithms={currentUser?.solvedProblemIds || []}
          />
        ) : currentTab === 'problems' ? (
          <ProblemList
            problems={problems}
            onSelectProblem={(id) => setSelectedProblemId(id)}
            currentUser={currentUser}
            solvedIds={currentUser?.solvedProblemIds || []}
          />
        ) : currentTab === 'leaderboard' ? (
          <Leaderboard />
        ) : (
          <SubmissionsList />
        )}
      </main>

      {/* Footer */}
      {!selectedProblemId && !selectedAlgorithmId && (
        <footer className="border-t border-slate-800/80 bg-[#0d1322] py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              CodeMagic Interactive Visual Online Judge © 2026 — Master Algorithms & Career DSA
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <button
                onClick={() => {
                  setSelectedProblemId(null);
                  setSelectedAlgorithmId(null);
                  setCurrentTab('roadmap');
                }}
                className="hover:text-purple-400 transition"
              >
                Visual Roadmap
              </button>
              <button
                onClick={() => {
                  setSelectedProblemId(null);
                  setSelectedAlgorithmId(null);
                  setCurrentTab('problems');
                }}
                className="hover:text-purple-400 transition"
              >
                Problem Set
              </button>
              <button
                onClick={() => {
                  setSelectedProblemId(null);
                  setSelectedAlgorithmId(null);
                  setCurrentTab('leaderboard');
                }}
                className="hover:text-purple-400 transition"
              >
                Rankings
              </button>
              <button
                onClick={() => setIsCreateProblemOpen(true)}
                className="hover:text-purple-400 transition"
              >
                Contribute
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CreateProblemModal
        isOpen={isCreateProblemOpen}
        onClose={() => setIsCreateProblemOpen(false)}
        onProblemCreated={() => {
          fetchProblems();
          setCurrentTab('problems');
        }}
        token={token}
      />
    </div>
  );
};
export default App;
