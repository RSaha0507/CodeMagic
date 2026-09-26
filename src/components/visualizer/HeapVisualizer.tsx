import React from 'react';
import { Network, Database } from 'lucide-react';
import { VisualStep } from '../../types/visualizer';

interface HeapVisualizerProps {
  currentStep: VisualStep;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ currentStep }) => {
  const state = currentStep.heapState;
  if (!state) return null;

  const array = state.array || [];

  // Calculate coordinates for binary tree nodes up to 4 levels
  const getNodeCoordinates = (idx: number) => {
    // level: 0 (root), 1, 2, 3
    const level = Math.floor(Math.log2(idx + 1));
    const positionInLevel = idx - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);

    const totalWidth = 500;
    const spacing = totalWidth / (nodesInLevel + 1);
    const x = (positionInLevel + 1) * spacing;
    const y = 35 + level * 55;

    return { x, y, level };
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-4">
      {/* 1. Binary Tree SVG Graph */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
        <div className="absolute top-0 left-2 text-[11px] font-bold text-slate-400 flex items-center space-x-1.5">
          <Network className="w-3.5 h-3.5 text-purple-400" />
          <span>Tree Representation</span>
        </div>

        <svg viewBox="0 0 500 220" className="w-full h-full max-h-[220px]">
          {/* Branch lines */}
          {array.map((_, idx) => {
            const leftChild = 2 * idx + 1;
            const rightChild = 2 * idx + 2;
            const parentCoord = getNodeCoordinates(idx);

            return (
              <g key={`lines-${idx}`}>
                {leftChild < array.length && (
                  <line
                    x1={parentCoord.x}
                    y1={parentCoord.y}
                    x2={getNodeCoordinates(leftChild).x}
                    y2={getNodeCoordinates(leftChild).y}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                )}
                {rightChild < array.length && (
                  <line
                    x1={parentCoord.x}
                    y1={parentCoord.y}
                    x2={getNodeCoordinates(rightChild).x}
                    y2={getNodeCoordinates(rightChild).y}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}

          {/* Node circles */}
          {array.map((val, idx) => {
            const { x, y } = getNodeCoordinates(idx);
            const isActive = state.activeIndices?.includes(idx);
            const isSwapping = state.swappingIndices?.includes(idx as any);

            return (
              <g key={`node-${idx}`} className="transition-all duration-300">
                <circle
                  cx={x}
                  cy={y}
                  r="18"
                  fill={isSwapping ? '#ec4899' : isActive ? '#9333ea' : '#1e293b'}
                  stroke={isSwapping ? '#f472b6' : isActive ? '#c084fc' : '#475569'}
                  strokeWidth="2.5"
                  className={isActive || isSwapping ? 'animate-pulse' : ''}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {val}
                </text>
                <text
                  x={x}
                  y={y - 22}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  [{idx}]
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 2. Backing 1D Array */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>Backing 1D Memory Array</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-2">
          {array.map((val, idx) => {
            const isActive = state.activeIndices?.includes(idx);
            const isSwapping = state.swappingIndices?.includes(idx as any);

            return (
              <div
                key={idx}
                className={`flex flex-col items-center border rounded-lg overflow-hidden transition-all duration-300 min-w-[42px] ${
                  isSwapping
                    ? 'border-pink-500 bg-pink-950/60 scale-105'
                    : isActive
                    ? 'border-purple-500 bg-purple-950/60 scale-105'
                    : 'border-slate-800 bg-slate-900'
                }`}
              >
                <div className="py-1 px-2 text-xs font-mono font-bold text-white text-center">
                  {val}
                </div>
                <div className="py-0.5 px-1 bg-slate-950 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 text-center w-full">
                  {idx}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helper Formulas */}
      <div className="flex flex-wrap items-center justify-around gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
        <span>Parent(i) = ⌊(i-1)/2⌋</span>
        <span>•</span>
        <span>LeftChild(i) = 2i + 1</span>
        <span>•</span>
        <span>RightChild(i) = 2i + 2</span>
      </div>
    </div>
  );
};
