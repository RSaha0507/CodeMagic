import React, { useMemo, useState } from 'react';
import type { Difficulty, ProblemSummary, User } from '../types';
import { Badge } from './ui/badge';
import { Button, buttonVariants } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface ProblemListProps {
  problems: ProblemSummary[];
  onSelectProblem: (id: string) => void;
  currentUser: User | null;
  solvedIds: string[];
}

export const ProblemList: React.FC<ProblemListProps> = ({ problems, onSelectProblem, currentUser, solvedIds }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | Difficulty>('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Todo'>('All');
  const allTags = useMemo(() => Array.from(new Set(problems.flatMap(problem => problem.tags))).sort(), [problems]);

  const filteredProblems = problems.filter(problem => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || problem.title.toLowerCase().includes(query) || problem.category.toLowerCase().includes(query) || problem.tags.some(tag => tag.toLowerCase().includes(query));
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesTag = selectedTag === 'All' || problem.tags.includes(selectedTag);
    const isSolved = solvedIds.includes(problem.id);
    const matchesStatus = selectedStatus === 'All' || (selectedStatus === 'Solved' && isSolved) || (selectedStatus === 'Todo' && !isSolved);
    return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
  });

  const completion = problems.length ? Math.round((solvedIds.length / problems.length) * 100) : 0;
  const topicButton = (active: boolean) => cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-7 rounded-sm px-2.5 text-xs', active && 'bg-zinc-800 text-zinc-100 hover:bg-zinc-800');

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Problem library</span>
              <div><h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Practice with intent.</h1><CardDescription className="mt-1 max-w-xl">Curated algorithm problems, clear constraints, and a workspace built for deliberate practice.</CardDescription></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => problems.length && onSelectProblem(problems[Math.floor(Math.random() * problems.length)].id)}>Random problem</Button>
              <Button variant="outline" size="sm" onClick={() => onSelectProblem('two-sum')}>Daily problem</Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle>Progress</CardTitle><span className="font-mono text-xs text-zinc-500">{solvedIds.length}/{problems.length}</span></div></CardHeader>
          <CardContent className="space-y-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800"><div className="h-full bg-violet-400 transition-all" style={{ width: `${completion}%` }} /></div>
            <div className="flex items-center justify-between text-xs text-zinc-500"><span>{completion}% complete</span><span>{currentUser?.score ?? 0} points</span></div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3" aria-label="Problem filters">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="block max-w-md flex-1"><span className="sr-only">Search problems</span><Input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search title, tag, or topic" /></label>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-xs text-zinc-500">Level
              <select value={selectedDifficulty} onChange={event => setSelectedDifficulty(event.target.value as 'All' | Difficulty)} className="h-9 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20">
                <option value="All">All levels</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-500">Status
              <select value={selectedStatus} onChange={event => setSelectedStatus(event.target.value as 'All' | 'Solved' | 'Todo')} className="h-9 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20">
                <option value="All">All</option><option value="Solved">Solved</option><option value="Todo">Not started</option>
              </select>
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1"><span className="shrink-0 px-1 text-xs text-zinc-500">Topics</span><button type="button" onClick={() => setSelectedTag('All')} className={topicButton(selectedTag === 'All')}>All</button>{allTags.map(tag => <button key={tag} type="button" onClick={() => setSelectedTag(selectedTag === tag ? 'All' : tag)} className={topicButton(selectedTag === tag)}>{tag}</button>)}</div>
      </section>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase tracking-wide text-zinc-500"><tr><th className="w-28 px-4 py-3">State</th><th className="px-4 py-3">Problem</th><th className="px-4 py-3">Topics</th><th className="w-28 px-4 py-3">Level</th><th className="w-24 px-4 py-3 text-right"><span className="sr-only">Open problem</span></th></tr></thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredProblems.length === 0 ? <tr><td colSpan={5} className="px-4 py-14 text-center text-zinc-500">No problems match these filters.</td></tr> : filteredProblems.map((problem, index) => {
                const solved = solvedIds.includes(problem.id);
                return <tr key={problem.id} className="group cursor-pointer transition-colors hover:bg-zinc-900/60" onClick={() => onSelectProblem(problem.id)}>
                  <td className="px-4 py-4 text-xs text-zinc-400">{solved ? 'Solved' : 'Not started'}</td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2"><span className="w-5 font-mono text-xs text-zinc-600">{index + 1}</span><span className="font-medium text-zinc-200 transition-colors group-hover:text-violet-200">{problem.title}</span></div></td>
                  <td className="px-4 py-4"><div className="flex flex-wrap gap-1.5"><Badge variant="secondary">{problem.category}</Badge>{problem.tags.slice(0, 2).map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}</div></td>
                  <td className="px-4 py-4 text-sm text-zinc-300">{problem.difficulty}</td>
                  <td className="px-4 py-4 text-right"><Button size="sm" variant="ghost" onClick={event => { event.stopPropagation(); onSelectProblem(problem.id); }}>Open</Button></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
