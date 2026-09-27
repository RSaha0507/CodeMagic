export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemSummary {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  acceptanceRate?: string;
  totalSubmissions?: number;
  testCasesCount?: number;
}

export interface TestCase {
  id?: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ProblemDetail extends ProblemSummary {
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
}

export interface Submission {
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

export interface User {
  id: string;
  email: string;
  name: string;
  score: number;
  solvedProblemIds: string[];
}

export interface LeaderboardUser {
  id: string;
  name: string;
  score: number;
  solvedCount: number;
  createdAt: string;
}
