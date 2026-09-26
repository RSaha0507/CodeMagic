import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Sliders,
  Code2,
  Cpu,
  Zap,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Shuffle,
} from 'lucide-react';
import { AlgorithmVisualizerData, VisualStep } from '../../types/visualizer';
import { ArrayVisualizer } from './ArrayVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { HeapVisualizer } from './HeapVisualizer';

interface VisualizerStudioProps {
  algorithm: AlgorithmVisualizerData;
  onBack: () => void;
  onSolveProblem?: (problemId: string) => void;
}

export const VisualizerStudio: React.FC<VisualizerStudioProps> = ({
  algorithm,
  onBack,
  onSolveProblem,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');
  const [steps, setSteps] = useState<VisualStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 4x
  const [customInput, setCustomInput] = useState<any>(algorithm.defaultInput);

  const timerRef = useRef<any>(null);

  // Generate steps on mount or input change
  useEffect(() => {
    const generated = algorithm.generateSteps(customInput);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [algorithm, customInput]);

  // Autoplay ticker
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleRandomizeInput = () => {
    if (algorithm.structureType === 'array') {
      const count = 7 + Math.floor(Math.random() * 4);
      const randomArr = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
      if (algorithm.id === 'binary-search') {
        randomArr.sort((a, b) => a - b);
        const target = randomArr[Math.floor(Math.random() * randomArr.length)];
        setCustomInput({ array: randomArr, target });
      } else {
        setCustomInput({ array: randomArr });
      }
    } else if (algorithm.structureType === 'linked-list') {
      const randomNodes = Array.from({ length: 5 }, () => Math.floor(Math.random() * 80) + 10);
      setCustomInput({ nodes: randomNodes });
    } else if (algorithm.structureType === 'heap') {
      const initial = Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 5).sort((a, b) => a - b);
      const insertVal = Math.floor(Math.random() * 20) + 1;
      setCustomInput({ initialHeap: initial, insertVal });
    }
  };

  const codeString = algorithm.codeSnippets[selectedLanguage] || algorithm.codeSnippets.javascript;
  const codeLines = codeString.split('\n');

  return (
    <div className="max-w-[1700px] mx-auto px-3 sm:px-6 py-4 flex flex-col h-[calc(100vh-4.5rem)]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Career Roadmap</span>
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <h1 className="text-base font-bold text-white flex items-center space-x-2">
            <span>{algorithm.title}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 uppercase">
              {algorithm.structureType}
            </span>
          </h1>
        </div>

        {/* Action button & Complexity badges */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">
              Time: {algorithm.timeComplexity.average}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-indigo-400">
              Space: {algorithm.spaceComplexity}
            </span>
          </div>

          <button
            onClick={handleRandomizeInput}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
            title="Generate new random data"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-400" />
            <span>Randomize</span>
          </button>

          {algorithm.relatedProblemId && onSolveProblem && (
            <button
              onClick={() => onSolveProblem(algorithm.relatedProblemId!)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-purple-600/20 transition hover:scale-[1.02]"
            >
              <span>Practice on Judge</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left Column: Synchronized Code & Variable Inspector */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-lg">
          {/* Header with Language Selector */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#131b2e] px-4 py-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Code Execution Stream</span>
            </div>

            <div className="flex items-center space-x-1">
              {(['javascript', 'python', 'cpp', 'java'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded transition capitalize ${
                    selectedLanguage === lang
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'javascript' ? 'JS' : lang === 'python' ? 'Python' : lang === 'cpp' ? 'C++' : 'Java'}
                </button>
              ))}
            </div>
          </div>

          {/* Synchronized Code View */}
          <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-slate-200 space-y-0.5 bg-[#0b0f19]">
            {codeLines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isLineActive = currentStep?.highlightedLine === lineNum;

              return (
                <div
                  key={idx}
                  className={`flex items-center px-2 py-0.5 rounded transition-all duration-200 ${
                    isLineActive
                      ? 'bg-purple-600/30 border-l-4 border-purple-500 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900/50'
                  }`}
                >
                  <span className="w-8 text-slate-600 select-none text-right pr-3 text-[10px]">
                    {lineNum}
                  </span>
                  <pre className="flex-1 overflow-x-auto whitespace-pre font-mono">
                    {lineText || ' '}
                  </pre>
                </div>
              );
            })}
          </div>

          {/* Live Variable Inspector Panel */}
          <div className="border-t border-slate-800 bg-[#131b2e] p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Active Execution State & Variables</span>
              </span>
              <span className="font-mono text-slate-500">
                Step {currentStepIndex + 1} / {steps.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentStep &&
                Object.entries(currentStep.variables).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono"
                  >
                    <span className="text-purple-400 font-bold">{key}:</span>
                    <span className="text-slate-200">{val !== null && val !== undefined ? String(val) : 'null'}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Canvas & Thought Commentary */}
        <div className="lg:col-span-7 flex flex-col space-y-3 min-h-0">
          {/* Real-time Thought Bubble / Commentary */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0f172a] border border-purple-800/40 rounded-xl shadow-lg flex items-start space-x-3">
            <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Algorithm Execution Thought Trace
              </div>
              <p className="text-sm font-medium text-slate-200 mt-0.5 leading-snug">
                {currentStep?.explanation}
              </p>
            </div>
          </div>

          {/* Visualizer Canvas Area */}
          <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-xl overflow-hidden flex flex-col min-h-[300px]">
            {currentStep && (
              <>
                {algorithm.structureType === 'array' && (
                  <ArrayVisualizer currentStep={currentStep} />
                )}
                {algorithm.structureType === 'linked-list' && (
                  <LinkedListVisualizer currentStep={currentStep} />
                )}
                {algorithm.structureType === 'stack' && (
                  <StackVisualizer currentStep={currentStep} />
                )}
                {algorithm.structureType === 'heap' && (
                  <HeapVisualizer currentStep={currentStep} />
                )}
              </>
            )}
          </div>

          {/* Master Playback Controls */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            {/* Play, Step, Reset Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
                }}
                disabled={currentStepIndex === 0}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition disabled:opacity-40"
                title="Step Back"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-md shadow-purple-600/30 flex items-center space-x-2 transition hover:scale-105"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Auto Play</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1));
                }}
                disabled={currentStepIndex >= steps.length - 1}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition disabled:opacity-40"
                title="Step Forward"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber Timeline */}
            <div className="flex-1 flex items-center space-x-3 w-full sm:w-auto px-2">
              <span className="text-[11px] font-mono text-slate-500">0</span>
              <input
                type="range"
                min="0"
                max={Math.max(0, steps.length - 1)}
                value={currentStepIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentStepIndex(parseInt(e.target.value));
                }}
                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-[11px] font-mono text-slate-400 font-bold">
                {currentStepIndex + 1}/{steps.length}
              </span>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded font-mono font-semibold transition ${
                    playbackSpeed === spd
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
