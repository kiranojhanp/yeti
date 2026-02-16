import { MigrationAdapter, Migration, MigrationResult } from "./types";
import { FileLoader } from "./file-loader";
import { MigrationValidator } from "./migration-validator";

export class MigrationSystem {
  constructor(private adapter: MigrationAdapter) {}

  async migrate(path: string): Promise<MigrationResult> {
    await this.adapter.connect();

    try {
      return await this.adapter.lock(async () => {
        await this.adapter.ensureMigrationsTable();

        const files = FileLoader.loadMigrations(path);
        const applied = await this.adapter.getAppliedMigrations();

        MigrationValidator.validate(files, applied);
        const pending = files.slice(applied.length);

        // NOTE: Each migration runs in its own transaction intentionally.
        // DDL statements cannot be rolled back in many databases (e.g., MySQL, Oracle).
        for (const migration of pending) {
          await this.applyMigration(migration);
        }

        return { newlyApplied: pending, remaining: [] };
      });
    } finally {
      try {
        await this.adapter.disconnect();
      } catch {
        // Don't mask the original error
      }
    }
  }

  private async applyMigration(migration: Migration): Promise<void> {
    let sql = migration.content;

    if (migration.file.endsWith(".js")) {
      const module = await import(migration.file);
      const gen = module.generateSql ?? module.default?.generateSql;
      if (gen === undefined) {
        throw new Error(
          `Migration ${migration.file} does not export 'generateSql'`
        );
      }
      sql = typeof gen === "function" ? await gen() : gen;
    }

    if (typeof sql !== "string") {
      throw new Error(`Migration ${migration.name} produced non-string SQL`);
    }

    // Let the database handle SQL comments natively — don't strip them
    await this.adapter.applyMigration({ ...migration, sql });
  }
}
