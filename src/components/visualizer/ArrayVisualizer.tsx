import React from 'react';
import { VisualStep } from '../../types/visualizer';

interface ArrayVisualizerProps {
  currentStep: VisualStep;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ currentStep }) => {
  const state = currentStep.arrayState;
  if (!state) return null;

  const values = state.values || [];
  const maxVal = Math.max(...values, 100);
  const minVal = Math.min(...values, 0);
  const range = Math.max(maxVal - minVal, 10);

  const isComparing = (idx: number) => state.comparingIndices?.includes(idx);
  const isActive = (idx: number) => state.activeIndices?.includes(idx);
  const isSorted = (idx: number) => state.sortedIndices?.includes(idx);
  const isPivot = (idx: number) => state.pivotIndex === idx;
  const isFound = (idx: number) => state.foundIndex === idx;
  const isInSearchRange = (idx: number) => {
    if (!state.searchRange) return true;
    return idx >= state.searchRange[0] && idx <= state.searchRange[1];
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      {/* Bars Visualization */}
      <div className="flex-1 flex items-end justify-center gap-2 sm:gap-3 px-4 min-h-[220px]">
        {values.map((val, idx) => {
          const heightPercent = Math.max(15, Math.round(((val - minVal + 10) / (range + 10)) * 85));
          const comparing = isComparing(idx);
          const active = isActive(idx);
          const sorted = isSorted(idx);
          const pivot = isPivot(idx);
          const found = isFound(idx);
          const inRange = isInSearchRange(idx);

          let barBg = 'bg-slate-800 border-slate-700 text-slate-300';
          if (found) {
            barBg = 'bg-emerald-500 border-emerald-400 text-emerald-950 font-extrabold shadow-lg shadow-emerald-500/50 scale-105';
          } else if (pivot) {
            barBg = 'bg-pink-500 border-pink-400 text-white font-bold shadow-lg shadow-pink-500/40';
          } else if (comparing) {
            barBg = 'bg-amber-500 border-amber-400 text-amber-950 font-bold shadow-lg shadow-amber-500/40 scale-105';
          } else if (active) {
            barBg = 'bg-purple-600 border-purple-400 text-white font-bold shadow-lg shadow-purple-600/40 scale-105';
          } else if (sorted) {
            barBg = 'bg-emerald-950/80 border-emerald-600 text-emerald-300';
          } else if (!inRange) {
            barBg = 'bg-slate-900/40 border-slate-900 text-slate-600 opacity-40';
          }

          // Associated pointers at this index
          const pointersAtIndex = (state.pointers || []).filter((p) => p.index === idx);

          return (
            <div key={idx} className="flex flex-col items-center flex-1 max-w-[56px] group transition-all duration-300">
              {/* Pointer tags at the top */}
              <div className="h-10 flex flex-col justify-end items-center mb-1">
                {pointersAtIndex.map((p, pIdx) => (
                  <span
                    key={pIdx}
                    style={{ backgroundColor: p.color || '#a855f7' }}
                    className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider animate-bounce"
                  >
                    {p.name}
                  </span>
                ))}
              </div>

              {/* Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg border-t-2 border-x transition-all duration-300 flex flex-col justify-between items-center py-2 ${barBg}`}
              >
                <span className="text-xs font-mono font-bold">{val}</span>
              </div>

              {/* Index Box */}
              <div className="w-full bg-slate-950 border border-slate-800 text-slate-500 text-[10px] font-mono text-center py-1 rounded-b-md mt-1">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-purple-600" />
          <span>Active / Current</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span>Comparing / Inspecting</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-pink-500" />
          <span>Pivot</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>Sorted / Found</span>
        </div>
      </div>
    </div>
  );
};
