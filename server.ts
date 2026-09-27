import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';
const SESSION_COOKIE = 'codemagic_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set to a unique value of at least 32 characters.');
  }
  return secret;
}

const JWT_SECRET = getJwtSecret();
const app = express();

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            baseUri: ["'self'"],
            defaultSrc: ["'self'"],
            fontSrc: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            imgSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            connectSrc: ["'self'"],
            upgradeInsecureRequests: [],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
  next();
});
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { detail: 'Too many requests. Please try again later.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { detail: 'Too many authentication attempts. Please try again later.' },
});
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { detail: 'Too many write requests. Please try again later.' },
});

app.use('/api', apiLimiter);

// In-Memory Data Models & Seed Data
interface User {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  solvedProblemIds: string[];
  createdAt: string;
  score: number;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

interface Problem {
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

interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  userId: string;
  userName: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compilation Error';
  passedCount: number;
  totalTestCases: number;
  runtimeMs: number;
  memoryKb: number;
  createdAt: string;
  errorDetail?: string;
}

interface Session {
  userId: string;
  expiresAt: number;
}

// Initial In-Memory Store
const users: Map<string, User> = new Map();
const problems: Map<string, Problem> = new Map();
const submissions: Submission[] = [];
const sessions: Map<string, Session> = new Map();

// Seed Rich Problem Set
const initialProblems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Array & Hash Table',
    tags: ['Array', 'Hash Table'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.\n\nYou may assume that each input would have ***exactly one solution***, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.find(comp) != seen.end()) {\n                return {seen[comp], i};\n            }\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }), expectedOutput: JSON.stringify([0, 1]) },
      { input: JSON.stringify({ nums: [3, 2, 4], target: 6 }), expectedOutput: JSON.stringify([1, 2]) },
      { input: JSON.stringify({ nums: [3, 3], target: 6 }), expectedOutput: JSON.stringify([0, 1]) },
      { input: JSON.stringify({ nums: [1, 5, 8, 12, 14], target: 19 }), expectedOutput: JSON.stringify([1, 4]), isHidden: true },
      { input: JSON.stringify({ nums: [-3, 4, 3, 90], target: 0 }), expectedOutput: JSON.stringify([0, 2]), isHidden: true },
    ],
    totalSubmissions: 1420,
    acceptedSubmissions: 980,
    acceptanceRate: '69.0%',
  },
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
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const char of s) {\n    if (char === '(' || char === '{' || char === '[') {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
      typescript: `function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n  for (const ch of s) {\n    if (ch in pairs) {\n      if (stack.pop() !== pairs[ch]) return false;\n    } else {\n      stack.push(ch);\n    }\n  }\n  return stack.length === 0;\n}`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        mapping = {')': '(', '}': '{', ']': '['}\n        for char in s:\n            if char in mapping:\n                top_elem = stack.pop() if stack else '#'\n                if mapping[char] != top_elem:\n                    return False\n            else:\n                stack.append(char)\n        return not stack`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                char top = st.top();\n                st.pop();\n                if (c == ')' && top != '(') return false;\n                if (c == '}' && top != '{') return false;\n                if (c == ']' && top != '[') return false;\n            }\n        }\n        return st.empty();\n    }\n};`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ s: '()' }), expectedOutput: 'true' },
      { input: JSON.stringify({ s: '()[]{}' }), expectedOutput: 'true' },
      { input: JSON.stringify({ s: '(]' }), expectedOutput: 'false' },
      { input: JSON.stringify({ s: '([{}])' }), expectedOutput: 'true', isHidden: true },
      { input: JSON.stringify({ s: '(((' }), expectedOutput: 'false', isHidden: true },
    ],
    totalSubmissions: 2100,
    acceptedSubmissions: 1250,
    acceptanceRate: '59.5%',
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    tags: ['Sliding Window', 'String', 'Hash Table'],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Notice that "pwke" is a subsequence and not a substring.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n  let maxLen = 0;\n  let left = 0;\n  const seen = new Map();\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (seen.has(char) && seen.get(char) >= left) {\n      left = seen.get(char) + 1;\n    }\n    seen.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  let maxLen = 0;\n  let left = 0;\n  const seen = new Map<string, number>();\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (seen.has(char) && seen.get(char)! >= left) {\n      left = seen.get(char)! + 1;\n    }\n    seen.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        left = max_len = 0\n        for right, char in enumerate(s):\n            if char in seen and seen[char] >= left:\n                left = seen[char] + 1\n            seen[char] = right\n            max_len = max(max_len, right - left + 1)\n        return max_len`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        vector<int> dict(256, -1);\n        int maxLen = 0, start = -1;\n        for (int i = 0; i < s.length(); i++) {\n            if (dict[s[i]] > start) start = dict[s[i]];\n            dict[s[i]] = i;\n            maxLen = max(maxLen, i - start);\n        }\n        return maxLen;\n    }\n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int n = s.length(), ans = 0;\n        Map<Character, Integer> map = new HashMap<>();\n        for (int j = 0, i = 0; j < n; j++) {\n            if (map.containsKey(s.charAt(j))) {\n                i = Math.max(map.get(s.charAt(j)), i);\n            }\n            ans = Math.max(ans, j - i + 1);\n            map.put(s.charAt(j), j + 1);\n        }\n        return ans;\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ s: 'abcabcbb' }), expectedOutput: '3' },
      { input: JSON.stringify({ s: 'bbbbb' }), expectedOutput: '1' },
      { input: JSON.stringify({ s: 'pwwkew' }), expectedOutput: '3' },
      { input: JSON.stringify({ s: 'tmmzuxt' }), expectedOutput: '5', isHidden: true },
      { input: JSON.stringify({ s: '' }), expectedOutput: '0', isHidden: true },
    ],
    totalSubmissions: 3400,
    acceptedSubmissions: 1530,
    acceptanceRate: '45.0%',
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Array', 'BFS'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.\n\nYou may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1',
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0',
      },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    starterCode: {
      javascript: `/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
      typescript: `function coinChange(coins: number[], amount: number): number {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
      python: `class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for i in range(1, amount + 1):\n            for coin in coins:\n                if i - coin >= 0:\n                    dp[i] = min(dp[i], dp[i - coin] + 1)\n        return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i >= c) dp[i] = min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int max = amount + 1;\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, max);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ coins: [1, 2, 5], amount: 11 }), expectedOutput: '3' },
      { input: JSON.stringify({ coins: [2], amount: 3 }), expectedOutput: '-1' },
      { input: JSON.stringify({ coins: [1], amount: 0 }), expectedOutput: '0' },
      { input: JSON.stringify({ coins: [186, 419, 83, 408], amount: 6249 }), expectedOutput: '20', isHidden: true },
    ],
    totalSubmissions: 1820,
    acceptedSubmissions: 810,
    acceptanceRate: '44.5%',
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Two Pointers & DP',
    tags: ['Two Pointers', 'Dynamic Programming', 'Stack', 'Array'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
      },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    starterCode: {
      javascript: `/**\n * @param {number[]} height\n * @return {number}\n */\nfunction trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0;\n  let water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= leftMax) leftMax = height[left];\n      else water += leftMax - height[left];\n      left++;\n    } else {\n      if (height[right] >= rightMax) rightMax = height[right];\n      else water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}`,
      typescript: `function trap(height: number[]): number {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0;\n  let water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= leftMax) leftMax = height[left];\n      else water += leftMax - height[left];\n      left++;\n    } else {\n      if (height[right] >= rightMax) rightMax = height[right];\n      else water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}`,
      python: `class Solution:\n    def trap(self, height: list[int]) -> int:\n        left, right = 0, len(height) - 1\n        left_max, right_max = 0, 0\n        water = 0\n        while left < right:\n            if height[left] < height[right]:\n                if height[left] >= left_max: left_max = height[left]\n                else: water += left_max - height[left]\n                left += 1\n            else:\n                if height[right] >= right_max: right_max = height[right]\n                else: water += right_max - height[right]\n                right -= 1\n        return water`,
      cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = height.size() - 1, lmax = 0, rmax = 0, res = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lmax) lmax = height[l];\n                else res += lmax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rmax) rmax = height[r];\n                else res += rmax - height[r];\n                r--;\n            }\n        }\n        return res;\n    }\n};`,
      java: `class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1, lmax = 0, rmax = 0, total = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lmax) lmax = height[l];\n                else total += lmax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rmax) rmax = height[r];\n                else total += rmax - height[r];\n                r--;\n            }\n        }\n        return total;\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }), expectedOutput: '6' },
      { input: JSON.stringify({ height: [4, 2, 0, 3, 2, 5] }), expectedOutput: '9' },
      { input: JSON.stringify({ height: [3, 0, 2, 0, 4] }), expectedOutput: '7', isHidden: true },
    ],
    totalSubmissions: 950,
    acceptedSubmissions: 380,
    acceptanceRate: '40.0%',
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    category: 'Intervals & Sorting',
    tags: ['Array', 'Sorting'],
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4',
    ],
    starterCode: {
      javascript: `/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const current = intervals[i];\n    const last = merged[merged.length - 1];\n    if (current[0] <= last[1]) {\n      last[1] = Math.max(last[1], current[1]);\n    } else {\n      merged.push(current);\n    }\n  }\n  return merged;\n}`,
      typescript: `function merge(intervals: number[][]): number[][] {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged: number[][] = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const current = intervals[i];\n    const last = merged[merged.length - 1];\n    if (current[0] <= last[1]) {\n      last[1] = Math.max(last[1], current[1]);\n    } else {\n      merged.push(current);\n    }\n  }\n  return merged;\n}`,
      python: `class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        intervals.sort(key=lambda x: x[0])\n        merged = []\n        for interval in intervals:\n            if not merged or merged[-1][1] < interval[0]:\n                merged.append(interval)\n            else:\n                merged[-1][1] = max(merged[-1][1], interval[1])\n        return merged`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        if (intervals.empty()) return {};\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged = {intervals[0]};\n        for (int i = 1; i < intervals.size(); i++) {\n            if (merged.back()[1] >= intervals[i][0]) {\n                merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n            } else {\n                merged.push_back(intervals[i]);\n            }\n        }\n        return merged;\n    }\n};`,
      java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        LinkedList<int[]> merged = new LinkedList<>();\n        for (int[] interval : intervals) {\n            if (merged.isEmpty() || merged.getLast()[1] < interval[0]) {\n                merged.add(interval);\n            } else {\n                merged.getLast()[1] = Math.max(merged.getLast()[1], interval[1]);\n            }\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}`,
    },
    testCases: [
      { input: JSON.stringify({ intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }), expectedOutput: JSON.stringify([[1, 6], [8, 10], [15, 18]]) },
      { input: JSON.stringify({ intervals: [[1, 4], [4, 5]] }), expectedOutput: JSON.stringify([[1, 5]]) },
      { input: JSON.stringify({ intervals: [[1, 4], [2, 3]] }), expectedOutput: JSON.stringify([[1, 4]]), isHidden: true },
    ],
    totalSubmissions: 1600,
    acceptedSubmissions: 890,
    acceptanceRate: '55.6%',
  },
];

