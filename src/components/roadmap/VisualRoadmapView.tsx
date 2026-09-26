import React from 'react';
import {
  Compass,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Medal,
  Flame,
  ArrowDown,
  Cpu,
  Star,
} from 'lucide-react';
import { roadmapNodes, careerTracks } from '../../data/roadmapData';
import { algorithmsCatalog } from '../../data/algorithmsData';

interface VisualRoadmapViewProps {
  onSelectAlgorithm: (algorithmId: string) => void;
  completedAlgorithms?: string[];
}

export const VisualRoadmapView: React.FC<VisualRoadmapViewProps> = ({
  onSelectAlgorithm,
  completedAlgorithms = [],
}) => {
  const track = careerTracks[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#131b2e] via-[#0f172a] to-[#1a1438] border border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Interactive Visual Learning Pathway</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {track.title}
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {track.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Medal className="w-4 h-4 text-amber-400" />
              <span>Target: <strong className="text-slate-200">{track.roleTarget}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>{roadmapNodes.length} Core Visual Milestones</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>~{track.estimatedHours} Hours Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Interactive Visualizer Catalog</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(algorithmsCatalog).map((algo) => {
            const isCompleted = completedAlgorithms.includes(algo.id);
            return (
              <div
                key={algo.id}
                onClick={() => onSelectAlgorithm(algo.id)}
                className="group bg-[#0f172a] hover:bg-slate-800/60 border border-slate-800 hover:border-purple-500/50 rounded-xl p-5 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                      {algo.structureType}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {algo.timeComplexity.average}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition">
                    {algo.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {algo.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{algo.interviewFrequency} Frequency</span>
                  </span>

                  <button className="flex items-center space-x-1 text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                    <span>Visualize</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap Step-by-Step Flow */}
      <div className="space-y-6 pt-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Flame className="w-4 h-4 text-purple-400" />
          <span>Stage-by-Stage Progressive Learning Roadmap</span>
        </h2>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-8">
          {roadmapNodes.map((node, index) => {
            const algo = algorithmsCatalog[node.algorithmId];
            const isCompleted = completedAlgorithms.includes(node.algorithmId);

            return (
              <div key={node.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full bg-[#0f172a] border-2 border-purple-500 flex items-center justify-center text-xs font-bold text-purple-300 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition shadow-md shadow-purple-500/20">
                  {node.level}
                </div>

                {/* Node Box */}
                <div className="bg-[#0f172a] border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                        Stage {node.level} • {node.category.toUpperCase()}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                        {node.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => onSelectAlgorithm(node.algorithmId)}
                      className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-purple-600/20 transition hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Visualizer</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {node.summary}
                  </p>

                  {/* Key Concepts Pills */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 mr-1">Concepts:</span>
                    {node.keyConcepts.map((kc) => (
                      <span
                        key={kc}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                      >
                        {kc}
                      </span>
                    ))}
                  </div>

                  {/* Prerequisites and badge */}
                  <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                    <div>
                      Prerequisites: <span className="text-slate-300">{node.prerequisites.join(', ')}</span>
                    </div>
                    <div className="text-amber-400 font-medium">
                      Badge: 🏆 {node.badge}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
