import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Send,
  Code,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  Terminal,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { ProblemDetail, Difficulty, Submission } from '../types';

interface ProblemWorkspaceProps {
  problemId: string;
  onBack: () => void;
  token: string | null;
  onSolveSuccess: (problemId: string) => void;
  onRequireAuth: () => void;
}

export const ProblemWorkspace: React.FC<ProblemWorkspaceProps> = ({
  problemId,
  onBack,
  token,
  onSolveSuccess,
  onRequireAuth,
}) => {
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editor State
  const [language, setLanguage] = useState<'javascript' | 'typescript' | 'python' | 'cpp' | 'java'>('javascript');
  const [code, setCode] = useState<string>('');
  const [leftTab, setLeftTab] = useState<'description' | 'editorial' | 'submissions'>('description');
  const [bottomTab, setBottomTab] = useState<'testcase' | 'result'>('testcase');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);

  // Execution & Submissions
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState<any>(null);
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);
  const [problemSubmissions, setProblemSubmissions] = useState<Submission[]>([]);

  // Fetch Problem
  useEffect(() => {
    fetchProblem();
    fetchProblemSubmissions();
  }, [problemId]);

  const fetchProblem = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/problems/${problemId}`);
      if (!res.ok) throw new Error('Problem not found');
      const data: ProblemDetail = await res.json();
      setProblem(data);
      setCode(data.starterCode[language] || data.starterCode.javascript || '');
      if (data.testCases.length > 0) {
        setCustomInput(data.testCases[0].input);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProblemSubmissions = async () => {
    try {
      const res = await fetch(`/api/submissions?problemId=${problemId}`);
      if (res.ok) {
        const data = await res.json();
        setProblemSubmissions(data);
      }
    } catch (e) {}
  };

  const handleLanguageChange = (newLang: any) => {
    setLanguage(newLang);
    if (problem && problem.starterCode[newLang as keyof typeof problem.starterCode]) {
      setCode(problem.starterCode[newLang as keyof typeof problem.starterCode]);
    }
  };

  const handleResetCode = () => {
    if (problem) {
      setCode(problem.starterCode[language] || '');
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setBottomTab('result');
    try {
      const res = await fetch(`/api/problems/${problemId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          customInput: useCustomInput ? customInput : undefined,
        }),
      });
      const data = await res.json();
      setRunResults(data);
    } catch (err: any) {
      setRunResults({ error: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setBottomTab('result');
    try {
      const res = await fetch(`/api/problems/${problemId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });
      const data = await res.json();
      if (data.submission) {
        setLastSubmission(data.submission);
        if (data.submission.status === 'Accepted') {
          onSolveSuccess(problemId);
        }
        fetchProblemSubmissions();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading problem environment...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300">
          {error || 'Problem not found.'}
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
        >
          Return to problem list
        </button>
      </div>
    );
  }

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto px-3 sm:px-6 py-4 flex flex-col h-[calc(100vh-4.5rem)]">
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Problems</span>
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <h1 className="text-base font-bold text-white flex items-center space-x-2">
            <span>{problem.title}</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
          </h1>
        </div>

        {/* Action Buttons: Run & Submit */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-600/20 transition hover:scale-[1.02] disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-pulse' : ''}`} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left Column: Problem Details & Submissions */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-lg">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#131b2e] px-2 pt-1">
            <div className="flex space-x-1">
              <button
                onClick={() => setLeftTab('description')}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition flex items-center space-x-1.5 ${
                  leftTab === 'description'
                    ? 'border-purple-500 text-purple-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Description</span>
              </button>

              <button
                onClick={() => setLeftTab('editorial')}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition flex items-center space-x-1.5 ${
                  leftTab === 'editorial'
                    ? 'border-purple-500 text-purple-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Editorial</span>
              </button>

              <button
                onClick={() => setLeftTab('submissions')}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition flex items-center space-x-1.5 ${
                  leftTab === 'submissions'
                    ? 'border-purple-500 text-purple-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Submissions ({problemSubmissions.length})</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 text-sm text-slate-300 space-y-6">
            {leftTab === 'description' && (
              <>
                {/* Statement */}
                <div className="whitespace-pre-line leading-relaxed text-slate-200 text-sm">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Examples
                  </h4>
                  {problem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2 font-mono text-xs"
                    >
                      <div className="text-purple-400 font-bold">Example {idx + 1}:</div>
                      <div>
                        <strong className="text-slate-400">Input: </strong>
                        <span className="text-slate-200">{ex.input}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Output: </strong>
                        <span className="text-emerald-400">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-[11px] text-slate-400 font-sans border-t border-slate-900 pt-1.5 mt-1.5">
                          <strong>Explanation: </strong> {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Constraints
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-500 mr-2">Tags:</span>
                  {problem.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-slate-900 text-purple-300 border border-purple-900/30"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}

            {leftTab === 'editorial' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-purple-950/20 border border-purple-800/30 rounded-xl space-y-2">
                  <h4 className="font-bold text-purple-300 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Algorithmic Approach & Complexity</span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Optimal solutions for <strong>{problem.title}</strong> leverage efficient data structures (e.g. Hash Maps, Two Pointers, or Dynamic Programming) to reduce brute-force time complexity down to optimal bounds.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-slate-200">Optimal Complexity:</h5>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px]">Time Complexity:</span>
                      <p className="text-emerald-400 font-bold">O(N) / O(N log N)</p>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px]">Space Complexity:</span>
                      <p className="text-purple-400 font-bold">O(N) / O(1)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {leftTab === 'submissions' && (
              <div className="space-y-3">
                {problemSubmissions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No submissions recorded yet for this problem. Submit your solution!
                  </div>
                ) : (
                  problemSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center space-x-2.5">
                        {sub.status === 'Accepted' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <div>
                          <div
                            className={`font-bold ${
                              sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {sub.status}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(sub.createdAt).toLocaleTimeString()} by {sub.userName}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400">
                        <div>{sub.runtimeMs} ms</div>
                        <div className="text-[10px] text-slate-500">{sub.language}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Testcase Runner */}
        <div className="lg:col-span-7 flex flex-col space-y-3 min-h-0">
          {/* Editor Header & Control */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl flex items-center justify-between px-4 py-2 text-xs">
            <div className="flex items-center space-x-3">
              <Code className="w-4 h-4 text-purple-400" />
              <label className="text-slate-400 font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 font-semibold rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-purple-500 outline-none"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ 20</option>
                <option value="java">Java 17</option>
              </select>
            </div>

            <button
              onClick={handleResetCode}
              title="Reset starter template"
              className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 p-1 rounded transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Interactive Code Editor TextArea */}
          <div className="flex-1 bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden relative flex flex-col min-h-[300px]">
            <div className="absolute top-2 right-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest pointer-events-none">
              {language}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-4 font-mono text-xs sm:text-sm text-slate-100 bg-transparent resize-none outline-none leading-relaxed selection:bg-purple-600/40"
              placeholder="// Write your solution here..."
            />
          </div>

          {/* Bottom Panel: Testcases & Results */}
          <div className="h-56 bg-[#0f172a] border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-lg">
            {/* Panel Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#131b2e] px-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => setBottomTab('testcase')}
                  className={`py-2 px-3 text-xs font-medium border-b-2 transition flex items-center space-x-1.5 ${
                    bottomTab === 'testcase'
                      ? 'border-purple-500 text-purple-300 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Testcase</span>
                </button>

                <button
                  onClick={() => setBottomTab('result')}
                  className={`py-2 px-3 text-xs font-medium border-b-2 transition flex items-center space-x-1.5 ${
                    bottomTab === 'result'
                      ? 'border-purple-500 text-purple-300 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Run / Judge Result</span>
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
              {bottomTab === 'testcase' && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {problem.testCases
                      .filter((tc) => !tc.isHidden)
                      .map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedTestCaseIndex(idx);
                            setUseCustomInput(false);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            !useCustomInput && selectedTestCaseIndex === idx
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}

                    <button
                      onClick={() => setUseCustomInput(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        useCustomInput
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      Custom Input
                    </button>
                  </div>

                  {useCustomInput ? (
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        JSON Arguments (key-value):
                      </label>
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-purple-500"
                        placeholder='{"nums": [1,2,3], "target": 4}'
                      />
                    </div>
                  ) : (
                    problem.testCases[selectedTestCaseIndex] && (
                      <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 text-[10px] block">INPUT</span>
                          <span className="text-slate-200">
                            {problem.testCases[selectedTestCaseIndex].input}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">EXPECTED</span>
                          <span className="text-emerald-400">
                            {problem.testCases[selectedTestCaseIndex].expectedOutput}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {bottomTab === 'result' && (
                <div>
                  {/* Submission Verdict */}
                  {lastSubmission && (
                    <div className="mb-4 p-3.5 rounded-xl border bg-slate-950">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {lastSubmission.status === 'Accepted' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          )}
                          <span
                            className={`text-sm font-bold ${
                              lastSubmission.status === 'Accepted'
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {lastSubmission.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-400 text-xs">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-purple-400" />
                            <span>{lastSubmission.runtimeMs} ms</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{Math.round(lastSubmission.memoryKb / 1024)} MB</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400">
                        Passed {lastSubmission.passedCount} of {lastSubmission.totalTestCases} test cases.
                      </div>

                      {lastSubmission.errorDetail && (
                        <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded text-xs">
                          {lastSubmission.errorDetail}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Run Output */}
                  {runResults ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300">
                          {runResults.allPassed ? '✅ All Example Testcases Passed' : '⚠️ Test Results'}
                        </span>
                        <span className="text-slate-500">
                          Runtime: {runResults.totalRuntimeMs} ms
                        </span>
                      </div>

                      <div className="space-y-2">
                        {runResults.results?.map((r: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg border text-xs ${
                              r.passed
                                ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                                : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>Case #{r.testCaseIndex}: {r.passed ? 'PASSED' : 'FAILED'}</span>
                              <span className="text-[10px] font-normal">{r.runtimeMs} ms</span>
                            </div>
                            <div className="mt-1 text-slate-300 font-mono text-[11px]">
                              <div>Input: {r.input}</div>
                              <div>Actual: {r.actualOutput || 'None'}</div>
                              {r.expectedOutput && <div>Expected: {r.expectedOutput}</div>}
                              {r.error && <div className="text-rose-400 mt-1">Error: {r.error}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : !lastSubmission ? (
                    <div className="text-center py-6 text-slate-500">
                      Click "Run Code" or "Submit Solution" to test your code.
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