initialProblems.forEach(p => problems.set(p.id, p));

// This account exists only in the in-memory development shell. It is deliberately
// excluded from production, where startup is disabled until durable auth exists.
if (!isProduction && process.env.NODE_ENV !== 'test') {
  const demoUser: User = {
    id: 'usr-demo-codemagic',
    email: 'demo@codemagic.local',
    name: 'Demo Learner',
    hashedPassword: '$2a$12$JD3xImCFmu3NQBa.uVm7ouxQxKWvnsXPMyWY7lYxcW60CPt7U73..',
    solvedProblemIds: ['two-sum', 'valid-parentheses'],
    createdAt: '2026-01-01T00:00:00.000Z',
    score: 100,
  };
  users.set(demoUser.id, demoUser);
}

const registrationSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
  name: z.string().trim().min(1).max(60).optional(),
}).strict();

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(128),
}).strict();

function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    score: user.score,
    solvedProblemIds: user.solvedProblemIds,
  };
}

function findUserByEmail(email: string): User | undefined {
  return Array.from(users.values()).find(user => user.email === email);
}

function removeExpiredSessions(): void {
  const now = Date.now();
  for (const [sessionId, session] of sessions) {
    if (session.expiresAt <= now) sessions.delete(sessionId);
  }
}

function issueSession(res: Response, user: User): string {
  removeExpiredSessions();
  const csrfToken = randomBytes(32).toString('base64url');
  const sessionId = randomUUID();
  sessions.set(sessionId, { userId: user.id, expiresAt: Date.now() + SESSION_MAX_AGE_MS });
  const session = jwt.sign({ sub: user.id, csrf: csrfToken, sid: sessionId }, JWT_SECRET, {
    algorithm: 'HS256',
    audience: 'codemagic-web',
    expiresIn: '7d',
    issuer: 'codemagic',
  });

  res.cookie(SESSION_COOKIE, session, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_MS,
    path: '/',
    sameSite: 'lax',
    secure: isProduction,
  });
  return csrfToken;
}

