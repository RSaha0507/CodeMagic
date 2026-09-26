import React from 'react';
import { Layers, ArrowDown } from 'lucide-react';
import { VisualStep } from '../../types/visualizer';

interface StackVisualizerProps {
  currentStep: VisualStep;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ currentStep }) => {
  const state = currentStep.stackQueueState;
  if (!state) return null;

  const items = state.items || [];

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      <div className="flex-1 flex items-center justify-center gap-8 py-4">
        {/* Stack Container */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-slate-400 mb-2 flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Stack (LIFO Structure)</span>
          </div>

          {/* Top Indicator */}
          <div className="h-6 flex items-center justify-center text-xs text-purple-400 font-mono font-bold mb-1">
            {items.length > 0 && (
              <div className="flex items-center space-x-1 animate-pulse">
                <span>TOP</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Physical Stack Box */}
          <div className="w-44 min-h-[200px] border-b-4 border-x-4 border-slate-700 bg-slate-950/60 rounded-b-2xl p-2 flex flex-col-reverse items-center gap-2 shadow-inner">
            {items.length === 0 ? (
              <div className="text-slate-600 text-xs italic my-auto">
                Stack is Empty
              </div>
            ) : (
              items.map((item, idx) => {
                const isTop = idx === items.length - 1;
                return (
                  <div
                    key={idx}
                    className={`w-full py-2.5 px-4 rounded-xl border text-center font-mono font-bold text-sm transition-all duration-300 ${
                      isTop
                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30 scale-105 animate-fadeIn'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    {item}
                  </div>
                );
              })
            )}
          </div>

          <span className="text-[11px] text-slate-500 font-mono mt-2">
            Size: {items.length} elements
          </span>
        </div>
      </div>

      {/* Action Banner */}
      {state.action && (
        <div className="p-3 bg-purple-950/30 border border-purple-800/30 rounded-xl text-center text-xs font-semibold text-purple-300">
          Action: <span className="uppercase text-white font-mono">{state.action}</span>
        </div>
      )}

      {/* Explanatory summary */}
      <div className="flex items-center justify-center gap-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
        <span>Push = O(1)</span>
        <span>•</span>
        <span>Pop = O(1)</span>
        <span>•</span>
        <span>Peek = O(1)</span>
      </div>
    </div>
  );
};
