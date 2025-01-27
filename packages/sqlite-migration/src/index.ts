import Database from "better-sqlite3";
import betterLock from "better-lock";
import { MigrationAdapter, Migration } from "@yeti/migration-core";

export interface SQLiteConfig {
  path: string;
  walMode?: boolean;
}

export default function createSQLiteAdapter(
  config: SQLiteConfig
): MigrationAdapter {
  let db: Database.Database | null = null;
  const lock = new betterLock();

  return {
    async connect() {
      db = new Database(config.path);
      if (config.walMode) db.pragma("journal_mode = WAL");
    },

    async disconnect() {
      db?.close();
    },

    async ensureMigrationsTable() {
      db?.exec(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          hash TEXT NOT NULL,
          applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    },

    async getAppliedMigrations() {
      const rows =
        db
          ?.prepare(
            `
            SELECT id, name, hash, '' as content, '' as file
            FROM migrations
            ORDER BY id ASC
            `
          )
          .all() || [];

      return rows as Migration[];
    },

    async applyMigration(migration: Migration & { sql: string }) {
      const tx = db!.transaction(() => {
        db!.exec(migration.sql);
        db!
          .prepare(
            `
          INSERT INTO migrations (id, name, hash) 
          VALUES (?, ?, ?)
        `
          )
          .run(migration.id, migration.name, migration.hash);
      });
      tx.immediate();
    },

    async lock<T>(fn: () => Promise<T>): Promise<T> {
      return lock.acquire(async () => {
        return await fn();
      });
    },
  };
}
