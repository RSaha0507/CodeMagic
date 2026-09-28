import { drizzle as drizzleNodePostgres } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

type Database = ReturnType<typeof drizzleNodePostgres<typeof schema>>;

let pool: Pool | undefined;
let close: () => Promise<void> = async () => {};
let database: Database;

if (process.env.NODE_ENV === 'test' && !process.env.DATABASE_URL) {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle: drizzlePglite } = await import('drizzle-orm/pglite');
  const client = new PGlite();
  database = drizzlePglite({ client, schema }) as unknown as Database;
  close = () => client.close();
} else {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL must be set to a PostgreSQL connection string.');
  pool = new Pool({ connectionString });
  database = drizzleNodePostgres({ client: pool, schema });
  close = () => pool!.end();
}

export const db = database;

export async function closeDatabase(): Promise<void> {
  await close();
}
