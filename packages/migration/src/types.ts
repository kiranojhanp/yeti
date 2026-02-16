export interface Migration {
  id: number;
  name: string;
  content: string;
  hash: string;
  file: string;
}

export interface MigrationResult {
  newlyApplied: Migration[];
  remaining: Migration[];
}

export interface MigrationAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  lock<T>(fn: () => Promise<T>): Promise<T>;
  ensureMigrationsTable(): Promise<void>;
  getAppliedMigrations(): Promise<Migration[]>;
  applyMigration(migration: Migration & { sql: string }): Promise<void>;
}

export type AdapterConfig =
  | { type: "sqlite"; path: string; walMode?: boolean }
  | { type: "postgres"; connectionString: string };
