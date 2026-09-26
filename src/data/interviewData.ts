import { InterviewPattern } from '../types/visualizer';

export const interviewPatterns: InterviewPattern[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers Pattern',
    category: 'Arrays & Strings',
    difficulty: 'Easy',
    frequency: 'Essential',
    summary:
      'Uses two reference pointers iterating across data structures in tandem (either converging inward from both ends or advancing at differing speeds) to eliminate nested loops and achieve O(N) linear time.',
    whenToUse: [
      'Input array is sorted (or can be sorted).',
      'Searching for pairs/triplets satisfying an equation (e.g. nums[i] + nums[j] == target).',
      'Inverting or palindrome checking in-place.',
      'Trapping water or finding max area between boundaries.',
    ],
    keyTemplateCode: `function twoPointersConverging(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      return [left, right]; // Found target pair!
    } else if (sum < target) {
      left++; // Need larger sum
    } else {
      right--; // Need smaller sum
    }
  }
  return [];
}`,
    classicProblems: [
      { title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Easy', problemId: 'two-sum', companyTags: ['Google', 'Amazon', 'Meta'] },
      { title: '3Sum', difficulty: 'Medium', problemId: 'two-sum', companyTags: ['Meta', 'Apple', 'Uber'] },
      { title: 'Container With Most Water', difficulty: 'Medium', problemId: 'trapping-rain-water', companyTags: ['Google', 'Microsoft'] },
      { title: 'Trapping Rain Water', difficulty: 'Hard', problemId: 'trapping-rain-water', companyTags: ['Google', 'Goldman Sachs'] },
    ],
    visualWorkflow: [
      { stepTitle: '1. Position Boundaries', description: 'Place left pointer at index 0 and right pointer at index N-1.' },
      { stepTitle: '2. Evaluate Criterion', description: 'Compute current metric (sum, area, or character match).' },
      { stepTitle: '3. Directional Decision', description: 'If metric < target: increment left. If metric > target: decrement right.' },
      { stepTitle: '4. Termination', description: 'Stop immediately when left meets right, guaranteeing O(N) runtime.' },
    ],
    commonPitfalls: [
      'Forgetting that array MUST be sorted first for converging pointer arithmetic.',
      'Off-by-one errors with left <= right vs left < right loop conditions.',
      'Failing to handle duplicate items in problems like 3Sum (leading to duplicate triplets).',
    ],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window Pattern',
    category: 'Subarrays & Substrings',
    difficulty: 'Medium',
    frequency: 'Essential',
    summary:
      'Maintains a dynamic or fixed contiguous window of elements [left...right], expanding right to ingest elements and contracting left when window constraints are violated.',
    whenToUse: [
      'Problems asking for longest, shortest, or target contiguous subarray or substring.',
      'Counting subarrays with exactly K distinct elements or sum constraint.',
      'String anagrams, substring matches, or maximum sum of subarray of size K.',
    ],
    keyTemplateCode: `function slidingWindow(s) {
  let left = 0;
  let maxLen = 0;
  const windowMap = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    windowMap.set(char, (windowMap.get(char) || 0) + 1);

    // Shrink window while condition is violated
    while (windowMap.get(char) > 1) {
      const leftChar = s[left];
      windowMap.set(leftChar, windowMap.get(leftChar) - 1);
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    classicProblems: [
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', problemId: 'longest-substring-without-repeating-characters', companyTags: ['Google', 'Amazon', 'Bloomberg'] },
      { title: 'Minimum Window Substring', difficulty: 'Hard', companyTags: ['Meta', 'Netflix', 'Airbnb'] },
      { title: 'Max Consecutive Ones III', difficulty: 'Medium', companyTags: ['Google', 'Meta'] },
    ],
    visualWorkflow: [
      { stepTitle: '1. Window Expansion', description: 'Advance right pointer by 1, including new element in current window state.' },
      { stepTitle: '2. Constraint Validation', description: 'Check if current window satisfies problem condition (e.g. unique items, <= K).' },
      { stepTitle: '3. Window Contraction', description: 'While invalid, increment left pointer and decrement its state from the window.' },
      { stepTitle: '4. Update Global Optimum', description: 'Compute max/min window size right - left + 1.' },
    ],
    commonPitfalls: [
      'Using a while loop inside the for loop and fearing it is O(N²): both pointers only move forward at most N times, so it is strictly O(2N) = O(N).',
      'Forgetting to decrement character counts from the frequency map when shrinking left.',
    ],
  },
  {
    id: 'fast-and-slow-pointers',
    name: 'Fast & Slow Pointers (Floyd\'s Tortoise and Hare)',
    category: 'Linked Lists & Cycles',
    difficulty: 'Medium',
    frequency: 'Very High',
    summary:
      'Uses two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps) to detect cycles, find middle nodes, or identify starting points of loops.',
    whenToUse: [
      'Detecting loops/cycles in singly linked lists or integer transformation sequences (Happy Number).',
      'Finding the exact middle node of a linked list in a single pass.',
      'Finding the Kth node from the end or palindrome linked list checks.',
    ],
    keyTemplateCode: `function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;        // 1 step
    fast = fast.next.next;   // 2 steps

    if (slow === fast) {
      return true; // Cycle detected!
    }
  }
  return false; // Reached end, no cycle
}`,
    classicProblems: [
      { title: 'Linked List Cycle', difficulty: 'Easy', companyTags: ['Microsoft', 'Amazon'] },
      { title: 'Middle of the Linked List', difficulty: 'Easy', companyTags: ['Adobe', 'Apple'] },
      { title: 'Find the Duplicate Number', difficulty: 'Medium', companyTags: ['Google', 'Amazon'] },
    ],
    visualWorkflow: [
      { stepTitle: '1. Dual Pointer Init', description: 'Start both slow and fast at head.' },
      { stepTitle: '2. Speed Differential', description: 'Advance slow by 1 and fast by 2 on each tick.' },
      { stepTitle: '3. Collision Verification', description: 'If fast catches slow, a loop exists.' },
    ],
    commonPitfalls: [
      'Null pointer exceptions: always check fast !== null && fast.next !== null in loop condition.',
    ],
  },
  {
    id: 'binary-tree-bfs',
    name: 'Tree Breadth-First Search (Level Order)',
    category: 'Trees & Graphs',
    difficulty: 'Medium',
    frequency: 'Essential',
    summary:
      'Uses a Queue (FIFO) to traverse a tree layer by layer. Guarantees finding shortest paths in unweighted graphs and organizing level-by-level outputs.',
    whenToUse: [
      'Level order traversal of trees.',
      'Finding shortest path / minimum steps in unweighted grids (Word Ladder, Knight Moves).',
      'Connecting nodes at the same horizontal depth level.',
    ],
    keyTemplateCode: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length; // Capture snapshot of current level size
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`,
    classicProblems: [
      { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', problemId: 'valid-parentheses', companyTags: ['Amazon', 'Microsoft', 'Meta'] },
      { title: 'Binary Tree Right Side View', difficulty: 'Medium', companyTags: ['Meta', 'Bloomberg'] },
      { title: 'Word Ladder', difficulty: 'Hard', companyTags: ['Amazon', 'Google'] },
    ],
    visualWorkflow: [
      { stepTitle: '1. Seed Queue with Root', description: 'Push root node into FIFO queue.' },
      { stepTitle: '2. Level Sizing', description: 'Freeze levelSize = queue.length to process exact horizontal level.' },
      { stepTitle: '3. Dequeue and Child Ingestion', description: 'Pop front node, record value, enqueue left & right children.' },
    ],
    commonPitfalls: [
      'Using queue.length directly in the loop without freezing levelSize first (since queue size grows dynamically).',
    ],
  },
];
