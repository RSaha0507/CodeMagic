export type DataStructureType =
  | 'array'
  | 'linked-list'
  | 'stack'
  | 'queue'
  | 'heap'
  | 'tree'
  | 'hash-map'
  | 'matrix';

export type AlgorithmCategory =
  | 'searching'
  | 'sorting'
  | 'linked-list'
  | 'stack-queue'
  | 'heaps-trees'
  | 'two-pointers'
  | 'dynamic-programming'
  | 'graphs';

export interface VisualStep {
  stepIndex: number;
  highlightedLine: number; // 1-based line in the code
  explanation: string;
  beginnerNote?: string; // Human intuitive plain English explanation
  phase?: string; // e.g. "Partitioning", "Swapping", "Divide Step", "Merge Step"
  loopIteration?: {
    current: number;
    total?: number;
    subIteration?: number;
  };
  recursionDepth?: number;
  variables: Record<string, string | number | boolean | null | undefined>;
  
  // Array & Sorting / Searching specific state
  arrayState?: {
    values: number[];
    activeIndices?: number[];
    comparingIndices?: number[];
    sortedIndices?: number[];
    pivotIndex?: number;
    pointers?: { name: string; index: number; color?: string }[];
    foundIndex?: number;
    searchRange?: [number, number]; // [left, right]
    secondaryArray?: number[]; // For Merge Sort aux array, Counting Sort count array
    secondaryLabel?: string;
  };

  // Linked List specific state
  linkedListState?: {
    nodes: { id: string; value: number | string; nextId: string | null; prevId?: string | null }[];
    pointers: { name: string; nodeId: string | null; color?: string }[];
    highlightNodeIds?: string[];
    actionDescription?: string;
  };

  // Stack / Queue specific state
  stackQueueState?: {
    type: 'stack' | 'queue' | 'deque';
    items: (number | string)[];
    activeItemIndex?: number;
    action?: 'push' | 'pop' | 'enqueue' | 'dequeue' | 'peek';
  };

  // Heap / Tree specific state
  heapState?: {
    array: number[];
    activeIndices?: number[];
    swappingIndices?: [number, number];
    isMaxHeap?: boolean;
  };

  // Binary Search Tree / General Tree state
  treeState?: {
    nodes: {
      id: number;
      value: number;
      left?: number | null;
      right?: number | null;
      isHighlighted?: boolean;
      isVisited?: boolean;
      status?: 'current' | 'target' | 'visited' | 'inserted';
    }[];
    rootId: number;
    currentVal?: number;
  };
}

export interface AlgorithmVisualizerData {
  id: string;
  title: string;
  category: AlgorithmCategory;
  structureType: DataStructureType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  description: string;
  mentalModel: string; // The beginner-friendly intuition (e.g. "Like sorting playing cards in hand")
  keyTakeaways: string[];
  interviewFrequency: 'High' | 'Very High' | 'Medium';
  relatedProblemId?: string;
  codeSnippets: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  defaultInput: any;
  generateSteps: (customInput?: any) => VisualStep[];
}

export interface InterviewPattern {
  id: string;
  name: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: 'High' | 'Very High' | 'Essential';
  summary: string;
  whenToUse: string[];
  keyTemplateCode: string;
  classicProblems: {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    problemId?: string;
    companyTags: string[];
  }[];
  visualWorkflow: {
    stepTitle: string;
    description: string;
  }[];
  commonPitfalls: string[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  category: AlgorithmCategory;
  algorithmId: string;
  level: number;
  summary: string;
  prerequisites: string[];
  estimatedMinutes: number;
  badge: string;
  keyConcepts: string[];
}