interface AuthRequest extends Request {
  user?: User;
  csrfToken?: string;
  sessionId?: string;
}

type SessionClaims = jwt.JwtPayload & { sub?: string; csrf?: string; sid?: string };

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const session = req.cookies?.[SESSION_COOKIE];
  if (typeof session !== 'string') {
    return next();
  }

  try {
    const payload = jwt.verify(session, JWT_SECRET, {
      algorithms: ['HS256'],
      audience: 'codemagic-web',
      issuer: 'codemagic',
    }) as SessionClaims;
    const user = payload.sub ? users.get(payload.sub) : undefined;
    const storedSession = typeof payload.sid === 'string' ? sessions.get(payload.sid) : undefined;
    if (
      user &&
      storedSession &&
      storedSession.expiresAt > Date.now() &&
      storedSession.userId === user.id &&
      typeof payload.csrf === 'string'
    ) {
      req.user = user;
      req.csrfToken = payload.csrf;
      req.sessionId = payload.sid;
    } else if (typeof payload.sid === 'string') {
      sessions.delete(payload.sid);
    }
  } catch {
    res.clearCookie(SESSION_COOKIE, { path: '/', sameSite: 'lax', secure: isProduction });
  }
  next();
};

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ detail: 'Authentication required' });
  }
  next();
};

