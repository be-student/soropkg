import { Pool } from "pg";

// TODO(contributor): implement all database access methods
//
// Schema is in ../../schema.sql — run it against a local Postgres to get started.
// The Pool is configured from env vars; copy .env.example to .env to set them.

export const pool = new Pool({
  host:     process.env.DB_HOST     ?? "localhost",
  port:     Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME     ?? "soropkg",
  user:     process.env.DB_USER     ?? "postgres",
  password: process.env.DB_PASSWORD ?? "",
});

export async function query<T = unknown>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool.query(sql, params);
  return result.rows as T[];
}
