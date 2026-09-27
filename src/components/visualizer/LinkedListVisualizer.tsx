import React from 'react';
import { VisualStep } from '../../types/visualizer';

interface LinkedListVisualizerProps {
  currentStep: VisualStep;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ currentStep }) => {
  const state = currentStep.linkedListState;
  if (!state) return null;

  const nodes = state.nodes || [];

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      {/* Node Chain */}
      <div className="flex-1 flex items-center justify-center overflow-x-auto py-8 px-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {nodes.map((node, idx) => {
            const isHighlighted = state.highlightNodeIds?.includes(node.id);
            const pointersAtNode = (state.pointers || []).filter((p) => p.nodeId === node.id);

            return (
              <div key={node.id} className="flex items-center space-x-2 sm:space-x-4">
                {/* Node Box */}
                <div className="flex flex-col items-center">
                  {/* Pointers above node */}
                  <div className="h-8 flex flex-col justify-end items-center mb-1 space-y-0.5">
                    {pointersAtNode.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        style={{ backgroundColor: p.color || '#a855f7' }}
                        className="text-[10px] font-bold text-white px-2 py-0.5 rounded shadow uppercase tracking-wider animate-bounce"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>

                  {/* Node Structure: Value | Next Pointer */}
                  <div
                    className={`flex items-center rounded-xl border-2 overflow-hidden shadow-xl transition-all duration-300 ${
                      isHighlighted
                        ? 'border-purple-400 bg-purple-950/70 shadow-purple-500/40 scale-110'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {/* Val Field */}
                    <div className="px-4 py-3 bg-slate-950/60 font-mono font-bold text-base text-slate-100 min-w-[48px] text-center">
                      {node.value}
                    </div>
                    {/* Next Field */}
                    <div className="px-2.5 py-3 border-l border-slate-800 bg-slate-900 text-[10px] font-mono text-purple-400 flex items-center justify-center">
                      {node.nextId ? '•' : 'null'}
                    </div>
                  </div>

                  {/* ID */}
                  <span className="text-[10px] text-slate-500 font-mono mt-1.5">
                    Node #{idx}
                  </span>
                </div>

                {/* Arrow to Next */}
                {idx < nodes.length - 1 && (
                  <div className="flex flex-col items-center">
                    <span className={isHighlighted ? 'text-purple-400' : 'text-slate-600'}>next</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Null Terminator */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-600">next</span>
            <div className="px-3 py-2 bg-slate-950 border border-slate-800 text-slate-500 font-mono text-xs rounded-lg">
              NULL
            </div>
          </div>
        </div>
      </div>

      {/* Action / Pointer Notice */}
      {state.actionDescription && (
        <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl text-center text-xs font-medium text-purple-300">
          ⚡ {state.actionDescription}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-purple-600" />
          <span>curr (Current Node)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-slate-500" />
          <span>prev (Previous Node)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-sky-400" />
          <span>nextTemp (Lookahead Node)</span>
        </div>
      </div>
    </div>
  );
};
