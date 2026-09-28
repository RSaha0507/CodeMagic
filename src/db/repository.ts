import { and, desc, eq, gt, inArray, lt } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { db } from './client';
import {
  type DatabaseUser,
  type Difficulty,
  type ProblemExample,
  type ProblemTestCase,
  type StarterCode,
  problemTags,
  problems,
  sessions,
  submissions,
  tags,
  userProblemProgress,
  users,
} from './schema';

export interface ProblemSeed {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: StarterCode;
  testCases: ProblemTestCase[];
  totalSubmissions?: number;
  acceptedSubmissions?: number;
}

export interface NewProblem extends Omit<ProblemSeed, 'id' | 'slug' | 'totalSubmissions' | 'acceptedSubmissions'> {
  id: string;
  authorId: string;
}

function tagIdentifier(name: string): string {
  return `tag-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
}

function acceptanceRate(total: number, accepted: number): string {
  return total === 0 ? '0%' : `${((accepted / total) * 100).toFixed(1)}%`;
}

function toIsoDate(value: Date): string {
  return value.toISOString();
}

async function tagsForProblemIds(problemIds: string[]): Promise<Map<string, string[]>> {
  const byProblem = new Map<string, string[]>();
  if (problemIds.length === 0) return byProblem;

  const rows = await db
    .select({ problemId: problemTags.problemId, tagName: tags.name })
    .from(problemTags)
    .innerJoin(tags, eq(problemTags.tagId, tags.id))
    .where(inArray(problemTags.problemId, problemIds));

  for (const row of rows) {
    const names = byProblem.get(row.problemId) ?? [];
    names.push(row.tagName);
    byProblem.set(row.problemId, names);
  }

  return byProblem;
}

async function assignTags(problemId: string, tagNames: string[]): Promise<void> {
  for (const tagName of [...new Set(tagNames.map(tag => tag.trim()).filter(Boolean))]) {
    const id = tagIdentifier(tagName);
    await db.insert(tags).values({ id, name: tagName }).onConflictDoNothing();
    await db.insert(problemTags).values({ problemId, tagId: id }).onConflictDoNothing();
  }
}

export async function getUserByEmail(email: string): Promise<DatabaseUser | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}

export async function getUserById(id: string): Promise<DatabaseUser | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function createUser(input: { id: string; email: string; name: string; passwordHash: string; score?: number }): Promise<DatabaseUser> {
  const [user] = await db.insert(users).values({ ...input, score: input.score ?? 0 }).returning();
  return user;
}

export async function solvedProblemIdsForUser(userId: string): Promise<string[]> {
  const rows = await db
    .select({ problemId: userProblemProgress.problemId })
    .from(userProblemProgress)
    .where(and(eq(userProblemProgress.userId, userId), eq(userProblemProgress.status, 'solved')));
  return rows.map(row => row.problemId);
}

export async function toPublicUser(user: DatabaseUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    score: user.score,
    solvedProblemIds: await solvedProblemIdsForUser(user.id),
  };
}

export async function createSession(userId: string, expiresAt: Date): Promise<string> {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  const id = randomUUID();
  await db.insert(sessions).values({ id, userId, expiresAt });
  return id;
}

export async function getSessionUser(sessionId: string): Promise<DatabaseUser | undefined> {
  const [row] = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return row?.user;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function listProblems(filters: { difficulty?: string; category?: string; search?: string; tag?: string }) {
  const problemRows = await db.select().from(problems);
  const tagsByProblem = await tagsForProblemIds(problemRows.map(problem => problem.id));
  const search = filters.search?.toLowerCase();

  return problemRows
    .map(problem => ({
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      category: problem.category,
      tags: tagsByProblem.get(problem.id) ?? [],
      acceptanceRate: acceptanceRate(problem.totalSubmissions, problem.acceptedSubmissions),
      totalSubmissions: problem.totalSubmissions,
      testCasesCount: problem.testCases.length,
    }))
    .filter(problem => !filters.difficulty || filters.difficulty === 'All' || problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase())
    .filter(problem => !filters.category || filters.category === 'All' || problem.category.toLowerCase() === filters.category.toLowerCase())
    .filter(problem => !filters.tag || problem.tags.some(tag => tag.toLowerCase() === filters.tag!.toLowerCase()))
    .filter(problem => !search || problem.title.toLowerCase().includes(search) || problem.category.toLowerCase().includes(search) || problem.tags.some(tag => tag.toLowerCase().includes(search)));
}

export async function getProblemDetail(problemId: string) {
  const [row] = await db
    .select({ problem: problems, authorName: users.name })
    .from(problems)
    .leftJoin(users, eq(problems.authorId, users.id))
    .where(eq(problems.id, problemId))
    .limit(1);

  if (!row) return undefined;
  const tagsByProblem = await tagsForProblemIds([problemId]);
  const problem = row.problem;

  return {
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    category: problem.category,
    tags: tagsByProblem.get(problem.id) ?? [],
    acceptanceRate: acceptanceRate(problem.totalSubmissions, problem.acceptedSubmissions),
    totalSubmissions: problem.totalSubmissions,
    description: problem.description,
    examples: problem.examples,
    constraints: problem.constraints,
    starterCode: problem.starterCode,
    testCases: problem.testCases.map((testCase, index) => ({
      id: index,
      input: testCase.input,
      expectedOutput: testCase.isHidden ? 'Hidden testcase' : testCase.expectedOutput,
      isHidden: Boolean(testCase.isHidden),
    })),
    author: row.authorName ?? undefined,
  };
}

export async function problemExists(problemId: string): Promise<boolean> {
  const [problem] = await db.select({ id: problems.id }).from(problems).where(eq(problems.id, problemId)).limit(1);
  return Boolean(problem);
}

export async function createProblem(input: NewProblem) {
  const [problem] = await db.insert(problems).values({
    id: input.id,
    title: input.title,
    slug: input.id,
    difficulty: input.difficulty,
    category: input.category,
    description: input.description,
    examples: input.examples,
    constraints: input.constraints,
    starterCode: input.starterCode,
    testCases: input.testCases,
    authorId: input.authorId,
  }).returning();
  await assignTags(problem.id, input.tags);
  return getProblemDetail(problem.id);
}

export async function seedProblems(seedProblems: ProblemSeed[]): Promise<void> {
  for (const problem of seedProblems) {
    await db.insert(problems).values({
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      category: problem.category,
      description: problem.description,
      examples: problem.examples,
      constraints: problem.constraints,
      starterCode: problem.starterCode,
      testCases: problem.testCases,
      totalSubmissions: problem.totalSubmissions ?? 0,
      acceptedSubmissions: problem.acceptedSubmissions ?? 0,
    }).onConflictDoNothing();
    await assignTags(problem.id, problem.tags);
  }
}

export async function seedDemoUser(input: { id: string; email: string; name: string; passwordHash: string; solvedProblemIds: string[]; score: number }): Promise<void> {
  await db.insert(users).values({
    id: input.id,
    email: input.email,
    name: input.name,
    passwordHash: input.passwordHash,
    score: input.score,
  }).onConflictDoNothing();

  for (const problemId of input.solvedProblemIds) {
    await db.insert(userProblemProgress).values({ userId: input.id, problemId, status: 'solved' }).onConflictDoNothing();
  }
}

export async function listSubmissions(userId: string, problemId?: string) {
  const conditions = [eq(submissions.userId, userId)];
  if (problemId) conditions.push(eq(submissions.problemId, problemId));
  const rows = await db
    .select({ submission: submissions, problemTitle: problems.title, userName: users.name })
    .from(submissions)
    .innerJoin(problems, eq(submissions.problemId, problems.id))
    .innerJoin(users, eq(submissions.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(submissions.createdAt))
    .limit(50);

  return rows.map(({ submission, problemTitle, userName }) => ({
    ...submission,
    problemTitle,
    userName,
    createdAt: toIsoDate(submission.createdAt),
  }));
}

export async function listLeaderboard() {
  const userRows = await db.select().from(users);
  const progressRows = await db.select({ userId: userProblemProgress.userId }).from(userProblemProgress).where(eq(userProblemProgress.status, 'solved'));
  const solvedCountByUser = new Map<string, number>();
  for (const progress of progressRows) solvedCountByUser.set(progress.userId, (solvedCountByUser.get(progress.userId) ?? 0) + 1);

  return userRows
    .map(user => ({ id: user.id, name: user.name, score: user.score, solvedCount: solvedCountByUser.get(user.id) ?? 0, createdAt: toIsoDate(user.createdAt) }))
    .sort((left, right) => right.score - left.score || right.solvedCount - left.solvedCount);
}
