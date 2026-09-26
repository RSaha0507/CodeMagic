export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
    cpp: string;
    java: string;
  };
  testCases: TestCase[];
  author?: string;
  acceptanceRate?: string;
  totalSubmissions?: number;
  acceptedSubmissions?: number;
}

export const problemsCatalog: Problem[] = [
  // 1. Two Sum
  {
    id: 'two-sum',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Array & Hash Table',
    tags: ['Array', 'Hash Table'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.\n\nYou may assume that each input would have ***exactly one solution***, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      { input: 'nums = [3, 3], target = 6', output: '[0, 1]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[] { map.get(comp), i };\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }), expectedOutput: JSON.stringify([0, 1]) },
      { input: JSON.stringify({ nums: [3, 2, 4], target: 6 }), expectedOutput: JSON.stringify([1, 2]) },
      { input: JSON.stringify({ nums: [3, 3], target: 6 }), expectedOutput: JSON.stringify([0, 1]) },
      { input: JSON.stringify({ nums: [1, 5, 8, 12, 14], target: 19 }), expectedOutput: JSON.stringify([1, 4]), isHidden: true },
      { input: JSON.stringify({ nums: [-3, 4, 3, 90], target: 0 }), expectedOutput: JSON.stringify([0, 2]), isHidden: true },
    ],
    totalSubmissions: 2420,
    acceptedSubmissions: 1780,
    acceptanceRate: '73.5%',
  },

  // 2. Valid Parentheses
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack & String',
    tags: ['Stack', 'String'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([])"', output: 'true' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\'.'],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const char of s) {\n    if (char === '(' || char === '{' || char === '[') {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
      typescript: `function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '{' || ch === '[') stack.push(ch);\n    else if (stack.pop() !== map[ch]) return false;\n  }\n  return stack.length === 0;\n}`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        mapping = {')': '(', '}': '{', ']': '['}\n        for char in s:\n            if char in '({[':\n                stack.append(char)\n            elif not stack or stack.pop() != mapping[char]:\n                return False\n        return len(stack) == 0`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                char top = st.top(); st.pop();\n                if (c == ')' && top != '(') return false;\n                if (c == '}' && top != '{') return false;\n                if (c == ']' && top != '[') return false;\n            }\n        }\n        return st.empty();\n    }\n};`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ s: '()' }), expectedOutput: 'true' },
      { input: JSON.stringify({ s: '()[]{}' }), expectedOutput: 'true' },
      { input: JSON.stringify({ s: '(]' }), expectedOutput: 'false' },
      { input: JSON.stringify({ s: '([{}])' }), expectedOutput: 'true', isHidden: true },
      { input: JSON.stringify({ s: '(((' }), expectedOutput: 'false', isHidden: true },
    ],
    totalSubmissions: 3100,
    acceptedSubmissions: 1980,
    acceptanceRate: '63.8%',
  },

  // 3. Reverse Linked List
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    category: 'Linked List',
    tags: ['Linked List', 'Recursion'],
    description: `Given the head of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    starterCode: {
      javascript: `/**\n * @param {number[]} head\n * @return {number[]}\n */\nfunction reverseList(head) {\n  if (!Array.isArray(head)) return [];\n  return [...head].reverse();\n}`,
      typescript: `function reverseList(head: number[]): number[] {\n  return [...head].reverse();\n}`,
      python: `class Solution:\n    def reverseList(self, head: list[int]) -> list[int]:\n        return head[::-1]`,
      cpp: `class Solution {\npublic:\n    vector<int> reverseList(vector<int>& head) {\n        reverse(head.begin(), head.end());\n        return head;\n    }\n};`,
      java: `class Solution {\n    public int[] reverseList(int[] head) {\n        int[] res = new int[head.length];\n        for (int i = 0; i < head.length; i++) res[i] = head[head.length - 1 - i];\n        return res;\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ head: [1, 2, 3, 4, 5] }), expectedOutput: JSON.stringify([5, 4, 3, 2, 1]) },
      { input: JSON.stringify({ head: [1, 2] }), expectedOutput: JSON.stringify([2, 1]) },
      { input: JSON.stringify({ head: [] }), expectedOutput: JSON.stringify([]) },
      { input: JSON.stringify({ head: [99] }), expectedOutput: JSON.stringify([99]), isHidden: true },
    ],
    totalSubmissions: 1900,
    acceptedSubmissions: 1420,
    acceptanceRate: '74.7%',
  },

  // 4. Longest Substring Without Repeating Characters
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window & Hash Table',
    tags: ['Sliding Window', 'String', 'Hash Table'],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n  let maxLen = 0, left = 0;\n  const seen = new Map();\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (seen.has(char) && seen.get(char) >= left) {\n      left = seen.get(char) + 1;\n    }\n    seen.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  let maxLen = 0, left = 0;\n  const seen = new Map<string, number>();\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (seen.has(char) && seen.get(char)! >= left) left = seen.get(char)! + 1;\n    seen.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        left = max_len = 0\n        for right, char in enumerate(s):\n            if char in seen and seen[char] >= left:\n                left = seen[char] + 1\n            seen[char] = right\n            max_len = max(max_len, right - left + 1)\n        return max_len`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        vector<int> dict(256, -1);\n        int maxLen = 0, start = -1;\n        for (int i = 0; i < s.length(); i++) {\n            if (dict[s[i]] > start) start = dict[s[i]];\n            dict[s[i]] = i;\n            maxLen = max(maxLen, i - start);\n        }\n        return maxLen;\n    }\n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> map = new HashMap<>();\n        int max = 0, left = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (map.containsKey(c)) left = Math.max(left, map.get(c) + 1);\n            map.put(c, right);\n            max = Math.max(max, right - left + 1);\n        }\n        return max;\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ s: 'abcabcbb' }), expectedOutput: '3' },
      { input: JSON.stringify({ s: 'bbbbb' }), expectedOutput: '1' },
      { input: JSON.stringify({ s: 'pwwkew' }), expectedOutput: '3' },
      { input: JSON.stringify({ s: 'tmmzuxt' }), expectedOutput: '5', isHidden: true },
      { input: JSON.stringify({ s: '' }), expectedOutput: '0', isHidden: true },
    ],
    totalSubmissions: 3900,
    acceptedSubmissions: 1840,
    acceptanceRate: '47.2%',
  },

  // 5. 3Sum
  {
    id: '3sum',
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    category: 'Two Pointers & Sorting',
    tags: ['Two Pointers', 'Array', 'Sorting'],
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.\n\nNotice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) l++;\n      else r--;\n    }\n  }\n  return res;\n}`,
      typescript: `function threeSum(nums: number[]): number[][] {\n  nums.sort((a, b) => a - b);\n  const res: number[][] = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) l++;\n      else r--;\n    }\n  }\n  return res;\n}`,
      python: `class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        nums.sort()\n        res = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i-1]: continue\n            l, r = i + 1, len(nums) - 1\n            while l < r:\n                s = nums[i] + nums[l] + nums[r]\n                if s == 0:\n                    res.append([nums[i], nums[l], nums[r]])\n                    while l < r and nums[l] == nums[l+1]: l += 1\n                    while l < r and nums[r] == nums[r-1]: r -= 1\n                    l += 1; r -= 1\n                elif s < 0: l += 1\n                else: r -= 1\n        return res`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++; else r--;\n            }\n        }\n        return res;\n    }\n};`,
      java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++; else r--;\n            }\n        }\n        return res;\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ nums: [-1, 0, 1, 2, -1, -4] }), expectedOutput: JSON.stringify([[-1, -1, 2], [-1, 0, 1]]) },
      { input: JSON.stringify({ nums: [0, 1, 1] }), expectedOutput: JSON.stringify([]) },
      { input: JSON.stringify({ nums: [0, 0, 0] }), expectedOutput: JSON.stringify([[0, 0, 0]]) },
      { input: JSON.stringify({ nums: [-2, 0, 1, 1, 2] }), expectedOutput: JSON.stringify([[-2, 0, 2], [-2, 1, 1]]), isHidden: true },
    ],
    totalSubmissions: 2800,
    acceptedSubmissions: 1200,
    acceptanceRate: '42.8%',
  },

  // 6. Search in Rotated Sorted Array
  {
    id: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    category: 'Binary Search',
    tags: ['Binary Search', 'Array'],
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\`.\n\nGiven the array \`nums\` after the possible rotation and an integer \`target\`, return *the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`* in \`O(log N)\` runtime.`,
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
      { input: 'nums = [1], target = 0', output: '-1' },
    ],
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.'],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[l] <= nums[mid]) {\n      if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n      else l = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n      else r = mid - 1;\n    }\n  }\n  return -1;\n}`,
      typescript: `function search(nums: number[], target: number): number {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[l] <= nums[mid]) {\n      if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n      else l = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n      else r = mid - 1;\n    }\n  }\n  return -1;\n}`,
      python: `class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            mid = (l + r) // 2\n            if nums[mid] == target: return mid\n            if nums[l] <= nums[mid]:\n                if nums[l] <= target < nums[mid]: r = mid - 1\n                else: l = mid + 1\n            else:\n                if nums[mid] < target <= nums[r]: l = mid + 1\n                else: r = mid - 1\n        return -1`,
      cpp: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n};`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }), expectedOutput: '4' },
      { input: JSON.stringify({ nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }), expectedOutput: '-1' },
      { input: JSON.stringify({ nums: [1], target: 0 }), expectedOutput: '-1' },
      { input: JSON.stringify({ nums: [6, 7, 1, 2, 3, 4, 5], target: 6 }), expectedOutput: '0', isHidden: true },
    ],
    totalSubmissions: 2150,
    acceptedSubmissions: 1040,
    acceptanceRate: '48.3%',
  },

  // 7. Sort Colors (Dutch National Flag)
  {
    id: 'sort-colors',
    title: 'Sort Colors (Dutch National Flag)',
    slug: 'sort-colors',
    difficulty: 'Medium',
    category: 'Two Pointers & Sorting',
    tags: ['Two Pointers', 'Array', 'Sorting'],
    description: `Given an array \`nums\` with \`n\` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red (0), white (1), and blue (2).\n\nYou must solve this without using the library's sort function and in \`O(N)\` single-pass time.`,
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
      { input: 'nums = [2,0,1]', output: '[0,1,2]' },
    ],
    constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is either 0, 1, or 2.'],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction sortColors(nums) {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++; mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n  return nums;\n}`,
      typescript: `function sortColors(nums: number[]): number[] {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++; mid++;\n    } else if (nums[mid] === 1) mid++;\n    else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n  return nums;\n}`,
      python: `class Solution:\n    def sortColors(self, nums: list[int]) -> list[int]:\n        low, mid, high = 0, 0, len(nums) - 1\n        while mid <= high:\n            if nums[mid] == 0:\n                nums[low], nums[mid] = nums[mid], nums[low]\n                low += 1; mid += 1\n            elif nums[mid] == 1:\n                mid += 1\n            else:\n                nums[mid], nums[high] = nums[high], nums[mid]\n                high -= 1\n        return nums`,
      cpp: `class Solution {\npublic:\n    vector<int> sortColors(vector<int>& nums) {\n        int low = 0, mid = 0, high = nums.size() - 1;\n        while (mid <= high) {\n            if (nums[mid] == 0) swap(nums[low++], nums[mid++]);\n            else if (nums[mid] == 1) mid++;\n            else swap(nums[mid], nums[high--]);\n        }\n        return nums;\n    }\n};`,
      java: `class Solution {\n    public int[] sortColors(int[] nums) {\n        int low = 0, mid = 0, high = nums.length - 1;\n        while (mid <= high) {\n            if (nums[mid] == 0) {\n                int t = nums[low]; nums[low] = nums[mid]; nums[mid] = t;\n                low++; mid++;\n            } else if (nums[mid] == 1) mid++;\n            else {\n                int t = nums[mid]; nums[mid] = nums[high]; nums[high] = t;\n                high--;\n            }\n        }\n        return nums;\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ nums: [2, 0, 2, 1, 1, 0] }), expectedOutput: JSON.stringify([0, 0, 1, 1, 2, 2]) },
      { input: JSON.stringify({ nums: [2, 0, 1] }), expectedOutput: JSON.stringify([0, 1, 2]) },
      { input: JSON.stringify({ nums: [0] }), expectedOutput: JSON.stringify([0]), isHidden: true },
      { input: JSON.stringify({ nums: [1, 2, 0] }), expectedOutput: JSON.stringify([0, 1, 2]), isHidden: true },
    ],
    totalSubmissions: 1750,
    acceptedSubmissions: 1120,
    acceptanceRate: '64.0%',
  },

  // 8. Merge Intervals
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    category: 'Intervals & Sorting',
    tags: ['Array', 'Sorting'],
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    starterCode: {
      javascript: `/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const curr = intervals[i];\n    const last = merged[merged.length - 1];\n    if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]);\n    else merged.push(curr);\n  }\n  return merged;\n}`,
      typescript: `function merge(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const curr = intervals[i];\n    const last = merged[merged.length - 1];\n    if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]);\n    else merged.push(curr);\n  }\n  return merged;\n}`,
      python: `class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        intervals.sort(key=lambda x: x[0])\n        merged = []\n        for interval in intervals:\n            if not merged or merged[-1][1] < interval[0]:\n                merged.append(interval)\n            else:\n                merged[-1][1] = max(merged[-1][1], interval[1])\n        return merged`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        if (intervals.empty()) return {};\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged = {intervals[0]};\n        for (int i = 1; i < intervals.size(); i++) {\n            if (merged.back()[1] >= intervals[i][0]) {\n                merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n            } else merged.push_back(intervals[i]);\n        }\n        return merged;\n    }\n};`,
      java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        LinkedList<int[]> merged = new LinkedList<>();\n        for (int[] interval : intervals) {\n            if (merged.isEmpty() || merged.getLast()[1] < interval[0]) merged.add(interval);\n            else merged.getLast()[1] = Math.max(merged.getLast()[1], interval[1]);\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }), expectedOutput: JSON.stringify([[1, 6], [8, 10], [15, 18]]) },
      { input: JSON.stringify({ intervals: [[1, 4], [4, 5]] }), expectedOutput: JSON.stringify([[1, 5]]) },
      { input: JSON.stringify({ intervals: [[1, 4], [2, 3]] }), expectedOutput: JSON.stringify([[1, 4]]), isHidden: true },
    ],
    totalSubmissions: 2600,
    acceptedSubmissions: 1490,
    acceptanceRate: '57.3%',
  },

  // 9. Coin Change
  {
    id: 'coin-change',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Array', 'BFS'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.\n\nYou may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    starterCode: {
      javascript: `/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
      typescript: `function coinChange(coins: number[], amount: number): number {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
      python: `class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for i in range(1, amount + 1):\n            for coin in coins:\n                if i - coin >= 0:\n                    dp[i] = min(dp[i], dp[i - coin] + 1)\n        return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) if (i >= c) dp[i] = min(dp[i], dp[i - c] + 1);\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int max = amount + 1;\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, max);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ coins: [1, 2, 5], amount: 11 }), expectedOutput: '3' },
      { input: JSON.stringify({ coins: [2], amount: 3 }), expectedOutput: '-1' },
      { input: JSON.stringify({ coins: [1], amount: 0 }), expectedOutput: '0' },
      { input: JSON.stringify({ coins: [186, 419, 83, 408], amount: 6249 }), expectedOutput: '20', isHidden: true },
    ],
    totalSubmissions: 2820,
    acceptedSubmissions: 1250,
    acceptanceRate: '44.3%',
  },

  // 10. Trapping Rain Water
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Two Pointers & DP',
    tags: ['Two Pointers', 'Dynamic Programming', 'Stack', 'Array'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map is [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    starterCode: {
      javascript: `/**\n * @param {number[]} height\n * @return {number}\n */\nfunction trap(height) {\n  let l = 0, r = height.length - 1;\n  let lmax = 0, rmax = 0, water = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= lmax) lmax = height[l];\n      else water += lmax - height[l];\n      l++;\n    } else {\n      if (height[r] >= rmax) rmax = height[r];\n      else water += rmax - height[r];\n      r--;\n    }\n  }\n  return water;\n}`,
      typescript: `function trap(height: number[]): number {\n  let l = 0, r = height.length - 1;\n  let lmax = 0, rmax = 0, water = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= lmax) lmax = height[l];\n      else water += lmax - height[l];\n      l++;\n    } else {\n      if (height[r] >= rmax) rmax = height[r];\n      else water += rmax - height[r];\n      r--;\n    }\n  }\n  return water;\n}`,
      python: `class Solution:\n    def trap(self, height: list[int]) -> int:\n        l, r = 0, len(height) - 1\n        lmax, rmax = 0, 0\n        water = 0\n        while l < r:\n            if height[l] < height[r]:\n                if height[l] >= lmax: lmax = height[l]\n                else: water += lmax - height[l]\n                l += 1\n            else:\n                if height[r] >= rmax: rmax = height[r]\n                else: water += rmax - height[r]\n                r -= 1\n        return water`,
      cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = height.size() - 1, lmax = 0, rmax = 0, res = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lmax) lmax = height[l];\n                else res += lmax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rmax) rmax = height[r];\n                else res += rmax - height[r];\n                r--;\n            }\n        }\n        return res;\n    }\n};`,
      java: `class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1, lmax = 0, rmax = 0, res = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lmax) lmax = height[l];\n                else res += lmax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rmax) rmax = height[r];\n                else res += rmax - height[r];\n                r--;\n            }\n        }\n        return res;\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }), expectedOutput: '6' },
      { input: JSON.stringify({ height: [4, 2, 0, 3, 2, 5] }), expectedOutput: '9' },
      { input: JSON.stringify({ height: [3, 0, 2, 0, 4] }), expectedOutput: '7', isHidden: true },
    ],
    totalSubmissions: 1450,
    acceptedSubmissions: 590,
    acceptanceRate: '40.7%',
  },
];
