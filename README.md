# CodeMagic

CodeMagic is a development-stage coding-practice platform for deliberate algorithm practice, visual walkthroughs, and progress tracking. It uses a React multi-page interface, an Express API, PostgreSQL, and Drizzle ORM.

## Current architecture

```text
Browser (React + TypeScript + Tailwind/Shadcn components)
        |
        | same-origin JSON API + HttpOnly session cookie
        v
Express API (validation, authentication, CSRF checks, rate limits)
        |
        | Drizzle ORM
        v
PostgreSQL (users, sessions, problems, tags, progress, submissions)
```

Submitted code is deliberately **not executed** by the web process. The Run and Submit endpoints return an explicit unavailable response until a separately isolated judge worker is built. Running untrusted code in Express would be unsafe.

## Database model

PostgreSQL holds all durable platform data. Drizzle schema definitions live in [src/db/schema.ts](src/db/schema.ts); the reviewed SQL migration is [drizzle/0000_initial.sql](drizzle/0000_initial.sql).

```mermaid
erDiagram
  USERS ||--o{ SESSIONS : owns
  USERS ||--o{ SUBMISSIONS : creates
  USERS ||--o{ USER_PROBLEM_PROGRESS : tracks
  USERS o|--o{ PROBLEMS : authors
  PROBLEMS ||--o{ SUBMISSIONS : receives
  PROBLEMS ||--o{ USER_PROBLEM_PROGRESS : records
  PROBLEMS ||--o{ PROBLEM_TAGS : has
  TAGS ||--o{ PROBLEM_TAGS : labels

  USERS {
    varchar id PK
    varchar email UK
    varchar password_hash
    varchar name
    integer score
    timestamp created_at
  }
  SESSIONS {
    varchar id PK
    varchar user_id FK
    timestamp expires_at
    timestamp created_at
  }
  PROBLEMS {
    varchar id PK
    varchar slug UK
    varchar author_id FK
    varchar difficulty
    varchar category
    jsonb examples
    jsonb constraints
    jsonb starter_code
    jsonb test_cases
  }
  TAGS {
    varchar id PK
    varchar name UK
  }
  PROBLEM_TAGS {
    varchar problem_id FK
    varchar tag_id FK
  }
  USER_PROBLEM_PROGRESS {
    varchar user_id FK
    varchar problem_id FK
    varchar status
    timestamp solved_at
  }
  SUBMISSIONS {
    varchar id PK
    varchar user_id FK
    varchar problem_id FK
    varchar status
    varchar language
    timestamp created_at
  }
```

### Why this shape

- `users`, `sessions`, `submissions`, and `user_problem_progress` are relational because their ownership and lifetime must be enforced with foreign keys.
- `tags` and `problem_tags` implement a real many-to-many relationship, so a problem can be found by any topic without duplicated tag strings.
- `user_problem_progress` uses a composite key of `(user_id, problem_id)`, preventing duplicated solved-state records.
- Problem examples, constraints, starter code, and test cases are stored as `jsonb`. They are cohesive problem documents that are fetched and updated together; forcing each snippet or testcase into separate tables would add joins without improving platform behavior.
- Session and submission indexes support the current access patterns: session validation, a member’s recent submissions, and tag filtering.

## Data flow

| Capability | API | Persistent tables |
| --- | --- | --- |
| Register / sign in / sign out | `/api/auth/*` | `users`, `sessions`, `user_problem_progress` |
| Current profile | `/api/auth/me` | `users`, `sessions`, `user_problem_progress` |
| Catalog and problem workspace | `/api/problems` | `problems`, `tags`, `problem_tags`, `users` |
| Community problem creation | `POST /api/problems` | `problems`, `tags`, `problem_tags` |
| Submission history | `/api/submissions` | `submissions`, `users`, `problems` |
| Rankings | `/api/leaderboard` | `users`, `user_problem_progress` |

All catalog, workspace, roadmap, leaderboard, and submission data is member-only at both the interface and relevant API boundaries.

## Local setup

### 1. Create a PostgreSQL database

Install PostgreSQL 16+ locally or obtain a connection URL from a managed PostgreSQL provider. Create an empty database named `codemagic`.

### 2. Configure environment variables

Copy `.env.example` to `.env` and set both values:

```dotenv
PORT=3000
JWT_SECRET=replace-with-a-unique-secret-of-at-least-32-characters
DATABASE_URL=postgresql://codemagic:your-password@localhost:5432/codemagic
```

Never commit `.env` or a real connection URL.

### 3. Install, migrate, and seed

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

`npm run dev` also applies outstanding migrations and idempotently seeds the catalog before serving the app. This means a newly created local database is ready after the first successful start.

The development seed includes a non-production explorer account:

```text
Email:    demo@codemagic.local
Password: demo-password-2026
```

## Database commands

```bash
npm run db:migrate  # Apply reviewed SQL files in drizzle/
npm run db:seed     # Insert the catalog and local development demo account
```

Migrations are tracked in the database’s `schema_migrations` table and run transactionally. Add future reviewed `.sql` files to `drizzle/` with a sortable numeric prefix; do not edit a migration that has already been applied to a shared environment.

## Verification

```bash
npm run typecheck
npm test
npm run build
```

`npm test` uses PGlite, an embedded PostgreSQL engine, only in the test process. It applies the same SQL migration and tests the actual Drizzle-backed API paths without requiring a developer’s real database. Development uses the `DATABASE_URL` PostgreSQL connection through the standard `pg` driver.

## Current boundaries

- The app now requires PostgreSQL; it no longer keeps users, sessions, problems, or submissions in memory.
- Production startup remains intentionally disabled until a sandboxed code-execution service and deployment configuration are ready.
- Session cookies are HttpOnly and same-origin. Mutating requests require a CSRF header. Do not replace this with browser-stored JWTs.
