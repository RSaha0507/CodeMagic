import React, { useState } from 'react';
import { Difficulty } from '../types';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface CreateProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemCreated: () => void;
  csrfToken: string | null;
}

type DraftTestCase = { input: string; expectedOutput: string; isHidden: boolean };

export const CreateProblemModal: React.FC<CreateProblemModalProps> = ({ isOpen, onClose, onProblemCreated, csrfToken }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [category, setCategory] = useState('Dynamic Programming');
  const [tagsInput, setTagsInput] = useState('Dynamic Programming, Array');
  const [description, setDescription] = useState('');
  const [exampleInput, setExampleInput] = useState('nums = [1, 2, 3]');
  const [exampleOutput, setExampleOutput] = useState('6');
  const [exampleExplanation, setExampleExplanation] = useState('Sum of all elements.');
  const [testCases, setTestCases] = useState<DraftTestCase[]>([
    { input: JSON.stringify({ nums: [1, 2, 3] }), expectedOutput: '6', isHidden: false },
    { input: JSON.stringify({ nums: [10, 20] }), expectedOutput: '30', isHidden: true },
  ]);
  const [jsStarter, setJsStarter] = useState('function solve(nums) {\n  // your code here\n}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTestCase = <K extends keyof DraftTestCase>(index: number, field: K, value: DraftTestCase[K]) => {
    setTestCases(current => current.map((testCase, testCaseIndex) => testCaseIndex === index ? { ...testCase, [field]: value } : testCase));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!csrfToken) {
      setError('Sign in again before publishing a problem.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({
          title,
          difficulty,
          category,
          tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
          description,
          examples: [{ input: exampleInput, output: exampleOutput, explanation: exampleExplanation || undefined }],
          constraints: ['1 <= n <= 10^5', '-10^9 <= val <= 10^9'],
          starterCode: {
            javascript: jsStarter,
            typescript: jsStarter,
            python: '# Python solution\ndef solve(nums):\n    pass',
            cpp: '// C++ Solution\nclass Solution {\npublic:\n    void solve() {}\n};',
            java: '// Java Solution\nclass Solution {\n    public void solve() {}\n}',
          },
          testCases,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to create problem.');
      onProblemCreated();
      onClose();
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to create problem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a practice problem</DialogTitle>
          <DialogDescription>Draft a clear prompt, starter code, and valid JSON test cases for the future isolated judge.</DialogDescription>
        </DialogHeader>

        {error && <div role="alert" className="rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-1.5 text-sm font-medium text-zinc-300 sm:col-span-2">Problem title
              <Input required value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Subarray Sum Equals K" />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-zinc-300">Difficulty
              <select value={difficulty} onChange={event => setDifficulty(event.target.value as Difficulty)} className="h-9 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20">
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-zinc-300">Category
              <Input required value={category} onChange={event => setCategory(event.target.value)} placeholder="Arrays, Trees, DP" />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-zinc-300 sm:col-span-2">Tags <span className="font-normal text-zinc-500">(comma separated)</span>
              <Input value={tagsInput} onChange={event => setTagsInput(event.target.value)} placeholder="Array, Hash Table, Prefix Sum" />
            </label>
          </section>

          <label className="block space-y-1.5 text-sm font-medium text-zinc-300">Problem description
            <Textarea required rows={5} value={description} onChange={event => setDescription(event.target.value)} placeholder="Describe the input, output, constraints, and edge cases…" />
          </label>

          <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-200">Public example</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-medium text-zinc-400">Input representation<Input value={exampleInput} onChange={event => setExampleInput(event.target.value)} className="font-mono text-xs" /></label>
              <label className="space-y-1.5 text-xs font-medium text-zinc-400">Expected output<Input value={exampleOutput} onChange={event => setExampleOutput(event.target.value)} className="font-mono text-xs" /></label>
              <label className="space-y-1.5 text-xs font-medium text-zinc-400 sm:col-span-2">Explanation<Input value={exampleExplanation} onChange={event => setExampleExplanation(event.target.value)} /></label>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div><h3 className="text-sm font-medium text-zinc-200">Test cases</h3><p className="text-xs text-zinc-500">Inputs must be valid JSON. Hidden expected outputs are never returned publicly.</p></div>
              <Button type="button" variant="outline" size="sm" onClick={() => setTestCases(current => [...current, { input: '{"param":0}', expectedOutput: '0', isHidden: false }])}>Add case</Button>
            </div>
            <div className="space-y-2">
              {testCases.map((testCase, index) => (
                <div key={`${index}-${testCase.input}`} className="grid items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/30 p-3 sm:grid-cols-[auto_1fr_9rem_auto_auto]">
                  <span className="text-xs font-mono text-zinc-500">#{index + 1}</span>
                  <Input value={testCase.input} onChange={event => updateTestCase(index, 'input', event.target.value)} placeholder='{"nums":[1,2]}' className="font-mono text-xs" />
                  <Input value={testCase.expectedOutput} onChange={event => updateTestCase(index, 'expectedOutput', event.target.value)} placeholder="Expected output" className="font-mono text-xs" />
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-400"><input type="checkbox" checked={testCase.isHidden} onChange={event => updateTestCase(index, 'isHidden', event.target.checked)} className="size-3.5 accent-violet-500" />Hidden</label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setTestCases(current => current.filter((_, testCaseIndex) => testCaseIndex !== index))} disabled={testCases.length === 1}>Remove</Button>
                </div>
              ))}
            </div>
          </section>

          <label className="block space-y-1.5 text-sm font-medium text-zinc-300">JavaScript starter code
            <Textarea rows={5} value={jsStarter} onChange={event => setJsStarter(event.target.value)} className="font-mono text-xs leading-5" />
          </label>

          <DialogFooter className="border-t border-zinc-800 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Publishing…' : 'Publish problem'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