const requireCsrf = (req: AuthRequest, res: Response, next: NextFunction) => {
  const supplied = req.get('x-csrf-token');
  const expected = req.csrfToken;
  if (!supplied || !expected) {
    return res.status(403).json({ detail: 'A valid CSRF token is required.' });
  }

  const suppliedBuffer = Buffer.from(supplied, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    return res.status(403).json({ detail: 'A valid CSRF token is required.' });
  }
  next();
};

app.use(authenticate);

// === AUTH ROUTES ===
app.post('/api/auth/register', authLimiter, async (req: Request, res: Response) => {
  const parsed = registrationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ detail: 'Provide a valid email, display name, and password of at least 12 characters.' });
  }
  const { email, password, name } = parsed.data;

  if (findUserByEmail(email)) {
    return res.status(409).json({ detail: 'Unable to create an account with those details.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser: User = {
    id: `usr-${randomUUID()}`,
    email,
    name: name || email.split('@')[0],
    hashedPassword,
    solvedProblemIds: [],
    createdAt: new Date().toISOString(),
    score: 0,
  };

  users.set(newUser.id, newUser);
  return res.status(201).json({ user: toPublicUser(newUser), csrfToken: issueSession(res, newUser) });
});

app.post('/api/auth/login', authLimiter, async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ detail: 'Invalid email or password.' });
  }
  const { email, password } = parsed.data;

  const matchedUser = findUserByEmail(email);

  if (!matchedUser || !(await bcrypt.compare(password, matchedUser.hashedPassword))) {
    return res.status(401).json({ detail: 'Invalid credentials' });
  }

  return res.json({
    user: toPublicUser(matchedUser),
    csrfToken: issueSession(res, matchedUser),
  });
});

