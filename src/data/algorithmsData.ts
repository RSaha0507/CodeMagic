import { AlgorithmVisualizerData, VisualStep } from '../types/visualizer';

export const algorithmsCatalog: Record<string, AlgorithmVisualizerData> = {
  // ==========================================
  // SEARCHING ALGORITHMS
  // ==========================================
  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'searching',
    structureType: 'array',
    difficulty: 'Easy',
    timeComplexity: { best: 'O(1)', average: 'O(log N)', worst: 'O(log N)' },
    spaceComplexity: 'O(1)',
    description:
      'A divide-and-conquer search algorithm for sorted lists. Repeatedly inspects the exact midpoint and discards the entire left or right half of remaining elements.',
    mentalModel:
      'Like opening a 1,000-page dictionary directly in the exact middle. If the target word comes before, throw away the right 500 pages and repeat with the remaining 500.',
    keyTakeaways: [
      'Array MUST be sorted beforehand.',
      'Always calculate mid safely using left + floor((right - left) / 2) to prevent integer overflow.',
      'Shrinks the candidate search space by exactly 50% on every single step.',
    ],
    interviewFrequency: 'Very High',
    relatedProblemId: 'two-sum',
    codeSnippets: {
      javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid; // Target Found!
    } else if (arr[mid] < target) {
      left = mid + 1; // Discard left half
    } else {
      right = mid - 1; // Discard right half
    }
  }
  return -1; // Target does not exist
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
      cpp: `int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      java: `public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    },
    defaultInput: {
      array: [3, 8, 14, 22, 35, 47, 59, 68, 77, 89, 94],
      target: 47,
    },
    generateSteps: (input = { array: [3, 8, 14, 22, 35, 47, 59, 68, 77, 89, 94], target: 47 }) => {
      const arr = [...input.array].sort((a, b) => a - b);
      const target = Number(input.target);
      const steps: VisualStep[] = [];
      let left = 0;
      let right = arr.length - 1;
      let stepCount = 1;
      let iteration = 1;

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 2,
        phase: 'Initialization',
        explanation: `Initialize boundary pointers: left = 0 (val: ${arr[0]}), right = ${right} (val: ${arr[right]}). Searching for target ${target}.`,
        beginnerNote: `We start by looking at the whole sorted list from index 0 to index ${right}.`,
        variables: { left, right, mid: null, target, 'arr[mid]': null },
        arrayState: {
          values: arr,
          searchRange: [left, right],
          pointers: [
            { name: 'left', index: left, color: '#3b82f6' },
            { name: 'right', index: right, color: '#ec4899' },
          ],
        },
      });

      let found = false;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 6,
          phase: 'Midpoint Calculation',
          loopIteration: { current: iteration, total: Math.ceil(Math.log2(arr.length + 1)) },
          explanation: `Iteration ${iteration}: Calculate midpoint: mid = floor((${left} + ${right}) / 2) = ${mid}. Inspecting arr[${mid}] = ${arr[mid]}.`,
          beginnerNote: `We pick the middle item ${arr[mid]} to compare against our target ${target}.`,
          variables: { left, right, mid, target, 'arr[mid]': arr[mid] },
          arrayState: {
            values: arr,
            searchRange: [left, right],
            activeIndices: [mid],
            pointers: [
              { name: 'left', index: left, color: '#3b82f6' },
              { name: 'mid', index: mid, color: '#a855f7' },
              { name: 'right', index: right, color: '#ec4899' },
            ],
          },
        });

        if (arr[mid] === target) {
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 8,
            phase: 'Found Target',
            explanation: `🎉 Direct Match Found! arr[${mid}] === ${target}. Returning index ${mid}.`,
            beginnerNote: `The middle element equals our target! Search ends immediately in O(log N) time.`,
            variables: { left, right, mid, target, 'arr[mid]': arr[mid], result: mid },
            arrayState: {
              values: arr,
              foundIndex: mid,
              activeIndices: [mid],
              pointers: [{ name: 'FOUND', index: mid, color: '#10b981' }],
            },
          });
          found = true;
          break;
        } else if (arr[mid] < target) {
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 10,
            phase: 'Adjust Left Boundary',
            explanation: `arr[${mid}] (${arr[mid]}) is LESS than target ${target}. The target must lie in the right half. Move left to ${mid + 1}.`,
            beginnerNote: `Since the list is sorted and ${arr[mid]} is too small, anything to the left of index ${mid} is also too small. Discard them all!`,
            variables: { left: mid + 1, right, mid, target, 'arr[mid]': arr[mid] },
            arrayState: {
              values: arr,
              searchRange: [mid + 1, right],
              comparingIndices: [mid],
              pointers: [
                { name: 'left', index: mid + 1, color: '#3b82f6' },
                { name: 'right', index: right, color: '#ec4899' },
              ],
            },
          });
          left = mid + 1;
        } else {
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 12,
            phase: 'Adjust Right Boundary',
            explanation: `arr[${mid}] (${arr[mid]}) is GREATER than target ${target}. The target must lie in the left half. Move right to ${mid - 1}.`,
            beginnerNote: `Since ${arr[mid]} is too large, everything to the right is also too large. Discard the right half!`,
            variables: { left, right: mid - 1, mid, target, 'arr[mid]': arr[mid] },
            arrayState: {
              values: arr,
              searchRange: [left, mid - 1],
              comparingIndices: [mid],
              pointers: [
                { name: 'left', index: left, color: '#3b82f6' },
                { name: 'right', index: right, color: '#ec4899' },
              ],
            },
          });
          right = mid - 1;
        }
        iteration++;
      }

      if (!found) {
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 15,
          phase: 'Exhausted',
          explanation: `left (${left}) > right (${right}). Search window collapsed. Target ${target} does not exist in the array. Return -1.`,
          beginnerNote: `We checked all possible locations where ${target} could have been, but it was not found.`,
          variables: { left, right, result: -1 },
          arrayState: { values: arr, pointers: [] },
        });
      }

      return steps;
    },
  },

  'linear-search': {
    id: 'linear-search',
    title: 'Linear Search',
    category: 'searching',
    structureType: 'array',
    difficulty: 'Easy',
    timeComplexity: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
    spaceComplexity: 'O(1)',
    description:
      'The simplest search algorithm. Sequentially inspects each item one by one from left to right until the target element is encountered or the end of the array is reached.',
    mentalModel:
      'Like scanning a row of books on a shelf one by one from left to right until you see the title you are looking for.',
    keyTakeaways: [
      'Works on unsorted arrays as well as sorted arrays.',
      'No preprocessing required.',
      'Time complexity is O(N), which becomes inefficient for massive datasets.',
    ],
    interviewFrequency: 'Medium',
    relatedProblemId: 'two-sum',
    codeSnippets: {
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`,
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
      cpp: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
      java: `public int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
    },
    defaultInput: {
      array: [24, 15, 88, 42, 91, 10, 56],
      target: 91,
    },
    generateSteps: (input = { array: [24, 15, 88, 42, 91, 10, 56], target: 91 }) => {
      const arr = [...input.array];
      const target = Number(input.target);
      const steps: VisualStep[] = [];
      let stepCount = 1;

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 1,
        phase: 'Start',
        explanation: `Starting Linear Search for target ${target} across array of ${arr.length} elements.`,
        beginnerNote: `We will inspect elements one by one starting from index 0.`,
        variables: { i: 0, target },
        arrayState: { values: arr },
      });

      let foundIndex = -1;
      for (let i = 0; i < arr.length; i++) {
        const isMatch = arr[i] === target;
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 3,
          phase: 'Element Comparison',
          loopIteration: { current: i + 1, total: arr.length },
          explanation: `Checking index ${i}: arr[${i}] = ${arr[i]} vs target ${target}. ${
            isMatch ? 'MATCH FOUND!' : 'Not a match, continuing next.'
          }`,
          beginnerNote: isMatch
            ? `Found it! Element ${arr[i]} at index ${i} equals target ${target}.`
            : `${arr[i]} is not ${target}. Step forward to the next index.`,
          variables: { i, 'arr[i]': arr[i], target, isMatch },
          arrayState: {
            values: arr,
            activeIndices: [i],
            foundIndex: isMatch ? i : undefined,
            pointers: [{ name: isMatch ? 'FOUND' : 'i', index: i, color: isMatch ? '#10b981' : '#3b82f6' }],
          },
        });

        if (isMatch) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex === -1) {
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 6,
          phase: 'Not Found',
          explanation: `Reached end of array without finding target ${target}. Returning -1.`,
          variables: { result: -1 },
          arrayState: { values: arr },
        });
      }

      return steps;
    },
  },

  'jump-search': {
    id: 'jump-search',
    title: 'Jump Search',
    category: 'searching',
    structureType: 'array',
    difficulty: 'Medium',
    timeComplexity: { best: 'O(1)', average: 'O(√N)', worst: 'O(√N)' },
    spaceComplexity: 'O(1)',
    description:
      'An optimal searching algorithm for sorted arrays that jumps ahead by fixed block steps of size √N, then performs backward linear search once the target is bracketed.',
    mentalModel:
      'Like flipping through a book 10 pages at a time until you overshoot your desired chapter, then flipping back page by page.',
    keyTakeaways: [
      'Optimal block jump step size is exactly m = floor(√N).',
      'Faster than Linear Search O(N) and useful when jumping backwards is expensive (e.g. tape drives or skip lists).',
    ],
    interviewFrequency: 'Medium',
    relatedProblemId: 'two-sum',
    codeSnippets: {
      javascript: `function jumpSearch(arr, target) {
  let n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;

  // Jump forward in blocks of size √n
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }

  // Linear search inside the bracketed block
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }

  if (arr[prev] === target) return prev;
  return -1;
}`,
      python: `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1
    return prev if arr[prev] == target else -1`,
      cpp: `int jumpSearch(const vector<int>& arr, int target) {
    int n = arr.size();
    int step = sqrt(n);
    int prev = 0;
    while (arr[min(step, n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        prev++;
        if (prev == min(step, n)) return -1;
    }
    return arr[prev] == target ? prev : -1;
}`,
      java: `public int jumpSearch(int[] arr, int target) {
    int n = arr.length;
    int step = (int)Math.floor(Math.sqrt(n));
    int prev = 0;
    while (arr[Math.min(step, n) - 1] < target) {
        prev = step;
        step += (int)Math.floor(Math.sqrt(n));
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        prev++;
        if (prev == Math.min(step, n)) return -1;
    }
    return arr[prev] == target ? prev : -1;
}`,
    },
    defaultInput: {
      array: [2, 7, 13, 19, 28, 34, 45, 52, 61, 73, 85, 94],
      target: 61,
    },
    generateSteps: (input = { array: [2, 7, 13, 19, 28, 34, 45, 52, 61, 73, 85, 94], target: 61 }) => {
      const arr = [...input.array].sort((a, b) => a - b);
      const target = Number(input.target);
      const steps: VisualStep[] = [];
      const n = arr.length;
      const jumpSize = Math.floor(Math.sqrt(n));
      let step = jumpSize;
      let prev = 0;
      let stepCount = 1;

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 3,
        phase: 'Step Size Setup',
        explanation: `Array size N = ${n}. Optimal jump block size step = floor(√${n}) = ${jumpSize}. Target is ${target}.`,
        beginnerNote: `Instead of checking every item, we will leap forward by ${jumpSize} elements at a time!`,
        variables: { n, stepSize: jumpSize, prev: 0, step },
        arrayState: {
          values: arr,
          searchRange: [0, Math.min(step, n) - 1],
          pointers: [{ name: 'jump', index: Math.min(step, n) - 1, color: '#ec4899' }],
        },
      });

      // Jump Phase
      while (arr[Math.min(step, n) - 1] < target) {
        const checkIdx = Math.min(step, n) - 1;
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 7,
          phase: 'Block Jumping',
          explanation: `Inspecting block boundary arr[${checkIdx}] = ${arr[checkIdx]} < target (${target}). Leaping forward by ${jumpSize} slots.`,
          beginnerNote: `The block end (${arr[checkIdx]}) is still smaller than ${target}. Jump over this entire block!`,
          variables: { prev, step, 'blockEndVal': arr[checkIdx], target },
          arrayState: {
            values: arr,
            activeIndices: [checkIdx],
            searchRange: [prev, Math.min(step + jumpSize, n) - 1],
            pointers: [
              { name: 'prev', index: prev, color: '#3b82f6' },
              { name: 'next_jump', index: Math.min(step + jumpSize, n) - 1, color: '#ec4899' },
            ],
          },
        });

        prev = step;
        step += jumpSize;
        if (prev >= n) break;
      }

      const blockEnd = Math.min(step, n);
      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 13,
        phase: 'Linear Scan Inside Block',
        explanation: `Target is bracketed within window indices [${prev}...${blockEnd - 1}]. Commencing linear search inside block.`,
        beginnerNote: `We found the block that contains our target! Now inspect elements one-by-one from index ${prev}.`,
        variables: { start: prev, end: blockEnd - 1 },
        arrayState: {
          values: arr,
          searchRange: [prev, blockEnd - 1],
          pointers: [{ name: 'scan', index: prev, color: '#eab308' }],
        },
      });

      let found = false;
      while (prev < blockEnd) {
        if (arr[prev] === target) {
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 18,
            phase: 'Found',
            explanation: `🎉 Found target ${target} at index ${prev}!`,
            beginnerNote: `Match verified at index ${prev}. Jump Search completed in O(√N) time!`,
            variables: { foundIndex: prev, target },
            arrayState: {
              values: arr,
              foundIndex: prev,
              pointers: [{ name: 'FOUND', index: prev, color: '#10b981' }],
            },
          });
          found = true;
          break;
        }
        prev++;
      }

      if (!found) {
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 19,
          phase: 'Not Found',
          explanation: `Target ${target} was not located within block. Returning -1.`,
          variables: { result: -1 },
          arrayState: { values: arr },
        });
      }

      return steps;
    },
  },

  // ==========================================
  // SORTING ALGORITHMS
  // ==========================================
  'bubble-sort': {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'sorting',
    structureType: 'array',
    difficulty: 'Easy',
    timeComplexity: { best: 'O(N)', average: 'O(N²)', worst: 'O(N²)' },
    spaceComplexity: 'O(1)',
    description:
      'A comparison sort algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Larger elements bubble up to the end.',
    mentalModel:
      'Like air bubbles rising to the surface in water. In each pass, the heaviest (largest) item floats all the way to its rightful position at the end of the array.',
    keyTakeaways: [
      'Stable sorting algorithm (preserves relative order of equal items).',
      'In-place (O(1) auxiliary space).',
      'Early termination flag (swapped boolean) allows O(N) best-case on nearly sorted data.',
    ],
    interviewFrequency: 'Medium',
    relatedProblemId: 'two-sum',
    codeSnippets: {
      javascript: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap adjacent items
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break; // Array is completely sorted
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
      java: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
    defaultInput: {
      array: [45, 12, 89, 34, 25, 76, 5],
    },
    generateSteps: (input = { array: [45, 12, 89, 34, 25, 76, 5] }) => {
      const arr = [...input.array];
      const steps: VisualStep[] = [];
      const n = arr.length;
      let stepCount = 1;
      const sortedIndices: number[] = [];

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 2,
        phase: 'Start',
        explanation: `Starting Bubble Sort on array of size ${n}.`,
        beginnerNote: `We will make multiple passes over the array, swapping adjacent numbers that are out of order.`,
        variables: { n, i: 0, j: 0 },
        arrayState: { values: [...arr] },
      });

      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 6,
            phase: 'Adjacent Comparison',
            loopIteration: { current: i + 1, total: n - 1, subIteration: j + 1 },
            explanation: `Comparing adjacent neighbors: arr[${j}] (${arr[j]}) vs arr[${j + 1}] (${arr[j + 1]}).`,
            beginnerNote: `Is ${arr[j]} greater than ${arr[j + 1]}? ${arr[j] > arr[j + 1] ? 'Yes, they need to swap places.' : 'No, they are already in the right order.'}`,
            variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swapped },
            arrayState: {
              values: [...arr],
              comparingIndices: [j, j + 1],
              sortedIndices: [...sortedIndices],
              pointers: [
                { name: 'j', index: j, color: '#3b82f6' },
                { name: 'j+1', index: j + 1, color: '#ec4899' },
              ],
            },
          });

          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            swapped = true;

            steps.push({
              stepIndex: stepCount++,
              highlightedLine: 8,
              phase: 'Swapping',
              explanation: `arr[${j}] (${temp}) > arr[${j + 1}] (${arr[j]}). Swapping elements!`,
              beginnerNote: `Exchanged ${temp} with ${arr[j]} so the larger number moves to the right.`,
              variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swapped: true },
              arrayState: {
                values: [...arr],
                activeIndices: [j, j + 1],
                sortedIndices: [...sortedIndices],
                pointers: [
                  { name: 'swapped', index: j, color: '#10b981' },
                  { name: 'swapped', index: j + 1, color: '#10b981' },
                ],
              },
            });
          }
        }
        sortedIndices.unshift(n - 1 - i);
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 13,
          phase: 'Pass Complete',
          explanation: `Pass ${i + 1} complete. Largest unsorted element is now settled at index ${n - 1 - i} (${arr[n - 1 - i]}).`,
          beginnerNote: `The end portion of the array is now locked in place as sorted!`,
          variables: { i, sortedCount: sortedIndices.length },
          arrayState: {
            values: [...arr],
            sortedIndices: [...sortedIndices],
          },
        });
        if (!swapped) break;
      }

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 15,
        phase: 'Sorted',
        explanation: '🎉 Bubble Sort complete! The entire array is sorted in ascending order.',
        beginnerNote: `All elements are placed in order with 0 inversions remaining.`,
        variables: { sorted: true },
        arrayState: {
          values: [...arr],
          sortedIndices: arr.map((_, i) => i),
        },
      });

      return steps;
    },
  },

  'selection-sort': {
    id: 'selection-sort',
    title: 'Selection Sort',
    category: 'sorting',
    structureType: 'array',
    difficulty: 'Easy',
    timeComplexity: { best: 'O(N²)', average: 'O(N²)', worst: 'O(N²)' },
    spaceComplexity: 'O(1)',
    description:
      'In-place comparison sort that divides the array into a sorted subarray on the left and unsorted subarray on the right. In each iteration, it selects the minimum element from the unsorted region and moves it to the sorted region.',
    mentalModel:
      'Like scanning a messy room of books, repeatedly finding the thinnest book and placing it onto the shelf from left to right.',
    keyTakeaways: [
      'Makes the minimum possible number of memory writes (at most N-1 swaps total).',
      'Simple to implement with low overhead for small arrays.',
      'Always O(N²) comparisons regardless of initial array ordering.',
    ],
    interviewFrequency: 'Medium',
    relatedProblemId: 'merge-intervals',
    codeSnippets: {
      javascript: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i; // Assume current index is min
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j; // Found smaller item!
      }
    }
    // Swap minimum into index i
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
      cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
      java: `public void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
    },
    defaultInput: {
      array: [64, 25, 12, 22, 11],
    },
    generateSteps: (input = { array: [64, 25, 12, 22, 11] }) => {
      const arr = [...input.array];
      const steps: VisualStep[] = [];
      const n = arr.length;
      let stepCount = 1;
      const sortedIndices: number[] = [];

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 2,
        phase: 'Start',
        explanation: `Starting Selection Sort on array [${arr.join(', ')}].`,
        beginnerNote: `We will find the smallest element in the unsorted portion and swap it to the front.`,
        variables: { n, i: 0 },
        arrayState: { values: [...arr] },
      });

      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 4,
          phase: 'Assume Min',
          loopIteration: { current: i + 1, total: n - 1 },
          explanation: `Pass ${i + 1}: Assume current index ${i} (${arr[i]}) is the minimum.`,
          beginnerNote: `Set min candidate to arr[${i}] = ${arr[i]}. We now scan rightwards to find if anything is smaller.`,
          variables: { i, minIdx, 'arr[minIdx]': arr[minIdx] },
          arrayState: {
            values: [...arr],
            sortedIndices: [...sortedIndices],
            activeIndices: [i],
            pointers: [
              { name: 'i', index: i, color: '#3b82f6' },
              { name: 'min', index: minIdx, color: '#ec4899' },
            ],
          },
        });

        for (let j = i + 1; j < n; j++) {
          const isSmaller = arr[j] < arr[minIdx];
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 6,
            phase: 'Scanning for Min',
            explanation: `Inspecting arr[${j}] (${arr[j]}) vs current minimum arr[${minIdx}] (${arr[minIdx]}). ${
              isSmaller ? 'Smaller element found!' : 'Not smaller.'
            }`,
            beginnerNote: isSmaller
              ? `Found smaller value ${arr[j]}! Updating minimum candidate to index ${j}.`
              : `${arr[j]} is >= ${arr[minIdx]}, keep current minimum index ${minIdx}.`,
            variables: { i, j, minIdx, 'arr[j]': arr[j], 'arr[minIdx]': arr[minIdx] },
            arrayState: {
              values: [...arr],
              sortedIndices: [...sortedIndices],
              comparingIndices: [j, minIdx],
              pointers: [
                { name: 'i', index: i, color: '#3b82f6' },
                { name: 'j', index: j, color: '#eab308' },
                { name: 'min', index: minIdx, color: '#ec4899' },
              ],
            },
          });

          if (isSmaller) {
            minIdx = j;
          }
        }

        if (minIdx !== i) {
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 12,
            phase: 'Swap Minimum to Front',
            explanation: `Swapping found minimum arr[${minIdx}] (${arr[i]}) into sorted slot index ${i} (was ${temp}).`,
            beginnerNote: `Placed the verified smallest unsorted element ${arr[i]} into slot ${i}.`,
            variables: { i, minIdx, swappedWith: temp },
            arrayState: {
              values: [...arr],
              sortedIndices: [...sortedIndices, i],
              activeIndices: [i, minIdx],
            },
          });
        }
        sortedIndices.push(i);
      }

      sortedIndices.push(n - 1);
      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 16,
        phase: 'Sorted',
        explanation: '🎉 Selection Sort complete! All minimums extracted in order.',
        beginnerNote: `Array is fully sorted with minimal memory writes.`,
        variables: { sorted: true },
        arrayState: {
          values: [...arr],
          sortedIndices: arr.map((_, i) => i),
        },
      });

      return steps;
    },
  },

  'insertion-sort': {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'sorting',
    structureType: 'array',
    difficulty: 'Easy',
    timeComplexity: { best: 'O(N)', average: 'O(N²)', worst: 'O(N²)' },
    spaceComplexity: 'O(1)',
    description:
      'Builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position among the already sorted elements.',
    mentalModel:
      'Like sorting playing cards in your hand. You pick up cards one by one and insert each card into its proper position relative to the cards already in your hand.',
    keyTakeaways: [
      'Extremely efficient for small arrays or arrays that are already mostly sorted (O(N) best case).',
      'Stable and in-place.',
      'Used internally by TimSort and IntroSort as the base-case sorter for small partitions.',
    ],
    interviewFrequency: 'High',
    relatedProblemId: 'merge-intervals',
    codeSnippets: {
      javascript: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i]; // Card to insert
    let j = i - 1;

    // Shift elements greater than key to the right
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key; // Place key in position
  }
  return arr;
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
      cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      java: `public void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    },
    defaultInput: {
      array: [31, 41, 59, 26, 41, 58],
    },
    generateSteps: (input = { array: [31, 41, 59, 26, 41, 58] }) => {
      const arr = [...input.array];
      const steps: VisualStep[] = [];
      const n = arr.length;
      let stepCount = 1;

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 2,
        phase: 'Start',
        explanation: `Starting Insertion Sort on array of size ${n}. Element at index 0 (${arr[0]}) is already trivially sorted.`,
        beginnerNote: `Consider index 0 as your starting hand of cards. Now pick up cards from index 1 onward.`,
        variables: { n, i: 1 },
        arrayState: {
          values: [...arr],
          sortedIndices: [0],
        },
      });

      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 4,
          phase: 'Pick Key',
          loopIteration: { current: i, total: n - 1 },
          explanation: `Selecting card to insert: key = arr[${i}] (${key}). Comparing with sorted left portion [0...${i - 1}].`,
          beginnerNote: `Picked up key = ${key}. We will slide larger elements to the right to make room for ${key}.`,
          variables: { i, key, j, 'arr[j]': arr[j] },
          arrayState: {
            values: [...arr],
            sortedIndices: Array.from({ length: i }, (_, idx) => idx),
            activeIndices: [i],
            pointers: [
              { name: 'key', index: i, color: '#ec4899' },
              { name: 'j', index: j, color: '#3b82f6' },
            ],
          },
        });

        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 8,
            phase: 'Shift Right',
            explanation: `arr[${j}] (${arr[j]}) > key (${key}). Shifting ${arr[j]} rightwards to index ${j + 1}.`,
            beginnerNote: `Slide ${arr[j]} one slot right to open up space for the smaller key (${key}).`,
            variables: { i, key, j, shiftedVal: arr[j] },
            arrayState: {
              values: [...arr],
              activeIndices: [j, j + 1],
              pointers: [
                { name: 'key', index: j, color: '#ec4899' },
                { name: 'shifted', index: j + 1, color: '#eab308' },
              ],
            },
          });
          j--;
        }

        arr[j + 1] = key;
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 11,
          phase: 'Insert Key',
          explanation: `Slot found! Inserting key (${key}) into index ${j + 1}. Subarray [0...${i}] is now sorted.`,
          beginnerNote: `Dropped key ${key} into its rightful position among the sorted cards!`,
          variables: { insertedAt: j + 1, key },
          arrayState: {
            values: [...arr],
            sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
            activeIndices: [j + 1],
          },
        });
      }

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 13,
        phase: 'Sorted',
        explanation: '🎉 Insertion Sort complete! All cards placed into exact sorted order.',
        beginnerNote: `Array is fully sorted in ascending order.`,
        variables: { sorted: true },
        arrayState: {
          values: [...arr],
          sortedIndices: arr.map((_, i) => i),
        },
      });

      return steps;
    },
  },

  'merge-sort': {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'sorting',
    structureType: 'array',
    difficulty: 'Medium',
    timeComplexity: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N log N)' },
    spaceComplexity: 'O(N)',
    description:
      'A classic divide-and-conquer algorithm. Recursively splits the array into two halves until single-element arrays remain, then merges the sorted halves back together in linear time.',
    mentalModel:
      'Like dividing a giant deck of cards in half repeatedly until you have single cards, then merging pairs of sorted cards by comparing their top cards.',
    keyTakeaways: [
      'Guaranteed O(N log N) performance in all cases (best, average, worst).',
      'Stable sorting algorithm.',
      'Requires O(N) additional auxiliary buffer memory for merging.',
    ],
    interviewFrequency: 'Very High',
    relatedProblemId: 'merge-intervals',
    codeSnippets: {
      javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res`,
      cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}`,
      java: `void merge(int[] arr, int l, int m, int r) {
    int[] left = Arrays.copyOfRange(arr, l, m + 1);
    int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}`,
    },
    defaultInput: {
      array: [38, 27, 43, 3, 9, 82, 10],
    },
    generateSteps: (input = { array: [38, 27, 43, 3, 9, 82, 10] }) => {
      const arr = [...input.array];
      const steps: VisualStep[] = [];
      let stepCount = 1;

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 1,
        phase: 'Divide',
        explanation: `Starting Merge Sort on array: [${arr.join(', ')}].`,
        beginnerNote: `Merge sort divides the array in half over and over until single items remain, then merges them back in sorted order.`,
        variables: { size: arr.length },
        arrayState: { values: [...arr] },
      });

      // Simulation of bottom-up merge passes to illustrate clearly
      function mergePass(left: number, mid: number, right: number) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 8,
          phase: 'Merge Step Preparation',
          explanation: `Merging sub-arrays: Left [${leftArr.join(', ')}] and Right [${rightArr.join(', ')}].`,
          beginnerNote: `Compare smallest elements from left and right halves and insert the smaller one into the main array.`,
          variables: { leftRange: `[${left}...${mid}]`, rightRange: `[${mid + 1}...${right}]` },
          arrayState: {
            values: [...arr],
            searchRange: [left, right],
            pointers: [
              { name: 'L', index: left, color: '#3b82f6' },
              { name: 'R', index: mid + 1, color: '#ec4899' },
            ],
            secondaryArray: [...leftArr, ...rightArr],
            secondaryLabel: 'Auxiliary Merge Buffer',
          },
        });

        let i = 0, j = 0, k = left;
        while (i < leftArr.length && j < rightArr.length) {
          if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            steps.push({
              stepIndex: stepCount++,
              highlightedLine: 12,
              phase: 'Merge Left Element',
              explanation: `Left element ${leftArr[i]} <= Right element ${rightArr[j]}. Place ${leftArr[i]} into index ${k}.`,
              beginnerNote: `Left item ${leftArr[i]} is smaller, so it gets placed first.`,
              variables: { 'left[i]': leftArr[i], 'right[j]': rightArr[j], k },
              arrayState: {
                values: [...arr],
                activeIndices: [k],
                searchRange: [left, right],
              },
            });
            i++;
          } else {
            arr[k] = rightArr[j];
            steps.push({
              stepIndex: stepCount++,
              highlightedLine: 14,
              phase: 'Merge Right Element',
              explanation: `Right element ${rightArr[j]} < Left element ${leftArr[i]}. Place ${rightArr[j]} into index ${k}.`,
              beginnerNote: `Right item ${rightArr[j]} is smaller, so it gets placed first.`,
              variables: { 'left[i]': leftArr[i], 'right[j]': rightArr[j], k },
              arrayState: {
                values: [...arr],
                activeIndices: [k],
                searchRange: [left, right],
              },
            });
            j++;
          }
          k++;
        }

        while (i < leftArr.length) {
          arr[k] = leftArr[i];
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 17,
            phase: 'Flush Remaining Left',
            explanation: `Copying remaining left element ${leftArr[i]} to index ${k}.`,
            variables: { k, val: leftArr[i] },
            arrayState: { values: [...arr], activeIndices: [k] },
          });
          i++; k++;
        }

        while (j < rightArr.length) {
          arr[k] = rightArr[j];
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 17,
            phase: 'Flush Remaining Right',
            explanation: `Copying remaining right element ${rightArr[j]} to index ${k}.`,
            variables: { k, val: rightArr[j] },
            arrayState: { values: [...arr], activeIndices: [k] },
          });
          j++; k++;
        }
      }

      // Step by step merges for demo dataset
      mergePass(0, 0, 1);
      mergePass(2, 2, 3);
      mergePass(0, 1, 3);
      mergePass(4, 4, 5);
      if (arr.length > 6) {
        mergePass(4, 5, 6);
      }
      mergePass(0, 3, arr.length - 1);

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 6,
        phase: 'Sorted',
        explanation: '🎉 Merge Sort complete! Guaranteed O(N log N) divide and conquer.',
        beginnerNote: `All divided sublists have been merged into one final sorted array.`,
        variables: { sorted: true },
        arrayState: {
          values: [...arr],
          sortedIndices: arr.map((_, i) => i),
        },
      });

      return steps;
    },
  },

  'quick-sort': {
    id: 'quick-sort',
    title: 'Quick Sort (Lomuto Partition)',
    category: 'sorting',
    structureType: 'array',
    difficulty: 'Medium',
    timeComplexity: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N²)' },
    spaceComplexity: 'O(log N)',
    description:
      'High-performance divide-and-conquer sorting algorithm that selects a "pivot" element and partitions the array into smaller elements on the left and larger elements on the right.',
    mentalModel:
      'Like organizing a line of people by height: pick one person (the pivot), put everyone shorter on the left and everyone taller on the right. Then repeat for both groups.',
    keyTakeaways: [
      'In-place sorting with O(log N) stack recursion memory.',
      'Excellent cache locality makes it the fastest general-purpose sort in practice.',
      'Worst case O(N²) occurs on already sorted arrays if picking first or last element as pivot.',
    ],
    interviewFrequency: 'Very High',
    relatedProblemId: 'merge-intervals',
    codeSnippets: {
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high]; // Lomuto pivot
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) swap(arr[++i], arr[j]);
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
      java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
    return i + 1;
}`,
    },
    defaultInput: {
      array: [50, 23, 9, 18, 61, 32],
    },
    generateSteps: (input = { array: [50, 23, 9, 18, 61, 32] }) => {
      const arr = [...input.array];
      const steps: VisualStep[] = [];
      let stepCount = 1;
      const sortedSet = new Set<number>();

      function runQuick(low: number, high: number, depth: number = 0) {
        if (low <= high) {
          if (low === high) {
            sortedSet.add(low);
            return;
          }

          const pivot = arr[high];
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 10,
            phase: 'Choose Pivot',
            recursionDepth: depth,
            explanation: `Selecting pivot = arr[${high}] (${pivot}) in sub-array range [${low}...${high}].`,
            beginnerNote: `We select ${pivot} as the benchmark pivot. Everything smaller will move left, everything larger will move right.`,
            variables: { low, high, pivot, i: low - 1 },
            arrayState: {
              values: [...arr],
              pivotIndex: high,
              searchRange: [low, high],
              sortedIndices: Array.from(sortedSet),
              pointers: [{ name: 'pivot', index: high, color: '#ec4899' }],
            },
          });

          let i = low - 1;
          for (let j = low; j < high; j++) {
            steps.push({
              stepIndex: stepCount++,
              highlightedLine: 12,
              phase: 'Partition Scan',
              recursionDepth: depth,
              explanation: `Checking arr[${j}] (${arr[j]}) vs pivot (${pivot}).`,
              beginnerNote: `Is ${arr[j]} smaller than the pivot (${pivot})? ${arr[j] < pivot ? 'Yes, increment boundary i and swap!' : 'No, leave it on the right side.'}`,
              variables: { low, high, pivot, i, j, 'arr[j]': arr[j] },
              arrayState: {
                values: [...arr],
                pivotIndex: high,
                comparingIndices: [j, high],
                searchRange: [low, high],
                pointers: [
                  { name: 'i', index: Math.max(0, i), color: '#3b82f6' },
                  { name: 'j', index: j, color: '#eab308' },
                  { name: 'pivot', index: high, color: '#ec4899' },
                ],
              },
            });

            if (arr[j] < pivot) {
              i++;
              const temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;

              steps.push({
                stepIndex: stepCount++,
                highlightedLine: 14,
                phase: 'Swap to Left Partition',
                recursionDepth: depth,
                explanation: `arr[${j}] < pivot. Increment i to ${i} and swap arr[${i}] (${temp}) with arr[${j}] (${arr[i]}).`,
                beginnerNote: `Placed ${arr[i]} into the smaller-than-pivot section on the left.`,
                variables: { low, high, pivot, i, j },
                arrayState: {
                  values: [...arr],
                  pivotIndex: high,
                  activeIndices: [i, j],
                  searchRange: [low, high],
                },
              });
            }
          }

          const temp = arr[i + 1];
          arr[i + 1] = arr[high];
          arr[high] = temp;
          const pIndex = i + 1;
          sortedSet.add(pIndex);

          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 17,
            phase: 'Place Pivot Final',
            recursionDepth: depth,
            explanation: `Pivot element ${pivot} locked into final sorted position index ${pIndex}!`,
            beginnerNote: `Pivot ${pivot} is now in its permanently correct location.`,
            variables: { pivotIndex: pIndex, pivot },
            arrayState: {
              values: [...arr],
              sortedIndices: Array.from(sortedSet),
              activeIndices: [pIndex],
            },
          });

          runQuick(low, pIndex - 1, depth + 1);
          runQuick(pIndex + 1, high, depth + 1);
        }
      }

      runQuick(0, arr.length - 1);

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 1,
        phase: 'Sorted',
        explanation: '🎉 Quick Sort completed successfully! All partitions sorted.',
        beginnerNote: `Array is fully sorted in-place.`,
        variables: {},
        arrayState: {
          values: [...arr],
          sortedIndices: arr.map((_, i) => i),
        },
      });

      return steps;
    },
  },

  // ==========================================
  // DATA STRUCTURES
  // ==========================================
  'linked-list-reversal': {
    id: 'linked-list-reversal',
    title: 'Reverse Linked List',
    category: 'linked-list',
    structureType: 'linked-list',
    difficulty: 'Easy',
    timeComplexity: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
    spaceComplexity: 'O(1)',
    description:
      'Iterative pointer manipulation algorithm that reverses the direction of every single pointer in a singly linked list in O(N) time and O(1) space.',
    mentalModel:
      'Like a conga line where everyone holds the shoulders of the person in front. To reverse the line, people turn around one by one and hold the shoulders of the person behind them.',
    keyTakeaways: [
      'Requires keeping track of 3 references simultaneously: prev, curr, nextTemp.',
      'Always save curr.next BEFORE flipping the arrow to avoid losing the remainder of the list!',
      'Returns prev as the new head when curr hits null.',
    ],
    interviewFrequency: 'Very High',
    relatedProblemId: 'valid-parentheses',
    codeSnippets: {
      javascript: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    let nextTemp = curr.next; // 1. Save next
    curr.next = prev;         // 2. Reverse arrow
    prev = curr;              // 3. Advance prev
    curr = nextTemp;          // 4. Advance curr
  }

  return prev; // New Head
}`,
      python: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
    },
    defaultInput: {
      nodes: [10, 20, 30, 40, 50],
    },
    generateSteps: (input = { nodes: [10, 20, 30, 40, 50] }) => {
      const rawNodes = input.nodes || [10, 20, 30, 40, 50];
      const steps: VisualStep[] = [];
      let stepCount = 1;

      let currentGraph = rawNodes.map((val: any, idx: number) => ({
        id: `node-${idx}`,
        value: val,
        nextId: idx < rawNodes.length - 1 ? `node-${idx + 1}` : null,
      }));

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 2,
        phase: 'Pointers Setup',
        explanation: 'Initialize pointers: prev = null, curr = head (Node 10).',
        beginnerNote: `We start with prev set to null because the first node will become the new tail pointing to null.`,
        variables: { prev: 'null', curr: '10', nextTemp: 'null' },
        linkedListState: {
          nodes: JSON.parse(JSON.stringify(currentGraph)),
          pointers: [
            { name: 'prev', nodeId: null, color: '#94a3b8' },
            { name: 'curr', nodeId: 'node-0', color: '#a855f7' },
          ],
        },
      });

      let prevId: string | null = null;
      let currId: string | null = 'node-0';

      for (let i = 0; i < rawNodes.length; i++) {
        const nextTempId = i < rawNodes.length - 1 ? `node-${i + 1}` : null;

        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 6,
          phase: 'Save Lookahead',
          explanation: `Save next node: nextTemp = curr.next (${nextTempId ? `Node ${rawNodes[i + 1]}` : 'null'}).`,
          beginnerNote: `Crucial! If we don't save the next node now, we will lose access to the rest of the list when we flip the pointer.`,
          variables: { prev: prevId ? rawNodes[i - 1] : 'null', curr: rawNodes[i], nextTemp: nextTempId ? rawNodes[i + 1] : 'null' },
          linkedListState: {
            nodes: JSON.parse(JSON.stringify(currentGraph)),
            pointers: [
              { name: 'prev', nodeId: prevId, color: '#94a3b8' },
              { name: 'curr', nodeId: currId, color: '#a855f7' },
              { name: 'nextTemp', nodeId: nextTempId, color: '#38bdf8' },
            ],
            highlightNodeIds: [currId!],
          },
        });

        const nodeIndex = currentGraph.findIndex((n: any) => n.id === currId);
        currentGraph[nodeIndex].nextId = prevId;

        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 7,
          phase: 'Flip Pointer',
          explanation: `Flip pointer: curr.next now points backwards to prev (${prevId ? `Node ${rawNodes[i - 1]}` : 'null'}).`,
          beginnerNote: `Node ${rawNodes[i]}'s next arrow is now reversed!`,
          variables: { prev: prevId ? rawNodes[i - 1] : 'null', curr: rawNodes[i], 'curr.next': prevId },
          linkedListState: {
            nodes: JSON.parse(JSON.stringify(currentGraph)),
            pointers: [
              { name: 'prev', nodeId: prevId, color: '#94a3b8' },
              { name: 'curr', nodeId: currId, color: '#10b981' },
              { name: 'nextTemp', nodeId: nextTempId, color: '#38bdf8' },
            ],
            highlightNodeIds: [currId!],
            actionDescription: `Pointer reversed on Node ${rawNodes[i]}!`,
          },
        });

        prevId = currId;
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 8,
          phase: 'Advance Prev',
          explanation: `Advance prev pointer forward to curr (Node ${rawNodes[i]}).`,
          beginnerNote: `Slide prev to the node we just finished reversing.`,
          variables: { prev: rawNodes[i], curr: rawNodes[i] },
          linkedListState: {
            nodes: JSON.parse(JSON.stringify(currentGraph)),
            pointers: [
              { name: 'prev', nodeId: prevId, color: '#94a3b8' },
              { name: 'curr', nodeId: currId, color: '#a855f7' },
              { name: 'nextTemp', nodeId: nextTempId, color: '#38bdf8' },
            ],
          },
        });

        currId = nextTempId;
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 9,
          phase: 'Advance Curr',
          explanation: `Advance curr pointer forward to nextTemp (${currId ? `Node ${rawNodes[i + 1]}` : 'null'}).`,
          beginnerNote: `Slide curr to the next node waiting to be reversed.`,
          variables: { prev: rawNodes[i], curr: currId ? rawNodes[i + 1] : 'null' },
          linkedListState: {
            nodes: JSON.parse(JSON.stringify(currentGraph)),
            pointers: [
              { name: 'prev', nodeId: prevId, color: '#94a3b8' },
              { name: 'curr', nodeId: currId, color: '#a855f7' },
            ],
          },
        });
      }

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 12,
        phase: 'Complete',
        explanation: '🎉 List fully reversed! Returning prev as the new head (Node 50).',
        beginnerNote: `Every node's pointer is flipped in O(N) time without allocating any new nodes!`,
        variables: { newHead: rawNodes[rawNodes.length - 1] },
        linkedListState: {
          nodes: JSON.parse(JSON.stringify(currentGraph)),
          pointers: [{ name: 'HEAD', nodeId: prevId, color: '#10b981' }],
          highlightNodeIds: [prevId!],
        },
      });

      return steps;
    },
  },

  'stack-evaluation': {
    id: 'stack-evaluation',
    title: 'Stack (LIFO & Valid Brackets)',
    category: 'stack-queue',
    structureType: 'stack',
    difficulty: 'Easy',
    timeComplexity: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
    spaceComplexity: 'O(N)',
    description:
      'Last-In-First-Out (LIFO) data structure. Demonstrates how stacks maintain nested order, function call frames, undo history, and parentheses matching.',
    mentalModel:
      'Like a stack of dinner plates in a cafeteria. You can only place a new plate on the very top (Push), and you can only remove the top plate (Pop).',
    keyTakeaways: [
      'Push, Pop, and Peek are all guaranteed O(1) constant time.',
      'Essential for recursion, depth-first search (DFS), undo buffers, and expression evaluation.',
    ],
    interviewFrequency: 'High',
    relatedProblemId: 'valid-parentheses',
    codeSnippets: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char); // Push opening
    } else {
      const top = stack.pop(); // Pop top
      if (top !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return not stack`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return st.empty();
}`,
      java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') stack.push(c);
        else {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return stack.isEmpty();
}`,
    },
    defaultInput: {
      brackets: '{[()]}',
    },
    generateSteps: (input = { brackets: '{[()]}' }) => {
      const str = input.brackets || '{[()]}';
      const steps: VisualStep[] = [];
      const stack: string[] = [];
      const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
      let stepCount = 1;

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 2,
        phase: 'Initialize Stack',
        explanation: `Initialize empty stack. Input string: "${str}".`,
        beginnerNote: `The stack starts empty. We will scan characters from left to right.`,
        variables: { s: str, stack: '[]' },
        stackQueueState: { type: 'stack', items: [] },
      });

      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '(' || char === '{' || char === '[') {
          stack.push(char);
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 7,
            phase: 'Push Opening Bracket',
            explanation: `Encountered opening bracket '${char}' at index ${i}. PUSH onto Stack.`,
            beginnerNote: `When we see an opening bracket, we push it onto the top of the stack and wait for its matching close.`,
            variables: { char, stackSize: stack.length },
            stackQueueState: {
              type: 'stack',
              items: [...stack],
              activeItemIndex: stack.length - 1,
              action: 'push',
            },
          });
        } else {
          const popped = stack.pop();
          const matches = popped === map[char];

          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 9,
            phase: 'Pop & Verify',
            explanation: `Encountered closing bracket '${char}'. POP from Stack (got '${popped}'). ${
              matches ? 'Matches corresponding bracket!' : 'Mismatch detected!'
            }`,
            beginnerNote: `Closing bracket '${char}' expects '${map[char]}' at the top of the stack.`,
            variables: { char, popped: popped || 'empty', matches },
            stackQueueState: {
              type: 'stack',
              items: [...stack],
              action: 'pop',
            },
          });

          if (!matches) {
            steps.push({
              stepIndex: stepCount++,
              highlightedLine: 10,
              phase: 'Invalid',
              explanation: `Invalid nesting: Expected '${map[char]}', got '${popped}'. Return false.`,
              beginnerNote: `Brackets are not balanced. Returning false.`,
              variables: { valid: false },
              stackQueueState: { type: 'stack', items: [...stack] },
            });
            return steps;
          }
        }
      }

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 13,
        phase: 'Complete',
        explanation: `🎉 String processed completely. Stack is empty (${stack.length === 0}). Brackets are fully balanced!`,
        beginnerNote: `All opened brackets were matched and popped in proper reverse order.`,
        variables: { valid: true },
        stackQueueState: { type: 'stack', items: [] },
      });

      return steps;
    },
  },

  'binary-heap': {
    id: 'binary-heap',
    title: 'Min Binary Heap (Priority Queue)',
    category: 'heaps-trees',
    structureType: 'heap',
    difficulty: 'Medium',
    timeComplexity: { best: 'O(1)', average: 'O(log N)', worst: 'O(log N)' },
    spaceComplexity: 'O(N)',
    description:
      'A complete binary tree satisfying the Heap Property (parent <= children in Min Heap). Backed by a 1D array using arithmetic index formulas ⌊(i-1)/2⌋ and 2i+1.',
    mentalModel:
      'Like a corporate hierarchy where the CEO (minimum value at the top) has the highest priority. When a new person joins at the bottom, they promote upward if their priority is higher than their manager.',
    keyTakeaways: [
      'Insert: append at end and Swim / Bubble Up in O(log N).',
      'Extract Min: replace root with last leaf and Sink / Heapify Down in O(log N).',
      'No pointers needed: array index math maps directly to binary tree branches.',
    ],
    interviewFrequency: 'High',
    relatedProblemId: 'coin-change',
    codeSnippets: {
      javascript: `class MinHeap {
  constructor() { this.heap = []; }
  
  insert(val) {
    this.heap.push(val); // 1. Append at bottom leaf
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);
      if (this.heap[index] < this.heap[parent]) {
        // Swap with parent
        [this.heap[index], this.heap[parent]] = 
          [this.heap[parent], this.heap[index]];
        index = parent;
      } else break;
    }
  }
}`,
      python: `class MinHeap:
    def __init__(self):
        self.heap = []
    
    def insert(self, val):
        self.heap.append(val)
        self._bubble_up(len(self.heap) - 1)
        
    def _bubble_up(self, index):
        while index > 0:
            parent = (index - 1) // 2
            if self.heap[index] < self.heap[parent]:
                self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
                index = parent
            else:
                break`,
      cpp: `class MinHeap {
    vector<int> heap;
public:
    void insert(int val) {
        heap.push_back(val);
        int idx = heap.size() - 1;
        while (idx > 0) {
            int parent = (idx - 1) / 2;
            if (heap[idx] < heap[parent]) {
                swap(heap[idx], heap[parent]);
                idx = parent;
            } else break;
        }
    }
};`,
      java: `class MinHeap {
    List<Integer> heap = new ArrayList<>();
    public void insert(int val) {
        heap.add(val);
        int idx = heap.size() - 1;
        while (idx > 0) {
            int parent = (idx - 1) / 2;
            if (heap.get(idx) < heap.get(parent)) {
                int temp = heap.get(idx);
                heap.set(idx, heap.get(parent));
                heap.set(parent, temp);
                idx = parent;
            } else break;
        }
    }
}`,
    },
    defaultInput: {
      initialHeap: [4, 10, 8, 25, 30, 15],
      insertVal: 3,
    },
    generateSteps: (input = { initialHeap: [4, 10, 8, 25, 30, 15], insertVal: 3 }) => {
      const heap = [...(input.initialHeap || [4, 10, 8, 25, 30, 15])];
      const insertVal = Number(input.insertVal !== undefined ? input.insertVal : 3);
      const steps: VisualStep[] = [];
      let stepCount = 1;

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 2,
        phase: 'Start',
        explanation: `Initial Min-Heap with ${heap.length} elements. Preparing to insert value ${insertVal}.`,
        beginnerNote: `The heap satisfies parent <= children. We will append ${insertVal} and swim it up.`,
        variables: { heapSize: heap.length, inserting: insertVal },
        heapState: { array: [...heap], isMaxHeap: false },
      });

      heap.push(insertVal);
      let currIdx = heap.length - 1;

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 5,
        phase: 'Append at Leaf',
        explanation: `Appended ${insertVal} at leaf index ${currIdx}. Now bubbling up (swim) to restore min-heap property.`,
        beginnerNote: `Add ${insertVal} at the very bottom leaf of the tree.`,
        variables: { index: currIdx, val: insertVal },
        heapState: {
          array: [...heap],
          activeIndices: [currIdx],
          isMaxHeap: false,
        },
      });

      while (currIdx > 0) {
        const parentIdx = Math.floor((currIdx - 1) / 2);
        steps.push({
          stepIndex: stepCount++,
          highlightedLine: 11,
          phase: 'Parent Comparison',
          explanation: `Comparing child node at index ${currIdx} (${heap[currIdx]}) with parent at index ${parentIdx} (${heap[parentIdx]}).`,
          beginnerNote: `Parent formula is floor((${currIdx} - 1) / 2) = ${parentIdx}. Is ${heap[currIdx]} smaller than parent ${heap[parentIdx]}?`,
          variables: {
            index: currIdx,
            parent: parentIdx,
            'heap[index]': heap[currIdx],
            'heap[parent]': heap[parentIdx],
          },
          heapState: {
            array: [...heap],
            activeIndices: [currIdx, parentIdx],
            swappingIndices: [currIdx, parentIdx],
            isMaxHeap: false,
          },
        });

        if (heap[currIdx] < heap[parentIdx]) {
          const temp = heap[currIdx];
          heap[currIdx] = heap[parentIdx];
          heap[parentIdx] = temp;

          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 13,
            phase: 'Bubble Up Swap',
            explanation: `Child (${temp}) < Parent (${heap[currIdx]}). Swapping nodes to satisfy min-heap condition!`,
            beginnerNote: `Promote ${temp} up one level in the tree!`,
            variables: { index: parentIdx, swapped: true },
            heapState: {
              array: [...heap],
              activeIndices: [parentIdx],
              isMaxHeap: false,
            },
          });
          currIdx = parentIdx;
        } else {
          steps.push({
            stepIndex: stepCount++,
            highlightedLine: 16,
            phase: 'Heap Property Satisfied',
            explanation: `Heap property satisfied: child (${heap[currIdx]}) >= parent (${heap[parentIdx]}). Bubble up terminates.`,
            beginnerNote: `The element has found its valid level in the heap hierarchy.`,
            variables: { index: currIdx },
            heapState: {
              array: [...heap],
              activeIndices: [currIdx],
              isMaxHeap: false,
            },
          });
          break;
        }
      }

      steps.push({
        stepIndex: stepCount++,
        highlightedLine: 18,
        phase: 'Complete',
        explanation: `🎉 Min-Heap insertion complete! Root element is currently ${heap[0]}.`,
        beginnerNote: `Heap property is valid for all nodes in O(log N) time!`,
        variables: { root: heap[0] },
        heapState: {
          array: [...heap],
          activeIndices: [0],
          isMaxHeap: false,
        },
      });

      return steps;
    },
  },
};
