import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import test from 'node:test';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-only-secret-that-is-long-enough-to-be-valid';

const { closeDatabase } = await import('../src/db/client.ts');
const { migrateDatabase } = await import('../src/db/migrate.ts');
const { app } = await import('../server.ts');
const { seedDatabase } = await import('../server.ts');

async function readResponse(response: Response): Promise<Record<string, unknown> | null> {
  const text = await response.text();
  return text ? JSON.parse(text) as Record<string, unknown> : null;
}

test('API security boundaries', async () => {
  await migrateDatabase();
  await seedDatabase();
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const request = async (path: string, init: RequestInit = {}) => {
    const response = await fetch(`${baseUrl}${path}`, init);
    return { body: await readResponse(response), response };
  };

  try {
    const anonymousProblems = await request('/api/problems');
    assert.equal(anonymousProblems.response.status, 401);
    assert.equal(anonymousProblems.response.headers.get('x-content-type-options'), 'nosniff');

    const anonymousHistory = await request('/api/submissions');
    assert.equal(anonymousHistory.response.status, 401);

    const anonymousLeaderboard = await request('/api/leaderboard');
    assert.equal(anonymousLeaderboard.response.status, 401);

    const registration = await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'security-test@example.test',
        name: 'Security Tester',
        password: 'correct-horse-battery-staple',
      }),
    });
    assert.equal(registration.response.status, 201);
    assert.ok(registration.body);
    assert.equal('access_token' in registration.body, false);

    const csrfToken = registration.body.csrfToken;
    assert.equal(typeof csrfToken, 'string');
    const setCookie = registration.response.headers.get('set-cookie');
    assert.match(setCookie || '', /HttpOnly/i);
    assert.match(setCookie || '', /SameSite=Lax/i);
    const cookie = setCookie?.split(';', 1)[0];
    assert.ok(cookie);

    const createWithoutCsrf = await request('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie! },
      body: JSON.stringify({}),
    });
    assert.equal(createWithoutCsrf.response.status, 403);

    const problemPayload = {
      title: 'Secure test problem',
      difficulty: 'Easy',
      category: 'Array',
      tags: ['Array'],
      description: 'Return a supplied number so the validation path has a complete problem.',
      examples: [{ input: 'n = 1', output: '1' }],
      constraints: ['1 <= n <= 2'],
      starterCode: {
        javascript: 'function solve(n) { return n; }',
        typescript: 'function solve(n: number): number { return n; }',
        python: 'def solve(n):\n    return n',
        cpp: 'int solve(int n) { return n; }',
        java: 'int solve(int n) { return n; }',
      },
      testCases: [
        { input: '{"n":1}', expectedOutput: '1', isHidden: false },
        { input: '{"n":2}', expectedOutput: '2', isHidden: true },
      ],
    };
    const authenticatedHeaders = {
      'Content-Type': 'application/json',
      Cookie: cookie!,
      'X-CSRF-Token': csrfToken as string,
    };
    const memberProblems = await request('/api/problems', { headers: { Cookie: cookie! } });
    assert.equal(memberProblems.response.status, 200);
    assert.ok(Array.isArray(memberProblems.body));
    assert.equal(memberProblems.body.length, 6);
    const createWithCsrf = await request('/api/problems', {
      method: 'POST',
      headers: authenticatedHeaders,
      body: JSON.stringify(problemPayload),
    });
    assert.equal(createWithCsrf.response.status, 201);
    const returnedTestCases = createWithCsrf.body?.testCases as Array<{ expectedOutput: string }>;
    assert.equal(returnedTestCases[1].expectedOutput, 'Hidden testcase');

    const unsafeCode = 'throw new Error("This must never be executed");';
    const run = await request('/api/problems/two-sum/run', {
      method: 'POST',
      headers: authenticatedHeaders,
      body: JSON.stringify({ code: unsafeCode, language: 'javascript' }),
    });
    assert.equal(run.response.status, 503);
    assert.equal(run.body?.code, 'JUDGE_UNAVAILABLE');

    const submit = await request('/api/problems/two-sum/submit', {
      method: 'POST',
      headers: authenticatedHeaders,
      body: JSON.stringify({ code: unsafeCode, language: 'javascript' }),
    });
    assert.equal(submit.response.status, 503);

    const privateHistory = await request('/api/submissions', { headers: { Cookie: cookie! } });
    assert.equal(privateHistory.response.status, 200);
    assert.deepEqual(privateHistory.body, []);

    const leaderboard = await request('/api/leaderboard', { headers: { Cookie: cookie! } });
    assert.equal(leaderboard.response.status, 200);

    const logout = await request('/api/auth/logout', {
      method: 'POST',
      headers: { Cookie: cookie!, 'X-CSRF-Token': csrfToken as string },
    });
    assert.equal(logout.response.status, 204);

    const revokedHistory = await request('/api/submissions', { headers: { Cookie: cookie! } });
    assert.equal(revokedHistory.response.status, 401);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
    await closeDatabase();
  }
});
