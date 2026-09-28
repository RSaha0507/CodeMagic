CREATE TABLE IF NOT EXISTS users (
  id varchar(96) PRIMARY KEY,
  email varchar(254) NOT NULL UNIQUE,
  name varchar(60) NOT NULL,
  password_hash varchar(255) NOT NULL,
  score integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS sessions (
  id varchar(96) PRIMARY KEY,
  user_id varchar(96) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS problems (
  id varchar(160) PRIMARY KEY,
  title varchar(120) NOT NULL,
  slug varchar(160) NOT NULL UNIQUE,
  difficulty varchar(12) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category varchar(80) NOT NULL,
  description text NOT NULL,
  examples jsonb NOT NULL,
  constraints jsonb NOT NULL,
  starter_code jsonb NOT NULL,
  test_cases jsonb NOT NULL,
  author_id varchar(96) REFERENCES users(id) ON DELETE SET NULL,
  total_submissions integer NOT NULL DEFAULT 0,
  accepted_submissions integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS tags (
  id varchar(96) PRIMARY KEY,
  name varchar(40) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS problem_tags (
  problem_id varchar(160) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  tag_id varchar(96) NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (problem_id, tag_id)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS user_problem_progress (
  user_id varchar(96) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id varchar(160) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  status varchar(16) NOT NULL DEFAULT 'solved',
  solved_at timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, problem_id)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS submissions (
  id varchar(96) PRIMARY KEY,
  problem_id varchar(160) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  user_id varchar(96) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language varchar(16) NOT NULL,
  code text NOT NULL,
  status varchar(32) NOT NULL,
  passed_count integer NOT NULL,
  total_test_cases integer NOT NULL,
  runtime_ms integer NOT NULL,
  memory_kb integer NOT NULL,
  error_detail text,
  created_at timestamp NOT NULL DEFAULT NOW()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS submissions_user_problem_created_idx ON submissions(user_id, problem_id, created_at DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS problem_tags_tag_id_idx ON problem_tags(tag_id);