app.get('/api/auth/me', (req: AuthRequest, res: Response) => {
  if (!req.user || !req.csrfToken) return res.status(401).json({ detail: 'Not authenticated' });
  return res.json({ user: toPublicUser(req.user), csrfToken: req.csrfToken });
});

app.post('/api/auth/logout', requireAuth, requireCsrf, (req: AuthRequest, res: Response) => {
  if (req.sessionId) sessions.delete(req.sessionId);
  res.clearCookie(SESSION_COOKIE, { path: '/', sameSite: 'lax', secure: isProduction });
  return res.status(204).send();
});

const languageSchema = z.enum(['javascript', 'typescript', 'python', 'cpp', 'java']);
const jsonInputSchema = z.string().min(1).max(10_000).refine(value => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}, 'must be valid JSON');
const starterCodeSchema = z.object({
  javascript: z.string().max(50_000),
  typescript: z.string().max(50_000),
  python: z.string().max(50_000),
  cpp: z.string().max(50_000),
  java: z.string().max(50_000),
}).strict();
const problemSchema = z.object({
  title: z.string().trim().min(3).max(120).regex(/[a-z0-9]/i),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.string().trim().min(2).max(80),
  tags: z.array(z.string().trim().min(1).max(40)).min(1).max(12),
  description: z.string().trim().min(10).max(10_000),
  examples: z.array(z.object({
    input: z.string().max(2_000),
    output: z.string().max(2_000),
    explanation: z.string().max(5_000).optional(),
  }).strict()).max(10),
  constraints: z.array(z.string().trim().min(1).max(500)).max(20),
  starterCode: starterCodeSchema,
  testCases: z.array(z.object({
    input: jsonInputSchema,
    expectedOutput: z.string().min(1).max(10_000),
    isHidden: z.boolean().optional(),
  }).strict()).min(1).max(100),
}).strict();
const codeRequestSchema = z.object({
  code: z.string().min(1).max(50_000),
  language: languageSchema.default('javascript'),
  customInput: jsonInputSchema.optional(),
}).strict();

// === PROBLEMS ROUTES ===
app.get('/api/problems', requireAuth, (req: AuthRequest, res: Response) => {
  const difficulty = typeof req.query.difficulty === 'string' ? req.query.difficulty : undefined;
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;
  let list = Array.from(problems.values());

  if (difficulty && difficulty !== 'All') {
    list = list.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (tag) {
    list = list.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Return public problem summaries (strip hidden test cases)
  const summaries = list.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    difficulty: p.difficulty,
    category: p.category,
    tags: p.tags,
    acceptanceRate: p.acceptanceRate,
    totalSubmissions: p.totalSubmissions,
    testCasesCount: p.testCases.length,
  }));

  return res.json(summaries);
});

app.get('/api/problems/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const problemId = typeof req.params.id === 'string' ? req.params.id : '';
  const problem = problems.get(problemId);
  if (!problem) {
    return res.status(404).json({ detail: 'Problem not found' });
  }

  // Exclude hidden test cases from client inspection
  const publicTestCases = problem.testCases.map((tc, idx) => ({
    id: idx,
    input: tc.input,
    expectedOutput: tc.isHidden ? 'Hidden testcase' : tc.expectedOutput,
    isHidden: !!tc.isHidden,
  }));

  return res.json({
    ...problem,
    testCases: publicTestCases,
  });
});

