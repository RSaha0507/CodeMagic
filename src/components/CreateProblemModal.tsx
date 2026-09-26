import React, { useState } from 'react';
import { X, Plus, Trash2, Code, FileText, CheckCircle } from 'lucide-react';
import { Difficulty } from '../types';

interface CreateProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemCreated: () => void;
  token: string | null;
}

export const CreateProblemModal: React.FC<CreateProblemModalProps> = ({
  isOpen,
  onClose,
  onProblemCreated,
  token,
}) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [category, setCategory] = useState('Dynamic Programming');
  const [tagsInput, setTagsInput] = useState('Dynamic Programming, Array');
  const [description, setDescription] = useState('');
  const [exampleInput, setExampleInput] = useState('nums = [1, 2, 3]');
  const [exampleOutput, setExampleOutput] = useState('6');
  const [exampleExplanation, setExampleExplanation] = useState('Sum of all elements.');
  const [testCases, setTestCases] = useState<Array<{ input: string; expectedOutput: string; isHidden: boolean }>>([
    { input: JSON.stringify({ nums: [1, 2, 3] }), expectedOutput: '6', isHidden: false },
    { input: JSON.stringify({ nums: [10, 20] }), expectedOutput: '30', isHidden: true },
  ]);
  const [jsStarter, setJsStarter] = useState('function solve(nums) {\n  // your code here\n}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '{"param": 0}', expectedOutput: '0', isHidden: false }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleUpdateTestCase = (index: number, field: string, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const examples = [{
        input: exampleInput,
        output: exampleOutput,
        explanation: exampleExplanation || undefined,
      }];

      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          difficulty,
          category,
          tags,
          description,
          examples,
          constraints: ['1 <= n <= 10^5', '-10^9 <= val <= 10^9'],
          starterCode: {
            javascript: jsStarter,
            typescript: jsStarter,
            python: `# Python solution\ndef solve(nums):\n    pass`,
            cpp: `// C++ Solution\nclass Solution {\npublic:\n    void solve() {}\n};`,
            java: `// Java Solution\nclass Solution {\n    public void solve() {}\n}`,
          },
          testCases,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to create problem');
      }

      onProblemCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create Custom Problem</h3>
            <p className="text-xs text-slate-400">Add a competitive programming problem with automated testcases</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Subarray Sum Equals K"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Arrays, Trees, DP"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="Array, Hash Table, Prefix Sum"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Description</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the problem, input format, return format and constraints..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:border-purple-500"
            />
          </div>

          {/* Example */}
          <div className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-purple-300">Public Example</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Input representation</label>
                <input
                  type="text"
                  value={exampleInput}
                  onChange={(e) => setExampleInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Expected Output</label>
                <input
                  type="text"
                  value={exampleOutput}
                  onChange={(e) => setExampleOutput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Testcases */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Judge Test Cases (JSON format)</label>
              <button
                type="button"
                onClick={handleAddTestCase}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add TestCase</span>
              </button>
            </div>

            {testCases.map((tc, idx) => (
              <div key={idx} className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                <input
                  type="text"
                  placeholder='{"nums": [1, 2]}'
                  value={tc.input}
                  onChange={(e) => handleUpdateTestCase(idx, 'input', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-slate-200"
                />
                <input
                  type="text"
                  placeholder='Expected Output'
                  value={tc.expectedOutput}
                  onChange={(e) => handleUpdateTestCase(idx, 'expectedOutput', e.target.value)}
                  className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-slate-200"
                />
                <label className="flex items-center space-x-1 text-[11px] text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tc.isHidden}
                    onChange={(e) => handleUpdateTestCase(idx, 'isHidden', e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-0"
                  />
                  <span>Hidden</span>
                </label>
                {testCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTestCase(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Starter Template */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Starter Code (JavaScript)</label>
            <textarea
              rows={3}
              value={jsStarter}
              onChange={(e) => setJsStarter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs text-purple-300 focus:border-purple-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white rounded-xl shadow-lg shadow-purple-600/20 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Publish Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
