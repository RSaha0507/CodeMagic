import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from 'drizzle-orm';
import { closeDatabase, db } from './client';

const migrationsDirectory = fileURLToPath(new URL('../../drizzle', import.meta.url));

export async function migrateDatabase(): Promise<void> {
  await db.execute(sql.raw('CREATE TABLE IF NOT EXISTS schema_migrations (name varchar(255) PRIMARY KEY, applied_at timestamp NOT NULL DEFAULT NOW())'));

  const files = (await readdir(migrationsDirectory)).filter(file => file.endsWith('.sql')).sort();
  const appliedRows = await db.execute<{ name: string }>(sql.raw('SELECT name FROM schema_migrations'));
  const applied = new Set(appliedRows.rows.map(row => row.name));

  for (const file of files) {
    if (applied.has(file)) continue;

    const migration = await readFile(path.join(migrationsDirectory, file), 'utf8');
    const statements = migration.split('--> statement-breakpoint').map(statement => statement.trim()).filter(Boolean);

    await db.transaction(async transaction => {
      for (const statement of statements) await transaction.execute(sql.raw(statement));
      await transaction.execute(sql`INSERT INTO schema_migrations (name) VALUES (${file})`);
    });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void migrateDatabase()
    .then(() => console.log('Database migrations applied.'))
    .catch(error => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    })
    .finally(() => closeDatabase());
}
