import { RoadmapNode } from '../types/visualizer';

export interface CareerTrack {
  id: string;
  title: string;
  roleTarget: string;
  description: string;
  totalModules: number;
  estimatedHours: number;
}

export const careerTracks: CareerTrack[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer DSA Career Path',
    roleTarget: 'L3 / L4 SWE (Google, Meta, Amazon, Startups)',
    description:
      'Master core data structures and algorithms visually with code-level step execution, time/space complexity analysis, and direct online judge problem links.',
    totalModules: 6,
    estimatedHours: 40,
  },
];

export const roadmapNodes: RoadmapNode[] = [
  {
    id: 'stage-1-arrays-searching',
    title: 'Searching & Binary Search',
    category: 'searching',
    algorithmId: 'binary-search',
    level: 1,
    summary: 'Master logarithmic search, boundary conditions (left <= right), and divide-and-conquer fundamentals.',
    prerequisites: ['Basic Loops & Conditions'],
    estimatedMinutes: 30,
    badge: 'Logarithmic Hunter',
    keyConcepts: ['O(log N) Time', 'Midpoint Calculation', 'Lower & Upper Bound', 'Search Space Reduction'],
  },
  {
    id: 'stage-2-sorting-bubble',
    title: 'Bubble Sort & Inversions',
    category: 'sorting',
    algorithmId: 'bubble-sort',
    level: 2,
    summary: 'Understand comparison-based adjacent swapping, early termination heuristics, and quadratic complexity.',
    prerequisites: ['Nested Loops', 'Array Indexing'],
    estimatedMinutes: 25,
    badge: 'Swap Specialist',
    keyConcepts: ['O(N²) Worst Case', 'Stable Sorting', 'Adjacent Swaps', 'Early Break'],
  },
  {
    id: 'stage-3-sorting-quick',
    title: 'Quick Sort & Partitioning',
    category: 'sorting',
    algorithmId: 'quick-sort',
    level: 3,
    summary: 'Master Lomuto and Hoare pivot partitioning, recursion trees, and in-place divide and conquer.',
    prerequisites: ['Recursion', 'Two Pointers'],
    estimatedMinutes: 45,
    badge: 'Divide & Conquer Master',
    keyConcepts: ['Lomuto Partition', 'Pivot Selection', 'O(N log N) Average', 'In-Place Partitioning'],
  },
  {
    id: 'stage-4-linked-lists',
    title: 'Linked List Pointer Manipulation',
    category: 'linked-list',
    algorithmId: 'linked-list-reversal',
    level: 4,
    summary: 'Master reference rewiring, three-pointer techniques (prev, curr, nextTemp), and in-place list reversal.',
    prerequisites: ['Pointers / References', 'Memory Allocation'],
    estimatedMinutes: 40,
    badge: 'Pointer Alchemist',
    keyConcepts: ['Singly Linked List', 'Pointer Reversal', 'O(1) Extra Space', 'Head & Tail Nodes'],
  },
  {
    id: 'stage-5-stacks-queues',
    title: 'Stacks & Balanced Parsing',
    category: 'stack-queue',
    algorithmId: 'stack-evaluation',
    level: 5,
    summary: 'Understand LIFO semantics, recursive call emulation, delimiter matching, and monotonic stacks.',
    prerequisites: ['Arrays', 'Strings'],
    estimatedMinutes: 35,
    badge: 'LIFO Engineer',
    keyConcepts: ['LIFO Structure', 'Bracket Validation', 'O(N) Push/Pop', 'Monotonic Stack'],
  },
  {
    id: 'stage-6-heaps-trees',
    title: 'Binary Heaps & Priority Queues',
    category: 'heaps-trees',
    algorithmId: 'binary-heap',
    level: 6,
    summary: 'Master complete binary trees mapped into 1D arrays, swim (bubble up) and sink (heapify down) operations.',
    prerequisites: ['Binary Trees', 'Array Indexing Math (2i+1, 2i+2)'],
    estimatedMinutes: 50,
    badge: 'Priority Grandmaster',
    keyConcepts: ['Min/Max Heap Property', 'O(log N) Insert/Extract', 'Swim / Bubble Up', 'Array Tree Mapping'],
  },
];