app.post('/api/problems', writeLimiter, requireAuth, requireCsrf, (req: AuthRequest, res: Response) => {
  const parsed = problemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ detail: 'The problem payload is invalid or exceeds an allowed limit.' });
  }
  const { title, difficulty, category, tags, description, examples, constraints, starterCode, testCases } = parsed.data;

  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (problems.has(id)) {
    return res.status(409).json({ detail: 'A problem with a similar title already exists.' });
  }

  const newProblem: Problem = {
    id,
    title,
    slug: id,
    difficulty: difficulty || 'Medium',
    category: category || 'General',
    tags: tags || ['Algorithm'],
    description,
    examples: examples || [],
    constraints: constraints || [],
    starterCode: starterCode || {
      javascript: '// Write your solution here\nfunction solve(input) {\n  return input;\n}',
      typescript: '// Write your solution here\nfunction solve(input: any): any {\n  return input;\n}',
      python: '# Write your solution here\ndef solve(input):\n    return input',
      cpp: '// Write your solution here\nclass Solution {\npublic:\n    void solve() {}\n};',
      java: '// Write your solution here\nclass Solution {\n    public void solve() {}\n}',
    },
    testCases,
    author: req.user?.name || 'Community',
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    acceptanceRate: '0%',
  };

  problems.set(newProblem.id, newProblem);
  return res.status(201).json({
    ...newProblem,
    testCases: newProblem.testCases.map((testCase, index) => ({
      id: index,
      input: testCase.input,
      expectedOutput: testCase.isHidden ? 'Hidden testcase' : testCase.expectedOutput,
      isHidden: Boolean(testCase.isHidden),
    })),
  });
});

const judgeUnavailable = (res: Response) => res.status(503).json({
  code: 'JUDGE_UNAVAILABLE',
  detail: 'Code execution is unavailable until an isolated judge service is configured.',
});

// === RUN / TEST CODE ===
app.post('/api/problems/:id/run', writeLimiter, requireAuth, requireCsrf, (req: AuthRequest, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  const problem = problems.get(id);

  if (!problem) {
    return res.status(404).json({ detail: 'Problem not found' });
  }
  if (!codeRequestSchema.safeParse(req.body).success) {
    return res.status(400).json({ detail: 'The code request is invalid or exceeds an allowed limit.' });
  }
  return judgeUnavailable(res);
});

// === SUBMIT SOLUTION (Judge Engine) ===
app.post('/api/problems/:id/submit', writeLimiter, requireAuth, requireCsrf, (req: AuthRequest, res: Response) => {
  const id = typeof req.params.id === 'string' ? req.params.id : '';
  const problem = problems.get(id);

  if (!problem) {
    return res.status(404).json({ detail: 'Problem not found' });
  }
  if (!codeRequestSchema.safeParse(req.body).success) {
    return res.status(400).json({ detail: 'The code request is invalid or exceeds an allowed limit.' });
  }
  return judgeUnavailable(res);
});

// === SUBMISSION HISTORY ===
app.get('/api/submissions', requireAuth, (req: AuthRequest, res: Response) => {
  const problemId = typeof req.query.problemId === 'string' ? req.query.problemId : undefined;
  let list = submissions.filter(submission => submission.userId === req.user!.id);
  if (problemId) {
    list = list.filter(submission => submission.problemId === problemId);
  }
  return res.json(list.slice(0, 50));
});

// === LEADERBOARD ===
app.get('/api/leaderboard', (req: Request, res: Response) => {
  const rankList = Array.from(users.values())
    .map(u => ({
      id: u.id,
      name: u.name,
      score: u.score,
      solvedCount: u.solvedProblemIds.length,
      createdAt: u.createdAt,
    }))
    .sort((a, b) => b.score - a.score || b.solvedCount - a.solvedCount);

  return res.json(rankList);
});

app.use('/api', (_req, res) => {
  res.status(404).json({ detail: 'API endpoint not found.' });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled request error', error);
  if (res.headersSent) return;
  res.status(500).json({ detail: 'An unexpected server error occurred.' });
});

// This process is a development shell only. A production deployment needs durable
// persistence and a separately sandboxed judge worker before it can serve traffic.
async function startServer() {
  if (isProduction) {
    throw new Error('Production startup is disabled until persistent storage and an isolated judge worker are configured.');
  }
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'mpa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodeMagic server running on http://0.0.0.0:${PORT}`);
  });
}

export { app };

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  void startServer().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
