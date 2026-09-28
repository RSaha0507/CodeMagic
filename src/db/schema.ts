import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type SubmissionStatus = 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compilation Error';
export type ProblemExample = { input: string; output: string; explanation?: string };
export type ProblemTestCase = { input: string; expectedOutput: string; isHidden?: boolean };
export type StarterCode = Record<'javascript' | 'typescript' | 'python' | 'cpp' | 'java', string>;

export const users = pgTable('users', {
  id: varchar('id', { length: 96 }).primaryKey(),
  email: varchar('email', { length: 254 }).notNull().unique(),
  name: varchar('name', { length: 60 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  score: integer('score').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 96 }).primaryKey(),
  userId: varchar('user_id', { length: 96 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const problems = pgTable('problems', {
  id: varchar('id', { length: 160 }).primaryKey(),
  title: varchar('title', { length: 120 }).notNull(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  difficulty: varchar('difficulty', { length: 12 }).$type<Difficulty>().notNull(),
  category: varchar('category', { length: 80 }).notNull(),
  description: text('description').notNull(),
  examples: jsonb('examples').$type<ProblemExample[]>().notNull(),
  constraints: jsonb('constraints').$type<string[]>().notNull(),
  starterCode: jsonb('starter_code').$type<StarterCode>().notNull(),
  testCases: jsonb('test_cases').$type<ProblemTestCase[]>().notNull(),
  authorId: varchar('author_id', { length: 96 }).references(() => users.id, { onDelete: 'set null' }),
  totalSubmissions: integer('total_submissions').notNull().default(0),
  acceptedSubmissions: integer('accepted_submissions').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const tags = pgTable('tags', {
  id: varchar('id', { length: 96 }).primaryKey(),
  name: varchar('name', { length: 40 }).notNull().unique(),
});

export const problemTags = pgTable('problem_tags', {
  problemId: varchar('problem_id', { length: 160 }).notNull().references(() => problems.id, { onDelete: 'cascade' }),
  tagId: varchar('tag_id', { length: 96 }).notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, table => [primaryKey({ columns: [table.problemId, table.tagId] })]);

export const userProblemProgress = pgTable('user_problem_progress', {
  userId: varchar('user_id', { length: 96 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  problemId: varchar('problem_id', { length: 160 }).notNull().references(() => problems.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 16 }).notNull().default('solved'),
  solvedAt: timestamp('solved_at', { mode: 'date' }).notNull().defaultNow(),
}, table => [primaryKey({ columns: [table.userId, table.problemId] })]);

export const submissions = pgTable('submissions', {
  id: varchar('id', { length: 96 }).primaryKey(),
  problemId: varchar('problem_id', { length: 160 }).notNull().references(() => problems.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 96 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  language: varchar('language', { length: 16 }).notNull(),
  code: text('code').notNull(),
  status: varchar('status', { length: 32 }).$type<SubmissionStatus>().notNull(),
  passedCount: integer('passed_count').notNull(),
  totalTestCases: integer('total_test_cases').notNull(),
  runtimeMs: integer('runtime_ms').notNull(),
  memoryKb: integer('memory_kb').notNull(),
  errorDetail: text('error_detail'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  submissions: many(submissions),
  progress: many(userProblemProgress),
  authoredProblems: many(problems),
}));

export const problemsRelations = relations(problems, ({ one, many }) => ({
  author: one(users, { fields: [problems.authorId], references: [users.id] }),
  tags: many(problemTags),
  submissions: many(submissions),
  progress: many(userProblemProgress),
}));

export const tagsRelations = relations(tags, ({ many }) => ({ problemTags: many(problemTags) }));

export const problemTagsRelations = relations(problemTags, ({ one }) => ({
  problem: one(problems, { fields: [problemTags.problemId], references: [problems.id] }),
  tag: one(tags, { fields: [problemTags.tagId], references: [tags.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({ user: one(users, { fields: [sessions.userId], references: [users.id] }) }));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
  problem: one(problems, { fields: [submissions.problemId], references: [problems.id] }),
}));

export const progressRelations = relations(userProblemProgress, ({ one }) => ({
  user: one(users, { fields: [userProblemProgress.userId], references: [users.id] }),
  problem: one(problems, { fields: [userProblemProgress.problemId], references: [problems.id] }),
}));

export type DatabaseUser = typeof users.$inferSelect;
