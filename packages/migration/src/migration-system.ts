import { MigrationAdapter, Migration, MigrationResult } from './types';
import { FileLoader } from './file-loader';
import { MigrationValidator } from './migration-validator';

export class MigrationSystem {
    constructor(private adapter: MigrationAdapter) { }

    async migrate(path: string): Promise<MigrationResult> {
        await this.adapter.connect();

        try {
            return await this.adapter.lock(async () => {
                await this.adapter.ensureMigrationsTable();

                const files = FileLoader.loadMigrations(path);
                const applied = await this.adapter.getAppliedMigrations();

                MigrationValidator.validate(files, applied);
                const pending = files.slice(applied.length);

                for (const migration of pending) {
                    await this.applyMigration(migration);
                }

                return { applied: pending, pending: [] };
            });
        } finally {
            await this.adapter.disconnect();
        }
    }

    private async applyMigration(migration: Migration): Promise<void> {
        let sql = migration.content;

        if (migration.file.endsWith('.js')) {
            const module = await import(migration.file);
            sql = typeof module.generateSql === 'function'
                ? await module.generateSql()
                : module.generateSql;
        }

        await this.adapter.applyMigration({
            ...migration,
            sql: sql.replace(/^-- .*$/gm, '')
        });
    }
}